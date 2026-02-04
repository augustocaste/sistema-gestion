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
import { Plus, MoreVertical, Search, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { ProductModal } from "@/components/modals/ProductModal";

import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "@/supabase/productos";

export function Productos() {
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoModal, setModoModal] = useState("editar");

  const [deleteModalAbierto, setDeleteModalAbierto] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);

  async function fetchProductos(page = 1, filtro = search) {
    try {
      const { data, total } = await getProductos(filtro, page, pageSize);
      setProductos(data);
      setTotalProductos(total);
      setPagina(page);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProductos(1, search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const totalPaginas = Math.ceil(totalProductos / pageSize);

  function abrirModalCrear() {
    setProductoSeleccionado(null);
    setModoModal("crear");
    setModalAbierto(true);
  }

  function abrirModalEditar(producto) {
    setProductoSeleccionado(producto);
    setModoModal("editar");
    setModalAbierto(true);
  }

  async function handleGuardarProducto(formData) {
    try {
      if (modoModal === "editar") {
        await updateProducto(productoSeleccionado.id, formData);
      } else {
        await createProducto(formData);
      }
      setModalAbierto(false);
      fetchProductos(pagina, search);

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  function abrirModalEliminar(producto) {
    setElementoAEliminar(producto);
    setDeleteModalAbierto(true);
  }

  async function handleEliminar() {
    if (!elementoAEliminar) return;

    try {
      await deleteProducto(elementoAEliminar.id);
      fetchProductos(pagina, search);
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
      {/* CONTENEDOR CENTRADO */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Productos
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gestiona tu inventario
            </p>
          </div>

          <Button
            className="gap-2 w-full sm:w-auto"
            size="sm"
            onClick={abrirModalCrear}
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        <Card>
          {/* BUSCADOR */}
          <div className="p-3 sm:p-4 border-b">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="pl-9 w-full border rounded-md p-2 text-sm"
              />
            </div>
          </div>

          {/* TABLA RESPONSIVE */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell">Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Cantidad de cuotas
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {productos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-6"
                    >
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  productos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium max-w-[160px] sm:max-w-none overflow-hidden">
                        <span
                          className="block truncate break-words"
                          title={p.nombre}
                        >
                          {p.nombre}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        {p.precio_contado}
                      </TableCell>
                      <TableCell className="text-right">{p.stock}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge
                          variant={p.stock > 0 ? "default" : "destructive"}
                        >
                          {p.stock > 0 ? "Activo" : "Sin stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {p.cantidad_cuotas}
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
                              onClick={() => abrirModalEditar(p)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => abrirModalEliminar(p)}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas} | Total: {totalProductos}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProductos(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProductos(pagina + 1)}
                disabled={pagina === totalPaginas || totalPaginas === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>

        {/* MODALES */}
        <ProductModal
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          producto={productoSeleccionado}
          modo={modoModal}
          onGuardar={handleGuardarProducto}
        />

        <ConfirmDeleteModal
          abierto={deleteModalAbierto}
          onCerrar={() => setDeleteModalAbierto(false)}
          titulo={`Eliminar producto: ${elementoAEliminar?.nombre}`}
          mensaje="Esta acción no se puede deshacer. ¿Deseas continuar?"
          onConfirmar={handleEliminar}
        />
      </div>
    </DashboardLayout>
  );
}
