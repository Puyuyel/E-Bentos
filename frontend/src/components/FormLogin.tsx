import "@carbon/styles/css/styles.css";
import { Link, FluidForm, TextInput, PasswordInput, Button } from "@carbon/react";
// import { useState } from "react";
import "./../styles/FormLogin.css";

interface FormLoginProps{
    onRegisterClick: () => void
}

const FormLogin: React.FC<FormLoginProps> = ( {onRegisterClick} ) => {
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
                <TextInput id="email" labelText="Correo electrónico" placeholder="Ej: ebento@ebento.com" />
            </div>
            
            {/* No le pongo ningún div, porque no lo veo necesario hasta el momento */}
            <PasswordInput id="password" labelText="Contraseña" type="password" placeholder="Ingrese su contraseña" />
        </FluidForm>

        {/* PARTE 2.2: LINK de OLVIDASTE CONTRASEÑA */}
        <Link className="link-forgot-pass" href="#">
            <p>¿Olvidaste tu contraseña?</p>
        </Link>

        {/* PARTE 2.3: BOTÓN DE INICIO DE SESIÓN */}
        <div className="btn-login">
            <Button kind="primary">
                Inicia sesión
            </Button>
        </div>
            
      </div>
  );
}

export default FormLogin;