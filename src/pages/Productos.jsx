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
import { Plus, Search, MoreVertical, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Productos() {
  const productos = [
    {
      id: "1",
      nombre: "Laptop Dell XPS 15",
      sku: "LPT-001",
      categoria: "Electrónica",
      precio: 1299.99,
      stock: 15,
      estado: "Activo",
    },
    {
      id: "2",
      nombre: "Mouse Logitech MX Master",
      sku: "MSE-002",
      categoria: "Accesorios",
      precio: 99.99,
      stock: 45,
      estado: "Activo",
    },
    {
      id: "3",
      nombre: "Teclado Mecánico",
      sku: "KBD-003",
      categoria: "Accesorios",
      precio: 149.99,
      stock: 8,
      estado: "Activo",
    },
    {
      id: "4",
      nombre: 'Monitor LG 27"',
      sku: "MON-004",
      categoria: "Electrónica",
      precio: 349.99,
      stock: 3,
      estado: "Bajo stock",
    },
    {
      id: "5",
      nombre: "Webcam HD",
      sku: "WBC-005",
      categoria: "Accesorios",
      precio: 79.99,
      stock: 0,
      estado: "Agotado",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tu inventario
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nuevo Producto
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">247</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Stock</p>
                <p className="text-2xl font-semibold">198</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Package className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agotados</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por SKU o nombre..."
                className="pl-9"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.sku}
                  </TableCell>
                  <TableCell className="text-sm">{p.categoria}</TableCell>
                  <TableCell className="text-right text-sm">
                    ${p.precio}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {p.stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.estado === "Activo"
                          ? "default"
                          : p.estado === "Agotado"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {p.estado}
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
