import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dasboared = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/dasboard")
      .then((res) => {
        if (res.data.status === 200) {
          toast.success("Now you can access Dasboard");
        } else {
          toast.error("Unauthorized access");
          navigate("/login");
        }
      })
      .catch((err) => {
        toast.error("Please login first");
        navigate("/login");
      });
  }, []);
  return (
    <>
      <h1>Dasboared</h1>
    </>
  );
};

export default Dasboared;
