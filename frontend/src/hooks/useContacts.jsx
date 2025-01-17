import { useCallback, useState } from "react";
import { axiosError, axiosInstance } from "../config/axios";
import useChatStore from "../store/ChatStore";
import useNotificationStore from "../store/NotificationStore";
import { DEFAULT_MESSAGE, ERROR, SUCCESS} from "../config/constants";

export const useContacts = () => {

  const [loading, setLoading] = useState(false);
  const { setContacts } = useChatStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const getContacts = useCallback(
    async (timestamp) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/conversation/contacts?timestamp=${timestamp}`
        );
        addNotification({
          id: Date.now(),
          type: SUCCESS,
          message: response.data.message,
          route: "/",
        });
        setContacts(response.data.contacts);
      } catch (error) {
        if (axiosError(error)) {
          addNotification({
            id: Date.now(),
            type: ERROR,
            message: error.response?.data?.message || DEFAULT_MESSAGE,
            route: window.location.pathname,
          });
          // console.log(error.response.data);
        }
      } finally {
        setLoading(false);
      }
    },
    [setContacts, addNotification]
  );

  return { loading, getContacts };
};
