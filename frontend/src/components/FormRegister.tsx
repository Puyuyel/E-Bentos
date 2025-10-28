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

import React, { useState } from "react";
import { useEffect } from "react";

import type { RegisterData } from "../types/register.types";

interface FormRegisterProps {
  onIniciarSesionClick: () => void;
  onRegisterClick: () => void;
}

const FormRegister: React.FC<FormRegisterProps> = ({
  onIniciarSesionClick,
  onRegisterClick,
}) => {
  const [apellidoMat, setApeMat] = useState("");
  const [apellidoPat, setApePat] = useState("");
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    contrasenha: "",
    nombres: "",
    nombreRol: "CLIENTE",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    telefono: 0,
    genero: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: RegisterData) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (dates: Date[]) => {
    if (!dates || dates.length === 0) return;
    const date = dates[0];
    const fechaUTC = date.toISOString().split("T")[0];
    setFormData((prev: RegisterData) => ({
      ...prev,
      fechaNacimiento: fechaUTC,
    }));
  };

  // update apellido paterno + materno and keep a single "apellidos" field in formData
  const handleApePatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPat = e.target.value;
    setApePat(newPat);
    setFormData((prev: RegisterData) => ({
      ...prev,
      apellidos: `${newPat} ${apellidoMat}`.trim(),
    }));
  };

  const handleApeMatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMat = e.target.value;
    setApeMat(newMat);
    setFormData((prev: RegisterData) => ({
      ...prev,
      apellidos: `${apellidoPat} ${newMat}`.trim(),
    }));
  };

  const handleGeneroChange = ({ selectedItem }: { selectedItem: any }) => {
    setFormData((prev: RegisterData) => ({
      ...prev,
      genero: `${selectedItem?.text}`.toUpperCase() || "",
    }));
  };

  useEffect(() => {
    if (formData.fecha_nac) {
      console.log("Fecha (objeto Date):", formData.fecha_nac);
      console.log(
        "Fecha formateada:",
        formData.fecha_nac.toISOString().split("T")[0]
      );
    }
  }, [formData]);

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
            onChange={handleChange}
          />
        </div>

        <div className="pass-div">
          <PasswordInput
            id="contrasenha"
            labelText="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            onChange={handleChange}
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
          <TextInput
            id="nombres"
            labelText="Nombres"
            placeholder="Ej: Juan"
            onChange={handleChange}
          />
        </div>

        <div className="apellidos-div">
          <TextInput
            id="apePat"
            labelText="Apellido Paterno"
            placeholder="Ej: Perez"
            onChange={handleApePatChange}
          />
          <TextInput
            id="apeMat"
            labelText="Apellido Materno"
            placeholder="Ej: Ruiz"
            onChange={handleApeMatChange}
          />
        </div>

        <div className="dni-nacimiento-div">
          <TextInput
            id="dni"
            className="dni"
            labelText="DNI"
            placeholder="Ej: 12345678"
            onChange={handleChange}
          />
          <div>
            <p className="fecha-p">Fecha de nacimiento</p>
            <DatePicker onChange={handleDateChange} datePickerType="single">
              <DatePickerInput id="fechaNacimiento" placeholder="mm/dd/aaaa" />
            </DatePicker>
          </div>
        </div>

        <div className="telf-gen-div">
          <TextInput
            id="telefono"
            className="telf"
            labelText="Teléfono"
            placeholder="Ej: 900000000"
            onChange={handleChange}
          />
          <div className="gen-p-ddl">
            <p className="genero-p">Género</p>
            <Dropdown
              className="ddl-gen"
              helperText="This is some helper text"
              id="genero"
              onChange={handleGeneroChange}
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
        <Button onClick={() => onRegisterClick(formData)} kind="primary">
          Registrar
        </Button>
      </div>
    </div>
  );
};

export default FormRegister;
