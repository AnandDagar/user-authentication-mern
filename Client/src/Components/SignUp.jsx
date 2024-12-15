import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError(""); // Clear any previous error
    console.log("Signup submitted: ", formData);

    axios
      .post("http://localhost:5000/api/users/signup", formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success("User created successfully");
          navigate("/login");
        } else if (res.status === 400) {
          toast.error("User already exists");
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        console.log("Error in signup", err);
      });
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="form-input"
          />
        </div>
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
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Sign Up
        </button>
        <div className="login-link" style={{ float: "right" }}>
          <p>
            Have an account?
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

export default Signup;
