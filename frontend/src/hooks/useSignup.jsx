import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/AuthStore";
import { axiosError, axiosInstance } from "../config/axios";
import useNotificationStore from "../store/NotificationStore";
import { DEFAULT_MESSAGE, ERROR, SUCCESS } from "../config/constants";

export const useSignup = () => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const signup = async ({ fullname, username, password, gender }) => {

    setLoading(true);
    gender=gender.toLowerCase();
    const success = validateProps(fullname, username, password, gender, addNotification);
    console.log(success);
    if (!success) {
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/signup", {
        fullname,
        username,
        password,
        gender,
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
          message:
            error.response?.data?.message || DEFAULT_MESSAGE,
          route: window.location.pathname,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

function validateProps(fullname, username, password, gender, addNotification) {
  
  if (
    !validFullName(fullname, addNotification) ||
    !validUsername(username, addNotification) ||
    !validPassword(password, addNotification) ||
    !validGender(gender)
  ) {
    return false;
  }
  return true;
}

function validFullName(fullname, addNotification) {
  const parserFullName = String(fullname);

  if (parserFullName.length < 6) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Full name must be at least 6 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  if (parserFullName.length > 255) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Full name cannot exceed 255 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  return true;
}

function validUsername(username, addNotification) {
  const parsedUsername = String(username);
  const regex = /^[a-zA-Z0-9_]+$/;

  if (parsedUsername.length < 3) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Username must be at least 3 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  if (parsedUsername.length > 50) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Username cannot exceed 50 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  if (!regex.test(parsedUsername)) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Username can only contain letters, numbers, and underscores.",
      route: window.location.pathname,
    });
    return false;
  }
  return true;
}

function validPassword(password, addNotification) {
  const parsedPassword = String(password);
  const regex1 = /[A-Z]/;
  const regex2 = /[a-z]/;
  const regex3 = /[0-9]/;
  if (parsedPassword.length < 8) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Password must be at least 8 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  if (parsedPassword.length > 20) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Password cannot exceed 20 characters.",
      route: window.location.pathname,
    });
    return false;
  }
  if (!regex1.test(parsedPassword)) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Password must contain at least one uppercase letter.",
      route: window.location.pathname,
    });
    return false;
  }
  if (!regex2.test(parsedPassword)) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Password must contain at least one lowercase letter.",
      route: window.location.pathname,
    });
    return false;
  }
  if (!regex3.test(parsedPassword)) {
    addNotification({
      id: Date.now(),
      type: ERROR,
      message: "Password must contain at least one number.",
      route: window.location.pathname,
    });
    return false;
  }
  return true;
}

function validGender(gender) {
  const parsedGender = String(gender);
  const validGenders = ["male", "female"];
  if (!validGenders.includes(parsedGender)) {
    return false;
  }
  return true;
}
