"use client";
import {
  Column,
  Grid,
  Form,
  TextInput,
  Stack,
  Select,
  SelectItem,
  FormItem,
  FileUploaderDropContainer,
  FormGroup,
  FileUploaderItem,
} from "@carbon/react";
import { useRef, useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BottomButtons from "../../../components/Gestion/BottomButtons";
import SidebarGestor from "../../../components/SidebarGestor.tsx";

import { BlobServiceClient } from "@azure/storage-blob";
import agregarLocal from "../../../services/LocalesServices/agregarLocal.ts";
import uploadImage from "../../../services/LocalesServices/uploadImageService.ts";
import { listarDepartamentos, listarProvincias, listarDistritos } from "../../../services/ubicacionService.ts";

interface Lookup {
  value: string;
  label: string;
}

import type { FormDataLocal } from "../../../types/locales.types.ts";
import getDuenhoId from "../../../services/LocalesServices/getDuenhoId.ts";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export default function OwnerCRUD() {
  const navigate = useNavigate();
  const methods = useForm<FormDataLocal>({
    defaultValues: {
      nombre: "",
      direccion: "",
      foto: "",
      aforo: 0,
      tipoLocal: "",
      gestorId: 32, // CAMBIARLO pq' está HARDCODEADO
    },
  });
  const { handleSubmit } = methods;

  const onSubmit = async (data: FormDataLocal) => {
    console.log("Submit form called - data: ", data);
    try {
      // Subir la imagen si existe

      if (!data.fotoFile) {
        console.log("No se ha seleccionado ninguna imagen.");
      }
      await uploadImage(data);

      data.distritoId = Number(data.distritoId);
      data.foto = `${data.direccion}-${data.foto}`;
      // Registrar el local (llamada al backend o API)
      await agregarLocal(data);

      console.log("Datos del local enviados:", data);

      // Navegar al final
      navigate("/gestor_local/gestionar-local");
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un problema al registrar el local.");
    }
  };

  return (
    <div
      style={{ marginRight: "20px", marginLeft: "18rem", paddingTop: "2rem" }}
    >
      <h1 className="title">Registro de Local</h1>
      <SidebarGestor currentPath="registrar-local" />
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack gap={8}>
            <VenueForm></VenueForm>
            <OwnerForm></OwnerForm>
            <BottomButtons
              gap={7}
              buttons={[
                {
                  text: "Cancelar",
                  kind: "secondary",
                  onClick: () => navigate("/gestor_local/gestionar-local"),
                },
                {
                  text: "Agregar",
                  kind: "primary",
                  onClick: methods.handleSubmit(onSubmit),
                },
              ]}
            />
          </Stack>
        </Form>
      </FormProvider>
    </div>
  );
}

function VenueForm() {
  const {
    register,
    formState: { errors },
    control,
    trigger,
    setValue,
  } = useFormContext();
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [distritos, setDistritos] = useState<any[]>([]);
  const tiposLocales = [
    { value: "CAMPO", label: "Campo" },
    { value: "BAR", label: "Bar" },
    { value: "ESTADIO", label: "Estadio" },
    { value: "TEATRO", label: "Teatro" },
  ];

  const fileUploaderRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect((): void => {
    listarDistritos()
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.distritoId.toString(),
          label: item.nombre,
        }));
        setDistritos(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar los distritos", err)
      );
  }, []);

  useEffect((): void => {
    listarProvincias()
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.provinciaId.toString(),
          label: item.nombre,
        }));
        setProvincias(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar las provincias", err)
      );
  }, []);

  useEffect((): void => {
    listarDepartamentos()
      .then((data) => {
        const formatted: Lookup[] = data.map((item: any) => ({
          value: item.departamentoId.toString(),
          label: item.nombre,
        }));
        setDepartamentos(formatted);
      })
      .catch((err: Error): void =>
        console.error("Error al cargar los departamentos", err)
      );
  }, []);

  return (
    <FormGroup legendText="Datos del local">
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            <TextInput
              className="input-test-class"
              id="nombre_local"
              labelText="Nombre del local"
              placeholder="Ingrese el nombre del local"
              {...register("nombre", {
                required: { value: true, message: "El nombre es obligatorio" },
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message: "El nombre no debe exceder los 20 caracteres",
                },
              })}
              required
              invalid={!!errors.nombre}
              invalidText={errors.nombre?.message?.toString()}
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <Grid>
              <Column sm={2} md={2} lg={6} xlg={6} max={6}>
                <Select
                  id="tipo_local"
                  labelText="Tipo del local"
                  {...register("tipoLocal", {
                    required: {
                      value: true,
                      message: "Seleccione un tipo de local. Es obligatorio",
                    },
                  })}
                  required
                  invalid={!!errors.tipoLocal}
                  invalidText={errors.tipoLocal?.message?.toString()}
                  size="md"
                  style={{ width: "100%" }}
                  defaultValue=""
                >
                  <SelectItem
                    text="Seleccione el Tipo de Local"
                    value=""
                    disabled
                  />
                  {tiposLocales.map((tipo: Lookup) => (
                    <SelectItem
                      key={tipo.value}
                      text={tipo.label}
                      value={tipo.value}
                    />
                  ))}
                </Select>
              </Column>
              <Column sm={2} md={2} lg={2} xlg={2} max={2}>
                <TextInput
                  className="input-test-class"
                  id="aforo"
                  {...register("aforo", {
                    required: {
                      value: true,
                      message: "Indique el aforo. Es obligatorio",
                    },
                    valueAsNumber: true,
                    validate: (value) =>
                      value > 0 || "El aforo debe ser un número positivo",
                  })}
                  required
                  invalid={!!errors.aforo}
                  invalidText={errors.aforo?.message?.toString()}
                  labelText="Aforo"
                  placeholder="Ingrese el aforo"
                  size="md"
                  type="number"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
            <TextInput
              className="input-test-class"
              id="direccion_local"
              {...register("direccion", {
                required: {
                  value: true,
                  message: "Indique la dirección. Es obligatorio",
                },
                minLength: {
                  value: 10,
                  message: "La dirección debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "La dirección no debe exceder los 50 caracteres",
                },
              })}
              required
              invalid={!!errors.direccion}
              invalidText={errors.direccion?.message?.toString()}
              labelText="Dirección del local"
              placeholder="Ingrese la dirección del local"
              size="md"
              type="text"
              warnText=""
              style={{ width: "100%" }}
            />
            <Stack orientation="horizontal" gap={4}>
              <Select
                id="departamento"
                {...register("departamento", {
                  required: {
                    value: true,
                    message: "Seleccione un departamento. Es obligatorio",
                  },
                })}
                required
                invalid={!!errors.departamento}
                invalidText={errors.departamento?.message?.toString()}
                labelText="Departamento"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem
                  text="Seleccione el Departamento"
                  value=""
                  disabled
                />
                {departamentos.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
              <Select
                id="provincia"
                {...register("provincia", {
                  required: {
                    value: true,
                    message: "Seleccione una provincia. Es obligatorio",
                  },
                })}
                required
                invalid={!!errors.provincia}
                invalidText={errors.provincia?.message?.toString()}
                labelText="Provincia"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem text="Seleccione la Provincia" value="" disabled />
                {provincias.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
              <Select
                id="distrito"
                {...register("distritoId", {
                  required: {
                    value: true,
                    message: "Seleccione un distrito. Es obligatorio",
                  },
                })}
                required
                invalid={!!errors.distrito}
                invalidText={errors.distrito?.message?.toString()}
                labelText="Distrito"
                size="md"
                style={{ width: "100%" }}
                defaultValue=""
              >
                <SelectItem text="Seleccione el Distrito" value="" disabled />
                {distritos.map((tipo: Lookup) => (
                  <SelectItem
                    key={tipo.value}
                    text={tipo.label}
                    value={tipo.value}
                  />
                ))}
              </Select>
            </Stack>
          </Stack>
        </Column>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <FormItem>
            <p className="cds--file--label"> Subir archivos</p>
            <p className="cds--label-description">
              El peso máximo es de 500KB. Utilice los formatos .jpg y .png. Solo
              subir 1 imagen.
            </p>
            <FileUploaderDropContainer
              accept={["image/jpg", "image/png"]}
              innerRef={fileUploaderRef}
              labelText="Arrastre y deje caer archivos aquí para ser subidos."
              onAddFiles={(event, { addedFiles }) => {
                const newFile = addedFiles[0];
                if (newFile) {
                  setFiles([newFile]);
                  setValue("fotoFile", newFile); // vincula el archivo al form
                  setValue("foto", newFile.name); // vincula el archivo al form
                  trigger("fotoFile"); // valida en caso de que antes faltara
                  
                  // Crear vista previa de la imagen
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(newFile);
                }
              }}
            />

            {files.map((file, index) => (
              <Controller
                key={index}
                control={control}
                name="fotoFile"
                rules={{
                  required: {
                    value: true,
                    message: "La imagen es obligatoria.",
                  },
                }}
                render={({ field }) => (
                  <div style={{ marginTop: "16px" }}>
                    {imagePreview && (
                      <div
                        style={{
                          width: "200px",
                          height: "150px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          overflow: "hidden",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f4f4f4",
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Vista previa del local"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                    <FileUploaderItem
                      name={file.name}
                      status="edit"
                      size="md"
                      onDelete={() => {
                        setFiles(files.filter((_, i) => i !== index));
                        setImagePreview(null);
                        field.onChange(undefined);
                        trigger("fotoFile");
                      }}
                    />
                  </div>
                )}
              />
            ))}

            <p hidden={!errors.fotoFile} style={{ color: "red" }}>
              {errors.fotoFile?.message?.toString()}
            </p>

            <div className="cds--file-container cds--file-container--drop" />
          </FormItem>
        </Column>
      </Grid>
    </FormGroup>
  );
}

function OwnerForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup legendText="Datos de propietarios">
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            <Grid>
              <Column sm={2} md={2} lg={6} xlg={6} max={2}>
                <TextInput
                  className="input-test-class"
                  id="dni_responsable"
                  {...register("dni_responsable", {
                    required: {
                      value: true,
                      message: "El DNI del responsable es obligatorio",
                    },
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: "El DNI debe tener 8 dígitos numéricos",
                    },
                  })}
                  required
                  onChange={async (e) => {
                    try {
                      const dni = e.target.value;
                      // Aquí podrías agregar lógica para buscar el nombre del responsable
                      const response = await getDuenhoId(Number(dni));
                      // basado en el DNI ingresado, por ejemplo, una llamada a una API.
                      // Por simplicidad, dejaremos el campo de nombre vacío.
                      const name = response.data.nombre; // Lógica para obtener el nombre según el DNI
                      const idDuenho = response.data.usuarioId; // Lógica para obtener el nombre según el DNI
                      const nombreInput = document.getElementById(
                        "nombre_responsable"
                      ) as HTMLInputElement;
                      nombreInput.value = name;
                      setValue("gestorId", idDuenho);
                      console.log("ID del dueño obtenido:", idDuenho);
                    } catch (error) {
                      console.error("Error al obtener el ID del dueño:", error);
                    }
                  }}
                  invalid={!!errors.dni_responsable}
                  invalidText={errors.dni_responsable?.message?.toString()}
                  labelText="DNI del Responsable"
                  placeholder="Ingrese el DNI"
                  size="sm"
                  type="number"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
              <Column sm={2} md={2} lg={6} xlg={6} max={6}>
                <TextInput
                  className="input-test-class"
                  id="nombre_responsable"
                  name="nombre_responsable"
                  readOnly={true}
                  invalidText=""
                  labelText="Nombre del responsable"
                  placeholder="Verifique el nombre del responsable."
                  size="sm"
                  type="text"
                  warnText=""
                  style={{ width: "100%" }}
                />
              </Column>
            </Grid>
          </Stack>
        </Column>
      </Grid>
    </FormGroup>
  );
}
