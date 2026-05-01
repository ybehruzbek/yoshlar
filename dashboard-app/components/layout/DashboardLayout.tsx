import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout({ children, title }: { children: ReactNode, title: string }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Topbar title={title} />
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}
