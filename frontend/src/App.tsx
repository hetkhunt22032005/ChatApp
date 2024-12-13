import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser, "Error");

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <HomePage></HomePage>
            ) : (
              <Navigate to={"/login"}></Navigate>
            )
          }
        ></Route>
        <Route
          path="/signup"
          element={
            !authUser ? (
              <SignUpPage></SignUpPage>
            ) : (
              <Navigate to={"/"}></Navigate>
            )
          }
        ></Route>
        <Route
          path="/login"
          element={
            !authUser ? <LoginPage></LoginPage> : <Navigate to={"/"}></Navigate>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            !authUser ? (
              <ProfilePage></ProfilePage>
            ) : (
              <Navigate to={"/"}></Navigate>
            )
          }
        ></Route>
        <Route path="/settings" element={<SettingsPage></SettingsPage>}></Route>
      </Routes>
    </div>
  );
}

export default App;
