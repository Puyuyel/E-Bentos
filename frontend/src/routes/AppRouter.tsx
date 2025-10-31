import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login"; // tu componente Login
import Register from "../pages/Register"; // tu componente Login
import ReporteLocal from "../pages/ReporteLocal";
import ReporteEvento from "../pages/ReporteEvento";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta /login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta /register */}
        <Route path="/register" element={<Register/>} />

        {/* Ruta /reportes */}
        <Route path="/reporte-local" element={<ReporteLocal />} />

        <Route path="/reporte-evento" element={<ReporteEvento />} />

        {/* Redirige cualquier ruta desconocida a /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;