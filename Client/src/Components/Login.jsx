import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(""); // Clear any previous error
    console.log("Login submitted: ", formData);

    axios
      .post("http://localhost:5000/api/users/login", formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error("Login failed");
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
          Login
        </button>
        <div
          className="login-link"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
          <p>
            Don't Have Account?
            <Link
              to="/signup"
              style={{
                fontWeight: "800",
                textDecoration: "none",
                fontSize: "20px",
                marginLeft: "10px",
              }}
            >
              SignUp
            </Link>
          </p>
        </div>
        <div style={{ clear: "both" }}></div>
      </form>
    </div>
  );
};

export default LoginForm;
