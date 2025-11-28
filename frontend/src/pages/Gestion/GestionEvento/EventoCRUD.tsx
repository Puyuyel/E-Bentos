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
  NumberInput,
  DatePicker,
  DatePickerInput,
  TimePickerSelect,
  TimePicker,
  TextArea,
  Button,
} from "@carbon/react";
import { useRef, useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import BottomButtons from "../../../components/Gestion/BottomButtons.tsx";
import SidebarGestor from "../../../components/SidebarGestor.tsx";
import { getLocales } from "../../../services/localService.ts";
import "../../../styles/DatePicker.css";
import "../../../styles/GestionEvento/EventoCRUD.css";
import crearEvento from "../../../services/EventosServices/agregarEvento.ts";
import { useAuthStore } from "../../../store/useAuthStore.ts";
import editarEvento, {
  obtenerEventoPorId,
} from "../../../services/EventosServices/editarEvento.ts";
import "../../../styles/CargaSpinner.css";
import { verificarEstadoSolicitudLocal } from "../../../services/EventosServices/solicitudLocal.ts";
import SeccionZonas from "./SeccionZonas";

// Define el tipo para el formulario de evento
export interface FormDataEvento {
  nombre: string;
  descripcion: string;
  localId: number;
  categoriaEvento: string;
  fechaHorarioInicio: string;
  horaEvento: string;
  duracion: string;
  costo: number;
  aforo: number;
  fotoHorizontal: File | null;
  fotoVertical: File | null;
  imagenZonasFile: File | null;
  zonas: {
    nombre: string;
    letra: string;
    aforo: number;
    precio: number;
  }[];
}

interface Lookup {
  value: string;
  label: string;
}

interface EventoCRUDProps {
  modo: "crear" | "editar" | "visualizar";
}

export default function EventoCRUD({ modo }: EventoCRUDProps) {
  const { user } = useAuthStore();
  const { eventoId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [permiteCambiarLocal, setPermiteCambiarLocal] = useState(
    modo === "crear"
  );
  const [cargando, setCargando] = useState(false);
  const [imagenesExistentes, setImagenesExistentes] = useState<{
    posterHorizontal: string;
    posterVertical: string;
  }>({
    posterHorizontal: "",
    posterVertical: "",
  });
  const [estadoEvento, setEstadoEvento] = useState<string>("PENDIENTE");

  const methods = useForm<FormDataEvento>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      localId: 0,
      categoriaEvento: "",
      fechaHorarioInicio: "",
      horaEvento: "",
      duracion: "",
      costo: 0,
      aforo: 0,
      fotoHorizontal: null,
      fotoVertical: null,
      imagenZonasFile: null,
      zonas: [],
    },
  });

  const { handleSubmit, reset } = methods;
  const [imagenZonasExistente, setImagenZonasExistente] = useState<string>("");

  // Cargar datos del evento si es editar o visualizar
  useEffect(() => {
    const cargarDatosEvento = async () => {
      if (modo !== "crear" && eventoId) {
        try {
          setCargando(true);
          const evento = await obtenerEventoPorId(Number(eventoId));
          setEstadoEvento(evento.estado);

          const baseUrl = "https://ebentos.blob.core.windows.net/images/";
          setImagenesExistentes({
            posterHorizontal: evento.posterHorizontal.includes("http")
              ? evento.posterHorizontal
              : `${baseUrl}${evento.posterHorizontal}`,
            posterVertical: evento.posterVertical.includes("http")
              ? evento.posterVertical
              : `${baseUrl}${evento.posterVertical}`,
          });

          if (
            evento.imagenZonas &&
            !evento.imagenZonas.includes("placeholder")
          ) {
            const imagenZonasUrl = evento.imagenZonas.includes("http")
              ? evento.imagenZonas
              : `${baseUrl}${evento.imagenZonas}`;
            setImagenZonasExistente(imagenZonasUrl);
            setImagenesExistentes((prev) => ({
              ...prev,
              imagenZonas: imagenZonasUrl,
            }));
          } else {
            setImagenZonasExistente("");
          }
          // Pre-llenar el formulario con los datos del evento
          reset({
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            localId: evento.local.localId,
            categoriaEvento: evento.categoriaEvento.nombre,
            fechaHorarioInicio: formatoFechaParaInput(
              evento.fechaHorarioInicio
            ),
            horaEvento: formatoHoraParaInput(evento.fechaHorarioInicio),
            duracion: formatoDuracionParaInput(evento.duracionEstimada),
            costo: evento.costoTotal,
            aforo: evento.local.aforo,
            fotoHorizontal: null,
            fotoVertical: null,
            imagenZonasFile: null,
            zonas: evento.zonas
              ? evento.zonas.map((zona: any) => ({
                  nombre: zona.tipoZona,
                  letra: zona.letraZona,
                  aforo: zona.capacidadTotal,
                  precio: zona.precioUnitario,
                }))
              : [],
          });

          // Verificar estado de la solicitud del local si es editar
          if (modo === "editar") {
            const localIdEvento = evento.local.localId;
            const estadoSolicitud = await verificarEstadoSolicitudLocal(
              localIdEvento,
              Number(eventoId)
            );
            setPermiteCambiarLocal(estadoSolicitud === "RECHAZADO");
          }
        } catch (error) {
          console.error("Error cargando evento:", error);
          alert("Error al cargar los datos del evento");
        } finally {
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };

    cargarDatosEvento();
  }, [modo, eventoId, reset]);

  const onSubmit = async (data: FormDataEvento) => {
    console.log("Submit form called - data: ", data);

    // Validar que las 3 imágenes estén subidas al crear
    if (modo === "crear") {
      if (!data.fotoHorizontal) {
        alert("Debe subir la imagen horizontal del evento");
        return;
      }
      if (!data.fotoVertical) {
        alert("Debe subir la imagen vertical del evento");
        return;
      }
      if (!data.imagenZonasFile) {
        alert("Debe subir la imagen del mapa de zonas");
        return;
      }
    }

    // Validar que la suma de aforos de zonas sea igual al aforo total
    if (data.zonas && data.zonas.length > 0) {
      const sumaAforosZonas = data.zonas.reduce(
        (sum, zona) => sum + (Number(zona.aforo) || 0),
        0
      );
      if (sumaAforosZonas !== data.aforo) {
        alert(
          `La suma de los aforos de las zonas (${sumaAforosZonas}) debe ser igual al aforo total del local (${data.aforo})`
        );
        return;
      }
    }

    try {
      if (modo === "crear") {
        const eventoCreado = await crearEvento(data, Number(user?.id));
        console.log("Evento registrado:", eventoCreado);
        navigate("/organizador/eventos");
      } else if (modo === "editar" && eventoId) {
        const eventoActualizado = await editarEvento(
          Number(eventoId),
          data,
          Number(user?.id),
          {
            ...imagenesExistentes,
            imagenZonas: imagenZonasExistente, // ✅ Pasar la imagen de zonas existente
          },
          estadoEvento
        );
        console.log("Evento actualizado:", eventoActualizado);
        navigate("/organizador/eventos");
      }
    } catch (error: any) {
      console.error(
        `Error al ${modo === "crear" ? "registrar" : "editar"} el evento:`,
        error
      );
      alert(
        `Hubo un problema al ${
          modo === "crear" ? "registrar" : "editar"
        } el evento.`
      );
    }
  };

  const getTitulo = () => {
    switch (modo) {
      case "crear":
        return "Registrar Evento";
      case "editar":
        return "Editar Evento";
      case "visualizar":
        return "Ver Evento";
      default:
        return "Evento";
    }
  };

  const getTextoBoton = () => {
    switch (modo) {
      case "crear":
        return "Agregar";
      case "editar":
        return "Actualizar";
      default:
        return "Agregar";
    }
  };

  return (
    <div
      className={`app-container ${
        sidebarOpen ? "sidebar-visible" : "sidebar-hidden"
      }`}
    >
      <main className="app-main">
        <h1 className="title">{getTitulo()}</h1>
        <SidebarGestor currentPath="gestionar-evento" />

        {cargando ? (
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={8}>
                <VenueForm
                  modo={modo}
                  permiteCambiarLocal={permiteCambiarLocal}
                  imagenesExistentes={imagenesExistentes}
                  imagenZonasExistente={imagenZonasExistente}
                />
                {modo !== "visualizar" && (
                  <BottomButtons
                    gap={7}
                    buttons={[
                      {
                        text: "Cancelar",
                        kind: "secondary",
                        onClick: () => navigate("/organizador/eventos"),
                      },
                      {
                        text: getTextoBoton(),
                        kind: "primary",
                        onClick: handleSubmit(onSubmit),
                      },
                    ]}
                  />
                )}
              </Stack>
            </Form>
          </FormProvider>
        )}
      </main>
    </div>
  );
}

// Funciones auxiliares para formato
function formatoHoraParaInput(fechaISO: string): string {
  const date = new Date(fechaISO);
  let horas = date.getHours();
  const minutos = date.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";

  // Convertir a formato 12 horas
  horas = horas % 12;
  horas = horas === 0 ? 12 : horas;

  return `${horas}:${minutos} ${ampm}`;
}

function formatoFechaParaInput(fechaISO: string): string {
  try {
    const date = new Date(fechaISO);
    const año = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const dia = date.getDate().toString().padStart(2, "0");

    return `${mes}/${dia}/${año}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "";
  }
}

function formatoDuracionParaInput(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} AM`;
}

// Props para el componente VenueForm
interface VenueFormProps {
  modo: "crear" | "editar" | "visualizar";
  permiteCambiarLocal: boolean;
  imagenesExistentes: { posterHorizontal: string; posterVertical: string };
  imagenZonasExistente?: string;
}

function VenueForm({
  modo,
  permiteCambiarLocal,
  imagenesExistentes,
  imagenZonasExistente,
}: VenueFormProps) {
  const {
    register,
    formState: { errors },
    control,
    trigger,
    setValue,
    watch,
  } = useFormContext<FormDataEvento>();

  // Observar los valores de las imágenes
  const fotoHorizontal = watch("fotoHorizontal");
  const fotoVertical = watch("fotoVertical");

  const [mostrarImagenesExistentes, setMostrarImagenesExistentes] = useState(
    modo === "visualizar" ||
      (modo === "editar" && !fotoHorizontal && !fotoVertical)
  );

  // Función para manejar la subida de imagen horizontal
  const handleHorizontalUpload = (event: any, { addedFiles }: any) => {
    if (addedFiles.length > 0) {
      setValue("fotoHorizontal", addedFiles[0]);
      trigger("fotoHorizontal");
      setMostrarImagenesExistentes(false);
    }
  };

  // Función para manejar la subida de imagen vertical
  const handleVerticalUpload = (event: any, { addedFiles }: any) => {
    if (addedFiles.length > 0) {
      setValue("fotoVertical", addedFiles[0]);
      trigger("fotoVertical");
      setMostrarImagenesExistentes(false);
    }
  };

  // Función para eliminar imagen horizontal
  const handleDeleteHorizontal = () => {
    setValue("fotoHorizontal", null);
    trigger("fotoHorizontal");
    // Si no hay ninguna imagen nueva, mostrar las existentes
    if (!fotoVertical) {
      setMostrarImagenesExistentes(true);
    }
  };

  // Función para eliminar imagen vertical
  const handleDeleteVertical = () => {
    setValue("fotoVertical", null);
    trigger("fotoVertical");
    // Si no hay ninguna imagen nueva, mostrar las existentes
    if (!fotoHorizontal) {
      setMostrarImagenesExistentes(true);
    }
  };

  const categoriasEvento = [
    { value: "CONCIERTO", label: "Concierto" },
    { value: "MUSICAL", label: "Musical" },
    { value: "TEATRO", label: "Teatro" },
    { value: "ENTRETENIMIENTO", label: "Entretenimiento" },
  ];

  const [locales, setLocales] = useState<any[]>([]);
  const fileUploaderRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getLocales()
      .then((data) => {
        setLocales(data);
      })
      .catch((err) => console.error("Error al cargar locales", err));
  }, []);

  const isDisabled = modo === "visualizar";
  const isLocalDisabled =
    isDisabled || (modo === "editar" && !permiteCambiarLocal);

  return (
    <FormGroup legendText="">
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          <Stack gap={7}>
            {/* Nombre del evento */}
            <TextInput
              className="input-test-class"
              id="nombre_evento"
              labelText="Nombre del evento"
              placeholder="Ingrese el nombre del evento"
              {...register("nombre", {
                required: { value: true, message: "El nombre es obligatorio" },
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre no debe exceder los 50 caracteres",
                },
              })}
              required
              invalid={!!errors.nombre}
              invalidText={errors.nombre?.message?.toString()}
              size="md"
              type="text"
              style={{ width: "100%" }}
              readOnly={isDisabled}
            />

            {/* Selección del local */}
            <Controller
              name="localId"
              control={control}
              rules={{
                required: "Seleccione un local. Es obligatorio",
                validate: (value: number) =>
                  value !== 0 || "Seleccione un local válido",
              }}
              render={({ field, fieldState }) => (
                <Select
                  id="localId"
                  labelText="Nombre del local para el evento"
                  size="md"
                  required
                  invalid={!!fieldState.error}
                  invalidText={fieldState.error?.message}
                  style={{ width: "100%" }}
                  value={field.value}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    field.onChange(id);

                    // Calcula el aforo
                    const localSel = locales.find((l) => l.localId === id);
                    setValue("aforo", localSel?.aforo || 0);
                  }}
                  readOnly={isLocalDisabled}
                >
                  <SelectItem
                    text="Seleccione el Nombre del Local"
                    value=""
                    disabled
                  />
                  {locales.map((local) => (
                    <SelectItem
                      key={local.localId}
                      value={local.localId}
                      text={local.nombre}
                    />
                  ))}
                </Select>
              )}
            />

            {modo === "editar" && !permiteCambiarLocal && (
              <p
                style={{
                  color: "#da1e28",
                  fontSize: "0.875rem",
                  marginTop: "-1rem",
                }}
              >
                No puede cambiar el local porque la solicitud está{" "}
                {permiteCambiarLocal ? "rechazada" : "aprobada o en revisión"}
              </p>
            )}

            <Grid>
              {/* Aforo del local */}
              <Column sm={4} md={4} lg={4}>
                <TextInput
                  id="aforo"
                  labelText="Aforo del local"
                  readOnly
                  size="md"
                  {...register("aforo")}
                  disabled={isDisabled}
                />
              </Column>

              {/* Costo del evento */}
              <Column sm={4} md={4} lg={4}>
                <Controller
                  name="costo"
                  control={control}
                  rules={{
                    required: "El costo es obligatorio",
                    min: {
                      value: 0,
                      message: "El costo no puede ser negativo",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      id="costo"
                      label="Costo (S/)"
                      size="md"
                      placeholder="Costo total del evento"
                      min={0}
                      value={field.value}
                      onChange={(
                        e: any,
                        { value }: { value: number | string }
                      ) => {
                        field.onChange(value);
                      }}
                      invalid={!!fieldState.error}
                      invalidText={fieldState.error?.message}
                      readOnly={isDisabled}
                    />
                  )}
                />
              </Column>
            </Grid>

            <Grid>
              {/* Categoría del Evento */}
              <Column sm={4} md={4} lg={4}>
                <Controller
                  name="categoriaEvento"
                  control={control}
                  rules={{
                    required: "Seleccione un tipo de evento",
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      id="categoriaEvento"
                      labelText="Tipo de Evento"
                      size="md"
                      required
                      invalid={!!fieldState.error}
                      invalidText={fieldState.error?.message}
                      style={{ width: "100%" }}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      readOnly={isDisabled}
                    >
                      <SelectItem
                        text="Seleccione el Tipo de Evento"
                        value=""
                        disabled
                      />
                      {categoriasEvento.map((tipo: Lookup) => (
                        <SelectItem
                          key={tipo.value}
                          text={tipo.label}
                          value={tipo.value}
                        />
                      ))}
                    </Select>
                  )}
                />
              </Column>

              {/* Fecha del evento */}
              <Column sm={4} md={4} lg={4}>
                <Controller
                  name="fechaHorarioInicio"
                  control={control}
                  rules={{
                    required: "La fecha es obligatoria",
                  }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      datePickerType="single"
                      className="date-picker-responsive"
                      value={field.value}
                      onChange={(dates: Date[]) => {
                        const date = dates[0];
                        if (date) {
                          const año = date.getFullYear();
                          const mes = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const dia = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
                          const formattedDate = `${mes}/${dia}/${año}`; // Mantener formato mm/dd/yyyy para el form
                          field.onChange(formattedDate);
                        }
                      }}
                      readOnly={isDisabled}
                    >
                      <DatePickerInput
                        className="date-picker-input-responsive"
                        id="fechaHorarioInicio"
                        labelText="Fecha del evento (mm/dd/yyyy)"
                        placeholder="mm/dd/yyyy"
                        size="md"
                        invalid={!!fieldState.error}
                        invalidText={fieldState.error?.message}
                        readOnly={isDisabled}
                      />
                    </DatePicker>
                  )}
                />
              </Column>
            </Grid>

            <Grid>
              {/* Hora del Evento */}
              <Column sm={4} md={4} lg={4}>
                <Controller
                  name="horaEvento"
                  control={control}
                  rules={{ required: "Seleccione la hora del evento" }}
                  render={({ field, fieldState }) => (
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <TimePicker
                        id="horaEvento"
                        labelText="Hora"
                        size="md"
                        value={field.value?.split(" ")[0] ?? ""}
                        onChange={(e) => {
                          const current = field.value ?? "";
                          const ampm = current.split(" ")[1] ?? "AM";
                          field.onChange(`${e.target.value} ${ampm}`);
                        }}
                        invalid={!!fieldState.error}
                        invalidText={fieldState.error?.message}
                        readOnly={isDisabled}
                      />
                      <TimePickerSelect
                        id="horaEvento-ampm"
                        value={field.value?.split(" ")[1] ?? "AM"}
                        onChange={(e) => {
                          const current = field.value ?? "00:00 AM";
                          const hour = current.split(" ")[0];
                          field.onChange(`${hour} ${e.target.value}`);
                        }}
                        disabled={isDisabled}
                      >
                        <SelectItem value="AM" text="AM" />
                        <SelectItem value="PM" text="PM" />
                      </TimePickerSelect>
                    </div>
                  )}
                />
              </Column>

              {/* Duración del evento */}
              <Column sm={4} md={4} lg={4}>
                <Controller
                  name="duracion"
                  control={control}
                  rules={{ required: "Indique la duración del evento" }}
                  render={({ field, fieldState }) => (
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-end",
                      }}
                    >
                      <TimePicker
                        id="duracionEvento"
                        labelText="Duración estimada (HH:MM)"
                        size="md"
                        value={field.value?.split(" ")[0] ?? ""}
                        onChange={(e) => {
                          const current = field.value ?? "";
                          const ampm = current.split(" ")[1] ?? "AM";
                          field.onChange(`${e.target.value} ${ampm}`);
                        }}
                        invalid={!!fieldState.error}
                        invalidText={fieldState.error?.message}
                        readOnly={isDisabled}
                      />
                    </div>
                  )}
                />
              </Column>
            </Grid>

            {/* Descripción del evento */}
            <TextArea
              id="descripcion"
              labelText="Descripción del evento"
              placeholder="Ingrese una descripción detallada"
              rows={4}
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message: "Debe tener al menos 10 caracteres",
                },
              })}
              invalid={!!errors.descripcion}
              invalidText={errors.descripcion?.message?.toString()}
              readOnly={isDisabled}
            />
          </Stack>
        </Column>

        {/* SECCIÓN DE IMÁGENES SEPARADAS */}
        {(modo === "crear" ||
          (modo === "editar" && !mostrarImagenesExistentes)) && (
          <Column sm={4} md={4} lg={8} xlg={8} max={8}>
            <FormItem>
              <p className="cds--file--label">Subir imágenes del evento</p>
              <p className="cds--label-description">
                El peso máximo por imagen es de 500KB. Utilice los formatos .jpg
                y .png.
              </p>

              <Grid>
                {/* IMAGEN HORIZONTAL */}
                <Column sm={4} md={4} lg={4}>
                  <p
                    className="cds--file--label"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Poster Horizontal
                  </p>

                  <FileUploaderDropContainer
                    accept={["image/jpg", "image/jpeg", "image/png"]}
                    labelText="Arrastre imagen horizontal aquí"
                    onAddFiles={handleHorizontalUpload}
                    disabled={isDisabled}
                  />

                  {fotoHorizontal && (
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          width: "150px",
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
                          src={URL.createObjectURL(fotoHorizontal)}
                          alt="Vista previa horizontal"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <Button
                        kind="ghost"
                        size="sm"
                        onClick={handleDeleteHorizontal}
                        disabled={isDisabled}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </Column>

                {/* IMAGEN VERTICAL */}
                <Column sm={4} md={4} lg={4}>
                  <p
                    className="cds--file--label"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Poster Vertical
                  </p>

                  <FileUploaderDropContainer
                    accept={["image/jpg", "image/jpeg", "image/png"]}
                    labelText="Arrastre imagen vertical aquí"
                    onAddFiles={handleVerticalUpload}
                    disabled={isDisabled}
                  />

                  {fotoVertical && (
                    <div style={{ marginTop: "16px" }}>
                      <div
                        style={{
                          width: "150px",
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
                          src={URL.createObjectURL(fotoVertical)}
                          alt="Vista previa vertical"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <Button
                        kind="ghost"
                        size="sm"
                        onClick={handleDeleteVertical}
                        disabled={isDisabled}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </Column>
              </Grid>

              {/* Botón para volver a ver imágenes existentes (solo en editar) */}
              {modo === "editar" &&
                imagenesExistentes.posterHorizontal &&
                !imagenesExistentes.posterHorizontal.includes(
                  "placeholder"
                ) && (
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => setMostrarImagenesExistentes(true)}
                    style={{ marginTop: "16px" }}
                  >
                    Ver imágenes actuales
                  </Button>
                )}
            </FormItem>
          </Column>
        )}

        {/* Mostrar imágenes existentes */}
        {(modo === "visualizar" ||
          (modo === "editar" && mostrarImagenesExistentes)) &&
          imagenesExistentes.posterHorizontal &&
          !imagenesExistentes.posterHorizontal.includes("placeholder") && (
            <Column sm={4} md={4} lg={8} xlg={8} max={8}>
              <FormItem>
                <p className="cds--file--label">
                  {modo === "editar"
                    ? "Imágenes actuales del evento"
                    : "Imágenes del evento"}
                </p>

                {modo === "editar" && (
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => setMostrarImagenesExistentes(false)}
                    style={{ marginBottom: "16px" }}
                  >
                    Cambiar imágenes
                  </Button>
                )}

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {imagenesExistentes.posterHorizontal && (
                    <div style={{ width: "150px" }}>
                      <div
                        style={{
                          width: "150px",
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
                          src={imagenesExistentes.posterHorizontal}
                          alt="Poster horizontal del evento"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <p style={{ fontSize: "0.75rem", textAlign: "center" }}>
                        Poster Horizontal
                      </p>
                    </div>
                  )}
                  {imagenesExistentes.posterVertical &&
                    !imagenesExistentes.posterVertical.includes(
                      "placeholder"
                    ) && (
                      <div style={{ width: "150px" }}>
                        <div
                          style={{
                            width: "150px",
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
                            src={imagenesExistentes.posterVertical}
                            alt="Poster vertical del evento"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <p style={{ fontSize: "0.75rem", textAlign: "center" }}>
                          Poster Vertical
                        </p>
                      </div>
                    )}
                </div>
              </FormItem>
            </Column>
          )}
      </Grid>

      {/* Sección de Zonas */}
      <SeccionZonas
        modo={modo}
        isDisabled={isDisabled}
        imagenZonasExistente={imagenZonasExistente}
      />
    </FormGroup>
  );
}
