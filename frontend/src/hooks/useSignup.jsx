import { useState } from "react";
import { useAuthStore } from "../store";
import { axiosError, axiosInstance } from "../config";

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
      // Show the signup message
      // Path => response.data.message
    } catch (error) {
      if (axiosError(error)) {
        // Show the error message
        // Path => error.response.data.message
      }
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

// Updating the function according to backend inputs and show the error here
function validateProps(fullname, username, password, gender) {
  if (!fullname || !username || !password || !gender) {
    return false;
  }
  return true;
}

export default useSignup;
