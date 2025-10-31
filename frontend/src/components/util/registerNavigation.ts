import { useNavigate } from "react";

export const registerNavigation = () => {
  const navigate = useNavigate();
  navigate("/register");
};
