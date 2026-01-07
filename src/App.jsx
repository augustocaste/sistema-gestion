import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Trabajadores } from "./pages/Trabajadores";
import { Productos } from "./pages/Productos";
import { Clientes } from "./pages/Clientes";
import { Pagos } from "./pages/Pagos";
// Si creas más páginas, impórtalas aquí
// import Productos from "./pages/Productos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta principal "/" carga tu Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Puedes crear rutas temporales para que no tire error 
           al hacer clic en el Sidebar 
        */}
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
