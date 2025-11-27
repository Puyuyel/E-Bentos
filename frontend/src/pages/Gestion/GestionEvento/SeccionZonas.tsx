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
  imagenZonasExistente?: string;
}

export default function SeccionZonas({ modo, isDisabled, imagenZonasExistente }: SeccionZonasProps) {
  const { register, setValue, control, watch } = useFormContext<FormDataEvento>();
  
  // Hook para manejar la lista dinámica
  const { fields, append, remove } = useFieldArray({
    control,
    name: "zonas",
  });

  // Observar el archivo de imagen de zonas
  const imagenZonasFile = watch("imagenZonasFile");
  const [mostrarImagenExistente, setMostrarImagenExistente] = useState(true);

  // Cargar imagen de zonas existente cuando cambie la prop
  useEffect(() => {
    if (modo !== "crear" && imagenZonasExistente && imagenZonasExistente !== "") {
      console.log("🖼️ Imagen de zonas existente disponible:", imagenZonasExistente);
      setMostrarImagenExistente(true);
    } else {
      setMostrarImagenExistente(false);
    }
  }, [modo, imagenZonasExistente]);

  // Cuando se sube una nueva imagen, ocultar la existente
  useEffect(() => {
    if (imagenZonasFile) {
      setMostrarImagenExistente(false);
    } else if (modo !== "crear" && imagenZonasExistente) {
      setMostrarImagenExistente(true);
    }
  }, [imagenZonasFile, modo, imagenZonasExistente]);

  const handleImageUpload = (_: any, { addedFiles }: any) => {
    if (addedFiles.length > 0 && !isDisabled) {
      setValue("imagenZonasFile", addedFiles[0]);
      setMostrarImagenExistente(false); // Ocultar imagen existente al subir nueva
    }
  };

  const handleRemoveImage = () => {
    if (!isDisabled) {
      setValue("imagenZonasFile", null);
      
      // Si estamos en modo editar y hay imagen existente, volver a mostrarla
      if (modo !== "crear" && imagenZonasExistente) {
        setMostrarImagenExistente(true);
      } else {
        setMostrarImagenExistente(false);
      }
    }
  };

  // Función para manejar error al cargar imagen
  const handleImageError = () => {
    console.error("❌ Error cargando imagen de zonas:", imagenZonasExistente);
    setMostrarImagenExistente(false);
  };

  // Función para cambiar a modo de subir nueva imagen
  const handleCambiarImagen = () => {
    if (!isDisabled) {
      setMostrarImagenExistente(false);
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
            {isDisabled ? "Mapa de zonas del evento" : "Sube una imagen referencial de las zonas."}
          </p>

          {/* MODO 1: Mostrar imagen existente (solo en editar/visualizar) */}
          {mostrarImagenExistente && imagenZonasExistente && !imagenZonasFile && (
            <div className="preview-imagen-container">
              <img 
                src={imagenZonasExistente} 
                alt="Mapa de zonas existente" 
                className="preview-imagen"
                onError={handleImageError}
              />
              {isDisabled ? (
                <p style={{ fontSize: "0.75rem", textAlign: "center", marginTop: "8px" }}>
                  Mapa de zonas actual
                </p>
              ) : (
                <div style={{ display: "flex", gap: "8px", flexDirection: "column", alignItems: "center" }}>
                  <Button kind="ghost" size="sm" onClick={handleCambiarImagen}>
                    Cambiar imagen
                  </Button>
                  <p style={{ fontSize: "0.75rem", color: "#666", textAlign: "center" }}>
                    Puedes reemplazar la imagen actual
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MODO 2: Mostrar opción para subir nueva imagen (cuando no hay imagen existente o se quiere cambiar) */}
          {(!mostrarImagenExistente || modo === "crear") && !imagenZonasFile && (
            <>
              {!isDisabled && (
                <FileUploaderDropContainer
                  accept={["image/jpg", "image/jpeg", "image/png"]}
                  labelText="Arrastra el mapa aquí"
                  onAddFiles={handleImageUpload}
                  disabled={isDisabled}
                />
              )}
              
              {/* Botón para volver a ver imagen existente (solo en editar cuando hay imagen existente) */}
              {modo === "editar" && imagenZonasExistente && !isDisabled && (
                <Button
                  kind="ghost"
                  size="sm"
                  onClick={() => setMostrarImagenExistente(true)}
                  style={{ marginTop: "16px" }}
                >
                  Ver imagen actual
                </Button>
              )}
            </>
          )}

          {/* MODO 3: Mostrar nueva imagen subida */}
          {imagenZonasFile && (
            <div className="preview-imagen-container">
              <img 
                src={URL.createObjectURL(imagenZonasFile)} 
                alt="Nuevo mapa de zonas" 
                className="preview-imagen"
              />
              {!isDisabled && (
                <Button kind="ghost" size="sm" onClick={handleRemoveImage}>
                  {modo === "crear" ? "Quitar imagen" : "Cancelar cambio"}
                </Button>
              )}
            </div>
          )}

          {/* Mensaje si no hay imagen en modo visualizar */}
          {isDisabled && !mostrarImagenExistente && !imagenZonasExistente && (
            <p style={{ fontStyle: "italic", color: "#6f6f6f", textAlign: "center" }}>
              No hay mapa de zonas disponible
            </p>
          )}

          {/* Mensaje si no hay imagen en modo crear/editar */}
          {!isDisabled && !mostrarImagenExistente && !imagenZonasFile && !imagenZonasExistente && (
            <p style={{ fontStyle: "italic", color: "#6f6f6f", textAlign: "center" }}>
              No se ha subido ningún mapa de zonas
            </p>
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
              {!isDisabled && <span className="col-borrar"></span>}
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
                    {...register(`zonas.${index}.nombre`, { required: true })}
                    readOnly={isDisabled}
                    disabled={isDisabled}
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
                    disabled={isDisabled}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-aforo-${index}`}
                    label="Aforo"
                    hideLabel
                    min={0}
                    value={watch(`zonas.${index}.aforo`) || 0}
                    {...register(`zonas.${index}.aforo`, { 
                      valueAsNumber: true,
                      required: true 
                    })}
                    readOnly={isDisabled}
                    disabled={isDisabled}
                    size="lg"
                  />
                </div>
                <div className="campo-numero">
                  <NumberInput
                    id={`zona-precio-${index}`}
                    label="Precio"
                    hideLabel
                    min={0}
                    value={watch(`zonas.${index}.precio`) || 0}
                    {...register(`zonas.${index}.precio`, { 
                      valueAsNumber: true,
                      required: true 
                    })}
                    readOnly={isDisabled}
                    disabled={isDisabled}
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
              <p className="mensaje-vacio">
                {isDisabled 
                  ? "No hay zonas configuradas para este evento." 
                  : "No hay zonas configuradas. Agrega una para comenzar."
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}