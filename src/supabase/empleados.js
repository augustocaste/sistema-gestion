import { supabase } from "./client";

// 🔹 Obtener todos los clientes, opcionalmente filtrando por nombre
export async function getEmpleados(search = "", page = 1, pageSize = 10) {
  let query = supabase
    .from("empleados")
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

export async function buscarEmpleados(texto) {
  let query = supabase
    .from("empleados")
    .select("id, nombre, apellido")
    .limit(5);
  query = query.or(`nombre.ilike.%${texto}%,apellido.ilike.%${texto}%`);

  return await query;
}
