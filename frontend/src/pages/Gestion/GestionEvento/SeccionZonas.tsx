import React, { useState, useEffect } from "react";
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
import type { FormDataEvento } from "./EventoCRUD";

interface SeccionZonasProps {
  modo: string;
  isDisabled: boolean;
}

export default function SeccionZonas({ modo, isDisabled }: SeccionZonasProps) {
  const { register, setValue, control, watch } = useFormContext<FormDataEvento>();
  
  // Hook para manejar la lista dinámica
  const { fields, append, remove } = useFieldArray({
    control,
    name: "zonas",
  });

  // Observar el archivo de imagen de zonas
  const imagenZonasFile = watch("imagenZonasFile");
  const [imagenZonasExistente, setImagenZonasExistente] = useState<string | null>(null);

  // En modo editar o visualizar, las zonas no son editables
  const zonasEditables = modo === "crear";
  const imagenEditable = modo === "crear";

  // Cargar imagen de zonas existente si estamos en editar/visualizar
  useEffect(() => {
    if (modo !== "crear") {
      // En una implementación real, aquí obtendrías la imagen de zonas del evento
      const baseUrl = "https://ebentos.blob.core.windows.net/images/";
      // Esto debería venir de tu API
      setImagenZonasExistente(`${baseUrl}eventos/1/zona_example.jpg`);
    }
  }, [modo]);

  const handleImageUpload = (_: any, { addedFiles }: any) => {
    if (addedFiles.length > 0 && imagenEditable) {
      setValue("imagenZonasFile", addedFiles[0]);
      setImagenZonasExistente(null);
    }
  };

  const handleRemoveImage = () => {
    if (imagenEditable) {
      setValue("imagenZonasFile", null);
      if (imagenZonasExistente) {
        setImagenZonasExistente(imagenZonasExistente);
      }
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
            {!imagenEditable ? "Mapa de zonas del evento" : "Sube una imagen referencial de las zonas."}
          </p>
          
          {imagenEditable && (
            <FileUploaderDropContainer
              accept={["image/jpg", "image/png"]}
              labelText="Arrastra el mapa aquí"
              onAddFiles={handleImageUpload}
              disabled={!imagenEditable}
            />
          )}

          {/* Mostrar imagen existente en modo visualizar/editar */}
          {!imagenZonasFile && imagenZonasExistente && (
            <div className="preview-imagen-container">
              <img 
                src={imagenZonasExistente} 
                alt="Mapa de zonas existente" 
                className="preview-imagen"
              />
              {!imagenEditable && (
                <p style={{ fontSize: "0.75rem", textAlign: "center", marginTop: "8px" }}>
                  Mapa de zonas actual
                </p>
              )}
            </div>
          )}

          {/* Mostrar nueva imagen subida */}
          {imagenZonasFile && (
            <div className="preview-imagen-container">
              <img 
                src={URL.createObjectURL(imagenZonasFile)} 
                alt="Nuevo mapa de zonas" 
                className="preview-imagen"
              />
              {imagenEditable && (
                <Button kind="ghost" size="sm" onClick={handleRemoveImage}>
                  Quitar imagen
                </Button>
              )}
            </div>
          )}

          {/* Mensaje si no hay imagen */}
          {!imagenZonasFile && !imagenZonasExistente && !imagenEditable && (
            <p style={{ fontStyle: "italic", color: "#6f6f6f" }}>
              No hay mapa de zonas disponible
            </p>
          )}
        </div>

        {/* DERECHA: Lista de Zonas */}
        <div className="columna-lista">
          <div className="lista-header-actions">
            <h5>Listado de Zonas</h5>
            {zonasEditables && (
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
              {zonasEditables && <span className="col-borrar"></span>}
            </div>
          )}

          <div className="lista-items">
            {fields.map((field, index) => (
              <div key={field.id} className="fila-zona">
                <div className="campo-nombre">
                  <TextInput
                    id={`zona-nombre-${index}`}
                    labelText="Nombre"
                    hideLabel
                    placeholder="Ej. VIP"
                    value={field.nombre || ""}
                    {...register(`zonas.${index}.nombre`, { required: true })}
                    readOnly={!zonasEditables}
                    disabled={!zonasEditables}
                    size="lg"
                  />
                </div>
                <div className="campo-letra">
                  <TextInput
                    id={`zona-letra-${index}`}
                    labelText="Letra"
                    hideLabel
                    placeholder="A"
                    value={field.letra || ""}
                    {...register(`zonas.${index}.letra`, { required: true })}
                    readOnly={!zonasEditables}
                    disabled={!zonasEditables}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-aforo-${index}`}
                    label="Aforo"
                    hideLabel
                    min={0}
                    value={field.aforo || 0}
                    {...register(`zonas.${index}.aforo`, { 
                      valueAsNumber: true,
                      required: true 
                    })}
                    readOnly={!zonasEditables}
                    disabled={!zonasEditables}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-precio-${index}`}
                    label="Precio"
                    hideLabel
                    min={0}
                    value={field.precio || 0}
                    {...register(`zonas.${index}.precio`, { 
                      valueAsNumber: true,
                      required: true 
                    })}
                    readOnly={!zonasEditables}
                    disabled={!zonasEditables}
                    size="lg"
                  />
                </div>
                
                {zonasEditables && (
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
              <p className="mensaje-vacio">
                {!zonasEditables 
                  ? "No hay zonas configuradas para este evento." 
                  : "No hay zonas configuradas. Agrega una para comenzar."
                }
              </p>
            )}
          </div>

          {/* Mensaje informativo en modo editar */}
          {modo === "editar" && fields.length > 0 && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              fontSize: "0.875rem"
            }}>
              ℹ️ Las zonas no se pueden modificar una vez creado el evento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}