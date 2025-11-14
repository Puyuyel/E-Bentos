import api from "../apiBase";
import { uploadEventImages, validateImageFiles } from "./uploadEventImages";

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
  fechaHorarioInicio: string;
  duracionEstimada: number;
  costoTotal: number;
  estado: string;
  zonas: Zona[];
}

// Mapeo de categorías a IDs
const CATEGORIAS_MAP: { [key: string]: { id: number, nombre: string } } = {
  "CONCIERTO": { id: 1, nombre: "Concierto" },
  "MUSICAL": { id: 2, nombre: "Musical" },
  "TEATRO": { id: 3, nombre: "Teatro" },
  "ENTRETENIMIENTO": { id: 4, nombre: "Entretenimiento" },
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
  fotoFiles: File[];
}

// Función para generar nombres únicos de archivos
function generateImageNames(files: File[], eventoId: number): { blobNames: string[], publicUrls: string[] } {
  const blobNames: string[] = [];
  const publicUrls: string[] = [];

  files.forEach((file, index) => {
    const fileExtension = file.name.split('.').pop();
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const blobName = `eventos/${eventoId}/imagen_${timestamp}_${randomString}.${fileExtension}`;
    
    blobNames.push(blobName);
    publicUrls.push(`${import.meta.env.VITE_IMAGE_BASE_URL}/${blobName}`);
  });

  return { blobNames, publicUrls };
}

export default async function editarEvento(
  eventoId: number, 
  data: FormDataEvento, 
  usuarioId: number,
  imagenesExistentes?: { posterHorizontal: string; posterVertical: string },
  estadoExistente: string = "PENDIENTE" // Estado por defecto si no se proporciona
) {
  try {
    console.log("📝 Iniciando edición del evento:", eventoId, "para usuario:", usuarioId);

    // Validaciones
    if (!usuarioId || usuarioId === 0) {
      throw new Error("ID de usuario no válido. El usuario debe estar autenticado.");
    }

    if (!eventoId || eventoId === 0) {
      throw new Error("ID de evento no válido.");
    }

    // 1. Validar nuevas imágenes si existen
    if (data.fotoFiles && data.fotoFiles.length > 0) {
      console.log(`🖼️ Validando ${data.fotoFiles.length} nuevas imágenes...`);
      const validation = validateImageFiles(data.fotoFiles);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
    }

    // 2. Preparar datos para la actualización
    const fechaCompleta = `${data.fechaHorarioInicio} ${data.horaEvento}`;
    
    // Convertir duración a minutos
    const [horas, minutos] = data.duracion.split(' ')[0].split(':');
    const duracionEnMinutos = parseInt(horas) * 60 + parseInt(minutos);

    // 3. Manejo de imágenes
    let posterHorizontal = imagenesExistentes?.posterHorizontal || "placeholder_horizontal.jpg";
    let posterVertical = imagenesExistentes?.posterVertical || "placeholder_vertical.jpg";
    let imageBlobNames: string[] = [];

    if (data.fotoFiles && data.fotoFiles.length > 0) {
      const { blobNames, publicUrls } = generateImageNames(data.fotoFiles, eventoId);
      imageBlobNames = blobNames;
      posterHorizontal = publicUrls[0] || posterHorizontal;
      posterVertical = publicUrls[1] || publicUrls[0] || posterVertical;
    }

    // 4. Preparar zonas (sin IDs por ahora)
    const zonas: Zona[] = [
      {
        capacidadTotal: data.aforo,
        tipoZona: "General",
        letraZona: "A",
        precioUnitario: data.costo / data.aforo,
      },
    ];

    // 5. Preparar datos del evento según la estructura exacta de tu API
    const eventoData: EventoData = {
      local: {
        localId: data.localId,
      },
      categoriaEvento: {
        categoriaEventoId: CATEGORIAS_MAP[data.categoriaEvento]?.id || 0,
        nombre: CATEGORIAS_MAP[data.categoriaEvento]?.nombre || data.categoriaEvento,
      },
      nombre: data.nombre,
      descripcion: data.descripcion,
      posterHorizontal: posterHorizontal,
      posterVertical: posterVertical,
      fechaHorarioInicio: new Date(fechaCompleta).toISOString(),
      duracionEstimada: duracionEnMinutos,
      costoTotal: data.costo,
      estado: estadoExistente, // Usar el estado existente de la BD
      zonas: zonas,
    };

    console.log("🔄 Actualizando evento en base de datos:", eventoData);
    
    // 6. Actualizar el evento en la BD usando PUT
    const response = await api.put(`/eventos/${eventoId}`, eventoData);
    const eventoActualizado = response.data;
    console.log("✅ Evento actualizado en BD:", eventoActualizado);

    // 7. Si hay nuevas imágenes, subirlas
    if (data.fotoFiles && data.fotoFiles.length > 0) {
      console.log(`📤 Subiendo ${data.fotoFiles.length} nuevas imágenes...`);
      
      try {
        const imageUrls = await uploadEventImages(
          data.fotoFiles, 
          eventoId, 
          imageBlobNames
        );
        
        console.log("✅ Nuevas imágenes subidas:", imageUrls);

        // Actualizar con las URLs finales si es necesario
        if (imageUrls.length > 0 && 
            (imageUrls[0] !== posterHorizontal || 
             (imageUrls[1] || imageUrls[0]) !== posterVertical)) {
          
          console.log("🔄 Actualizando evento con URLs finales de imágenes...");
          const updateData = {
            posterHorizontal: imageUrls[0],
            posterVertical: imageUrls[1] || imageUrls[0],
          };

          await api.patch(`/eventos/${eventoId}`, updateData);
          console.log("✅ Evento actualizado con URLs finales de imágenes");
        }

      } catch (uploadError) {
        console.error("⚠️ Error subiendo nuevas imágenes, pero el evento fue actualizado:", uploadError);
      }
    }

    return eventoActualizado;

  } catch (error: any) {
    console.error("❌ Error al editar el evento:", error);
    throw new Error(error.response?.data?.message || error.message || "Error al editar el evento");
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
    throw new Error(error.response?.data?.message || error.message || "Error al obtener el evento");
  }
}