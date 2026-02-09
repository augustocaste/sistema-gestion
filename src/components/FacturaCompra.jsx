import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FacturaPreview } from "./FacturaPreview";
import { Factura } from "./Factura";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function FacturasCompra({ facturas }) {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [loadingWsp, setLoadingWsp] = useState(false);

  const facturaVisibleRef = useRef(null);
  const facturasTodasRef = useRef(null);

  const facturasPrintRef = useRef(null);

  /* ======================
     IMPRESIÓN
     ====================== */
  const imprimirUna = useReactToPrint({
    contentRef: facturaVisibleRef,
    documentTitle: "Factura",
  });

  const imprimirTodas = useReactToPrint({
    contentRef: facturasPrintRef,
    documentTitle: "Facturas compra",
  });

  /* ======================
     GENERAR IMAGEN BASE64 PARA FACTURA
     ====================== */
  async function generarImagenBase64(element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const base64 = canvas.toDataURL("image/png").split(",")[1];
      if (!base64) throw new Error("No se pudo generar base64 correctamente");
      return base64;
    } catch (error) {
      console.error("Error al generar imagen base64:", error);
      return null;
    }
  }

  async function generarPDF(facturas) {
    const doc = new jsPDF("p", "mm", "a4"); // vertical, mm, A4

    for (let index = 0; index < facturas.length; index++) {
      const factura = facturas[index];
      const facturaElemento = document.getElementById(`factura-${factura.id}`);
      if (!facturaElemento) continue;

      await new Promise((r) => setTimeout(r, 50));

      const canvas = await html2canvas(facturaElemento, {
        scale: 1.5, // reduce tamaño
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Convertir a JPEG comprimido
      const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];

      const pdfWidth = 210; // ancho A4 en mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // mantiene proporción

      doc.addImage(base64, "JPEG", 0, 0, pdfWidth, pdfHeight);

      if (index < facturas.length - 1) doc.addPage();
    }

    return doc.output("arraybuffer");
  }

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  async function subirArchivoABackblaze({ fileBuffer, filename, mime }) {
    try {
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error("El archivo no contiene datos válidos.");
      }
      const res = await fetch(
        "https://czpqppndnonhhxjynkkm.supabase.co/functions/v1/subir-factura",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileBase64: fileBuffer,
            filename,
            mime,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al subir");
      return data.url;
    } catch (err) {
      console.error("Error al subir archivo:", err);
      throw err;
    }
  }

  /* ======================
     WHATSAPP - UNA FACTURA
     ====================== */
  async function compartirWhatsApp() {
    if (!facturaSeleccionada) return;
    try {
      setLoadingWsp(true);
      const telefono = `+549${facturaSeleccionada.compra.cliente.telefono}`;
      const base64 = await generarImagenBase64(facturaVisibleRef.current);
      const url = await subirArchivoABackblaze({
        fileBuffer: base64,
        filename: `factura-${facturaSeleccionada.id}.png`,
        mime: "image/png",
      });

      const texto = encodeURIComponent(`Hola \nTe envío tu factura:\n${url}`);
      window.open(`https://wa.me/${telefono}?text=${texto}`, "_blank");
    } catch (e) {
      console.error(e);
      toast.error("Error al compartir la factura");
    } finally {
      setLoadingWsp(false);
    }
  }

  /* ======================
     WHATSAPP - TODAS LAS FACTURAS
     ====================== */
  async function compartirTodasWhatsApp() {
    try {
      setLoadingWsp(true);
      const pdfArrayBuffer = await generarPDF(facturas);
      const pdfBase64 = arrayBufferToBase64(pdfArrayBuffer);
      const url = await subirArchivoABackblaze({
        fileBuffer: pdfBase64,
        filename: `facturas-${Date.now()}.pdf`,
        mime: "application/pdf",
      });
      console.log("URL del PDF subido:", url);
      const texto = encodeURIComponent(
        `Hola, \nte envío las facturas en PDF:\n${url}`,
      );
      window.open(`https://wa.me/?text=${texto}`, "_blank");
    } catch (e) {
      console.error("Error al compartir las facturas:", e);
      toast.error("Error al compartir las facturas");
    } finally {
      setLoadingWsp(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* LISTADO DE FACTURAS */}
      {facturas.map((f) => (
        <FacturaPreview
          key={f.id}
          factura={f}
          onVer={() => setFacturaSeleccionada(f)}
        />
      ))}

      {/* FACTURA SELECCIONADA */}
      {facturaSeleccionada && (
        <div className="space-y-3">
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={imprimirUna}>
              Imprimir
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={compartirWhatsApp}
              disabled={loadingWsp}
            >
              <MessageCircle className="h-5 w-5 text-green-500" />
              Compartir por WhatsApp
            </Button>
          </div>

          <Factura
            ref={facturaVisibleRef}
            factura={facturaSeleccionada}
            id={`factura-${facturaSeleccionada.id}`}
          />
        </div>
      )}

      {/* TODAS LAS FACTURAS (RENDER INVISIBLE PERO MEDIBLE) */}
      <div
        ref={facturasTodasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "210mm",
          backgroundColor: "#fff",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {facturas.map((f) => (
          <Factura key={f.id} factura={f} id={`factura-${f.id}`} />
        ))}
      </div>

      {/* CONTENEDOR SOLO PARA IMPRESIÓN */}
      <div className="hidden print:block" ref={facturasPrintRef}>
        {facturas.map((f) => (
          <Factura key={`print-${f.id}`} factura={f} />
        ))}
      </div>

      {facturas.length > 1 && (
        <div className="flex gap-2 pt-4 print:hidden">
          <Button className="flex-1" onClick={imprimirTodas}>
            Imprimir todas
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 flex-1"
            onClick={compartirTodasWhatsApp}
            disabled={loadingWsp}
          >
            <MessageCircle className="h-5 w-5 text-green-500" />
            Compartir todas
          </Button>
        </div>
      )}
    </div>
  );
}
