import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getComprasCliente } from "@/supabase/clientes";
import { DetalleCompraModal } from "./DetalleCompraModal";
import { FacturaModal } from "./FacturaModal";

export function ComprasClienteModal({ abierto, onCerrar, cliente }) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);

  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [detalleAbierto, setDetalleAbierto] = useState(false);

  const [facturasAbierto, setFacturasAbierto] = useState(false);
  const [compraFacturas, setCompraFacturas] = useState(null);

  useEffect(() => {
    if (!abierto || !cliente) return;

    async function fetchCompras() {
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
      <DialogContent
        className="
          w-[95vw]
          sm:max-w-2xl
          max-h-[90vh]   /* 👈 límite de altura */
          flex
          flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>
            Compras de {cliente?.nombre} {cliente?.apellido}
          </DialogTitle>
        </DialogHeader>

        {/* ===== CONTENIDO SCROLLEABLE ===== */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando compras...</p>
          ) : compras.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Este cliente no tiene compras registradas
            </p>
          ) : (
            <div className="space-y-2">
              {compras.map((compra) => (
                <div
                  key={compra.id}
                  className="border rounded-md p-3 space-y-2"
                >
                  <button
                    onClick={() => {
                      setCompraSeleccionada(compra);
                      setDetalleAbierto(true);
                    }}
                    className="w-full text-left hover:bg-muted transition rounded-md p-2"
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

                  <button
                    onClick={() => {
                      setCompraFacturas(compra);
                      setFacturasAbierto(true);
                    }}
                    className="
                      w-full
                      text-sm
                      border
                      rounded-md
                      py-2
                      hover:bg-muted
                      transition
                    "
                  >
                    Ver facturas
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      {/* ===== MODALES HIJOS ===== */}
      <DetalleCompraModal
        abierto={detalleAbierto}
        onCerrar={() => setDetalleAbierto(false)}
        compra={compraSeleccionada}
      />

      <FacturaModal
        open={facturasAbierto}
        compraId={compraFacturas?.id}
        onClose={() => setFacturasAbierto(false)}
      />
    </Dialog>
  );
}
