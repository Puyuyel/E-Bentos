import { FluidForm, TextInput, Button, Callout } from "@carbon/react";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { verifyData } from "../util/verifiers";

import { forgetPassService } from "../../services/forgetPassService";
import { useResetPassStore } from "../../store/useResetPassStore";
import "../../styles/Access/ForgetPass.css";

const LLAMADA_EXITOSA = 200;
const MENSAJES_NOTIFICACION = {
  FORMATO_INCORRECTO_EMAIL: "¡Complete el email adecuadamente!",
  LLAMADA_API_EXITOSA: "¡Código enviado correctamente! Redirigiendo ...",
};

const FormForgetPass: React.FC = () => {
  const navigate = useNavigate();
  const { setEmail } = useResetPassStore();
  const [loading, setLoading] = useState(false);
  const [emailFP, setEmailFP] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const [showCallout, setShowCallout] = useState(false);
  const [showTypeNotify, setShowTypeNotify] = useState("error");
  const [messageNotify, setMessageNotify] = useState(
    MENSAJES_NOTIFICACION.FORMATO_INCORRECTO_EMAIL
  );

  const handleRegister = () => {
    navigate("/register");
  };

  // También, verifica si el email es NULL
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
    setShowCallout(false);
    setShowTypeNotify("error");
    if (!isValidEmail(emailFP)) {
      setShowTypeNotify("error");
      setShowCallout(true);
      setMessageNotify(MENSAJES_NOTIFICACION.FORMATO_INCORRECTO_EMAIL);
      setLoading(false);
      return;
    }
    // llamar al API para ver si el correo existe
    let success = false;
    try {
      await forgetPassService(emailFP);
      // Si hay error, lo mandará al catch
      setShowCallout(true);
      setShowTypeNotify("success");
      setMessageNotify(MENSAJES_NOTIFICACION.LLAMADA_API_EXITOSA);
      setEmail(emailFP);
      sessionStorage.setItem("allowedToVerification", "true");
      // Espera 3 segundos antes de redirigir
      setTimeout(() => {
        navigate("/codigo_verificacion");
      }, 3000);
      success = true;
    } catch (e: any) {
      setShowCallout(true);
      setShowTypeNotify("error");
      setMessageNotify(e.message);
    }
    if (success) {
      setLoading(true);
    } else setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChangePassClick();
    }
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
            onKeyDown={handleKeyDown}
            invalid={isInvalid}
            invalidText="Por favor, ingrese un correo válido."
          />
        </div>
      </FluidForm>

      {showCallout && (
        <Callout
          kind={showTypeNotify}
          statusIconDescription="notification"
          title={messageNotify}
        />
      )}

      <Button disabled={loading} onClick={handleChangePassClick}>
        Cambiar contraseña
      </Button>
    </div>
  );
};

export default FormForgetPass;
