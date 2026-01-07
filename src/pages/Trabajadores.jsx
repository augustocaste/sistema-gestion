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
import { Plus, Search, MoreVertical, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Trabajadores() {
  const trabajadores = [
    {
      id: "1",
      nombre: "Pedro Fernández",
      puesto: "Gerente de Ventas",
      departamento: "Ventas",
      email: "pedro@empresa.com",
      telefono: "+34 612 345 678",
      estado: "Activo",
    },
    {
      id: "2",
      nombre: "Sofía Ramírez",
      puesto: "Desarrolladora Senior",
      departamento: "Tecnología",
      email: "sofia@empresa.com",
      telefono: "+34 698 765 432",
      estado: "Activo",
    },
    {
      id: "3",
      nombre: "Miguel Torres",
      puesto: "Diseñador UX/UI",
      departamento: "Diseño",
      email: "miguel@empresa.com",
      telefono: "+34 645 123 987",
      estado: "Activo",
    },
    {
      id: "4",
      nombre: "Elena Castro",
      puesto: "Contadora",
      departamento: "Finanzas",
      email: "elena@empresa.com",
      telefono: "+34 678 234 567",
      estado: "Activo",
    },
    {
      id: "5",
      nombre: "David Morales",
      puesto: "Analista de Marketing",
      departamento: "Marketing",
      email: "david@empresa.com",
      telefono: "+34 623 456 789",
      estado: "Vacaciones",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Trabajadores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tu equipo y recursos humanos
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nuevo Trabajador
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Empleados</p>
                <p className="text-2xl font-semibold">48</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-semibold">42</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departamentos</p>
                <p className="text-2xl font-semibold">8</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar trabajadores..." className="pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trabajador</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trabajadores.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {t.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{t.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {t.puesto}
                  </TableCell>
                  <TableCell className="text-sm">{t.departamento}</TableCell>
                  <TableCell>
                    <div className="text-sm">{t.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.telefono}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.estado === "Activo" ? "default" : "secondary"}
                    >
                      {t.estado}
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
                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Dar de baja
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
