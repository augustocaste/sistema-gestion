import { supabase } from "./client";

export async function getTrabajadores() {
  const { data, error } = await supabase
    .from("empleados")
    .select("id, nombre, apellido")
    .eq("activo", true)
    .order("apellido");

  if (error) throw error;
  return data;
}
