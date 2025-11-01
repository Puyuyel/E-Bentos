import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  FluidForm,
  PasswordInput,
  Button,
  Tooltip,
  Callout,
} from "@carbon/react";
import { Help } from "@carbon/icons-react";

import { verifyData } from "../util/verifiers";

import { newPassService } from "../../services/newPassService";

import { useResetPassStore } from "../../store/useResetPassStore";

const FormNuevaContrasenia: React.FC = () => {
  const navigate = useNavigate();
  const { codigo, email } = useResetPassStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contrasenia, setContrasenia] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    const allowed = sessionStorage.getItem("allowedToNewpass");
    if (allowed !== "true") {
      navigate("/forgetpass");
    }
  }, [navigate]);

  const isValidContrasenia = (contrasenia: string) => {
    return verifyData("contrasenha", contrasenia);
  };

  const handleChange = (
    contraseniaElement: React.ChangeEvent<HTMLInputElement>
  ) => {
    const contrasenia = contraseniaElement.target.value.toString();
    if (!isValidContrasenia(contrasenia)) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);
    setContrasenia(contrasenia);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const llamadaAPI = await newPassService(email, codigo, contrasenia);
      if (llamadaAPI === 200) {
        setShowSuccess(true);
        console.log("Llamado api satisfactoria?", llamadaAPI);
        // Esperar 2-3 segundos antes de redirigir
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);
    } finally {
      setLoading(false);
    }
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

      {/* PARTE 2: nueva contra */}
      <h2 className="title">Introduce tu nueva contraseña</h2>

      {/* PARTE 2.1: CUADROS DE TEXTO */}
      <FluidForm className="fluid-form">
        <div className="input-contrasenia">
          <Tooltip
            align="top-left"
            label={
              <>
                mínimo 8 caracteres <br />
                mínimo 1 número <br />
                mínimo una mayúscula <br />
                mínimo una minúscula <br />
                un carácter especial (@ $ ! % ? &)
              </>
            }
          >
            <button type="button" className="btn-tooltip">
              <Help size={20} />
            </button>
          </Tooltip>
          <PasswordInput
            id="contrasenia"
            type="password"
            labelText="Nueva contraseña:"
            placeholder="Ingrese su nueva contraseña."
            onChange={handleChange}
            invalid={isInvalid}
            invalidText="La contrasenia ingresada no cumple con el estándar de seguridad."
          />
        </div>
      </FluidForm>

      <Button disabled={loading} onClick={handleClick}>
        Cambiar contraseña
      </Button>

      {showSuccess && (
        <Callout
          kind="success"
          statusIconDescription="notification"
          title="¡Contraseña cambiada exitosamente!"
          subtitle="Redirigiendo al login ..."
        />
      )}
    </div>
  );
};
export default FormNuevaContrasenia;
