import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, FileText, Users, Package } from "lucide-react";
import { useState } from "react";
import { ProductModal } from "./modals/ProductModal";
import { createProducto } from "../supabase/productos";
import { ClientModal } from "./modals/ClientModal";
import { createCliente } from "../supabase/clientes";

export function QuickActions() {
  const [modalAbiertoProducto, setModalAbiertoProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoModalProducto, setModoModalProducto] = useState("crear");

  const [modalAbiertoCliente, setModalAbiertoCliente] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modoModalCliente, setModoModalCliente] = useState("crear");

  function abrirModalCrearCliente() {
    setClienteSeleccionado(null);
    setModoModalCliente("crear");
    setModalAbiertoCliente(true);
  }

  function abrirModalCrearProducto() {
    setProductoSeleccionado(null);
    setModoModalProducto("crear");
    setModalAbiertoProducto(true);
  }

  const actions = [
    {
      title: "Nuevo Producto",
      icon: Package,
      onClick: () => {
        abrirModalCrearProducto();
      },
    },
    {
      title: "Nuevo Cliente",
      icon: Users,
      onClick: () => {
        abrirModalCrearCliente();
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
      const { error } = await createProducto(formData);
      setModalAbiertoProducto(false);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async function handleGuardarCliente(formData) {
    try {
      const { error } = await createCliente(formData);
      setModalAbiertoCliente(false);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
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
      <ProductModal
        abierto={modalAbiertoProducto}
        onCerrar={() => setModalAbiertoProducto(false)}
        producto={productoSeleccionado}
        modo={modoModalProducto}
        onGuardar={handleGuardarProducto}
      />
      <ClientModal
        abierto={modalAbiertoCliente}
        onCerrar={() => setModalAbiertoCliente(false)}
        cliente={clienteSeleccionado}
        modo={modoModalCliente}
        onGuardar={handleGuardarCliente}
      />
    </Card>
  );
}
