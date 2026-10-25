import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2740] text-white pt-16 pb-12 border-t border-[#153755]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo variant="light" size="md" showTagline={true} />
            <p className="text-xs text-[#D9E0E5] leading-relaxed">
              LoanEase empowers individuals and enterprises with transparent loan management,
              accurate reducing-balance EMI computations, and effortless repayment tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D9E0E5]/80">
              <ShieldCheck className="w-4 h-4 text-[#218568]" />
              <span>256-Bit SSL Encrypted Financial Portal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#D9E0E5]">
              <li>
                <a href="/#home" className="hover:text-[#E8EA68] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#E8EA68] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-[#E8EA68] transition-colors">
                  Financial Services
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#E8EA68] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#calculator" className="hover:text-[#E8EA68] transition-colors">
                  EMI Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portals & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#D9E0E5]">
              <li>
                <Link to="/dashboard" className="hover:text-[#E8EA68] transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#E8EA68] transition-colors">
                  Administrator Portal
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#E8EA68] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#E8EA68] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h4>
            <div className="space-y-2.5 text-xs text-[#D9E0E5]">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E65327] shrink-0 mt-0.5" />
                <span>support@loanease.internal</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E65327] shrink-0 mt-0.5" />
                <span>Toll-Free: 1800-LOANEASE (Demonstration)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E65327] shrink-0 mt-0.5" />
                <span>Financial District, Tech Hub, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9E0E5]/60 gap-4">
          <p>© {currentYear} LoanEase Technologies Inc. All rights reserved.</p>
          <p className="text-[11px] text-[#D9E0E5]/50">
            Simulated financial management environment with verified reducing-balance EMI calculations.
          </p>
        </div>
      </div>
    </footer>
  );
};
