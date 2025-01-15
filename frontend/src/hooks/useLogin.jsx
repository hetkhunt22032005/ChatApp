import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/AuthStore";
import { axiosError, axiosInstance } from "../config/axios";
import { toast } from "react-toastify";

const useLogin = () => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      setUser(response.data.user, response.data.token);
      toast.success(response.data.message, { autoClose: 3000 });
      navigate("/chat");
    } catch (error) {
      if (axiosError(error)) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return { login, loading };
};

export default useLogin;
