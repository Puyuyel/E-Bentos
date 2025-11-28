import {
  Stack,
  TextInput,
  TextArea,
  ClickableTile,
  FileUploaderDropContainer,
  FileUploaderItem,
  FormItem,
  InlineLoading,
  Modal,
  Button,
} from "@carbon/react";
import { Location, TrashCan } from "@carbon/react/icons";
import CardVenueTag from "../../../components/Gestion/CardVenueTag";
import type { FormDataLocalUpdate, Local } from "../../../types/locales.types";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import editarLocal from "../../../services/LocalesServices/editarLocalService";
import uploadImage from "../../../services/LocalesServices/uploadImageService";
import eliminarLocal from "../../../services/LocalesServices/eliminarLocalService";

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

// CONSTANTES
import {
  MENSAJES_TIPO,
  COLORES_BACKGROUND_TIPO,
  COLORES_FONT_TIPO,
} from "../../../pages/utils/ColoresLocales";

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
  const [motivo, setMotivo] = useState<string>("");
  const [isInvalidMotive, setIsInvalidMotive] = useState(false);
  const [color, setColor] = useState({
    fondo: "",
    fuente: "",
  });
  const fileUploaderRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    switch (local.activo) {
      case 1:
        setMensaje(MENSAJES_TIPO.HABILITADO);
        setColor((prev) => ({
          ...prev,
          fuente: COLORES_FONT_TIPO.HABILITADO,
          fondo: COLORES_BACKGROUND_TIPO.HABILITADO,
        }));
        break;
      case 2:
        setMensaje(MENSAJES_TIPO.EN_REVISION);
        setColor(() => ({
          fuente: COLORES_FONT_TIPO.EN_REVISION,
          fondo: COLORES_BACKGROUND_TIPO.EN_REVISION,
        }));
        break;
      case 0:
        setMensaje(MENSAJES_TIPO.ELIMINADO);
        setColor(() => ({
          fuente: COLORES_FONT_TIPO.EN_REVISION,
          fondo: COLORES_BACKGROUND_TIPO.EN_REVISION,
        }));
        break;
      default:
        setMensaje("Desconocido");
        setColor(() => ({
          fuente: "gray",
          fondo: "transparent",
        }));
        break;
    }
  }, [local]); // <- se ejecuta cada vez que 'local' cambie

  const nombreLocal = local.nombre;
  const ubicacion = local.direccion;

  // State to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const submitModal = async (data: FormDataLocalUpdate) => {
    if (isProcessing) return; // evita envíos dobles
    setIsProcessing(true);
    try {
      data.localId = local.localId;
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
      // Navegar al final
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

  const handleDarLocalBaja = async () => {
    // Lógica para dar de baja el local
    console.log(`Dar de baja el local con ID: ${local.localId}`);
    try {
      const response = await eliminarLocal(local.localId);
      return response;
    } catch (error) {
      console.error("Error al dar de baja el local:", error);
      throw error;
    }
  };
  const onDarBajaClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // open confirmation modal
    setConfirmOpen(true);
  };

  // Confirmation + deletion states
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [resultSuccess, setResultSuccess] = useState<boolean | null>(null);

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirmYes = async () => {
    if (motivo.trim() === "") {
      setIsInvalidMotive(true);
      return;
    }
    setConfirmOpen(false);
    setDeleting(true);
    setResultOpen(true);
    setResultMessage("Eliminando el local...");
    try {
      const response = await handleDarLocalBaja();
      setDeleting(false);
      if (response && response.status === 200) {
        setResultSuccess(true);
        setResultMessage("Local eliminado exitosamente.");
      } else {
        setResultSuccess(false);
        setResultMessage("El local no se pudo eliminar.");
      }
    } catch {
      setDeleting(false);
      setResultSuccess(false);
      setResultMessage("El local no se pudo eliminar.");
    }
  };

  const handleResultClose = () => {
    setResultOpen(false);
    // If deletion was successful, reload the page so parent list updates
    if (resultSuccess) {
      // small timeout to ensure modal finishes closing visually
      setTimeout(() => window.location.reload(), 150);
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
            readOnly={true}
            defaultValue={local.direccion}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="tipo-local"
            labelText="Tipo de Local"
            readOnly={true}
            defaultValue={local.tipoLocal}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="duenho-local"
            labelText="Dueño del Local"
            readOnly={true}
            defaultValue={local.gestor.usuarioId.toString()}
            style={{
              marginBottom: "24px",
            }}
          />
          <TextInput
            data-modal-primary-focus
            id="distrito-local"
            labelText="Distrito"
            readOnly={true}
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

      {/* Confirm deletion modal */}
      {confirmOpen && (
        <Modal
          aria-label="Confirmar eliminación"
          modalHeading="Confirmación"
          open={confirmOpen}
          onRequestClose={handleConfirmCancel}
          onRequestSubmit={handleConfirmYes}
          onSecondarySubmit={handleConfirmCancel}
          primaryButtonText="Sí"
          secondaryButtonText="No"
        >
          <p style={{ marginBottom: "1rem" }}>
            ¿Está seguro de eliminar el Local?
          </p>
          <TextArea
            enableCounter
            id="motivo-eliminacion"
            invalid={isInvalidMotive}
            invalidText="El motivo es obligatorio."
            labelText="Motivo de eliminación"
            maxCount={500}
            placeholder="Ingrese un motivo para la elminación."
            rows={4}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </Modal>
      )}

      {/* Result / loading modal */}
      {resultOpen && (
        <Modal
          aria-label="Resultado eliminación"
          modalHeading={
            deleting ? "Eliminando..." : resultSuccess ? "Éxito" : "Error"
          }
          open={resultOpen}
          onRequestClose={handleResultClose}
          onRequestSubmit={handleResultClose}
          primaryButtonText={deleting ? undefined : "Aceptar"}
        >
          <p>{resultMessage}</p>
        </Modal>
      )}

      <ClickableTile
        className="back_card"
        onClick={openModal}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Dar de baja button inside the tile but stopPropagation to avoid triggering the tile click */}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", width: "100%" }}>
          <div style={{ flex: "1 1 45%", minWidth: "150px" }}>
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
          </div>

          <button
            onClick={onDarBajaClick}
            aria-label="Dar de baja"
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              zIndex: 3,
              background: "rgba(0, 0, 0, 0)",
              color: "#c62828",
              border: "none",
            }}
          >
            <TrashCan size={30} />
          </button>

          <div style={{ flex: "1 1 45%", minWidth: "150px" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={`${imageBaseUrl}/${local.foto}`} // local.foto
                alt="Imagen del local"
                style={{ width: "100%", maxWidth: "100%", objectFit: "cover", borderRadius: "8px" }}
              ></img>

              <div>
                <CardVenueTag
                  mensaje={mensaje}
                  color={{ fondo: color.fondo, fuente: color.fuente }}
                ></CardVenueTag>
              </div>
            </div>
          </div>
        </div>
      </ClickableTile>
    </div>
  );
}
