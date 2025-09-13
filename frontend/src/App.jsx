import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/authSlice";
import api from "./api";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/ProfilePage";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me"); // ✅ FIXED: no double /api
        dispatch(setUser(res.data));
      } catch {
        // ✅ 401 is fine if not logged in
        console.log("Not logged in yet");
      }
    };

    // ✅ Skip calling /auth/me on login/register page
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      fetchUser();
    }
  }, [dispatch, location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/chat" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/chat" /> : <RegisterPage />}
      />
      <Route
        path="/chat"
        element={user ? <ChatPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
