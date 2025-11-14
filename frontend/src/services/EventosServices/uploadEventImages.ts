import { BlobServiceClient } from "@azure/storage-blob";

const sasUrl = "https://ebentos.blob.core.windows.net/images?sp=racwdli&st=2025-11-10T03:51:52Z&se=2025-12-25T12:06:52Z&spr=https&sv=2024-11-04&sr=c&sig=sZX4%2BWWhe2xI1DugNWJY7iW46pxQEzj9egmwAuqsNkw%3D";

// services/EventoServices/uploadImageService.ts
export async function uploadEventImages(
  files: File[], 
  eventoId: number, 
  blobNames?: string[] // Opcional: nombres pre-generados
): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  if (!files || files.length === 0) {
    console.log("No hay archivos para subir");
    return uploadedUrls;
  }

  try {
    const containerClient = new BlobServiceClient(sasUrl).getContainerClient("");

    // Subir cada archivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Usar nombre pre-generado o generar uno nuevo
        const blobName = blobNames && blobNames[i] 
          ? blobNames[i] 
          : generateBlobName(file, eventoId); // Función auxiliar para generar nombres

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log(`📤 Subiendo imagen ${i + 1}/${files.length}:`, file.name);
        console.log(`📍 Como: ${blobName}`);
        
        await blockBlobClient.uploadBrowserData(file, {
          blobHTTPHeaders: {
            blobContentType: file.type,
          },
        });

        const imageUrl = `${import.meta.env.VITE_IMAGE_BASE_URL}/${blobName}`;
        uploadedUrls.push(imageUrl);
        console.log(`✅ Imagen subida: ${imageUrl}`);

      } catch (fileError: any) {
        console.error(`❌ Error subiendo imagen ${file.name}:`, fileError);
        throw new Error(`Error al subir la imagen ${file.name}: ${fileError.message}`);
      }
    }

    return uploadedUrls;

  } catch (error: any) {
    console.error("❌ Error general en uploadEventImages:", error);
    throw new Error(`Error al subir las imágenes: ${error.message}`);
  }
}

// Función auxiliar para generar nombres (si no se proporcionan pre-generados)
function generateBlobName(file: File, eventoId: number): string {
  const fileExtension = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `eventos/${eventoId}/imagen_${timestamp}_${randomString}.${fileExtension}`;
}

// La función de validación se mantiene igual
export function validateImageFiles(files: File[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 500 * 1024; // 500KB

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`El archivo "${file.name}" no es un formato válido. Use JPG o PNG.`);
    }

    if (file.size > maxSize) {
      errors.push(`El archivo "${file.name}" excede el tamaño máximo de 500KB.`);
    }

    if (files.length > 2) {
      errors.push("Máximo 2 imágenes permitidas.");
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}