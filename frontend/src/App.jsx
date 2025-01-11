import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Auth, Chat, ProfileUpdate } from "./pages";
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
    return <Spinner />;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={user ? <Navigate to={"/chat"} /> : <Auth />} />
        <Route path="/Chat" element={user ? <Chat /> : <Navigate to={"/"} />} />
        <Route
          path="/profile"
          element={user ? <ProfileUpdate /> : <Navigate to={"/"} />}
        />
      </Routes>
    </>
  );
};

export default App;
