import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
