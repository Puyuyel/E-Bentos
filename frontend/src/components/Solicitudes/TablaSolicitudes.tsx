// src/components/Solicitudes/TablaSolicitudes.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  Pagination,
} from "@carbon/react";
import { listarSolicitudesPaginado, cambiarEstadoSolicitud } from "../../services/solicitudService";
import { useAuthStore } from "../../store/useAuthStore";
import type { Solicitud, EstadoSolicitud } from "../../types/solicitud.types";
import SolicitudEstadoBadge from "./SolicitudEstadoBadge";
import SolicitudDetalleExpandido from "./SolicitudDetalleExpandido";
import "../../styles/Solicitudes/TablaSolicitudes.css";

const TablaSolicitudes: React.FC = () => {
  const { user } = useAuthStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const headers = [
    { key: "nombreEvento", header: "Nombre del Evento" },
    { key: "nombreLocal", header: "Nombre del Local" },
    { key: "fechaEvento", header: "Fecha de Evento" },
    { key: "fechaSolicitud", header: "Fecha de Solicitud" },
    { key: "estado", header: "Estado" },
  ];

  const cargarSolicitudes = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await listarSolicitudesPaginado(Number(user.id), {
        page: currentPage - 1, // API usa 0-indexed
        limit: pageSize,
      });

      console.log("Solicitudes response:", response);

      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(response)) {
        setSolicitudes(response);
        setTotalItems(response.length);
      } else if (response.data) {
        setSolicitudes(response.data);
        setTotalItems(response.pagination?.totalItems || response.data.length);
      } else {
        setSolicitudes([]);
        setTotalItems(0);
      }
    } catch (error: any) {
      console.error("Error al cargar solicitudes:", error.message);
      setSolicitudes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentPage, pageSize]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const formatearFecha = (fecha: string | undefined): string => {
    if (!fecha) return "—";
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const handlePaginationChange = ({
    page,
    pageSize: newPageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleEstadoChange = async (solicitud: Solicitud, nuevoEstado: EstadoSolicitud) => {
    try {
      await cambiarEstadoSolicitud(solicitud.localId, solicitud.eventoId, nuevoEstado);
      // Actualizar el estado localmente
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.eventoId === solicitud.eventoId && s.localId === solicitud.localId
            ? { ...s, estado: nuevoEstado }
            : s
        )
      );
    } catch (error: any) {
      console.error("Error al cambiar estado:", error.message);
      // Verificar si es un error del servidor
      if (error.message.includes("getZonas")) {
        alert("Error del servidor: El evento no tiene zonas configuradas. Contacte al administrador.");
      } else {
        alert(`Error al cambiar el estado: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  // Transformar datos para DataTable
  const rows = solicitudes.map((solicitud, index) => ({
    id: String(solicitud.solicitudId || solicitud.eventoId || index),
    nombreEvento: solicitud.evento?.nombre || `Evento #${solicitud.eventoId}`,
    nombreLocal: solicitud.local?.nombre || `Local #${solicitud.localId}`,
    fechaEvento: formatearFecha(solicitud.evento?.fechaHorarioInicio),
    fechaSolicitud: formatearFecha(solicitud.fechaSolicitud),
    estado: solicitud.estado,
    raw: solicitud,
  }));

  return (
    <div className="tabla-solicitudes-container">
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getTableContainerProps,
        }) => (
          <TableContainer {...getTableContainerProps()}>
            <Table {...getTableProps()} size="lg">
              <TableHead>
                <TableRow>
                  <TableExpandHeader aria-label="expand row" />
                  {tableHeaders.map((header) => (
                    <TableHeader
                      {...getHeaderProps({ header })}
                      key={header.key}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => {
                  const solicitudOriginal = solicitudes.find(
                    (s) => String(s.solicitudId || s.eventoId) === row.id
                  );
                  // Solo es expandible si está EN_REVISION
                  const isExpandable = solicitudOriginal?.estado === "EN_REVISION";

                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow
                        key={`expand-${row.id}`}
                        {...(() => {
                          const { key: _key, ...rest } = getRowProps({ row });
                          return rest;
                        })()}
                        ariaLabel="Expandir fila"
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === "estado" ? (
                              <SolicitudEstadoBadge
                                estado={cell.value}
                                isExpandable={isExpandable}
                                onEstadoChange={
                                  isExpandable && solicitudOriginal
                                    ? (nuevoEstado) => handleEstadoChange(solicitudOriginal, nuevoEstado)
                                    : undefined
                                }
                              />
                            ) : (
                              cell.value
                            )}
                          </TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow colSpan={headers.length + 1}>
                        {solicitudOriginal && (
                          <SolicitudDetalleExpandido
                            solicitud={solicitudOriginal}
                          />
                        )}
                      </TableExpandedRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Pagination
        page={currentPage}
        pageSize={pageSize}
        pageSizes={[5, 10, 15, 20]}
        totalItems={totalItems}
        onChange={handlePaginationChange}
        itemsPerPageText="Items por página"
        pageNumberText="Número de página"
        pageRangeText={(_current, total) => `de ${total} páginas`}
        itemRangeText={(min, max, total) => `${min}–${max} de ${total} items`}
      />
    </div>
  );
};

export default TablaSolicitudes;
