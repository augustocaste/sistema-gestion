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

  // 🔄 Traer compras
  async function fetchCompras() {
    if (!cliente?.id) return;
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

  // ⚡ Se dispara al abrir o cambiar cliente
  useEffect(() => {
    if (!abierto || !cliente) return;
    fetchCompras();
  }, [abierto, cliente]);

  // 🔄 Actualizar solo la compra modificada en la lista
  function actualizarCompraEnLista(compraActualizada) {
    setCompras((prev) =>
      prev.map((c) => (c.id === compraActualizada.id ? compraActualizada : c)),
    );
  }

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent
        className="
          w-[95vw]
          sm:max-w-2xl
          max-h-[90vh]
          flex
          flex-col
        "
      >
        <DialogHeader>
          <DialogTitle>Compras de {cliente?.nombre_completo}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando compras...</p>
          ) : compras.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Este cliente no tiene compras registradas
            </p>
          ) : (
            <div className="space-y-2">
              {compras.map((compra) => {
                const todasCompletadas = compra.compra_producto?.every(
                  (cp) => cp.estado_pago === "Completado",
                );

                return (
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
                        <span className="font-medium">
                          Fecha: {compra.fecha}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1">
                        Total: ${compra.monto_total}
                      </div>
                    </button>

                    {todasCompletadas && (
                      <div
                        className="
                          w-full
                          text-sm
                          text-green-600
                          font-medium
                          border
                          border-green-500/30
                          bg-green-500/10
                          rounded-md
                          py-2
                          text-center
                        "
                      >
                        Compra pagada
                      </div>
                    )}

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
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>

      {/* MODALES HIJOS */}
      <DetalleCompraModal
        abierto={detalleAbierto}
        onCerrar={() => {
          setDetalleAbierto(false);
          setCompraSeleccionada(null);
          setCompraFacturas(null);
          setFacturasAbierto(false);
        }}
        compra={compraSeleccionada}
        actualizarCompraEnLista={actualizarCompraEnLista} // ✅ aquí
      />

      <FacturaModal
        open={facturasAbierto}
        compraId={compraFacturas?.id}
        onClose={() => setFacturasAbierto(false)}
      />
    </Dialog>
  );
}
