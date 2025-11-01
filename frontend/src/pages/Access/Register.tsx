// Register provisional ---
import EbentosBackground from "../../assets/concert-blue.png";
import EbentosLogo from "../../assets/ebentos-white-logo.png";

import { AuthLayout } from "../../layouts/AuthLayout.tsx";
import FormRegister from "../../components/Access/FormRegister.tsx";

import { useNavigate } from "react-router-dom";
import { register } from "../../services/registerService.ts";

import type { RegisterData } from "../../types/register.types.ts";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const handleIniciarSesion = () => {
    navigate("/login");
  };
  const handleRegisterClick = async (data: RegisterData) => {
    try {
      const respuesta = await register(data); // LLAMADA al API
      if (respuesta >= 200) {
        alert("Usuario creado correctamente.");
      }
      return respuesta;
    } catch (e: any) {
      alert("Hubo un error al momento de crear un USUARIO.");
    }
  };
  return (
    <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
      <FormRegister
        onIniciarSesionClick={handleIniciarSesion}
        onRegisterClick={handleRegisterClick}
      ></FormRegister>
    </AuthLayout>
  );
};

export default Register;
