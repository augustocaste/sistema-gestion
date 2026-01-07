import { Card, CardContent } from "../components/ui/card";
import { Package, Users, UserCircle, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Productos",
    value: "2,345",
    change: "+12.5%",
    icon: Package,
  },
  {
    title: "Clientes Activos",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
  },
  {
    title: "Trabajadores",
    value: "56",
    change: "+2",
    icon: UserCircle,
  },
  {
    title: "Ventas del Mes",
    value: "$45,231",
    change: "+23.1%",
    icon: TrendingUp,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.change} vs mes anterior
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
