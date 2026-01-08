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
    query = query.ilike("nombre", `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data, total: count };
}

// 🔹 Crear un cliente
export async function createCliente(cliente) {
  console.log("Creando cliente:", cliente);
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
