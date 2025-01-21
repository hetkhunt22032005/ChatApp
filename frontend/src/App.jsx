import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "./components";
import { useMe } from "./hooks/useMe";
import { Auth, Chat, ProfileUpdate } from "./pages";
import useAuthStore from "./store/AuthStore";

const App = () => {
  const { loading, checkAuth } = useMe();
  const { user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading && !user) {
    return <Spinner />;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={user ? <Navigate to={"/chat"} /> : <Auth />} />
        <Route path="/chat" element={user ? <Chat /> : <Chat />} />
        <Route
          path="/profile"
          element={user ? <ProfileUpdate /> : <ProfileUpdate />}
        />
      </Routes>
    </>
  );
};

export default App;
