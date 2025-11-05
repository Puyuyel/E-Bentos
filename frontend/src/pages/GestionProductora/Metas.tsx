import SidebarGestor from "../../components/SidebarGestor";
import "../../styles/GestionProductora/Metas.css";

const Metas: React.FC = () => {
  return (
    <div className="app-container">
      <SidebarGestor currentPath="metas" />
      <main className="app-main">
        <h1 className="title">Panel de Metas</h1>
      </main>
    </div>
  );
};

export default Metas;