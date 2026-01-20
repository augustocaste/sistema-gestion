import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
