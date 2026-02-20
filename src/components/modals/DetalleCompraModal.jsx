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
import { getFacturasByCompra } from "@/supabase/compras";
import { FacturasCompra } from "@/components/FacturaCompra.jsx";

export function DetalleCompraModal({
  abierto,
  onCerrar,
  compra,
  actualizarCompraEnLista,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planTotal, setPlanTotal] = useState(null);
  const [compraActual, setCompraActual] = useState(compra);

  const [facturas, setFacturas] = useState([]);
  const [modalFacturas, setModalFacturas] = useState(false);

  useEffect(() => {
    setCompraActual(compra);
  }, [compra]);

  if (!compraActual) return null;

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

  async function handleCerrarPlanPagos() {
    setModalAbierto(false);

    try {
      const compraActualizada = await getCompraById(compraActual.id);
      setCompraActual(compraActualizada);

      if (actualizarCompraEnLista) {
        actualizarCompraEnLista(compraActualizada);
      }

      const facturasCompra = await getFacturasByCompra(compraActual.id);
      setFacturas(facturasCompra);

      if (facturasCompra?.length) {
        setModalFacturas(true);
      }
    } catch (error) {
      console.error("Error al actualizar compra:", error);
    }
  }

  return (
    <>
      <Dialog open={abierto} onOpenChange={onCerrar}>
        <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden w-full md:max-w-4xl">
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

            <div className="pt-4 border-t space-y-3">
              <p className="text-base font-semibold">Productos</p>

              <div className="hidden md:block overflow-x-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {compraActual.compra_producto.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.producto.nombre}</TableCell>
                        <TableCell className="text-right">${p.monto}</TableCell>
                        <TableCell className="text-right">
                          {p.cantidad}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{p.estado_pago}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleClick(p)}
                          >
                            Ver plan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {compraActual.compra_producto.map((p) => (
                  <div key={p.id} className="rounded-lg border p-3 space-y-2">
                    <div className="font-medium">{p.producto.nombre}</div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Monto</span>
                      <span>${p.monto}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Estado</span>
                      <Badge variant="outline">{p.estado_pago}</Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleClick(p)}
                    >
                      Ver plan
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PlanPagosModal
        abierto={modalAbierto}
        onCerrar={handleCerrarPlanPagos}
        plan={planTotal}
      />

      <Dialog open={modalFacturas} onOpenChange={setModalFacturas}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Facturas de la compra</DialogTitle>
          </DialogHeader>

          <FacturasCompra facturas={facturas} />
        </DialogContent>
      </Dialog>
    </>
  );
}
