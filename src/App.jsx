import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Trabajadores } from "./pages/Trabajadores";
import { Productos } from "./pages/Productos";
import { Clientes } from "./pages/Clientes";
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
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores"
          element={
            <ProtectedRoute>
              <Trabajadores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuotas"
          element={
            <ProtectedRoute>
              <Cuotas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transferencias"
          element={
            <ProtectedRoute>
              <Transferencias />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
