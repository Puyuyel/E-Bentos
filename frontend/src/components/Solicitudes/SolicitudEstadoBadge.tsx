// src/components/Solicitudes/SolicitudEstadoBadge.tsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import type { EstadoSolicitud } from "../../types/solicitud.types";
import { Tag } from "@carbon/react";
import { ChevronDown } from "@carbon/react/icons";

interface SolicitudEstadoBadgeProps {
  estado: EstadoSolicitud;
  isExpandable?: boolean;
  onEstadoChange?: (nuevoEstado: EstadoSolicitud) => void;
}

const estadosDisponibles: { value: EstadoSolicitud; label: string; color: string }[] = [
  { value: "APROBADO", label: "Aprobado", color: "#4ade80" },
  { value: "RECHAZADO", label: "Rechazado", color: "#f87171" },
  { value: "EN_REVISION", label: "En Revisión", color: "#60a5fa" },
];

// Función para formatear el estado a texto legible
const formatearEstado = (estado: EstadoSolicitud): string => {
  switch (estado) {
    case "APROBADO":
      return "Aprobado";
    case "RECHAZADO":
      return "Rechazado";
    case "EN_REVISION":
      return "En Revisión";
    default:
      return estado;
  }
};

const SolicitudEstadoBadge: React.FC<SolicitudEstadoBadgeProps> = ({
  estado,
  isExpandable = false,
  onEstadoChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const tagRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTagProps = () => {
    switch (estado) {
      case "APROBADO":
        return { type: "green" as const };
      case "RECHAZADO":
        return { type: "red" as const };
      case "EN_REVISION":
        return { type: "blue" as const };
      default:
        return { type: "gray" as const };
    }
  };

  const tagProps = getTagProps();

  // Calcular posición del dropdown
  useEffect(() => {
    if (isOpen && tagRef.current) {
      const rect = tagRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        tagRef.current &&
        !tagRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const handleTagClick = (e: React.MouseEvent) => {
    if (isExpandable && onEstadoChange) {
      e.stopPropagation();
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleEstadoSelect = (nuevoEstado: EstadoSolicitud) => {
    if (onEstadoChange) {
      onEstadoChange(nuevoEstado);
    }
    setIsOpen(false);
  };

  // Componente del dropdown usando Portal
  const DropdownMenu = () => {
    if (!isOpen || !isExpandable) return null;

    return ReactDOM.createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: "fixed",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          zIndex: 9999,
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "140px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {estadosDisponibles.map((opcion) => (
          <div
            key={opcion.value}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleEstadoSelect(opcion.value);
            }}
            style={{
              padding: "10px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: estado === opcion.value ? "#f3f4f6" : "white",
              transition: "background-color 0.15s",
              fontSize: "14px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 
                estado === opcion.value ? "#f3f4f6" : "white";
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: opcion.color,
                flexShrink: 0,
              }}
            />
            {opcion.label}
          </div>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <>
      <div ref={tagRef} style={{ display: "inline-block" }}>
        <Tag
          type={tagProps.type}
          size="md"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            minWidth: "100px",
            justifyContent: "center",
            cursor: isExpandable ? "pointer" : "default",
            userSelect: "none",
          }}
          onClick={handleTagClick}
        >
          {formatearEstado(estado)}
          {isExpandable && (
            <ChevronDown 
              size={12} 
              style={{ 
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }} 
            />
          )}
        </Tag>
      </div>
      <DropdownMenu />
    </>
  );
};

export default SolicitudEstadoBadge;
