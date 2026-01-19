import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FacturaPreview } from "./FacturaPreview";
import { Factura } from "./Factura";
import { Button } from "@/components/ui/button";

export function FacturasCompra({ facturas }) {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const facturaVisibleRef = useRef(null);
  const facturasTodasRef = useRef(null);

  /* ======================
     IMPRIMIR
     ====================== */
  const imprimirUna = useReactToPrint({
    contentRef: facturaVisibleRef,
    documentTitle: "Factura",
  });

  const imprimirTodas = useReactToPrint({
    contentRef: facturasTodasRef,
    documentTitle: "Facturas compra",
  });

  return (
    <div className="space-y-6">
      {/* LISTADO */}
      {facturas.map((f) => (
        <FacturaPreview
          key={f.id}
          factura={f}
          onVer={() => setFacturaSeleccionada(f)}
        />
      ))}

      {/* FACTURA VISIBLE */}
      {facturaSeleccionada && (
        <div className="space-y-3">
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={imprimirUna}>
              Imprimir
            </Button>
          </div>

          <Factura
            ref={facturaVisibleRef}
            factura={facturaSeleccionada}
            onPrint={imprimirUna}
          />
        </div>
      )}

      {/* TODAS (OCULTO PARA PRINT/PDF) */}
      <div ref={facturasTodasRef} className="hidden print:block">
        {facturas.map((f) => (
          <Factura key={f.id} factura={f} />
        ))}
      </div>

      {facturas.length > 1 && (
        <div className="flex gap-2 pt-4 print:hidden">
          <Button className="flex-1" onClick={imprimirTodas}>
            Imprimir todas
          </Button>
        </div>
      )}
    </div>
  );
}
