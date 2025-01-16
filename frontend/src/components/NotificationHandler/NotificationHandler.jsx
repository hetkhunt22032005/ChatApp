import { useEffect } from "react";
import useNotificationStore from "../../store/NotificationStore";
import { useLocation } from "react-router-dom";
import { ERROR, SUCCESS } from "../../config/constants";
import { toast } from "react-toastify";

export const NotificationHandler = () => {
  const location = useLocation();
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.route === location.pathname) {
        const toastOptions = {
          onClose: () => removeNotification(notification.id),
        };

        switch (notification.type) {
          case SUCCESS:
            toast.success(notification.message, toastOptions);
            break;
          case ERROR:
            toast.error(notification.message, toastOptions);
            break;
        }
      }
    });
  }, [removeNotification, notifications, location.pathname]);

  return null;
};
