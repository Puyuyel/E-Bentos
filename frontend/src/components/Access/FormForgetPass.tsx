import { FluidForm, TextInput, Button } from "@carbon/react";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { verifyData } from "../util/verifiers";

import { forgetPassService } from "../../services/forgetPassService";
import { useResetPassStore } from "../../store/useResetPassStore";
import "../../styles/Access/ForgetPass.css";

const FormForgetPass: React.FC = () => {
  const navigate = useNavigate();
  const { setEmail } = useResetPassStore();
  const [loading, setLoading] = useState(false);
  const [emailFP, setEmailFP] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const isValidEmail = (email: string) => {
    return verifyData("email", email);
  };

  const handleChange = (emailElement: React.ChangeEvent<HTMLInputElement>) => {
    const email = emailElement.target.value.toString();
    setEmailFP(email);

    setIsInvalid(!isValidEmail(email));
  };

  const handleChangePassClick = async () => {
    setLoading(true);
    sessionStorage.setItem("allowedToVerification", "true");

    if (!emailFP) {
      setIsInvalid(!isValidEmail(emailFP));
      return;
    }

    // llamar al API para ver si el correo existe
    const llamadaAPI = await forgetPassService(emailFP);
    if (!llamadaAPI) {
      console.log(
        "llamadaAPI desde FormForgetPass: error?? no existe ",
        llamadaAPI
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    setEmail(emailFP);
    navigate("/codigo_verificacion");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="form-forgetpass-container">
      {/* PARTE 1: No tienes cuenta - Registrate  */}
      <div className="signup-area">
        <div className="signup-row">
          <div className="signup">
            <p>¿No tienes cuenta?</p>
          </div>

          <Button kind="secondary" onClick={handleRegister}>
            Regístrate aquí
          </Button>
        </div>
      </div>

      {/* PARTE 2: Olvidaste contra */}
      <h2 className="title">¿Olvidaste tu contraseña?</h2>

      {/* PARTE 2.1: CUADROS DE TEXTO */}
      <FluidForm className="fluid-form">
        <p>Ingresa tu correo:</p>
        <div className="input-email">
          <TextInput
            id="email"
            type="email"
            labelText="Correo electrónico"
            placeholder="Ej: ebento@ebento.com"
            onChange={handleChange}
            invalid={isInvalid}
            invalidText="Por favor, ingrese un correo válido."
          />
        </div>
      </FluidForm>

      <Button disabled={loading} onClick={handleChangePassClick}>
        Cambiar contraseña
      </Button>
    </div>
  );
};

export default FormForgetPass;
