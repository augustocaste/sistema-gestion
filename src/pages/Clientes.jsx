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
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { ClientModal } from "@/components/modals/ClientModal";
import { ComprasClienteModal } from "@/components/modals/ComprasClienteModal";

import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "@/supabase/clientes";

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modoModal, setModoModal] = useState("editar");

  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);

  const [comprasModalAbierto, setComprasModalAbierto] = useState(false);
  const [clienteCompras, setClienteCompras] = useState(null);

  async function fetchClientes(page = 1, filtro = search) {
    try {
      const { data, total } = await getClientes(filtro, page, pageSize);
      setClientes(data);
      setTotalClientes(total);
      setPagina(page);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchClientes(1, search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const totalPaginas = Math.ceil(totalClientes / pageSize);

  function abrirModalCrear() {
    setClienteSeleccionado(null);
    setModoModal("crear");
    setModalAbierto(true);
  }

  function abrirModalEditar(cliente) {
    setClienteSeleccionado(cliente);
    setModoModal("editar");
    setModalAbierto(true);
  }

  async function handleGuardarProducto(formData) {
    try {
      if (modoModal === "editar") {
        await updateCliente(clienteSeleccionado.id, formData);
      } else {
        await createCliente(formData);
      }
      setModalAbierto(false);
      fetchClientes(pagina, search);

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  function abrirModalEliminar(cliente) {
    setElementoAEliminar(cliente);
    setDeleteModalAbierto(true);
  }

  async function handleEliminar() {
    if (!elementoAEliminar) return;

    try {
      await deleteCliente(elementoAEliminar.id);
      fetchClientes(pagina, search);
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
            <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
            <p className="text-sm text-muted-foreground">Gestión de clientes</p>
          </div>

          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => {
              setClienteSeleccionado(null);
              setModoModal("crear");
              setModalAbierto(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo Cliente
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
                placeholder="Buscar por nombre o DNI..."
                className="pl-9 w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">DNI</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Teléfono
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Dirección
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="max-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-medium truncate">
                            {c.nombre}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {c.apellido}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">{c.dni}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {c.telefono}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {c.direccion || "-"}
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
                                setClienteCompras(c);
                                setComprasModalAbierto(true);
                              }}
                            >
                              Ver Compras
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setClienteSeleccionado(c);
                                setModoModal("editar");
                                setModalAbierto(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setElementoAEliminar(c);
                                setDeleteModalAbierto(true);
                              }}
                            >
                              Eliminar
                            </DropdownMenuItem> */}
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
              Página {pagina} de {totalPaginas} | Total: {totalClientes}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchClientes(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchClientes(pagina + 1)}
                disabled={pagina === totalPaginas || totalPaginas === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>

        {/* MODALES */}
        <ClientModal
          abierto={modalAbierto}
          modo={modoModal}
          cliente={clienteSeleccionado}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardarProducto}
        />

        <ConfirmDeleteModal
          abierto={deleteModalAbierto}
          onCerrar={() => setDeleteModalAbierto(false)}
          titulo={`Eliminar cliente`}
          mensaje="Esta acción no se puede deshacer"
          onConfirmar={handleEliminar}
        />

        <ComprasClienteModal
          abierto={comprasModalAbierto}
          onCerrar={() => setComprasModalAbierto(false)}
          cliente={clienteCompras}
        />
      </div>
    </DashboardLayout>
  );
}
