import EbentosIcon from '../assets/ebentos-white-logo.png'
import LoginBackground from '../assets/concert-blue.png'

import { AuthLayout } from "../layouts/AuthLayout";
import FormLogin from '../components/FormLogin'
import {useNavigate} from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate("/register");
  }

  return (
    <AuthLayout backgroundImage={LoginBackground} logo={EbentosIcon}>
      <FormLogin onRegisterClick={handleRegisterClick}/>
    </AuthLayout>
  )
}

export default Login;