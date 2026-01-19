import { Button } from "@/components/ui/button";

export function FacturaPreview({ factura, onVer }) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{factura.producto.nombre}</p>
        <p className="text-sm text-muted-foreground">
          ${factura.monto.toLocaleString("es-AR")}
        </p>
      </div>

      <Button variant="outline" onClick={onVer}>
        Ver factura
      </Button>
    </div>
  );
}
