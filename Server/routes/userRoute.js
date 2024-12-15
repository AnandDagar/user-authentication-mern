import express from "express";
import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists first
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user if they don't exist
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in cookie and send response
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: '"Password Reset" <noreply@example.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Please click the link below to reset your password:</p>
        <a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Password reset email sent to:", email); // Added console log to track email recipient
      res.status(200).json({ message: "Password reset email sent" });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      res.status(500).json({
        message: "Error sending email",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Error in forgot password process:", error);
    res.status(500).json({
      message: "Error processing forgot password request",
      error: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset link has expired" });
    }
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error while verifying token" });
  }
};

// Protected dashboard route
router.get("/dasboard", verifyToken, async (req, res) => {
  try {
    // Return success response with status
    res.status(200).json({
      status: 200,
      message: "Successfully accessed dashboard",
      userId: req.userId,
    });
  } catch (error) {
    console.error("Error accessing dashboard:", error);
    res.status(500).json({
      status: 500,
      message: "Server error while accessing dashboard",
    });
  }
});

//logout route
router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: 200, message: "Logout successful" });
});

export default router;
