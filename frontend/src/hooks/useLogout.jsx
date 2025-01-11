import { useState } from "react";
import { axiosError, axiosInstance } from "../config";
import { useAuthStore } from "../store";
import { toast } from "react-toastify";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      setUser(null, null);
      toast.success(response.data.message);
      console.log(response.data);
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

export default useLogout;
