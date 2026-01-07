import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, MoreVertical, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Clientes() {
  const clientes = [
    {
      id: "1",
      nombre: "María González",
      email: "maria@empresa.com",
      telefono: "+34 612 345 678",
      compras: 23,
      total: 12450.5,
      tipo: "Premium",
    },
    {
      id: "2",
      nombre: "Juan Martínez",
      email: "juan@startup.com",
      telefono: "+34 698 765 432",
      compras: 8,
      total: 3200.0,
      tipo: "Regular",
    },
    {
      id: "3",
      nombre: "Ana López",
      email: "ana@tech.com",
      telefono: "+34 645 123 987",
      compras: 45,
      total: 28900.75,
      tipo: "Premium",
    },
    {
      id: "4",
      nombre: "Carlos Ruiz",
      email: "carlos@email.com",
      telefono: "+34 678 234 567",
      compras: 3,
      total: 890.0,
      tipo: "Regular",
    },
    {
      id: "5",
      nombre: "Laura Sánchez",
      email: "laura@company.com",
      telefono: "+34 623 456 789",
      compras: 1,
      total: 125.0,
      tipo: "Nuevo",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Clientes</h1>
            <p className="text-sm text-muted-foreground">CRM</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nuevo Cliente
          </Button>
        </div>

        <Card>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Compras</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{c.nombre[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{c.nombre}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {c.compras}
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    ${c.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={c.tipo === "Premium" ? "default" : "secondary"}
                    >
                      {c.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
