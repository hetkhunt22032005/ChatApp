import { useCallback, useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";
import useChatStore from "../store/ChatStore";

export const useContacts = () => {
  const [loading, setLoading] = useState(false);
  const { setContacts } = useChatStore();
  const getContacts = useCallback(
    async (timestamp) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/conversation/contacts?timestamp=${timestamp}`
        );
        setContacts(response.data.contacts);
      } catch (error) {
        if (axiosError(error)) {
          // Show the error message
          console.log(error.response.data);
        }
      } finally {
        setLoading(false);
      }
    },
    [setContacts]
  );

  return { loading, getContacts };
};
