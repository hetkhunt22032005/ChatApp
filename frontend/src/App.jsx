import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chat, Login, ProfileUpdate } from "./pages";
import useMe from "./hooks/useMe";
import { useAuthStore } from "./store";
import { Spinner } from "./components";

const App = () => {
  const { loading, checkAuth } = useMe();
  const { user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading && !user) {
    return <Spinner/>;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route path="/Chat" element={<Chat />} />
        <Route
          path="/profile"
          element={<ProfileUpdate />}
        />
      </Routes>
    </>
  );
};

export default App;
