import { useState } from "react";
import { useAuthStore } from "../store";
import { axiosError, axiosInstance } from "../config";

const useLogin = () => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      setUser(response.data.user, response.data.token);
      // Show the login message using toast
      // Path => response.data.message
    } catch (error) {
      if (axiosError(error)) {
        // Show the error message using toast
        // Path => error.response.data.message
      }
    } finally {
      setLoading(false);
    }
  };
  return { login, loading };
};

export default useLogin;
