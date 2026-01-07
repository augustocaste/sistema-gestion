import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, FileText, Users, Package } from "lucide-react";

const actions = [
  { title: "Nuevo Producto", icon: Package },
  { title: "Nuevo Cliente", icon: Users },
  { title: "Registrar Pago", icon: FileText },
  { title: "Nuevo Trabajador", icon: Plus },
];

export function QuickActions() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto flex-col gap-2 py-4 border-border hover:bg-accent bg-transparent"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
