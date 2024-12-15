import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login";
import SignUp from "./Components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home";
import ForgotPassword from "./Components/forgotpassword";
import Resetpassword from "./Components/resetpassword";
import Dasboared from "./Components/Dasboared";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route path="/dasboard" element={<Dasboared />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
