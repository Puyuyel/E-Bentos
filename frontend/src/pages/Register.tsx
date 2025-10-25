// Register provisional ---
import { AuthLayout } from "../layouts/AuthLayout";
import FormRegister from "../components/FormRegister.tsx";
import EbentosBackground from "../assets/concert-blue.png";
import EbentosLogo from "../assets/ebentos-white-logo.png";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const handleIniciarSesion = () => {
        navigate("/login");
    }
    return (
        <AuthLayout backgroundImage={EbentosBackground} logo={EbentosLogo}>
            <FormRegister onIniciarSesionClick={handleIniciarSesion}></FormRegister>
        </AuthLayout>
    )
}

export default Register;