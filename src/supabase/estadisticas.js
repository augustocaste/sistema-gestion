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

  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
  const inicioMesSiguiente = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const inicioMesStr = inicioMes.toISOString().slice(0, 10);
  const inicioMesSiguienteStr = inicioMesSiguiente.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("compra")
    .select("monto_total")
    .gte("fecha", inicioMesStr)
    .lt("fecha", inicioMesSiguienteStr);

  if (error) {
    console.error("Error calculando ingresos del mes:", error);
    return 0;
  }

  return data.reduce((acc, venta) => acc + (venta.monto_total ?? 0), 0);
}

export async function getTotalInvertidoStock() {
  const { data, error } = await supabase
    .from("producto")
    .select("stock, precio_contado")
    .eq("activo", true);

  if (error) {
    console.error("Error calculando total invertido:", error);
    return "0";
  }

  const total = data.reduce(
    (acc, prod) => acc + (prod.stock ?? 0) * (prod.precio_contado ?? 0),
    0,
  );

  return total.toLocaleString("es-AR");
}
