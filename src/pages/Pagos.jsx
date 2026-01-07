import { useState } from "react"; // Importamos useState
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Plus,
  Search,
  MoreVertical,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Pagos() {
  // 1. Estado para el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const pagos = [
    {
      id: "1",
      referencia: "PAY-2024-001",
      cliente: "María González",
      fecha: "15 Ene 2024",
      monto: 1299.99,
      metodo: "Tarjeta",
      estado: "Completado",
    },
    {
      id: "2",
      referencia: "PAY-2024-002",
      cliente: "Juan Martínez",
      fecha: "14 Ene 2024",
      monto: 499.5,
      metodo: "Transferencia",
      estado: "Completado",
    },
    {
      id: "3",
      referencia: "PAY-2024-003",
      cliente: "Ana López",
      fecha: "14 Ene 2024",
      monto: 2450.0,
      metodo: "Tarjeta",
      estado: "Pendiente",
    },
    {
      id: "4",
      referencia: "PAY-2024-004",
      cliente: "Carlos Ruiz",
      fecha: "13 Ene 2024",
      monto: 890.0,
      metodo: "PayPal",
      estado: "Completado",
    },
    {
      id: "5",
      referencia: "PAY-2024-005",
      cliente: "Laura Sánchez",
      fecha: "13 Ene 2024",
      monto: 125.0,
      metodo: "Tarjeta",
      estado: "Rechazado",
    },
  ];

  // 2. Lógica de filtrado
  const pagosFiltrados = pagos.filter(
    (pago) =>
      pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.referencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona transacciones y movimientos financieros
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Pago
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Ingresos</p>
                <p className="text-2xl font-semibold">$48,392</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-semibold">$12,450</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-semibold">$3,200</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rechazados</p>
                <p className="text-2xl font-semibold">$890</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {/* 3. Conectamos el Input al estado */}
              <Input
                placeholder="Buscar pagos por referencia o cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagosFiltrados.length > 0 ? (
                pagosFiltrados.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell className="font-medium font-mono text-xs">
                      {pago.referencia}
                    </TableCell>
                    <TableCell>{pago.cliente}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {pago.fecha}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${pago.monto.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{pago.metodo}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pago.estado === "Completado"
                            ? "default"
                            : pago.estado === "Pendiente"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {pago.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Descargar recibo</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
