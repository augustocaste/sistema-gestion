import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Trabajadores } from "./pages/Trabajadores";
import { Productos } from "./pages/Productos";
import { Clientes } from "./pages/Clientes";
import { Pagos } from "./pages/Pagos";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/middleware/ProtectedRoute";
import { Login } from "./pages/Login";
import { Cuotas } from "./pages/Cuotas";
import { Transferencias } from "./pages/Transferencias";

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
        <Route path="/cuotas" element={<Cuotas />} />
        <Route
          path="/configuracion"
          element={<div className="p-8">Configuración</div>}
        />
        <Route path="/transferencias" element={<Transferencias />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
