import { useCallback, useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";

export const useChats = () => {
  const [loading, setLoading] = useState(false);
  const getChats = useCallback(async (receiverId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      console.log(response.data.messages);
    } catch (error) {
      if (axiosError(error)) {
        // Add the message to notification service
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, getChats };
};
