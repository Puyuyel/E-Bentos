import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { FluidForm, TextInput, Button } from "@carbon/react";

import { useResetPassStore } from "../../store/useResetPassStore";
import "../../styles/Access/FormCodigoVerificacion.css";

const FormCodigoVerificacion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { codigo, setCodigo } = useResetPassStore();
  const [isInvalid, setIsInvalid] = useState(false);

  {
    // E N   D I S C U S I Ó N   D E   I M P L E M E N T A C I Ó N
    /*const isValidCodigo = (codigo: string) => {
    // llamar al API
    return true;
  };*/
  }

  const handleChange = (codigoElement: React.ChangeEvent<HTMLInputElement>) => {
    const codigoChange = codigoElement.target.value.toString();
    const regex = /^[A-Z0-9]{6}$/;

    if (!regex.test(codigoChange) && codigoChange.length > 0) {
      setIsInvalid(true);
      setLoading(true); // para que no se pueda utilizar
      return;
    }
    setLoading(false);
    setIsInvalid(false);
    setCodigo(codigoChange);
  };

  const handleContinuarClick = () => {
    if (!(codigo.length > 0)) {
      setIsInvalid(true);
      return;
    }
    setLoading(true);
    // go to new password
    // Llamar al API y ver si de verdacito está bien.
    // DEPSUÉS IMPLEMENTAREMOS ESTA API: setIsInvalid(!isValidCodigo(codigo)); // esto sería una llamada ( EN DISCUSIÓN )
    if (!isInvalid) {
      setLoading(false);
      sessionStorage.setItem("allowedToNewpass", "true");
      navigate("/newpass");
    }
    setLoading(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleKeyDown = (evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key == "Enter" && !loading) {
      evento.preventDefault();
      handleContinuarClick();
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

      {/* PARTE 2: código de verificación */}
      <h2 className="title">Introduce el código de verificación</h2>

      {/* PARTE 2.1: CUADROS DE TEXTO */}
      <FluidForm className="fluid-form">
        <p>Ingresa el código de 6 dígitos recibido:</p>
        <div className="input-codigo">
          <TextInput
            id="codigo"
            type="text"
            labelText="Código"
            placeholder="Ej: ABC123"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            invalid={isInvalid}
            invalidText="El código ingresado es incorrecto."
          />
        </div>
      </FluidForm>

      <Button disabled={loading} onClick={handleContinuarClick} className="btn-continue">
        Continuar
      </Button>
    </div>
  );
};
export default FormCodigoVerificacion;
