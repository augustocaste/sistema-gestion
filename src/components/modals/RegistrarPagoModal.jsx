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
import { useEffect, useState } from "react";
// import { getTrabajadores } from "@/supabase/trabajadores";
import { toast } from "sonner";
import { updateCuota } from "@/supabase/pagos";

export function RegistrarPagoModal({ abierto, onCerrar, cuota, tipo, plan }) {
  const [trabajadores, setTrabajadores] = useState([]);
  const deuda = (plan?.monto_cuota ?? 0) - (cuota?.monto_actual_pagado ?? 0);

  const [form, setForm] = useState({
    // trabajador: "",
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

  // useEffect(() => {
  //   if (!abierto) return;
  //   getTrabajadores().then(setTrabajadores);
  // }, [abierto]);

  if (!cuota) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }
  const montoCalculado =
    tipo !== "adelanto"
      ? (plan?.monto_cuota ?? 0) - (cuota?.monto_actual_pagado ?? 0)
      : form.monto;

  async function handleGuardarClick() {
    // if (!form.trabajador || !form.alias || !form.monto || !form.fecha) {
    if (!form.alias || !form.monto || !form.fecha) {
      console.log("form incompleto:", form);
      toast.error("Por favor complete todos los campos");
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

        <div className="space-y-4 text-sm">
          {/* Trabajador */}
          {/* <div>
            <label className="text-sm font-medium">Trabajador</label>
            <Select
              onValueChange={(v) => setForm((p) => ({ ...p, trabajador: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione trabajador" />
              </SelectTrigger>
              <SelectContent>
                {trabajadores.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nombre} {t.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Alias */}
          <div>
            <label className="text-sm font-medium">Alias destino</label>
            <Input name="alias" value={form.alias} onChange={handleChange} />
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
