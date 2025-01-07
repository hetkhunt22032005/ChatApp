import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chat, Login, ProfileUpdate } from "./pages";
import useMe from "./hooks/useMe";
import { useAuthStore } from "./store";
const App = () => {
  const { loading, checkAuth } = useMe();
  const { user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={"/chat"} /> : <Login />}
        />
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
