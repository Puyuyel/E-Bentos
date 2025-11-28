import api from "../apiBase";
import { uploadEventImage, validateImageFiles } from "./uploadEventImages";

// Interfaces según tu API
interface Local {
  localId: number;
}

interface CategoriaEvento {
  categoriaEventoId: number;
  nombre: string;
}

interface Zona {
  zonaId?: number;
  capacidadTotal: number;
  tipoZona: string;
  letraZona: string;
  precioUnitario: number;
}

interface EventoData {
  local: Local;
  categoriaEvento: CategoriaEvento;
  nombre: string;
  descripcion: string;
  posterHorizontal: string;
  posterVertical: string;
  imagenZonas: string;
  fechaHorarioInicio: string;
  duracionEstimada: number;
  costoTotal: number;
  estado: string;
  zonas: Zona[];
}

// Mapeo de categorías a IDs
const CATEGORIAS_MAP: { [key: string]: { id: number; nombre: string } } = {
  CONCIERTO: { id: 1, nombre: "Concierto" },
  MUSICAL: { id: 2, nombre: "Musical" },
  TEATRO: { id: 3, nombre: "Teatro" },
  ENTRETENIMIENTO: { id: 4, nombre: "Entretenimiento" },
};

interface FormDataEvento {
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

// Función para generar nombres únicos de archivos
function generateImageName(
  file: File,
  eventoId: number,
  tipo: "horizontal" | "vertical" | "zona"
): string {
  const fileExtension = file.name.split(".").pop();
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `eventos/${eventoId}/${tipo}_${timestamp}_${randomString}.${fileExtension}`;
}

// En la función editarEvento, actualizar para manejar imagenZonas:
// En editarEvento.ts, actualizar la función editarEvento:
export default async function editarEvento(
  eventoId: number,
  data: FormDataEvento,
  usuarioId: number,
  imagenesExistentes?: {
    posterHorizontal: string;
    posterVertical: string;
    imagenZonas?: string;
  },
  estadoExistente: string = "PENDIENTE"
) {
  try {
    console.log(
      "📝 Iniciando edición del evento:",
      eventoId,
      "para usuario:",
      usuarioId
    );

    // Validaciones
    if (!usuarioId || usuarioId === 0) {
      throw new Error(
        "ID de usuario no válido. El usuario debe estar autenticado."
      );
    }

    if (!eventoId || eventoId === 0) {
      throw new Error("ID de evento no válido.");
    }

    // 1. Validar nuevas imágenes si existen
    const filesToValidate: File[] = [];
    if (data.fotoHorizontal) filesToValidate.push(data.fotoHorizontal);
    if (data.fotoVertical) filesToValidate.push(data.fotoVertical);
    if (data.imagenZonasFile) filesToValidate.push(data.imagenZonasFile);

    if (filesToValidate.length > 0) {
      console.log(`🖼️ Validando ${filesToValidate.length} nuevas imágenes...`);
      const validation = validateImageFiles(filesToValidate);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
    }

    // 2. Preparar datos para la actualización
    const fechaCompleta = combinarFechaHoraAISO(
      data.fechaHorarioInicio,
      data.horaEvento
    );
    const [horas, minutos] = data.duracion.split(" ")[0].split(":");
    const duracionEnMinutos = parseInt(horas) * 60 + parseInt(minutos);

    // 3. CORREGIDO: Manejo de imágenes - extraer solo el nombre del archivo de las URLs existentes
    const baseUrl = "https://ebentos.blob.core.windows.net/images/";

    // Función para extraer solo el nombre del archivo de una URL
    const extraerNombreArchivo = (url: string): string => {
      if (!url || url.includes("placeholder")) return url;
      if (url.includes(baseUrl)) {
        return url.replace(baseUrl, "");
      }
      // Si ya es solo un nombre de archivo, devolverlo tal cual
      return url;
    };

    let posterHorizontal = extraerNombreArchivo(
      imagenesExistentes?.posterHorizontal || "placeholder_horizontal.jpg"
    );
    let posterVertical = extraerNombreArchivo(
      imagenesExistentes?.posterVertical || "placeholder_vertical.jpg"
    );
    let imagenZonas = "placeholder_zonas.jpg";
    if (imagenesExistentes?.imagenZonas) {
      imagenZonas = extraerNombreArchivo(imagenesExistentes.imagenZonas);
      console.log("✅ Usando imagen de zonas existente:", imagenZonas);
    } else if (data.imagenZonasFile) {
      // Solo usar placeholder si no hay imagen existente NI nueva
      imagenZonas = "placeholder_zonas.jpg";
    }

    // Generar nombres para nuevas imágenes
    let horizontalBlobName: string | null = null;
    let verticalBlobName: string | null = null;
    let zonasBlobName: string | null = null;

    if (data.fotoHorizontal) {
      horizontalBlobName = generateImageName(
        data.fotoHorizontal,
        eventoId,
        "horizontal"
      );
      posterHorizontal = horizontalBlobName; // Solo el nombre del archivo
    }

    if (data.fotoVertical) {
      verticalBlobName = generateImageName(
        data.fotoVertical,
        eventoId,
        "vertical"
      );
      posterVertical = verticalBlobName; // Solo el nombre del archivo
    }

    if (data.imagenZonasFile) {
      zonasBlobName = generateImageName(data.imagenZonasFile, eventoId, "zona");
      imagenZonas = zonasBlobName; // Solo el nombre del archivo
    }

    console.log("📄 Nombres de archivos para actualización:", {
      posterHorizontal,
      posterVertical,
      imagenZonas,
    });

    // 4. Preparar zonas
    const zonas: Zona[] =
      data.zonas && data.zonas.length > 0
        ? data.zonas.map((zona) => ({
            capacidadTotal: zona.aforo,
            tipoZona: zona.nombre,
            letraZona: zona.letra,
            precioUnitario: zona.precio,
          }))
        : [
            {
              capacidadTotal: data.aforo,
              tipoZona: "General",
              letraZona: "A",
              precioUnitario: data.costo / data.aforo,
            },
          ];

    // 5. Preparar datos del evento
    const eventoData: EventoData = {
      local: {
        localId: data.localId,
      },
      categoriaEvento: {
        categoriaEventoId: CATEGORIAS_MAP[data.categoriaEvento]?.id || 0,
        nombre:
          CATEGORIAS_MAP[data.categoriaEvento]?.nombre || data.categoriaEvento,
      },
      nombre: data.nombre,
      descripcion: data.descripcion,
      posterHorizontal: posterHorizontal, // ✅ Solo nombre del archivo
      posterVertical: posterVertical, // ✅ Solo nombre del archivo
      imagenZonas: imagenZonas, // ✅ Solo nombre del archivo
      fechaHorarioInicio: new Date(fechaCompleta).toISOString(),
      duracionEstimada: duracionEnMinutos,
      costoTotal: data.costo,
      estado: estadoExistente,
      zonas: zonas,
    };

    console.log("🔄 Actualizando evento en base de datos:", eventoData);

    // 6. Actualizar el evento en la BD usando PUT
    const response = await api.put(`/eventos/${eventoId}`, eventoData);
    const eventoActualizado = response.data;
    console.log("✅ Evento actualizado en BD:", eventoActualizado);

    // 7. Si hay nuevas imágenes, subirlas
    const uploadPromises: Promise<void>[] = [];

    if (data.fotoHorizontal && horizontalBlobName) {
      console.log("📤 Subiendo nueva imagen horizontal...");
      uploadPromises.push(
        uploadEventImage(
          data.fotoHorizontal,
          eventoId,
          "horizontal",
          horizontalBlobName
        )
          .then((blobName) => {
            console.log("✅ Imagen horizontal subida:", blobName);
          })
          .catch((error) => {
            console.error("⚠️ Error subiendo imagen horizontal:", error);
          })
      );
    }

    if (data.fotoVertical && verticalBlobName) {
      console.log("📤 Subiendo nueva imagen vertical...");
      uploadPromises.push(
        uploadEventImage(
          data.fotoVertical,
          eventoId,
          "vertical",
          verticalBlobName
        )
          .then((blobName) => {
            console.log("✅ Imagen vertical subida:", blobName);
          })
          .catch((error) => {
            console.error("⚠️ Error subiendo imagen vertical:", error);
          })
      );
    }

    // Subir imagen de zonas si existe
    if (data.imagenZonasFile && zonasBlobName) {
      console.log("📤 Subiendo nueva imagen de zonas...");
      uploadPromises.push(
        uploadEventImage(data.imagenZonasFile, eventoId, "zona", zonasBlobName)
          .then((blobName) => {
            console.log("✅ Imagen de zonas subida:", blobName);
          })
          .catch((error) => {
            console.error("⚠️ Error subiendo imagen de zonas:", error);
          })
      );
    }

    // Esperar a que todas las imágenes se suban
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
      console.log("✅ Todas las nuevas imágenes han sido procesadas");
    }

    return eventoActualizado;
  } catch (error: any) {
    console.error("❌ Error al editar el evento:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al editar el evento"
    );
  }
}

// Función para obtener datos actuales del evento
export async function obtenerEventoPorId(eventoId: number): Promise<any> {
  try {
    console.log("📥 Obteniendo datos del evento:", eventoId);
    const response = await api.get(`/eventos/${eventoId}`);
    console.log("✅ Datos del evento obtenidos:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener el evento:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al obtener el evento"
    );
  }
}

function combinarFechaHoraAISO(fecha: string, hora12h: string): string {
  try {
    // fecha viene como "MM/DD/YYYY" (ej: "12/25/2024")
    // hora12h viene como "HH:MM AM/PM" (ej: "02:30 PM")
    console.log("fecha: ", fecha, "hora12h:", hora12h);

    const [mes, dia, año] = fecha.split("/");
    const [horaMin, ampm] = hora12h.split(" ");
    const [horas, minutos] = horaMin.split(":");

    // Convertir a 24h
    let horas24 = parseInt(horas);
    if (ampm === "PM" && horas24 < 12) {
      horas24 += 12;
    } else if (ampm === "AM" && horas24 === 12) {
      horas24 = 0;
    }

    // Crear fecha en formato ISO (YYYY-MM-DDTHH:MM:SS.sssZ)
    const fechaISO = new Date(
      Date.UTC(
        parseInt(año),
        parseInt(mes) - 1, // Mes es 0-based
        parseInt(dia),
        horas24,
        parseInt(minutos),
        0,
        0
      )
    ).toISOString();

    console.log("🔴 [CONVERSIÓN]", { fecha, hora12h, resultado: fechaISO });
    return fechaISO;
  } catch (error) {
    console.error("Error combinando fecha y hora:", error);
    // Fallback: fecha actual
    return new Date().toISOString();
  }
}
