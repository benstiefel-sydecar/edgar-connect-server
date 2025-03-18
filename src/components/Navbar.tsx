
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEdgarApi } from '@/contexts/EdgarApiContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useEdgarApi();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Submissions', path: '/submissions' },
    { name: 'Filings', path: '/filings' },
    { name: 'API Docs', path: '/docs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">EDGAR Connect</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout} 
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
