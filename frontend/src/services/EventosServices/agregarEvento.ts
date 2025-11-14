import api from "../apiBase";
import { uploadEventImages, validateImageFiles } from "./uploadEventImages";

interface ZonaEvento {
  capacidadTotal: number;
  tipoZona: string;
  letraZona: string;
  precioUnitario: number;
}

interface EventoData {
  local: {
    localId: number;
  };
  gestor: {
    usuarioId: number;
  };
  categoriaEvento: {
    categoriaEventoId: number;
    nombre: string;
  };
  nombre: string;
  descripcion: string;
  posterHorizontal: string;
  posterVertical: string;
  fechaHorarioInicio: string;
  duracionEstimada: number;
  costoTotal: number;
  zonas: ZonaEvento[];
}

// Mapeo de categorías a IDs (ajusta según tu backend)
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

export default async function crearEvento(data:FormDataEvento, usuarioId: number) {
  try {
    console.log("📝 Iniciando creación de evento para usuario:", usuarioId);

    // Validar que tenemos un usuarioId válido
    if (!usuarioId || usuarioId === 0) {
      throw new Error("ID de usuario no válido. El usuario debe estar autenticado.");
    }

    // 1. Validar imágenes antes de proceder
    if (data.fotoFiles && data.fotoFiles.length > 0) {
      console.log(`🖼️ Validando ${data.fotoFiles.length} imágenes...`);
      const validation = validateImageFiles(data.fotoFiles);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
    }

    // 2. Generar nombres de archivos ANTES de crear el evento
    let posterHorizontal = "placeholder_horizontal.jpg";
    let posterVertical = "placeholder_vertical.jpg";
    let imageBlobNames: string[] = [];

    if (data.fotoFiles && data.fotoFiles.length > 0) {
      // Generar nombres únicos para las imágenes
      const { blobNames, publicUrls } = generateImageNames(data.fotoFiles, 0); // Usamos 0 temporalmente
      imageBlobNames = blobNames;
      
      // Asignar URLs reales (aunque los archivos aún no se subieron)
      posterHorizontal = publicUrls[0] || "placeholder_horizontal.jpg";
      posterVertical = publicUrls[1] || publicUrls[0] || "placeholder_vertical.jpg";
      
      console.log("📄 Nombres de archivos generados:", {
        posterHorizontal,
        posterVertical,
        blobNames: imageBlobNames
      });
    }

    // 3. Crear el evento en la base de datos con los nombres reales
    const fechaCompleta = `${data.fechaHorarioInicio} ${data.horaEvento}`;
    
    // Convertir duración a minutos
    const [horas, minutos] = data.duracion.split(' ')[0].split(':');
    const duracionEnMinutos = parseInt(horas) * 60 + parseInt(minutos);

    const eventoData = {
      local: {
        localId: data.localId,
      },
      gestor: {
        usuarioId: usuarioId,
      },
      categoriaEvento: {
        categoriaEventoId: CATEGORIAS_MAP[data.categoriaEvento]?.id || 0,
        nombre: CATEGORIAS_MAP[data.categoriaEvento]?.nombre || data.categoriaEvento,
      },
      nombre: data.nombre,
      descripcion: data.descripcion,
      posterHorizontal: posterHorizontal, // ✅ URL real generada
      posterVertical: posterVertical,     // ✅ URL real generada
      fechaHorarioInicio: new Date(fechaCompleta).toISOString(),
      duracionEstimada: duracionEnMinutos,
      costoTotal: data.costo,
      zonas: [
        {
          capacidadTotal: data.aforo,
          tipoZona: "General",
          letraZona: "A",
          precioUnitario: data.costo / data.aforo,
        },
      ],
    };

    console.log("🚀 Creando evento en base de datos:", eventoData);
    const response = await api.post("/eventos", eventoData);
    const eventoCreado = response.data;
    console.log("✅ Evento creado en BD:", eventoCreado);

    // 4. Si el evento se creó exitosamente, subir las imágenes con los nombres ya generados
    if (eventoCreado && data.fotoFiles && data.fotoFiles.length > 0) {
      console.log(`📤 Subiendo ${data.fotoFiles.length} imágenes...`);
      
      try {
        // Usar uploadEventImages modificado para aceptar nombres pre-generados
        const imageUrls = await uploadEventImages(
          data.fotoFiles, 
          eventoCreado.eventoId, 
          imageBlobNames // Pasar los nombres ya generados
        );
        
        console.log("✅ Imágenes subidas:", imageUrls);

        // Verificar que las URLs coincidan con las que ya tenemos en la BD
        if (imageUrls.length > 0 && 
            (imageUrls[0] !== posterHorizontal || 
             (imageUrls[1] || imageUrls[0]) !== posterVertical)) {
          
          console.log("🔄 Actualizando evento con URLs finales de imágenes...");
          const updateData = {
            posterHorizontal: imageUrls[0] || posterHorizontal,
            posterVertical: imageUrls[1] || imageUrls[0] || posterVertical,
          };

          await api.patch(`/eventos/${eventoCreado.eventoId}`, updateData);
          console.log("✅ Evento actualizado con URLs finales");
        }

      } catch (uploadError) {
        console.error("⚠️ Error subiendo imágenes, pero el evento fue creado:", uploadError);
        // El evento ya tiene los nombres generados, así que sigue siendo válido
      }
    }

    return eventoCreado;

  } catch (error: any) {
    console.error("❌ Error al crear el evento:", error);
    throw new Error(error.response?.data?.message || error.message || "Error al crear el evento");
  }
}