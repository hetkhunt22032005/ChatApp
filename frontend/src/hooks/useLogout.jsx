import { useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";
import useAuthStore from "../store/AuthStore";
import { toast } from "react-toastify";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      setUser(null, null);
      toast.success(response.data.message);
    } catch (error) {
      if (axiosError(error)) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};
