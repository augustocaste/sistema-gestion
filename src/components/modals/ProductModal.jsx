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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CUOTAS_CONFIG = [
  { label: "3 Cuotas", name: "tres_cuotas", value: 3 },
  { label: "6 Cuotas", name: "seis_cuotas", value: 6 },
  { label: "9 Cuotas", name: "nueve_cuotas", value: 9 },
  { label: "12 Cuotas", name: "doce_cuotas", value: 12 },
];

export function ProductModal({
  abierto,
  onCerrar,
  producto = null,
  onGuardar,
  modo = "editar",
}) {
  const [form, setForm] = useState({
    nombre: "",
    precio_contado: 0,
    stock: 0,
    cantidad_cuotas: 0,
    tres_cuotas: 0,
    seis_cuotas: 0,
    nueve_cuotas: 0,
    doce_cuotas: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        precio_contado: producto.precio_contado || 0,
        stock: producto.stock || 0,
        garantia: producto.garantia || 0,
        cantidad_cuotas: producto.cantidad_cuotas || 0,
        tres_cuotas: producto.tres_cuotas || 0,
        seis_cuotas: producto.seis_cuotas || 0,
        nueve_cuotas: producto.nueve_cuotas || 0,
        doce_cuotas: producto.doce_cuotas || 0,
      });
    } else {
      setForm({
        nombre: "",
        precio_contado: 0,
        stock: 0,
        garantia: 0,
        cantidad_cuotas: 0,
        tres_cuotas: 0,
        seis_cuotas: 0,
        nueve_cuotas: 0,
        doce_cuotas: 0,
      });
    }
  }, [producto, abierto]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  function handleCuotasChange(value) {
    const cuotas = Number(value);

    setForm((prev) => ({
      ...prev,
      cantidad_cuotas: cuotas,
      tres_cuotas: cuotas >= 3 ? prev.tres_cuotas : 0,
      seis_cuotas: cuotas >= 6 ? prev.seis_cuotas : 0,
      nueve_cuotas: cuotas >= 9 ? prev.nueve_cuotas : 0,
      doce_cuotas: cuotas >= 12 ? prev.doce_cuotas : 0,
    }));
  }

  async function handleGuardarClick() {
    setLoading(true);
    if (form.nombre.trim() === "") {
      toast.error("El nombre del producto es obligatorio");
      setLoading(false);
      return;
    }
    if (
      form.precio_contado < 0 ||
      form.stock < 0 ||
      form.garantia < 0 ||
      form.cantidad_cuotas < 0 ||
      form.tres_cuotas < 0 ||
      form.seis_cuotas < 0 ||
      form.nueve_cuotas < 0 ||
      form.doce_cuotas < 0
    ) {
      toast.error(
        "Por favor, ingresa valores válidos para precio, stock y cuotas",
      );
      setLoading(false);
      return;
    }
    try {
      const result = await onGuardar(form);
      if (!result?.ok) {
        if (result?.error?.code === "23505") {
          // Codigo de error de violación de unicidad
          toast.error("Ya existe un producto con este nombre");
          return;
        }
        toast.error("Ocurrió un error al guardar el producto");
        return;
      }

      toast.success(
        modo === "editar"
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente",
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
      <DialogContent
        className="
        w-[95vw]
        sm:max-w-lg
        h-[90vh]
        max-h-[90vh]
        bg-white
        rounded-2xl
        border
        shadow-lg
        p-0
        flex
        flex-col
        overflow-hidden
      "
      >
        {/* ---------- HEADER ---------- */}
        <DialogHeader className="px-6 pt-6 shrink-0">
          <DialogTitle className="text-xl font-bold">
            {modo === "editar" ? "Editar Producto" : "Agregar Producto"}
          </DialogTitle>
        </DialogHeader>

        {/* ---------- BODY (SCROLL INTERNO) ---------- */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                name="nombre"
                placeholder="Ingrese el nombre del producto"
                value={form.nombre}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nombre: e.target.value }))
                }
              />
            </div>

            {/* Precio contado */}
            <div>
              <label className="text-sm font-medium">Precio Contado</label>
              <Input
                type="number"
                name="precio_contado"
                placeholder="Ingrese un valor numérico"
                value={form.precio_contado === 0 ? "" : form.precio_contado}
                onChange={handleChange}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                name="stock"
                placeholder="Ingrese un valor numérico"
                value={form.stock === 0 ? "" : form.stock}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Garantia</label>
              <Input
                type="number"
                name="garantia"
                placeholder="Ingrese meses de garantia para este producto"
                value={form.garantia === 0 ? "" : form.garantia}
                onChange={handleChange}
              />
            </div>

            {/* Selector cuotas */}
            <div>
              <label className="text-sm font-medium">Cantidad de Cuotas</label>
              <Select
                value={String(form.cantidad_cuotas)}
                onValueChange={handleCuotasChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin cuotas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin cuotas</SelectItem>
                  <SelectItem value="3">3 cuotas</SelectItem>
                  <SelectItem value="6">6 cuotas</SelectItem>
                  <SelectItem value="9">9 cuotas</SelectItem>
                  <SelectItem value="12">12 cuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cuotas dinámicas */}
            {CUOTAS_CONFIG.filter((c) => form.cantidad_cuotas >= c.value).map(
              (cuota) => (
                <div key={cuota.name}>
                  <label className="text-sm font-medium">{cuota.label}</label>
                  <Input
                    type="number"
                    name={cuota.name}
                    placeholder="Ingrese un valor numérico"
                    value={form[cuota.name] === 0 ? "" : form[cuota.name]}
                    onChange={handleChange}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        {/* ---------- FOOTER ---------- */}
        <DialogFooter className="px-6 py-4 border-t shrink-0 flex justify-end gap-3">
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
