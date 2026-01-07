import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { RecentActivity } from "@/components/RecentActivity";
import { QuickActions } from "@/components/QuickActions";

export function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen general de tu negocio
          </p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
