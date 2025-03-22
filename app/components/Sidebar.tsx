"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  BarChart2, 
  FileStack, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  HardHat,
  ChevronDown,
  Package,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [extrasExpanded, setExtrasExpanded] = useState(false);
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleExtras = () => {
    setExtrasExpanded(!extrasExpanded);
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Document Management', path: '/document-management', icon: <FileStack size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
  ];
  
  const extrasNavItems = [
    { name: 'Document Analysis', path: '/document-analysis', icon: <FileText size={20} /> },
    { name: 'Construction Analysis', path: '/construction-analysis', icon: <HardHat size={20} /> },
    { name: 'Drawing Analysis', path: '/drawing-analysis', icon: <Layers size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} bg-background-dark shadow-lg`}>
      <div className="py-4 px-4 border-b border-border-dark flex items-center justify-between">
        <div className={`${collapsed ? 'hidden' : 'flex'} items-center space-x-2`}>
          <div className="bg-accent-secondary text-text-light px-2 py-1 font-bold rounded-sm">
            MODUS
          </div>
          {!collapsed && <span className="text-text-light font-medium">Construction</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className="btn-icon bg-background-dark text-text-light hover:text-accent-secondary"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="mt-6 flex flex-col justify-between h-[calc(100%-80px)]">
        <ul className="space-y-1 px-3">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-btn transition-all ${
                  isActive(item.path) 
                    ? 'bg-accent-secondary text-text-light font-medium' 
                    : 'hover:bg-background-dark/80 text-text-light hover:text-accent-secondary'
                }`}
              >
                <span className={isActive(item.path) ? 'text-text-light' : ''}>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto px-3">
          <div 
            className={`flex items-center p-3 rounded-btn cursor-pointer text-text-light hover:text-accent-secondary hover:bg-background-dark/80 ${collapsed ? 'justify-center' : 'justify-between'}`}
            onClick={toggleExtras}
          >
            <div className="flex items-center space-x-3">
              <Package size={20} />
              {!collapsed && <span>Extras</span>}
            </div>
            {!collapsed && (
              <ChevronDown size={16} className={`transition-transform ${extrasExpanded ? 'rotate-180' : ''}`} />
            )}
          </div>
          
          {extrasExpanded && (
            <ul className="mt-1 space-y-1 pl-3">
              {extrasNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-btn transition-all ${
                      isActive(item.path) 
                        ? 'bg-accent-secondary text-text-light font-medium' 
                        : 'hover:bg-background-dark/80 text-text-light hover:text-accent-secondary'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'text-text-light' : ''}>{item.icon}</span>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
} 