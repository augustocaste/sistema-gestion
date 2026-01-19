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
      const result = await getFacturasByCompra(compraId);
      setFacturas(result ?? []);
      setLoading(false);
    }

    cargarFacturas();
  }, [open, compraId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw]
          max-w-5xl
          max-h-[95vh]
          overflow-y-auto
          p-4
          sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Facturas de la compra
          </DialogTitle>
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
