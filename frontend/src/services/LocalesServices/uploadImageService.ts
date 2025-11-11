import { BlobServiceClient } from "@azure/storage-blob";

import type {
  FormDataLocal,
  FormDataLocalUpdate,
} from "../../types/locales.types.ts";

async function uploadImage(
  data: FormDataLocal | FormDataLocalUpdate
): Promise<string> {
  // URL con SAS
  const sasUrl =
    "https://ebentos.blob.core.windows.net/images?sp=racwdli&st=2025-11-10T03:51:52Z&se=2025-12-25T12:06:52Z&spr=https&sv=2024-11-04&sr=c&sig=sZX4%2BWWhe2xI1DugNWJY7iW46pxQEzj9egmwAuqsNkw%3D";

  const containerClient = new BlobServiceClient(sasUrl).getContainerClient("");

  // crea un nombre único para la imagen
  const blobName = `${data.direccion}-${data.foto}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);

  // sube el archivo
  try {
    await blobClient.uploadBrowserData(data.fotoFile as Blob, {
      blobHTTPHeaders: { blobContentType: (data.fotoFile as File).type },
    });
  } catch (err) {
    console.error("Error subiendo la imagen a Azure Blob Storage:", err);
    throw new Error(
      "Error al subir la imagen. Verifica el SAS Token o la red."
    );
  }

  // devuelve la URL pública
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${blobName}`;
}
export default uploadImage;
