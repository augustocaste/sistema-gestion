import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

import { getCuotas } from "@/supabase/clientes";
import { PlanPagosModal } from "@/components/modals/PlanPagosModal";

export function Cuotas() {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("pendiente");

  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [pagina, setPagina] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPaginas = Math.ceil(total / pageSize);

  async function fetchCuotas(page = pagina) {
    setLoading(true);
    try {
      const { data, total } = await getCuotas({
        estado,
        search,
        page,
        pageSize,
      });
      console.log(data);

      setCuotas(data ?? []);
      setTotal(total ?? 0);
      setPagina(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCuotas(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, estado]);
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Información de Cuotas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona cuotas pendientes y vencidas
          </p>
        </div>

        <Card>
          {/* FILTROS */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border-b">
            {/* SEARCH */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="pl-9 w-full border rounded-md p-2 text-sm"
              />
            </div>

            {/* FILTRO ESTADO */}
            <div className="flex gap-2">
              <Button
                variant={estado === "pendiente" ? "default" : "outline"}
                onClick={() => setEstado("pendiente")}
              >
                Pendientes
              </Button>
              <Button
                variant={estado === "vencida" ? "default" : "outline"}
                onClick={() => setEstado("vencida")}
              >
                Vencidas
              </Button>
            </div>
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            {/* DESKTOP */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cuotas.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6} // ⚠️ poné la cantidad real de columnas
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <span className="text-lg font-semibold">
                            No hay cuotas
                          </span>
                          <span className="text-sm">
                            No se encontraron resultados
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {cuotas.map((cuota) => {
                    const cp = cuota.plan_cuotas?.compra_producto?.[0];
                    const cliente = cp?.compra?.cliente;

                    return (
                      <TableRow key={cuota.id}>
                        <TableCell className="font-medium">
                          {cliente.nombre} {cliente.apellido}
                        </TableCell>
                        <TableCell>{cp?.producto?.nombre}</TableCell>
                        <TableCell>{cuota.fecha_vencimiento}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              cuota.estado === "vencida"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {cuota.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPlanSeleccionado(cuota.plan_cuotas);
                              setModalAbierto(true);
                            }}
                          >
                            Pagar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-3 p-4">
              {cuotas.map((cuota) => {
                const cp = cuota.plan_cuotas?.compra_producto?.[0];
                const cliente = cp?.compra?.cliente;

                return (
                  <div
                    key={cuota.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div>
                      <p className="font-medium">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Producto: {cp?.producto?.nombre}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">{cuota.fecha_vencimiento}</span>

                      <Badge
                        variant={
                          cuota.estado === "vencida"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {cuota.estado}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setPlanSeleccionado(cuota.plan_cuotas);
                        setModalAbierto(true);
                      }}
                    >
                      Pagar
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Página {pagina} de {totalPaginas || 1} · Total: {total}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCuotas(pagina - 1)}
                  disabled={pagina === 1}
                >
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCuotas(pagina + 1)}
                  disabled={pagina === totalPaginas || totalPaginas === 0}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* MODAL PLAN */}
        <PlanPagosModal
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          plan={planSeleccionado}
        />
      </div>
    </DashboardLayout>
  );
}
