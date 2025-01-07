import { useState } from "react";
import { axiosError, axiosInstance } from "../config";
import { useAuthStore } from "../store";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      setUser(null, null);
      // Show the logout message
      // Path => response.data.message
      console.log(response.data);
    } catch (error) {
      if (axiosError(error)) {
        // Show the error message
        // Path => error.response.data.message
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
