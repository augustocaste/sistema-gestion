import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Phone } from "lucide-react";

export const Factura = forwardRef(function Factura({ factura, onPrint }, ref) {
  if (!factura) return null;

  const [garantiaMeses, setGarantiaMeses] = useState("");

  const producto = factura.producto;
  const compra = factura.compra;
  const cuotas = factura.plan_cuotas?.cuota ?? [];
  const esCuotas = cuotas.length > 1;

  const clienteNombre = compra?.cliente
    ? `${compra.cliente.nombre} ${compra.cliente.apellido}`
    : "Consumidor final";

  const fechaFactura = compra?.fecha ?? "";
  const total = factura.monto;

  return (
    <div
      ref={ref}
      className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none"
      style={{ pageBreakAfter: "always" }}
    >
      <div className="p-8 pt-2">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          {/* LOGO */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 80" className="w-24 h-20 mb-2">
              <path
                d="M50 5 L95 40 L85 40 L85 75 L15 75 L15 40 L5 40 Z"
                fill="none"
                stroke="#1a5c4c"
                strokeWidth="4"
              />
              <rect
                x="40"
                y="45"
                width="20"
                height="30"
                fill="none"
                stroke="#1a5c4c"
                strokeWidth="3"
              />
            </svg>
            <h2 className="text-xl font-bold">PINO-ELECTRO</h2>
            <p className="text-sm tracking-widest text-gray-600">PIPINAS</p>
          </div>

          {/* TITULO + DATOS */}
          <div className="flex-1 ml-8">
            <h1 className="text-4xl font-bold text-right mb-6">FACTURA</h1>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="min-w-[140px] text-sm font-medium">
                  CLIENTE:
                </label>
                <Input
                  value={clienteNombre}
                  readOnly
                  className="border-0 border-b rounded-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="min-w-[140px] text-sm font-medium">
                  FECHA:
                </label>
                <Input
                  value={fechaFactura}
                  readOnly
                  className="border-0 border-b rounded-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLA PRODUCTO */}
        <table className="w-full border-collapse border-2 border-gray-900 mb-6">
          <thead>
            <tr>
              <th className="border-2 px-4 py-2 text-left w-[40%]">OBJETO</th>
              <th className="border-2 px-4 py-2 text-center w-[20%]">CUOTAS</th>
              <th className="border-2 px-4 py-2 text-center w-[20%]">PRECIO</th>
              <th className="border-2 px-4 py-2 text-center w-[20%]">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 px-2 py-1">{producto?.nombre}</td>
              <td className="border-2 px-2 py-1 text-center">
                {esCuotas ? `${cuotas.length} cuotas` : "Contado"}
              </td>
              <td className="border-2 px-2 py-1 text-center">
                $ {total.toLocaleString("es-AR")}
              </td>
              <td className="border-2 px-2 py-1 text-center font-bold">
                $ {total.toLocaleString("es-AR")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* INFO DE PAGO + TOTALES */}
        <div className="flex gap-8 mb-6">
          {/* IZQUIERDA */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-3">INFORMACIÓN DE PAGO</h3>

            <div className="mb-4">
              <p className="text-sm">
                Plan de pago:{" "}
                <strong>
                  {esCuotas ? `${cuotas.length} cuotas` : "Contado"}
                </strong>
              </p>
            </div>

            <h4 className="font-bold italic text-sm mb-2">
              Términos y Condiciones:
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              El pago debe realizarse dentro de los plazos acordados.
              <br />
              Garantía de{" "}
              <Input
                value={garantiaMeses}
                onChange={(e) => setGarantiaMeses(e.target.value)}
                className="inline-block w-8 h-5 border-0 border-b border-gray-400 rounded-none focus-visible:ring-0 text-xs text-center mx-1 p-0"
              />{" "}
              meses a partir de la entrega (con boleta de matriculado en
              productos específicos).
            </p>

            <p className="text-green-600 font-bold text-lg">GRACIAS</p>

            <div className="mt-2 text-sm text-blue-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>2213608367</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>2223426252</span>
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="w-64">
            <div className="bg-sky-100 p-4 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">
                  $ {total.toLocaleString("es-AR")}
                </span>
              </div>

              <div className="flex justify-between font-bold border-t border-sky-300 pt-2 mt-2">
                <span>TOTAL</span>
                <span>$ {total.toLocaleString("es-AR")}</span>
              </div>
            </div>

            {/* CUOTAS */}
            {esCuotas && (
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-2">Detalle de Cuotas</h4>
                <table className="w-full text-xs border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">N°</th>
                      <th className="border px-2 py-1">Monto</th>
                      <th className="border px-2 py-1">Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuotas.map((c) => (
                      <tr key={c.nro_cuota}>
                        <td className="border px-2 py-1 text-center">
                          {c.nro_cuota}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          $
                          {factura.plan_cuotas.monto_cuota.toLocaleString(
                            "es-AR",
                          )}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {c.fecha_vencimiento}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* FIRMAS */}
            <div className="mt-6 pt-4">
              <p className="italic font-serif text-lg">Brenda Valenzuela</p>
              <p className="italic font-serif text-lg">Facundo Maciel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
