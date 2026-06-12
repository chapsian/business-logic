import React, { useState, useEffect } from 'react';
import { 
  Calculator, Check, Calendar, Shield, Briefcase, User as UserIcon, MapPin, Mail, Phone, Lock, 
  Plus, Search, Menu, X, ChevronRight, Info, BarChart2, CreditCard, ArrowRight, 
  Clock, ShieldCheck, Activity, FileText, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { User, Booking } from './types';
import { KENYAN_TAX_DEADLINES, CONSULTATION_SLOTS, REGISTRATION_PRICING, BOOKKEEPING_PLANS, COMPLIANCE_QUESTIONS } from './data/mockData';
import AiTaxAssistant from './components/AiTaxAssistant';
import DocumentAnalyzer from './components/DocumentAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'portal'>('home');
  const [portalTab, setPortalTab] = useState<'overview' | 'assistant' | 'analyzer' | 'calculator' | 'health' | 'deadlines' | 'booking' | 'upgrade'>('overview');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bl_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authEmployees, setAuthEmployees] = useState(2);
  const [authPassword, setAuthPassword] = useState('');

  // Interactive booking state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bl_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-06-15');
  const [bookingInterest, setBookingInterest] = useState('Bookkeeping Audit');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // KRA Calculator states
  const [calcGross, setCalcGross] = useState<number>(65000);
  const [calcNssfType, setCalcNssfType] = useState<'new' | 'none'>('new');
  const [calcHousing, setCalcHousing] = useState<boolean>(true);

  // Registration Calculator state
  const [regSelection, setRegSelection] = useState<string>('Private Limited Company Incorporation');
  const [regFormName, setRegFormName] = useState('');
  const [regFormPhone, setRegFormPhone] = useState('');
  const [regFormSuccess, setRegFormSuccess] = useState(false);

  // Compliance Check state
  const [compAnswers, setCompAnswers] = useState<Record<string, number>>({});
  const [compCompleted, setCompCompleted] = useState<boolean>(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Mobile Menu toggles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Premium upgrade Modal/Overlay
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaPending, setMpesaPending] = useState(false);
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Persist user and bookings
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bl_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bl_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bl_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authName) return;
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: authName,
      email: authEmail,
      companyName: authCompany || `${authName} Trading`,
      employeeCount: authEmployees,
      isPremium: false,
      registrationStatus: {
        businessName: false,
        incorporation: false,
        kraPin: false,
        taxCompliance: false,
        statutoryReg: false,
        businessPermit: false
      }
    };
    setCurrentUser(newUser);
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const existingUser: User = {
      id: 'usr-ex',
      name: authEmail.split('@')[0].toUpperCase(),
      email: authEmail,
      companyName: "Kenya Trade Ltd",
      employeeCount: 4,
      isPremium: false,
      registrationStatus: {
        businessName: true,
        incorporation: true,
        kraPin: true,
        taxCompliance: false,
        statutoryReg: true,
        businessPermit: false
      }
    };
    setCurrentUser(existingUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPortalTab('overview');
    setActiveTab('home');
  };

  const handleScrollToPortal = (mode?: 'signin' | 'signup') => {
    if (mode) {
      setAuthMode(mode);
    }
    setMobileMenuOpen(false);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('ai-portal-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !currentUser) return;
    const slot = CONSULTATION_SLOTS.find(s => s.id === selectedSlot);
    if (!slot) return;

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      slotId: selectedSlot,
      date: bookingDate,
      time: slot.time,
      advisor: slot.advisor,
      service: bookingInterest,
      status: 'confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedSlot(null);
    }, 4000);
  };

  const handleUpgradeAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setMpesaPending(true);

    // Mock processing payment
    setTimeout(() => {
      setMpesaPending(false);
      setUpgradeOpen(false);
      const updated = { ...currentUser, isPremium: true };
      setCurrentUser(updated);
    }, 2800);
  };

  // KRA Payroll calculations helper
  const computeKenyanTaxes = (gross: number) => {
    // 1. NSSF: New Rates Act 2013: Tier I is 6% of lower limit (7000) = 420. Tier II is 6% of upper limit up to 36000 (36000-7000 = 29000) * 6% = 1740. Total Max KSh 2,160.
    let nssf = 0;
    if (calcNssfType === 'new') {
      if (gross <= 7000) {
        nssf = gross * 0.06;
      } else if (gross <= 36000) {
        nssf = 420 + (gross - 7000) * 0.06;
      } else {
        nssf = 2160;
      }
    }

    // 2. Affordable Housing Levy: 1.5% of gross
    const housingLevy = calcHousing ? gross * 0.015 : 0;

    // 3. SHA: 2.75% of Gross
    const sha = gross * 0.0275;

    // 4. Taxable pay (NSSF contribution is tax exempt in Kenya)
    const taxablePay = Math.max(0, gross - nssf);

    // 5. PAYE tax calculations (KRA bands for 2026)
    let grossPaye = 0;
    let remains = taxablePay;

    // Band 1: First 24,000 taxed at 10%
    if (remains > 24000) {
      grossPaye += 24000 * 0.10;
      remains -= 24000;
    } else {
      grossPaye += remains * 0.10;
      remains = 0;
    }

    // Band 2: Next 8,333 taxed at 25%
    if (remains > 8333) {
      grossPaye += 8333 * 0.25;
      remains -= 8333;
    } else {
      grossPaye += remains * 0.25;
      remains = 0;
    }

    // Band 3: Next 467,667 taxed at 30%
    if (remains > 467667) {
      grossPaye += 467667 * 0.30;
      remains -= 467667;
    } else {
      grossPaye += remains * 0.30;
      remains = 0;
    }

    // Band 4: Next 300,000 taxed at 32.5%
    if (remains > 300000) {
      grossPaye += 300000 * 0.325;
      remains -= 300000;
    } else {
      grossPaye += remains * 0.325;
      remains = 0;
    }

    // Band 5: Above 800,000 taxed at 35%
    if (remains > 0) {
      grossPaye += remains * 0.35;
    }

    // Personal relief in Kenya: KSh 2,400 monthly
    const personalRelief = 2400;

    // Insurance relief: 15% of NHIF/SHA
    const insuranceRelief = sha * 0.15;

    const netPaye = Math.max(0, grossPaye - personalRelief - insuranceRelief);
    const netSalary = gross - nssf - housingLevy - sha - netPaye;

    return {
      nssf,
      housingLevy,
      sha,
      taxablePay,
      grossPaye,
      personalRelief,
      insuranceRelief,
      netPaye,
      netSalary
    };
  };

  const currentTaxes = computeKenyanTaxes(calcGross);

  // Compute stats on compliance survey
  const getComplianceScore = () => {
    let score = 0;
    let totalQuestions = COMPLIANCE_QUESTIONS.length;
    let questionsChecked = 0;

    COMPLIANCE_QUESTIONS.forEach(q => {
      const selectedPoints = compAnswers[q.id];
      if (selectedPoints !== undefined) {
        score += selectedPoints;
        questionsChecked++;
      }
    });

    if (questionsChecked === 0) return 0;
    return Math.floor((score / (totalQuestions * 25)) * 100);
  };

  const compliancePercentage = getComplianceScore();

  const handleRegFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFormName || !regFormPhone) return;
    setRegFormSuccess(true);
    setTimeout(() => {
      setRegFormSuccess(false);
      setRegFormName('');
      setRegFormPhone('');
    }, 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  const currentRegPricing = REGISTRATION_PRICING.find(r => r.service === regSelection) || REGISTRATION_PRICING[2];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="applet-viewport-root">
      
      {/* Upper info rail as requested by write up */}
      <div className="bg-indigo-950 text-indigo-200 text-xs py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-indigo-900 font-mono">
        <div className="flex items-center space-x-2">
          <span>📍 Adams Arcade, Adams Arcade Building, 10th Floor, Nairobi, Kenya</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:0720646916" className="hover:text-white flex items-center font-bold">
            <Phone className="h-3.5 w-3.5 mr-1" /> Call: 0720646916
          </a>
          <a href="tel:0720646916" className="hover:text-white flex items-center font-bold text-teal-300">
            💬 WhatsApp: 0720646916
          </a>
          <span className="text-slate-400">|</span>
          <span className="text-indigo-300 font-semibold truncate">Email: noble.consultants@yahoo.com</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleScrollToPortal()}>
            <div className="h-11 w-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <span className="font-black text-xl font-mono tracking-tighter">BL</span>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight text-lg uppercase leading-none font-sans">Business logic</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">Nairobi Corporate Consultants</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-slate-600 hover:text-indigo-600 transition">About</button>
            <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('bookkeeping-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-slate-600 hover:text-indigo-600 transition">Bookkeeping</button>
            <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('pricing-plans-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-slate-600 hover:text-indigo-600 transition">Plans</button>
            <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('company-registration-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-slate-600 hover:text-indigo-600 transition">Registrations</button>
            <button onClick={() => { handleScrollToPortal(); }} className="text-indigo-600 font-bold hover:text-indigo-700 transition flex items-center"><Sparkles className="h-3.5 w-3.5 mr-1" /> AI Portal</button>
            <button onClick={() => { setActiveTab('home'); setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-slate-600 hover:text-indigo-600 transition">Contact</button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-100 p-1 rounded-full pl-3 pr-2 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 font-mono">Hi, {currentUser.name.substring(0,12)}</span>
                <button
                  onClick={() => { handleScrollToPortal(); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-full transition shadow-md cursor-pointer"
                >
                  My Portal
                </button>
                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 font-bold px-2">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { handleScrollToPortal('signin'); }}
                  className="text-slate-700 hover:text-indigo-600 text-xs font-bold py-2 px-4 transition font-mono border border-slate-300 rounded-full hover:border-indigo-400"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { handleScrollToPortal('signup'); }}
                  className="bg-indigo-600 hover:bg-orange-555 text-white text-xs font-bold py-2 px-5 rounded-full hover:bg-indigo-700 transition shadow-md shadow-indigo-100 flex items-center"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Client Portal &middot; AI
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 font-semibold text-sm">
          <button onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); setTimeout(() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block w-full text-left py-2 text-slate-600 border-b border-slate-100">About Us</button>
          <button onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); setTimeout(() => document.getElementById('bookkeeping-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block w-full text-left py-2 text-slate-600 border-b border-slate-100">Bookkeeping Services</button>
          <button onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); setTimeout(() => document.getElementById('pricing-plans-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block w-full text-left py-2 text-slate-600 border-b border-slate-100">Bookkeeping Plans</button>
          <button onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); setTimeout(() => document.getElementById('company-registration-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block w-full text-left py-2 text-slate-600 border-b border-slate-100">Company Registration</button>
          <button onClick={() => { setMobileMenuOpen(false); handleScrollToPortal(); }} className="block w-full text-left py-2 text-indigo-600 border-b border-slate-100 flex items-center"><Sparkles className="h-3.5 w-3.5 mr-1.5 inline" /> AI Client Portal</button>
          <button onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block w-full text-left py-2 text-slate-600">Contact Us</button>
          
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {currentUser ? (
              <>
                <p className="text-xs text-slate-500 p-2 font-mono">Hi, {currentUser.name}</p>
                <button onClick={() => { handleScrollToPortal(); }} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl text-center">My AI Client Portal</button>
                <button onClick={handleLogout} className="text-xs text-red-500 font-bold py-2 text-center">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => { handleScrollToPortal('signin'); }} className="border border-slate-300 font-bold py-2 px-4 rounded-xl text-center">Sign In</button>
                <button onClick={() => { handleScrollToPortal('signup'); }} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl text-center flex items-center justify-center"><Sparkles className="h-3.5 w-3.5 mr-1" /> Open AI Portal</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* RENDER VIEW: LANDING HOME PAGE */}
      {activeTab === 'home' && (
        <main>
          
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-16 md:py-24 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center">
                
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-xs text-indigo-700 font-bold font-sans">
                  <Sparkles className="h-3.5 w-3.5 animate-bounce" />
                  <span>Kenya's First AI-Enabled Consultancy Specialist</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
                  Outsourced Bookkeeping & <span className="text-indigo-600">Company Registrations</span> in Kenya
                </h2>
                
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-serif">
                  Accurate, compliant, and scale-ready corporate compliance. At <strong>Business logic</strong>, we combine top-tier CPA(K) tax professionals with secure AI-enabled tools to power your business growth. Keep your KRA PIN state immaculate without the executive payroll cost.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
                  <button
                    onClick={() => handleScrollToPortal()}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-slate-900 text-white font-sans font-bold text-sm px-8 py-4 rounded-2xl shadow-lg transition duration-200 transform hover:-translate-y-0.5"
                  >
                    Access AI Client Portal
                  </button>
                  <a
                    href="https://wa.me/254720646916?text=Hello%20Business%20Logic,%20I%20am%20interested%20in%20your%2520bookkeeping%20and%2520company%20registration%2520services."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto text-slate-700 hover:text-emerald-600 border border-slate-350 hover:border-emerald-500 bg-white font-sans font-bold text-sm px-8 py-4 rounded-2xl transition duration-200 text-center flex items-center justify-center"
                  >
                    💬 Active WhatsApp: 0720646916
                  </a>
                </div>

                {/* Bullet badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-200/60 text-xs font-mono font-bold text-slate-500 w-full">
                  <span className="flex items-center"><Check className="text-indigo-500 h-4 w-4 mr-1" /> Approved KRA Tax Filers</span>
                  <span className="flex items-center"><Check className="text-indigo-500 h-4 w-4 mr-1" /> Automated OCR Bookkeeper</span>
                  <span className="flex items-center"><Check className="text-indigo-500 h-4 w-4 mr-1" /> Quick iTax Turnarounds</span>
                </div>
              </div>
            </div>
          </section>

          {/* About us section */}
          <section id="about-section" className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <span className="text-xs uppercase font-mono font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-650 px-3.5 py-1.5 rounded-full inline-block">WHO WE ARE</span>
                <h3 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">Business Logic: Leading Corporate Consultants in Nairobi</h3>
                <p className="text-slate-650 text-base leading-relaxed font-serif">
                  Business logic is a business consultancy company based in Nairobi, Kenya. We specialize in outsourced bookkeeping services and outsourced company registration services. We are also one of a kind business consultancy company to have AI-enabled features in our service offering.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto font-sans">
                  Whether you are behaving as an informal trader looking to convert to a Private Limited Company or an established enterprise seeking robust weekly general ledger reconciliation, statutory compliance reviews, or PAYE/NSSF management, we have tailored workflows designed to streamline operations seamlessly.
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="font-sans font-black text-3xl text-indigo-600">0720646916</p>
                  <p className="text-xs text-slate-500 font-mono tracking-wider font-bold mt-1 uppercase">Instant Phone Line</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="font-sans font-black text-3xl text-indigo-600">eCitizen & KRA</p>
                  <p className="text-xs text-slate-500 font-mono tracking-wider font-bold mt-1 uppercase">Authorized Portals</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="font-sans font-black text-3xl text-indigo-600">KSh 10,000</p>
                  <p className="text-xs text-slate-500 font-mono tracking-wider font-bold mt-1 uppercase">AI Premium Rate</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="font-sans font-black text-3xl text-indigo-600">100% Secure</p>
                  <p className="text-xs text-slate-500 font-mono tracking-wider font-bold mt-1 uppercase">Data Sandbox Safety</p>
                </div>
              </div>
            </div>
          </section>

          {/* Bookkeeping Section */}
          <section id="bookkeeping-section" className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
                <span className="text-xs uppercase font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-650 px-3 py-1 rounded-full font-mono">Statutory Dues</span>
                <h3 className="text-3xl font-black text-slate-900 font-sans tracking-tight">OUTSOURCED BOOKKEEPING SERVICES IN KENYA</h3>
                <p className="text-slate-650 text-sm">We provide meticulous monthly bookkeeping and comprehensive statutory filing support to secure compliant status.</p>
              </div>

              {/* services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Bookkeeping */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit font-bold">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-4 text-lg">Bookkeeping Services</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Accuracy and organization. We record and reconcile all transactions, maintain cash books, track payroll parameters and accounts receivable, and generate key Profit & Loss, Balance Sheets, and Cash Flow returns.
                  </p>
                  <ul className="text-[11px] font-mono text-indigo-600 mt-3 space-y-1">
                    <li>&middot; Profit & Loss Account</li>
                    <li>&middot; Trial Balances & bank reconciliation</li>
                  </ul>
                </div>

                {/* 2. Tax Filing */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit font-bold">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-4 text-lg">Tax Filing Services</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    VAT returns compliance on iTax. We oversee Turnover Tax (TOT), VAT declarations, corporate annual income statements, and guide KRA audits to shelter you from penalties.
                  </p>
                  <ul className="text-[11px] font-mono text-emerald-650 mt-3 space-y-1">
                    <li>&middot; VAT Computations & Filing</li>
                    <li>&middot; Turnover Tax & Corporation returns</li>
                  </ul>
                </div>

                {/* 3. Payroll Support */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-amber-50 text-amber-650 rounded-xl w-fit font-bold">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-4 text-lg">Payroll Support Services</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Prepare exact payslips, manage statutory deductions for SHA (Social Health Authority), NSSF, Housing Levy (1.5%), and PAYE return bands matching the KRA Employment Act requirements.
                  </p>
                  <ul className="text-[11px] font-mono text-amber-650 mt-3 space-y-1">
                    <li>&middot; Payslip generation & Registers</li>
                    <li>&middot; SHA (2.75%), NSSF & Housing Levy schedules</li>
                  </ul>
                </div>

                {/* 4. Monthly Returns */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-teal-50 text-teal-650 rounded-xl w-fit font-bold">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-4 text-lg">Monthly Returns Services</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    We manage and submit all applicable monthly statutory returns on behalf of your business by the 9th and 20th deadlines without fail.
                  </p>
                  <ul className="text-[11px] font-mono text-teal-650 mt-3 space-y-1">
                    <li>&middot; SHA & NSSF submittals</li>
                    <li>&middot; VAT, PAYE & Housing Levy filings</li>
                  </ul>
                </div>

                {/* 5. Annual Returns */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-purple-50 text-purple-650 rounded-xl w-fit font-bold">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-4 text-lg">Annual Returns Services</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Maintain legal standing with the Business Registries (BRS) portal. We file annual company summaries, update director particulars, and reconcile structural registries.
                  </p>
                  <ul className="text-[11px] font-mono text-purple-650 mt-3 space-y-1">
                    <li>&middot; BRS BRS-1 Return Files</li>
                    <li>&middot; Legal status configurations</li>
                  </ul>
                </div>

                {/* Contact Consultation Promo */}
                <div className="bg-indigo-950 p-6 rounded-2xl text-white flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-teal-300 font-mono font-bold">OUTSOURCED COMPLIANCE</span>
                    <h4 className="font-bold text-lg mt-2">Need active audit support from a KRA expert?</h4>
                    <p className="text-xs text-slate-300 mt-1">Our certified specialists are live. Call Gladys Wanjiku or David Omondi directly.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-800">
                    <p className="text-sm font-bold font-mono text-teal-300">📞 Call: 0720646916</p>
                    <p className="text-[10px] text-indigo-300">Office: Applehood Building, Adams Arcade</p>
                  </div>
                </div>

              </div>

              {/* Key Deliverables Summary Table */}
              <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden" id="deliverables-table">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 text-base">Key Deliverables Summary</h4>
                  <p className="text-xs text-slate-500">Official checklists dispatched on your business behalf upon consultancy sign-off.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-mono font-bold border-b border-slate-100">
                        <th className="p-3">Service Tier</th>
                        <th className="p-3">Key Deliverables Document Schema</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-705">
                      <tr>
                        <td className="p-3 font-semibold text-indigo-600">Bookkeeping</td>
                        <td className="p-3">Profit & Loss Account, Balance Sheet, Cash Flow Statement, Trial Balance, Bank Reconciliations, Accounts Receivable & Payable Reports</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-indigo-600">Tax Filing</td>
                        <td className="p-3">VAT Returns, Corporation Tax Returns, Turnover Tax Returns, Tax Computations, KRA Filing Confirmations</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-indigo-600">Payroll Support</td>
                        <td className="p-3">Payroll Register, Employee Payslips, PAYE Schedules, SHA Schedules, NSSF Schedules, Housing Levy Schedules</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-indigo-600">Monthly Returns</td>
                        <td className="p-3">PAYE Returns, VAT Returns, SHA Returns, NSSF Returns, Housing Levy Returns, Filing Confirmations</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-indigo-600">Annual Returns</td>
                        <td className="p-3">Annual Return Filings, Compliance Reports, Updated Company Records, Filing Confirmations, Regulatory Compliance Support</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>

          {/* Pricing Plans section */}
          <section id="pricing-plans-section" className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
                <span className="text-xs font-mono font-bold bg-indigo-50 border border-indigo-150 px-3.5 py-1 text-indigo-600 rounded-full">MONTHLY BOOKKEEPING</span>
                <h3 className="text-3xl font-black text-slate-900 uppercase">PAYMENT PLANS</h3>
                <p className="text-slate-550 text-xs">No hidden commissions. Fair billing structured around active headcounts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {BOOKKEEPING_PLANS.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`rounded-2xl p-6 border transition flex flex-col justify-between relative ${
                      plan.popular 
                        ? 'border-indigo-600 bg-indigo-50/15 shadow-md ring-1 ring-indigo-500' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Popular choice
                      </span>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-905 text-lg text-slate-800">{plan.title}</h4>
                      <p className="text-xs text-slate-550 font-mono mt-1 font-semibold">{plan.cap}</p>
                      
                      <div className="mt-4 pb-4 border-b border-slate-100">
                        <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-400 font-mono">/month</span>
                      </div>

                      <ul className="mt-5 space-y-2 text-xs">
                        {plan.services.map((s, i) => (
                          <li key={i} className="flex items-center space-x-2 text-slate-650">
                            <Check className="h-4 w-4 text-emerald-500 font-bold shrink-0" />
                            <span>{s} Services included</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-4">
                      <button
                        onClick={() => {
                          setAuthEmployees(plan.id === 'micro' ? 1 : plan.id === 'small' ? 5 : 12);
                          handleScrollToPortal('signup');
                        }}
                        className={`w-full py-3 rounded-xl font-sans font-bold text-xs transition cursor-pointer text-center ${
                          plan.popular 
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        Enroll Company Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Company Registration Section */}
          <section id="company-registration-section" className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
                <span className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-650 px-3 py-1 rounded-full font-mono font-bold uppercase">BRS eCitizen Frameworks</span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">OUTSOURCED COMPANY REGISTRATION SERVICES</h3>
                <p className="text-slate-600 text-xs text-center">Consult directly with us to initiate corporate registrations in Nairobi. We track approvals step-by-step.</p>
              </div>

              {/* Grid outline of categories */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { title: "Business Name Registration", desc: "For Sole Proprietors" },
                  { title: "Company Incorporation", desc: "Private Limited entities" },
                  { title: "KRA PIN Registration", desc: "Tax activation setup" },
                  { title: "Tax Compliance", desc: "First active TCC dossier" },
                  { title: "NSSF/SHA Registry", desc: "Payroll statutory ports" },
                  { title: "Business Permit", desc: "County trading permits" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-250/70 text-center flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs text-indigo-500 font-extrabold block">0{idx+1}</span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1.5 leading-tight">{item.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Table pricing breakdown */}
              <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 text-base mb-1">Official BRS Pricing Structure</h4>
                <p className="text-xs text-slate-500 mb-4">Total fees breakdown as configured across government agencies and handling tariffs.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-mono font-bold border-b border-slate-100">
                        <th className="p-3">Company Type Category</th>
                        <th className="p-3">Govt Statutory Tariffs</th>
                        <th className="p-3">Our Consultancy Fee</th>
                        <th className="p-3 text-indigo-600">Client Outstanding Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold">Business Name Registration</td>
                        <td className="p-3 font-mono">KSh 950</td>
                        <td className="p-3 font-mono">KSh 2,000</td>
                        <td className="p-3 font-mono font-bold text-indigo-650">KSh 2,950</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Partnership Registration</td>
                        <td className="p-3 font-mono">KSh 950</td>
                        <td className="p-3 font-mono font-bold">KSh 3,000</td>
                        <td className="p-3 font-mono font-bold text-indigo-650">KSh 3,950</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Private Limited Company Incorporation</td>
                        <td className="p-3 font-mono">KSh 10,650</td>
                        <td className="p-3 font-mono">KSh 15,000</td>
                        <td className="p-3 font-mono font-bold text-indigo-650">KSh 25,650</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">LLP Registration (Limited Liability Partnership)</td>
                        <td className="p-3 font-mono">KSh 25,000</td>
                        <td className="p-3 font-mono">KSh 17,000</td>
                        <td className="p-3 font-mono font-bold text-indigo-650">KSh 42,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>

          {/* RENDER VIEW: CLIENT PORTAL (A.I ENABLED) */}
          <section id="ai-portal-section" className="bg-slate-900 text-slate-100 min-h-[700px] border-t border-b border-slate-800 scroll-mt-20">
          
          {/* Authentic Sign In / Signup Simulator if no user is signed in */}
          {!currentUser ? (
            <div className="max-w-md mx-auto py-16 px-4">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-indigo-500 opacity-20">
                  <Lock className="h-16 w-16" />
                </div>
                
                <div className="text-center space-y-2 mb-6">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto text-white">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <h3 className="text-white font-extrabold text-xl tracking-tight">BUSINESS LOGIC CLIENTS PORTAL</h3>
                  <p className="text-xs text-slate-400">Unlock compliance audit trails, KRA trackers, and interactive AI document parsers.</p>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 mb-6">
                  <button
                    onClick={() => setAuthMode('signin')}
                    className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
                      authMode === 'signin' ? 'bg-indigo-605 bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={() => setAuthMode('signup')}
                    className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
                      authMode === 'signup' ? 'bg-indigo-605 bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SIGN UP
                  </button>
                </div>

                {authMode === 'signup' ? (
                  <form onSubmit={handleSignup} className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Full Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Mukuhi"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-3 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Email Address:</label>
                      <input
                        type="email"
                        required
                        placeholder="jane@mycompany.co.ke"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-3 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Company Corporate Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. Mukuhi Logistics Ltd"
                        value={authCompany}
                        onChange={(e) => setAuthCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-3 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Number of Employees ({authEmployees}):</label>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={authEmployees}
                        onChange={(e) => setAuthEmployees(parseInt(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <div className="flex justify-between font-mono text-[9px] text-slate-500 font-bold">
                        <span>0 Employees (Micro)</span>
                        <span>25+ Employees (SME)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-605 bg-indigo-600 hover:bg-indigo-550 text-white font-sans font-bold py-3 px-5 rounded-xl transition shadow-lg mt-4 cursor-pointer text-center block"
                    >
                      Authenticate Account &rarr;
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignin} className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Email Address / PIN ID:</label>
                      <input
                        type="email"
                        required
                        placeholder="registered@company.co.ke"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-slate-400 uppercase tracking-wide">Account Password:</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 placeholder-slate-600 focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-606 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold py-3 rounded-xl transition shadow-lg mt-4"
                    >
                      Process Identity Verification
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-500 font-mono mt-4">
                      🔒 Demo bypass: any values verified immediately on sign in.
                    </p>
                  </form>
                )}
              </div>
            </div>
          ) : (
            
            // Client Logged-In Portal UI
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Premium Promo Warning Strip */}
              {!currentUser.isPremium && (
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/10 border border-amber-500/30 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="p-2 bg-amber-500 text-slate-950 rounded-lg shrink-0">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-extrabold text-amber-300 font-sans">AI Portal Free Trial Status &middot; Limit Active</p>
                      <p className="text-xs text-slate-350">To access unlimited OCR uploads and consultations, upgrade to the <strong>Premium Plan (charged at KSh 10,000 monthly)</strong>.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUpgradeOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-mono font-black text-xs px-5 py-2.5 rounded-xl transition shrink-0 shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    UPGRADE TO PREMIUM
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left hand Sidebar navigation for portal */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    <div>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full font-bold">VERIFIED USER ACCOUNT</span>
                      <h4 className="font-bold text-slate-200 mt-2 text-sm max-w-[200px] truncate">{currentUser.name}</h4>
                      <p className="text-[11px] text-indigo-400 font-mono italic font-semibold">{currentUser.companyName}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-850 text-xs font-mono space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span>Active Tier:</span>
                        <span className="font-bold text-indigo-400">{currentUser.employeeCount <= 3 ? 'Micro Business' : currentUser.employeeCount <= 10 ? 'Small Business' : 'Growing SME'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Plan:</span>
                        <span className={`font-bold uppercase ${currentUser.isPremium ? 'text-emerald-400':'text-amber-400'}`}>
                          {currentUser.isPremium ? '💎 Premium' : '📁 Free Preview'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nav list options */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden p-2">
                    {[
                      { id: 'overview', title: 'Dashboard Overview', icon: BarChart2 },
                      { id: 'assistant', title: 'AI Tax Assistant', icon: Sparkles, badge: 'AI' },
                      { id: 'analyzer', title: 'Bookkeeping OCR Analyzer', icon: FileText, badge: 'AI' },
                      { id: 'calculator', title: 'Payroll TAX Calculator', icon: Calculator },
                      { id: 'health', title: 'Compliance Checkup', icon: Activity },
                      { id: 'deadlines', title: 'KRA Statutory Deadlines', icon: Calendar },
                      { id: 'booking', title: 'Consultation Planner', icon: Phone },
                      { id: 'upgrade', title: 'Plan & Billing Control', icon: CreditCard }
                    ].map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setPortalTab(item.id as any)}
                          className={`w-full text-left text-xs font-mono font-bold p-3 rounded-xl transition flex items-center justify-between cursor-pointer ${
                            portalTab === item.id 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <span className="flex items-center">
                            <IconComp className="h-4 w-4 mr-3" />
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] bg-cyan-400/10 text-cyan-450 border border-cyan-400/20 px-1.5 py-0.5 rounded font-black font-mono">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="w-full bg-slate-950/45 hover:bg-slate-950 border border-slate-800 hover:border-red-900 text-xs text-red-400 font-mono font-bold py-3 rounded-xl transition"
                  >
                    Leave Clients Portal &rarr;
                  </button>
                </div>

                {/* Right hand Workspace view content */}
                <div className="lg:col-span-9 space-y-6">
                  
                  {/* TAB 1: OVERVIEW */}
                  {portalTab === 'overview' && (
                    <div className="space-y-6">
                      
                      {/* Grid metrics widgets */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        
                        <div className="bg-slate-950 border border-slate-805 rounded-2xl p-5 text-left relative overflow-hidden">
                          <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Compliance Index</p>
                          <div className="flex items-baseline mt-2 space-x-2">
                            <p className="text-3xl font-black font-mono text-indigo-400">{compliancePercentage}%</p>
                            <span className="text-xs text-slate-500">score</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 font-serif">Run compliance health audit in helper tabs to compute accurate scores.</p>
                        </div>

                        <div className="bg-slate-950 border border-slate-805 rounded-2xl p-5 text-left relative overflow-hidden">
                          <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Impending Deadline</p>
                          <div className="flex items-baseline mt-2 space-x-2">
                            <p className="text-3xl font-black font-sans text-amber-500">July 9th</p>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 font-sans font-medium">PAYE, SHA, and NSSF submissions countdown is active.</p>
                        </div>

                        <div className="bg-slate-950 border border-slate-805 rounded-2xl p-5 text-left relative overflow-hidden">
                          <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wide">Booked consultations</p>
                          <div className="flex items-baseline mt-2 space-x-2">
                            <p className="text-3xl font-black font-mono text-teal-400">{bookings.length}</p>
                            <span className="text-xs text-slate-500">active</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 font-sans">Speak to our CPA(K) consultants for audits and returns verification.</p>
                        </div>

                      </div>

                      {/* Step-by-step registration status tracker */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-850">
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-200">Company Registration Milestones Roadmap</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Status of eCitizen government accounts and county licensing approvals.</p>
                          </div>
                          <span className="text-[11px] bg-slate-900 border border-slate-800 text-indigo-400 font-mono px-3 py-1 rounded-full font-bold">ECITIZEN STATUS</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-6 text-center text-xs">
                          {[
                            { tag: 'businessName', label: 'Business Name', status: currentUser.registrationStatus.businessName },
                            { tag: 'incorporation', label: 'LLP / Limited Co', status: currentUser.registrationStatus.incorporation },
                            { tag: 'kraPin', label: 'KRA PIN Setup', status: currentUser.registrationStatus.kraPin },
                            { tag: 'taxCompliance', label: 'Tax Compliance', status: currentUser.registrationStatus.taxCompliance },
                            { tag: 'statutoryReg', label: 'NSSF/SHA Setup', status: currentUser.registrationStatus.statutoryReg },
                            { tag: 'businessPermit', label: 'Business Permit', status: currentUser.registrationStatus.businessPermit }
                          ].map((milestone, i) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                // Toggle milestone dynamically for trial demo
                                const updatedStatus = { ...currentUser.registrationStatus, [milestone.tag]: !milestone.status };
                                setCurrentUser({ ...currentUser, registrationStatus: updatedStatus });
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition ${
                                milestone.status 
                                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-200' 
                                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                              <CheckCircle2 className={`h-4 w-4 mx-auto mb-2 ${milestone.status ? 'text-emerald-400 animate-pulse' : 'text-slate-700'}`} />
                              <p className="font-bold text-[10px] tracking-tight">{milestone.label}</p>
                              <span className="text-[9px] font-mono block mt-1">
                                {milestone.status ? 'Approved✔️' : 'Unregistered'}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-slate-650 mt-4 text-center italic font-mono">
                          👉 Tip: Click any milestone item above to toggle the approved status and test mock database changes.
                        </p>
                      </div>

                      {/* Welcome message and CTA */}
                      <div className="p-6 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl flex items-start space-x-4">
                        <div className="p-3 bg-indigo-900/40 text-indigo-400 rounded-xl">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-200">How to use your Business Logic AI Portal:</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-serif">
                            1. Consult with the <strong>AI Tax Assistant</strong> to answer queries on payroll bands or statutory deadlines.<br />
                            2. Drop receipts or utility invoices inside the <strong>OCR Analyzer</strong> to draw tax-wise ledger claims.<br />
                            3. Select the <strong>Payroll Calculator</strong> to computes PAYE tax and Affordable Housing levies matching new Kenyan 2026 systems.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: AI ASSISTANT CHAT */}
                  {portalTab === 'assistant' && (
                    <AiTaxAssistant user={currentUser} onUpgrade={() => setUpgradeOpen(true)} />
                  )}

                  {/* TAB 3: DOCUMENT OCR ANALYZER */}
                  {portalTab === 'analyzer' && (
                    <DocumentAnalyzer user={currentUser} onUpgrade={() => setUpgradeOpen(true)} />
                  )}

                  {/* TAB 4: KRA PAYROLL CALCULATOR */}
                  {portalTab === 'calculator' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                      
                      <div>
                        <h4 className="font-extrabold text-slate-200 text-base">Kenyan Payroll statutory PAYE & Levy Calculator</h4>
                        <p className="text-slate-450 text-xs mt-1">Compute custom tax and employee deductions conforming to official KRA bands.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        
                        {/* INPUTS column */}
                        <div className="md:col-span-5 bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-4 text-xs font-sans">
                          
                          <div className="space-y-1">
                            <label className="block text-slate-400 font-mono font-bold uppercase">Basic Gross Salary (KSh):</label>
                            <input
                              type="number"
                              value={calcGross}
                              onChange={(e) => setCalcGross(Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 text-slate-200 text-sm font-bold font-mono rounded-xl focus:border-indigo-500"
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                              {[35000, 50000, 75000, 120000].map((val) => (
                                <button
                                  key={val}
                                  onClick={() => setCalcGross(val)}
                                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded text-[10px] font-mono border border-slate-805"
                                >
                                  KSh {val.toLocaleString()}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-400 font-mono font-bold uppercase">NSSF Contribution Model:</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setCalcNssfType('new')}
                                className={`py-2 px-3 text-center rounded-lg border font-mono font-bold ${
                                  calcNssfType === 'new' ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                v2013 Tier I/II
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalcNssfType('none')}
                                className={`py-2 px-3 text-center rounded-lg border font-mono font-bold ${
                                  calcNssfType === 'none' ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                No NSSF (Solo)
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-2 border-t border-slate-850 mt-4">
                            <div className="font-sans">
                              <p className="font-bold text-slate-300">Affordable Housing Levy</p>
                              <p className="text-[10px] text-slate-500">1.5% Gross deduction</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={calcHousing}
                              onChange={(e) => setCalcHousing(e.target.checked)}
                              className="h-5 w-5 accent-indigo-500 rounded"
                            />
                          </div>

                        </div>

                        {/* OUTSTANDING PAY SHEET DOCKET */}
                        <div className="md:col-span-7 bg-slate-900/60 border border-slate-850 p-5 rounded-xl space-y-4">
                          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold">KRA PAYSLIP SUMMARY</span>
                          
                          <div className="space-y-2 font-mono text-xs text-slate-300">
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                              <span>Basic Gross Salary:</span>
                              <span className="font-bold text-right text-white">KSh {calcGross.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 text-red-400">
                              <span>NSSF Pension (Exempt):</span>
                              <span>- KSh {currentTaxes.nssf.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                              <span>KRA Taxable Income:</span>
                              <span className="text-slate-205 text-white">KSh {currentTaxes.taxablePay.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 text-red-400">
                              <span>Net PAYE Deduction:</span>
                              <span>- KSh {currentTaxes.netPaye.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 text-red-500">
                              <span>Social Health Port (SHA):</span>
                              <span>- KSh {currentTaxes.sha.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-slate-850 text-red-500">
                              <span>Affordable Housing Levy:</span>
                              <span>- KSh {currentTaxes.housingLevy.toLocaleString()}.00</span>
                            </div>

                            <div className="pt-4 flex justify-between items-center font-sans text-sm">
                              <div>
                                <p className="font-extrabold text-white">Net Take-Home Salary:</p>
                                <p className="text-[10px] text-slate-500 font-mono">After statutory relieves applied</p>
                              </div>
                              <span className="text-xl font-black font-sans text-teal-400">KSh {Math.floor(currentTaxes.netSalary).toLocaleString()}.00</span>
                            </div>
                          </div>

                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-500 font-mono space-y-1">
                            <p className="font-bold text-slate-400">Tax Relief Configuration:</p>
                            <p>&middot; Monthly KRA Personal Relief: KSh 2,400.00 (Deducted)</p>
                            <p>&middot; Insurance relief calculated: KSh {(currentTaxes.sha * 0.15).toFixed(0)} (15% of SHA contribution)</p>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 5: COMPLIANCE HEALTH SURVEY */}
                  {portalTab === 'health' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                      
                      <div className="flex items-start justify-between pb-4 border-b border-slate-850">
                        <div>
                          <h4 className="font-extrabold text-slate-200 text-base">Corporate Compliance Health Screen</h4>
                          <p className="text-slate-400 text-xs mt-1">Answer the questions below to test your legal vulnerability scorecard.</p>
                        </div>
                        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono font-bold tracking-wide">
                          SCORE: {compliancePercentage}%
                        </span>
                      </div>

                      <div className="space-y-6">
                        {COMPLIANCE_QUESTIONS.map((q) => {
                          const selectedVal = compAnswers[q.id];
                          return (
                            <div key={q.id} className="bg-slate-900 border border-slate-850 rounded-xl p-4 space-y-3">
                              <h5 className="font-bold text-slate-202 text-xs font-mono text-slate-350">{q.question}</h5>
                              
                              <div className="space-y-2 mt-2">
                                {q.options.map((option, oIdx) => (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => {
                                      setCompAnswers(prev => ({
                                        ...prev,
                                        [q.id]: option.points
                                      }));
                                    }}
                                    className={`w-full text-left p-3 text-xs rounded-lg transition border text-slate-300 ${
                                      selectedVal === option.points
                                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium'
                                        : 'bg-slate-950 hover:bg-slate-900 border-slate-850 hover:border-slate-800'
                                    }`}
                                  >
                                    {option.text}
                                  </button>
                                ))}
                              </div>

                              {selectedVal !== undefined && (
                                <div className="p-3 bg-slate-950 text-[11px] text-indigo-300 font-sans border-l-2 border-indigo-500 rounded-r-lg mt-2">
                                  💡 <strong>Tip advice:</strong> {q.options.find(o => o.points === selectedVal)?.tip}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                          <p className="text-xs text-slate-550 font-mono">Answers analyzed conform to current KRA Penalty Act rules.</p>
                          <button
                            onClick={() => {
                              setCompCompleted(true);
                              setPortalTab('overview');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition shadow"
                          >
                            Save health profile &rarr;
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 6: TAX DEADLINE CALENDAR */}
                  {portalTab === 'deadlines' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                      
                      <div className="mb-6">
                        <h4 className="font-extrabold text-slate-200 text-base">Kenyan Statutory Tax Deadlines Tracker</h4>
                        <p className="text-slate-500 text-xs mt-1">Calendar alerts structured to prevent compounding iTax arrears.</p>
                      </div>

                      <div className="space-y-4">
                        {KENYAN_TAX_DEADLINES.map((dl) => (
                          <div key={dl.id} className="bg-slate-900/60 border border-slate-850 hover:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition">
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center space-x-2.5">
                                <span className="bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">{dl.category}</span>
                                <h5 className="font-bold text-slate-200 text-sm">{dl.title}</h5>
                              </div>
                              <p className="text-xs text-slate-400 font-serif leading-relaxed">{dl.description}</p>
                              <p className="text-[10px] text-red-400 font-mono">⚠️ Penalty estimate: {dl.penaltyEstimate}</p>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className="text-xs block text-slate-500 font-mono">DUE DATE:</span>
                              <span className="font-black text-rose-500 text-base font-mono block mt-0.5">{dl.dueDate}</span>
                              <button 
                                onClick={() => alert(`Filing request registered for ${dl.title}. Our bookkeeping assistants will contact you soon.`)}
                                className="mt-2 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/25 px-3 py-1.5 rounded transition"
                              >
                                Request Filing assistance
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* TAB 7: EXPERT CONSULTATION PLANNING */}
                  {portalTab === 'booking' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                      
                      <div>
                        <h4 className="font-extrabold text-slate-200 text-base">Book a Certified CPA(K) compliance Audit</h4>
                        <p className="text-slate-500 text-xs mt-1">Reserve dedicated phone sessions with our business registrars and tax lawyers.</p>
                      </div>

                      <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs font-sans">
                        
                        {/* Selector items */}
                        <div className="md:col-span-5 space-y-4">
                          
                          <div className="space-y-1">
                            <label className="block text-slate-400 font-mono font-bold uppercase">Choose Consult Date:</label>
                            <input
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-slate-200 text-sm font-mono rounded-xl focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-400 font-mono font-bold uppercase">Area of Interest:</label>
                            <select
                              value={bookingInterest}
                              onChange={(e) => setBookingInterest(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 px-4 py-3 text-white text-xs rounded-xl focus:outline-none"
                            >
                              <option>New Company Incorporation</option>
                              <option>VAT Input/Output Audit</option>
                              <option>Statutory Returns Alignment</option>
                              <option>PAYE / Payroll Reconciliation</option>
                              <option>County Licensing Support</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            disabled={!selectedSlot}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-45 text-white font-sans font-bold py-3.5 rounded-xl transition cursor-pointer text-center"
                          >
                            Process Session Booking &rarr;
                          </button>

                          {bookingSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-center font-sans">
                              ✔️ Session Confirmed! Calendar invitation sent to {currentUser.email}.
                            </div>
                          )}

                        </div>

                        {/* SLOTS LIST COLUMN */}
                        <div className="md:col-span-7 space-y-3">
                          <p className="text-slate-550 font-mono font-bold uppercase tracking-wide">Available Consulting Slots today:</p>
                          
                          <div className="space-y-2 max-h-[350px] overflow-y-auto">
                            {CONSULTATION_SLOTS.map((slot) => (
                              <div
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                                  selectedSlot === slot.id
                                    ? 'bg-indigo-650 bg-indigo-600 border-indigo-400 text-white'
                                    : 'bg-slate-900 hover:bg-slate-900/60 border-slate-800 text-slate-350'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <img 
                                    src={slot.avatar} 
                                    alt={slot.advisor} 
                                    className="h-10 w-10 rounded-full object-cover border border-slate-800"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-205">{slot.advisor}</p>
                                    <p className="text-[10px] text-slate-400">{slot.role}</p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-900/10 px-2 py-0.5 rounded border border-cyan-500/10 block w-fit ml-auto">ACTIVE SLOT</span>
                                  <span className="font-mono text-[11px] block mt-1">{slot.time}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </form>

                      {/* Display historic bookings list if present */}
                      {bookings.length > 0 && (
                        <div className="pt-6 border-t border-slate-850">
                          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">My Scheduled Bookings ({bookings.length})</p>
                          <div className="space-y-2">
                            {bookings.map((bk) => (
                              <div key={bk.id} className="bg-slate-900 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs font-mono">
                                <div>
                                  <p className="text-slate-300 font-sans font-bold">{bk.service}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">Advisor: {bk.advisor} &middot; Date: {bk.date}</p>
                                </div>
                                <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wide">CONFIRMED</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 8: PREMIUM UPGRADE */}
                  {portalTab === 'upgrade' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                      <div className="h-12 w-12 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        💎
                      </div>
                      <h4 className="font-extrabold text-white text-lg">Business Logic Premium AI Access</h4>
                      <p className="text-slate-400 text-xs max-w-md mx-auto font-serif">
                        Get limitless OCR receipts analysis, infinite tax chats with the Gemini iTax engine, and priority queue handling with our CPA(K) audit professionals in Adams Arcade.
                      </p>

                      <div className="bg-slate-900 max-w-sm mx-auto p-4 rounded-xl border border-slate-800">
                        <span className="text-sm font-mono block text-slate-500">MONTHLY TARIFF RATE:</span>
                        <span className="text-2xl font-black text-white font-sans block mt-1">KSh 10,000 / month</span>
                      </div>

                      {currentUser.isPremium ? (
                        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl max-w-sm mx-auto text-xs flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4 mr-1.5" /> Premium features unlocked perfectly.
                        </div>
                      ) : (
                        <button
                          onClick={() => setUpgradeOpen(true)}
                          className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer"
                        >
                          Checkout Premium Plan Instantly
                        </button>
                      )}

                    </div>
                  )}

                </div>

              </div>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="py-20 bg-white border-b border-slate-100 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-1 rounded-full uppercase">HQ DIRECTORY</span>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">CONTACT US</h3>
              <p className="text-sm text-slate-500 font-serif leading-relaxed">
                Connect with our certified consulting group in Nairobi. Registered under accredited KRA systems for bookkeeping audits, eCitizen filings, and entity incorporations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm font-sans">Corporate Chambers</h4>
                <p className="text-slate-550 text-xs font-mono leading-relaxed">
                  BUSINESS LOGIC<br />
                  APPLEHOOD BUILDING - 10TH FLOOR<br />
                  ADAMS-ARCADE, NAIROBI, KENYA
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                  <Phone className="h-5 w-5 animate-pulse" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm font-sans">Direct Phone Dial</h4>
                <p className="font-mono text-indigo-600 font-bold hover:underline text-xs"><a href="tel:0720646916">0720646916</a></p>
                <span className="text-[10px] text-slate-400 font-sans">Available Weekdays 8:00 AM - 5:00 PM</span>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                  <Mail className="h-5 w-5" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm font-sans">Statutory Email</h4>
                <p className="font-mono text-slate-655 font-bold hover:underline text-xs"><a href="mailto:noble.consultants@yahoo.com">noble.consultants@yahoo.com</a></p>
                <span className="text-[10px] text-slate-400 font-sans">Official Registrar Response</span>
              </div>

            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-2xl mx-auto mt-10 text-center">
              <p className="text-[11px] text-indigo-950 leading-relaxed font-serif">
                📢 <strong>Client Notice:</strong> We reside directly on the 10th floor of Applehood Building, Adams Arcade, off Ngong Road. Clients planning physically booked audits are welcome during weekdays between 8:00 AM and 5:00 PM.
              </p>
            </div>
          </div>
        </section>

      </main>
    )}

      {/* Floating CTA / WhatsApp widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        <a 
          href="https://wa.me/254720646916?text=Hi%20Business%20Logic,%20I'm%20interested%20in%20your%20consulting%20services."
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold text-xs p-3.5 rounded-full flex items-center shadow-2xl transition-all duration-200 hover:scale-105"
        >
          💬 WhatsApp Us: 0720646916
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 col-span-2">
            <h4 className="font-extrabold text-white text-sm uppercase">Business Logic Kenya</h4>
            <p className="font-serif leading-relaxed text-slate-500">
              Approved accounting consultancy and eCitizen corporate registrars based in Nairobi. We marry robust statutory diligence with safe server-side artificial intelligence systems to shelter SMEs from tax penalty exposures.
            </p>
            <p className="font-mono text-[10px] text-zinc-650">Registered under ITA Section 15. All portal transactions sandbox encrypted.</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-350 text-xs font-mono uppercase tracking-wide">Corporate Services</h5>
            <div className="flex flex-col space-y-1">
              <a href="#bookkeeping-section" className="hover:text-white">Bookkeeping & Reconciliations</a>
              <a href="#bookkeeping-section" className="hover:text-white font-medium text-slate-500">VAT & Turnover Tax Filings</a>
              <a href="#bookkeeping-section" className="hover:text-white">PAYE & SHA Audit Schedules</a>
              <a href="#company-registration-section" className="hover:text-white">eCitizen Company Registration</a>
              <a href="#company-registration-section" className="hover:text-white">LLP and Partnership Registries</a>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-350 text-xs font-mono uppercase tracking-wide">Accredited Chambers</h5>
            <p className="text-slate-500 line-clamp-3">
              Applehood Building, 10th Floor<br />
              Adams Arcade, off Ngong Road<br />
              Nairobi, Kenya<br />
              Tel: 0720646916
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-900 text-center text-slate-600 font-mono text-[11px]">
          <p>&copy; {new Date().getFullYear()} Business Logic Kenya. All statutory files processed under accredited KRA systems.</p>
        </div>
      </footer>

      {/* DIALOG OVERLAY: M-PESA & CARD UPGRADE TO PREMIUM */}
      {upgradeOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full relative space-y-5 shadow-2xl">
            
            <button 
              onClick={() => setUpgradeOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full w-fit mx-auto border border-indigo-550/20">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <h4 className="font-black text-white text-base">Activate Premium Client Portal</h4>
              <p className="text-xs text-slate-400">Get unlimited document scanning, unlimited tax queries, and instant KRA reports for <strong>KSh 10,000 monthly</strong>.</p>
            </div>

            {/* Selector Method */}
            <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-850">
              <button 
                type="button"
                onClick={() => setPayMethod('mpesa')}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
                  payMethod === 'mpesa' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'
                }`}
              >
                M-Pesa Express
              </button>
              <button 
                type="button"
                onClick={() => setPayMethod('card')}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition ${
                  payMethod === 'card' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'
                }`}
              >
                Business Credit Card
              </button>
            </div>

            <form onSubmit={handleUpgradeAction} className="space-y-4 text-xs font-sans">
              
              {payMethod === 'mpesa' ? (
                <div className="space-y-2">
                  <label className="block text-slate-450 font-mono font-bold uppercase">Enter M-Pesa Phone Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0720646916"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 placeholder-slate-700 font-mono text-sm focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-emerald-450 text-slate-450 italic leading-relaxed">
                    👉 STK push notification will be dispatch to your handset instantly. Authorize by entering your secret M-Pesa PIN parameters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-slate-450 font-mono font-bold uppercase">Card Number:</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 placeholder-slate-705 text-slate-350 focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-slate-400 font-mono tracking-wide">EXPIRY DATE:</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 placeholder-slate-705 text-slate-350 focus:border-indigo-550 font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-400 font-mono tracking-wide">CVV CODE:</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 placeholder-slate-705 text-slate-350 focus:border-indigo-550 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mpesaPending ? (
                <div className="py-4 text-center space-y-2">
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-xs font-mono text-indigo-455 text-slate-400">Verifying secure mobile gateway tokens...</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-indigo-650 bg-indigo-600 hover:bg-indigo-550 font-sans font-bold text-white text-xs py-3.5 rounded-xl transition shadow shadow-indigo-500/20"
                >
                  Confirm Payment KSh 10,000 &rarr;
                </button>
              )}

            </form>

            <p className="text-[9px] text-center text-slate-600 font-mono">
              Secured under Central Bank of Kenya merchant security standards.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
