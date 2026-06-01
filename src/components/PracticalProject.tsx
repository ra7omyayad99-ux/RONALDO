import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Waves, 
  Sprout, 
  Wifi, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  Terminal, 
  ArrowRightLeft,
  CircleDot,
  Wrench,
  Sun,
  Flame,
  CloudRain
} from 'lucide-react';

interface PracticalProjectProps {
  isArabic: boolean;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  messageAr: string;
  messageEn: string;
  type: 'info' | 'success' | 'warn' | 'danger';
}

export default function PracticalProject({ isArabic }: PracticalProjectProps) {
  // Simulator States
  const [soilMoisture, setSoilMoisture] = useState<number>(35);
  const [tdsSalinity, setTdsSalinity] = useState<number>(680); // ppm
  const [rainLevel, setRainLevel] = useState<string>('dry'); // dry, damp, raining
  const [airTemp, setAirTemp] = useState<number>(38); // DHT22 Temp
  const [soilTemp, setSoilTemp] = useState<number>(29); // DS18B20 Temp
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [rawSolenoidValve, setRawSolenoidValve] = useState<boolean>(false);
  const [rawPump, setRawPump] = useState<boolean>(false);
  const [selectedInspectNode, setSelectedInspectNode] = useState<string>('master');
  const [isPowerSaving, setIsPowerSaving] = useState<boolean>(false);
  const [showFhvSpike, setShowFhvSpike] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '00:01',
      source: 'Master Node',
      messageAr: 'بدء تشغيل الوحدة المركزية لجامعة المعقل بنجاح (ESP32 CPU0-1).',
      messageEn: 'Al-Maaqal Master ESP32 core initialized successfully.',
      type: 'success'
    },
    {
      id: '2',
      timestamp: '00:02',
      source: 'Sensors Node',
      messageAr: 'تأسيس بروتوكول ESP-NOW اللاسلكي السريع بتردد 2.4 جيجاهرتز.',
      messageEn: 'Fast ESP-NOW wireless link established at 2.4 GHz channel.',
      type: 'info'
    },
    {
      id: '3',
      timestamp: '00:03',
      source: 'Relays Node',
      messageAr: 'فحص خط التغذية 12V وتمكين العوازل البصرية PC817.',
      messageEn: 'Checking 12V supply line, enabled optical PC817 isolation gates.',
      type: 'success'
    }
  ]);

  // Derived Actuator states based on Auto Mode formulas
  // Al-Maaqal Automation Rules:
  // 1. If Salinity (TDS) is above 1200 ppm (Shatt Al-Arab salinity influx) -> Solenoid is forced OFF to protect palm roots from salt poisoning.
  // 2. If Rain Level is "raining" -> Valve & Pump are forced OFF to prevent flood over-irrigation.
  // 3. If Soil Moisture is below 40% AND salinity is under 1200 ppm AND not raining -> Solenoid & Pump are ON.
  // 4. If Soil Moisture is above 65% -> Solenoid & Pump are OFF (satisfied).
  // If Manual mode -> User has direct control (unless safety lock override).
  
  const isSalinityExtremelyHigh = tdsSalinity > 1200;
  const isTooRaining = rainLevel === 'raining';
  
  let solenoidActive = rawSolenoidValve;
  let pumpActive = rawPump;

  if (isAutoMode) {
    if (isSalinityExtremelyHigh || isTooRaining) {
      solenoidActive = false;
      pumpActive = false;
    } else {
      // Under irrigation requirements
      if (soilMoisture < 45) {
        solenoidActive = true;
        pumpActive = true;
      } else if (soilMoisture >= 68) {
        solenoidActive = false;
        pumpActive = false;
      } else {
        // Maintain previous status or default off
        solenoidActive = soilMoisture < 60;
        pumpActive = soilMoisture < 60;
      }
    }
  }

  // Generate simulated logs over time when state changes
  const addLog = (messageAr: string, messageEn: string, type: 'info' | 'success' | 'warn' | 'danger', source: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: time,
      source,
      messageAr,
      messageEn,
      type
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 40)]);
  };

  // Run periodic automated sensor fluctuations and simulation updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoMode) {
        // Soil Moisture slowly crawls towards equilibrium based on valve state
        setSoilMoisture(prev => {
          if (solenoidActive && pumpActive) {
            if (prev < 90) {
              const inc = Math.floor(Math.random() * 2) + 1;
              if (prev + inc === 45) {
                addLog('رطوبة التربة ارتفعت عن الحد الحرج. جاري الاستمرار بالري التدريجي.', 'Soil moisture climbed above critical. Gradual irrigation continues.', 'info', 'Sensors Node');
              }
              if (prev + inc >= 68) {
                addLog('تم الوصول إلى الرطوبة المستهدفة (68%). إرسال إغلاق تلقائي للصمامات.', 'Target soil moisture (68%) achieved. Sending auto-close command to valves.', 'success', 'Master Node');
              }
              return Math.min(prev + inc, 95);
            }
          } else {
            // Evaporation/drying out
            if (prev > 10) {
              const dec = Math.random() > 0.6 ? 1 : 0;
              if (prev - dec === 44) {
                addLog('انخفضت رطوبة التربة عن 45%! تفعيل الري التلقائي المبرمج.', 'Soil moisture dropped below 45%! Initializing automated smart irrigation.', 'warn', 'Master Node');
              }
              return Math.max(prev - dec, 8);
            }
          }
          return prev;
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [solenoidActive, pumpActive, isAutoMode]);

  // Log warnings when TDS changes
  const lastTds = useRef(tdsSalinity);
  useEffect(() => {
    if (tdsSalinity > 1200 && lastTds.current <= 1200) {
      addLog(
        `🚨 خطر الملوحة في شط العرب! قيم الاملاح تفوق ${tdsSalinity}ppm. جاري تفعيل بروتوكول الحماية فوراً وقفل المحابس.`,
        `🚨 Shatt Al-Arab salt intrusion! TDS exceeded ${tdsSalinity}ppm. Triggering instant lock-out to shield root system.`,
        'danger',
        'Master Node'
      );
    } else if (tdsSalinity <= 1200 && lastTds.current > 1200) {
      addLog(
        `✓ انخفاض ملوحة المروى إلى ${tdsSalinity}ppm. تراجع التهديد الملحي وعودة خط السيطرة العادي.`,
        `✓ Irrigation salinity normalized below limit to ${tdsSalinity}ppm. Threat cleared. resuming automation control.`,
        'success',
        'Master Node'
      );
    }
    lastTds.current = tdsSalinity;
  }, [tdsSalinity]);

  // Log warnings when Rain changes
  const lastRain = useRef(rainLevel);
  useEffect(() => {
    if (rainLevel === 'raining' && lastRain.current !== 'raining') {
      addLog(
        '☂ تم رصد هطول مطر كثيف عبر مجس المسبار. إيقاف الصمام لمنع تشبع التربة وتملحها السطحي.',
        '☂ Heavy rain detected by precipitation plate. Actuators isolated to prevent mud saturation.',
        'warn',
        'Sensors Node'
      );
    }
    lastRain.current = rainLevel;
  }, [rainLevel]);

  // Function to simulate physical flyback Back-EMF Spark
  const simulateOffSpike = () => {
    setShowFhvSpike(true);
    addLog(
      '⚡ إغلاق الريلية الحثية: تلاشي المجال المغناطيسي نتج عنه نبضة جهود عالية عكسية (Flyback EMF). دايود 1N5408 يخمدها فوراً.',
      '⚡ Relays switched OFF: Inductive coil collapse generated high reverse EMF spike. Clamped instantly by 1N5408 diode.',
      'warn',
      'Relays Node'
    );
    setTimeout(() => {
      setShowFhvSpike(false);
    }, 1500);
  };

  const handleToggleManualSolenoid = () => {
    if (isAutoMode) return;
    const nextVal = !rawSolenoidValve;
    setRawSolenoidValve(nextVal);
    if (!nextVal) {
      simulateOffSpike();
    } else {
      addLog('توجيه يدوي من المحاكي: تم فتح صمام الري السلبي.', 'Manual override: Solenoid valve forced open.', 'info', 'Relays Node');
    }
  };

  const handleToggleManualPump = () => {
    if (isAutoMode) return;
    const nextVal = !rawPump;
    setRawPump(nextVal);
    if (!nextVal) {
      simulateOffSpike();
    } else {
      addLog('توجيه يدوي من المحاكي: تشغيل مضخة الغاطس الرئيسية.', 'Manual override: Primary submersible pump forced active.', 'info', 'Relays Node');
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 flex flex-col gap-6" id="practical-project-dashboard" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* SECTION HEADER: EXPLAINING CONTEXT */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 sm:flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 hidden">
            <Wrench className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
              {isArabic ? "المختبر الافتراضي العملي" : "PHYSICAL PROTOTYPE SIMULATOR"}
            </span>
            <h3 className="text-lg font-black text-slate-800 font-sans mt-1">
              {isArabic ? "اللوحة التفاعلية للنموذج العتادي التطبيقي" : "Control Board & Laboratory Hardware Simulator"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isArabic 
                ? "لوحة فحص ومحاكاة مخرجات مشروع ري نخيل البصرة المدرك للملوحة للتأكد من السلامة الكهربائية وعزل الإشارات." 
                : "Interactive diagnostic panel simulating inputs/outputs of the double-isolated MCU array."
              }
            </p>
          </div>
        </div>

        {/* Quick auto/manual control */}
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl border border-slate-200 self-stretch md:self-auto justify-between">
          <span className="text-xs font-bold text-slate-600 px-1">
            {isArabic ? "نظام الأتمتة المدمج:" : "Automation Logic Status:"}
          </span>
          <div className="flex gap-1.5 font-sans">
            <button
              onClick={() => {
                setIsAutoMode(true);
                addLog('تفعيل التحكم التلقائي: معالجة البيانات مستمرة بناءً على خوارزمية السيطرة.', 'Automation Mode ENABLED. Feedback loop controlling actuators.', 'success', 'Master Node');
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAutoMode 
                  ? 'bg-blue-650 text-white shadow-xs font-black' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/50'
              }`}
            >
              {isArabic ? "تلقائي (Auto)" : "Auto Mode"}
            </button>
            <button
              onClick={() => {
                setIsAutoMode(false);
                addLog('تفعيل التحكم اليدوي: قم باستخدام مفاتيح اللوحة للتشغيل المباشر.', 'Manual Mode ENABLED. Relays now pending physical overrides.', 'warn', 'Master Node');
              }}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isAutoMode 
                  ? 'bg-amber-600 text-white shadow-xs font-black' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/50'
              }`}
            >
              {isArabic ? "يدوي (Manual)" : "Manual"}
            </button>
          </div>
        </div>
      </div>

      {/* THREE INTERACTIVE COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: SIMULATION ENVIROMENT INPUTS (SLIDERS & ENV STATUS) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-5 justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-slate-800">
                {isArabic ? "1. محاكاة العوامل البيئية والفيزيائية" : "1. Simulator Environmental Knobs"}
              </h4>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {isArabic 
                ? "قم بتعديل مؤشرات بيئة النخيل في البصرة وشط العرب لمشاهدة ردود الأفعال المباشرة للعقد العتادية والريليات."
                : "Drag sliders to change soil salinity, moisture, and outdoor conditions. Relays react instantaneously."
              }
            </p>

            {/* Sliders Container */}
            <div className="flex flex-col gap-4 mt-4 font-sans justify-start">
              
              {/* Salinity TDS */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 relative overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Waves className={`w-3.5 h-3.5 ${isSalinityExtremelyHigh ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                    {isArabic ? "ملوحة مياه السقي (TDS):" : "Shatt Al-Arab Salinity:"}
                  </span>
                  <span className={`text-xs font-mono font-black border px-1.5 py-0.5 rounded ${
                    isSalinityExtremelyHigh ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-550/10 text-blue-700 border-blue-200/30'
                  }`}>
                    {tdsSalinity} PPM
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  value={tdsSalinity}
                  onChange={(e) => setTdsSalinity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span>{isArabic ? "مياه عذبة (200)" : "Fresh (200)"}</span>
                  <span className="font-extrabold text-red-500">{isArabic ? "حد الخطر (1200)" : "Root Poison Limit (1200)"}</span>
                  <span>{isArabic ? "فائق الملوحة (3000)" : "Marine (3000)"}</span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                    {isArabic ? "رطوبة التربة (Moisture):" : "Soil Moisture v1.2 Probe:"}
                  </span>
                  <span className={`text-xs font-mono font-black border px-1.5 py-0.5 rounded ${
                    soilMoisture < 45 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                  }`}>
                    {soilMoisture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span className="text-amber-600 font-extrabold">{isArabic ? "جاف جداً (45>)" : "Bone Dry (<45)"}</span>
                  <span>{isArabic ? "رطب عادي (60)" : "Moist (60)"}</span>
                  <span>{isArabic ? "مشبع تماماً (95)" : "Saturated (95)"}</span>
                </div>
              </div>

              {/* Rain selection */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-2">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  {isArabic ? "مستوى هطول المطر (مسبار المطر):" : "Precipitation Plate Status:"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRainLevel('dry')}
                    className={`cursor-pointer py-1.5 text-[11px] rounded-lg border font-bold text-center transition-all ${
                      rainLevel === 'dry' 
                        ? 'bg-blue-600 text-white border-blue-550 shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-200/70'
                    }`}
                  >
                    {isArabic ? "صحو / جاف" : "Dry / Clear"}
                  </button>
                  <button
                    onClick={() => setRainLevel('damp')}
                    className={`cursor-pointer py-1.5 text-[11px] rounded-lg border font-bold text-center transition-all ${
                      rainLevel === 'damp' 
                        ? 'bg-sky-500 text-white border-sky-400 shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-200/70'
                    }`}
                  >
                    {isArabic ? "ندى خفيف" : "Morning Dew"}
                  </button>
                  <button
                    onClick={() => setRainLevel('raining')}
                    className={`cursor-pointer py-1.5 text-[11px] rounded-lg border font-bold text-center transition-all ${
                      rainLevel === 'raining' 
                        ? 'bg-slate-850 text-white border-slate-800 shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-200/70'
                    }`}
                  >
                    {isArabic ? "أمطار غزيرة" : "Heavy Rain"}
                  </button>
                </div>
              </div>

              {/* Environmental temperatures block */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">{isArabic ? "الهواء DHT22:" : "Air Temp:"}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-slate-700">{airTemp}°C</span>
                    <div className="flex gap-1">
                      <button onClick={() => setAirTemp(p => Math.max(10, p - 2))} className="cursor-pointer bg-white border border-slate-200 w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-slate-200">-</button>
                      <button onClick={() => setAirTemp(p => Math.min(60, p + 2))} className="cursor-pointer bg-white border border-slate-200 w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-slate-200">+</button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">{isArabic ? "التربة DS18B20:" : "Soil Temp:"}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-slate-700">{soilTemp}°C</span>
                    <div className="flex gap-1">
                      <button onClick={() => setSoilTemp(p => Math.max(10, p - 2))} className="cursor-pointer bg-white border border-slate-200 w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-slate-200">-</button>
                      <button onClick={() => setSoilTemp(p => Math.min(45, p + 2))} className="cursor-pointer bg-white border border-slate-200 w-5 h-5 rounded flex items-center justify-center text-[10px] hover:bg-slate-200">+</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Deep Sleep controller toggle to demonstrate low energy */}
          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-850 mt-5 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono font-extrabold text-blue-400 tracking-wider">
                {isArabic ? "مراقبة توفير الطاقة" : "EP32 SLEEP DYNAMICS"}
              </span>
              <span className={`w-2 h-2 rounded-full ${isPowerSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{isArabic ? "وضع استهلاك التيار الحالي:" : "Current current draw:"}</span>
              <span className="font-mono text-white font-black text-right text-sm">
                {isPowerSaving ? '15 µA (Deep Sleep)' : '180 mA (ESP-NOW Tx/Rx)'}
              </span>
            </div>

            <button
              onClick={() => {
                setIsPowerSaving(!isPowerSaving);
                addLog(
                  isPowerSaving 
                    ? 'الاستيقاظ من النوم العميق: إعادة تنشيط الراديو وقراءة الحساسات.' 
                    : 'فرملة المعالج ESP32 ودخول السبات العميق (Deep Sleep) لـ 15 ميكرو أمبير لحفظ البطارية.',
                  isPowerSaving 
                    ? 'Waking up from Deep Sleep: reactivating telemetry bus & ESP-NOW channel.' 
                    : 'System entered Low-Power Deep Sleep mode (15 uA) to extend 12V SLA battery lifetime.',
                  isPowerSaving ? 'success' : 'warn',
                  'Master Node'
                );
              }}
              className="cursor-pointer w-full bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 py-1.5 rounded-lg text-xs font-bold leading-normal transition-colors"
            >
              {isPowerSaving ? (isArabic ? "استيقاظ (Force Wake)" : "Wake Up Node") : (isArabic ? "تفعيل السبات (Deep Sleep)" : "Force Deep Sleep (15uA)")}
            </button>
          </div>
        </div>

        {/* MIDDLE COLUMN: REAL-TIME PHYSICAL HARDWARE MODEL / FEEDBACK INTERFACE */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-slate-800">
                {isArabic ? "2. النموذج المشغل والوقاية العتادية" : "2. Hardware Simulation Sandbox"}
              </h4>
            </div>

            {/* Diagnostic tabs to inspect different physical elements */}
            <div className="grid grid-cols-2 gap-1.5 mt-3 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedInspectNode('drivers')}
                className={`cursor-pointer py-1 px-2 text-[10px] font-bold rounded-md text-center transition-all ${
                  selectedInspectNode === 'drivers' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isArabic ? "مشغلات الجهد العالي" : "Intact Drivers"}
              </button>
              <button
                onClick={() => setSelectedInspectNode('master')}
                className={`cursor-pointer py-1 px-2 text-[10px] font-bold rounded-md text-center transition-all ${
                  selectedInspectNode === 'master' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isArabic ? "بيانات وعزل الحقل" : "Signals & Isolation"}
              </button>
            </div>

            {/* MAIN HARDWARE PANEL CONTAINER - Renders specific diagnostic details */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs flex flex-col gap-4 relative overflow-hidden flex-1 border border-slate-850">
              
              {selectedInspectNode === 'drivers' ? (
                // VIEW 1: DRIVERS AND RELAYS WITH OPTOCOUPLERS & FLYBACK PROTECTIONS
                <div className="flex flex-col gap-3 min-h-[300px] justify-between">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400">12V HIGH POWER NODE DRIVERS</span>
                    <span className="text-[10px] text-amber-400 font-bold shrink-0">Wired Output</span>
                  </div>

                  {/* Solenoid switch controller with Back-EMF Diode visualization */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">{isArabic ? "صمام الملف المغناطيسي Solenoid:" : "Solenoid (12V Input)"}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${solenoidActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                      {isArabic 
                        ? `محمي بدايود 1N5408 لتسريب التيارات الارتدادية.` 
                        : "Solenoid coil clamped via Flyback 1N5408 diode to block Back-EMF high volt."
                      }
                    </div>

                    {/* Manual button to toggle if in manual mode */}
                    <button
                      onClick={handleToggleManualSolenoid}
                      disabled={isAutoMode}
                      className={`cursor-pointer mt-2 w-full text-[11px] font-black font-sans py-1 rounded transition-colors ${
                        isAutoMode 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                          : solenoidActive ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isAutoMode 
                        ? (isArabic ? "مغلق بالأوتوماتيك" : "Controlled by Auto Mode") 
                        : solenoidActive ? (isArabic ? "إغلاق الصمام يدوياً" : "Force Close Solenoid") : (isArabic ? "فتح الصمام يدوياً" : "Force Open Solenoid")
                      }
                    </button>
                  </div>

                  {/* High Volatage Flyback spike animation */}
                  <AnimatePresence>
                    {showFhvSpike && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-amber-950/90 border border-amber-800 p-2.5 rounded-lg text-[10px] text-amber-300 font-sans leading-normal"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-400 mb-1 inline-block mr-1" />
                        <strong>{isArabic ? "بوابة الخمد نشطة (1N5408 Diode Active):" : "Clamping Spike Active:"}</strong>
                        {isArabic 
                          ? " تم التقاط تيار ارتدادي مفاجئ وتم تحويل مساره وقص النبضة بأمان لمنع الـ Spikes العنيفة."
                          : " Instant back-voltage suppressed to 0.7V. Relay coil protection bypassed successfully."
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submersible pump board */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white">{isArabic ? "المضخة الغاطسة Sub Pump:" : "Water Pump (12V Supply)"}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${pumpActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      {isArabic ? "مفصولة تماماً بصرياً ومحمية بدايودات وقاية." : "Submersed rotor pump isolated from core logic bus."}
                    </div>

                    <button
                      onClick={handleToggleManualPump}
                      disabled={isAutoMode}
                      className={`cursor-pointer mt-2 w-full text-[11px] font-black font-sans py-1 rounded transition-colors ${
                        isAutoMode 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                          : pumpActive ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isAutoMode 
                        ? (isArabic ? "مغلق بالأوتوماتيك" : "Controlled by Auto Mode") 
                        : pumpActive ? (isArabic ? "إيقاف المضخة يدوياً" : "Force Turn OFF Pump") : (isArabic ? "تشغيل المضخة يدوياً" : "Force Turn ON Pump")
                      }
                    </button>
                  </div>

                </div>
              ) : (
                // VIEW 2: OPTOCOUPLER PC817 INTERNALS ON SIGNAL MODE
                <div className="flex flex-col gap-3 min-h-[300px] justify-between">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400">GALVANIC OPTO-ISOLATION INTERNALS</span>
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1 py-0.5 rounded border border-blue-500/20 shrink-0 uppercase">PC817 CHIP</span>
                  </div>

                  <p className="text-[10px] font-sans text-slate-300 leading-relaxed">
                    {isArabic 
                      ? "يوضح هذا الشكل كيفية نقل الأوامر الكهربائية من معالج الـ ESP32 منخفض الفولتية (3.3V) إلى ريليه المضخة (12V) عبر النبضات الضوئية للحماية ضد الضوضاء المغناطيسية والعكسية."
                      : "Shows how digital orders pass from safe ESP32 GPIOs (3.3V) to high voltage relays (12V) strictly inside an infrared light-gap, keeping noise physically separated."
                    }
                  </p>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-3">
                    {/* Visual Schematic representation */}
                    <div className="flex justify-between items-center text-center font-bold text-[10px] font-sans">
                      
                      {/* Side A (ESP32 Logic 3.3V) */}
                      <div className="flex flex-col items-center flex-1 bg-blue-950/40 p-2 rounded border border-blue-900/30">
                        <span className="text-blue-400 font-mono">ESP32 GPIO</span>
                        <span className="text-slate-400 font-mono mt-1">3.3V Logic</span>
                        <div className={`mt-2 text-xs px-2 py-0.5 rounded ${solenoidActive || pumpActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                          {solenoidActive || pumpActive ? "HIGH (3.3V)" : "LOW (0V)"}
                        </div>
                      </div>

                      {/* Optical Link Inside PC817 */}
                      <div className="flex flex-col items-center justify-center px-2 flex-1">
                        <span className="text-[8px] text-slate-505 block mb-1">Opto-Gap</span>
                        <div className="relative w-full h-8 flex items-center justify-center">
                          {/* Laser beam */}
                          <div className={`h-1 w-full bg-red-500 transition-all ${solenoidActive || pumpActive ? 'opacity-100 shadow-[0_0_10px_#ef4444]' : 'opacity-10'}`} />
                        </div>
                        <span className="text-[8px] text-slate-500 mt-1">Galvanic Isolation</span>
                      </div>

                      {/* Side B (Relay Switch Node 12V) */}
                      <div className="flex flex-col items-center flex-1 bg-amber-950/30 p-2 rounded border border-amber-900/30">
                        <span className="text-amber-400 font-mono">Relay Coil</span>
                        <span className="text-slate-400 font-mono mt-1">12V Driver</span>
                        <div className={`mt-2 text-xs px-2 py-0.5 rounded ${solenoidActive || pumpActive ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                          {solenoidActive || pumpActive ? "Relay: ON" : "Relay: OFF"}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-sans text-slate-400 leading-normal bg-slate-950 p-2 rounded border border-slate-850 mt-1 text-right">
                      {isArabic ? (
                        <>🗲 <strong>مقاومة التوازي المعطلة:</strong> إن العزل الضوئي هو الضمان الأساسي لسلامة الحساسات وعمر المعالج ESP32 الطويل في البيئة الزراعية.</>
                      ) : (
                        <>🗲 <strong>Galvanic Isolation Break:</strong> Physical isolation rating is verified at up to 5000V RMS. Complete magnetic and thermal protection achieved.</>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Status footer bar of MCU board */}
              <div className="mt-auto pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Signal Integrity: 100%
                </span>
                <span>Al-Maaqal Dept 2024-2025</span>
              </div>
            </div>

          </div>

          {/* Quick interactive test button */}
          <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-205 flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-sans">
              {isArabic ? "أداة فحص واصدار نبضات يدوية:" : "Diagnostic Injector tool:"}
            </span>
            <button
              onClick={() => {
                addLog('فحص يدوي: تم بث حزمة بيانات محاكاة (Test Ping) لكل عقد الحقل لمجابهة الـ Interference.', 'Diagnostic Ping packet broadcasted via ESP-NOW across all local nodes.', 'info', 'Master Node');
              }}
              className="cursor-pointer bg-slate-100 hover:bg-slate-205 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 font-sans"
            >
              <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{isArabic ? "إرسال نبضة فحص شبكة ESP-NOW" : "Send ESP-NOW Diagnostic Ping"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: REALT-TIME TELEMETRY PACKET LOG (TERMINAL SCREEN) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Terminal className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-black text-slate-800">
                {isArabic ? "3. شاشة حركة البيانات والحزم اللاسلكية" : "3. ESP-NOW Real-time Wiretap"}
              </h4>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              {isArabic 
                ? "سجل البيانات والرسائل اللاسلكية المتبادلة بين عقد ESP32 المختلفة لمراقبة الحقل والسيطرة عليه:"
                : "Live telemetry stream displaying raw package exchange between sensory nodes, master and relay controllers."
              }
            </p>

            {/* Virtual Live Terminal Logger SCREEN */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 font-mono text-[10.5px] text-slate-300 leading-relaxed overflow-y-auto max-h-[290px] min-h-[270px] border border-slate-850 flex flex-col gap-3 scrollbar-thin">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pb-2 border-b border-slate-900 last:border-0 flex flex-col gap-0.5 text-right font-mono"
                  >
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className={`px-1 rounded font-bold capitalize ${
                        log.source.includes('Master') ? 'bg-blue-950 text-blue-400' :
                        log.source.includes('Sensors') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {log.source}
                      </span>
                    </div>

                    <p className={`mt-1 font-sans ${
                      log.type === 'danger' ? 'text-red-400 font-semibold' :
                      log.type === 'warn' ? 'text-amber-400' :
                      log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {isArabic ? log.messageAr : log.messageEn}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Shatt Al Arab Interactive Palm Map status banner */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 text-slate-200 border border-slate-850">
            <span className="text-[10px] text-slate-500 font-bold block mb-1 font-mono">CURRENT AUTOMATION DECISION:</span>
            
            {isSalinityExtremelyHigh ? (
              <div className="flex gap-2.5 items-start mt-2">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs">
                  <h5 className="font-extrabold text-red-400 leading-normal">{isArabic ? "بروتوكول حماية الجذور نشط" : "Rhizosphere Protection Lockout"}</h5>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans leading-relaxed">
                    {isArabic 
                      ? " تم اكتشاف ملوحة في شط العرب أعلى من 1200ppm؛ تم فصل النظام لمنع تملح التربة التراكمي وتسمم النخلة." 
                      : "Salinity limits exceeded. Shatt Al-Arab water locked out to protect the farm from permanent osmotic failure."
                    }
                  </p>
                </div>
              </div>
            ) : isTooRaining ? (
              <div className="flex gap-2.5 items-start mt-2">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-extrabold text-sky-400 leading-normal">{isArabic ? "تعطيل مؤقت لري المطر" : "Rain Loop Standby Active"}</h5>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans leading-relaxed">
                    {isArabic 
                      ? "مستشعر الهطول يؤكد وجود مياه طبيعية مجانية؛ تم تعليق المضخات لتجنب الري بالغمر الزائد." 
                      : "Sufficient rainfall registered manually. System standby enabled to suppress flood overload."
                    }
                  </p>
                </div>
              </div>
            ) : solenoidActive ? (
              <div className="flex gap-2.5 items-start mt-2">
                <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs">
                  <h5 className="font-extrabold text-emerald-400 leading-normal">{isArabic ? "جاري الري الذكي السعوي" : "Moisture Replenishment Loop"}</h5>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans leading-relaxed">
                    {isArabic 
                      ? "رطوبة التربة دون 45%؛ يتم صب المياه المعايرة حتى رطوبة 68% لحماية جذور شجرة النخل." 
                      : "Moisture levels under 45%. Volumetric irrigation loop active using isolated relay feedback queues."
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2.5 items-start mt-2 font-sans">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h5 className="font-extrabold text-blue-400 leading-normal">{isArabic ? "حالة التربة ممتازة ومكتفية" : "Rhizosphere Satiated - Saturated"}</h5>
                  <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                    {isArabic 
                      ? "مستويات الرطوبة مستقرة (أعلى من 45%)؛ العقد في وضع الاستعداد بانتظار دورة الجدولة الحادثة." 
                      : "Volumetric soil moisture is balanced. ESP-NOW nodes waiting in ultra low-power interval scheduler state."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ADDITIONAL FIELD LAYOUT COMPONENT EXPLAINER FOR CAPSTONE VIVA */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm mt-2">
        <h4 className="text-sm font-black text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{isArabic ? "مزايا التحقق الكهربائي والوقائي في الجزء العملي" : "Electrical Protection Advantages in Practical Layout"}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 font-sans justify-start text-right">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
            <span className="font-bold text-xs text-blue-700">{isArabic ? "1- عزل الريلية بالملف الكهرومغناطيسي" : "1- Electromagnetic Interference Suppression"}</span>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              {isArabic 
                ? "تتسبب محركات المضخة وملفات الريلية بإنتاج نبضات ارتدادية (Back-EMF Spikes) ضخمة لحظة الإيقاف والتشغيل. نظام العزل الضوئي PC817 المعتمد ببحثنا يحجبها عن المعالج تماماً."
                : "Inductive relay coils spark heavy electrical surges when turning off. Our dual-channel PC817 isolation gates eliminate coupling completely to shield ESP32 chips."
              }
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
            <span className="font-bold text-xs text-blue-700">{isArabic ? "2- المستشعرات السعوية ومكافحة الأكسدة" : "2- Capacitive vs Resistive Moisture Sensors v1.2"}</span>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              {isArabic 
                ? "تعتمد مستشعرات الرطوبة المقاومة التقليدية على التلامس المباشر للنحاس مع التربة مسببة أكسدة سريعة بالتربة المالحة. الحساسات السعوية v1.2 ببحثنا معزولة نهائياً بغطاء بوليمري واقٍ لمنع التآكل."
                : "Traditional resistive probes corrode instantly under Basra ground salinity. Our Capacitive design integrates covered copper foil to ensure decades of oxide-free readings."
              }
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col gap-2">
            <span className="font-bold text-xs text-blue-700">{isArabic ? "3- بروتوكول ESP-NOW والسبات الذكي" : "3- Battery Autonomy via ESP-NOW Deep Sleep"}</span>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold">
              {isArabic 
                ? "بدلاً من إبقاء راديو الـ Wi-Fi عالي الاستهلاك مستيقظاً، يبث البروتوكول حزم البيانات في أقل من 5 مللي ثانية قبل غمس المعالج في Sleep Mode بقيمة 15uA فقط ليصل عمر البطارية الفعلي لـ 120 يوماً."
                : "By utilizing standard raw MAC-based ESP-NOW bursts, connect times are slashed from 4 seconds down to 5ms, permitting extremely deep sleeping (15uA) for maximum battery life."
              }
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
