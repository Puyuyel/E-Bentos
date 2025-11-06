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

const TIPOS_NOTIFICACION = {
  EXITO: "success",
  ERROR: "error",
};

const MENSAJE_NOTIFICACION = {
  EXITO:
    "¡Contrasenha cambiada correctamente! Redirigiendo al Inicio de Sesión ... ",
  ERROR: "¡Hubo un error en el sistema, por favor, inténtelo de nuevo!",
};

const FormNuevaContrasenia: React.FC = () => {
  const navigate = useNavigate();
  const { codigo, email } = useResetPassStore();
  const [showCallout, setShowCallout] = useState(false);
  const [typeNotify, setTypeNotify] = useState(TIPOS_NOTIFICACION.ERROR);
  const [titleNotify, setTitleNotify] = useState(MENSAJE_NOTIFICACION.ERROR);

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

  const handleNewPass = async () => {
    setShowCallout(false);
    setLoading(true);
    let success = false;
    try {
      const respuestaAPI = await newPassService(email, codigo, contrasenia);
      setShowCallout(true);
      setTitleNotify(MENSAJE_NOTIFICACION.EXITO);
      setTypeNotify(TIPOS_NOTIFICACION.EXITO);
      // Debugeando
      console.log("Llamado api satisfactoria?", respuestaAPI);
      // Esperar 2-3 segundos antes de redirigir
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      success = true;
    } catch (error: any) {
      setShowCallout(true);
      setTitleNotify(MENSAJE_NOTIFICACION.ERROR);
      setTypeNotify(TIPOS_NOTIFICACION.ERROR);
    }
    if (!success) setLoading(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleNewPass();
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
            onKeyDown={handleKeyDown}
            invalid={isInvalid}
            invalidText="La contrasenia ingresada no cumple con el estándar de seguridad."
          />
        </div>
      </FluidForm>

      <Button disabled={loading || isInvalid} onClick={handleNewPass}>
        Cambiar contraseña
      </Button>

      {showCallout && (
        <Callout
          kind={typeNotify}
          statusIconDescription="notification"
          title={titleNotify}
        />
      )}
    </div>
  );
};
export default FormNuevaContrasenia;
