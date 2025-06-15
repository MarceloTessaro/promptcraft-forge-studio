
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { session, signOut } = useAuth();

  const navItems = [
    { name: 'Builder', path: '/builder' },
    { name: 'Templates', path: '/templates' },
    { name: 'Optimizer', path: '/optimizer' },
    { name: 'Learn', path: '/learn' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Enhanced Mobile-First Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10 backdrop-blur-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Responsive sizing */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center glow group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xs sm:text-sm">PC</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text group-hover:animate-gradient-shift">
                PromptCraft
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white glow shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {session ? (
                <>
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 focus-ring hidden md:flex">
                    <User className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 focus-ring hidden md:flex">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button onClick={signOut} variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 focus-ring hidden md:flex">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white text-xs sm:text-sm">
                    <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white/80 hover:text-white hover:bg-white/10 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-white/10 animate-fadeIn">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white glow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile User Actions */}
                <div className="pt-4 mt-4 border-t border-white/10">
                  {session ? (
                    <div className="flex items-center justify-around">
                      <Button variant="ghost" size="sm" className="text-white/80 hover:text-white flex-1 mx-1">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/80 hover:text-white flex-1 mx-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button onClick={() => { signOut(); setMobileMenuOpen(false); }} variant="ghost" size="sm" className="text-white/80 hover:text-white flex-1 mx-1">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                     <Link to="/auth" className="block">
                      <Button onClick={() => setMobileMenuOpen(false)} variant="outline" className="w-full flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white">
                        <LogIn className="w-4 h-4" />
                        Login / Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Enhanced Mobile-Responsive Footer */}
      <footer className="glass-subtle border-t border-white/10 mt-10 sm:mt-20">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PC</span>
                </div>
                <h3 className="text-white font-bold text-lg gradient-text">PromptCraft</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                The ultimate AI prompt building platform for professionals and creators.
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link to="/templates" className="hover:text-white hover:gradient-text transition-all duration-200">Templates</Link></li>
                <li><Link to="/optimizer" className="hover:text-white hover:gradient-text transition-all duration-200">Optimizer</Link></li>
                <li><Link to="/learn" className="hover:text-white hover:gradient-text transition-all duration-200">Learning</Link></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">About</a></li>
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">Contact</a></li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">API</a></li>
                <li><a href="#" className="hover:text-white hover:gradient-text transition-all duration-200">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 text-center text-xs sm:text-sm text-white/60">
            <p>© 2024 PromptCraft. All rights reserved. Built with ❤️ for AI professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
