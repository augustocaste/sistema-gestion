import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, MoreVertical, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteEmpleado";
import { EmpleadoModal } from "@/components/modals/EmpleadoModal";

import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "@/supabase/trabajadores";

export function Trabajadores() {
  const [empleados, setEmpleados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [modoModal, setModoModal] = useState("editar");

  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);

  async function fetchEmpleados(page = 1, filtro = search) {
    try {
      const { data, total } = await getEmpleados(filtro, page, pageSize);
      setEmpleados(data);
      setTotalEmpleados(total);
      setPagina(page);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEmpleados(1, search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const totalPaginas = Math.ceil(totalEmpleados / pageSize);

  async function handleGuardarEmpleado(formData) {
    let res;
    try {
      if (modoModal === "editar") {
        res = await updateEmpleado(empleadoSeleccionado.id, formData);
      } else {
        res = await createEmpleado(formData);
      }
      console.log("Respuesta de guardar empleado:", res);
      setModalAbierto(false);
      fetchEmpleados(pagina, search);
      return res;
    } catch (error) {
      return res;
    }
  }

  async function handleEliminar() {
    if (!elementoAEliminar) return;

    try {
      await deleteEmpleado(elementoAEliminar.id);
      fetchEmpleados(pagina, search);
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false };
    } finally {
      setDeleteModalAbierto(false);
      setElementoAEliminar(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Empleados</h1>
            <p className="text-sm text-muted-foreground">
              Gestión de empleados
            </p>
          </div>

          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => {
              setEmpleadoSeleccionado(null);
              setModoModal("crear");
              setModalAbierto(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo Empleado
          </Button>
        </div>

        <Card>
          {/* BUSCADOR */}
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="pl-9 w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>

                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {empleados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No se encontraron empleados
                    </TableCell>
                  </TableRow>
                ) : (
                  empleados.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="max-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-medium truncate">
                            {e.nombre} {e.apellido}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEmpleadoSeleccionado(e);
                                setModoModal("editar");
                                setModalAbierto(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setElementoAEliminar(e);
                                setDeleteModalAbierto(true);
                              }}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINACIÓN */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4">
            <p className="text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas} | Total: {totalEmpleados}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchEmpleados(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchEmpleados(pagina + 1)}
                disabled={pagina === totalPaginas || totalPaginas === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>

        {/* MODALES */}
        <EmpleadoModal
          key={`${modoModal}-${empleadoSeleccionado?.id || "nuevo"}`}
          abierto={modalAbierto}
          modo={modoModal}
          empleado={empleadoSeleccionado}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardarEmpleado}
        />

        <ConfirmDeleteModal
          abierto={deleteModalAbierto}
          onCerrar={() => setDeleteModalAbierto(false)}
          titulo={`Eliminar empleado`}
          mensaje="Esta acción no se puede deshacer"
          onConfirmar={handleEliminar}
        />
      </div>
    </DashboardLayout>
  );
}
