import { Search } from "@carbon/react";

interface SearchBarProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ onChange }: SearchBarProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1.5rem 0",
      }}
    >
      <Search
        closeButtonLabelText="Borrar búsqueda"
        id="search-locales"
        labelText=""
        placeholder="Busque locales por su nombre"
        size="lg"
        type="search"
        onChange={onChange}
        style={{
          width: "50rem",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}
