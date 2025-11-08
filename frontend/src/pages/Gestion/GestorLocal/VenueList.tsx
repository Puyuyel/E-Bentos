import { Column, Grid } from "@carbon/react";
import CardVenue from "../../../components/Gestion/CardVenue";

import { useState, useEffect } from "react";
import { getLocalesService } from "../../../services/LocalesServices/getLocales";

import type { Local } from "../../../types/locales.types";

export default function VenueList() {
  const [locales, setLocales] = useState<Local[]>([]);

  useEffect(() => {
    const getLocales = async () => {
      try {
        const response = await getLocalesService(); // tu servicio de API
        console.log("response.data: ", response.data);
        setLocales(response.data); // o response, según tu estructura
      } catch (error: any) {
        alert("ERROR en VeenusList.tsx: " + error.messsage);
      }
    };
    getLocales();
  }, []);

  return (
    <div>
      <Grid>
        {locales.map((local: Local) => (
          <Column key={local.localId} sm={4} md={4} lg={8} xlg={8} max={8}>
            <CardVenue>{local}</CardVenue>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
