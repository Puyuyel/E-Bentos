import React, { useState } from "react";
import {
  Grid,
  Column,
  TextInput,
  NumberInput,
  Button,
  FileUploaderDropContainer,
  Stack,
  IconButton,
} from "@carbon/react";
import { Add, TrashCan } from "@carbon/icons-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import "../../../styles/GestionEvento/SeccionZonas.css";

// Importamos la interfaz desde tu archivo principal. 
// Asegúrate de que la ruta sea correcta según donde guardes este archivo.
// Importamos la interfaz desde tu archivo principal. 
// Asegúrate de que la ruta sea correcta según donde guardes este archivo.
import type { FormDataEvento } from "./EventoCRUD"; 
// NOTA: Si te da error la importación de arriba, puedes borrarla 
// y copiar/pegar la interfaz 'FormDataEvento' aquí mismo temporalmente.

interface SeccionZonasProps {
  modo: string;
  isDisabled: boolean;
}

export default function SeccionZonas({ modo, isDisabled }: SeccionZonasProps) {
  const { register, setValue, control } = useFormContext<FormDataEvento>();
  
  // Hook para manejar la lista dinámica
  const { fields, append, remove } = useFieldArray({
    control,
    name: "zonas",
  });

  const [localImage, setLocalImage] = useState<File | null>(null);

  const handleImageUpload = (_: any, { addedFiles }: any) => {
    if (addedFiles.length > 0) {
      setLocalImage(addedFiles[0]);
      setValue("imagenZonasFiles", [addedFiles[0]]);
    }
  };

  return (
    <div className="seccion-zonas-container">
      <h4 className="seccion-titulo">Distribución y Precios</h4>
      
      <div className="zonas-layout">
        {/* IZQUIERDA: Mapa/Imagen */}
        <div className="columna-mapa">
          <p className="cds--file--label">Mapa de Zonas</p>
          <p className="cds--label-description">
            Sube una imagen referencial de las zonas.
          </p>
          
          {!isDisabled && (
             <FileUploaderDropContainer
               accept={["image/jpg", "image/png"]}
               labelText="Arrastra el mapa aquí"
               onAddFiles={handleImageUpload}
               disabled={isDisabled}
             />
          )}

          {localImage && (
            <div className="preview-imagen-container">
               <img 
                 src={URL.createObjectURL(localImage)} 
                 alt="Mapa de zonas" 
                 className="preview-imagen"
               />
               {!isDisabled && (
                 <Button kind="ghost" size="sm" onClick={() => { setLocalImage(null); setValue("imagenZonasFiles", []); }}>
                   Quitar imagen
                 </Button>
               )}
            </div>
          )}
        </div>

        {/* DERECHA: Lista de Zonas */}
        <div className="columna-lista">
          <div className="lista-header-actions">
            <h5>Listado de Zonas</h5>
            {!isDisabled && (
              <Button 
                renderIcon={Add} 
                size="sm" 
                kind="ghost" 
                onClick={() => append({ nombre: "", letra: "", aforo: 0, precio: 0 })}
              >
                Agregar
              </Button>
            )}
          </div>

          {/* Encabezados de la "Tabla" para no repetir labels */}
          {fields.length > 0 && (
            <div className="fila-encabezados">
              <span className="col-nombre">Nombre</span>
              <span className="col-letra">Letra</span>
              <span className="col-aforo">Aforo</span>
              <span className="col-precio">Precio</span>
              <span className="col-borrar"></span>
            </div>
          )}

          <div className="lista-items">
            {fields.map((field, index) => (
              <div key={field.id} className="fila-zona">
                <div className="campo-nombre">
                  <TextInput
                    id={`zona-nombre-${index}`}
                    labelText="Nombre"
                    hideLabel // Ocultamos el label visualmente
                    placeholder="Ej. VIP"
                    {...register(`zonas.${index}.nombre`, { required: true })}
                    readOnly={isDisabled}
                    size="lg"
                  />
                </div>
                <div className="campo-letra">
                  <TextInput
                    id={`zona-letra-${index}`}
                    labelText="Letra"
                    hideLabel
                    placeholder="A"
                    {...register(`zonas.${index}.letra`, { required: true })}
                    readOnly={isDisabled}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-aforo-${index}`}
                    label="Aforo"
                    hideLabel
                    min={0}
                    {...register(`zonas.${index}.aforo`, { valueAsNumber: true })}
                    readOnly={isDisabled}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-precio-${index}`}
                    label="Precio"
                    hideLabel
                    min={0}
                    {...register(`zonas.${index}.precio`, { valueAsNumber: true })}
                    readOnly={isDisabled}
                    size="lg"
                  />
                </div>
                
                {!isDisabled && (
                  <div className="campo-accion">
                    <IconButton
                      kind="danger"
                      label="Eliminar"
                      size="md"
                      onClick={() => remove(index)}
                    >
                      <TrashCan />
                    </IconButton>
                  </div>
                )}
              </div>
            ))}
            
            {fields.length === 0 && (
              <p className="mensaje-vacio">No hay zonas configuradas. Agrega una para comenzar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}