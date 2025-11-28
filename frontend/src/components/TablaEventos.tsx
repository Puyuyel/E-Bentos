// TablaEventos.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Pagination, Search, Button } from "@carbon/react";
import { Add } from "@carbon/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarEventosFiltrados } from "../services/eventoService";
import '../styles/CargaSpinner.css';
import type { EventoBackend } from "../types/event.types";
import { useAuthStore } from "../store/useAuthStore";
import eliminarEvento from "../services/EventosServices/eliminarEvento";
import { GoEye, GoPencil, GoTrash } from "react-icons/go";

interface DataRow {
  id: number;
  data: string[];
  raw: EventoBackend;
}

const TablaEventos: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para datos y paginación
  const { user } = useAuthStore();
  const [eventos, setEventos] = useState<EventoBackend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Cabeceras específicas para eventos
  const headers = ['Nombre', 'Local', 'Fecha', 'Hora de Inicio', 'Duración', 'Estado', 'Acciones'];

  // Función para cargar eventos
  const cargarEventos = async () => {
    setIsLoading(true);
    try {
      const data = await listarEventosFiltrados(Number(user?.id));
      console.log(data);
      setEventos(data);
    } catch (err: any) {
      console.error('Error al cargar eventos:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    cargarEventos();
  }, []);

  // Transformar eventos a filas de tabla
  const rows: DataRow[] = useMemo(() => {
    return eventos.map((evento) => {
      const fecha = new Date(evento.fechaHorarioInicio);
      const fechaInicio = fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const horaInicio = fecha.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return {
        id: evento.eventoId,
        data: [
          evento.nombre || '—',
          evento.local?.nombre || "—",
          fechaInicio,
          horaInicio,
          evento.duracionEstimada ? `${evento.duracionEstimada} min` : '—',
          evento.estado || '—'
        ],
        raw: evento
      };
    });
  }, [eventos]);

  // Filtrar filas basado en la búsqueda
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    return rows.filter(({ data }) =>
      data.some((col) =>
        col.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, rows]);

  // Calcular filas para la página actual
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRows.slice(start, end);
  }, [currentPage, pageSize, filteredRows]);

  // Funciones para navegación
  const handleVerDetalles = (eventoId: number) => {
    navigate(`/organizador/eventos/ver/${eventoId}`);
  };

  const handleEditar = (eventoId: number) => {
    navigate(`/organizador/eventos/editar/${eventoId}`);
  };

  const handleAgregarEvento = () => {
    navigate('/organizador/eventos/crear');
  };

  const handleEliminar = async (evento: EventoBackend) => {
    if (window.confirm(`¿Estás seguro de eliminar el evento "${evento.nombre}"?`)) {
      try {
        // Aquí iría la llamada a la API para eliminar
        await eliminarEvento(evento.eventoId);
        console.log('Eliminando evento:', evento.eventoId);
        await cargarEventos();
        alert('Evento eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('Error al eliminar el evento');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    );
  }

  return (
    <div style={{ width: 'calc(100vw - 17rem)', overflow: 'visible' }}>
      {/* Header con botón agregar y búsqueda */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <Button
          onClick={handleAgregarEvento}
          size="lg"
          style={{ marginRight: "auto" }}
          renderIcon={Add}
        >
          Agregar Evento
        </Button>
        <div style={{ flexGrow: 1, maxWidth: "400px" }}>
          <Search
            id="buscador-eventos"
            labelText="Buscar eventos"
            placeholder="Buscar por nombre, local, estado..."
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de eventos */}
      <Table aria-label="Tabla de eventos" size="lg">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableHeader key={index}>
                {header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <TableRow key={row.id}>
                {row.data.map((col, i) => (
                  <TableCell key={i}>{col}</TableCell>
                ))}
                <TableCell>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button
                      size="sm"
                      kind="ghost"
                      onClick={() => handleVerDetalles(row.raw.eventoId)}
                      title="Ver detalles"
                    >
                      <GoEye size={18}/>
                    </Button>
                    <Button
                      size="sm"
                      kind="ghost"
                      onClick={() => handleEditar(row.raw.eventoId)}
                      title="Editar"
                    >
                      <GoPencil size={18}/>
                    </Button>
                    <Button
                      size="sm"
                      kind="danger--ghost"
                      onClick={() => handleEliminar(row.raw)}
                      title="Eliminar"
                    >
                      <GoTrash size={18}/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                {searchTerm ? 'No se encontraron eventos que coincidan con la búsqueda' : 'No hay eventos registrados'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      {filteredRows.length > 0 && (
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          pageSizes={[5, 10, 15, 20]}
          totalItems={filteredRows.length}
          onChange={({ page, pageSize }) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      )}
    </div>
  );
};

export default TablaEventos;