// Register provisional ---
import EbentosBackground from "../assets/concert-blue.png";
import EbentosLogo from "../assets/ebentos-white-logo.png";

import { AuthLayout } from "../layouts/AuthLayout";
import FormRegister from "../components/FormRegister.tsx";

import { useNavigate } from "react-router-dom";
import { register } from "../services/registerService.ts";

import type { RegisterData } from "../types/register.types";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const handleIniciarSesion = () => {
        navigate("/login");
    }
    const handleRegisterClick = async (data: RegisterData) => {
        try{
            const user = await register(data);
            alert("Usuario creado correctamente.");
        }
        catch(e: any){
            alert('Hubo un error al momento de crear la contrasenia');
        }
    }
    return (
        <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
            <FormRegister onIniciarSesionClick={handleIniciarSesion} onRegisterClick={handleRegisterClick}></FormRegister>
        </AuthLayout>
    )
}

export default Register;