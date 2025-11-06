import React, { useState } from "react";

import "@carbon/styles/css/styles.css";
import {
  Link,
  FluidForm,
  TextInput,
  PasswordInput,
  Button,
} from "@carbon/react";
// import { useState } from "react";
import "../../styles/Access/FormLogin.css";

import type { LoginCredentials } from "../../types/auth.types";

interface FormLoginProps {
  onRegisterClick: () => void;
  onLoginClick: (credentials: LoginCredentials) => Promise<void>;
  notifyMessage: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({
  onRegisterClick,
  onLoginClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyParaph, setNotifyParaph] = useState("");
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    contrasenha: "",
  });

  const handleLoginClick = async () => {
    setLoading(true);
    try {
      console.log(formData);
      const email = formData.email.toString();
      const contra = formData.contrasenha.toString();
      if (!email || !contra) {
        console.log("Entré desde FormLogin");
        setShowNotify(true);
        setNotifyParaph("Complete la contraseña y el email correctamente.");
        setLoading(false);
        return;
      }
      try {
        await onLoginClick(formData);
      } catch (error: any) {
        setShowNotify(true);
        setNotifyParaph(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: LoginCredentials) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLoginClick();
    }
  };

  return (
    <div className="form-login-container">
      {/* PARTE 1: No tienes cuenta - Registrate  */}
      <div className="signup-area">
        <div className="signup-row">
          <div className="signup">
            <p>¿No tienes cuenta?</p>
          </div>

          <Button kind="secondary" onClick={onRegisterClick}>
            Regístrate aquí
          </Button>
        </div>
      </div>

      {/* PARTE 2: Inicia Sesión */}
      <h2 className="title">Inicia sesión en e-Bentos</h2>

      {/* PARTE 2.1: CUADROS DE TEXTO */}
      <FluidForm className="fluid-form">
        <div className="input-email">
          <TextInput
            id="email"
            type="email"
            labelText="Correo electrónico"
            placeholder="Ej: ebento@ebento.com"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* No le pongo ningún div, porque no lo veo necesario hasta el momento */}
        <PasswordInput
          id="contrasenha"
          labelText="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <p
          style={{ visibility: showNotify ? "visible" : "hidden" }}
          className="notify-p"
        >
          {notifyParaph}
        </p>
      </FluidForm>

      {/* PARTE 2.2: LINK de OLVIDASTE CONTRASEÑA */}
      <Link className="link-forgot-pass" href="/forgetpass">
        <p>¿Olvidaste tu contraseña?</p>
      </Link>

      {/* PARTE 2.3: BOTÓN DE INICIO DE SESIÓN */}
      <div className="btn-login">
        <Button disabled={loading} onClick={handleLoginClick} kind="primary">
          Inicia sesión
        </Button>
      </div>
    </div>
  );
};

export default FormLogin;
