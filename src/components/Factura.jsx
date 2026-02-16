"use client";

import { forwardRef, useState } from "react";

const PhoneIcon = () => (
  <svg
    style={{ width: "16px", height: "16px" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2563eb"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const Factura = forwardRef(function Factura(
  { factura, onPrint, id },
  ref,
) {
  const garantia =
    factura.producto.garantia == 0 ? 0 : factura.producto.garantia;
  const [garantiaMeses, setGarantiaMeses] = useState(garantia || "S/N");

  if (!factura) return null;

  const producto = factura.producto;
  const compra = factura.compra;
  const cantCuotas = factura.plan_cuotas.cant_cuotas;
  const cuotas = factura.plan_cuotas?.cuota ?? [];
  const esCuotas = cantCuotas > 1;

  const clienteNombre = compra?.cliente
    ? `${compra.cliente.nombre_completo}`
    : "Consumidor final";

  const fechaFactura = compra?.fecha ?? "";
  const total = factura.monto;
  const cantidad = factura.cantidad ?? 1;
  const precioUnitario = total / cantidad;

  return (
    <div
      ref={ref}
      id={id} // <--- importante para html2canvas
      style={{
        maxWidth: "210mm",
        margin: "0 auto",
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
        pageBreakAfter: "always",
        padding: "32px",
        paddingTop: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg
            viewBox="0 0 100 80"
            style={{ width: "96px", height: "80px", marginBottom: "8px" }}
          >
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
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            PINO-ELECTRO
          </h2>
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "3px",
              color: "#666",
              margin: 0,
            }}
          >
            PIPINAS
          </p>
        </div>

        {/* TITULO + DATOS */}
        <div style={{ flex: 1, marginLeft: "32px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "right",
              marginBottom: "24px",
            }}
          >
            FACTURA
          </h1>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <label
                style={{ minWidth: "140px", fontSize: "14px", fontWeight: 500 }}
              >
                CLIENTE:
              </label>
              <div
                style={{
                  flex: 1,
                  borderBottom: "1px solid #ccc",
                  padding: "6px 0 4px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  minHeight: "24px",
                  whiteSpace: "nowrap",
                }}
              >
                {clienteNombre}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <label
                style={{ minWidth: "140px", fontSize: "14px", fontWeight: 500 }}
              >
                FECHA:
              </label>
              <div
                style={{
                  flex: 1,
                  borderBottom: "1px solid #ccc",
                  padding: "6px 0 4px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  minHeight: "24px",
                  whiteSpace: "nowrap",
                }}
              >
                {fechaFactura}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA PRODUCTO */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid #111",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "2px solid #111",
                padding: "8px 16px",
                textAlign: "left",
                fontWeight: "bold",
                backgroundColor: "white",
                width: "40%",
              }}
            >
              OBJETO
            </th>
            <th
              style={{
                border: "2px solid #111",
                padding: "8px 16px",
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "white",
                width: "20%",
              }}
            >
              CUOTAS
            </th>
            <th
              style={{
                border: "2px solid #111",
                padding: "8px 16px",
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "white",
                width: "20%",
              }}
            >
              PRECIO
            </th>
            <th
              style={{
                border: "2px solid #111",
                padding: "8px 16px",
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "white",
                width: "20%",
              }}
            >
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "2px solid #111", padding: "4px 8px" }}>
              {producto?.nombre}
              {cantidad > 1 && (
                <span style={{ fontSize: "14px", color: "#666" }}>
                  {" "}
                  × {cantidad}
                </span>
              )}
            </td>
            <td
              style={{
                border: "2px solid #111",
                padding: "4px 8px",
                textAlign: "center",
              }}
            >
              {esCuotas
                ? `${cuotas.filter((c) => c.estado === "pagada").length} de ${cantCuotas}`
                : "Contado"}
            </td>
            <td
              style={{
                border: "2px solid #111",
                padding: "4px 8px",
                textAlign: "center",
              }}
            >
              $ {factura.plan_cuotas.monto_cuota.toLocaleString("es-AR")}
            </td>
            <td
              style={{
                border: "2px solid #111",
                padding: "4px 8px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              $ {factura.plan_cuotas.monto_cuota.toLocaleString("es-AR")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* INFO DE PAGO + TOTALES */}
      <div style={{ display: "flex", gap: "32px", marginBottom: "24px" }}>
        {/* IZQUIERDA */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            INFORMACIÓN DE PAGO
          </h3>

          <div style={{ marginBottom: "16px", fontSize: "14px" }}>
            <p style={{ margin: 0 }}>
              Plan de pago:{" "}
              <strong>{esCuotas ? `${cantCuotas} cuotas` : "Contado"}</strong>
            </p>
          </div>

          <h4
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            Términos y Condiciones:
          </h4>
          <p
            style={{
              fontSize: "12px",
              color: "#444",
              lineHeight: 1.6,
              marginBottom: "16px",
            }}
          >
            El pago debe realizarse dentro de los plazos acordados.
            <br />
            Garantía de{" "}
            <input
              value={garantiaMeses}
              onChange={(e) => setGarantiaMeses(e.target.value)}
              style={{
                display: "inline-block",
                width: "50px", // Mayor espacio para asegurar que el número entre completo
                height: "30px", // Aseguramos que el alto sea suficiente
                border: "none",
                borderBottom: "2px solid #1a5c4c", // Borde inferior más grueso
                textAlign: "center", // Centrado de texto
                fontSize: "16px", // Mejor tamaño para que se vea bien
                lineHeight: "30px", // Centrado verticalmente, coincidiendo con el alto
                padding: "0", // Eliminamos el padding adicional para evitar el corte
                outline: "none", // Elimina el contorno azul del campo al seleccionar
                backgroundColor: "transparent", // Fondo transparente
                boxSizing: "border-box", // Asegura que el padding no afecte el tamaño
                whiteSpace: "nowrap", // Evita el salto de línea dentro del input
              }}
            />
            meses a partir de la entrega (con boleta de matriculado en productos
            específicos).
          </p>

          <p
            style={{
              color: "#16a34a",
              fontWeight: "bold",
              fontSize: "18px",
              margin: 0,
            }}
          >
            GRACIAS
          </p>

          <div style={{ marginTop: "8px", fontSize: "14px", color: "#2563eb" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <PhoneIcon />
              <span>2213608367</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <PhoneIcon />
              <span>2223426252</span>
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <div style={{ width: "256px" }}>
          <div
            style={{
              backgroundColor: "#e0f2fe",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "14px" }}>Subtotal</span>
              <span style={{ fontSize: "14px" }}>
                $ {factura.plan_cuotas.monto_cuota.toLocaleString("es-AR")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                borderTop: "1px solid #7dd3fc",
                paddingTop: "8px",
                marginTop: "8px",
              }}
            >
              <span>TOTAL</span>
              <span>
                {" "}
                $ {factura.plan_cuotas.monto_cuota.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* CUOTAS */}
          {esCuotas && cuotas.length > 1 && (
            <div style={{ marginTop: "16px" }}>
              <h4
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Detalle de Cuotas
              </h4>
              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  borderCollapse: "collapse",
                  border: "1px solid #ccc",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        backgroundColor: "#f3f4f6",
                        fontWeight: "bold",
                      }}
                    >
                      N°
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        backgroundColor: "#f3f4f6",
                        fontWeight: "bold",
                      }}
                    >
                      Monto
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        backgroundColor: "#f3f4f6",
                        fontWeight: "bold",
                      }}
                    >
                      Vencimiento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cuotas.map((c) => (
                    <tr key={c.nro_cuota}>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "4px 8px",
                          textAlign: "center",
                        }}
                      >
                        {c.nro_cuota}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "4px 8px",
                          textAlign: "right",
                        }}
                      >
                        ${" "}
                        {factura.plan_cuotas.monto_cuota.toLocaleString(
                          "es-AR",
                        )}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "4px 8px",
                          textAlign: "center",
                        }}
                      >
                        {c.fecha_vencimiento}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* FIRMAS */}
          <div style={{ marginTop: "24px", paddingTop: "16px" }}>
            <p
              style={{
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
                fontSize: "18px",
                margin: "4px 0",
              }}
            >
              Brenda Valenzuela
            </p>
            <p
              style={{
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
                fontSize: "18px",
                margin: "4px 0",
              }}
            >
              Facundo Maciel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
