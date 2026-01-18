import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FacturasCompra } from "../FacturaCompra";
import { getFacturasByCompra } from "@/supabase/compras";

export function FacturaModal({ open, compraId, onClose }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !compraId) return;

    async function cargarFacturas() {
      setLoading(true);

      console.log("El id de la compra es:", compraId);

      const result = await getFacturasByCompra(compraId);

      console.log("RESULTADO COMPLETO:", result);

      setFacturas(result ?? []);
      setLoading(false);
    }

    cargarFacturas();
  }, [open, compraId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Facturas de la compra</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando facturas...</p>
        ) : (
          <FacturasCompra facturas={facturas} />
        )}
      </DialogContent>
    </Dialog>
  );
}
