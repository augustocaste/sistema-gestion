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
import { useState } from "react";
import {
  obtenerPlanCuotasPorProducto,
  getCuotasPorPlan,
} from "@/supabase/clientes";
import { PlanPagosModal } from "@/components/modals/PlanPagosModal.jsx";

export function DetalleCompraModal({ abierto, onCerrar, compra }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planTotal, setPlanTotal] = useState(null);
  console.log(compra);
  if (!compra) return null;

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

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Compra #{compra.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Fecha</span>
            <span>{compra.fecha}</span>
          </div>

          <div className="flex justify-between">
            <span>Monto total</span>
            <span className="font-medium">${compra.monto_total}</span>
          </div>

          <div className="flex justify-between">
            <span>Empleado</span>
            <span>
              {compra.empleados?.nombre} {compra.empleados?.apellido}
            </span>
          </div>

          {/* PRODUCTOS */}
          <div className="pt-4 border-t space-y-3">
            <p className="text-base font-semibold">Productos</p>

            {/* TABLA (desktop) */}
            <div className="hidden md:block">
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
                  {compra.compra_producto.map((p) => (
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
              {compra.compra_producto.map((p) => (
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
      <PlanPagosModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        plan={planTotal}
      />
    </Dialog>
  );
}
