import { Button, IconButton, VStack } from "@carbon/react";
import { View, Edit, TrashCan } from '@carbon/icons-react';
import { Dialog, DialogBody, DialogCloseButton, DialogControls, DialogFooter, DialogHeader, DialogSubtitle, DialogTitle } from "@carbon/react/lib/components/Dialog";
import { useState, useEffect } from "react";
import { actualizarProductora, registrarProductora } from "../services/productoraService";
import { formulariosCrud } from "./util/formularios";
import { actualizarPuntoVenta,listarPuntoVentaXId,registrarPuntoVenta } from "../services/puntoVentaService";
import type { PuntoVenta } from "../types/puntoVenta.types";
import type { Productora } from "../types/productora.types";
import type { GestorLocal } from "../types/gestorLocal.types";
import { actualizarDuenho, actualizarGestorLocal, actualizarOrganizador, actualizarTaquillero, registrarDuenho, registrarGestorLocal, registrarOrganizador, registrarTaquillero } from "../services/gestorLocalService";
import { getUser } from "../services/authService";




interface TablaCrudButtonDialogProps {
  entidad: string;
  accion: string;
  datos: string[];
  raw?: any;
  onActualizar: () => void;
  uniqueId: number;
}

const TablaCrudButtonDialog: React.FC<TablaCrudButtonDialogProps> = ({
  entidad, accion, datos, raw, onActualizar, uniqueId
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  //const [errors, setErrors] = useState<any>({});

  const Formulario = formulariosCrud[entidad];
  //const validacionEntidad = validaciones[entidad] || {};
  
  const [validationState, setValidationState] = useState(1);

  useEffect(() => {
    if (accion === 'Agregar') {
      setFormData({});
      switch (entidad) {
        case 'Productora':
          setFormData(getEmptyProductora);
          break;
        case 'PuntoVenta':
          setFormData(getEmptyPuntoVenta);
          break;
        case 'GestorLocal':
          setFormData(getEmptyGestorLocal);
          break;
        case 'Taquillero':
          setFormData(getEmptyGestorLocal);
          break;
        case 'Organizador':
          setFormData(getEmptyGestorLocal);
          break;
        case 'Duenho':
          setFormData(getEmptyGestorLocal);
          break;
      }
    } else if (raw) {
      console.log(entidad);
      switch (entidad) {
        case 'Productora':
          const entityProd = raw as Productora;
          setFormData({
            usuarioId: entityProd.usuarioId,
            ruc: entityProd.ruc,
            razonSocial: entityProd.razonSocial,
            nombreComercial: entityProd.nombreComercial,
            email: entityProd.email,
            telefono: entityProd.telefono,
            contrasenha: '',
            estado: 'Activo' // Por default es activo. Preguntar si debería obtenerse del GET
          });
          break;
        case 'PuntoVenta':
          const entityPV = raw as PuntoVenta;
          setFormData({
            puntoventaId: entityPV.puntoventaId,
            nombre: entityPV.nombre,
            direccion: entityPV.direccion,
            departamentoId: entityPV.distrito?.provincia?.departamento?.departamentoId?.toString() || '',
            departamentoNombre: entityPV.distrito?.provincia?.departamento?.nombre,
            provinciaId: entityPV.distrito?.provincia?.provinciaId?.toString() || '',
            provinciaNombre: entityPV.distrito?.provincia?.nombre,
            distritoId: entityPV.distrito?.distritoId?.toString() || '',
            distritoNombre: entityPV.distrito?.nombre,
            estado: entityPV.activo ? 'Activo' : 'Inactivo'
          });
          break;
        case 'GestorLocal':
          const entityGL = raw as GestorLocal;
          setFormData({
            usuarioId: entityGL.usuarioId,
            telefono: entityGL.telefono,
            email: entityGL.email,
            dni: entityGL.dni,
            nombres: entityGL.nombres,
            apellidos: entityGL.apellidos,
            contrasenha: '',
            estado: 'Activo',
          });
          break;
        case 'Taquillero':
          const entityT = raw as GestorLocal;
          console.log(entityT);
          setFormData({
            usuarioId: entityT.usuarioId,
            telefono: entityT.telefono,
            email: entityT.email,
            dni: entityT.dni,
            nombres: entityT.nombres,
            apellidos: entityT.apellidos,
            contrasenha: '',
            puntoVentaId: entityT.puntoVenta.puntoVentaId,
            estado: 'Activo',
          });
          break;
        case 'Organizador':
          const entityO = raw as GestorLocal;
          setFormData({
            usuarioId: entityO.usuarioId,
            telefono: entityO.telefono,
            email: entityO.email,
            dni: entityO.dni,
            nombres: entityO.nombres,
            apellidos: entityO.apellidos,
            contrasenha: '',
            estado: 'Activo',
          });
          break;
        case 'Duenho':
          const entityD = raw as GestorLocal;
          setFormData({
            usuarioId: entityD.usuarioId,
            telefono: entityD.telefono,
            email: entityD.email,
            dni: entityD.dni,
            nombres: entityD.nombres,
            apellidos: entityD.apellidos,
            contrasenha: '',
            estado: 'Activo',
          });
          break;
        default:
          setFormData(raw);
      }
    }
  }, [raw, accion, entidad]);

  /**********************************
  Esta es la sección que arma los botones de Visualizar, Editar o Eliminar.
  Puede hacerse más genérico y armar una botonera personalizada con los parámetros, pero eso después...
  División del código:
  - Botón con icono (acción)
  + Dialogo:
    - Cuerpo del dialogo --> Revisar 'TablaCrudDialogForm.txs', podría ser implementado para todos los cruds
    - Footer del dialogo (botones)
  ***********************************/
  const isReadOnly: boolean = (accion == 'Visualizar')?  true : false ;
  return (
    <>
      {(accion === 'Agregar')
      ?
        <Button
          kind="primary"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {accion}
        </Button>
      :
        <IconButton
          size="sm"
          align="bottom"
          kind="primary"
          label={accion}
          onClick={() => {
            // Añadir lógica para abrir el diálogo de delete
            // Provisional
            if(['Visualizar', 'Editar'].includes(accion))
              setIsOpen(true);
          }}
        >
          {(accion == 'Visualizar')? <View size={12}/> : ((accion == 'Editar')? <Edit size={12}/> : <TrashCan size={12}/>)}
        </IconButton>
      }

      <Dialog
        aria-labelledby="title"
        modal
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <DialogHeader>
          <DialogTitle id="title">
            {accion + ' ' + entidad}
          </DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={() => setIsOpen(false)} />
          </DialogControls>
        </DialogHeader>

        <DialogBody>
          <VStack gap={4}>
            <Formulario
              isReadOnly={isReadOnly}
              formData={formData}
              setFormData={setFormData}
              isOpen={isOpen}
              accion={accion}
              uniqueId={uniqueId}
              validationState={validationState}
            />
          </VStack>
        </DialogBody>

        {(accion === 'Editar' || accion === 'Agregar') && (
          <DialogFooter>
            <Button kind="secondary" onClick={() => setIsOpen(false)} type="button">
              Cancelar
            </Button>
            <Button
              kind="primary"
              onClick={async () => {
                try {
                  let payload: any; let payloadAlt: any;
                  let currentUser = null;
                  setValidationState(2);
                  console.log(validationState);
                  switch (entidad) {
                    case 'Productora':
                      console.log(formData);
                      payload = {
                        //usuarioId: parseInt(formData.usuarioId),
                        ruc: formData.ruc,
                        razonSocial: formData.razonSocial,
                        nombreComercial: formData.nombreComercial,
                        email: formData.email,
                        telefono: formData.telefono,
                        contrasenha: formData.contrasenha, // preguntar por que piden esto
                        activo: (formData.estado === 'Activo')? 1:0  // preguntar por que piden esto
                      };
                      payloadAlt = {
                        ruc: formData.ruc,
                        razonSocial: formData.razonSocial,
                        nombreComercial: formData.nombreComercial,
                        email: formData.email,
                        telefono: formData.telefono,
                        contrasenha: formData.contrasenha, // preguntar por que piden esto
                      };
                      if (accion == 'Editar'){
                        await actualizarProductora(parseInt(formData.usuarioId), payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarProductora(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //setIsOpen(false);
                      break;

                    case 'PuntoVenta':
                      console.log(formData);
                      payload = {
                        puntoventaId: parseInt(formData.puntoventaId),
                        nombre: formData.nombre,
                        direccion: formData.direccion,
                        distrito: {
                          distritoId: parseInt(formData.distritoId),
                          provincia: {
                            provinciaId: parseInt(formData.provinciaId),
                            departamento: {
                              departamentoId: parseInt(formData.departamentoId),
                            }
                          }
                        },
                        activo: (formData.estado === 'Activo')? 1:0 
                      };
                      payloadAlt = {
                        //puntoventaId: parseInt(formData.puntoventaId),
                        nombre: formData.nombre,
                        direccion: formData.direccion,
                        distrito: {
                          distritoId: parseInt(formData.distritoId),
                          provincia: {
                            provinciaId: parseInt(formData.provinciaId),
                            departamento: {
                              departamentoId: parseInt(formData.departamentoId),
                            }
                          }
                        },
                        activo: 1
                      };
                      if (accion == 'Editar'){
                        await actualizarPuntoVenta(payload.puntoventaId, payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarPuntoVenta(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //await actualizarPuntoVenta(payload.puntoventaId, payload);
                      break;

                    case 'GestorLocal':
                      if (accion === 'Agregar') {
                        currentUser = await getUser();
                      }
                      payload = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        dni: formData.dni,
                        nombres: formData.nombres,
                        apellidos: formData.apellidos,
                        puntoVenta: null,
                        activo: (formData.estado === 'Activo')? 1:0 
                      };
                      payloadAlt = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        nombreRol: 'GESTOR_LOCAL', // del listado de roles, falta implementar
                        nombres: formData.nombres, 
                        apellidos: formData.apellidos, 
                        dni: formData.dni,
                        usuarioCreador: {
                          usuarioId: currentUser?.usuarioId || 0,
                        },
                        puntoVenta: null
                      };
                      console.log("payload: ");
                      console.log(payload);
                      if (accion == 'Editar'){
                        await actualizarGestorLocal(parseInt(formData.usuarioId), payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarGestorLocal(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //await actualizarGestorLocal(raw.usuarioId, payload);
                      break;

                    case 'Taquillero':
                      console.log(formData);
                      let puntoVenta: PuntoVenta | null = null;
 
                      if (accion === 'Agregar') {
                        currentUser = await getUser();
                      }
                      if (accion === 'Editar') {
                        puntoVenta = await listarPuntoVentaXId(parseInt(formData.puntoVentaId));
                        console.log(puntoVenta);
                      }
                      payload = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        dni: formData.dni,
                        nombres: formData.nombres,
                        apellidos: formData.apellidos,
                        puntoVenta: {
                          puntoVentaId: formData.puntoVentaId,
                          nombre: puntoVenta?.nombre,
                          direccion: puntoVenta?.direccion,
                          distrito: {
                            distritoId: puntoVenta?.distrito.distritoId,
                            nombre: puntoVenta?.distrito.nombre,
                            provincia: {
                              diprovinciaId: puntoVenta?.distrito.provincia.provinciaId,
                              nombre: puntoVenta?.distrito.provincia.nombre,
                              departamento: {
                                diprovinciaId: puntoVenta?.distrito.provincia.departamento.departamentoId,
                                nombre: puntoVenta?.distrito.provincia.departamento.nombre,
                              }
                            }
                          }
                        },
                        activo: (formData.estado === 'Activo')? 1:0 
                      };
                      payloadAlt = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        nombreRol: 'TAQUILLERO',
                        nombres: formData.nombres, 
                        apellidos: formData.apellidos, 
                        dni: formData.dni,
                        usuarioCreador: {
                          usuarioId: currentUser?.usuarioId || 0,
                        },
                        puntoVenta: {
                          puntoVentaId: formData.puntoVentaId,
                        },
                      };
                      console.log(payload);
                      if (accion == 'Editar'){
                        await actualizarTaquillero(parseInt(formData.usuarioId), payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarTaquillero(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //await actualizarTaquillero(raw.usuarioId, payload);
                      break;
                    case 'Organizador':
                      if (accion === 'Agregar') {
                        currentUser = await getUser();
                      }
                      payload = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        dni: formData.dni,
                        nombres: formData.nombres,
                        apellidos: formData.apellidos,
                        puntoVenta: null,
                        activo: (formData.estado === 'Activo')? 1:0 
                      };
                      payloadAlt = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        nombreRol: 'ORGANIZADOR_EVENTOS', // del listado de roles, falta implementar
                        nombres: formData.nombres, 
                        apellidos: formData.apellidos, 
                        dni: formData.dni,
                        usuarioCreador: {
                          usuarioId: currentUser?.usuarioId || 0,
                        },
                        puntoVenta: null
                      };
                      console.log("payload: ");
                      console.log(payload);
                      if (accion == 'Editar'){
                        console.log("Hola ");
                        await actualizarOrganizador(parseInt(formData.usuarioId), payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarOrganizador(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //await actualizarGestorLocal(raw.usuarioId, payload);
                      break;
                    case 'Duenho':
                      if (accion === 'Agregar') {
                        currentUser = await getUser();
                      }
                      payload = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        dni: formData.dni,
                        nombres: formData.nombres,
                        apellidos: formData.apellidos,
                        puntoVenta: null,
                        activo: (formData.estado === 'Activo')? 1:0 
                      };
                      payloadAlt = {
                        telefono: formData.telefono,
                        email: formData.email,
                        contrasenha: formData.contrasenha,
                        nombreRol: 'DUENHO_LOCAL', // del listado de roles, falta implementar
                        nombres: formData.nombres, 
                        apellidos: formData.apellidos, 
                        dni: formData.dni,
                        usuarioCreador: {
                          usuarioId: currentUser?.usuarioId || 0,
                        },
                        puntoVenta: null
                      };
                      console.log("payload: ");
                      console.log(payload);
                      if (accion == 'Editar'){
                        console.log("Hola ");
                        await actualizarDuenho(parseInt(formData.usuarioId), payload).then( () => {onActualizar(); setIsOpen(false); } )
                      } else {
                        await registrarDuenho(payloadAlt).then( () => {onActualizar(); setIsOpen(false); } );
                      }
                      //await actualizarGestorLocal(raw.usuarioId, payload);
                      break;
                    // otros casos...
                  }

                  //onActualizar();
                  console.log("Actualización exitosa");
                  //setIsOpen(false);
                } catch (err) {
                  console.error("Error al actualizar");
                }
              }}
              type="button"
            >
              {(accion === 'Editar')? 'Guardar':'Agregar'}
            </Button>
          </DialogFooter>
        )}
      </Dialog>
    </>
  );
}

export default TablaCrudButtonDialog;

function getEmptyProductora(){
  return {
    ruc: '', razonSocial: '', nombreComercial: '', email: '', telefono: '', usuarioId: 0 // reemplazar el usuarioId por el usuario de la persona actual
  };
}

function getEmptyPuntoVenta(){
  return {
    nombre: '', direccion: '', departamentoId: 0, departamentoNombre: '', provinciaId: 0, provinciaNombre: '', distritoId: 0,distritoNombre: '', estado: 'Activo' // reemplazar el usuarioId por el usuario de la persona actual
  };
}

function getEmptyGestorLocal(){
  return {
    ruc: '', razonSocial: '', nombreComercial: '', email: '', telefono: '', usuarioId: 0, estado: 'Activo', puntoventaId: 0 // reemplazar el usuarioId por el usuario de la persona actual
  };
}