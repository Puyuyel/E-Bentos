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
  Callout,
} from "@carbon/react";

import { Help } from "@carbon/icons-react";
import "../../styles/Access/FormRegister.css";
import {
  verifyData,
  contrasenhaIncluyeCaracterEspecial,
  contrasenhaIncluyeMayuscula,
  contrasenhaIncluyeMinuscula,
  contrasenhaIncluyeNumero,
} from "../util/verifiers";

import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { RegisterData } from "../../types/register.types";

interface FormRegisterProps {
  onIniciarSesionClick: () => void;
  onRegisterClick: () => void;
}

const STEP_PASS_COMPLETED = 20;

const FormRegister: React.FC<FormRegisterProps> = ({
  onIniciarSesionClick,
  onRegisterClick,
}) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);

  const [apellidoMat, setApeMat] = useState("");
  const [apellidoPat, setApePat] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidContrasenha, setIsInvalidContrasenha] = useState(false);
  const [estadoContra, setEstadoContra] = useState("active");
  const [valueContrasenha, setValueContrasenha] = useState(0);
  const [helperContra, sethelperContra] = useState(
    "Esperando una contraseña fuerte y segura"
  );
  const [isInvalidNombres, setIsInvalidNombres] = useState(false);
  const [isInvalidApePat, setIsInvalidApePat] = useState(false);
  const [isInvalidApeMat, setIsInvalidApeMat] = useState(false);
  const [isInvalidDNI, setIsInvalidDNI] = useState(false);
  const [isInvalidFechaNac, setIsInvalidFechaNac] = useState(false);
  const [isInvalidTelf, setIsInvalidTelf] = useState(false);
  const [isInvalidGen, setIsInvalidGen] = useState(false);
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

  const calcularProgresoContrasenha = (contrasenha: string): number => {
    let total: number = 0;
    if (contrasenha.length >= 8) total += STEP_PASS_COMPLETED;
    if (contrasenhaIncluyeNumero(contrasenha)) total += STEP_PASS_COMPLETED;
    if (contrasenhaIncluyeMayuscula(contrasenha)) total += STEP_PASS_COMPLETED;
    if (contrasenhaIncluyeMinuscula(contrasenha)) total += STEP_PASS_COMPLETED;
    if (contrasenhaIncluyeCaracterEspecial(contrasenha))
      total += STEP_PASS_COMPLETED;

    return total;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!verifyData(id, value)) {
      console.log("Funcionando en handle change");
      switch (id) {
        case "email":
          setIsInvalidEmail(true);
          break;
        case "contrasenha":
          setIsInvalidContrasenha(true);
          setValueContrasenha(calcularProgresoContrasenha(value));
          sethelperContra(
            `"Progreso: ${calcularProgresoContrasenha(
              value
            )} % - La contraseña no cumple con los requisitos, mírelos a la izquierda en el signo de interrogación."`
          );
          break;
        case "nombres":
          setIsInvalidNombres(true);
          break;
        case "dni":
          setIsInvalidDNI(true);
          break;
        case "telefono":
          setIsInvalidTelf(true);
          break;
      }
      return;
    }

    switch (id) {
      case "email":
        setIsInvalidEmail(false);
        break;
      case "contrasenha":
        setIsInvalidContrasenha(false);
        setEstadoContra("finished");
        sethelperContra(
          "La contraseña CUMPLE con los requisitos. Recuerde guardarla para recordarla."
        );
        break;
      case "nombres":
        setIsInvalidNombres(false);
        break;
      case "dni":
        setIsInvalidDNI(false);
        break;
      case "telefono":
        setIsInvalidTelf(false);
        break;
    }

    setFormData((prev: RegisterData) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (dates: Date[]) => {
    if (!dates || dates.length === 0) return;
    const date = dates[0];
    const fechaUTC = date.toISOString().split("T")[0];
    if (!verifyData("fechaNacimiento", fechaUTC)) {
      setIsInvalidFechaNac(true);
      return;
    }
    setIsInvalidFechaNac(false);
    setFormData((prev: RegisterData) => ({
      ...prev,
      fechaNacimiento: fechaUTC,
    }));
  };

  // update apellido paterno + materno and keep a single "apellidos" field in formData
  const handleApePatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPat = e.target.value;
    if (!verifyData("apePat", newPat)) {
      setIsInvalidApePat(true);
      return;
    }
    setIsInvalidApePat(false);
    setApePat(newPat);
    setFormData((prev: RegisterData) => ({
      ...prev,
      apellidos: `${newPat} ${apellidoMat}`.trim(),
    }));
  };

  const handleApeMatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMat = e.target.value;
    if (!verifyData("apeMat", newMat)) {
      setIsInvalidApeMat(true);
      return;
    }
    setIsInvalidApeMat(false);
    setApeMat(newMat);
    setFormData((prev: RegisterData) => ({
      ...prev,
      apellidos: `${apellidoPat} ${newMat}`.trim(),
    }));
  };

  const handleGeneroChange = ({ selectedItem }: { selectedItem: any }) => {
    if (!verifyData("genero", selectedItem?.text)) {
      setIsInvalidGen(true);
      return;
    }
    setIsInvalidGen(false);
    setFormData((prev: RegisterData) => ({
      ...prev,
      genero: `${selectedItem?.text}`.toUpperCase() || "",
    }));
  };

  const handleRegistrar = async () => {
    setLoading(true);
    try {
      if (
        isInvalidApeMat ||
        isInvalidApePat ||
        isInvalidContrasenha ||
        isInvalidDNI ||
        isInvalidEmail ||
        isInvalidFechaNac ||
        isInvalidGen ||
        isInvalidNombres
      ) {
        alert("Inserte los datos o arregle los errores antes de registrarse.");
        return;
      }
      const respuesta = await onRegisterClick(formData);
      if (respuesta >= 200) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // 2000 ms = 2 segundos
      }
    } catch (error: any) {
      console.error("Error en FormRegister.tsx: ", error);
    } finally {
      setLoading(false);
    }
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
            type="email"
            labelText="Correo electrónico"
            placeholder="Ej: ebento@ebento.com"
            onChange={handleChange}
            invalid={isInvalidEmail}
            invalidText="El correo ingresado no es válido."
          />
        </div>

        <div className="pass-div">
          <PasswordInput
            id="contrasenha"
            labelText="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
            onChange={handleChange}
            invalid={isInvalidContrasenha}
            invalidText="La contraseña ingresada es inválida."
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
            helperText={helperContra}
            status={estadoContra}
            value={valueContrasenha}
          />
          {/* Cuando se pone una buena contraseña -> cambiar el helper */}
        </div>

        {/* No le pongo ningún div, porque no lo veo necesario hasta el momento */}

        <div className="nombres-div">
          <TextInput
            id="nombres"
            type="text"
            labelText="Nombres"
            placeholder="Ej: Juan"
            onChange={handleChange}
            invalid={isInvalidNombres}
            invalidText="El nombre proporcionado no es válido."
          />
        </div>

        <div className="apellidos-div">
          <TextInput
            id="apePat"
            type="text"
            labelText="Apellido Paterno"
            placeholder="Ej: Perez"
            onChange={handleApePatChange}
            invalid={isInvalidApePat}
            invalidText="Apellido inválido"
          />
          <TextInput
            id="apeMat"
            labelText="Apellido Materno"
            placeholder="Ej: Ruiz"
            onChange={handleApeMatChange}
            invalid={isInvalidApeMat}
            invalidText="Apellido inválido"
          />
        </div>

        <div className="dni-nacimiento-div">
          <TextInput
            id="dni"
            type="number"
            className="dni"
            labelText="DNI"
            placeholder="Ej: 12345678"
            onChange={handleChange}
            invalid={isInvalidDNI}
            invalidText="DNI inválido"
          />
          <div>
            <p className="fecha-p">Fecha de nacimiento</p>
            <DatePicker
              onChange={handleDateChange}
              datePickerType="single"
              invalid={isInvalidFechaNac}
              invalidText="La fecha ingresada no es válida."
            >
              <DatePickerInput id="fechaNacimiento" placeholder="mm/dd/aaaa" />
            </DatePicker>
          </div>
        </div>

        <div className="telf-gen-div">
          <TextInput
            id="telefono"
            type="number"
            className="telf"
            labelText="Teléfono"
            placeholder="Ej: 900000000"
            onChange={handleChange}
            invalid={isInvalidTelf}
            invalidText="Teléfono inválido"
          />
          <div className="gen-p-ddl">
            <p className="genero-p">Género</p>
            <Dropdown
              className="ddl-gen"
              helperText="This is some helper text"
              id="genero"
              onChange={handleGeneroChange}
              invalid={isInvalidGen}
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
        <Button disabled={loading} onClick={handleRegistrar} kind="primary">
          Registrar
        </Button>
      </div>

      {showSuccess && (
        <Callout
          kind="success"
          statusIconDescription="notification"
          title="¡Registro exitoso!"
        />
      )}
    </div>
  );
};

export default FormRegister;
