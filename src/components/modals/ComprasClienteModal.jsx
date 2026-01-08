import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getComprasCliente } from "@/supabase/clientes";
import { DetalleCompraModal } from "./DetalleCompraModal";

export function ComprasClienteModal({ abierto, onCerrar, cliente }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  useEffect(() => {
    if (!abierto || !cliente) return;

    async function fetchCompras() {
      console.log(cliente.id);
      setLoading(true);
      try {
        const data = await getComprasCliente(cliente.id);
        setCompras(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompras();
  }, [abierto, cliente]);

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Compras de {cliente?.nombre} {cliente?.apellido}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando compras...</p>
        ) : compras.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este cliente no tiene compras registradas
          </p>
        ) : (
          <div className="space-y-2">
            {compras.map((compra) => (
              <button
                key={compra.id}
                onClick={() => {
                  setCompraSeleccionada(compra);
                  setDetalleAbierto(true);
                }}
                className="w-full text-left border rounded-md p-3 hover:bg-muted transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Compra #{compra.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {compra.fecha}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  Total: ${compra.monto_total}
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
      <DetalleCompraModal
        abierto={detalleAbierto}
        onCerrar={() => setDetalleAbierto(false)}
        compra={compraSeleccionada}
      />
    </Dialog>
  );
}
