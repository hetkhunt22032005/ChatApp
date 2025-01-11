import { useState } from "react";
import { useAuthStore } from "../store";
import { axiosError, axiosInstance } from "../config";
import { toast } from "react-toastify";

const useSignup = () => {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const signup = async ({ fullname, username, password, gender }) => {
    setLoading(true);
    const success = validateProps(fullname, username, password, gender);
    if (!success) {
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
      toast.success(response.data.message);
    } catch (error) {
      if (axiosError(error)) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

function validateProps(fullname, username, password, gender) {
  if (
    !validFullName(fullname) ||
    !validUsername(username) ||
    !validPassword(password) ||
    !validGender(gender)
  ) {
    return false;
  }
  return true;
}

function validFullName(fullname) {
  const parserFullName = String(fullname);
  if (parserFullName.length < 6) {
    toast.error("Full name must be atleast 6 characters long");
    return false;
  }
  if (parserFullName.length > 255) {
    toast.error("Full name cannot be more than 255 characters");
    return false;
  }
  return true;
}

function validUsername(username) {
  const parsedUsername = String(username);
  const regex = /^[a-zA-Z0-9_]+$/;
  if (parsedUsername.length < 3) {
    toast.error("Username must be at least 3 characters long");
    return false;
  }
  if (parsedUsername.length > 50) {
    toast.error("Username cannot be more than 50 characters");
    return false;
  }
  if (!regex.test(parsedUsername)) {
    toast.error("Username can only contain letters, numbers, and underscores");
    return false;
  }
  return true;
}

function validPassword(password) {
  const parsedPassword = String(password);
  const regex1 = /[A-Z]/;
  const regex2 = /[a-z]/;
  const regex3 = /[0-9]/;
  if (parsedPassword.length < 8) {
    toast.error("Passworrd must be atleast 8 characters long");
    return false;
  }
  if (parsedPassword.length > 20) {
    toast.error("Password cannot be more than 20 characters long");
    return false;
  }
  if (!regex1.test(parsedPassword)) {
    toast.error("Password must contain at least one uppercase letter");
    return false;
  }
  if (!regex2.test(parsedPassword)) {
    toast.error("Password must contain at least one lowercase letter");
    return false;
  }
  if (!regex3.test(parsedPassword)) {
    toast.error("Password must contain at least one digit");
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

export default useSignup;
