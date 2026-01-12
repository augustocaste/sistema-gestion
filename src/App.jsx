import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Trabajadores } from "./pages/Trabajadores";
import { Productos } from "./pages/Productos";
import { Clientes } from "./pages/Clientes";
import { Pagos } from "./pages/Pagos";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/middleware/ProtectedRoute";
import { Login } from "./pages/Login";
// Si creas más páginas, impórtalas aquí
// import Productos from "./pages/Productos";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/productos" element={<Productos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route
          path="/configuracion"
          element={<div className="p-8">Configuración</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
