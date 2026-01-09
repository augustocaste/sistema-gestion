import { supabase } from "./client";

// 🔹 Obtener todos los clientes, opcionalmente filtrando por nombre
export async function getClientes(search = "", page = 1, pageSize = 10) {
  let query = supabase
    .from("cliente")
    .select("*", { count: "exact" }) // para obtener total de registros
    .eq("activo", true)
    .order("id", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data, total: count };
}

// 🔹 Crear un cliente
export async function createCliente(cliente) {
  const { nombre, apellido, dni, telefono, direccion, observaciones } = cliente;
  const { data, error } = await supabase
    .from("cliente")
    .insert([
      {
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        observaciones,
        activo: true,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}

// 🔹 Actualizar un producto
export async function updateCliente(id, updates) {
  const { data, error } = await supabase
    .from("cliente")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}

// 🔹 Eliminar un producto
export async function deleteCliente(id) {
  const { data, error } = await supabase
    .from("cliente")
    .update({ activo: false })
    .eq("id", id)
    .select();
  if (error) throw error;
  return true;
}

export async function getComprasCliente(idCliente) {
  const { data, error } = await supabase
    .from("compra")
    .select(
      `
      id,
      fecha,
      monto_total,

      empleados (
        nombre,
        apellido
      ),

      compra_producto (
        id,
        monto,
        estado_pago,
        producto (
          nombre
        )
      )
    `
    )
    .eq("id_cliente", idCliente)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCuotasVencidas() {
  const { data, error } = await supabase
    .from("cuota")
    .select(
      `
      id,
      nro_cuota,
      fecha_vencimiento,
      estado,
      monto_actual_pagado,
      plan_cuotas (
        id,
        monto_cuota,
        cant_cuotas,
        compra_producto (
          id,
          compra (
            id,
            clientes:cliente (
              nombre,
              apellido
            )
          )
        )
      )
    `
    )
    .eq("fecha_vencimiento", new Date().toISOString())
    .eq("estado", "pendiente")
    .order("fecha_vencimiento", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCuotasPorPlan(planCuotasId) {
  const { data, error } = await supabase
    .from("cuota")
    .select(
      `
      id,
      nro_cuota,
      fecha_vencimiento,
      fecha_pagada,
      estado,
      monto_actual_pagado
    `
    )
    .eq("id_plan_cuotas", planCuotasId)
    .order("nro_cuota", { ascending: true });

  if (error) throw error;
  return data;
}

export async function obtenerPlanCuotasPorProducto(compraProductoId) {
  const { data, error } = await supabase
    .from("compra_producto")
    .select(
      `
      plan_cuotas (
        id,
        monto_cuota,
        cant_cuotas
      )
    `
    )
    .eq("id", compraProductoId)
    .single();

  if (error) throw error;

  return data.plan_cuotas;
}
