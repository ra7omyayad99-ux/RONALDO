import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UNIVERSITY_INFO, 
  STEP_BY_STEP_GUIDE 
} from './data';
import HeaderView from './components/HeaderView';
import ComponentExplorer from './components/ComponentExplorer';
import SystemArchitecture from './components/SystemArchitecture';
import WiringPlanner from './components/WiringPlanner';
import InteractiveCalculators from './components/InteractiveCalculators';
import TechnicalQuiz from './components/TechnicalQuiz';
import AssemblyAnimation from './components/AssemblyAnimation';
import ProjectPresentation from './components/ProjectPresentation';
import PracticalProject from './components/PracticalProject';
import ProjectStudyGuide from './components/ProjectStudyGuide';
import { DeveloperImage } from './components/DeveloperImage';
import { 
  Compass, 
  Layers, 
  Cpu, 
  Zap, 
  Calculator, 
  Award, 
  Sprout, 
  CheckCircle, 
  ExternalLink, 
  Flame, 
  Rss, 
  GraduationCap, 
  Waves,
  Presentation,
  Wrench,
  Sparkles,
  Terminal,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [isArabic, setIsArabic] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [assemblyStep, setAssemblyStep] = useState<number>(0);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Mouse Drag-to-Scroll for Desktop
  const tabContainerRef = React.useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeftState, setScrollLeftState] = useState<number>(0);
  const [hasDragged, setHasDragged] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tabContainerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const el = tabContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const tabs = [
    { id: 'overview', labelAr: 'الرؤية العامة والتركيب', labelEn: 'Overview & Assembly', icon: Compass },
    { id: 'study_guide', labelAr: 'دليل دراسة المشروع والمشاهدة الحية', labelEn: 'Study Guide & Live Dashboard', icon: BookOpen },
    { id: 'practical', labelAr: 'الجزء العملي للمشروع', labelEn: 'Practical Hardware Model', icon: Wrench },
    { id: 'presentation', labelAr: 'شرح وعرض الطلاب (PPT)', labelEn: 'Student PPT Presentation', icon: Presentation },
    { id: 'components', labelAr: 'دليل قطع الغيار', labelEn: 'Component Explorer', icon: Layers },
    { id: 'nodes', labelAr: 'بنية وجدولة العقد', labelEn: 'Node Registers', icon: Cpu },
    { id: 'wiring', labelAr: 'المخطط السلكي التفاعلي', labelEn: 'Interactive Wiring', icon: Zap },
    { id: 'calculators', labelAr: 'حاسبات المعايرة والبطارية', labelEn: 'Calibrators & Simulators', icon: Calculator },
    { id: 'quiz', labelAr: 'اختبار تقييم اللجنة', labelEn: 'Graduation Quiz', icon: Award }
  ];

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12 overflow-y-auto select-none"
            id="app-startup-splash"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Background design accents */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar / University credentials */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center border-b border-slate-800/60 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/60 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <GraduationCap className="w-6 h-6 text-amber-450" />
                </div>
                <div className="text-right sm:text-left">
                  <h4 className="text-xs font-black tracking-wider text-slate-350">جامعة المعقل - كلية الهندسة</h4>
                  <p className="text-[10px] text-slate-500">قسم هندسة السيطرة والحاسبات</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsArabic(true)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isArabic ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
                >
                  العربية
                </button>
                <button 
                  onClick={() => setIsArabic(false)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!isArabic ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Central Column Content */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center my-6 md:my-10 max-w-4xl mx-auto space-y-6">
              
              {/* Distinguished Badge */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-blue-950/50 text-blue-300 border border-blue-800/50 uppercase tracking-widest shadow-inner shadow-blue-900/40"
              >
                <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{isArabic ? "مشروع تخرج متميز للعام الدراسي ٢٠٢٥ - ٢٠٢٦" : "Distinguished Graduation Project 2025/2026"}</span>
              </motion.div>

              {/* Title Header */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-3"
              >
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-normal md:leading-relaxed font-sans">
                  {UNIVERSITY_INFO.projectNameAr}
                </h1>
                <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  {isArabic ? 
                    "منظومة ري متكاملة تعتمد على شبكة عتادية موزعة من المتحكمات الرقمية ESP32 المعزولة كهرومغناطيسياً وحماية أسموزية لنخيل البصرة." :
                    "Advanced closed-loop multi-node system deploying hardware level galvanic isolated relays and ESP-NOW wireless bus feeds."}
                </p>
              </motion.div>

              {/* SPECIAL SPOTLIGHT FOR THE ENTIRE DEV CONTEXT */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 80 }}
                className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/35 p-6 md:p-8 rounded-2xl max-w-3xl text-center md:text-right flex flex-col md:flex-row-reverse items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-amber-950/20"
                id="splash-developer-spotlight"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl animate-pulse" />
                
                {/* Premium framed developer photo preview */}
                <DeveloperImage className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-48 rounded-xl border-2 border-amber-400/50 shadow-md shadow-black/80 shrink-0" />

                <div className="space-y-3 flex-1 flex flex-col items-center md:items-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
                    {isArabic ? "براءة العتاد والتصميم والحلول البرمجية" : "Hardware, GUI & Embedded Coding Architecture"}
                  </span>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 tracking-wide font-sans leading-normal md:leading-relaxed text-center md:text-right drop-shadow-sm">
                    {isArabic ? "تم التطوير بواسطة المهندس عبدالرحمن اياد عثمان" : "Developed by Eng. Abdulrahman Ayad Othman"}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl md:max-w-none font-medium text-center md:text-right">
                    {isArabic ? 
                      "بناء هيكلية الربط اللاسلكي الموفر للطاقة، ومعادلات تصفية الضوضاء المغناطيسية، وتشكيل الدليل التفاعلي متكامل المخرجات." :
                      "Pioneered secure low-overhead RF links, custom industrial solenoid filters, and multi-node peer system calibration matrices."}
                  </p>
                </div>
              </motion.div>

              {/* Status checklist simulations */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-lg bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 text-right text-[11px] font-mono text-slate-400 space-y-1.5"
              >
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-800/40 pb-1.5 mb-2">
                  <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-blue-500" /> SYSTEM STATUS BLOCK</span>
                  <span className="text-[10px]">DS3231 RTC ACTIVE</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded">
                  <span>{isArabic ? "● تهيئة قنوات راديو ESP-NOW اللاسلكية بين العقد:" : "● Loading peer-to-peer ESP-NOW channels:"}</span>
                  <span className="text-emerald-400 font-bold">{isArabic ? "جاهز (منخفض الاستجابة)" : "READY"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded">
                  <span>{isArabic ? "● فحص الدائرة المغناطيسية وحماية الصمامات:" : "● Inductive solenoid surge protection configuration:"}</span>
                  <span className="text-emerald-400 font-bold">{isArabic ? "آمن (ديود 1N5408 نشط)" : "SECURE"}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 px-2 py-1 rounded">
                  <span>{isArabic ? "● ذاكرة تصفية قراءات حساس الملوحة (TDS filter):" : "● Linear TDS compensation filters:"}</span>
                  <span className="text-emerald-400 font-bold">{isArabic ? "تم التحميل بنجاح" : "LOADED"}</span>
                </div>
              </motion.div>

            </div>

            {/* Bottom Section - Team details & Entry Button */}
            <div className="relative z-10 border-t border-slate-800/60 pt-5 flex flex-col items-center gap-5">
              
              {/* Launcher/Dismiss Button */}
              <motion.button
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                onClick={() => setShowSplash(false)}
                className="cursor-pointer px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] text-white rounded-xl text-sm sm:text-base font-black uppercase tracking-wide transition-all shadow-lg shadow-blue-950/40 border border-blue-500/30 flex items-center gap-2"
                id="splash-dismiss-cta"
              >
                <span>{isArabic ? "تشغيل نظام التحكم والري الرقمي ⚡" : "Boot Digital Controller & Irrigation System ⚡"}</span>
              </motion.button>

              {/* Group members small display to honor everyone */}
              <div className="text-center font-sans">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1.5">
                  {isArabic ? "رابطة الطلبة الفنية للمشروع" : "Project Student Research Group"}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-slate-400 font-bold">
                  {UNIVERSITY_INFO.preparedByAr.map((student, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>{student}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Small copyright */}
              <div className="text-[9px] text-slate-600 font-mono">
                AL-MAAQAL UNIVERSITY  •  BASRA  •  EST: {UNIVERSITY_INFO.year}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased text-slate-800" id="main-application-wrap">
        {/* Header Presenter */}
        <HeaderView 
          isArabic={isArabic} 
          onLanguageToggle={() => setIsArabic(prev => !prev)} 
        />

      {/* Tabs Navigation Subbar */}
      <div className="bg-slate-50 border-b border-slate-200 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div 
            ref={tabContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="bg-slate-100 p-1 rounded-full flex overflow-x-auto scrollbar-none gap-1 border border-slate-200 cursor-grab active:cursor-grabbing select-none" 
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!hasDragged) {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all shrink-0 select-none ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/40 font-black'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                  }`}
                  id={`tab-trigger-${tab.id}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{isArabic ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dynamic Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8" id="application-workspace">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {/* Project Hero introduction block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left introduction text */}
                <div className="lg:col-span-7 flex flex-col gap-4 text-right">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 font-sans leading-snug">
                    {isArabic ? "منظّم الري الذكي المستشعر للملوحة لحماية مزارع نخيل البصرة" : "Autonomous Salinity-Aware Controller for Basra Dates Precision Agriculture"}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-medium">
                    {isArabic ? 
                      "يواجه المزارعون في البصرة خطراً مستمراً للتملح وتقلص جودة مياه شط العرب أو الري الإغراقي التقليدي، مما يؤدي لموت جذور النخيل تدريجياً. يأتي هذا المشروع لحل الأزمة جذرياً عبر نظام ري سعوي ذكي معزول كهرومغناطيسياً بالكامل للتحكم بنسب الملوحة وحل التعارضات الحقلية بكفاءة استهلاك طاقة عالية تضمن الديمومة." : 
                      "Traditional flood irrigation in Basra dates palm zones often leads to rapid soil salinization and resource depletion. This research project introduces a distributed multi-node closedloop controller. By employing 3x independent ESP32 modules communicating wirelessly via ESP-NOW, galvanic isolation is achieved to suppress mechanical electromagnetic noise and enhance salinity precision."}
                  </p>

                  <div className="flex flex-wrap gap-2.5 mt-2 justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      <Sprout className="w-3.5 h-3.5" />
                      {isArabic ? "حماية الجذور الاسموزية" : "Rhizosphere Osmotic Shield"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                      <Waves className="w-3.5 h-3.5 text-blue-500" />
                      {isArabic ? "معايرة ملوحة شط العرب" : "TDS Compensation"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      <Rss className="w-3.5 h-3.5" />
                      {isArabic ? "ربط لاسلكي ESP-NOW" : "Low-latency wireless bus"}
                    </span>
                  </div>
                </div>

                {/* Right Visual Bento Box Panel */}
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 shadow-xs border border-slate-800 relative overflow-hidden flex flex-col gap-4">
                  <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="relative z-10">
                    <span className="text-[10px] bg-blue-550/10 text-blue-400 font-bold px-2 py-0.5 rounded-md font-mono border border-blue-500/20 uppercase tracking-widest">
                      {isArabic ? "أبعاد وتكاليف الإنشاء المختبرية" : "PROTOTYPE CORE STATISTICS"}
                    </span>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "إجمالي القطع" : "Total Components"}</span>
                        <span className="text-xl font-mono font-black text-white">45 {isArabic ? "قطعة عتادية" : "units"}</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "كلفة الإنتاج الكلية" : "Total Net Cost"}</span>
                        <span className="text-xl font-mono font-black text-blue-400 font-semibold">198,500 IQD</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "استهلاك نوم عميق" : "Quiescent Draw"}</span>
                        <span className="text-xl font-mono font-black text-white font-semibold">15 µA</span>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isArabic ? "تردد المعالجين" : "CPU Frequency"}</span>
                        <span className="text-xl font-mono font-black text-white font-semibold">240 MHz</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Steps for assembly and usage */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4 flex flex-col gap-6">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5 leading-snug">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      {isArabic ? "خطوات التجميع المعملي والتشغيل بالتفصيل (Step-by-Step Guide)" : "Deep Physical Construction & Usage Steps"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-sans font-semibold">
                      {isArabic ? 
                        "انقر لتصفح الخطوات التطويرية المتبعة لبناء الدائرة وفحص عازليتها الكهرومغناطيسية." : 
                        "Click tags below to trace assembly procedures inside standard agricultural enclosures."}
                    </p>
                  </div>

                  {/* Horizontal indicators */}
                  <div className="flex gap-1.5">
                    {STEP_BY_STEP_GUIDE.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAssemblyStep(idx)}
                        className={`cursor-pointer w-7 h-7 rounded-lg text-xs font-black font-mono flex items-center justify-center transition-all ${
                          assemblyStep === idx 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200/40'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Steps and Interactive assembly animation layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column (or Right in RTL): Text guidings */}
                  <div className="lg:col-span-5 flex flex-col justify-between" dir={isArabic ? 'rtl' : 'ltr'}>
                    <AnimatePresence mode="white">
                      <motion.div
                        key={assemblyStep}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-4 text-right h-full"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/50">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-white font-mono">
                              {isArabic ? `الخطوة ${STEP_BY_STEP_GUIDE[assemblyStep].step} من 5` : `Step ${STEP_BY_STEP_GUIDE[assemblyStep].step} of 5`}
                            </span>
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                              {isArabic ? "دليل التجميع والتشغيل" : "ASSEMBLY & ASSEMBLY LABS"}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-slate-800 leading-snug">
                            {isArabic ? STEP_BY_STEP_GUIDE[assemblyStep].titleAr : STEP_BY_STEP_GUIDE[assemblyStep].titleEn}
                          </h4>

                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-medium">
                            {isArabic ? STEP_BY_STEP_GUIDE[assemblyStep].descriptionAr : STEP_BY_STEP_GUIDE[assemblyStep].descriptionEn}
                          </p>
                        </div>

                        {/* Pro Tips box */}
                        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex flex-col gap-2.5 mt-auto">
                          <span className="text-xs font-black text-blue-800 uppercase tracking-wider block">
                            {isArabic ? "نصيحة الحماية المعززة (Suppression Shield):" : "Recommended Suppression Shield Tip:"}
                          </span>
                          <ul className="list-disc list-inside text-xs text-blue-700 font-sans leading-relaxed font-medium space-y-1.5">
                            {(isArabic ? STEP_BY_STEP_GUIDE[assemblyStep].tipsAr : STEP_BY_STEP_GUIDE[assemblyStep].tipsEn).map((tip, idx) => (
                               <li key={idx} className="flex gap-2 items-start text-right">
                                 <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                                 <span>{tip}</span>
                               </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Interactive Sandbox animation */}
                  <div className="lg:col-span-7 flex flex-col h-full">
                    <AssemblyAnimation 
                      isArabic={isArabic} 
                      currentStep={assemblyStep} 
                      onChangeStep={setAssemblyStep} 
                    />
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'study_guide' && (
            <motion.div
              key="tab-study-guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectStudyGuide isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'practical' && (
            <motion.div
              key="tab-practical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PracticalProject isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'presentation' && (
            <motion.div
              key="tab-presentation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectPresentation isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="tab-components"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ComponentExplorer isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'nodes' && (
            <motion.div
              key="tab-nodes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <SystemArchitecture isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'wiring' && (
            <motion.div
              key="tab-wiring"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WiringPlanner isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'calculators' && (
            <motion.div
              key="tab-calculators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <InteractiveCalculators isArabic={isArabic} />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="tab-quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TechnicalQuiz isArabic={isArabic} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 text-center select-none mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-xs">
            {isArabic ? 
              "قسم هندسة السيطرة والحاسبات - جامعة المعقل. كافة الحقوق محفوظة © 2026" : 
              "Dept of Control and Computers Engineering - Al-Maaqal University. All rights reserved © 2026"}
          </p>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="text-emerald-500 font-black">Grade expected: A+</span>
            <span className="text-slate-500">|</span>
            <span>Basra Date Farms Precision Irrigation System</span>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
