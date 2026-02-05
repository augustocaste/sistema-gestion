import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  obtenerPlanCuotasPorProducto,
  getCuotasPorPlan,
  getCompraById,
} from "@/supabase/clientes";
import { PlanPagosModal } from "@/components/modals/PlanPagosModal.jsx";

export function DetalleCompraModal({
  abierto,
  onCerrar,
  compra,
  actualizarCompraEnLista, // callback del padre
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planTotal, setPlanTotal] = useState(null);
  const [compraActual, setCompraActual] = useState(compra);

  // 🔄 Mantener sincronizada la compra cuando cambia la prop
  useEffect(() => {
    setCompraActual(compra);
  }, [compra]);

  if (!compraActual) return null;

  // Abrir PlanPagosModal
  async function handleClick(compraProducto) {
    try {
      const plan = await obtenerPlanCuotasPorProducto(compraProducto.id);
      const cuotas = await getCuotasPorPlan(plan.id);

      setPlanTotal({
        ...plan,
        cuotas,
      });

      setModalAbierto(true);
    } catch (error) {
      console.error(error);
    }
  }

  // 🔄 Se llama al cerrar PlanPagosModal
  async function handleCerrarPlanPagos() {
    setModalAbierto(false);

    if (!planTotal) return;

    try {
      // 1️⃣ Recargar la compra actual desde Supabase
      const compraActualizada = await getCompraById(compraActual.id);
      setCompraActual(compraActualizada);

      // 2️⃣ Actualizar la compra en la lista del padre
      if (actualizarCompraEnLista) {
        actualizarCompraEnLista(compraActualizada);
      }
    } catch (error) {
      console.error("Error al actualizar compra:", error);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent
        className="
          max-h-[80vh]
          overflow-y-auto
          overflow-x-hidden
          w-full
          md:max-w-4xl
        "
      >
        <DialogHeader>
          <DialogTitle>Información de la compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Fecha</span>
            <span>{compraActual.fecha}</span>
          </div>

          <div className="flex justify-between">
            <span>Empleado</span>
            <span>
              {compraActual.empleados?.nombre}{" "}
              {compraActual.empleados?.apellido}
            </span>
          </div>

          {/* PRODUCTOS */}
          <div className="pt-4 border-t space-y-3">
            <p className="text-base font-semibold">Productos</p>

            {/* TABLA (desktop) */}
            <div className="hidden md:block overflow-x-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Estado de pago</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {compraActual.compra_producto.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.producto.nombre}</TableCell>
                      <TableCell className="text-right">${p.monto}</TableCell>
                      <TableCell className="text-right">{p.cantidad}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{p.estado_pago}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.estado_pago === "No completado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClick(p)}
                          >
                            Ver plan de pagos
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* CARDS (mobile) */}
            <div className="space-y-3 md:hidden">
              {compraActual.compra_producto.map((p) => (
                <div key={p.id} className="rounded-lg border p-3 space-y-2">
                  <div className="font-medium">{p.producto.nombre}</div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Monto</span>
                    <span>${p.monto}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Estado de pago
                    </span>
                    <Badge variant="outline">{p.estado_pago}</Badge>
                  </div>

                  {p.estado_pago === "No completado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleClick(p)}
                    >
                      Ver plan de pagos
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* PlanPagosModal */}
      <PlanPagosModal
        abierto={modalAbierto}
        onCerrar={handleCerrarPlanPagos}
        plan={planTotal}
      />
    </Dialog>
  );
}
