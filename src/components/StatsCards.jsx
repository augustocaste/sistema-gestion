import { Card, CardContent } from "../components/ui/card";
import { Package, Users, UserCircle, TrendingUp } from "lucide-react";
import {
  getCantidadProductos,
  getVentasDelMes,
  getCantidadClientes,
  getCantidadEmpleados,
} from "@/supabase/estadisticas";

const stats = [
  {
    title: "Total Productos",
    value: await getCantidadProductos(),
    icon: Package,
  },
  {
    title: "Clientes Activos",
    value: await getCantidadClientes(),
    icon: Users,
  },
  {
    title: "Trabajadores",
    value: await getCantidadEmpleados(),
    icon: UserCircle,
  },
  {
    title: "Ventas del Mes",
    value: await getVentasDelMes(),
    icon: TrendingUp,
  },
];

const neonRings = [
  "ring-2 ring-blue-500/40", // Azul
  "ring-2 ring-red-500/40", // Rojo
  "ring-2 ring-yellow-400/40", // Amarillo
  "ring-2 ring-green-500/40", // Verde
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`
            border-border
            ring-1 ring-border
            transition-all duration-300
            ${neonRings[index]}
          `}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>

              <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
