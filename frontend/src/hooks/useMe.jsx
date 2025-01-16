import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import  useAuthStore  from "../store/AuthStore";
import { axiosInstance } from "../config/axios";

export const useMe = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user, response.data.token);
      navigate("/chat");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  return { checkAuth, loading };
};
