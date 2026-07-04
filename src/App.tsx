import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Bot,
  Search,
  Sparkles,
  Phone,
  Calendar,
  Building2,
  Users,
  Shield,
  Clock,
  Briefcase,
  AlertCircle,
  FileCheck2,
  Share2,
  Instagram,
  Linkedin,
  Twitter,
  ChevronRight,
  Stethoscope,
  Scale
} from "lucide-react";

import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import RevenueCalculator from "./components/RevenueCalculator";

// Typewriter word queue
const TYPEWRITER_PHRASES = [
  "Best Salesperson.",
  "Top Closer.",
  "Lead Machine.",
  "24/7 Engine."
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Countdown timer for CTA slots
  const [slotsRemaining, setSlotsRemaining] = useState(3);

  // Custom Cursor Spring Positions
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);

  // Expanded services state
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // Core diagram pulse step state
  const [activeNode, setActiveNode] = useState(0);

  // Booking Form Submission feedback state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    websiteUrl: "",
    niche: "Home Services",
    email: "",
    phone: ""
  });

  // Track scroll position for parallax and sticky states
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Track custom cursor movement
  useEffect(() => {
    const handleMouseCoords = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseCoords);
    return () => window.removeEventListener("mousemove", handleMouseCoords);
  }, []);

  // Typewriter loop logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = TYPEWRITER_PHRASES[currentPhraseIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypewriterText((prev) => prev.slice(0, -1));
      }, 50); // Speed of backspacing
    } else {
      timer = setTimeout(() => {
        setTypewriterText((prev) => currentPhrase.slice(0, prev.length + 1));
      }, 120); // Speed of character typing
    }

    // Handle full phrase typed
    if (!isDeleting && typewriterText === currentPhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500); // 2.5s pause as requested
    }

    // Handle full word deleted
    if (isDeleting && typewriterText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, currentPhraseIndex]);

  // Section 9 Countdown Timer Logic
  useEffect(() => {
    const timer45s = setTimeout(() => {
      setSlotsRemaining(2);
    }, 45000);

    const timer135s = setTimeout(() => {
      setSlotsRemaining(1);
    }, 135000);

    return () => {
      clearTimeout(timer45s);
      clearTimeout(timer135s);
    };
  }, []);

  // Sequential Flow Diagram Pulse state-machine logic
  useEffect(() => {
    const flowInterval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 7);
    }, 2800);
    return () => clearInterval(flowInterval);
  }, []);

  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("services")) {
      setCurrentPage("services");
    } else if (path.includes("process")) {
      setCurrentPage("process");
    } else if (path.includes("calculator")) {
      setCurrentPage("calculator");
    } else if (path.includes("results")) {
      setCurrentPage("results");
    } else if (path.includes("contact")) {
      setCurrentPage("contact");
    } else {
      setCurrentPage("home");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleScrollToSection = (id: string) => {
    window.location.href = `/${id}.html`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email || !formData.phone) {
      alert("Please fill out all required fields.");
      return;
    }
    setFormSubmitted(true);
  };

  const services = [
    {
      id: 1,
      title: "Conversion-Focused Websites",
      description: "Mobile-first, search-optimized engines architected specifically to maximize trust and capture visitor attention in under 3 seconds.",
      features: [
        "Mobile-first lightning-fast design",
        "Clear calls-to-action on every page",
        "Built-in trust signals and social proof",
        "Local SEO-ready structure"
      ],
      details: "Our proprietary designs achieve 3.4× the industry conversation standard. Includes real-time schema markup, content-delivery CDN setup, high-contrast readability metrics, and automatic visual assets optimized for Home Services, Clinic patients, or Legal clients.",
      icon: <Search className="text-[#C9A84C]" size={20} />
    },
    {
      id: 2,
      title: "AI Booking Systems",
      description: "24/7 automated appointment capture, qualification, and calendar locking with zero human friction or lag.",
      features: [
        "AI chat that qualifies and books leads",
        "Calendar sync and reminders",
        "SMS and email confirmations",
        "No-show reduction sequences"
      ],
      details: "Directly synchronized with Google, Outlook, or GoHighLevel. The AI qualifies the client budget/location, captures verified phone numbers, assigns dispatcher slots, and sends automated SMS confirmation sequences to prevent zero-risk scheduling drop-offs.",
      icon: <Bot className="text-[#C9A84C]" size={20} />
    },
    {
      id: 3,
      title: "Lead Capture Automation",
      description: "Multi-parameter lead tracking and persistence sequences to nurture and recapture unconverted prospects safely.",
      features: [
        "Multi-step email and SMS sequences",
        "Lead scoring and prioritisation",
        "CRM integration and pipeline view",
        "Re-engagement campaigns"
      ],
      details: "Stops leads from going cold. When a visitor drops off a form, our automated triggers send highly contextual follow-ups within 120 seconds, persisting 5–7 times to increase initial appointment book rates by up to 220%.",
      icon: <FileCheck2 className="text-[#C9A84C]" size={20} />
    },
    {
      id: 4,
      title: "Business Infrastructure",
      description: "Unified growth analytics, reviews automation, and visual reputation trackers centralized in a secure dashboard.",
      features: [
        "Google review automation",
        "Live performance dashboard",
        "Monthly growth reports",
        "Ongoing optimisation support"
      ],
      details: "Harnesses social proof. Triggers post-job messages requesting 5-star Google updates, manages customer reviews, and relays continuous conversion audits. You check a clean live metric hub to inspect your actual pipeline growth.",
      icon: <Shield className="text-[#C9A84C]" size={20} />
    }
  ];

  const problemCards = [
    {
      num: "01",
      title: "Your website looks dated",
      description: "Visitors judge safety and professionalism in 0.05 seconds. A poor first impression sends high-value clients straight to competitor websites with clean modern pipelines."
    },
    {
      num: "02",
      title: "You're missing leads after hours",
      description: "Over 60% of service inquiries happen outside business hours. Without instant AI response booking, those premium leads go completely unanswered or call someone else."
    },
    {
      num: "03",
      title: "No system to follow up",
      description: "Most agencies follow up once. Our rigorous automated sequences persist 5–7 times via combined SMS and Email to convert leads you would have otherwise forgotten."
    },
    {
      num: "04",
      title: "Your booking process is friction",
      description: "Every extra phone tag, static form, or wait time kills customer conversion. A modern autonomous booking mechanism works 24/7 with zero lag or friction."
    },
    {
      num: "05",
      title: "You're invisible on Google",
      description: "Without conversion-optimized schema tags and robust local SEO architecture, you are actively handing local contract search volume over to your main local competitors."
    },
    {
      num: "06",
      title: "You're paying for traffic that leaks",
      description: "Buying paid local ads without a professional landing page is like pouring expensive water straight into a highly leaky bucket. We fix the conversion leaks first."
    }
  ];

  const flowSteps = [
    { name: "Visitor", desc: "Hits Landing Card" },
    { name: "Web Speed", desc: "Instantly Hooked" },
    { name: "AI Chat", desc: "Qualified & Framed" },
    { name: "Lead Captured", desc: "Verified Contact" },
    { name: "Auto Follow-Up", desc: "SMS Sequence" },
    { name: "Booking Done", desc: "Calendar Locked" },
    { name: "5★ Review", desc: "Automated Loop" }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-bg text-fg select-none overflow-x-hidden pb-0">
      
      {/* Custom Spring Follow Cursor (Desk only, desktop detection is safe via pointer media query) */}
      <div 
        className="pointer-events-none fixed top-0 left-0 w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)] z-40 transition-transform duration-200 ease-out hidden md:block"
        style={{
          transform: `translate3d(${mousePos.x - 130}px, ${mousePos.y - 130}px, 0)`,
        }}
      />

      {/* SECTION 1 — NAVBAR */}
      <Navbar onScrollTo={handleScrollToSection} />

      {/* SECTION 2 — HERO */}
      {currentPage === "home" && (
        <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-32 md:pt-40 pb-12 sm:pb-16 dot-grid-animated">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
        
        {/* Low opacity Golden ambient backglow on right panel area */}
        <div className="absolute right-[10%] top-[25%] w-[450px] h-[450px] rounded-full bg-[hsl(42,56%,10%)] filter blur-[120px] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-20 w-full">
          
          {/* Hero Left, 55% space */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            {/* Exclusive target Badge with pulsing online status */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-stone-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DBA6F] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DBA6F]"></span>
              </span>
              <span className="font-sans font-semibold text-[10px] tracking-wider uppercase select-none">
                Exclusive partner to Home Service, Medical & Legal
              </span>
            </div>

            {/* Main Premium Heading with Character Typewriter cycle */}
            <h1 className="font-sans font-bold text-white tracking-tight leading-[1.05] text-[clamp(2rem,5vw,4.5rem)]">
              Your Website Should Be Your{" "}
              <span className="text-[#C9A84C] relative inline-block min-w-[280px]">
                {typewriterText}
                <span className="inline-block w-1.5 bg-[#C9A84C] animate-pulse ml-1">|</span>
              </span>
            </h1>

            {/* Clean descriptive helper info */}
            <p className="font-sans text-[#fg2] text-sm sm:text-base leading-relaxed max-w-xl">
              We partner with a select group of Home Service, Medical, and Legal businesses to replace outdated websites with autonomous AI-powered booking funnels. They answer questions, follow up, and capture qualified clients 24/7 — automatically.
            </p>

            {/* CTA action cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Primary shimmer sweeping button */}
              <button
                onClick={() => handleScrollToSection("contact")}
                className="relative overflow-hidden group px-8 py-4 bg-[#C9A84C] text-black font-sans text-xs font-bold uppercase tracking-widest rounded border border-[#C9A84C]/20 transition-transform active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                {/* Shimmer linear strip overlay on hover */}
                <div className="absolute inset-0 w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                Get Free Website Audit <ArrowRight size={14} />
              </button>

              <button
                onClick={() => handleScrollToSection("calculator")}
                className="px-8 py-4 border border-white/10 hover:border-[#C9A84C]/30 hover:bg-white/3 text-white font-sans text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
              >
                See It Live
              </button>
            </div>

            {/* Dynamic Trust Checklist */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-sans font-semibold text-stone-400 select-none pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-[#C9A84C]">
                <Check size={12} className="text-[#3DBA6F]" /> Limited spots available
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-[#3DBA6F]" /> Exclusive to qualifying niches
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-[#3DBA6F]" /> 100% done for you
              </span>
            </div>

            {/* 3-Stat Counter Strip count ups */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-left border-t border-white/5">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#F0C060]">
                  3×
                </p>
                <p className="font-sans text-[10px] text-stone-500 uppercase tracking-wider mt-1">Average Leads</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#F0C060]">
                  14
                </p>
                <p className="font-sans text-[10px] text-stone-500 uppercase tracking-wider mt-1">Day Launch</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#F0C060]">
                  100%
                </p>
                <p className="font-sans text-[10px] text-stone-500 uppercase tracking-wider mt-1">Done For You</p>
              </div>
            </div>

          </motion.div>

          {/* Hero Right, 45% Space (Live AI widget) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <ChatWidget />
          </motion.div>

        </div>
      </section>
      )}

      {/* SECTION 3 — TICKER BAR */}
      {currentPage === "home" && (
        <section className="py-5 bg-black border-y border-white/5 overflow-hidden select-none">
        <div className="relative w-full overflow-hidden">
          {/* Ticker scrolling track */}
          <div className="animate-ticker-scroll whitespace-nowrap flex items-center gap-10">
            {/* Duplicated arrays to prevent visual seams on loop */}
            {[...Array(4)].flatMap((_, i) => (
              <React.Fragment key={i}>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-300 uppercase">
                  PLUMBING & HVAC
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase">
                  POWERED BY GO HIGH LEVEL
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-300 uppercase">
                  DENTAL & MEDICAL CLINICS
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase">
                  POWERED BY OPENAI
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-300 uppercase">
                  ROOFING & CONSTRUCTION
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase">
                  POWERED BY MAKE.COM
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-300 uppercase">
                  LAW FIRMS & SOLICITORS
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
                <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase">
                  POWERED BY TWILIO
                </span>
                <span className="text-[#C9A84C] font-semibold text-[13px]">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SECTION 4 — PROBLEMS */}
      {currentPage === "results" && (
        <section id="results" className="pt-32 md:pt-40 pb-20 bg-bg2 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase check-tag">
              Sound Familiar?
            </span>
            <h2 className="font-sans font-bold text-white tracking-tight leading-[1.1] text-[clamp(2rem,3.5vw,3.2rem)] mt-3">
              Why Home Service, Medical & Legal Businesses Lose Clients Every Single Day.
            </h2>
            <p className="font-sans text-xs text-[#fg2] mt-3 leading-relaxed max-w-xl">
              Whether you are a local commercial plumber, a private aesthetic clinic, or a boutique family law practice — identical leaks in your customer intake funnel are actively bleeding revenue.
            </p>
          </div>

          {/* 3-Column Grid of 6 Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemCards.map((p, index) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative bg-[#0e0e0e] border border-white/5 rounded-xl p-6 flex flex-col justify-between overflow-hidden"
              >
                {/* Gold sliding top border on hover */}
                <span className="absolute top-0 left-0 w-full h-[2px] bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div>
                  <span className="font-mono text-xs font-bold text-[#gold-dim] opacity-60">
                    {p.num}
                  </span>
                  <h4 className="font-sans font-bold text-sm text-stone-100 uppercase tracking-wide mt-3 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.title}
                  </h4>
                  <p className="font-sans text-xs text-[#fg2] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Without vs With Comparison block */}
          <div className="mt-14 p-8 rounded-2xl bg-black border border-[rgba(201,168,76,0.1)]">
            <h3 className="font-sans font-bold text-base text-[#C9A84C] uppercase tracking-wider mb-6 text-center select-none">
              Client Acquisition Comparison — The Hard Truths
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">
              {/* Without Column */}
              <div className="space-y-4 pb-6 md:pb-0">
                <h4 className="font-sans font-bold text-xs tracking-widest text-[#fg3] uppercase flex items-center gap-2 select-none">
                  <X size={14} className="text-[#E05050]" /> Without NovuWebs funnel
                </h4>
                <ul className="space-y-3.5 text-xs text-stone-400 font-sans pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E05050] inline-block shrink-0" />
                    <span>Slow loading website that loses 40% of page hits on mobile before rendering.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E05050] inline-block shrink-0" />
                    <span>Inbound inquiries sitting unanswered in an email inbox for hours or entire weekends.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E05050] inline-block shrink-0" />
                    <span>Forced to rely strictly on traditional receptionist phone tag to schedule services.</span>
                  </li>
                  <li className="flex items-start gap-3 justify-start">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E05050] inline-block shrink-0" />
                    <span>Zero automated reviews collection loop, ensuring negative online ratings dominate.</span>
                  </li>
                </ul>
              </div>

              {/* With Column */}
              <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                <h4 className="font-sans font-bold text-xs tracking-widest text-[#C9A84C] uppercase flex items-center gap-2 select-none">
                  <Check size={14} className="text-[#3DBA6F]" /> With NovuWebs systems
                </h4>
                <ul className="space-y-3.5 text-xs text-stone-200 font-sans pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3DBA6F] inline-block shrink-0" />
                    <span>Lightning-fast HTML built for sub-second delivery and trust signal layout benchmarks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3DBA6F] inline-block shrink-0" />
                    <span>Autonomous AI reception booking every single lead in under 12 seconds with no human help.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3DBA6F] inline-block shrink-0" />
                    <span>Fully synchronized CRM matching followups via automated phone, SMS, and email.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3DBA6F] inline-block shrink-0" />
                    <span>Automated reputation loops instantly emailing 5-star rating requests directly on project closing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
      )}

      {/* SECTION 5 — SERVICES */}
      {currentPage === "services" && (
        <section id="services" className="pt-32 md:pt-40 pb-20 bg-bg border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase">
              What We Build
            </span>
            <h2 className="font-sans font-bold text-white tracking-tight leading-[1.1] text-[clamp(2rem,3.5vw,3.2rem)] mt-3">
              Built Specifically for High-Value Service Businesses.
            </h2>
            <p className="font-sans text-xs text-[#fg2] mt-3 leading-relaxed max-w-xl">
              We do not accept every applicant. We focus specifically on local trade contractors, dental/medical practitioners, and solicitors looking for robust automated digital conversion.
            </p>
          </div>

          {/* 2x2 grid of service cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.id}
                onMouseEnter={() => setHoveredService(s.id)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => setHoveredService((prev) => prev === s.id ? null : s.id)}
                className="group border border-white/5 bg-[#0a0a0a] rounded-xl p-6 transition-all duration-300 relative cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/15 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-[#C9A84C] group-hover:text-[#F0C060] transition-colors uppercase font-bold">
                      {hoveredService === s.id ? "Minimize x" : "View Stack details +"}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-base text-stone-100 group-hover:text-[#C9A84C] transition-colors leading-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-xs text-[#fg2] leading-relaxed mb-4">
                    {s.description}
                  </p>

                  <ul className="space-y-2.5">
                    {s.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-sans text-stone-300">
                        <Check size={12} className="text-[#3DBA6F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sliding Auto-Expanded detail panel */}
                <AnimatePresence>
                  {hoveredService === s.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden mt-6 pt-5 border-t border-white/5"
                    >
                      <h5 className="font-mono text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase mb-1.5">
                        What You Get — System Specs
                      </h5>
                      <p className="font-sans text-xs text-stone-400 leading-relaxed">
                        {s.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Full-width card: CSS / SVG Flow Diagram */}
          <div className="mt-10 bg-[#070707] border border-[rgba(201,168,76,0.15)] rounded-2xl p-6 md:p-8 overflow-hidden relative">
            <h4 className="font-sans font-bold text-center text-stone-200 text-sm tracking-wider uppercase mb-8">
              The Full Stack — Autonomous Pipeline Synchronization Flow
            </h4>

            {/* Pipeline CSS Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative z-20">
              {flowSteps.map((step, index) => {
                const isSelected = activeNode === index;
                return (
                  <div key={index} className="flex flex-col items-center text-center relative">
                    <div
                      className={`w-full max-w-[140px] px-3.5 py-4 border rounded-xl flex flex-col justify-center items-center transition-all duration-500 h-24 ${
                        isSelected
                          ? "bg-[#C9A84C]/10 border-[#C9A84C] shadow-lg shadow-[#C9A84C]/5 scale-105"
                          : "bg-white/3 border-white/5 scale-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mb-2 ${isSelected ? "bg-[#3DBA6F] animate-ping" : "bg-zinc-700"}`} />
                      <p className={`font-sans font-bold text-[11px] leading-tight ${isSelected ? "text-[#C9A84C]" : "text-stone-300"}`}>
                        {step.name}
                      </p>
                      <p className="font-sans text-[9px] text-zinc-500 leading-tight mt-1">
                        {step.desc}
                      </p>
                    </div>

                    {/* Desktop connection lines arrow character */}
                    {index < 6 && (
                      <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-4 text-center text-stone-600 font-mono font-bold">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
      )}

      {/* SECTION 6 — PROCESS */}
      {currentPage === "process" && (
        <section id="process" className="pt-32 md:pt-40 pb-20 bg-bg2 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-14">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase">
              How It Works
            </span>
            <h2 className="font-sans font-bold text-white tracking-tight text-[clamp(2rem,3.5vw,3.2rem)] mt-3">
              From Audit to Live in Under 14 Days.
            </h2>
            <p className="font-sans text-xs text-[#fg2] mt-3 leading-relaxed max-w-xl">
              We design and execute without traditional developer delays. Read exactly how our 14-day calibration timeline structures your system jumpstart.
            </p>
          </div>

          {/* 4-Step timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative items-stretch">
            
            {/* Step 1 */}
            <div className="relative bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
              <span className="absolute right-3.5 -bottom-2 font-mono text-[9rem] font-bold text-stone-800/10 leading-none select-none pointer-events-none">
                1
              </span>
              <div className="relative z-10 space-y-3.5">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/5 px-2.5 py-1 border border-[#C9A84C]/15 rounded uppercase">
                  Step 01
                </span>
                <p className="font-sans font-bold text-sm text-stone-100 uppercase tracking-wide leading-tight">
                  Free Audit & Strategy
                </p>
                <p className="font-sans text-xs text-stone-400 leading-relaxed">
                  We analyze your current website layout, local Google rankings, and lead capture speeds to pinpoint your exact leakage points.
                </p>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#C9A84C] mt-8 uppercase tracking-widest relative z-10 leading-none">
                Day 1
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
              <span className="absolute right-3.5 -bottom-2 font-mono text-[9rem] font-bold text-stone-800/10 leading-none select-none pointer-events-none">
                2
              </span>
              <div className="relative z-10 space-y-3.5">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/5 px-2.5 py-1 border border-[#C9A84C]/15 rounded uppercase">
                  Step 02
                </span>
                <p className="font-sans font-bold text-sm text-stone-100 uppercase tracking-wide leading-tight">
                  Custom build & Design
                </p>
                <p className="font-sans text-xs text-stone-400 leading-relaxed">
                  Our developers architect your conversion-optimized layout, configure your autonomous booking chat reception, and wire up SMS pipelines.
                </p>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#C9A84C] mt-8 uppercase tracking-widest relative z-10 leading-none">
                Days 2–7
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
              <span className="absolute right-3.5 -bottom-2 font-mono text-[9rem] font-bold text-stone-800/10 leading-none select-none pointer-events-none">
                3
              </span>
              <div className="relative z-10 space-y-3.5">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/5 px-2.5 py-1 border border-[#C9A84C]/15 rounded uppercase">
                  Step 03
                </span>
                <p className="font-sans font-bold text-sm text-stone-100 uppercase tracking-wide leading-tight">
                  Launch & Go Live
                </p>
                <p className="font-sans text-xs text-stone-400 leading-relaxed">
                  We manage domain migration, finalize standard local SEO markup parameters, and conduct live end-to-end booking tests before official handoff.
                </p>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#C9A84C] mt-8 uppercase tracking-widest relative z-10 leading-none">
                Days 8–14
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
              <span className="absolute right-3.5 -bottom-2 font-mono text-[9rem] font-bold text-stone-800/10 leading-none select-none pointer-events-none">
                4
              </span>
              <div className="relative z-10 space-y-3.5">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/5 px-2.5 py-1 border border-[#C9A84C]/15 rounded uppercase">
                  Step 04
                </span>
                <p className="font-sans font-bold text-sm text-stone-100 uppercase tracking-wide leading-tight">
                  Optimise & Scale
                </p>
                <p className="font-sans text-xs text-stone-400 leading-relaxed">
                  We monitor live performance metrics continuous A/B test heading variants, and deliver monthly performance audits on overall lead inflow.
                </p>
              </div>
              <p className="font-mono text-[10px] font-bold text-[#C9A84C] mt-8 uppercase tracking-widest relative z-10 leading-none">
                Ongoing
              </p>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* SECTION 7 — INTERACTIVE REVENUE LOSS CALCULATOR */}
      {currentPage === "calculator" && (
        <section id="calculator" className="pt-32 md:pt-40 pb-20 bg-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase">
              Revenue Loss Calculator
            </span>
            <h2 className="font-sans font-bold text-white tracking-tight leading-[1.1] text-[clamp(2rem,3.5vw,3.2rem)] mt-3">
              How Many High-Value Clients Are You Losing Each Month?
            </h2>
            <p className="font-sans text-xs text-[#fg2] mt-3 leading-relaxed max-w-xl">
              Compare your current setup against a NovuWebs conversion model. See how much money leaks outside office hours in your niche.
            </p>
          </div>

          <RevenueCalculator />

        </div>
      </section>
      )}

      {/* SECTION 8 — ANIMATED STATS BAR */}
      {currentPage === "calculator" && (
        <section className="py-12 bg-bg3 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            <div className="text-center sm:text-left">
              <span className="font-mono text-3xl font-bold text-[#C9A84C]">3×</span>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Average Lead Increase</p>
            </div>

            <div className="text-center sm:text-left">
              <span className="font-mono text-3xl font-bold text-[#C9A84C]">14 Days</span>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Launch Guarantee</p>
            </div>

            <div className="text-center sm:text-left">
              <span className="font-mono text-3xl font-bold text-[#C9A84C]">3 Niches</span>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Niches Served</p>
            </div>

            <div className="text-center sm:text-left">
              <span className="font-mono text-3xl font-bold text-[#C9A84C]">48hr</span>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Audit Turnaround</p>
            </div>

            <div className="col-span-2 md:col-span-1 text-center sm:text-left">
              <span className="font-mono text-3xl font-bold text-[#C9A84C]">100%</span>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-semibold">Done For You</p>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* SECTION 9 — FINAL CTA & CONTACT FORM */}
      {currentPage === "contact" && (
        <section id="contact" className="pt-32 md:pt-40 pb-24 bg-bg2 relative border-t border-white/5">
        {/* Glow behind section */}
        <div className="absolute left-[35%] top-[10%] w-[500px] h-[500px] rounded-full bg-[hsl(42,56%,5%)] filter blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* CTA Left Column, info */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-bold uppercase">
                  Ready to Stop Losing Clients?
                </span>
                <h2 className="font-sans font-bold text-white tracking-tight leading-[1.1] text-[clamp(2.1rem,3.8vw,3.5rem)] mt-3">
                  Apply for Your Free Growth Audit.
                </h2>
                <h3 className="font-sans text-base text-[#F0C060] font-semibold mt-1">
                  We Only Partner With 5 New Clients Per Month.
                </h3>
                <p className="font-sans text-xs text-[#fg2] mt-3 leading-relaxed">
                  We'll conduct a fully manual analysis of your current website, traffic, client response lag, and local Google indexation. Then, we walk you through a custom step-by-step resolution strategy. No obligation.
                </p>
              </div>

              {/* Countdown Urgency Pulsing Badge */}
              <div className="inline-flex items-center gap-2.5 self-start px-4.5 py-2.5 rounded-lg bg-yellow-950/25 border border-[#C9A84C]/30 select-none">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-[#C9A84C] bg-[#C9A84C]"></span>
                </span>
                <p className="font-mono text-xs text-[#C9A84C] font-bold uppercase tracking-wider animate-pulse">
                  ⚡ Only {slotsRemaining} audit slots remaining this week
                </p>
              </div>

              {/* Trust parameters list */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-stone-300 font-sans">
                  <Check size={14} className="text-[#3DBA6F]" />
                  <span>Only 5 spots allocated per month</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300 font-sans">
                  <Check size={14} className="text-[#3DBA6F]" />
                  <span>Exclusively for Home Service, Medical & Legal</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300 font-sans">
                  <Check size={14} className="text-[#3DBA6F]" />
                  <span>100% finished and deployed for you</span>
                </div>
              </div>
            </div>

            {/* CTA Right Column, Manual Audit Request Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#0b0b0b] border border-[rgba(201,168,76,0.18)] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit} 
                      className="space-y-4"
                    >
                      <h4 className="font-sans font-bold text-sm text-stone-200 tracking-wider uppercase mb-5 border-b border-white/5 pb-3">
                        Secure Your Growth Strategy Session
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Business Name */}
                        <div className="space-y-1.5">
                          <label className="font-sans text-[11px] font-bold text-stone-300 uppercase tracking-wider">Business Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            placeholder="e.g., Mike's Professional Plumbing"
                            className="w-full bg-black border border-white/10 rounded px-3.5 py-2.5 text-xs font-sans text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>

                        {/* Website URL */}
                        <div className="space-y-1.5">
                          <label className="font-sans text-[11px] font-bold text-stone-300 uppercase tracking-wider font-semibold">Website URL or Google Listing</label>
                          <input
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                            placeholder="e.g., https://mikespluming.com"
                            className="w-full bg-black border border-white/10 rounded px-3.5 py-2.5 text-xs font-sans text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                      </div>

                      {/* Niche Selector */}
                      <div className="space-y-1.5">
                        <label className="font-sans text-[11px] font-bold text-stone-300 uppercase tracking-wider">Select Your Industry Category</label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { name: "Home Services", icon: <Building2 size={13} /> },
                            { name: "Medical Practice", icon: <Stethoscope size={13} /> },
                            { name: "Legal / Law Firm", icon: <Scale size={13} /> }
                          ].map((industry) => {
                            const isSelected = formData.niche === industry.name;
                            return (
                              <button
                                type="button"
                                key={industry.name}
                                onClick={() => setFormData({ ...formData, niche: industry.name })}
                                className={`py-3.5 rounded flex flex-col md:flex-row items-center justify-center gap-1.5 font-sans font-semibold text-[10px] uppercase tracking-wide border cursor-pointer select-none transition-all ${
                                  isSelected
                                    ? "bg-[#C9A84C]/10 border-[#C9A84C] text-[#F0C060]"
                                    : "bg-black border-white/10 text-stone-400 hover:text-stone-200"
                                }`}
                              >
                                {industry.icon}
                                {industry.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email Address */}
                        <div className="space-y-1.5">
                          <label className="font-sans text-[11px] font-bold text-stone-300 uppercase tracking-wider">Work Email *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g., mike@mikesplumbing.com"
                            className="w-full bg-black border border-white/10 rounded px-3.5 py-2.5 text-xs font-sans text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>

                        {/* Telephone contact */}
                        <div className="space-y-1.5">
                          <label className="font-sans text-[11px] font-bold text-stone-300 uppercase tracking-wider">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g., (555) 019-2834"
                            className="w-full bg-black border border-white/10 rounded px-3.5 py-2.5 text-xs font-sans text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-[#C9A84C] hover:bg-[#F0C060] text-black font-sans text-xs font-bold uppercase tracking-widest rounded border border-[#C9A84C]/20 shadow-xl shadow-[#C9A84C]/10 transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                      >
                        Submit Audit Application & Secure Slot <ArrowUpRight size={14} />
                      </button>

                      <p className="font-sans text-[10px] text-stone-500 leading-normal text-center mt-3">
                        ✓ Absolute NDA confidentiality · ✓ 100% manual analyst review · ✓ Response within 48 hours
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#3DBA6F]/10 border border-[#3DBA6F]/20 flex items-center justify-center text-[#3DBA6F] mx-auto mb-4">
                        <Check size={28} />
                      </div>
                      <h4 className="font-sans font-bold text-base text-stone-100 uppercase tracking-wider">
                        Application Successfully Received!
                      </h4>
                      <p className="font-sans text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
                        Thank you for applying. Our digital optimization analysts will conduct a complete manual assessment of <span className="text-[#C9A84C] font-mono font-bold">{formData.businessName}</span> within 48 hours. A localized audit document will be delivered directly to <span className="text-white font-semibold">{formData.email}</span>.
                      </p>
                      <div className="bg-white/3 border border-white/5 rounded-lg p-3.5 max-w-sm mx-auto text-left space-y-2 mt-4">
                        <p className="font-mono text-[9px] tracking-wider text-[#C9A84C] uppercase text-center font-bold">What is next?</p>
                        <ul className="space-y-1.5 text-[10px] font-sans text-stone-300">
                          <li>• In-depth lighthouse audit of rendering latency</li>
                          <li>• Mobile view UX checkout diagnostic report</li>
                          <li>• Google maps placement validation</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* SECTION 10 — FOOTER */}
      <footer className="bg-[#060606] border-t border-[rgba(201,168,76,0.15)] py-14 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Footer Left, logo + descriptive tag */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://www.image2url.com/r2/default/images/1780947779301-df370fd3-6951-4b17-8985-5e37b1b0e441.png"
                alt="NovuWebs Logo"
                className="w-10 h-10 object-contain mix-blend-screen"
                referrerPolicy="no-referrer"
              />
              <span className="font-sans font-bold text-base text-white">
                NovuWebs<span className="text-[#C9A84C] font-mono">.AI</span>
              </span>
            </div>
            <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-md">
              We partner with a elite subset of local Home Service contractors, private medical clinics, and established legal firms to replace old conversion funnels with autonomous booking receptionists that work 24/7.
            </p>
          </div>

          {/* Footer Center, Nav links */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="font-mono text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase border-b border-white/5 pb-2">
              Pipeline Navigation
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <span onClick={() => handleScrollToSection("services")} className="text-stone-400 hover:text-white cursor-pointer select-none">Services</span>
              <span onClick={() => handleScrollToSection("process")} className="text-stone-400 hover:text-white cursor-pointer select-none">Process</span>
              <span onClick={() => handleScrollToSection("calculator")} className="text-stone-400 hover:text-white cursor-pointer select-none">Calculator</span>
              <span onClick={() => handleScrollToSection("results")} className="text-stone-400 hover:text-white cursor-pointer select-none">Results</span>
            </div>
          </div>

          {/* Footer Right, Copyright & Socials */}
          <div className="lg:col-span-3 space-y-4 text-left sm:text-right">
            <h5 className="font-mono text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase border-b border-white/5 pb-2">
              Verify Authority
            </h5>
            <p className="font-sans text-xs text-stone-500 mt-2">
              © 2026 NovuWebs AI. All rights reserved.
            </p>
            <div className="flex gap-3 pt-2 justify-start sm:justify-end">
              <a href="#" className="p-2 sm:p-2.5 rounded bg-white/3 border border-white/5 text-stone-400 hover:text-white hover:border-[#C9A84C]/40 transition-colors">
                <Linkedin size={14} />
              </a>
              <a href="#" className="p-2 sm:p-2.5 rounded bg-white/3 border border-white/5 text-stone-400 hover:text-white hover:border-[#C9A84C]/40 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" className="p-2 sm:p-2.5 rounded bg-white/3 border border-white/5 text-stone-400 hover:text-white hover:border-[#C9A84C]/40 transition-colors">
                <Twitter size={14} />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
