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
    if (error) {
      console.error("Error updating cuota:", error);
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
  console.log("Cuotas del plan:", cuotas);
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

  return {
    ok: true,
    completado: true,
    message: "Plan de cuotas completado",
  };
}
