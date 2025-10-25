import "@carbon/styles/css/styles.css";
import {
  FluidForm,
  TextInput,
  PasswordInput,
  Button,
  ProgressBar,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Tooltip,
} from "@carbon/react";
import { Help } from "@carbon/icons-react";
import "./../styles/FormRegister.css";

interface FormRegisterProps {
  onIniciarSesionClick: () => void;
}

const FormRegister: React.FC<FormRegisterProps> = ({
  onIniciarSesionClick,
}) => {
  return (
    <div className="form-register-container">
      {/* PARTE 1: Ya tienes cuenta? - Inicia sesión  */}
      <div className="signup-area">
        <div className="signup-row">
          <div className="signup">
            <p>¿Ya tienes cuenta?</p>
          </div>

          <Button kind="secondary" onClick={onIniciarSesionClick}>
            Inicia sesión aquí
          </Button>
        </div>
      </div>

      {/* PARTE 2: Registrar nuevo usuario */}
      <h2 className="title">Regístrate en e-Bentos</h2>

      {/* PARTE 2.1: CUADROS DE TEXTO */}
      <FluidForm className="fluid-form">
        <div className="input-email">
          <TextInput
            id="email"
            labelText="Correo electrónico"
            placeholder="Ej: ebento@ebento.com"
          />
        </div>

        <div className="pass-div">
          <PasswordInput
            id="password"
            labelText="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
          />
        </div>

        <div className="tooltip-progressbar-div">
          <Tooltip
            align="bottom"
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
          <ProgressBar
            className="progress-bar"
            helperText="Esperando una contraseña fuerte y segura"
          />
          {/* Cuando se pone una buena contraseña -> cambiar el helper */}
        </div>

        {/* No le pongo ningún div, porque no lo veo necesario hasta el momento */}

        <div className="nombres-div">
          <TextInput labelText="Nombres" placeholder="Ej: Juan" />
        </div>

        <div className="apellidos-div">
          <TextInput labelText="Apellido Paterno" placeholder="Ej: Perez" />
          <TextInput labelText="Apellido Materno" placeholder="Ej: Ruiz" />
        </div>

        <div className="dni-nacimiento-div">
          <TextInput
            className="dni"
            labelText="DNI"
            placeholder="Ej: 12345678"
          />
          <div>
            <p className="fecha-p">Fecha de nacimiento</p>
            <DatePicker datePickerType="single">
              <DatePickerInput
                id="date-picker-fluid"
                placeholder="mm/dd/aaaa"
              />
            </DatePicker>
          </div>
        </div>

        <div className="telf-gen-div">
          <TextInput
            className="telf"
            labelText="Teléfono"
            placeholder="Ej: 900000000"
          />
          <div className="gen-p-ddl">
            <p className="genero-p">Género</p>
            <Dropdown
              className="ddl-gen"
              helperText="This is some helper text"
              id="ddl-genero"
              invalidText="invalid selection"
              /* itemToString must return the display string for each item */
              itemToString={(item: any) =>
                item ? item.text ?? String(item) : ""
              }
              items={[
                { id: "M", text: "Masculino" },
                { id: "F", text: "Femenino" },
              ]}
              label="Seleccione su género"
            />
          </div>
        </div>

        <p className="label-mandatory">Todos los campos son obligatorios</p>
      </FluidForm>

      {/* PARTE 2.2: BOTÓN DE REGISTRAR USUARIO */}
      <div className="btn-register">
        <Button kind="primary">Registrar</Button>
      </div>
    </div>
  );
};

export default FormRegister;
