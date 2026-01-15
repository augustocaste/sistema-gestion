import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCuota, verificarYCompletarPlan } from "@/supabase/pagos";

export function RegistrarPagoModal({ abierto, onCerrar, cuota, tipo, plan }) {
  const deuda = (plan?.monto_cuota ?? 0) - (cuota?.monto_actual_pagado ?? 0);

  const [form, setForm] = useState({
    metodo: "transferencia", // transferencia | efectivo
    alias: "",
    monto: "",
    fecha: "",
  });

  useEffect(() => {
    if (!cuota || !plan) return;

    if (tipo !== "adelanto") {
      const deuda = (plan.monto_cuota ?? 0) - (cuota.monto_actual_pagado ?? 0);

      setForm((p) => ({
        ...p,
        monto: deuda,
      }));
    }
  }, [tipo, cuota, plan]);

  if (!cuota) return null;
  function handleMetodoChange(metodo) {
    setForm((p) => ({
      ...p,
      metodo,
      alias: metodo === "efectivo" ? "" : p.alias,
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }
  const montoCalculado =
    tipo !== "adelanto"
      ? (plan?.monto_cuota ?? 0) - (cuota?.monto_actual_pagado ?? 0)
      : form.monto;

  async function handleGuardarClick() {
    if (!form.monto || !form.fecha) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    if (form.metodo === "transferencia" && !form.alias) {
      toast.error("Debe ingresar un alias para transferencias");
      return;
    }

    if (form.monto > deuda) {
      toast.error(
        "El monto del adelanto no puede exceder el monto restante de la cuota que es " +
          deuda
      );
      return;
    }

    try {
      const result = await updateCuota(form, plan, cuota);

      if (!result?.ok) {
        toast.error("Ocurrió un error al guardar el pago");
        return;
      }

      toast.success("Pago exitoso");
      onCerrar();
      await verificarYCompletarPlan(plan.id);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al realizar el pago");
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tipo === "adelanto"
              ? "Registrar adelanto"
              : `Pagar cuota #${cuota.nro_cuota}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <label className="text-sm font-medium">Método de pago</label>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={form.metodo === "transferencia" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMetodoChange("transferencia")}
            >
              Transferencia
            </Button>

            <Button
              type="button"
              variant={form.metodo === "efectivo" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMetodoChange("efectivo")}
            >
              Efectivo
            </Button>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Alias */}
          <div>
            <label className="text-sm font-medium">Alias destino</label>
            <Input
              name="alias"
              value={form.alias}
              onChange={handleChange}
              disabled={form.metodo === "efectivo"}
              placeholder={
                form.metodo === "efectivo"
                  ? "Pago en efectivo"
                  : "Alias de transferencia"
              }
              className={
                form.metodo === "efectivo"
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }
            />
          </div>

          {/* Monto */}
          <div>
            <div>
              <label className="text-sm font-medium">Monto</label>
              <Input
                type="number"
                name="monto"
                value={form.monto}
                onChange={handleChange}
                disabled={tipo !== "adelanto"}
                className={
                  tipo !== "adelanto" ? "opacity-70 cursor-not-allowed" : ""
                }
              />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-sm font-medium">Fecha de pago</label>
            <Input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarClick}>Registrar pago</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
