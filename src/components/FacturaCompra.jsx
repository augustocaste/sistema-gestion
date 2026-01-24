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

  /* ======================
     IMPRESIÓN
     ====================== */
  const imprimirUna = useReactToPrint({
    contentRef: facturaVisibleRef,
    documentTitle: "Factura",
  });

  const imprimirTodas = useReactToPrint({
    contentRef: facturasTodasRef,
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
        backgroundColor: "#ffffff", // obligatorio para no tener transparencia
      });

      const base64 = canvas.toDataURL("image/png").split(",")[1];
      if (!base64) throw new Error("No se pudo generar base64 correctamente");
      return base64;
    } catch (error) {
      console.error("Error al generar imagen base64:", error);
      return null; // Devolver null si la generación falla
    }
  }

  async function generarPDF(facturas) {
    const doc = new jsPDF();

    for (let index = 0; index < facturas.length; index++) {
      const factura = facturas[index];

      // Selecciona el elemento de la factura
      const facturaElemento = document.getElementById(`factura-${factura.id}`);

      if (!facturaElemento) {
        console.error("Factura no encontrada para el ID:", factura.id);
        continue;
      }

      // Espera a que la imagen base64 de cada factura sea generada
      const base64 = await generarImagenBase64(facturaElemento);

      // Si no se pudo generar la imagen base64, continuar con la siguiente factura
      if (!base64) {
        console.error(
          "No se pudo generar la imagen para la factura ID:",
          factura.id,
        );
        continue;
      }

      // Agregar la imagen al PDF
      doc.addImage(base64, "PNG", 10, 10, 180, 260);

      // Si no es la última factura, agregar una nueva página
      if (index < facturas.length - 1) {
        doc.addPage();
      }
    }

    // Generar el PDF como ArrayBuffer para su posterior uso
    return doc.output("arraybuffer");
  }

  // Función para convertir ArrayBuffer a Base64
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary); // Convertir a Base64
  }

  // Función para subir el archivo a Backblaze
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
      return data.url; // URL pública del archivo
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
      const nombre = facturaSeleccionada.compra.cliente.nombre;

      const base64 = await generarImagenBase64(facturaVisibleRef.current);
      const url = await subirArchivoABackblaze({
        fileBuffer: base64,
        filename: `factura-${facturaSeleccionada.id}.png`,
        mime: "image/png",
      });

      const texto = encodeURIComponent(
        `Hola ${nombre}\nTe envío tu factura:\n${url}`,
      );
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

      // Generar el PDF con todas las facturas
      const pdfBuffer = await generarPDF(facturas);
      console.log("PDF generado exitosamente ", pdfBuffer);

      // Subir el PDF a Backblaze
      const url = await subirArchivoABackblaze({
        fileBuffer: pdfBuffer,
        filename: `facturas-${Date.now()}.pdf`,
        mime: "application/pdf", // MIME tipo para PDF
      });

      const texto = encodeURIComponent(
        `Hola 👋\nTe envío las facturas en PDF:\n${url}`,
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

      {/* TODAS LAS FACTURAS (OCULTO PARA IMPRESIÓN/GENERO IMAGEN) */}
      <div ref={facturasTodasRef} className="hidden print:block">
        {facturas.map((f) => (
          <Factura key={f.id} factura={f} id={`factura-${f.id}`} />
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
