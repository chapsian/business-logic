import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  Check, 
  Briefcase, 
  Users, 
  Percent, 
  FileCheck2, 
  Coins,
  ShieldAlert,
  ArrowUpRight,
  FileText,
  Calculator,
  FileSignature
} from 'lucide-react';
import { BOOKKEEPING_PLANS } from './data/mockData';
import { motion } from 'motion/react';

export default function App() {
  const targetPhone = '0720646916';
  const displayPhone = '0720646916';
  const targetEmail = 'noble.consultants@yahoo.com';

  // State to hold a selected plan to showcase high-level onboarding guidance
  const [selectedPlanTab, setSelectedPlanTab] = useState<'micro' | 'small' | 'growing'>('small');

  // Find active plan details
  const activePlan = BOOKKEEPING_PLANS.find(p => p.id === selectedPlanTab) || BOOKKEEPING_PLANS[1];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* ⚠️ AD POLICY NOTICE: Private CPA Advisory Header */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-2.5 px-4 font-mono select-none text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1.5">
          <span className="inline-flex items-center text-indigo-400 font-extrabold uppercase bg-indigo-950 px-2 py-0.5 rounded text-[9px] tracking-wide">
            Private Consulting Services
          </span>
          <span>
            Independent preparation of internal accounts and reports. Not affiliated with nor representative of any government registrar, portal, or tax agency.
          </span>
        </div>
      </div>

      {/* HEADER NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo / Brand group */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-150 transition-transform group-hover:scale-105">
              <span className="font-extrabold text-lg tracking-wider">BL</span>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-black text-slate-900 tracking-tight text-lg uppercase">BUSINESS LOGIC</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 font-semibold tracking-tight">Trading style under Kaskazini Consultants</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button onClick={() => scrollToId('services')} className="hover:text-indigo-650 transition cursor-pointer">Our Services</button>
            <button onClick={() => scrollToId('plans')} className="hover:text-indigo-650 transition cursor-pointer">Transparent Plans</button>
            <button onClick={() => scrollToId('contact')} className="hover:text-indigo-650 transition cursor-pointer">Get In Touch</button>
          </div>

          {/* Quick Dial CTA Button */}
          <div>
            <a 
              href={`tel:${targetPhone}`} 
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs px-4.5 py-2.5 rounded-xl transition shadow-xs group cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5 text-indigo-400 group-hover:animate-bounce" />
              <span>CALL {displayPhone}</span>
            </a>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white py-16 sm:py-24 px-4 sm:px-6">
        {/* Subtle decorative grid backing */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy - Left Column */}
          <div className="col-span-1 lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] uppercase">
              Accounting services <br className="hidden sm:inline" />
              for <span className="text-indigo-600">Kenyan growing</span> businesses
            </h1>

            <p className="text-lg sm:text-xl font-extrabold text-indigo-600 tracking-tight font-mono">
              call us now: 0720646916
            </p>

            {/* 4 rectangular icons / service blocks for SEO and quick access */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white border-2 border-slate-200/80 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left shadow-md transition-all duration-200 group">
                <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl mb-3.5 group-hover:bg-indigo-100 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans uppercase">
                  business plans
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">Strategic Modeling</p>
              </div>

              <div className="bg-white border-2 border-slate-200/80 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left shadow-md transition-all duration-200 group">
                <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl mb-3.5 group-hover:bg-indigo-100 transition-colors">
                  <Percent className="h-6 w-6" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans uppercase">
                  taxes
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">Compliance & Filing</p>
              </div>

              <div className="bg-white border-2 border-slate-200/80 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left shadow-md transition-all duration-200 group">
                <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl mb-3.5 group-hover:bg-indigo-100 transition-colors">
                  <Calculator className="h-6 w-6" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans uppercase">
                  accounting
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">Bookkeeping & Audit</p>
              </div>

              <div className="bg-white border-2 border-slate-200/80 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center lg:items-start text-center lg:text-left shadow-md transition-all duration-200 group">
                <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl mb-3.5 group-hover:bg-indigo-100 transition-colors">
                  <FileSignature className="h-6 w-6" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans uppercase">
                  business proposals
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 font-mono uppercase">Funding & Proposals</p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-serif leading-relaxed">
              Focus on scaling your core business while we handle your financial records, payroll summaries, and internal tax readiness schemas.
            </p>

            <div className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed border-l-4 border-indigo-200 pl-4.5 italic text-left">
              Business Logic is a trading style name under Kaskazini Consultants Company. We are a Kenyan-based startup dedicated to providing professional, reliable outsourced accounting and financial management support to micro, small, and medium enterprises.
            </div>

            {/* Flat Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3.5">
              <button 
                onClick={() => scrollToId('services')}
                className="w-full sm:w-auto px-7 py-4 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hero Premium Illustration - Right Column */}
          <div className="col-span-1 lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 to-emerald-500 opacity-20 blur-xl pointer-events-none" />
            
            <div className="relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl p-4">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" 
                alt="Kenyan accounting consultancy workdesk" 
                className="w-full h-64 sm:h-80 object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 mt-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold font-sans text-slate-900 uppercase">Immaculate General Ledger Support</span>
                </div>
                <p className="text-[11px] text-slate-550 leading-relaxed font-serif">
                  All system models and internal balance sheets are structured by certified and accredited Kenyan consulting principals under strict safety standards.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/60" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono font-black uppercase text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">Scope of Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-slate-950 tracking-tight leading-none">
              Our Services
            </h2>
            <p className="text-base text-slate-500 font-serif leading-relaxed">
              We provide professional outsourced corporate record management and stat deductions preparation to shield you from the stress of end-of-quarter workloads.
            </p>
          </div>

          {/* Clean 2x2 Grid of the 4 Key Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Service 1 */}
            <div className="bg-slate-50/70 border border-slate-200/95 hover:border-indigo-300 rounded-2xl p-8 transition shadow-xs group">
              <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold font-sans text-slate-900 uppercase">
                1. Professional Bookkeeping Services
              </h3>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed font-serif">
                Keep your financial records immaculate and up to date. We organize your daily transactions, track your business expenses, manage accounts receivable/payable, and provide clear financial health tracking so you always know where your business stands.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-50/70 border border-slate-200/95 hover:border-indigo-300 rounded-2xl p-8 transition shadow-xs group">
              <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <Percent className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold font-sans text-slate-900 uppercase">
                2. Strategic Tax Preparation Services
              </h3>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed font-serif">
                Avoid the end-of-year rush. We handle the complex internal preparation of your business financial statements, ensuring all your figures are accurately calculated, reconciled, and optimized for compliance before any statutory submission dates.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-50/70 border border-slate-200/95 hover:border-indigo-300 rounded-2xl p-8 transition shadow-xs group">
              <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold font-sans text-slate-900 uppercase">
                3. Comprehensive Payroll Support Services
              </h3>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed font-serif">
                Simplify your monthly payroll management. We process employee salaries, generate accurate pay slips, and calculate internal statutory deductions (including PAYE, SHIF, and NSSF) so your team is paid accurately and on time.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-50/70 border border-slate-200/95 hover:border-indigo-300 rounded-2xl p-8 transition shadow-xs group">
              <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold font-sans text-slate-900 uppercase">
                4. Monthly Return Preparation Services
              </h3>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed font-serif">
                Stay organized month after month. We compile, reconcile, and prepare the necessary monthly internal financial data and summaries required for your business health checks and routine reporting timelines.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-50/70 border border-slate-200/95 hover:border-indigo-300 rounded-2xl p-8 transition shadow-xs group md:col-span-2">
              <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <FileSignature className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold font-sans text-slate-900 uppercase">
                5. Business Plan and Proposal Writing
              </h3>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed font-serif">
                We assist businesses and individuals write their business plans and proposals. Our business plans and proposals are winning documents enabling businesses to attract funding and also guide business owners on their business journey.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PLANS & PAYMENT PRICING DETAILS */}
      <section className="py-20 bg-slate-900 text-white relative" id="plans">
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 font-mono px-3.5 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-bold">
              Predictable Pricing Models
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight leading-none">
              Clear, Transparent Payment Plans
            </h2>
            <p className="text-slate-400 text-sm font-sans max-w-xl mx-auto">
              Choose a predictable monthly plan that perfectly matches your current business size. No hidden fees. Maintain absolute corporate bookkeeping transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BOOKKEEPING_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-slate-950 rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-indigo-500 shadow-xl' 
                    : 'border-slate-800'
                } transition flex flex-col justify-between`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-650 text-white font-mono font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-400">
                    RECOMMENDED MATCH
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                    <div>
                      <h3 className="font-extrabold text-base text-white font-sans uppercase">{plan.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">{plan.cap}</p>
                    </div>
                  </div>

                  <ul className="mt-8 space-y-4 text-xs font-mono text-slate-300">
                    {plan.services.map((service, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span>• {service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-900 space-y-3">
                  <button 
                    onClick={() => scrollToId('contact')}
                    className="w-full py-3 bg-slate-900 hover:bg-indigo-650 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer border border-slate-800"
                  >
                    Select Onboard Partner
                  </button>
                  <p className="text-[11px] text-center font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    call 0720646916 for quote
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Plan interactive comparison helper */}
          <div className="mt-14 bg-slate-950 border border-slate-800 p-6 md:p-8 rounded-2xl max-w-3xl mx-auto space-y-4">
            <h4 className="font-black text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Full Comparison Summary</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-300 font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="py-2">Plan</th>
                    <th className="py-2">Team Size</th>
                    <th className="py-2">Support Included</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  <tr>
                    <td className="py-3 font-bold text-white">Micro Business</td>
                    <td className="py-3">0–3 employees</td>
                    <td className="py-3 text-slate-400">Bookkeeping, Tax Prep, Payroll, Monthly Returns</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Small Business</td>
                    <td className="py-3">3–10 employees</td>
                    <td className="py-3 text-slate-400">Bookkeeping, Tax Prep, Payroll, Monthly Returns</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-white">Growing SME</td>
                    <td className="py-3">More than 10 employees</td>
                    <td className="py-3 text-slate-400">Bookkeeping, Tax Prep, Payroll, Monthly Returns</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* CLEAN GET IN TOUCH CONTACT SECTION */}
      <section className="py-20 bg-gradient-to-b from-indigo-50/30 to-indigo-100/40" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Description - Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-black uppercase text-indigo-700 bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded-full tracking-wider">Get In Touch</span>
              
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-slate-950 tracking-tight leading-tight">
                Ready to Streamline Your Business Finances?
              </h2>

              <p className="text-slate-650 text-sm leading-relaxed font-serif">
                Contact our consulting team today for a smooth onboarding process. We partner with Kenyan businesses to keep bookkeeping current, reconcile statements, and manage employee statutory details correctly.
              </p>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <p className="text-xs font-bold font-sans uppercase text-slate-900 tracking-wider">Consultant Standard Office Hours</p>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500">
                  <div>
                    <span className="font-bold text-slate-800">Monday - Friday:</span>
                    <p>8:00 AM - 5:00 PM</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Saturday:</span>
                    <p>9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Cards - Right Column */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Card 1: Business Details */}
              <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-xs flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0 mt-0.5">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Business Name</span>
                  <h4 className="font-extrabold text-slate-900 text-base mt-0.5">Business Logic</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Operating style under Kaskazini Consultants Company</p>
                </div>
              </div>

              {/* Card 2: Physical Address */}
              <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-xs flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Physical Address</span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-0.5 leading-relaxed">
                    Applehood Building, Adams Arcade, Nairobi, Kenya
                  </h4>
                </div>
              </div>

              {/* Card 3: Direct Phone */}
              <a 
                href={`tel:${targetPhone}`}
                className="bg-white border border-slate-205 hover:border-indigo-400 rounded-2xl p-6 shadow-xs flex items-start gap-4 transition block group"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-650 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Direct Telephone Line</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 group-hover:underline">
                      <span>Click to Call</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-lg sm:text-xl font-mono mt-0.5">
                    {displayPhone}
                  </h4>
                </div>
              </a>

              {/* Card 4: Email Address */}
              <a 
                href={`mailto:${targetEmail}`}
                className="bg-white border border-slate-205 hover:border-indigo-400 rounded-2xl p-6 shadow-xs flex items-start gap-4 transition block group"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">Email Location Link</span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold flex items-center gap-1 group-hover:underline">
                      <span>Send E-Mail</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1 truncate">
                    {targetEmail}
                  </h4>
                </div>
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* DISCLOSURE STATEMENT & FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          


          <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-900 pt-8 gap-4 text-xs font-mono text-slate-500">
            <div>
              <p className="text-slate-300 font-extrabold uppercase">&copy; 2026 BUSINESS LOGIC. All Rights Reserved.</p>
              <p className="mt-1">Operating under ITA Section 15 guidelines. All portal transactions sandbox encrypted.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <span>Headquarters: Adams Arcade, Nairobi, Kenya</span>
              <a href={`tel:${targetPhone}`} className="text-indigo-400 font-black hover:underline">Dial: {displayPhone}</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
