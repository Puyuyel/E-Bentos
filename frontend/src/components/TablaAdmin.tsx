import { DataTable, IconButton, Link, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Pagination, Search, Button, Loading } from "@carbon/react";
import { useEffect, useMemo, useState } from "react";
import TablaCrudButtons from "./TablaCrudButtons";
import { listarProductoras, listarProductorasPaginado } from "../services/productoraService";
import { listarGestoresLocales, listarTaquilleros, listarOrganizadores, listarDuenhos } from "../services/gestorLocalService";
import { listarPuntosVenta } from "../services/puntoVentaService";
import '../styles/CargaSpinner.css'


// Sección de modelos
import type { GestorLocal } from "../types/gestorLocal.types";
import type { PuntoVenta } from "../types/puntoVenta.types";
import TablaCrudButtonDialog from "./TablaCrudButtonDialog";
import type { Productora } from "../types/productora.types";
// Fin sección de modelos

interface TablaGestorProductorasProps{
  tipoGestor: string;
}

interface DataRow{
  id: number;
  data: string[];
  raw?: any;
}

// Representa la información de paginación
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string;      // URL como string
  prevPage: string;      // URL como string
}

// Representa la respuesta completa de la API
interface ApiResponse<T> {
  data: T[];
  pagination: Pagination;
}

const TablaAdmin: React.FC<TablaGestorProductorasProps> = ({
  tipoGestor
}) => {
  //listarProductorasPaginado(1,10,'');
  //listarOrganizadores();
  /**********************************
  Sección de paginación de la tabla
  ***********************************/
  const [allRows, setAllRows] = useState<DataRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  /**********************************
  Fin de Sección de paginación de la tabla
  ***********************************/

  /**********************************
  Sección de cabeceras
  ***********************************/
  const headers: string[] = useMemo(() => {
    switch (tipoGestor) {
      case 'GestorLocal':
        return ['Nombres', 'Apellidos', 'DNI', 'Email', 'Teléfono'];
      case 'Productora':
        return ['RUC', 'Razon Social', 'Nombre Comercial','Email','Teléfono'];
      case 'PuntoVenta':
        return ['Nombre', 'Dirección', 'Departamento', 'Provincia', 'Distrito', 'Estado'];
      case 'Taquillero':
        return ['Nombres', 'Apellidos', 'DNI', 'Email', 'Teléfono', 'Punto de Venta'];
      case 'Organizador':
        return ['Nombres', 'Apellidos', 'DNI', 'Email', 'Teléfono']; // fecha de nacimiento?
      case 'Duenho':
        return ['Nombres', 'Apellidos', 'DNI', 'Email', 'Teléfono']; // estado?
      default:
        return [];
    }
  }, [tipoGestor]);
  /**********************************
  Fin de Sección de cabeceras
  ***********************************/
  /**********************************
  Sección APIs
  ***********************************/
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<DataRow[]> ([]);
  useEffect(() => {
    const fetchers: Record<string, () => Promise<any[]>> = {
      Productora: listarProductoras,
      GestorLocal: listarGestoresLocales,
      Taquillero: listarTaquilleros,
      PuntoVenta: listarPuntosVenta,
      Organizador: listarOrganizadores,
      Duenho: listarDuenhos,
    };

    const transformadores: Record<string, (item: any, index: number) => DataRow> = {
      Productora: (item, index) => ({
        id: index,
        data: [
          String(item.usuarioId),
          item.ruc,
          item.razonSocial,
          item.nombreComercial,
          item.email,
          item.telefono
        ],
        raw: item
      }),
      GestorLocal: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId), // índice 0 (oculto)
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'
        ],
        raw: item
      }),
      // Taquillero: (item, index) => ({ id: index, data: [item.nombre, item.cedula] }),
      PuntoVenta: (item: PuntoVenta, index) => ({
        id: index,
        data: [
          String(item.puntoventaId),
          item.nombre,
          item.direccion,
          item.distrito?.provincia?.departamento?.nombre || '—',
          item.distrito?.provincia?.nombre || '—',
          item.distrito?.nombre || '—',
          item.activo ? 'Activo' : 'Inactivo'
        ],
        raw: item
      }),
      Taquillero: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId), // este no se muestra
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          item.puntoVenta.nombre  // Taquillero siempre tiene un Punto de venta
        ],
        raw: item
      }),
      Organizador: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId), // índice 0 (oculto)
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'
        ],
        raw: item
      }),
      Duenho: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId), // índice 0 (oculto)
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'
        ],
        raw: item
      }),
    };

    const fetchAndMap = async () => {
      const fetcher = fetchers[tipoGestor];
      const transform = transformadores[tipoGestor];

      if (!fetcher || !transform) return;

      setIsLoading(true);
      try {
        const data = await fetcher();
        const mapped: DataRow[] = data.map(transform);
        setRows(mapped);
      } catch (err: any) {
        console.error(`Error al listar ${tipoGestor}:`, err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMap();
  }, [tipoGestor]);

  /**********************************
  Fin de Sección APIs
  ***********************************/

  /**********************************
  Sección de actualización de Paginación de la tabla
  ***********************************/
  // IMPLEMENTAR <--------
  /**********************************
  Fin de Sección de actualización de Paginación de la tabla
  ***********************************/

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    return rows.filter(({ data }) =>
      data.some((col) =>
        col.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);
  
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setAllRows(filteredRows.slice(start, end));
  }, [currentPage, pageSize, filteredRows]);
  
  // En esta sección se actualizan los objetos tras haber modificado o agregado un objeto //

  const actualizarTabla = async () => {
    const fetchers: Record<string, () => Promise<any[]>> = {
      Productora: listarProductoras,
      GestorLocal: listarGestoresLocales,
      PuntoVenta: listarPuntosVenta,
      Taquillero: listarTaquilleros,
      Organizador: listarOrganizadores,
      Duenho: listarDuenhos,
    };
    //console.log(fetchers.Productora);
    const transformadores: Record<string, (item: any, index: number) => DataRow> = {
      Productora: (item: Productora, index) => ({
        id: index,
        data: [
          String(item.usuarioId),
          item.ruc,
          item.razonSocial,
          item.nombreComercial,
          item.email,
          item.telefono
        ]
      }),
      GestorLocal: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId),
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'  //Cambiar despues porque el gestor de locales no tiene punto de venta
        ]
      }),
      PuntoVenta: (item: PuntoVenta, index) => ({
        id: index,
        data: [
          String(item.puntoventaId),
          item.nombre,
          item.direccion,
          item.distrito?.provincia?.departamento?.nombre || '—',
          item.distrito?.provincia?.nombre || '—',
          item.distrito?.nombre || '—',
          item.activo ? 'Activo' : 'Inactivo'
        ]
      }),
      Taquillero: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId),
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          item.puntoVenta.nombre  // Taquillero siempre tiene un Punto de venta
        ]
      }),
      Organizador: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId),
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'  //Cambiar despues porque el gestor de locales no tiene punto de venta
        ]
      }),
      Duenho: (item: GestorLocal, index) => ({
        id: index,
        data: [
          String(item.usuarioId), // índice 0 (oculto)
          item.nombres,
          item.apellidos,
          item.dni,
          item.email,
          item.telefono,
          //item.puntoVenta?.nombre || '—'
        ],
        raw: item
      }),
    };

    const fetcher = fetchers[tipoGestor];
    const transform = transformadores[tipoGestor];

    if (!fetcher || !transform) return;

    try {
      const data = await fetcher();
      const mapped: DataRow[] = data.map(transform);
      setRows(mapped);

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setAllRows(mapped.slice(start, end));
    } catch (err: any) {
      console.error(`Error al actualizar ${tipoGestor}:`, err.message);
    }
  };

  /**********************************
  División de la tabla:
  - Haders
  - Data de las filas --> Para los botones de acciones ver 'TablaCrudButtons.tsx'
  - Paginación
  ***********************************/
  if (isLoading) {
    return (
      <div className="loader">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    );
  }
  return(
    <div style={{ width: 'calc(100vw - 17rem)', overflow: 'visible' }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ flexGrow: 1 }}>
          <Search
            id="buscador"
            labelText="Buscar"
            placeholder="Buscar por nombre, RUC, etc."
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TablaCrudButtonDialog entidad={tipoGestor} accion="Agregar" datos={[]} onActualizar={actualizarTabla} uniqueId={0}></TablaCrudButtonDialog>
      </div>
      <Table
        aria-label="sample table"
        size="lg"
      >
        <TableHead>
          <TableRow>
            {headers.map((header: string) => (
              <TableHeader>
                {header}
              </TableHeader>
            ))}
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRows.map((row) => (
            <TableRow key={row.id}>
              {row.data.slice(1).map((col: string, i: number) => (
                <TableCell key={i}>{col}</TableCell>
              ))}
              <TableCell>
                <TablaCrudButtons
                  entidad={tipoGestor}
                  datos={row.data}
                  raw={row.raw}
                  onActualizar={actualizarTabla}
                  uniqueId={row.id + 1}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={rows.length}
        pageSizes={[5, 10, 15, 20]}
        onChange={({ page, pageSize }) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default TablaAdmin;