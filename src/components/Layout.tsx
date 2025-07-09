import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`wrapper${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <Header onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="main-panel">{children}</div>
    </div>
  );
}
