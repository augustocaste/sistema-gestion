import { supabase } from "./client";

function agruparProductos(seleccionados) {
  return seleccionados.reduce((acc, p) => {
    acc[p.id] = (acc[p.id] || 0) + 1;
    return acc;
  }, {});
}

function sumarDias(fecha, dias) {
  const f = new Date(fecha);
  f.setDate(f.getDate() + dias);
  return f.toISOString().split("T")[0];
}

export async function registrarCompra(
  fecha,
  empleado_id,
  montoTotal,
  seleccionados,
  cliente_id,
) {
  /* ===============================
     1. VALIDAR STOCK
  =============================== */
  const cantidades = agruparProductos(seleccionados);
  const idsProductos = Object.keys(cantidades);

  const { data: productos, error: errorStock } = await supabase
    .from("producto")
    .select("id, stock, nombre")
    .in("id", idsProductos);

  if (errorStock) throw errorStock;

  for (const prod of productos) {
    if (prod.stock < cantidades[prod.id]) {
      return {
        ok: false,
        message: `Stock insuficiente para ${prod.nombre}`,
      };
    }
  }

  /* ===============================
     2. CREAR COMPRA
  =============================== */
  const { data: compra, error: errorCompra } = await supabase
    .from("compra")
    .insert({
      fecha,
      id_empleado: empleado_id,
      id_cliente: cliente_id,
      monto_total: montoTotal,
    })
    .select()
    .single();
  const compraId = compra.id;
  if (errorCompra)
    return { ok: false, message: "Hubo un error al guardar la compra" };

  /* ===============================
     3. PRODUCTOS + CUOTAS
  =============================== */
  for (const p of seleccionados) {
    let planCuotasId = null;

    // 🔹 SI ES EN CUOTAS
    if (p.tipo_pago === "cuotas" && p.cuotas > 1) {
      const montoCuota = Math.round(p.monto / p.cuotas);

      // 3.1 Crear plan de cuotas
      const { data: plan, error: errorPlan } = await supabase
        .from("plan_cuotas")
        .insert({
          cant_cuotas: p.cuotas,
          monto_cuota: montoCuota,
        })
        .select()
        .single();

      if (errorPlan)
        return { ok: false, message: "Error al crear plan de cuotas" };

      planCuotasId = plan.id;

      // 3.2 Crear cuotas
      for (let i = 1; i <= p.cuotas; i++) {
        console.log(
          "cuota a crear: nro " + plan.id,
          i,
          sumarDias(fecha, i * 30),
        );
        const { data: cuota, error: errorCuota } = await supabase
          .from("cuota")
          .insert({
            id_plan_cuotas: plan.id,
            nro_cuota: i,
            fecha_vencimiento: sumarDias(fecha, i * 30),
            estado: "pendiente",
            monto_actual_pagado: 0,
          });

        if (errorCuota) return { ok: false, message: "Error al crear cuota" };
      }
    } else if (p.tipo_pago == "contado") {
      const { data: plan, error: errorPlan } = await supabase
        .from("plan_cuotas")
        .insert({
          cant_cuotas: 1,
          monto_cuota: p.monto,
        })
        .select()
        .single();

      const { data: cuota, error: errorCuota } = await supabase
        .from("cuota")
        .insert({
          id_plan_cuotas: plan.id,
          nro_cuota: 1,
          fecha_vencimiento: fecha,
          estado: "pagada",
          monto_actual_pagado: p.monto,
        });
      planCuotasId = plan.id;
    }

    // 3.3 Insertar compra_producto
    console.log(
      "compra_producto a insertar: ",
      compraId,
      p.id,
      p.monto,
      p.tipo_pago,
      p.medio_pago,
      planCuotasId,
    );
    const { data: compra_producto, error: errorCompraProducto } = await supabase
      .from("compra_producto")
      .insert({
        id_compra: compraId,
        id_producto: p.id,
        monto: p.monto,
        estado_pago: p.tipo_pago === "contado" ? "Completado" : "No completado",
        medio_pago: p.tipo_pago,
        id_plan_cuotas: planCuotasId,
      });

    if (errorCompraProducto)
      return { ok: false, message: "Error al crear compra_producto" };

    // 3.4 Descontar stock
    const prod = productos.find((pr) => pr.id === p.id);

    const { data: stock, error: errorStock } = await supabase
      .from("producto")
      .update({
        stock: prod.stock - cantidades[p.id],
      })
      .eq("id", p.id);

    if (errorStock)
      return { ok: false, message: "Error al actualizar stock del producto" };
  }

  return { ok: true, message: "Compra registrada con éxito", compraId };
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
      producto (
        nombre
      ),

      compra (
        fecha,
        cliente: id_cliente (
          nombre,
          apellido
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
  console.log("la query da " + JSON.stringify(data));
  if (error) throw error;

  return data;
}
