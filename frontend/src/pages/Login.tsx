import EbentosIcon from "../assets/ebentos-white-logo.png";
import LoginBackground from "../assets/concert-blue.png";

import { AuthLayout } from "../layouts/AuthLayout";
import FormLogin from "../components/FormLogin";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import type { LoginCredentials } from "../types/auth.types";
import { useAuthStore } from "../store/useAuthStore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = async (credentials: LoginCredentials) => {
    try {
      const rol = await login(credentials);
      console.log(rol);
      switch (rol) {
        case "ADMIN":
          alert('Administrador logueado ¡¡SATISFACTORIAMENTE!!.')
          navigate("/admin/gestionar-productora");
          break;
        case "CLIENTE":
          alert("CLIENTE EXITOSAMENTE LOGEADO");
          navigate("/admin/gestionar-productora");
          break;
        case "PRODUCTORA":
          navigate("/productora/home");
          break;
        case "GESTOR LOCAL":
          navigate("/gestorlocal/home");
          break;
        case "DUENHO LOCAL":
          navigate("/duenholocal/home");
          break;
        case "TAQUILLERO":
          navigate("/taquillero/home");
          break;
        default:
          navigate("/"); // por defecto
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <AuthLayout backgroundImage={LoginBackground} logo={EbentosIcon}>
      <FormLogin
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />
    </AuthLayout>
  );
};

export default Login;
