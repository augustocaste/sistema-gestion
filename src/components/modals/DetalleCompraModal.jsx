import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function DetalleCompraModal({ abierto, onCerrar, compra }) {
  if (!compra) return null;

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

          <div className="pt-3 border-t">
            <p className="font-medium mb-2">Productos</p>

            <ul className="space-y-2">
              {compra.compra_producto.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2"
                >
                  <Badge variant="outline">Nombre: {p.producto.nombre}</Badge>

                  <div className="flex gap-2">
                    <Badge variant="secondary">Monto: ${p.monto}</Badge>
                    <Badge variant="outline">
                      Estado del pago: {p.estado_pago}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
