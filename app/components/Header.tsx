"use client";

import { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="top-header">
      <div className="flex-1 flex items-center">
        {isSearchOpen ? (
          <div className="flex-1 flex items-center">
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 bg-background-accent border border-border-light rounded-btn px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-tertiary"
              autoFocus
            />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="ml-3 btn-icon"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="btn-icon"
          >
            <Search size={16} />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-5">
        <div className="relative">
          <button className="btn-icon relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-accent-secondary text-text-light rounded-full w-3.5 h-3.5 text-[10px] flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/document-management/upload" className="btn-blue text-xs font-medium px-4 py-2">
            Upload Documents
          </Link>
          <Link href="/projects/new" className="btn-secondary text-xs font-medium px-4 py-2">
            New Project
          </Link>
        </div>
        
        <div className="border-l border-border-light h-6 mx-2 hidden md:block"></div>
        
        <div className="bg-background-accent rounded-full p-0.5 shadow-sm">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "size-8",
              },
            }}
          />
        </div>
        
        <button 
          className="md:hidden btn-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 w-64 mt-1 bg-background-primary border border-border-light rounded-card shadow-lg p-5 z-20">
          <div className="space-y-4">
            <Link 
              href="/document-management/upload" 
              className="block btn-blue w-full text-center text-xs font-medium py-2.5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload Documents
            </Link>
            <Link 
              href="/projects/new" 
              className="block btn-secondary w-full text-center text-xs font-medium py-2.5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 