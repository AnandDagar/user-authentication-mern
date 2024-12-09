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

    // Validate token
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      if (tokenPayload.exp * 1000 < Date.now()) {
        setError("Your session has expired. Please log in again");
        localStorage.removeItem("token");
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
      setUserData(res.data.user);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching user data";

      setError(errorMessage);
      setUserData(null);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          User Profile Dashboard
        </h1>

        {loading && (
          <p className="text-center text-gray-600">Loading profile data...</p>
        )}

        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && userData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">Name</h2>
              <p className="text-gray-700">{userData.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                Email
              </h2>
              <p className="text-gray-700">{userData.email}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-yellow-700 mb-2">
                User ID
              </h2>
              <p className="text-gray-700">{userData.id}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold text-purple-700 mb-2">
                Account Created
              </h2>
              <p className="text-gray-700">
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {!loading && !userData && !error && (
          <p className="text-center text-gray-600">
            No profile data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
