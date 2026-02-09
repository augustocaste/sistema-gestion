import { supabase } from "./client";

export async function getClientes(search = "", page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("cliente")
    .select("*", { count: "exact" })
    .eq("activo", true)
    .order("id", { ascending: true })
    .range(from, to);

  if (search) {
    query = query.ilike("nombre_completo", `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function buscarClientes(texto = "") {
  if (!texto) return { data: [] };

  const { data, error } = await supabase
    .from("cliente")
    .select("id, nombre_completo")
    .ilike("nombre_completo", `%${texto}%`)
    .eq("activo", true)
    .order("nombre_completo", { ascending: true })
    .limit(5);

  if (error) throw error;

  return { data };
}

// 🔹 Crear un cliente
export async function createCliente(cliente) {
  const { nombre_completo, dni, telefono, direccion, observaciones } = cliente;
  const { data, error } = await supabase
    .from("cliente")
    .insert([
      {
        nombre_completo,
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
        cantidad,
        producto (
          nombre
        )
      )
    `,
    )
    .eq("id_cliente", idCliente)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCompraById(idCompra) {
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
        cantidad,
        producto (
          nombre
        )
      )
    `,
    )
    .eq("id", idCompra)
    .single(); // 👈 importante

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
              nombre_completo
            )
          ),
          producto (
            id,
            nombre
          )  
        )
      )
    `,
    )
    .eq(
      "fecha_vencimiento",
      new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Argentina/Buenos_Aires",
      }),
    )
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
    `,
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
      cantidad,
      plan_cuotas (
        id,
        monto_cuota,
        cant_cuotas
      )
    `,
    )
    .eq("id", compraProductoId)
    .single();

  if (error) throw error;

  return data.plan_cuotas;
}

async function buscarClientesIds(search) {
  const { data, error } = await supabase
    .from("cliente")
    .select("id")
    .ilike("nombre_completo", `%${search}%`);

  if (error) throw error;

  return data.map((c) => c.id);
}

export async function getCuotas({ estado, search, page = 1, pageSize = 10 }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let clientesIds = [];

  if (search) {
    clientesIds = await buscarClientesIds(search);

    if (clientesIds.length === 0) {
      return { data: [], total: 0 };
    }
  }

  let query = supabase
    .from("cuota")
    .select(
      `
      id,
      nro_cuota,
      fecha_vencimiento,
      estado,
      monto_actual_pagado,
      plan_cuotas!inner (
        id,
        cant_cuotas,
        monto_cuota,
        compra_producto!inner (
          id,
          compra!inner (
            id,
            cliente!inner (
              id,
              nombre_completo
            )
          ),
          producto (
            id,
            nombre
          )
        )
      )
      `,
      { count: "exact" },
    )
    .eq("estado", estado)
    .order("fecha_vencimiento", { ascending: true })
    .range(from, to);

  // 🔹 FILTRO REAL (ESTA ES LA CLAVE)
  if (clientesIds.length > 0) {
    query = query.in(
      "plan_cuotas.compra_producto.compra.cliente.id",
      clientesIds,
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    total: count,
  };
}
