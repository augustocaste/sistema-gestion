import { supabase } from "./client";

export async function getCantidadProductos() {
  const { data, error } = await supabase
    .from("producto")
    .select("id", { count: "exact" })
    .eq("activo", true);
  if (error) throw error;
  return data.length;
}

export async function getCantidadClientes() {
  const { data, error } = await supabase
    .from("cliente")
    .select("id", { count: "exact" })
    .eq("activo", true);
  if (error) throw error;
  return data.length;
}

export async function getVentasDelMes() {
  const now = new Date();

  // Inicio del mes
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

  // Inicio del mes siguiente
  const inicioMesSiguiente = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const { data, error } = await supabase
    .from("compra")
    .select("monto_total")
    .gte("fecha", inicioMes.toISOString())
    .lt("fecha", inicioMesSiguiente.toISOString());

  if (error) {
    console.error("Error calculando ingresos del mes:", error);
    return 0;
  }
  return data.reduce((acc, venta) => acc + Number(venta.monto_total), 0);
}

export async function getCantidadEmpleados() {
  const { data, error } = await supabase
    .from("empleados")
    .select("id", { count: "exact" })
    .eq("activo", true);
  if (error) throw error;
  return data.length;
}
