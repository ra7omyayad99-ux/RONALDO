import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WIRING_DIAGRAM_CONNECTIONS } from '../data';
import { Activity, Zap, Compass, Info, CheckCircle2, ChevronRight, LayoutGrid, Award, Cpu } from 'lucide-react';

interface WiringPlannerProps {
  isArabic: boolean;
}

export default function WiringPlanner({ isArabic }: WiringPlannerProps) {
  const [selectedWireId, setSelectedWireId] = useState<string>('n1-c1');
  const activeWire = WIRING_DIAGRAM_CONNECTIONS.find(w => w.id === selectedWireId) || WIRING_DIAGRAM_CONNECTIONS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="wiring-planner-view">
      
      {/* Left Column: Connections list */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1.5" dir={isArabic ? 'rtl' : 'ltr'}>
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 leading-snug">
            <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
            {isArabic ? "مسارات أسلاك التوصيل والتواصل" : "Interactive Connection Signals"}
          </h3>
          <p className="text-xs text-slate-505 font-sans leading-relaxed font-semibold">
            {isArabic ? 
              "اضغط على أي خط قراءة أدناه لعرض مساره برسم تخطيطي تفاعلي وتفاصيل توصيله الكهربائي." : 
              "Select any wiring pipeline below to trace its path on the schematic, highlighting pins and physical behaviors."}
          </p>
        </div>

        {/* Scrollable list of specific wiring points */}
        <div 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 max-h-[480px] overflow-y-auto scrollbar-thin"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="flex flex-col gap-2">
            
            {/* Division Header 1: Node 1 */}
            <div className="px-1.5 py-1 bg-slate-50 rounded-md text-[10px] uppercase font-black text-slate-400 tracking-wider">
              {isArabic ? "أطراف العقدة الأولى (Master Controller)" : "NODE 1: COORDINATOR PORTS"}
            </div>
            {WIRING_DIAGRAM_CONNECTIONS.filter(w => w.id.startsWith('n1')).map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWireId(w.id)}
                className={`cursor-pointer w-full text-right p-3 rounded-lg border transition-all text-sm flex items-center justify-between gap-3 ${
                  selectedWireId === w.id 
                    ? 'bg-blue-50/40 border-blue-500 shadow-2xs ring-1 ring-blue-500/20' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/60 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  <span className="font-bold text-slate-700 font-sans text-right">
                    {isArabic ? w.labelAr : w.labelEn}
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-slate-400 shrink-0">
                  {w.pin}
                </span>
              </button>
            ))}

            {/* Division Header 2: Node 2 */}
            <div className="px-1.5 py-1 bg-slate-50 rounded-md text-[10px] uppercase font-black text-slate-400 tracking-wider mt-2">
              {isArabic ? "أطراف العقدة الثانية (Telemetry acquisition)" : "NODE 2: ANALOG ACQUISITION SENSORS"}
            </div>
            {WIRING_DIAGRAM_CONNECTIONS.filter(w => w.id.startsWith('n2')).map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWireId(w.id)}
                className={`cursor-pointer w-full text-right p-3 rounded-lg border transition-all text-sm flex items-center justify-between gap-3 ${
                  selectedWireId === w.id 
                    ? 'bg-blue-50/40 border-blue-500 shadow-2xs ring-1 ring-blue-500/20 shadow-xs' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/60 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  <span className="font-bold text-slate-700 font-sans text-right">
                    {isArabic ? w.labelAr : w.labelEn}
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-slate-400 shrink-0">
                  {w.pin}
                </span>
              </button>
            ))}

          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Schematic Layout Canvas wrapper */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
        
        {/* Dynamic Interactive SVG Wiring schematics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-4">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          <div className="flex items-center justify-between relative z-10 text-white select-none">
            <span className="text-[10px] bg-slate-850 text-slate-300 font-black px-2 py-0.5 rounded-md font-mono flex items-center gap-1.5 border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              LIVE CIRCUITS SCHEMA MAP
            </span>
            <span className="text-xs text-blue-400 font-mono font-bold animate-pulse tracking-wider">
              SIGNAL STABILIZED
            </span>
          </div>

          {/* Interactive visual canvas of circuits */}
          <div className="relative border border-slate-800 rounded-lg bg-slate-950/80 p-6 min-h-[220px] flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
            
            {/* Controller Node Block left */}
            <div className="flex flex-col items-center gap-1 bg-slate-900 border border-blue-500/30 p-4 rounded-xl shadow-xs shrink-0 w-full sm:w-auto sm:max-w-[150px] text-center">
              <Cpu className="w-8 h-8 text-blue-400 mb-1" id="schematic-cpu" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">ESP32 Core</span>
              <p className="text-xs text-white font-black tracking-tight mt-0.5 leading-none">
                {activeWire.id.startsWith('n1') ? 'Node 01' : 'Node 02'}
              </p>
              <div className="mt-2 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                <span className="text-[10px] font-mono font-black text-amber-500">{activeWire.pin}</span>
              </div>
            </div>

            {/* Middle active wire path drawn using SVG lines */}
            <div className="flex-1 w-full sm:w-auto relative h-28 flex items-center justify-center">
              {/* Pulsing glow background wire */}
              <div 
                className="absolute left-0 right-0 h-1 rounded-full transition-all duration-500 opacity-20 blur-xs"
                style={{ backgroundColor: activeWire.color }}
              />
              <div 
                className="absolute left-0 right-0 h-0.5 rounded-full transition-all duration-500"
                style={{ backgroundColor: activeWire.color }}
              />
              {/* Floating current icon animation */}
              <motion.div 
                animate={{ x: [-60, 60], opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="w-2.5 h-2.5 rounded-full border border-white shrink-0 absolute shadow-xs"
                style={{ backgroundColor: activeWire.color }}
              />
              <span className="absolute bottom-2 text-[10px] font-mono text-slate-500 font-bold uppercase">
                {activeWire.id.startsWith('n1') ? 'I2C / Digital Bus' : 'ADC1 Pipeline'}
              </span>
            </div>

            {/* Target Hardware Sensor Block right */}
            <div className="flex flex-col items-center gap-1 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs shrink-0 w-full sm:w-auto sm:max-w-[150px] text-center">
              <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 mb-1">
                <LayoutGrid className="w-4.5 h-4.5 text-blue-400" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">Target module</span>
              <p className="text-xs text-slate-200 font-black tracking-tight mt-0.5 leading-none">
                {isArabic ? activeWire.labelAr : activeWire.labelEn}
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Explanation under the schematic selection */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3 mb-3">
            <span className="w-4 h-4 rounded-full animate-ping shrink-0" style={{ backgroundColor: activeWire.color }} />
            <span className="w-3 h-3 rounded-full absolute shrink-0" style={{ backgroundColor: activeWire.color }} />
            <h4 className="text-sm font-black text-slate-800">
              {isArabic ? `تطبيق إشارة: ${activeWire.labelAr}` : `Signal Behavior: ${activeWire.labelEn}`}
            </h4>
          </div>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans font-semibold">
            {isArabic ? activeWire.descAr : activeWire.descEn}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mt-4 flex items-start gap-2 text-[11px] text-slate-550 leading-relaxed font-semibold">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 font-black block mb-0.5">
                {isArabic ? "توجيه التوصيل الطبيعي (Physical Hookup Guideline):" : "Recommended Cable Strategy:"}
              </strong>
              <span>
                {isArabic ? 
                  "استخدم كبل توصيل DuPont قصير ومجدول (Stranded wire) لتقليل الضوضاء العالية الناتجة عن تداخل ذروات النبض المغناطيسي، وتجنب ربطها متجاورة تماما مع ملفات تغذية محركات الصمامات 12V." : 
                  "Utilize shielded twisted DuPont cables to construct sensitive analog pipelines. Isolate signal traces from primary high-current 12V motor wires to secure stable TDS values."}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
