import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";

export const useSignOut = () => {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return { logOut };
};