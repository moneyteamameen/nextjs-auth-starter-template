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
              className="flex-1 bg-background-accent border border-border-light rounded-btn px-3 py-2 text-text-primary focus:outline-none focus:border-accent-tertiary"
              autoFocus
            />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 btn-icon"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="btn-icon"
          >
            <Search size={18} />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="btn-icon relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-accent-secondary text-text-light rounded-full w-4 h-4 text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/document-management/upload" className="btn-blue text-sm">
            Upload Documents
          </Link>
          <Link href="/projects/new" className="btn-secondary text-sm">
            New Project
          </Link>
        </div>
        
        <div className="border-l border-border-light h-8 mx-2 hidden md:block"></div>
        
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
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 w-64 mt-1 bg-background-primary border border-border-light rounded-card shadow-lg p-4 z-20">
          <div className="space-y-3">
            <Link 
              href="/document-management/upload" 
              className="block btn-blue w-full text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload Documents
            </Link>
            <Link 
              href="/projects/new" 
              className="block btn-secondary w-full text-center"
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