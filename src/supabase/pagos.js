import { supabase } from "./client";

export async function updateCuota(dataPago, plan, cuota) {
  try {
    cuota.monto_actual_pagado += Number(dataPago.monto);
    if (cuota.monto_actual_pagado == plan.monto_cuota) {
      cuota.estado = "pagada";
      cuota.fecha_pagada = dataPago.fecha;
    }
    const { error } = await supabase
      .from("cuota")
      .update({
        monto_actual_pagado: cuota.monto_actual_pagado,
        estado: cuota.estado,
        fecha_pagada: cuota.fecha_pagada,
      })
      .eq("id", cuota.id);
    const pago = {
      destino: dataPago.metodo == "efectivo" ? "" : dataPago.alias,
      metodo: dataPago.metodo,
      monto: dataPago.monto,
      fecha: dataPago.fecha,
    };

    if (error) {
      console.error("Error updating cuota:", error);
      return { ok: false, error };
    }

    const { errorPago } = await supabase.from("pago").insert(pago);

    if (errorPago) {
      console.error("Error updating transferencia:", errorPago);
      return { ok: false, error };
    }
  } catch (error) {
    console.error("Unexpected error updating cuota:", error);
    return { ok: false, error };
  }

  return { ok: true };
}

export async function verificarYCompletarPlan(planCuotasId) {
  if (!planCuotasId) {
    throw new Error("planCuotasId es obligatorio");
  }

  // 1️⃣ Traer todas las cuotas del plan
  const { data: cuotas, error: cuotasError } = await supabase
    .from("cuota")
    .select("id, estado")
    .eq("id_plan_cuotas", planCuotasId);

  if (cuotasError) throw cuotasError;

  if (!cuotas || cuotas.length === 0) {
    throw new Error("El plan no tiene cuotas asociadas");
  }

  // 2️⃣ Verificar si TODAS están pagadas
  const todasPagadas = cuotas.every((cuota) => cuota.estado === "pagada");

  if (!todasPagadas) {
    return {
      ok: true,
      completado: false,
      message: "El plan aún tiene cuotas pendientes",
    };
  }

  // 3️⃣ Actualizar estado del plan
  const { error: planError } = await supabase
    .from("compra_producto")
    .update({ estado_pago: "Completado" })
    .eq("id_plan_cuotas", planCuotasId);

  if (planError) throw planError;

  // 4️⃣ Eliminar todas las cuotas del plan
  // const { error: deleteError } = await supabase
  //   .from("cuota")
  //   .delete()
  //   .eq("id_plan_cuotas", planCuotasId);

  // if (deleteError) throw deleteError;

  return {
    ok: true,
    completado: true,
    message: "Plan de cuotas completado",
  };
}

function formatDateAR(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateRange(tipo) {
  const hoy = new Date();
  let desde;

  switch (tipo) {
    case "dia": {
      desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      break;
    }

    case "semana": {
      desde = new Date(hoy);
      desde.setDate(desde.getDate() - 7);
      break;
    }

    case "mes": {
      desde = new Date(hoy);
      desde.setMonth(desde.getMonth() - 1);
      break;
    }

    default:
      desde = new Date(hoy);
  }

  return {
    desde: formatDateAR(desde),
    hasta: formatDateAR(hoy),
  };
}

export async function getResumenPagos(periodo) {
  const { desde, hasta } = getDateRange(periodo);

  const { data, error } = await supabase
    .from("pago")
    .select("destino, metodo, monto, fecha")
    .gte("fecha", desde)
    .lte("fecha", hasta);

  if (error) throw error;

  let totalGeneral = 0;

  const efectivo = { total: 0, cantidad: 0 };
  const porAlias = {};

  for (const p of data) {
    totalGeneral += p.monto;

    if (p.metodo === "efectivo") {
      efectivo.total += p.monto;
      efectivo.cantidad += 1;
    } else {
      if (!porAlias[p.destino]) {
        porAlias[p.destino] = {
          destino: p.destino,
          total: 0,
          cantidad: 0,
        };
      }

      porAlias[p.destino].total += p.monto;
      porAlias[p.destino].cantidad += 1;
    }
  }

  const transferencias = Object.values(porAlias);

  return {
    totalGeneral,
    efectivo,
    transferencias,
  };
}
