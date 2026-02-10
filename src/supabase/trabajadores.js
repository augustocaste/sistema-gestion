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
  try {
    const res = await fetch(
      "https://czpqppndnonhhxjynkkm.supabase.co/functions/v1/create-empleado",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empleado }),
      },
    );

    const data = await res.json();

    if (!data.ok) {
      return {
        ok: false,
        error: {
          message: data.message,
        },
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: {
        message: "Error de conexión",
      },
    };
  }
}

export async function getEmpleados(search = "", page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("empleados")
    .select("*", { count: "exact" })
    .eq("activo", true)
    .order("nombre", { ascending: true })
    .range(from, to);

  if (search) {
    query = query.ilike("nombre", `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data ?? [],
    total: count ?? 0,
  };
}

export async function updateEmpleado(id, updates) {
  try {
    // sacar campos que no pertenecen a la tabla empleados
    const { email, password, ...safeUpdates } = updates;

    const { data, error } = await supabase
      .from("empleados")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      // DNI duplicado
      if (error.code === "23505") {
        return {
          ok: false,
          error: { message: "Ya existe un empleado con ese DNI" },
        };
      }

      // cualquier otro error de supabase
      return {
        ok: false,
        error: { message: error.message },
      };
    }

    return {
      ok: true,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      error: { message: err.message },
    };
  }
}

export async function deleteEmpleado(id) {
  const { error } = await supabase
    .from("empleados")
    .update({ activo: false })
    .eq("id", id);

  if (error) throw error;

  return true;
}
