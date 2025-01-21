import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axios";
import useAuthStore from "../store/AuthStore";

export const useMe = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response?.data?.user && response?.data?.token) {
        setUser(response.data.user, response.data.token);
        // navigate("/chat");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.log(error);
      console.log("Failed to authenticate: ", error.message);
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  return { checkAuth, loading };
};
