import api from "../apiBase";
import { uploadEventImage, validateImageFiles } from "./uploadEventImages";

interface ZonaEvento {
  capacidadTotal: number;
  tipoZona: string;
  letraZona: string;
  precioUnitario: number;
}

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

// En la función crearEvento, actualizar para incluir imagenZonas:
export default async function crearEvento(
  data: FormDataEvento,
  usuarioId: number
) {
  try {
    console.log("📝 Iniciando creación de evento para usuario:", usuarioId);

    if (!usuarioId || usuarioId === 0) {
      throw new Error(
        "ID de usuario no válido. El usuario debe estar autenticado."
      );
    }

    // 1. Validar imágenes si existen
    const filesToValidate: File[] = [];
    if (data.fotoHorizontal) filesToValidate.push(data.fotoHorizontal);
    if (data.fotoVertical) filesToValidate.push(data.fotoVertical);
    if (data.imagenZonasFile) filesToValidate.push(data.imagenZonasFile);

    if (filesToValidate.length > 0) {
      console.log(`🖼️ Validando ${filesToValidate.length} imágenes...`);
      const validation = validateImageFiles(filesToValidate);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
    }

    // 2. Generar nombres de archivos ANTES de crear el evento
    let posterHorizontal = "placeholder_horizontal.jpg";
    let posterVertical = "placeholder_vertical.jpg";
    let imagenZonas = "placeholder_zonas.jpg"; // Nuevo placeholder para imagen de zonas
    let horizontalBlobName: string | null = null;
    let verticalBlobName: string | null = null;
    let zonasBlobName: string | null = null;

    if (data.fotoHorizontal) {
      horizontalBlobName = generateImageName(
        data.fotoHorizontal,
        0,
        "horizontal"
      );
      posterHorizontal = horizontalBlobName;
    }

    if (data.fotoVertical) {
      verticalBlobName = generateImageName(data.fotoVertical, 0, "vertical");
      posterVertical = verticalBlobName;
    }

    if (data.imagenZonasFile) {
      zonasBlobName = generateImageName(data.imagenZonasFile, 0, "zona");
      imagenZonas = zonasBlobName;
    }

    console.log("📄 Nombres de archivos generados:", {
      posterHorizontal,
      posterVertical,
      imagenZonas,
    });

    // 3. Crear el evento en la base de datos con SOLO los nombres de archivo
    const fechaCompleta = combinarFechaHoraAISO(
      data.fechaHorarioInicio,
      data.horaEvento
    );

    const [horas, minutos] = data.duracion.split(" ")[0].split(":");
    const duracionEnMinutos = parseInt(horas) * 60 + parseInt(minutos);

    const zonasParaAPI: ZonaEvento[] =
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

    const eventoData = {
      local: {
        localId: data.localId,
      },
      gestor: {
        usuarioId: usuarioId,
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
      zonas: zonasParaAPI,
    };

    console.log("🚀 Creando evento en base de datos:", eventoData);
    const response = await api.post("/eventos", eventoData);
    const eventoCreado = response.data;
    console.log("✅ Evento creado en BD:", eventoCreado);

    // 4. Subir las imágenes con los nombres ya generados
    const uploadPromises: Promise<void>[] = [];

    if (data.fotoHorizontal && horizontalBlobName) {
      console.log("📤 Subiendo imagen horizontal...");
      uploadPromises.push(
        uploadEventImage(
          data.fotoHorizontal,
          eventoCreado.eventoId,
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
      console.log("📤 Subiendo imagen vertical...");
      uploadPromises.push(
        uploadEventImage(
          data.fotoVertical,
          eventoCreado.eventoId,
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
      console.log("📤 Subiendo imagen de zonas...");
      uploadPromises.push(
        uploadEventImage(
          data.imagenZonasFile,
          eventoCreado.eventoId,
          "zona",
          zonasBlobName
        )
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
      console.log("✅ Todas las imágenes han sido procesadas");
    }

    return eventoCreado;
  } catch (error: any) {
    console.error("❌ Error al crear el evento:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al crear el evento"
    );
  }
}

// Función para combinar fecha y hora (mantener igual)
function combinarFechaHoraAISO(fecha: string, hora12h: string): string {
  try {
    const [mes, dia, año] = fecha.split("/");
    const [horaMin, ampm] = hora12h.split(" ");
    const [horas, minutos] = horaMin.split(":");

    let horas24 = parseInt(horas);
    if (ampm === "PM" && horas24 < 12) {
      horas24 += 12;
    } else if (ampm === "AM" && horas24 === 12) {
      horas24 = 0;
    }

    const fechaISO = new Date(
      Date.UTC(
        parseInt(año),
        parseInt(mes) - 1,
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
    return new Date().toISOString();
  }
}
