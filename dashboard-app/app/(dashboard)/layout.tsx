import { ReactNode } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";

export default function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}
