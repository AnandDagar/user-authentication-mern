import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To track errors
  const [userData, setUserData] = useState(null); // To store user data
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    if (!token) {
      setError("Please log in to view your profile");
      return;
    }

    // Add basic token validation
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      if (tokenPayload.exp * 1000 < Date.now()) {
        setError("Your session has expired. Please log in again");
        localStorage.removeItem("token"); // Clear expired token
        return;
      }
    } catch (e) {
      setError("Invalid authentication token");
      localStorage.removeItem("token");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.data) {
        throw new Error("No data received from server");
      }
      setUserData(res.data.user);
      setError(null);
      console.log("User data received:", res.data);
      console.log("User info:", res.data.user);
    } catch (err) {
      console.log("Full error:", err); // Add detailed error logging
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching user data";

      setError(errorMessage);
      setUserData(null);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        // Optionally redirect to login page
        // window.location.href = '/login';
      }

      console.error("Error while fetching data:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  console.log("userData", userData);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {!loading && error && (
          <p className="text-center text-red-500">Error: {error}</p>
        )}
        {!loading && userData && (
          <>
            <p className="text-center text-xl font-semibold">
              Welcome, {userData.name}
            </p>
            <p className="text-center text-gray-600">Email: {userData.email}</p>
            <p className="text-center text-gray-600">ID: {userData.id}</p>
          </>
        )}
        {!loading && !userData && !error && (
          <p className="text-center text-gray-600">Profile</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
