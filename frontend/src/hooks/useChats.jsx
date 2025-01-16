import { useCallback, useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";
import useNotificationStore from "../store/NotificationStore";
import { DEFAULT_MESSAGE, ERROR, SUCCESS } from "../config/constants";

export const useChats = () => {
  const [loading, setLoading] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const getChats = useCallback(async (receiverId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      addNotification({
        id: Date.now(),
        type: SUCCESS,
        message: response.data.message,
        route: "/",
      });
      console.log(response.data.messages);
    } catch (error) {
      if (axiosError(error)) {

        addNotification({
          id: Date.now(),
          type: ERROR,
          message:
            error.response?.data?.message || DEFAULT_MESSAGE,
          route: window.location.pathname,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  return { loading, getChats };
};
