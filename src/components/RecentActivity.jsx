import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

const activities = [
  {
    id: 1,
    user: "María García",
    action: "agregó un nuevo producto",
    time: "Hace 2 horas",
    initials: "MG",
  },
  {
    id: 2,
    user: "Juan Pérez",
    action: "registró un pago",
    time: "Hace 4 horas",
    initials: "JP",
  },
  {
    id: 3,
    user: "Ana Martínez",
    action: "actualizó información de cliente",
    time: "Hace 5 horas",
    initials: "AM",
  },
  {
    id: 4,
    user: "Carlos López",
    action: "agregó un nuevo trabajador",
    time: "Hace 1 día",
    initials: "CL",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
