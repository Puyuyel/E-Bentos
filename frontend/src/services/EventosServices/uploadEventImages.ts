import { BlobServiceClient } from "@azure/storage-blob";

const sasUrl = "https://ebentos.blob.core.windows.net/images?sp=racwdli&st=2025-11-10T03:51:52Z&se=2025-12-25T12:06:52Z&spr=https&sv=2024-11-04&sr=c&sig=sZX4%2BWWhe2xI1DugNWJY7iW46pxQEzj9egmwAuqsNkw%3D";

// Función para subir imágenes individuales
export async function uploadEventImage(
  file: File, 
  eventoId: number, 
  tipo: 'horizontal' | 'vertical' | 'zona',
  blobName?: string
): Promise<string> {
  
  if (!file) {
    throw new Error("No hay archivo para subir");
  }

  try {
    const containerClient = new BlobServiceClient(sasUrl).getContainerClient("");

    // Generar nombre si no se proporciona
    const finalBlobName = blobName || generateBlobName(file, eventoId, tipo);

    const blockBlobClient = containerClient.getBlockBlobClient(finalBlobName);

    console.log(`📤 Subiendo imagen ${tipo}:`, file.name);
    console.log(`📍 Como: ${finalBlobName}`);
    
    await blockBlobClient.uploadBrowserData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    // Devolver SOLO el nombre del archivo, no la URL completa
    return finalBlobName;

  } catch (error: any) {
    console.error(`❌ Error subiendo imagen ${tipo}:`, error);
    throw new Error(`Error al subir la imagen ${file.name}: ${error.message}`);
  }
}

// Función auxiliar para generar nombres
function generateBlobName(file: File, eventoId: number, tipo: 'horizontal' | 'vertical' | 'zona'): string {
  const fileExtension = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `eventos/${eventoId}/${tipo}_${timestamp}_${randomString}.${fileExtension}`;
}

// Función de validación (mantenemos igual)
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
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}