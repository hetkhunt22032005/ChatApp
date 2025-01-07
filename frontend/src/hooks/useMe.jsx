import { useCallback, useState } from "react";
import { useAuthStore } from "../store";
import { axiosInstance } from "../config";

const useMe = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user, response.data.token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return { checkAuth, loading };
};

export default useMe;
