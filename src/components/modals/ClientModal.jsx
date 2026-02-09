import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ClientModal({
  abierto,
  onCerrar,
  cliente = null,
  onGuardar,
  modo = "editar",
}) {
  const [form, setForm] = useState({
    nombre_completo: "",
    dni: 0,
    telefono: 0,
    direccion: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre_completo: cliente.nombre_completo || "",
        dni: cliente.dni || 0,
        telefono: cliente.telefono || 0,
        direccion: cliente.direccion || "",
        observaciones: cliente.observaciones || "",
      });
    } else {
      setForm({
        nombre_completo: "",
        dni: 0,
        telefono: 0,
        direccion: "",
        observaciones: "",
      });
    }
  }, [cliente, abierto]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handleGuardarClick() {
    setLoading(true);
    if (form.nombre_completo.trim() === "") {
      toast.error("El nombre completo del cliente es obligatorio");
      setLoading(false);
      return;
    }
    if (form.dni <= 0) {
      toast.error("El DNI del cliente es obligatorio");
      setLoading(false);
      return;
    }

    try {
      const result = await onGuardar(form);
      if (!result?.ok) {
        if (result?.error?.code === "23505") {
          // Codigo de error de violación de unicidad
          toast.error("Ya existe un cliente con este DNI o nombre");
          return;
        }
        toast.error("Ocurrió un error al guardar el cliente");
        return;
      }

      toast.success(
        modo === "editar"
          ? "Cliente actualizado correctamente"
          : "Cliente creado correctamente",
      );

      onCerrar();
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al guardar el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl border shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {modo === "editar" ? "Editar Cliente" : "Agregar Cliente"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nombre */}

          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              name="nombre_completo"
              placeholder="Ingrese el nombre completo del cliente"
              value={form.nombre_completo}
              onChange={(e) =>
                setForm((p) => ({ ...p, nombre_completo: e.target.value }))
              }
            />
          </div>

          {/* Precio contado */}
          <div>
            <label className="text-sm font-medium">DNI</label>
            <Input
              type="number"
              name="dni"
              placeholder="Ingrese el DNI del cliente"
              value={form.dni === 0 ? "" : form.dni}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Telefono</label>
            <Input
              type="number"
              name="telefono"
              placeholder="Ingrese el teléfono del cliente"
              value={form.telefono === 0 ? "" : form.telefono}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Direccion</label>

            <Input
              name="direccion"
              placeholder="Ingrese la dirección del cliente"
              value={form.direccion === "" ? "" : form.direccion}
              onChange={(e) =>
                setForm((p) => ({ ...p, direccion: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Observaciones</label>
            <Input
              name="observaciones"
              placeholder="Ingrese observaciones sobre el cliente (no obligatorio)"
              value={form.observaciones}
              onChange={(e) =>
                setForm((p) => ({ ...p, observaciones: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCerrar} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarClick} disabled={loading}>
            {loading
              ? "Guardando..."
              : modo === "editar"
                ? "Guardar"
                : "Agregar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
