import {
  Grid,
  Column,
  Stack,
  TextInput,
  ClickableTile,
  FileUploaderDropContainer,
  FileUploaderItem,
  FormItem,
  Modal,
  InlineLoading,
} from "@carbon/react";
import { Location } from "@carbon/react/icons";
import CardVenueTag from "./CardVenueTag";
import type { FormDataLocalUpdate, Local } from "../../types/locales.types";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import editarLocal from "../../services/LocalesServices/editarLocalService";
import uploadImage from "../../services/LocalesServices/uploadImageService";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// CONSTANTES
const MENSAJES_TIPO = {
  HABILITADO: "Habilitado",
  EN_REVISION: "En revisión",
  ELIMINADO: "De baja",
} as const;

const COLORES_TIPO = {
  HABILITADO: "#4CAF50", // verde
  EN_REVISION: "#FFC107", // amarillo
  ELIMINADO: "#F44336", // rojo
} as const;

interface CardVenueProps {
  local: Local;
}

export default function CardVenue({ local }: CardVenueProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataLocalUpdate>({
    defaultValues: {
      localId: local.localId,
      nombre: local.nombre,
      direccion: local.direccion,
      foto: local.foto,
      aforo: local.aforo,
      tipoLocal: local.tipoLocal,
      distrito: {
        distritoId: local.distrito.distritoId,
        nombre: local.distrito.nombre,
        provincia: {
          provinciaId: 0,
          nombre: "",
          departamento: {
            departamentoId: 0,
            nombre: "",
          },
        },
      },
    },
  });
  const [mensaje, setMensaje] = useState<string>("");
  const [color, setColor] = useState<string>("gray");
  const fileUploaderRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    switch (local.activo) {
      case 1:
        setMensaje(MENSAJES_TIPO.HABILITADO);
        setColor(COLORES_TIPO.HABILITADO);
        break;
      case 2:
        setMensaje(MENSAJES_TIPO.EN_REVISION);
        setColor(COLORES_TIPO.EN_REVISION);
        break;
      case 0:
        setMensaje(MENSAJES_TIPO.ELIMINADO);
        setColor(COLORES_TIPO.ELIMINADO);
        break;
      default:
        setMensaje("Desconocido");
        setColor("gray");
        break;
    }
  }, [local]); // <- se ejecuta cada vez que 'local' cambie

  const nombreLocal = local.nombre;
  const ubicacion = local.direccion;

  // State to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // Processing / result state for submit flow
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [resultSuccess, setResultSuccess] = useState<boolean>(false);

  const handleResultClose = () => {
    setResultOpen(false);
    // If the API call was successful, refresh the page to show updated data.
    if (resultSuccess) {
      // small delay so the modal can visually close before reload
      setTimeout(() => {
        window.location.reload();
      }, 150);
    }
  };

  const submitModal = async (data: FormDataLocalUpdate) => {
    if (isProcessing) return; // evita envíos dobles
    setIsProcessing(true);
    try {
      if (data.fotoFile) {
        console.log(
          "Subiendo nueva imagen del local...",
          data.foto,
          data.fotoFile
        );
        await uploadImage(data);
        data.foto = `${data.direccion}-${data.foto}`;
      } else data.foto = `${data.foto}`;
      data.distrito.distritoId = Number(data.distrito.distritoId);
      // Registrar el local (llamada al backend o API)
      console.log("Datos del local a enviar:", data);
      const response = await editarLocal(data);
      if (response && response.status === 200) {
        setResultMessage("Local modificado con éxito.");
        setResultSuccess(true);
      } else {
        setResultMessage("El local no se pudo modificar.");
        setResultSuccess(false);
      }
    } catch (error) {
      console.error("Error al modificar el local:", error);
      setResultMessage("El local no se pudo modificar.");
      setResultSuccess(false);
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setResultOpen(true);
    }
  };

  return (
    <div>
      <Modal
        aria-label="Modal content"
        modalHeading="Modificación de Local"
        onKeyDown={() => {}}
        onRequestClose={closeModal}
        onRequestSubmit={handleSubmit(submitModal)}
        onSecondarySubmit={closeModal}
        open={isModalOpen}
        primaryButtonText="Guardar"
        secondaryButtonText="Cancel"
      >
        <p
          style={{
            marginBottom: "2rem",
          }}
        >
          Modifique los Datos del Local según sea necesario.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <TextInput
            data-modal-primary-focus
            id="nombre-local"
            labelText="Nombre"
            {...register("nombre", {
              required: {
                value: true,
                message: "El nombre es obligatorio",
              },
            })}
            invalid={!!errors.nombre}
            invalidText={errors.nombre?.message}
            defaultValue={local.nombre}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="aforo-local"
            labelText="Aforo"
            {...register("aforo", {
              required: {
                value: true,
                message: "El aforo es obligatorio",
              },
              validate: (value: number) => {
                if (value <= 0) return "El aforo debe ser un número positivo";
                return true;
              },
            })}
            invalid={!!errors.aforo}
            invalidText={errors.aforo?.message}
            defaultValue={local.aforo}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="direccion-local"
            labelText="Direccion"
            {...register("direccion")}
            disabled={true}
            defaultValue={local.direccion}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="tipo-local"
            labelText="Tipo de Local"
            disabled={true}
            defaultValue={local.tipoLocal}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="duenho-local"
            labelText="Dueño del Local"
            disabled={true}
            defaultValue={local.gestor.usuarioId.toString()}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="distrito-local"
            labelText="Distrito"
            disabled={true}
            defaultValue={local.distrito.nombre.toString()}
            style={{
              marginBottom: "24px",
            }}
          />
        </div>
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center", // centra verticalmente ambos bloques
            justifyContent: "space-between", // los separa
            gap: "2rem", // añade espacio entre ellos
          }}
        >
          <div>
            <p style={{ marginBottom: "0.5rem" }}>Imagen Actual del Local:</p>
            <img
              src={`${imageBaseUrl}/${local.foto}`} // local.foto
              alt="Imagen del local"
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            ></img>
          </div>
          <div style={{ flex: "1 1 45%" }}>
            <FormItem>
              <p className="cds--file--label">Upload files</p>
              <p className="cds--label-description">
                Max file size is 500kb. Supported file types are .jpg and .png.
              </p>
              <FileUploaderDropContainer
                accept={["image/jpeg", "image/png"]}
                innerRef={fileUploaderRef}
                labelText="Drag and drop a file here or click to upload"
                name=""
                onAddFiles={(_, { addedFiles }) => {
                  const newFile = addedFiles[0];
                  if (newFile) {
                    setFiles([newFile]);
                    setValue("fotoFile", newFile); // vincula el archivo al form
                    setValue("foto", newFile.name); // vincula el archivo al form
                  }
                }}
              />

              {/* Mostrar los archivos subidos (al menos el nombre) usando FileUploaderItem */}
              {files.map((file, index) => (
                <FileUploaderItem
                  key={file.name + index}
                  name={file.name}
                  size="md"
                  status="edit"
                  onDelete={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                />
              ))}

              <div className="cds--file-container cds--file-container--drop" />
            </FormItem>
          </div>
        </div>
      </Modal>

      {/* Processing modal (shows while API request is in progress) */}
      <Modal
        open={isProcessing}
        modalHeading="Procesando..."
        passiveModal
        onRequestClose={() => {}}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <InlineLoading description="Procesando..." status="active" />
        </div>
      </Modal>

      {/* Result modal: success / error */}
      <Modal
        open={resultOpen}
        modalHeading={resultSuccess ? "Éxito" : "Error"}
        onRequestClose={handleResultClose}
        onRequestSubmit={handleResultClose}
        primaryButtonText="Aceptar"
      >
        <p style={{ color: resultSuccess ? "green" : "red" }}>
          {resultMessage}
        </p>
      </Modal>

      <ClickableTile className="back_card" onClick={openModal}>
        <Grid>
          <Column sm={4} md={4} lg={4} xlg={4} max={4}>
            <Stack gap={3}>
              <h4>{nombreLocal}</h4>
              <div
                style={{ display: "flex", alignItems: "left", gap: "0.5rem" }}
              >
                <Location size={25}></Location>
                <p>{ubicacion}</p>
              </div>
              <div
                style={{ display: "flex", alignItems: "left", gap: "0.5rem" }}
              ></div>
            </Stack>
          </Column>
          <Column sm={4} md={4} lg={4} xlg={4} max={4}>
            <div
              style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={`${imageBaseUrl}/${local.foto}`} // local.foto
                alt="Imagen del local"
                style={{ width: "100%", objectFit: "cover" }}
              ></img>
              <CardVenueTag mensaje={mensaje} color={color}></CardVenueTag>
            </div>
          </Column>
        </Grid>
      </ClickableTile>
    </div>
  );
}
