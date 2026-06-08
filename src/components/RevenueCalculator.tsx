import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { AlertCircle, ArrowUpRight, TrendingDown, HelpCircle, Check, Shield } from "lucide-react";
import { CalculatorState, CalculatorOutputs } from "../types";

export default function RevenueCalculator() {
  // 4 Sliders initial state
  const [visitors, setVisitors] = useState(1200);
  const [jobValue, setJobValue] = useState(450);
  const [conversionRate, setConversionRate] = useState(1.8);
  const [unansweredRate, setUnansweredRate] = useState(50);

  // States to hold animated visual counts to avoid sudden pops
  const [currRev, setCurrRev] = useState(0);
  const [potRev, setPotRev] = useState(0);
  const [leakRev, setLeakRev] = useState(0);
  const [lossRev, setLossRev] = useState(0);

  // Benchmarked potential conversion rate
  const targetRate = Math.max(6, conversionRate + 2.5);

  const calculateResults = () => {
    // Current Monthly Revenue
    const currentRevenue = visitors * (conversionRate / 100) * jobValue;
    
    // Potential Monthly Revenue (NovuWebs benchmarks)
    const potentialRevenue = visitors * (targetRate / 100) * jobValue;
    
    // Website conversion leak (revenue left on table due to old structure)
    const conversionGapLeak = potentialRevenue - currentRevenue;
    
    // After hours leakage (leads unanswered from current inflow)
    const afterHoursLeak = currentRevenue * (unansweredRate / 100);
    
    // Total combined loss
    const totalLoss = conversionGapLeak + afterHoursLeak;
    const annualLoss = totalLoss * 12;

    return {
      currentRevenue,
      potentialRevenue,
      leakage: afterHoursLeak,
      totalLoss,
      annualLoss,
    };
  };

  const results = calculateResults();

  // Smooth local animating state for stats counters
  useEffect(() => {
    const steps = 15;
    let step = 0;
    
    const startCurr = currRev;
    const startPot = potRev;
    const startLeak = leakRev;
    const startLoss = lossRev;
    
    const diffCurr = results.currentRevenue - startCurr;
    const diffPot = results.potentialRevenue - startPot;
    const diffLeak = results.leakage - startLeak;
    const diffLoss = results.totalLoss - startLoss;

    const timer = setInterval(() => {
      step++;
      setCurrRev(Math.round(startCurr + (diffCurr * (step / steps))));
      setPotRev(Math.round(startPot + (diffPot * (step / steps))));
      setLeakRev(Math.round(startLeak + (diffLeak * (step / steps))));
      setLossRev(Math.round(startLoss + (diffLoss * (step / steps))));
      
      if (step >= steps) {
        clearInterval(timer);
        setCurrRev(Math.round(results.currentRevenue));
        setPotRev(Math.round(results.potentialRevenue));
        setLeakRev(Math.round(results.leakage));
        setLossRev(Math.round(results.totalLoss));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [visitors, jobValue, conversionRate, unansweredRate]);

  // Dynamic informative sentence
  const formattedLossStr = results.totalLoss.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  
  const formattedVisitors = visitors.toLocaleString("en-US");
  const formattedJobValue = jobValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const dynamicSummary = `With ${formattedVisitors} website visitors per month and a ${formattedJobValue} average job/client value, you are likely hemorrhaging ${formattedLossStr} every single month. This leak is driven directly by unconverted traffic and missed after-hours leads.`;

  // Bar heights calculation
  const maxRev = Math.max(results.potentialRevenue, 1);
  const currentPercentage = Math.round((results.currentRevenue / maxRev) * 100);
  const potentialPercentage = 100; // Potential is the 100% baseline in this comparison

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Left panel: Context, Live Visual Bar Chart, Reference Cards */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C9A84C] font-semibold uppercase px-2.5 py-1 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-full inline-block">
            Revenue Comparison
          </span>
          <h3 className="font-sans font-bold text-xl tracking-tight text-white mt-4">
            How You Stack Up
          </h3>
          <p className="font-sans text-xs text-[#fg2] mt-2 leading-relaxed">
            Missed leads and poor onsite optimization represent real, direct cash leaks. Here's a live visualization comparing your current performance against a calibrated NovuWebs funnel.
          </p>
        </div>

        {/* Live Mini Bar Chart */}
        <div className="bg-white/3 border border-[rgba(255,255,255,0.06)] rounded-xl p-5 flex flex-col justify-between h-56 relative overflow-hidden">
          <div className="flex justify-between items-center z-10 pointer-events-none">
            <span className="font-sans font-semibold text-xs text-stone-300">Live Funnel Yield</span>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Indexed Comparison</span>
          </div>

          <div className="grid grid-cols-2 gap-8 items-end h-28 mt-4">
            {/* Current Revenue Bar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-900 border border-zinc-800 rounded-t-lg flex items-end h-full relative">
                <div 
                  style={{ height: `${Math.max(currentPercentage, 8)}%` }}
                  className="w-full bg-gradient-to-t from-red-950/40 to-stone-600 border-t-2 border-stone-400 rounded-t-lg transition-all duration-300 flex items-center justify-center p-1"
                >
                  <span className="font-mono text-[9px] font-bold text-white leading-none rotate-0">
                    {currentPercentage}%
                  </span>
                </div>
              </div>
              <span className="font-sans text-[10px] font-semibold text-stone-400 uppercase tracking-wider leading-none mt-1">Current</span>
              <span className="font-mono text-[11px] font-bold text-stone-400">
                ${currRev.toLocaleString()}
              </span>
            </div>

            {/* Potential Revenue Bar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-full bg-zinc-900 border border-[#C9A84C]/10 rounded-t-lg flex items-end h-full relative">
                <div 
                  style={{ height: "100%" }}
                  className="w-full bg-gradient-to-t from-[#C9A84C]/10 to-[#C9A84C] border-t-2 border-[#F0C060] rounded-t-lg transition-all duration-300 flex items-center justify-center p-1"
                >
                  <span className="font-mono text-[9px] font-bold text-black leading-none bg-[#F0C060] px-1 rounded">
                    100%
                  </span>
                </div>
              </div>
              <span className="font-sans text-[10px] font-semibold text-[#C9A84C] uppercase tracking-wider leading-none mt-1">Potential</span>
              <span className="font-mono text-[11px] font-bold text-[#F0C060]">
                ${potRev.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Reference Cards (after hours, conversions benchmarks) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-950/10 border border-red-500/10 rounded-lg p-3 flex flex-col justify-between">
            <span className="font-mono text-[9px] tracking-wider text-red-400 font-bold uppercase leading-none">AFTER-HOURS</span>
            <p className="font-sans font-bold text-[13px] text-stone-200 mt-2">60% Leads Lost</p>
            <p className="font-sans text-[9px] text-[#fg2] mt-1 leading-normal">Inquiries go completely unanswered at night</p>
          </div>

          <div className="bg-red-950/10 border border-red-500/10 rounded-lg p-3 flex flex-col justify-between">
            <span className="font-mono text-[9px] tracking-wider text-red-400 font-bold uppercase leading-none">CONVERSION</span>
            <p className="font-sans font-bold text-[13px] text-stone-200 mt-2">1.8% Avg Rate</p>
            <p className="font-sans text-[9px] text-[#fg2] mt-1 leading-normal">Standard service websites leak bulk visitors</p>
          </div>

          <div className="bg-green-950/15 border border-green-500/10 rounded-lg p-3 flex flex-col justify-between">
            <span className="font-mono text-[9px] tracking-wider text-[#3DBA6F] font-bold uppercase leading-none">NOVUWEBS SPEED</span>
            <p className="font-sans font-bold text-[13px] text-stone-200 mt-2">5% - 8% Rate</p>
            <p className="font-sans text-[9px] text-[#fg2] mt-1 leading-normal">Calibrated copywriting and smooth scheduling</p>
          </div>

          <div className="bg-green-950/15 border border-green-500/10 rounded-lg p-3 flex flex-col justify-between">
            <span className="font-mono text-[9px] tracking-wider text-[#3DBA6F] font-bold uppercase leading-none">LEAD NURTURING</span>
            <p className="font-sans font-bold text-[13px] text-stone-200 mt-2">+220% Bookings</p>
            <p className="font-sans text-[9px] text-[#fg2] mt-1 leading-normal">Multi-touch automated nurturing sequences</p>
          </div>
        </div>
      </div>

      {/* Right panel: Sliders, Math inputs, live calculations, dynamic sentence and CTA */}
      <div className="lg:col-span-7 bg-[#0b0b0b] border border-[rgba(201,168,76,0.15)] rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl relative">
        <div className="flex items-center gap-2 text-stone-400">
          <Shield size={14} className="text-[#C9A84C]" />
          <span className="font-sans font-semibold text-[10px] uppercase tracking-widest text-[#fg2]">Interactive Cost Modeler</span>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4">
          
          {/* Slider 1: Website visitors */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                Monthly Website Visitors
                <HelpCircle size={11} className="text-stone-500 cursor-help" title="Estimate of unique people reaching your homepage monthly" />
              </label>
              <span className="font-mono text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/5 px-2 py-0.5 rounded border border-[#C9A84C]/15">
                {visitors.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="50"
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
            />
          </div>

          {/* Slider 2: Average job/sale value */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                Average Client/Job Worth ($)
                <HelpCircle size={11} className="text-stone-500 cursor-help" title="Average initial contract value, plumbing ticket, patient lifetime initial, or legal case fee" />
              </label>
              <span className="font-mono text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/5 px-2 py-0.5 rounded border border-[#C9A84C]/15">
                ${jobValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={jobValue}
              onChange={(e) => setJobValue(Number(e.target.value))}
              className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
            />
          </div>

          {/* Slider 3: Current Web conversion */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                Current Website Booking Rate (%)
                <HelpCircle size={11} className="text-stone-500 cursor-help" title="What % of your website visitors actually submit a form, call, or book" />
              </label>
              <span className="font-mono text-xs font-bold text-red-400 bg-red-400/5 px-2 py-0.5 rounded border border-red-400/10">
                {conversionRate}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Slider 4: Unanswered leads after hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                After-Hours Inquiries Missed (%)
                <HelpCircle size={11} className="text-stone-500 cursor-help" title="Estimated portion of traffic hitting your site outside 9-to-5 that goes to competitors" />
              </label>
              <span className="font-mono text-xs font-bold text-red-400 bg-red-400/5 px-2 py-0.5 rounded border border-red-400/10">
                {unansweredRate}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={unansweredRate}
              onChange={(e) => setUnansweredRate(Number(e.target.value))}
              className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>

        {/* Live Calculation Output blocks */}
        <div className="bg-black/60 border border-white/5 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[9px] text-stone-500 uppercase tracking-wider">Current Rev.</p>
              <p className="font-mono text-sm font-semibold text-stone-400 mt-1">${currRev.toLocaleString()}<span className="text-[10px] text-zinc-600">/mo</span></p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-[#C9A84C] uppercase tracking-wider">NovuWebs Potential</p>
              <p className="font-mono text-sm font-semibold text-[#F0C060] mt-1">${potRev.toLocaleString()}<span className="text-[10px] text-amber-500/80">/mo</span></p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-red-500 font-bold uppercase tracking-widest">
                <TrendingDown size={12} />
                Total Cash Leakage
              </div>
              <p className="font-mono text-2xl font-bold text-[#E05050] tracking-tight mt-1.5">
                ${lossRev.toLocaleString()}<span className="text-xs font-normal text-stone-500"> / month</span>
              </p>
              <p className="font-mono text-[10px] text-stone-500 mt-1">
                Annual forecast: <span className="text-red-400 font-semibold">${(lossRev * 12).toLocaleString()}/year lost</span>
              </p>
            </div>

            <div className="bg-white/3 border border-[#C9A84C]/5 rounded-lg px-4 py-2.5 max-w-sm">
              <p className="font-sans text-[11px] leading-relaxed text-stone-300">
                <span className="text-[#3DBA6F] font-bold font-mono">Calibrated Impact:</span> Booking rates typically rise to <span className="text-[#F0C060] font-bold">5%–8%</span> with a 24/7 autonomous receptionist.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Sentence Narrative */}
        <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-lg p-3 flex gap-2.5 items-start">
          <AlertCircle size={15} className="text-[#C9A84C] shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-stone-300 leading-normal">
            {dynamicSummary}
          </p>
        </div>

        {/* Full-width CTA button */}
        <a
          href="#contact"
          className="w-full block text-center py-3.5 rounded bg-[#C9A84C] hover:bg-[#F0C060] text-black font-sans text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#C9A84C]/5 hover:shadow-[#C9A84C]/15 border border-[#C9A84C]/20 transition-all duration-300"
        >
          Fix This — Apply for Free Audit →
        </a>

      </div>
    </div>
  );
}
