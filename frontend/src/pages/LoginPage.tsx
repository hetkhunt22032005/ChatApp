import React from "react";
import { axiosInstance } from "../config/axios";

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    await axiosInstance.post("/auth/login", {
      username: "j_krishil",
      password: "123456As",
    });
  };
  return (
    <div>
      Login Page
      <button className="px-5 border-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
