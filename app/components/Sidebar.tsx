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
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
    { name: 'Document Management', path: '/document-management', icon: <FileStack size={18} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart2 size={18} /> },
  ];
  
  const extrasNavItems = [
    { name: 'Document Analysis', path: '/document-analysis', icon: <FileText size={18} /> },
    { name: 'Construction Analysis', path: '/construction-analysis', icon: <HardHat size={18} /> },
    { name: 'Drawing Analysis', path: '/drawing-analysis', icon: <Layers size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];
  
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} bg-background-dark shadow-md`}>
      <div className="py-5 px-0 border-b border-border-dark flex items-center justify-between bg-white relative overflow-hidden">
        {/* Gridline background for the logo section */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `
                 linear-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 0, 0, 0.3) 1px, transparent 1px)
               `,
               backgroundSize: '16px 16px, 16px 16px',
               zIndex: 0
             }}>
        </div>
        
        <div className={`${collapsed ? 'hidden' : 'block'} flex-1 px-4`}>
          <span className="text-accent-primary text-4xl font-bold tracking-wide block relative z-10" 
                style={{ fontFamily: '"Space Grotesk", "Space Grotesk Placeholder", sans-serif' }}>
            INTENTIO
          </span>
        </div>
        
        <button
          onClick={toggleSidebar}
          className="btn-icon bg-transparent text-accent-primary hover:text-accent-tertiary h-6 w-6 flex items-center justify-center mr-4 relative z-10"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="mt-5 flex flex-col justify-between h-[calc(100%-70px)]">
        <ul className="space-y-0.5 px-3">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center space-x-3 py-2.5 px-3 rounded-btn transition-all ${
                  isActive(item.path) 
                    ? 'bg-accent-tertiary text-text-light' 
                    : 'hover:bg-background-dark/50 text-text-light hover:text-accent-tertiary'
                }`}
              >
                <span className={isActive(item.path) ? 'text-text-light' : 'opacity-85'}>{item.icon}</span>
                {!collapsed && <span className={`text-sm ${isActive(item.path) ? '' : 'font-light'}`}>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto px-3 mb-5">
          <div 
            className={`flex items-center py-2.5 px-3 rounded-btn cursor-pointer text-text-light hover:text-accent-tertiary hover:bg-background-dark/50 ${collapsed ? 'justify-center' : 'justify-between'}`}
            onClick={toggleExtras}
          >
            <div className="flex items-center space-x-3">
              <Package size={18} className="opacity-85" />
              {!collapsed && <span className="text-sm font-light">Extras</span>}
            </div>
            {!collapsed && (
              <ChevronDown size={14} className={`transition-transform ${extrasExpanded ? 'rotate-180' : ''}`} />
            )}
          </div>
          
          {extrasExpanded && (
            <ul className="mt-1 space-y-0.5 pl-2">
              {extrasNavItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center space-x-3 py-2 px-3 rounded-btn transition-all ${
                      isActive(item.path) 
                        ? 'bg-accent-tertiary text-text-light' 
                        : 'hover:bg-background-dark/50 text-text-light hover:text-accent-tertiary'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'text-text-light' : 'opacity-85'}>{item.icon}</span>
                    {!collapsed && <span className={`text-sm ${isActive(item.path) ? '' : 'font-light'}`}>{item.name}</span>}
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