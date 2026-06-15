import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

export default function Navbar({ onScrollTo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real-time site visitor counter
  const [visitorCount, setVisitorCount] = useState(12);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next < 8 ? 8 : next > 18 ? 18 : next;
      });
    }, 10000); // Between 8-15s (10s is perfect)
    return () => clearInterval(interval);
  }, []);

  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("services")) {
      setActiveId("services");
    } else if (path.includes("process")) {
      setActiveId("process");
    } else if (path.includes("calculator")) {
      setActiveId("calculator");
    } else if (path.includes("results")) {
      setActiveId("results");
    } else if (path.includes("contact")) {
      setActiveId("contact");
    } else {
      setActiveId("");
    }
  }, []);

  const navLinks = [
    { name: "Services", id: "services" },
    { name: "Process", id: "process" },
    { name: "Calculator", id: "calculator" },
    { name: "Results", id: "results" },
    { name: "Contact", id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    window.location.href = `/${id}.html`;
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? "bg-black/90 border-b border-[rgba(201,168,76,0.22)] py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Left */}
        <div 
          onClick={() => window.location.href = "/index.html"}
          className="flex items-center cursor-pointer group"
        >
          <img 
            src="https://www.image2url.com/r2/default/images/1780947779301-df370fd3-6951-4b17-8985-5e37b1b0e441.png"
            alt="NovuWebs Logo"
            className="h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-screen"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <div
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-2 text-[10px] font-sans font-semibold tracking-widest cursor-pointer transition-colors uppercase ${
                  isActive ? "text-[#C9A84C]" : "text-[#fg2] hover:text-[#fg]"
                }`}
              >
                {link.name}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A84C]"
                  initial={{ scaleX: isActive ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Visitor Counter & CTA Right (Desktop & iPad) */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Pulsing Visitor Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 select-none text-[11px] font-sans text-stone-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DBA6F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DBA6F]"></span>
            </span>
            <span className="font-mono text-[#F0C060] font-bold">{visitorCount}</span> businesses viewing this
          </div>

          <button
            id="nav-apply-btn"
            onClick={() => handleLinkClick("contact")}
            className="px-5 py-2 rounded font-sans text-[11px] uppercase tracking-wider font-semibold text-black bg-[#C9A84C] hover:bg-[#F0C060] active:scale-95 transition-all outline-none"
          >
            Apply to Work With Us →
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Small counter on mobile navbar for micro conversions */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-stone-300 font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3DBA6F] animate-pulse"></span>
            <span className="font-mono text-[#F0C060] font-semibold">{visitorCount}</span> online
          </div>

          <button
            id="mobile-menu-toggle"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded text-stone-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Drawer Menu (Mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-[rgba(201,168,76,0.22)] py-6 px-6 md:hidden flex flex-col gap-6 shadow-2xl z-40"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="py-1 text-xs tracking-widest font-sans font-semibold text-stone-300 hover:text-white uppercase cursor-pointer"
                >
                  {link.name}
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-400 font-sans">
                <span className="h-2 w-2 rounded-full bg-[#3DBA6F] animate-pulse"></span>
                <span className="font-mono text-[#F0C060] font-bold">{visitorCount}</span> Home Service, Med & Legal businesses viewing this page
              </div>
              
              <button
                id="drawer-apply-btn"
                onClick={() => handleLinkClick("contact")}
                className="w-full py-3 rounded text-center text-xs font-semibold uppercase tracking-wider text-black bg-[#C9A84C]"
              >
                Apply to Work With Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
