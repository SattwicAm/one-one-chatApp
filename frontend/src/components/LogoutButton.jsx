import api from "../api";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      dispatch(setUser(null));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
