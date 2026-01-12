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

export async function createEmpleado(empleado) {
  console.log("Creating empleado with data:", empleado);
  try {
    const res = await fetch(
      "https://czpqppndnonhhxjynkkm.supabase.co/functions/v1/create-empleado",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empleado,
        }),
      }
    );
    console.log(res);
    const data = await res.json();
    console.log("Response data:", data.message);
    if (!data.ok) {
      return { ok: false, error: data.message };
    }

    return { ok: true };
  } catch (error) {
    console.error("Error creating empleado:", error);
    return { ok: false, error };
  }
}
