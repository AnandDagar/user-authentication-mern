import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email } = formData;

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");

    axios
      .post("http://localhost:5000/api/users/forgot-password", formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Password reset email sent");
          navigate("/login");
        }
      })
      .catch((err) => {
        // More detailed error handling
        if (err.response) {
          // Server responded with error
          if (err.response.status === 500) {
            toast.error("Server error. Please try again later.");
          } else if (err.response.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Failed to send reset email");
          }
        } else if (err.request) {
          // Request made but no response
          toast.error("No response from server. Please check your connection.");
        } else {
          // Error in request setup
          toast.error("Error sending request. Please try again.");
        }
        console.error("Forgot password error:", err);
      });
  };

  return (
    <div className="signup-container">
      <h2>Forgot Password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Reset Password
        </button>
        <div className="login-link" style={{ float: "right" }}>
          <p>
            Remember your password?
            <Link
              to="/login"
              style={{
                fontWeight: "800",
                textDecoration: "none",
                fontSize: "20px",
                marginLeft: "10px",
              }}
            >
              Login
            </Link>
          </p>
        </div>
        <div style={{ clear: "both" }}></div>
      </form>
    </div>
  );
};

export default ForgotPassword;
