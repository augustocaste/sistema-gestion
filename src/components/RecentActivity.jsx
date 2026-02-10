import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { getCuotasVencidas } from "@/supabase/clientes";
import { Button } from "@/components/ui/button";
import { PlanPagosModal } from "@/components/modals/PlanPagosModal.jsx";

export function RecentActivity() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const fetchCuotas = async () => {
    try {
      const data = await getCuotasVencidas();
      setCuotas(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuotas();
  }, []);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Cuotas que vencen hoy
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Cargando cuotas que vencen hoy...
          </p>
        )}

        {!loading && cuotas.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay cuotas vencidas 🎉
          </p>
        )}

        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
          {cuotas.map((cuota) => {
            const compraProducto = cuota.plan_cuotas?.compra_producto?.[0];

            const cliente =
              cuota.plan_cuotas.compra_producto[0].compra.clientes;

            const nombreCompleto = cliente
              ? `${cliente.nombre_completo}`
              : "Cliente desconocido";

            const initials = cliente
              ? `${cliente.nombre_completo?.[0] ?? ""}`
              : "--";

            const mensaje = `tiene una cuota vencida en el pago de ${compraProducto.producto.nombre}`;

            return (
              <div key={cuota.id} className="flex items-start gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{nombreCompleto}</span>{" "}
                    <span className="text-muted-foreground">{mensaje}</span>
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPlanSeleccionado(cuota.plan_cuotas);
                        setModalAbierto(true);
                      }}
                    >
                      Ver plan de pagos
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <PlanPagosModal
        abierto={modalAbierto}
        onCerrar={() => {
          setModalAbierto(false);
          fetchCuotas();
        }}
        plan={planSeleccionado}
      />
    </Card>
  );
}
