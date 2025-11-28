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
  imagenZonasFiles: File[];
  zonas: {
    nombre: string;
    letra: string;
    aforo: number;
    precio: number;
  }[];
}

// Función para generar nombres únicos de archivos
function generateImageNames(files: File[], eventoId: number, tipo: 'evento' | 'zona' = 'evento'): { blobNames: string[], publicUrls: string[] } {
  const blobNames: string[] = [];
  const publicUrls: string[] = [];

  files.forEach((file, index) => {
    const fileExtension = file.name.split('.').pop();
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const prefix = tipo === 'zona' ? 'zona' : 'imagen';
    const blobName = `eventos/${eventoId}/${prefix}_${timestamp}_${randomString}.${fileExtension}`;
    
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
    const fechaCompleta = combinarFechaHoraAISO(data.fechaHorarioInicio, data.horaEvento);
    
    // Convertir duración a minutos
    const [horas, minutos] = data.duracion.split(' ')[0].split(':');
    const duracionEnMinutos = parseInt(horas) * 60 + parseInt(minutos);

    // Mapear las zonas del formulario al formato de la API
    const zonasParaAPI: ZonaEvento[] = data.zonas && data.zonas.length > 0 
      ? data.zonas.map(zona => ({
          capacidadTotal: zona.aforo,
          tipoZona: zona.nombre,
          letraZona: zona.letra,
          precioUnitario: zona.precio,
        }))
      : [{
          capacidadTotal: data.aforo,
          tipoZona: "General",
          letraZona: "A",
          precioUnitario: data.costo / data.aforo,
        }];

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
      zonas: zonasParaAPI,
    };

    console.log("🚀 Creando evento en base de datos:", eventoData);
    const response = await api.post("/eventos", eventoData);
    const eventoCreado = response.data;
    console.log("✅ Evento creado en BD:", eventoCreado);

    // 4. Si el evento se creó exitosamente, subir las imágenes con los nombres ya generados
    if (eventoCreado && data.fotoFiles && data.fotoFiles.length > 0) {
      console.log(`📤 Subiendo ${data.fotoFiles.length} imágenes del evento...`);
      
      try {
        // Usar uploadEventImages modificado para aceptar nombres pre-generados
        const imageUrls = await uploadEventImages(
          data.fotoFiles, 
          eventoCreado.eventoId, 
          imageBlobNames // Pasar los nombres ya generados
        );
        
        console.log("✅ Imágenes del evento subidas:", imageUrls);

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
        console.error("⚠️ Error subiendo imágenes del evento, pero el evento fue creado:", uploadError);
        // El evento ya tiene los nombres generados, así que sigue siendo válido
      }
    }

    // 5. Si hay imagen de zonas, subirla a Azure blob storage
    if (eventoCreado && data.imagenZonasFiles && data.imagenZonasFiles.length > 0) {
      console.log(`📤 Subiendo imagen de zonas...`);
      
      try {
        const { blobNames: zonaBlobNames } = generateImageNames(
          data.imagenZonasFiles, 
          eventoCreado.eventoId,
          'zona'
        );
        
        const zonaImageUrls = await uploadEventImages(
          data.imagenZonasFiles, 
          eventoCreado.eventoId, 
          zonaBlobNames
        );
        
        console.log("✅ Imagen de zonas subida:", zonaImageUrls);
        // La URL de la imagen de zonas se puede usar en el frontend para mostrarla
        // Si necesitas guardarla en la BD, puedes hacer un PATCH aquí

      } catch (uploadError) {
        console.error("⚠️ Error subiendo imagen de zonas:", uploadError);
        // No es crítico, el evento ya está creado
      }
    }

    return eventoCreado;

  } catch (error: any) {
    console.error("❌ Error al crear el evento:", error);
    throw new Error(error.response?.data?.message || error.message || "Error al crear el evento");
  }
}

// Función para combinar fecha y hora en formato ISO
function combinarFechaHoraAISO(fecha: string, hora12h: string): string {
  try {
    // fecha viene como "MM/DD/YYYY" (ej: "12/25/2024")
    // hora12h viene como "HH:MM AM/PM" (ej: "02:30 PM")
    console.log("fecha: ", fecha, "hora12h:", hora12h);
    
    const [mes, dia, año] = fecha.split('/');
    const [horaMin, ampm] = hora12h.split(' ');
    const [horas, minutos] = horaMin.split(':');
    
    // Convertir a 24h
    let horas24 = parseInt(horas);
    if (ampm === 'PM' && horas24 < 12) {
      horas24 += 12;
    } else if (ampm === 'AM' && horas24 === 12) {
      horas24 = 0;
    }
    
    // Crear fecha en formato ISO (YYYY-MM-DDTHH:MM:SS.sssZ)
    const fechaISO = new Date(Date.UTC(
      parseInt(año),
      parseInt(mes) - 1, // Mes es 0-based
      parseInt(dia),
      horas24,
      parseInt(minutos),
      0, 0
    )).toISOString();
    
    console.log("🔴 [CONVERSIÓN]", { fecha, hora12h, resultado: fechaISO });
    return fechaISO;
    
  } catch (error) {
    console.error("Error combinando fecha y hora:", error);
    // Fallback: fecha actual
    return new Date().toISOString();
  }
}