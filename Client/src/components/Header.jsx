import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition duration-300"
            >
              MyApp
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-600 hover:text-indigo-600 transition duration-300"
            >
              Register
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-indigo-600 transition duration-300"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
