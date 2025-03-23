import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from './context/auth-context';
import Sidebar from './components/Sidebar';
import { geistSans, geistMono } from './fonts';

export const metadata: Metadata = {
  title: 'MODUS | Construction Solutions',
  description: 'Construction project management and document analysis platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      appearance={{
        variables: { colorPrimary: '#0A1E3A' }
      }}
      // Adding 60 seconds of clock skew tolerance
      clockSkewInMs={60000}
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="background">
          <AuthProvider>
            <div className="sidebar-layout">
              <Sidebar />
              <main className="main-content">{children}</main>
            </div>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

// Inspired by the Modus website design
export function NavigationBar() {
  return (
    <header className="bg-background-primary text-accent-primary py-4 border-b border-border-light px-6 md:px-12">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl">
            <span className="bg-accent-primary text-text-light px-3 py-1">MODUS</span>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-10">
          <a href="/about" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            ABOUT
          </a>
          <a href="/projects" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            PROJECTS
          </a>
          <a href="/services" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            SERVICES
          </a>
          <a href="/news" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            NEWS
          </a>
          <a href="/resources" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            RESOURCES
          </a>
          <a href="/contact" className="text-accent-primary font-medium hover:text-accent-secondary transition-colors">
            CONTACT US
          </a>
        </nav>
        
        {/* Mobile menu button - would be implemented with actual functionality */}
        <button className="md:hidden text-accent-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
