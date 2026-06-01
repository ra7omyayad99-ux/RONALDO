import React from 'react';
import { motion } from 'motion/react';
import { UNIVERSITY_INFO } from '../data';
import { Award, BookOpen, User, Users, GraduationCap, Calendar, Compass, Sparkles } from 'lucide-react';
import { DeveloperImage } from './DeveloperImage';

interface HeaderViewProps {
  isArabic: boolean;
  onLanguageToggle: () => void;
}

export default function HeaderView({ isArabic, onLanguageToggle }: HeaderViewProps) {
  const info = UNIVERSITY_INFO;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border-b border-slate-200 shadow-xs relative overflow-hidden"
      id="project-header"
    >
      {/* Background elegant architectural line pattern for engineering look */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_100%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left emblem / Univ name */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-blue-700" id="university-logo-emblem">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-amber-400" fill="currentColor">
              {/* Outer logo circle */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4.5" />
              {/* Triangular Roof / Pediment */}
              <polygon points="16,34 50,13 84,34" />
              {/* Architrave / Beam beneath roof */}
              <rect x="20" y="37" width="60" height="4.5" rx="1" />
              {/* Columns / Pillars (5 symmetric pillars) */}
              <rect x="23" y="44" width="6" height="23" rx="0.5" />
              <rect x="35" y="44" width="6" height="23" rx="0.5" />
              <rect x="47" y="44" width="6" height="23" rx="0.5" />
              <rect x="59" y="44" width="6" height="23" rx="0.5" />
              <rect x="71" y="44" width="6" height="23" rx="0.5" />
              {/* Base Upper Step */}
              <rect x="20" y="70" width="60" height="4.5" rx="1" />
              {/* Base Lower Step */}
              <rect x="14" y="77" width="72" height="4.5" rx="1" />
            </svg>
          </div>
          <div className="text-right sm:text-left">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-sans">
              {isArabic ? info.universityAr : info.universityEn}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {isArabic ? info.collegeAr : info.collegeEn}
            </p>
          </div>
        </div>

        {/* Center Title */}
        <div className="text-center flex-1 max-w-2xl px-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-2 font-mono">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            {isArabic ? "مشروع تخرج متميز" : "Distinguished Graduation Project"}
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-sans leading-relaxed">
            {isArabic ? info.projectNameAr : info.projectNameEn}
          </h1>
          <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-2 font-sans flex-wrap">
            <span className="flex items-center gap-1 font-bold text-blue-600">
              <User className="w-3.5 h-3.5" />
              {isArabic ? "تحت إشراف: " : "Supervised by: "}
              {isArabic ? info.supervisorAr : info.supervisorEn}
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-400 font-mono font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {info.year}
            </span>
          </p>
        </div>

        {/* Right Student Names & Lang Button */}
        <div className="flex flex-col items-center md:items-end gap-3 min-w-[225px]" id="header-right-meta-column">
          {/* Developer Spotlight Badge */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-300/50 rounded-lg p-2 flex items-center gap-2.5 w-full text-right shadow-xs relative overflow-hidden" id="developer-spotlight-card">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/5 rounded-full blur-md pointer-events-none"></div>
            
            {/* Embedded custom developer portrait preview */}
            <DeveloperImage className="w-10 h-10 rounded-md border border-amber-300/50 object-cover shadow-sm" />

            <div className="flex-1 flex flex-col items-end overflow-hidden">
              <span className="text-[9px] uppercase font-black text-amber-700 tracking-wider block mb-0.5 font-sans flex items-center justify-end gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-600 shrink-0 animate-pulse" />
                {isArabic ? "المطور والمصمم البرمجي" : "UI/UX & Core Developer"}
              </span>
              <div className="text-[10px] text-amber-950 font-black font-sans leading-tight truncate w-full text-right">
                {isArabic ? "تم التطوير بواسطة م. عبدالرحمن اياد" : "Dev. by Eng. Abdulrahman Ayad"}
              </div>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="w-full cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-650 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            id="lang-toggle-btn"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>{isArabic ? "Switch to English" : "تغيير للعربية"}</span>
          </button>

          {/* Group Members Badge list */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 w-full text-right">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-1 font-mono flex items-center justify-end gap-1">
              <Users className="w-3 h-3 text-blue-500" />
              {isArabic ? "إعداد الطلبة الباحثين" : "Prepared by Students"}
            </span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-600 font-sans font-semibold">
              {(isArabic ? info.preparedByAr : info.preparedByEn).map((student, idx) => (
                <div key={idx} className="flex items-center justify-end gap-1 truncate text-right">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>{student}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
