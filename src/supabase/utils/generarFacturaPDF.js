import html2pdf from "html2pdf.js";

export async function generarFacturaPDF(element) {
  return html2pdf()
    .set({
      margin: 10,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    })
    .from(element)
    .outputPdf("blob");
}
