import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Resetpassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password } = formData;

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    axios
      .post("http://localhost:5000/api/users/reset-password", {
        token,
        password,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Password reset successfully");
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
            toast.error("Failed to reset password");
          }
        } else if (err.request) {
          // Request made but no response
          toast.error("No response from server. Please check your connection.");
        } else {
          // Error in request setup
          toast.error("Error sending request. Please try again.");
        }
        console.error("Reset password error:", err);
      });
  };

  return (
    <div className="signup-container">
      <h2>Reset Password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label
            htmlFor=""
            style={{
              textAlign: "start",
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Password
          </label>
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
          Reset Password
        </button>
        <div style={{ clear: "both" }}></div>
      </form>
    </div>
  );
};

export default Resetpassword;
