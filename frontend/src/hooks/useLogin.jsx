import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/AuthStore";
import { axiosError, axiosInstance } from "../config/axios";
import useNotificationStore from "../store/NotificationStore";
import { DEFAULT_MESSAGE, ERROR, SUCCESS } from "../config/constants";

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      setUser(response.data.user, response.data.token);
      addNotification({
        id: Date.now(),
        type: SUCCESS,
        message: response.data.message,
        route: "/chat",
      });
      navigate("/chat");
    } catch (error) {
      if (axiosError(error)) {
        addNotification({
          id: Date.now(),
          type: ERROR,
          message: error.response?.data?.message || DEFAULT_MESSAGE,
          route: window.location.pathname,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return { login, loading };
};
