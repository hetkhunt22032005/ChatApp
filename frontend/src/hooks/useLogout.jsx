import { useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";
import useAuthStore from "../store/AuthStore";
import useNotificationStore from "../store/NotificationStore";
import { ERROR, SUCCESS } from "../config/constants";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      addNotification({
        id: Date.now(),
        type: SUCCESS,
        message: response.data.message,
        route: "/",
      });
      setUser(null, null);
    } catch (error) {
      if (axiosError(error)) {
        addNotification({
          id: Date.now(),
          type: ERROR,
          message:
            error.response?.data?.message || "Something went wrong.",
          route: window.location.pathname,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};
