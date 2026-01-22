import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getCuotasPorPlan } from "@/supabase/clientes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RegistrarPagoModal } from "@/components/modals/RegistrarPagoModal";

export function PlanPagosModal({ abierto, onCerrar, plan }) {
  if (!plan) return null;
  console.log(plan);
  const [cuotas, setCuotas] = useState([]);

  function parseFechaLocal(fecha) {
    const [y, m, d] = fecha.split("-");
    return new Date(y, m - 1, d);
  }

  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [tipoPago, setTipoPago] = useState(null);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);

  useEffect(() => {
    if (!plan?.id) return;
    console.log("Cargando cuotas para el plan:", plan);
    getCuotasPorPlan(plan.id).then(setCuotas);
  }, [plan]);

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Plan de pagos · {plan.cant_cuotas} cuotas</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {cuotas?.map((cuota) => (
            <div
              key={cuota.nro_cuota}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div className="space-y-1">
                <p className="font-medium">Cuota Nro: {cuota.nro_cuota}</p>
                <p className="text-xs text-muted-foreground">
                  {cuota.estado === "pagada"
                    ? `Pagada el ${parseFechaLocal(
                        cuota.fecha_pagada,
                      ).toLocaleDateString("es-AR")}`
                    : `Vence el ${parseFechaLocal(
                        cuota.fecha_vencimiento,
                      ).toLocaleDateString("es-AR")}`}
                </p>
              </div>

              <div className="text-right space-y-2">
                <Badge
                  className={
                    cuota.estado === "pendiente" || cuota.estado === "vencida"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-green-700 text-white"
                  }
                >
                  Estado {cuota.estado}
                </Badge>
                <p className="font-medium">Monto total: ${plan.monto_cuota}</p>

                <p className="font-medium">
                  Monto restante: $
                  {plan.monto_cuota - cuota.monto_actual_pagado}
                </p>

                {cuota.estado !== "pagada" && (
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCuotaSeleccionada(cuota);
                        setTipoPago("cuota");
                        setModalPagoAbierto(true);
                      }}
                    >
                      Pagar
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCuotaSeleccionada(cuota);
                        setTipoPago("adelanto");
                        setModalPagoAbierto(true);
                      }}
                    >
                      Dar Adelanto
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <RegistrarPagoModal
        abierto={modalPagoAbierto}
        onCerrar={() => setModalPagoAbierto(false)}
        cuota={cuotaSeleccionada}
        tipo={tipoPago}
        plan={plan}
      />
    </Dialog>
  );
}
