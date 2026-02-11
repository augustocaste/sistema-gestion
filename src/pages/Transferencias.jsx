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
import { getResumenPagos } from "@/supabase/pagos";

export function Transferencias() {
  const [periodo, setPeriodo] = useState("dia");
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchResumen() {
    setLoading(true);
    const data = await getResumenPagos(periodo);
    setResumen(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchResumen();
  }, [periodo]);

  const totalTransferencias =
    resumen?.transferencias.reduce((a, b) => a + b.total, 0) ?? 0;

  const totalCantidadTransferencias =
    resumen?.transferencias.reduce((a, b) => a + b.cantidad, 0) ?? 0;

  const rings = [
    "ring-2 ring-blue-500/40", // Azul
    "ring-2 ring-red-500/40", // Rojo
    "ring-2 ring-yellow-400/40", // Amarillo
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ingresos</h1>
          <p className="text-sm text-muted-foreground">
            Resumen de ingresos en efectivo y transferencias
          </p>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2">
          {["dia", "semana", "mes"].map((p) => (
            <Button
              key={p}
              variant={periodo === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriodo(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className={`p-4 border-border ${rings[0]}`}>
            <p className="text-sm text-muted-foreground">Total ingresos</p>
            <p className="text-2xl font-semibold">
              ${resumen?.totalGeneral.toLocaleString() ?? "-"}
            </p>
          </Card>

          <Card className={`p-4 border-border ${rings[1]}`}>
            <p className="text-sm text-muted-foreground">
              Ingresos en efectivo
            </p>
            <p className="text-2xl font-semibold">
              ${resumen?.efectivo.total.toLocaleString() ?? "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {resumen?.efectivo.cantidad ?? 0} pagos
            </p>
          </Card>

          <Card className={`p-4 border-border ${rings[2]}`}>
            <p className="text-sm text-muted-foreground">
              Ingresos por transferencia
            </p>
            <p className="text-2xl font-semibold">
              ${totalTransferencias.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalCantidadTransferencias} transferencias
            </p>
          </Card>
        </div>

        {/* TABLA DE TRANSFERENCIAS POR ALIAS */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm">Transferencias por alias</h2>
          </div>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alias</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Participación</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-6"
                    >
                      Cargando datos...
                    </TableCell>
                  </TableRow>
                ) : resumen?.transferencias.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-6"
                    >
                      No hubo transferencias en este período
                    </TableCell>
                  </TableRow>
                ) : (
                  resumen.transferencias.map((item) => {
                    const porcentaje =
                      totalTransferencias > 0
                        ? Math.round((item.total / totalTransferencias) * 100)
                        : 0;

                    return (
                      <TableRow key={item.destino}>
                        <TableCell className="font-medium">
                          {item.destino}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.cantidad}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{porcentaje}%</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
