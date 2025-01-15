import { useCallback, useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";

const useChats = () => {
  const [loading, setLoading] = useState(false);
  const getChats = useCallback(async (receiverId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      console.log(response.data.messages);
    } catch (error) {
      if (axiosError(error)) {
        // Show the error message
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, getChats };
};

export default useChats;
