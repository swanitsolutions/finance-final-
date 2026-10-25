import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, Code } from 'lucide-react';
import { ApiDocsModal } from '../modals/ApiDocsModal';

export const Navbar: React.FC = () => {
  const { isAuthenticated, role, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiDocsOpen, setApiDocsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="focus:outline-none">
            <Logo size="md" showTagline={true} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#172B4D] hover:text-[#5145CD] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setApiDocsOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-[#12365A] bg-[#12365A]/5 hover:bg-[#12365A]/10 rounded-xl transition-colors flex items-center gap-1.5"
              title="Inspect OpenAPI Swagger Contracts"
            >
              <Code className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Swagger API</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#5145CD] hover:bg-[#4036B5] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Go to {role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-[#DC5263] hover:bg-[#FFF0F1] rounded-xl transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#172B4D] hover:text-[#5145CD] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#5145CD] hover:bg-[#4036B5] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setApiDocsOpen(true)}
              className="p-2 text-xs text-[#5145CD] bg-[#5145CD]/10 rounded-lg"
              aria-label="Swagger API"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#172B4D] hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#DFE7F0] bg-white px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[#172B4D] hover:text-[#5145CD]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#5145CD] rounded-xl"
                  >
                    Open {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-center py-2 text-xs font-semibold text-[#DC5263]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-2 text-xs font-semibold text-[#172B4D] border border-[#DFE7F0] rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center py-2 text-xs font-semibold text-white bg-[#5145CD] rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <ApiDocsModal isOpen={apiDocsOpen} onClose={() => setApiDocsOpen(false)} />
    </>
  );
};
