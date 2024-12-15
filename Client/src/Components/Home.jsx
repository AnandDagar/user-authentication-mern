import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .get("http://localhost:5000/api/users/logout")
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/login");
          toast.success("Logout successful");
        }
      })
      .catch((err) => {
        toast.error("Logout failed");
        console.log(err);
      });
  };
  return (
    <>
      <div
        className="home-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#333",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          HOME PAGE
        </h1>
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Link
              to="/dasboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Dashboard
            </Link>
          </button>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#f44336",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Link
              to="/logout"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
              onClick={handleLogout}
            >
              Logout
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
