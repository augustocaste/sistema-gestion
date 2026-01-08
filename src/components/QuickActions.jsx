import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, FileText, Users, Package } from "lucide-react";
import { useState } from "react";
import { ProductoModal } from "./modals/ProductModal";
import { createProducto } from "../supabase/productos";

export function QuickActions() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoModal, setModoModal] = useState("crear");
  function abrirModalCrear() {
    setProductoSeleccionado(null);
    setModoModal("crear");
    setModalAbierto(true);
  }

  const actions = [
    {
      title: "Nuevo Producto",
      icon: Package,
      onClick: () => {
        abrirModalCrear();
        // navigate("/productos/nuevo");
      },
    },
    {
      title: "Nuevo Cliente",
      icon: Users,
      onClick: () => {
        console.log("Crear Cliente");
      },
    },
    {
      title: "Registrar Pago",
      icon: FileText,
      onClick: () => {
        console.log("Registrar pago");
      },
    },
    {
      title: "Nuevo Trabajador",
      icon: Plus,
      onClick: () => {
        console.log("Crear trabajador");
      },
    },
  ];

  async function handleGuardarProducto(formData) {
    try {
      await createProducto(formData);
      setModalAbierto(false);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              onClick={action.onClick}
              className="h-auto flex-col gap-2 py-4 border-border hover:bg-accent bg-transparent"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <ProductoModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        producto={productoSeleccionado}
        modo={modoModal}
        onGuardar={handleGuardarProducto}
      />
    </Card>
  );
}
