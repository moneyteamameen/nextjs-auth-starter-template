"use client";

import { useState } from 'react';
import Header from './Header';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="gridline-background h-screen overflow-y-auto">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
} 