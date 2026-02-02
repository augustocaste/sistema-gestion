import { supabase } from "./client";

export async function registrarCompra(
  fecha,
  empleado_id,
  montoTotal,
  seleccionados,
  cliente_id,
) {
  const { data, error } = await supabase.rpc("registrar_compra_rpc", {
    p_fecha: fecha,
    p_empleado_id: empleado_id,
    p_cliente_id: cliente_id,
    p_monto_total: montoTotal,
    p_seleccionados: seleccionados,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: "Compra registrada con éxito",
    compraId: data,
  };
}

export async function getFacturasByCompra(compraId) {
  const { data, error } = await supabase
    .from("compra_producto")
    .select(
      `
      id,
      monto,
      medio_pago,
      estado_pago,
      id_compra,
      cantidad,
      producto (
        nombre,
        garantia
      ),

      compra (
        fecha,
        cliente: id_cliente (
          nombre,
          apellido,
          telefono
        )
      ),

      plan_cuotas (
        cant_cuotas,
        monto_cuota,
        cuota (
          nro_cuota,
          fecha_vencimiento,
          estado,
          monto_actual_pagado
        )
      )
    `,
    )
    .eq("id_compra", compraId)
    .order("id", { ascending: true });

  if (error) throw error;

  return data;
}
