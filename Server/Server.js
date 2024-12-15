import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

//convert the data in json formate from client to server
app.use(express.json());
app.use(cookieParser());
//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// User Routes
app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
