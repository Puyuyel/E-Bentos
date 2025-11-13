// MainEbentos.tsx
import Header from "./HeaderEbentos"; // Ajusta la ruta si es necesario
import EventGrid from "./EventGrid";
import Footer from "./Footer";
import Carrusel from "./Carrusel";
import Categories from "./Categorias";
import "../../styles/Cliente/MainEbentos.css";

export default function MainEbentos() {
  return (
    <>
    <Header />
    <div className="app-container">
      
      <main>
        <Carrusel />
        <div className="main-content-container">
          <Categories />
          <EventGrid />
        </div>
      </main>
      
    </div>
    <Footer />
    </>
  );
}

