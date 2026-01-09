import { supabase } from "./client";

export async function updateCuota(dataPago, plan, cuota) {
  console.log("updateCuota data:", dataPago);
  console.log("dataPlan:", plan);
  console.log("dataCuota:", cuota);
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
