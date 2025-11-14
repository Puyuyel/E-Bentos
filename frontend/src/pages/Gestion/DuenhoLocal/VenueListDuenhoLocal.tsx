import { Column, Grid, Button } from "@carbon/react";
import CardVenueDuenho from "../../Gestion/DuenhoLocal/CardVenueDuenho";
import SearchBar from "../../../components/Gestion/SearchBar";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalesService } from "../../../services/LocalesServices/getLocales";

import type { Local } from "../../../types/locales.types";
import { useAuthStore } from "../../../store/useAuthStore";

export default function VenueList() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locales, setLocales] = useState<Local[]>([]);

  const filteredLocales = locales.filter(
    (l) =>
      l.nombre.toLowerCase().includes(search.toLowerCase()) &&
      l.gestor.usuarioId === parseInt(user?.id || "32")
  );

  useEffect(() => {
    const getLocales = async () => {
      try {
        const response = await getLocalesService(); // tu servicio de API
        console.log("response.data: ", response.data);
        setLocales(response.data); // o response, según tu estructura
      } catch (error: any) {
        alert("ERROR en VenueList.tsx: " + error.messsage);
      }
    };
    getLocales();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <SearchBar onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Grid>
        {filteredLocales.map((local: Local) => (
          <Column key={local.localId} sm={4} md={4} lg={8} xlg={8} max={8}>
            <CardVenueDuenho local={local}></CardVenueDuenho>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
