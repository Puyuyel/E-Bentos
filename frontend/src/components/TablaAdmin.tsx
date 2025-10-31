import { DataTable, IconButton, Link, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Pagination } from "@carbon/react";
import { useEffect, useMemo, useState } from "react";
import TablaCrudButtons from "./TablaCrudButtons";

interface TablaGestorProductorasProps{
  tipoGestor: string;
}

interface DataRow{
  data: string[]
}

/**********************************
Sección de modelos
***********************************/

// Representa un solo usuario
interface GestorLocal {
  id: number;
  name: string;
}

interface Productora {
  id: number;
  nombre: string;
  ruc: string;
}

interface PuntoDeVenta {
  id: number;
  nombre: string;
  direccion: string;
}

interface Taquillero {
  id: number;
  nombre: string;
  direccion: string;
}

/**********************************
Fin de Sección de modelos
***********************************/

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
  /**********************************
  Sección de paginación de la tabla
  ***********************************/
  const [allRows, setAllRows] = useState<DataRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  /**********************************
  Fin de Sección de paginación de la tabla
  ***********************************/

  /**********************************
  Sección de hardcodeo
  ***********************************/
  const headers: string[] = useMemo(() => {
    switch (tipoGestor) {
      case 'GestorLocal':
        return ['Local ID', 'Nombre', 'Dirección'];
      case 'Productora':
        return ['Productora ID', 'Nombre', 'Contacto'];
      case 'PuntoDeVenta':
        return ['Punto ID', 'Nombre', 'Ubicación'];
      case 'Taquillero':
        return ['Taquillero ID', 'Nombres', 'DNI'];
      default:
        return [];
    }
  }, [tipoGestor]);
  const rows: DataRow[] = useMemo(() => {
    switch (tipoGestor) {
      case 'GestorLocal':
        return [
          { data: ['1', 'Juan', 'Tamaulipas'] },
          { data: ['2', 'Mr. Sanguchito', 'Av. Universitaria'] }
        ];
      case 'Productora':
        return [
          { data: ['1', 'Juan', 'Tamaulipas'] },
          { data: ['2', 'Mr. Sanguchito', 'Av. Universitaria'] }
        ];
      case 'PuntoDeVenta':
        return [
          { data: ['1', 'Juan', 'Tamaulipas'] },
          { data: ['2', 'Mr. Sanguchito', 'Av. Universitaria'] }
        ];
      case 'Taquillero':
        return [
          { data: ['1', 'Juan', 'Tamaulipas'] },
          { data: ['2', 'Mr. Sanguchito', 'Av. Universitaria'] }
        ];
      default:
        return [];
    }
  }, [tipoGestor]);
  
  /**********************************
  Fin de Sección de hardcodeo
  ***********************************/
  /**********************************
  Sección APIs
  ***********************************/
  /*
  let headers: string[] = [];
  const [rows, setRows] = useState<DataRow[]> ([]);
  const [camposGestorLocal, setCamposGestorLocal] = useState<ApiResponse<GestorLocal> | null>(null);
  const [camposProductoras, setCamposProductoras] = useState<ApiResponse<Productora> | null>(null);
  const [camposPuntoDeVenta, setCamposPuntoDeVenta] = useState<ApiResponse<PuntoDeVenta> | null>(null);
  const [camposTaquillero, setCamposTaquillero] = useState<ApiResponse<Taquillero> | null>(null);
  switch (tipoGestor) {
    case 'GestorLocal':
      useEffect((): void => {
        fetch('/api/gestor-local')
          .then((res: Response): Promise<ApiResponse<GestorLocal>> => res.json())
          .then((data) => {
            const formatted: ApiResponse<GestorLocal> = 
            {
              data: data.data.map((item: any) => ({
                id: item.distritoId.toString(),
                name: item.nombre
              })),
              pagination: data.pagination
            };
            setCamposGestorLocal(formatted);
            //setCamposGestorLocal(data);  --> en caso la api devuelva el resultado esperado directo
          })
          .catch((err: Error): void => console.error('Error al cargar los distritos', err));
      }, []);
      headers = ['Local ID', 'Nombre', 'Dirección'];      //Cambiar según requisitos
      break;
    case 'Productora':
      useEffect((): void => {
        fetch('/api/productoras')
          .then((res: Response): Promise<ApiResponse<Productora>> => res.json())
          .then((data: ApiResponse<Productora>) => {
            setCamposProductoras(data);
          })
          .catch((err: Error): void => console.error('Error al cargar los distritos', err));
      }, []);
      headers = ['Productora ID', 'Nombre', 'Contacto'];  //Cambiar según requisitos
      break;
    case 'PuntoDeVenta':
      useEffect((): void => {
        fetch('/api/punto-de-venta')
          .then((res: Response): Promise<ApiResponse<PuntoDeVenta>> => res.json())
          .then((data: ApiResponse<PuntoDeVenta>) => {
            setCamposPuntoDeVenta(data);
          })
          .catch((err: Error): void => console.error('Error al cargar los distritos', err));
      }, []);
      headers = ['Punto ID', 'Nombre', 'Ubicación'];      //Cambiar según requisitos
      break;
    case 'Taquillero':
      useEffect((): void => {
        fetch('/api/taquillero')
          .then((res: Response): Promise<ApiResponse<Taquillero>> => res.json())
          .then((data: ApiResponse<Taquillero>) => {
            setCamposTaquillero(data);
          })
          .catch((err: Error): void => console.error('Error al cargar los distritos', err));
      }, []);
      headers = ['Taquillero ID', 'Nombres', 'DNI'];      //Cambiar según requisitos
      break;
    default:
      break;
  }
  
  setRows(
    camposProductoras!.data.map((item): DataRow => ({
      data: [String(item.id), item.nombre, item.ruc]
    }))
  );*/
  /**********************************
  Fin de Sección APIs
  ***********************************/

  /**********************************
  Sección de actualización de Paginación de la tabla
  ***********************************/
  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setAllRows(rows.slice(start, end));
  }, [currentPage, pageSize, rows]);
  /**********************************
  Fin de Sección de actualización de Paginación de la tabla
  ***********************************/

  /**********************************
  División de la tabla:
  - Haders
  - Data de las filas --> Para los botones de acciones ver 'TablaCrudButtons.tsx'
  - Paginación
  ***********************************/

  return(
    <div style={{ overflow: 'visible' }}>
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
          {allRows.map(({data}) => (
            <TableRow>                      
              {data.map((col: string) => (
                <TableCell>
                  {col}
                </TableCell>
              ))}
              <TableCell>
                <TablaCrudButtons 
                  entidad={tipoGestor}
                ></TablaCrudButtons>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={rows.length}
        pageSizes={[1, 2, 15, 20]}
        onChange={({ page, pageSize }) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}

export default TablaAdmin;