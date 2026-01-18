import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FacturaPreview } from "./FacturaPreview";
import { Factura } from "./Factura";

export function FacturasCompra({ facturas }) {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const facturaRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: facturaRef, // 🔥 CLAVE
    documentTitle: "Factura",
  });

  return (
    <div className="space-y-4">
      {facturas.map((f) => (
        <FacturaPreview key={f.id} factura={f} onVer={setFacturaSeleccionada} />
      ))}

      {facturaSeleccionada && (
        <Factura
          ref={facturaRef}
          factura={facturaSeleccionada}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}
