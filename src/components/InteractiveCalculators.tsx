import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, HelpCircle, Droplets, Sliders, AlertTriangle, CheckCircle2, Battery, ShieldAlert, Cpu } from 'lucide-react';

interface InteractiveCalculatorsProps {
  isArabic: boolean;
}

export default function InteractiveCalculators({ isArabic }: InteractiveCalculatorsProps) {
  // Calculator 1: Soil Moisture VWC
  const [vDry, setVDry] = useState<number>(3.0);
  const [vWet, setVWet] = useState<number>(1.1);
  const [vSampled, setVSampled] = useState<number>(2.0);

  // Calculator 2: Temperature compensated TDS
  const [vTds, setVTds] = useState<number>(1.2);
  const [waterTemp, setWaterTemp] = useState<number>(25);

  // Calculator 3: Battery Lifespan
  const [iActive, setIActive] = useState<number>(180); // mA
  const [tActive, setTActive] = useState<number>(2.0); // seconds
  const [iSleep, setISleep] = useState<number>(15); // uA
  const [tSleepMin, setTSleepMin] = useState<number>(15); // minutes
  const [cBattery, setCBattery] = useState<number>(1200); // mAh

  // Moisture VWC Logic
  const calcVwc = () => {
    if (vDry <= vWet) return 0;
    // inverse calculation: higher voltage means drier
    const numerator = vDry - vSampled;
    const denominator = vDry - vWet;
    const percentage = (numerator / denominator) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  };
  const vwcResult = calcVwc();

  const getVwcStatus = (vwc: number) => {
    if (vwc < 30) return { labelAr: "جافة جداً (تتطلب ري مكثف)", labelEn: "Very Dry (Requires active irrigation)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (vwc <= 75) return { labelAr: "رطوبة مثالية لامتصاص جذور النخيل", labelEn: "Optimal Rhizosphere Moisture", color: "text-blue-700 bg-blue-50 border-blue-200" };
    return { labelAr: "مشبعة بالماء تماماً (تشبع قد يسبب اختناق الجذور)", labelEn: "Fully Saturated (Waterlogged risk)", color: "text-indigo-750 bg-indigo-50 border-indigo-200" };
  };
  const vwcStatus = getVwcStatus(vwcResult);

  // TDS Salinity Compensation Logic
  const calcTds = () => {
    // 3rd-order polynomial regression based on DF-Robot datasheet represented in page 48:
    // TDS = (133.42 * V^3) - (255.86 * V^2) + (857.39 * V)
    const rawTds = (133.42 * Math.pow(vTds, 3)) - (255.86 * Math.pow(vTds, 2)) + (857.39 * vTds);
    
    // Temperature compensation ratio normalized to 25°C (alpha = 0.02)
    const tempCompCoefficient = 1.0 + 0.020 * (waterTemp - 25.0);
    const compensatedTds = rawTds / tempCompCoefficient;
    
    return Math.max(0, Math.round(compensatedTds));
  };
  const tdsResult = calcTds();

  const getTdsStatus = (tds: number) => {
    if (tds <= 500) return { labelAr: "مياه عذبة نقية (ممتازة جداً)", labelEn: "Pure freshwater (Excellent)", color: "text-sky-700 bg-sky-50 border-sky-200" };
    if (tds <= 1500) return { labelAr: "ملوحة طبيعية آمنة لنخيل التمر بالبصرة", labelEn: "Secure premium Date Palm irrigation water", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (tds <= 3000) return { labelAr: "ملوحة متوسطة (تتحملها النخيل لكن تتطلب صرف جيد)", labelEn: "Moderate Salinity (Palms survive; requires high soil draining)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { labelAr: "ملوحة عالية خطرة (تهدد نمو الثمار وتسبب الجفاف الأسموزي)", labelEn: "Critical High Salinity (Risk of osmotic rhizosphere drought)", color: "text-rose-700 bg-rose-50 border-rose-200" };
  };
  const tdsStatus = getTdsStatus(tdsResult);

  // Battery Autonomy Logic
  const calcBatteryAutonomy = () => {
    const tSleepSeconds = tSleepMin * 60;
    const iSleepMA = iSleep / 1000; // uA to mA
    
    // Average current (time-weighted formula in thesis page 49)
    const totalCycleTime = tActive + tSleepSeconds;
    const avgCurrentMA = ((iActive * tActive) + (iSleepMA * tSleepSeconds)) / totalCycleTime;

    const hours = cBattery / avgCurrentMA;
    const days = hours / 24;
    return {
      avgCurrent: avgCurrentMA.toFixed(3),
      days: Math.round(days),
      months: (days / 30.4).toFixed(1)
    };
  };
  const batteryResult = calcBatteryAutonomy();

  return (
    <div className="flex flex-col gap-8" id="interactive-calculators-panel">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Moisture VWC */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Droplets className="w-5 h-5 text-blue-600 shrink-0" />
            <h4 className="text-sm font-black text-slate-800">
              {isArabic ? "1. معايرة رطوبة التربة (%VWC)" : "1. Soil Moisture VWC Calibration"}
            </h4>
          </div>

          <p className="text-xs text-slate-500 leading-normal font-sans font-semibold">
            {isArabic ? 
              "التربة والألياف الزجاجية FR4 تغير قيمة الجهد التماثلي عكسياً مع زيادة المياه. أدخل المعايرات لحساب المحتوى المائي الحجمي:" : 
              "As moisture rises, the capacitive voltage drops. Move sliders to calibrate the absolute Volume Water Content percentage:"}
          </p>

          <div className="flex flex-col gap-3 mt-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">
                <span>{isArabic ? "جهد الجفاف الكلي (Dry Voltage):" : "Dry Baseline Offset:"}</span>
                <span className="font-bold text-slate-700">{vDry}V</span>
              </div>
              <input 
                type="range" min="2.5" max="3.3" step="0.1" 
                value={vDry} onChange={(e) => setVDry(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">
                <span>{isArabic ? "جهد التشبع الكلي (Wet Voltage):" : "Wet Saturated Offset:"}</span>
                <span className="font-bold text-slate-700">{vWet}V</span>
              </div>
              <input 
                type="range" min="0.8" max="2.0" step="0.1" 
                value={vWet} onChange={(e) => setVWet(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1 font-bold">
                <span>{isArabic ? "الجهد المقروء حالياً (Sampled Voltage):" : "Active Read Voltage:"}</span>
                <span className="font-black text-blue-600">{vSampled}V</span>
              </div>
              <input 
                type="range" min={vWet} max={vDry} step="0.05" 
                value={vSampled} onChange={(e) => setVSampled(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              {isArabic ? "نسبة رطوبة التربة المحسوبة" : "Calculated Volumetric Moisture"}
            </span>
            <span className="text-3xl font-black font-mono text-blue-700">{vwcResult}%</span>
            
            <div className={`mt-2 p-2 rounded-lg text-xs font-bold border ${vwcStatus.color}`}>
              {isArabic ? vwcStatus.labelAr : vwcStatus.labelEn}
            </div>
          </div>
        </div>

        {/* Widget 2: Salinity TDS with temperature compensation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Calculator className="w-5 h-5 text-blue-600 shrink-0" />
            <h4 className="text-sm font-black text-slate-800">
              {isArabic ? "2. الملوحة والتعويض الحراري" : "2. Temperature-Compensated TDS"}
            </h4>
          </div>

          <p className="text-xs text-slate-505 leading-normal font-sans font-semibold">
            {isArabic ? 
              "تتأثر ملوحة مياه البطران بحرارة الطقس لتقليل لزوجة الماء. نأخذ الجهد من العقدة وحرارة التربة من DS18B20:" : 
              "Electrical conductivity varies with temperature. Inputs raw voltage plus DS18B20 temperature to model real ppm:"}
          </p>

          <div className="flex flex-col gap-3 mt-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">
                <span>{isArabic ? "جهد حساس الملوحة (TDS Voltage):" : "Raw Sensor Signal Output:"}</span>
                <span className="font-bold text-slate-700">{vTds} V</span>
              </div>
              <input 
                type="range" min="0.0" max="2.3" step="0.05" 
                value={vTds} onChange={(e) => setVTds(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">
                <span>{isArabic ? "درجة حرارة مياه الري (Water Temp):" : "Fluid Temperature (DS18B20):"}</span>
                <span className="font-bold text-slate-700">{waterTemp}°C</span>
              </div>
              <input 
                type="range" min="15" max="50" step="1" 
                value={waterTemp} onChange={(e) => setWaterTemp(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              {isArabic ? "الملوحة الفعلية المصححة حرارياً" : "Calculated Corrected Salinity"}
            </span>
            <span className="text-3xl font-black font-mono text-blue-700">{tdsResult} ppm</span>
            
            <div className={`mt-2 p-2 rounded-lg text-xs font-bold border ${tdsStatus.color}`}>
              {isArabic ? tdsStatus.labelAr : tdsStatus.labelEn}
            </div>
          </div>
        </div>

        {/* Widget 3: Battery autonomy lifespan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Battery className="w-5 h-5 text-blue-600 shrink-0" />
            <h4 className="text-sm font-black text-slate-800">
              {isArabic ? "3. تنبؤ عمر بطارية النسخ الاحتياطي" : "3. 18650 Battery Backup Lifespan"}
            </h4>
          </div>

          <p className="text-xs text-slate-500 leading-normal font-sans font-semibold">
            {isArabic ? 
              "طاقة بطارية الـ 18650 بسعة 1200mAh تُحفظ بالدخول في نموذج النوم العميق (Deep Sleep). تتبع استهلاك التيار:" : 
              "Pre-calculates theoretical grid isolation autonomy using dual 18650 series cells and sleep period duty cycles:"}
          </p>

          <div className="flex flex-col gap-3 mt-1.5">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold font-bold">
                <span>{isArabic ? "سعة خلية البطارية (Capacity):" : "Cell Battery Capacity:"}</span>
                <span className="font-bold text-slate-700">{cBattery} mAh</span>
              </div>
              <input 
                type="range" min="1000" max="2600" step="100" 
                value={cBattery} onChange={(e) => setCBattery(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1 font-bold">
                <span>{isArabic ? "مدة النوم العميق (Sleep Cycle):" : "Deep-sleep Duration:"}</span>
                <span className="font-bold text-slate-700">{tSleepMin} {isArabic ? "دقيقة" : "Minutes"}</span>
              </div>
              <input 
                type="range" min="5" max="60" step="5" 
                value={tSleepMin} onChange={(e) => setTSleepMin(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 leading-relaxed font-mono flex flex-col gap-0.5">
              <span className="flex justify-between font-bold">
                <span>Active Duty I / t:</span>
                <span className="text-slate-800 font-bold">{iActive}mA / {tActive}s</span>
              </span>
              <span className="flex justify-between font-bold">
                <span>Sleep Duty I:</span>
                <span className="text-slate-800 font-bold">{iSleep}uA</span>
              </span>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 pt-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              {isArabic ? "متوسط الاستهلاك / عمر الاكتفاء" : "Weighted Current / Autonomy"}
            </span>
            <span className="text-2xl font-black font-mono text-blue-700">{batteryResult.days} {isArabic ? "يوم" : "Days"}</span>
            <p className="text-[10px] text-slate-450 mt-1 font-mono font-bold">
              ~ {batteryResult.months} {isArabic ? "أشهر بمتوسط تيار" : "Months at avg"} {batteryResult.avgCurrent}mA
            </p>
          </div>
        </div>

      </div>

      {/* Embedded Math Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-sans leading-relaxed text-slate-600 shadow-sm" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{isArabic ? "ملاحظة تدقيقية للبحث والمناقشة" : "Scientific Validation Checklist for Graduation Panel"}</span>
        </div>
        <span className="font-semibold block text-slate-550 leading-relaxed">
          {isArabic ? 
            "جميع هذه النماذج الرياضية مأخوذة ومصححة مباشرة مما ورد في الفصل الرابع لرسالة مشروع تخرّج منظم الري المستشعر للملوحة بجامعة المعقل، وهي توفر إثباتاً تاماً لدقة المعايرات الحقلية والتعويضات البيئية لإبراز تميّز العرض." : 
            "The modeling equations are directly derived from Chapter 4 of the Al-Maaqal University graduation report, validating VWC sensor standardization, salinity tracking accuracy normalized to 25°C, and battery backup longevity equations."}
        </span>
      </div>

    </div>
  );
}
