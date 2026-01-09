import { supabase } from "./client";

// 🔹 Obtener todos los productos, opcionalmente filtrando por nombre
export async function getProductos(search = "", page = 1, pageSize = 10) {
  let query = supabase
    .from("producto")
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

// 🔹 Crear un producto
export async function createProducto(producto) {
  const {
    nombre,
    precio_contado,
    stock,
    cantidad_cuotas,
    tres_cuotas,
    seis_cuotas,
    nueve_cuotas,
    doce_cuotas,
  } = producto;
  const { data, error } = await supabase
    .from("producto")
    .insert([
      {
        nombre,
        precio_contado,
        stock,
        cantidad_cuotas,
        tres_cuotas,
        seis_cuotas,
        nueve_cuotas,
        doce_cuotas,
        activo: true,
      },
    ])
    .select();
  if (error) throw error;
  return data;
}

// 🔹 Actualizar un producto
export async function updateProducto(id, updates) {
  const { data, error } = await supabase
    .from("producto")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}

// 🔹 Eliminar un producto
export async function deleteProducto(id) {
  const { data, error } = await supabase
    .from("producto")
    .update({ activo: false })
    .eq("id", id)
    .select();
  if (error) throw error;
  return true;
}
