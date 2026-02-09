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

export function EmpleadoModal({
  abierto,
  onCerrar,
  empleado = null,
  onGuardar,
  modo = "crear", // crear | editar
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    rol: "empleado",
    activo: true,
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modo === "editar" && empleado) {
      setForm({
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        dni: empleado.dni || "",
        rol: empleado.rol || "empleado",
        activo: empleado.activo ?? true,
        email: empleado.email || "",
        password: "",
      });
    } else {
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        rol: "empleado",
        activo: true,
        email: "",
        password: "",
      });
    }
  }, [empleado, modo, abierto]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleGuardarClick() {
    if (!form.nombre || !form.apellido || !form.dni) {
      toast.error("Nombre, apellido y DNI son obligatorios");
      return;
    }

    if (modo === "crear") {
      if (!form.email || !form.password) {
        toast.error("Email y contraseña son obligatorios");
        return;
      }

      if (form.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        dni: Number(form.dni),
        email: form.email?.toLowerCase().trim(),
      };

      const result = await onGuardar(payload);
      console.log("Resultado de onGuardar:", result);

      if (result?.error?.code === "23505") {
        toast.error("Ya existe un empleado con este DNI");
        return;
      }

      if (!result?.ok) {
        toast.error(result?.error?.message || "Error al guardar");
        return;
      }

      toast.success(
        modo === "editar"
          ? "Empleado actualizado"
          : "Empleado registrado correctamente",
      );

      onCerrar();
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl border shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {modo === "editar" ? "Editar Trabajador" : "Registrar Trabajador"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Apellido</label>
            <Input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ingrese el apellido"
            />
          </div>

          <div>
            <label className="text-sm font-medium">DNI</label>
            <Input
              type="number"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ingrese el DNI"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            <label className="text-sm font-medium">Activo</label>
          </div>

          {modo === "crear" && (
            <>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ingrese el email"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingrese la contraseña"
                />
              </div>
            </>
          )}
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
                : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
