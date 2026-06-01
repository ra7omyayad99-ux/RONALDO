import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  Wifi, 
  Layers, 
  Wrench, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle,
  TrendingUp, 
  ArrowRight, 
  ShieldAlert,
  BatteryCharging
} from 'lucide-react';

interface AssemblyAnimationProps {
  isArabic: boolean;
  currentStep: number;
  onChangeStep: (step: number) => void;
}

export default function AssemblyAnimation({ isArabic, currentStep, onChangeStep }: AssemblyAnimationProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testState, setTestState] = useState<"idle" | "energizing" | "active" | "deenergizing">("idle");

  const [telemetry, setTelemetry] = useState({
    voltage: 0,
    current: 0,
    coilVoltage: 0,
    coilCurrent: 0,
    fieldStrength: 0,
    spikeClamped: false
  });

  const t1Ref = React.useRef<NodeJS.Timeout | null>(null);
  const t2Ref = React.useRef<NodeJS.Timeout | null>(null);
  const t3Ref = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      if (t3Ref.current) clearTimeout(t3Ref.current);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (testState === "idle") {
      setTelemetry({
        voltage: 0,
        current: 0,
        coilVoltage: 0,
        coilCurrent: 0,
        fieldStrength: 0,
        spikeClamped: false
      });
    } else if (testState === "energizing") {
      let step_v = 0;
      intervalId = setInterval(() => {
        step_v = Math.min(3.3, step_v + 0.4);
        setTelemetry({
          voltage: 12.0,
          current: 0.0,
          coilVoltage: Number(step_v.toFixed(2)),
          coilCurrent: Math.round(step_v * 7.5),
          fieldStrength: Math.round(step_v * 45),
          spikeClamped: false
        });
      }, 50);
    } else if (testState === "active") {
      intervalId = setInterval(() => {
        const noiseV = (Math.random() - 0.5) * 0.15;
        const noiseI = (Math.random() - 0.5) * 0.06;
        setTelemetry({
          voltage: Number((11.85 + noiseV).toFixed(2)),
          current: Number((1.84 + noiseI).toFixed(3)),
          coilVoltage: 3.3,
          coilCurrent: 25,
          fieldStrength: Math.round(380 + (Math.random() - 0.5) * 15),
          spikeClamped: false
        });
      }, 100);
    } else if (testState === "deenergizing") {
      let elapsed = 0;
      intervalId = setInterval(() => {
        elapsed += 1;
        const decayFactor = Math.max(0, 1 - (elapsed / 15));
        const clampVoltage = elapsed < 2 ? -0.82 : Number((-0.82 * decayFactor).toFixed(2));
        const clampCurrent = Number((1.42 * decayFactor).toFixed(2));
        
        setTelemetry({
          voltage: clampVoltage,
          current: clampCurrent,
          coilVoltage: 0,
          coilCurrent: 0,
          fieldStrength: Math.round(120 * decayFactor),
          spikeClamped: elapsed < 10
        });
      }, 80);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [testState]);

  const triggerSimulatedTest = () => {
    if (isTestRunning) {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      if (t3Ref.current) clearTimeout(t3Ref.current);
      setTestState("idle");
      setIsTestRunning(false);
      return;
    }
    setIsTestRunning(true);
    setTestState("energizing");
    
    // Auto-focus Step 4 (actuator and flyback clamp step)
    onChangeStep(3);
    setIsPlaying(false);

    t1Ref.current = setTimeout(() => {
      setTestState("active");
    }, 750);

    t2Ref.current = setTimeout(() => {
      setTestState("deenergizing");
    }, 2850);

    t3Ref.current = setTimeout(() => {
      setTestState("idle");
      setIsTestRunning(false);
    }, 4250);
  };

  // Auto-play the steps sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        onChangeStep((currentStep + 1) % 5);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, onChangeStep]);

  // Node highlight details for current state
  const getStepHighlights = (step: number) => {
    switch (step) {
      case 0: // Step 1: Decentralized Node setup
        return {
          titleEn: "Step 1: ESP32 Cores Placement",
          titleAr: "الخطوة ١: هيكلة نوى المتحكمات الثلاثة",
          descEn: "Placing the 3 ESP32 modules. Node 1 serves as Coordinator (Master), Node 2 is Telemetrist (Sensors), and Node 3 is Executor (Solenoids & Pumps).",
          descAr: "تنظيم المتحكمات الثلاثة: العقدة الأولى كمشرف مركزي، العقدة الثانية لتلقي المجسات التماثلية، والعقدة الثالثة لتوجيه المرحلات.",
          highlighted: ["node1", "node2", "node3"],
          color: "border-blue-500 text-blue-550"
        };
      case 1: // Step 2: Voltage regulators
        return {
          titleEn: "Step 2: SMPS & LM2596 Buck Grid",
          titleAr: "الخطوة ٢: شبكة طاقة الـ SMPS ومنظّمات الجهد",
          descEn: "12V from SMPS is supplied. Buck regulators step this down to stable 5V for relays and 3.3V for sensitive ESP32 chips.",
          descAr: "يتم توصيل مصدر الطاقة الرئيسي بجهد 12V وخفضه بمنظمات LM2596 إلى 5V لتشغيل المرحلات والشاشات و3.3V آمن للمتحكمات.",
          highlighted: ["powersupply", "buckgrid", "powerlines"],
          color: "border-amber-500 text-amber-600"
        };
      case 2: // Step 3: Sensors & ADC1
        return {
          titleEn: "Step 3: Rhizophere Sensors & ADC1 Protection",
          titleAr: "الخطوة ٣: مجسّات التربة وقناة ADC1 المحمية",
          descEn: "Moisture probes, TDS salinity probe, and Rain plate are safely linked to ADC1 to prevent ESP-NOW wireless bus conflicts.",
          descAr: "توصيل الحساسات السعوية ونبضات الملوحة والمطر تحديداً بوحدات ADC1 للحد من صراع الترددات مع مرسل راديو الواي فاي.",
          highlighted: ["node2", "soilmoisture", "tdssensor", "rainplate", "temp_probe", "sensorwires"],
          color: "border-emerald-500 text-emerald-600"
        };
      case 3: // Step 4: Actuator suppressor
        return {
          titleEn: "Step 4: Inductive Suppression & Safe Drive",
          titleAr: "الخطوة ٤: قمع الارتداد الحثي وديودات الـ 1N5408",
          descEn: "Relays toggle the water pump and solenoids. Crucial 1N5408 flyback diodes clamp inductive high-voltage spikes.",
          descAr: "توجيه مشغلات الصمامات والمضخة مع اللحام المتوازي العكسي لديودات 1N5408 لكبح تيار الارتداد الحثي الضار.",
          highlighted: ["node3", "relays", "solenoids", "pump", "diodes", "actuatorwires"],
          color: "border-purple-500 text-purple-600"
        };
      case 4: // Step 5: HMI Coordination & ESP-NOW
        return {
          titleEn: "Step 5: Peer-to-Peer ESP-NOW & HMI LCD",
          titleAr: "الخطوة ٥: شبكة ESP-NOW وشاشة المشرف",
          descEn: "The 3 nodes connect wirelessly using zero-router ESP-NOW. Node 1 queries RTC DS3231 and shows statistics on LCD 20x4.",
          descAr: "بث ترددات ESP-NOW فائقة السرعة مع ربط شاشة المشرف I2C وساعة التوقيت الدقيقة DS3231 لمراقبة التملح ريادياً.",
          highlighted: ["node1", "lcd_screen", "chrono_rtc", "dht22", "espnow_signals", "coordinatorwires"],
          color: "border-indigo-500 text-indigo-600"
        };
      default:
        return { titleEn: "", titleAr: "", descEn: "", descAr: "", highlighted: [], color: "" };
    }
  };

  const activeHighlight = getStepHighlights(currentStep);

  const isHighlighted = (elementId: string) => {
    return activeHighlight.highlighted.includes(elementId);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-6 overflow-hidden flex flex-col gap-4 shadow-xl select-none" id="svg-assembly-canvas">
      
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white border-b border-slate-850 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-mono font-black tracking-wider text-slate-300">
              {isArabic ? "منصة المحاكاة والتركيب النظري" : "Interactive Assembly Sandbox"}
            </h4>
            <span className="text-[10px] text-blue-400 font-mono font-bold">
              {isArabic ? "تجميع العقد الثلاثية بالتسلسل" : "3x ESP32 Nodes Interconnection System"}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`cursor-pointer w-7 h-7 rounded-md flex items-center justify-center transition-all border ${
              isPlaying 
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-650/30' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
            }`}
            title={isPlaying ? "Pause autoplay" : "Start autoplay"}
            id="control-autoplay-toggle"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          
          <button 
            onClick={() => {
              onChangeStep(0);
              setIsPlaying(false);
            }}
            className="cursor-pointer w-7 h-7 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-750 flex items-center justify-center transition-all"
            title="Reset to Step 1"
            id="control-assembly-reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Direct Quick jump Steps dots */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md">
            {[0, 1, 2, 3, 4].map((stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => {
                  onChangeStep(stepIdx);
                  setIsPlaying(false);
                }}
                className={`cursor-pointer w-3.5 h-3.5 rounded-full transition-all text-[8px] font-mono font-black flex items-center justify-center ${
                  currentStep === stepIdx
                    ? 'bg-blue-500 text-slate-950 scale-110 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
              >
                {stepIdx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary SVG Canvas Frame */}
      <div className="relative w-full aspect-[800/480] bg-slate-930/60 rounded-xl border border-slate-850 p-2 overflow-hidden flex items-center justify-center">
        
        {/* Ambient background decorative logic wires */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <svg 
          viewBox="0 0 800 480" 
          width="100%" 
          height="100%"
          className="relative z-10 w-full h-full select-none"
        >
          {/* DEFINITIONS SECTION for gradients, filters, markers */}
          <defs>
            {/* Glow Filter */}
            <filter id="svg-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Soft Shadow Filter for circuit blocks */}
            <filter id="block-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.5" />
            </filter>

            {/* Glowing Wire Linear Gradients */}
            <linearGradient id="power-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            <linearGradient id="signal-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            <linearGradient id="signal-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            
            {/* Diagonal Grid Fill for Buck Converter boards */}
            <pattern id="pcb-diagonal" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#1E293B" strokeWidth="1" />
            </pattern>
          </defs>

          {/* ========================================================
              PHYSICAL CONNECTION WIRES AND BUS CHANNELS (STEP 2, 3, 4, 5)
              ======================================================== */}
          
          {/* STEP 2: POWER TRANSMISSION SHIELD GRID (SMPS to Buck Regulators to Nodes) */}
          <g id="circuit-wire-power" opacity={isHighlighted("powersupply") || isHighlighted("buckgrid") || isHighlighted("powerlines") ? 1.0 : 0.15} className="transition-opacity duration-500">
            {/* 12V DC Main feed line from SMPS to Regulators */}
            <path 
              d="M 400 95 L 400 160" 
              stroke="url(#power-red-grad)" 
              strokeWidth="3.5" 
              fill="none" 
              strokeDasharray={isHighlighted("powerlines") ? "6 4" : "none"}
              className={`${isHighlighted("powerlines") ? "animate-[dash_8s_linear_infinite]" : ""}`}
              style={{ strokeDashoffset: isHighlighted("powerlines") ? 20 : 0 }}
            />
            
            {/* 12V Primary feed to Actuator Node relays & motors */}
            <path 
              d="M 425 210 L 610 210" 
              stroke="#EF4444" 
              strokeWidth="2.5" 
              fill="none"
              strokeDasharray={isHighlighted("powerlines") ? "5 5" : "none"}
            />

            {/* Step Down Outlines: 5V rail for Relays and character screen */}
            <path 
              d="M 370 210 L 160 210 L 160 145" 
              stroke="#F59E0B" 
              strokeWidth="2" 
              fill="none"
            />
            
            {/* 3.3V Pure linear core power line to ESP32 Node PCBs */}
            <path 
              d="M 400 240 L 400 370 L 195 370" 
              stroke="#3B82F6" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M 400 370 L 610 370" 
              stroke="#3B82F6" 
              strokeWidth="2" 
              fill="none"
            />
          </g>

          {/* STEP 3: ANALOG SENSORS DATA PIPELINES (to Node 2 ADC1 Pins) */}
          <g id="circuit-wire-sensors" opacity={isHighlighted("sensorwires") ? 1.0 : 0.15} className="transition-opacity duration-500">
            {/* Moisture Sensor 1: GPIO 32 (ADC1_CH4) */}
            <path d="M 120 405 L 120 375" stroke="#84CC16" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            {/* TDS Salinity Probe: GPIO 35 (ADC1_CH7) */}
            <path d="M 195 435 L 195 375" stroke="#6366F1" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            {/* Rain Detector: GPIO 36 (ADC1_CH0) */}
            <path d="M 270 405 L 210 355" stroke="#EC4899" strokeWidth="2" fill="none" />
            {/* Waterproof Ground Temperature probe DS18B20 to Digital pin */}
            <path d="M 45 420 L 80 355" stroke="#D946EF" strokeWidth="2" fill="none" />
          </g>

          {/* STEP 4: SWITCHING AND INDUCTIVE CLAMP DIODES (Node 3 Drive to relay and actuator) */}
          <g 
            id="circuit-wire-actuators" 
            opacity={testState !== "idle" ? 1.0 : isHighlighted("actuatorwires") ? 1.0 : 0.15} 
            className="transition-opacity duration-500"
          >
            {/* Node 3 GPIOs feeding Relay trigger inputs */}
            <path 
              d="M 640 250 L 640 275" 
              stroke={testState === "energizing" || testState === "active" ? "#C084FC" : "#8B5CF6"} 
              strokeWidth={testState !== "idle" ? "3.5" : "2"} 
              fill="none" 
              style={{ filter: testState === "energizing" || testState === "active" ? "url(#svg-neon-glow)" : "none" }}
            />
            
            {/* Primary 12V Switch and Flyback suppression paths to solenoid valves (Zones 1-3) */}
            <path 
              d="M 720 290 L 760 290" 
              stroke={testState === "active" ? "#22D3EE" : testState === "deenergizing" ? "#F59E0B" : "#EF4444"} 
              strokeWidth={testState === "active" ? "4" : testState === "deenergizing" ? "3" : "2.2"} 
              strokeDasharray={testState === "active" ? "6 4" : testState === "deenergizing" ? "3 3" : "none"}
              fill="none" 
              className={`${testState === "active" ? "animate-[dash_1.5s_linear_infinite]" : ""}`}
              style={{ strokeDashoffset: testState === "active" ? 20 : 0 }}
            />
            
            {/* Animated particles on the relay contact lines pointing to the solenoid during active operation */}
            {testState === "active" && (
              <g className="pointer-events-none">
                <circle r="3.5" fill="#22D3EE" style={{ filter: "url(#svg-neon-glow)" }}>
                  <animateMotion path="M 720 290 L 760 290" dur="0.4s" repeatCount="indefinite" />
                </circle>
                <circle r="2.2" fill="#FFFFFF">
                  <animateMotion path="M 720 290 L 760 290" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Visual breakdown showing NO flow through the open relay contact lines during deenergizing state */}
            {testState === "deenergizing" && (
              <g className="pointer-events-none">
                {/* Visual deflection bubble or red cross at the opened relay terminal (x=720, y=290) */}
                <g transform="translate(720, 290)">
                  <circle cx="0" cy="0" r="6" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" opacity="0.8" />
                  <line x1="-3" y1="-3" x2="3" y2="3" stroke="#FFFFFF" strokeWidth="1.2" />
                  <line x1="3" y1="-3" x2="-3" y2="3" stroke="#FFFFFF" strokeWidth="1.2" />
                  {/* Text indicator for relay protection */}
                  <text x="-4" y="-9" fill="#FCA5A5" fontSize="5" fontFamily="monospace" fontWeight="bold">ISOLATED</text>
                </g>
                {/* Transient collapse particle on the line getting absorbed by the solenoid flyback terminal */}
                <circle r="2.5" fill="#EF4444" opacity="0.8" style={{ filter: "url(#svg-neon-glow)" }}>
                  <animateMotion path="M 720 290 L 760 290" dur="0.3s" repeatCount="1" fill="freeze" />
                </circle>
              </g>
            )}

            <path 
              d="M 720 310 L 760 310" 
              stroke={testState === "active" ? "#34D399" : "#E2E8F0"} 
              strokeWidth={testState === "active" ? "2.5" : "1.5"} 
              fill="none" 
            />

            {/* Heavy flow path to Brushless Submersible Pump tx10 */}
            <path 
              d="M 720 330 L 760 360" 
              stroke={testState === "active" ? "#06B6D4" : "#3B82F6"} 
              strokeWidth={testState === "active" ? "4" : "2.2"} 
              fill="none" 
              strokeDasharray={testState === "active" ? "6 3" : "none"}
              className={`${testState === "active" ? "animate-[dash_1s_linear_infinite]" : ""}`}
              style={{ strokeDashoffset: testState === "active" ? 20 : 0 }}
            />

            {/* Pump active state particles */}
            {testState === "active" && (
              <g className="pointer-events-none">
                <circle r="3.2" fill="#06B6D4" style={{ filter: "url(#svg-neon-glow)" }}>
                  <animateMotion path="M 720 330 L 760 360" dur="0.4s" repeatCount="indefinite" />
                </circle>
                <circle r="1.8" fill="#FFFFFF">
                  <animateMotion path="M 720 330 L 760 360" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>

          {/* STEP 5: MASTER HMI COORDINATOR I2C BUS (Node 1 core to LCD & Clock) */}
          <g id="circuit-wire-coordinator" opacity={isHighlighted("coordinatorwires") ? 1.0 : 0.15} className="transition-opacity duration-500">
            {/* I2C shared SDA/SCL lines from ESP32 to LCD Screen and DS3231 Chrono RTC */}
            <path d="M 110 50 L 110 30" stroke="#10B981" strokeWidth="2" fill="none" />
            <path d="M 125 50 L 125 30" stroke="#3B82F6" strokeWidth="2" fill="none" />
            {/* I2C Branch down to real-time clock card */}
            <path d="M 205 100 L 225 100" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="2 2" />
          </g>


          {/* ========================================================
              PHYSICAL HARDWARE MODULE BLOCKS / BOARDS (STEP 1 Focus)
              ======================================================== */}

          {/* 1. CENTRAL SWITCH-MODE POWER SUPPLY unit (SMPS 12V 10A) */}
          <g 
            id="powersupply-block" 
            transform="translate(320, 30)" 
            filter="url(#block-shadow)"
            opacity={isHighlighted("powersupply") || currentStep === 0 ? 1.0 : 0.35} 
            className="transition-all duration-500 cursor-pointer"
            onClick={() => { onChangeStep(1); setIsPlaying(false); }}
          >
            <rect x="0" y="0" width="160" height="65" rx="6" fill="#1E293B" stroke={isHighlighted("powersupply") ? "#EF4444" : "#475569"} strokeWidth="2" />
            <rect x="0" y="0" width="160" height="18" rx="4" fill="#0F172A" />
            {/* Silver vents on the industrial supply */}
            <line x1="15" y1="32" x2="145" y2="32" stroke="#475569" strokeWidth="3" strokeDasharray="3 4" />
            <line x1="15" y1="41" x2="145" y2="41" stroke="#475569" strokeWidth="3" strokeDasharray="3 4" />
            <text x="80" y="12" fill="#E2E8F0" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">12V 10A 120W SMPS</text>
            <text x="12" y="55" fill="#EF4444" fontSize="7" fontWeight="bold" fontFamily="monospace">POWER OUT: 12V DC</text>
            {/* Active glowing green power light */}
            <circle cx="145" cy="52" r="3" fill="#10B981" filter="url(#svg-neon-glow)" />
          </g>

          {/* 2. LM2596 BUCK VOLTAGE MATRIX STEP-DOWN BLOCKS */}
          <g 
            id="buckgrid-block" 
            transform="translate(330, 165)" 
            filter="url(#block-shadow)"
            opacity={isHighlighted("buckgrid") || currentStep === 0 ? 1.0 : 0.3} 
            className="transition-all duration-500 cursor-pointer"
            onClick={() => { onChangeStep(1); setIsPlaying(false); }}
          >
            <rect x="0" y="0" width="140" height="75" rx="8" fill="#064E3B" stroke={isHighlighted("buckgrid") ? "#F59E0B" : "#0F766E"} strokeWidth="1.5" />
            {/* Heat sinks on buck regulators */}
            <rect x="15" y="15" width="25" height="15" fill="#334155" />
            <rect x="100" y="15" width="25" height="15" fill="#334155" />
            <line x1="18" y1="15" x2="18" y2="30" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="22" y1="15" x2="22" y2="30" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="103" y1="15" x2="103" y2="30" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="107" y1="15" x2="107" y2="30" stroke="#F1F5F9" strokeWidth="1" />
            
            <circle cx="45" cy="50" r="8" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" /> {/* Inductor coil */}
            <text x="45" y="53" fill="#F59E0B" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">150uH</text>

            <text x="70" y="42" fill="#34D399" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">LM2596 GRID</text>
            <text x="70" y="52" fill="#E2E8F0" fontSize="7" fontFamily="sans-serif" textAnchor="middle">{isArabic ? "منظمات التوهج تماثلي" : "DC-DC buck converters"}</text>
            
            {/* Power labels out */}
            <rect x="5" y="60" width="55" height="10" rx="3" fill="#78350F" />
            <text x="32" y="67" fill="#FBBF24" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">REG_1: 5.0V</text>
            <rect x="80" y="60" width="55" height="10" rx="3" fill="#1E3A8A" />
            <text x="107" y="67" fill="#93C5FD" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">REG_2: 3.3V</text>
          </g>


          {/* 3. NODE 1: COORDINATION HUB (MASTER-SCREEN) */}
          <g 
            id="node1-block" 
            transform="translate(40, 50)" 
            filter="url(#block-shadow)"
            opacity={isHighlighted("node1") || currentStep === 0 ? 1.0 : 0.35} 
            className="transition-all duration-500 cursor-pointer"
            onClick={() => { onChangeStep(0); setIsPlaying(false); }}
          >
            {/* Node Frame Box */}
            <rect x="0" y="0" width="160" height="95" rx="10" fill="#0F172A" stroke={isHighlighted("node1") ? "#3B82F6" : "#1E293B"} strokeWidth="2.5" />
            <rect x="0" y="0" width="160" height="24" rx="10" fill="#1E3A8A" />
            <text x="80" y="15" fill="#E2E8F0" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">
              {isArabic ? "عقدة 1: تيسير وعرض البيانات" : "NODE 1: COORDINATOR CORE"}
            </text>

            {/* Glowing active Wi-Fi antennas indicators */}
            <g transform="translate(142, 6)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="#1E293B" />
              <Wifi className="w-2.5 h-2.5 text-blue-400 absolute" style={{ transform: "translate(1px, 1px)" }} />
              {isHighlighted("espnow_signals") && (
                <circle cx="6" cy="6" r="8" fill="none" stroke="#2563EB" strokeWidth="1" className="animate-ping" />
              )}
            </g>

            {/* Processor IC representation */}
            <rect x="15" y="38" width="34" height="42" rx="4" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="20" y="44" width="24" height="28" rx="2" fill="#1E293B" />
            <text x="32" y="58" fill="#60A5FA" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ESP32</text>
            <text x="32" y="66" fill="#94A3B8" fontSize="5" fontFamily="monospace" textAnchor="middle">CORE 01</text>
            
            {/* Pin rows */}
            <line x1="12" y1="42" x2="12" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />
            <line x1="52" y1="42" x2="52" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />

            {/* Micro details: crystal oscillator, tiny LED */}
            <rect x="30" y="81" width="6" height="4" rx="1" fill="#94A3B8" />
            <circle cx="43" cy="83" r="1.5" fill="#EF4444" /> {/* red power LED */}
            <circle cx="19" cy="83" r="1.5" fill="#10B981" className="animate-pulse" /> {/* flashing status LED */}

            {/* Embedded HMI Label */}
            <text x="105" y="52" fill="#F8FAFC" fontSize="7.5" fontWeight="bold">I2C HMI BUS</text>
            <text x="105" y="64" fill="#38BDF8" fontSize="7" fontFamily="sans-serif">LCD 20x4 Display</text>
            <text x="105" y="74" fill="#60A5FA" fontSize="7" fontFamily="sans-serif">DS3231 RTC Clck</text>
            <text x="105" y="84" fill="#A78BFA" fontSize="7" fontFamily="sans-serif">DHT22 Temp/Hum</text>
          </g>

          {/* 4. NODE 2: TELEMETRY ACQUISITION (ANALOG SENSORS HUB) */}
          <g 
            id="node2-block" 
            transform="translate(80, 260)" 
            filter="url(#block-shadow)"
            opacity={isHighlighted("node2") || currentStep === 0 ? 1.0 : 0.35} 
            className="transition-all duration-500 cursor-pointer"
            onClick={() => { onChangeStep(2); setIsPlaying(false); }}
          >
            <rect x="0" y="0" width="160" height="95" rx="10" fill="#0F172A" stroke={isHighlighted("node2") ? "#10B981" : "#1E293B"} strokeWidth="2.5" />
            <rect x="0" y="0" width="160" height="24" rx="10" fill="#065F46" />
            <text x="80" y="15" fill="#E2E8F0" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">
              {isArabic ? "عقدة 2: تتبع وقراءة التربة والمياه" : "NODE 2: SENSOR TELEMETRIC"}
            </text>

            <g transform="translate(142, 6)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="#1E293B" />
              <Wifi className="w-2.5 h-2.5 text-emerald-400 absolute" style={{ transform: "translate(1px, 1px)" }} />
              {isHighlighted("espnow_signals") && (
                <circle cx="6" cy="6" r="8" fill="none" stroke="#10B981" strokeWidth="1" className="animate-ping" />
              )}
            </g>

            {/* Processor IC */}
            <rect x="15" y="38" width="34" height="42" rx="4" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="20" y="44" width="24" height="28" rx="2" fill="#1E293B" />
            <text x="32" y="58" fill="#34D399" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ESP32</text>
            <text x="32" y="66" fill="#94A3B8" fontSize="5" fontFamily="monospace" textAnchor="middle">CORE 02</text>
            
            <line x1="12" y1="42" x2="12" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />
            <line x1="52" y1="42" x2="52" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />

            <circle cx="43" cy="83" r="1.5" fill="#EF4444" />
            {/* Dual blinking indicator and ADC protection text */}
            <circle cx="19" cy="83" r="1.5" fill="#10B981" className="animate-[pulse_1s_infinite]" />

            <rect x="74" y="38" width="76" height="44" rx="4" fill="#1E293B" stroke="#047857" strokeWidth="1" />
            <text x="112" y="49" fill="#34D399" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ADC1-ONLY PORT</text>
            <text x="80" y="60" fill="#94A3B8" fontSize="6" fontFamily="sans-serif">Ch4-6: Capacitive VWC</text>
            <text x="80" y="68" fill="#94A3B8" fontSize="6" fontFamily="sans-serif">Ch7: TDS Salt probe</text>
            <text x="80" y="76" fill="#94A3B8" fontSize="6" fontFamily="sans-serif">Ch0: Rain Sensor plate</text>
          </g>

          {/* 5. NODE 3: HIGH-CURRENT ACTUATOR DRIVER (VALVES & PUMPS) */}
          <g 
            id="node3-block" 
            transform="translate(560, 160)" 
            filter="url(#block-shadow)"
            opacity={isHighlighted("node3") || currentStep === 0 ? 1.0 : 0.35} 
            className="transition-all duration-500 cursor-pointer"
            onClick={() => { onChangeStep(3); setIsPlaying(false); }}
          >
            <rect x="0" y="0" width="160" height="95" rx="10" fill="#0F172A" stroke={isHighlighted("node3") ? "#8B5CF6" : "#1E293B"} strokeWidth="2.5" />
            <rect x="0" y="0" width="160" height="24" rx="10" fill="#5B21B6" />
            <text x="80" y="15" fill="#E2E8F0" fontSize="9" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">
              {isArabic ? "عقدة ٣: مشغّلات الري وصمام الطاقة" : "NODE 3: ACTUATOR EXECUTIVE"}
            </text>

            <g transform="translate(142, 6)">
              <rect x="0" y="0" width="12" height="12" rx="2" fill="#1E293B" />
              <Wifi className="w-2.5 h-2.5 text-purple-400 absolute" style={{ transform: "translate(1px, 1px)" }} />
              {isHighlighted("espnow_signals") && (
                <circle cx="6" cy="6" r="8" fill="none" stroke="#8B5CF6" strokeWidth="1" className="animate-ping" />
              )}
            </g>

            {/* Processor IC */}
            <rect x="15" y="38" width="34" height="42" rx="4" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="20" y="44" width="24" height="28" rx="2" fill="#1E293B" />
            <text x="32" y="58" fill="#A78BFA" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ESP32</text>
            <text x="32" y="66" fill="#94A3B8" fontSize="5" fontFamily="monospace" textAnchor="middle">CORE 03</text>
            
            <line x1="12" y1="42" x2="12" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />
            <line x1="52" y1="42" x2="52" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="2 2" />

            <circle cx="43" cy="83" r="1.5" fill="#EF4444" />
            <circle cx="19" cy="83" r="1.5" fill="#8B5CF6" className="animate-pulse" />

            <g transform="translate(72, 38)">
              <rect x="0" y="0" width="76" height="44" rx="4" fill="#1E293B" stroke="#6D28D9" strokeWidth="1" />
              <text x="38" y="10" fill="#A78BFA" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SUPPRESSION NET</text>
              <text x="6" y="20" fill="#EF4444" fontSize="5.5" fontWeight="semibold" fontFamily="sans-serif">● 1N5408 Diodes</text>
              <text x="6" y="28" fill="#F59E0B" fontSize="5.5" fontWeight="semibold" fontFamily="sans-serif">● 3300uF Cap Filter</text>
              <text x="6" y="36" fill="#38BDF8" fontSize="5.5" fontWeight="semibold" fontFamily="sans-serif">● PC817 Opto Isolated</text>
            </g>
          </g>


          {/* ========================================================
              PERIPHERAL MODULES (LCD, RELAYS, PUMPS, SENSORS)
              ======================================================== */}

          {/* STEP 5 Peripheral: CHARACTER DISPLAY SCREEN & RTC CLOCK */}
          <g 
            id="lcd-chrono-group" 
            opacity={isHighlighted("lcd_screen") || currentStep === 0 ? 1.0 : 0.2} 
            className="transition-all duration-500"
          >
            {/* LCD Screen at top left */}
            <g transform="translate(30, -5)">
              <rect x="0" y="0" width="130" height="35" rx="4" fill="#125E8A" stroke="#0284C7" strokeWidth="1.5" />
              <rect x="5" y="4" width="120" height="27" fill="#042F4B" />
              <text x="12" y="14" fill="#38BDF8" fontSize="6.5" fontFamily="monospace" fontWeight="semibold">TDS VALUE: 120 PPM</text>
              <text x="12" y="22" fill="#38BDF8" fontSize="6.5" fontFamily="monospace" fontWeight="semibold">ZONE_01 ACTIVE WATER</text>
            </g>

            {/* DS3231 Chrono RTC card adjacent to coordinate */}
            <g transform="translate(230, 85)" filter="url(#block-shadow)">
              <rect x="0" y="0" width="55" height="30" rx="3" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
              <circle cx="15" cy="15" r="9" fill="#4B5563" stroke="#94A3B8" strokeWidth="1" /> {/* coin cell battery */}
              <text x="15" y="17" fill="#F1F5F9" fontSize="6" fontFamily="sans-serif" textAnchor="middle">3V</text>
              <text x="40" y="12" fill="#93C5FD" fontSize="6" fontFamily="serif" fontWeight="bold">DS3231</text>
              <text x="40" y="22" fill="#38BDF8" fontSize="5" fontFamily="monospace" fontWeight="bold">CLOCK</text>
            </g>
          </g>

          {/* STEP 3 Peripherals: RHIZOSPHERE ANALOG SENSORS ARRAY */}
          <g 
            id="sensors-array-group" 
            opacity={isHighlighted("soilmoisture") || currentStep === 0 ? 1.0 : 0.25} 
            className="transition-all duration-500"
          >
            {/* Capacitive moisture probe V1.2 (Subsurface placement representation) */}
            <g transform="translate(85, 410)" filter="url(#block-shadow)">
              <rect x="0" y="0" width="22" height="55" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              {/* Copper tracing graphics */}
              <line x1="6" y1="10" x2="6" y2="45" stroke="#B45309" strokeWidth="1.5" />
              <line x1="16" y1="10" x2="16" y2="45" stroke="#B45309" strokeWidth="1.5" />
              <rect x="0" y="0" width="22" height="15" rx="3" fill="#022C22" />
              <text x="11" y="10" fill="#34D399" fontSize="6" fontFamily="monospace" textAnchor="middle">V1.2</text>
              <text x="11" y="52" fill="#475569" fontSize="5" fontFamily="sans-serif" textAnchor="middle">SOIL</text>
            </g>

            {/* Analog TDS Salinity Module Probe (with dual aerospace titanium pins) */}
            <g transform="translate(160, 410)" filter="url(#block-shadow)">
              <rect x="0" y="0" width="30" height="35" rx="4" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1" />
              <text x="15" y="12" fill="#E2E8F0" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TDS V1</text>
              <circle cx="10" cy="24" r="3" fill="#475569" />
              <circle cx="20" cy="24" r="3" fill="#475569" />
              {/* Pins descending into fluid receptacle */}
              <line x1="10" y1="27" x2="10" y2="48" stroke="#E2E8F0" strokeWidth="2.5" />
              <line x1="20" y1="27" x2="20" y2="48" stroke="#E2E8F0" strokeWidth="2.5" />
              {/* Titanium tag lock */}
              <rect x="4" y="44" width="22" height="4" fill="#94A3B8" rx="1" />
            </g>

            {/* Rain droplets level plate */}
            <g transform="translate(250, 410)" filter="url(#block-shadow)">
              <rect x="0" y="0" width="35" height="35" rx="4" fill="#1E293B" stroke="#DB2777" strokeWidth="1" transform="rotate(-15)" />
              {/* Zig-Zag gold plated comb traces */}
              <path d="M 5 5 L 5 25 L 10 25 L 10 5 L 15 5 L 15 25 L 20 25 L 20 5 L 25 5 L 25 25" stroke="#D97706" strokeWidth="1" fill="none" transform="rotate(-15) translate(4, 2)" />
              <text x="12" y="32" fill="#E2E8F0" fontSize="5.5" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-15)">RAIN</text>
            </g>

            {/* DS18B20 waterproof probe representation */}
            <g transform="translate(10, 420)" filter="url(#block-shadow)">
              {/* Marine case metal jacket */}
              <rect x="0" y="0" width="10" height="40" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
              <line x1="5" y1="0" x2="5" y2="35" stroke="#334155" strokeWidth="1" />
              <rect x="-3" y="10" width="16" height="6" rx="1.5" fill="#D946EF" />
              <text x="5" y="15" fill="#FFFFFF" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">TEMP</text>
            </g>
          </g>

          {/* STEP 4 Peripherals: RELAYS, INDUCTIVE PUMP & SOLENOID VALVES */}
          <g 
            id="actuator-suppress-group" 
            opacity={isHighlighted("relays") || currentStep === 0 || testState !== "idle" ? 1.0 : 0.25} 
            className="transition-all duration-500 cursor-pointer group/suppress"
            onClick={triggerSimulatedTest}
          >
            {/* CNC / Industrial Tactile Test Toggle Button */}
            <g 
              id="actuator-test-toggle"
              transform="translate(685, 252)" 
              className="cursor-pointer group/toggle pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulatedTest();
              }}
            >
              {/* Outer button bezel / frame */}
              <rect 
                x="-58" 
                y="-13" 
                width="116" 
                height="22" 
                rx="6" 
                fill={testState !== "idle" ? "#0F0B26" : "#0F172A"} 
                stroke={testState !== "idle" ? "#C084FC" : "#334155"} 
                strokeWidth="1.5" 
                className="transition-all duration-300 group-hover/toggle:stroke-purple-500"
                style={{
                  filter: testState !== "idle" ? "url(#svg-neon-glow)" : "none"
                }}
              />
              
              {/* Dynamic status colored circle (analog LED indicator) */}
              <circle 
                cx="-45" 
                cy="-2" 
                r="3.5" 
                fill={testState === "active" ? "#22D3EE" : testState === "deenergizing" ? "#F59E0B" : testState === "energizing" ? "#C084FC" : "#475569"} 
                className={testState === "active" ? "animate-pulse" : ""}
              />
              
              {/* Slider track */}
              <rect x="-5" y="-7" width="16" height="8" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
              {/* Active/Inactive slider knob */}
              <circle 
                cx={testState !== "idle" ? "7" : "-1"} 
                cy="-3" 
                r="3" 
                fill={testState !== "idle" ? "#10B981" : "#94A3B8"} 
                className="transition-all duration-300"
              />

              {/* Action text label */}
              <text 
                x={32} 
                y="-1.5" 
                fill={testState !== "idle" ? "#FFFFFF" : "#94A3B8"} 
                fontSize="6" 
                fontWeight="bold" 
                fontFamily="monospace"
                textAnchor="middle"
              >
                {testState !== "idle" ? "SIM ACTIVE" : "SIM ON/OFF"}
              </text>

              <text 
                x={-20} 
                y="-1.5" 
                fill={testState !== "idle" ? "#C084FC" : "#64748B"} 
                fontSize="6" 
                fontWeight="black" 
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {isArabic ? "محاكاة" : "SIMULATE"}
              </text>
            </g>

            {/* Industrial 4-Channel 12V Isolated Relay Unit */}
            <g transform="translate(620, 280)" filter="url(#block-shadow)">
              <rect x="-60" y="-5" width="130" height="50" rx="6" fill="#111827" stroke={testState === "active" ? "#22D3EE" : "#10B981"} strokeWidth="1" className="transition-all duration-300" />
              <text x="5" y="6" fill={testState === "active" ? "#22D3EE" : "#10B981"} fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {isArabic ? "لوحة ترحيل معزولة كهرضوئياً" : "4-CH OPTO-ISOLATED RELAY BOARD"}
              </text>
              
              {/* 4 Relays blocks inside Songle blue style */}
              {[-45, -15, 15, 45].map((xOffset, idx) => (
                <g key={idx} transform={`translate(${xOffset}, 12)`}>
                  <rect x="-10" y="0" width="20" height="24" rx="2" fill={testState === "active" ? "#1D4ED8" : "#0284C7"} stroke={testState === "active" ? "#60A5FA" : "#0369A1"} strokeWidth="1" className="transition-all duration-200" />
                  <text x="0" y="8" fill="#FFFFFF" fontSize="5.5" fontWeight="black" fontFamily="monospace" textAnchor="middle">SRD</text>
                  
                  {/* Dynamic Relay Contact Schematic Diagram */}
                  <g transform="translate(0, 16)">
                    {/* Common terminal */}
                    <circle cx="-5" cy="0" r="0.7" fill="#E2E8F0" />
                    
                    {/* NC Terminal */}
                    <circle cx="5" cy="3" r="0.7" fill={testState === "active" ? "#475569" : "#EF4444"} />
                    
                    {/* NO Terminal */}
                    <circle cx="5" cy="-3" r="0.7" fill={testState === "active" ? "#22D3EE" : "#475569"} />
                    
                    {/* Rotating Contact Arm */}
                    <line 
                      x1="-5" 
                      y1="0" 
                      x2="4.5" 
                      y2={testState === "active" ? -3 : 3} 
                      stroke={testState === "active" ? "#22D3EE" : "#FFFFFF"} 
                      strokeWidth="1.2" 
                      className="transition-all duration-300"
                      style={testState === "active" ? { filter: "url(#svg-neon-glow)" } : undefined}
                    />
                  </g>

                  {/* Blinking indicator optical LED */}
                  <circle cx="0" cy="27" r="1.5" fill={testState === "active" ? "#10B981" : isHighlighted("actuatorwires") ? "#10B981" : "#475569"} className={testState === "active" ? "animate-ping" : isHighlighted("actuatorwires") ? "animate-pulse" : ""} style={{ transformOrigin: "0px 27px" }} />
                </g>
              ))}
            </g>

            {/* Direct NC Solenoid Valve unit representation */}
            <g transform="translate(740, 275)" filter="url(#block-shadow)">
              {/* Electromagnetic flux lines around the coil cap */}
              <g opacity={testState === "active" ? 0.9 : 0} className="transition-opacity duration-300 pointer-events-none">
                {/* Outer Left Flux Loop */}
                <path 
                  d="M 18 -10 C -12 -22, -12 30, 18 18" 
                  stroke="#A78BFA" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="4 2"
                  className="animate-[dash_1.5s_linear_infinite]"
                  style={{ filter: "url(#svg-neon-glow)" }}
                />
                {/* Inner Left Flux Loop */}
                <path 
                  d="M 18 -6 C 1 -14, 1 22, 18 14" 
                  stroke="#F472B6" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeDasharray="3 2"
                  className="animate-[dash_1s_linear_infinite]"
                />
                
                {/* Outer Right Flux Loop */}
                <path 
                  d="M 40 -10 C 70 -22, 70 30, 40 18" 
                  stroke="#A78BFA" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="4 2"
                  className="animate-[dash_1.5s_linear_infinite]"
                  style={{ filter: "url(#svg-neon-glow)" }}
                />
                {/* Inner Right Flux Loop */}
                <path 
                  d="M 40 -6 C 57 -14, 57 22, 40 14" 
                  stroke="#F472B6" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeDasharray="3 2"
                  className="animate-[dash_1s_linear_infinite]"
                />
              </g>

              <rect x="18" y="-10" width="22" height="28" rx="3" fill={testState === "active" ? "#7C2D12" : "#1E293B"} stroke={testState === "active" ? "#F97316" : "#475569"} strokeWidth="1.5" className="transition-all duration-350" /> {/* electromagnetic coil cap */}
              <rect x="10" y="18" width="38" height="18" rx="2" fill={testState === "active" ? "#E5E7EB" : "#D1D5DB"} stroke={testState === "active" ? "#9CA3AF" : "#9CA3AF"} strokeWidth="1" /> {/* brass body */}
              {/* Red Coil Wire points */}
              <line x1="22" y1="-10" x2="22" y2="5" stroke="#EF4444" strokeWidth="1.5" />
              <line x1="36" y1="-10" x2="36" y2="5" stroke="#1E293B" strokeWidth="1.5" />

              {/* Clamping Current Loop Particles during De-energizing */}
              {testState === "deenergizing" && (
                <g className="pointer-events-none">
                  {/* Glowing loop path representation */}
                  <path 
                    d="M 36 5 L 36 -15 L 22 -15 L 22 5 Z" 
                    stroke="#EF4444" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeDasharray="4 4"
                    className="animate-[dash_0.8s_linear_infinite]"
                    style={{ filter: "url(#svg-neon-glow)" }}
                    opacity="0.65"
                  />
                  {/* Energy transition particles circulating around the loop through the diode */}
                  <circle r="2.8" fill="#FBBF24" style={{ filter: "url(#svg-neon-glow)" }}>
                    <animateMotion 
                      path="M 36 5 L 36 -15 L 22 -15 L 22 5 Z" 
                      dur="0.5s" 
                      repeatCount="indefinite" 
                    />
                  </circle>
                  <circle r="2.2" fill="#F97316" style={{ filter: "url(#svg-neon-glow)" }}>
                    <animateMotion 
                      path="M 36 5 L 36 -15 L 22 -15 L 22 5 Z" 
                      dur="0.5s" 
                      begin="0.12s"
                      repeatCount="indefinite" 
                    />
                  </circle>
                  <circle r="1.8" fill="#FFFFFF" style={{ filter: "url(#svg-neon-glow)" }}>
                    <animateMotion 
                      path="M 36 5 L 36 -15 L 22 -15 L 22 5 Z" 
                      dur="0.5s" 
                      begin="0.25s"
                      repeatCount="indefinite" 
                    />
                  </circle>
                  <circle r="1.5" fill="#EF4444" style={{ filter: "url(#svg-neon-glow)" }}>
                    <animateMotion 
                      path="M 36 5 L 36 -15 L 22 -15 L 22 5 Z" 
                      dur="0.5s" 
                      begin="0.38s"
                      repeatCount="indefinite" 
                    />
                  </circle>
                </g>
              )}

              {/* 1N5408 Clamping flyback Diode soldered in parallel across the poles */}
              <g transform="translate(20, -18)">
                <rect x="0" y="0" width="18" height="6" rx="1.5" fill={testState === "deenergizing" ? "#DC2626" : "#0F172A"} stroke={testState === "deenergizing" ? "#F59E0B" : "#475569"} strokeWidth={testState === "deenergizing" ? "1.5" : "0.5"} />
                <rect x="13" y="0" width="4" height="6" fill={testState === "deenergizing" ? "#FBBF24" : "#F1F5F9"} /> {/* Cathode band stripe indicator */}
                {testState === "deenergizing" && (
                  <>
                    <circle cx="9" cy="3" r="16" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-ping" style={{ transformOrigin: "9px 3px" }} />
                    <circle cx="9" cy="3" r="8" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-pulse" style={{ transformOrigin: "9px 3px" }} />
                  </>
                )}
                <text x="9" y="5" fill={testState === "deenergizing" ? "#FFFFFF" : "#34D399"} fontSize="4" fontFamily="sans-serif" fontWeight="bold">1N</text>
              </g>

              {testState === "deenergizing" && (
                <g transform="translate(29, -26)">
                  <rect x="-35" y="-6" width="70" height="12" rx="3" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" />
                  <text x="0" y="2" fill="#FCA5A5" fontSize="4.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="text-[5px]">
                    {isArabic ? "ارتداد مكبوح" : "SPIKE CLAMPED!"}
                  </text>
                </g>
              )}

              <text x="29" y="30" fill="#1E293B" fontSize="6" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Z_SOLENOID</text>
            </g>

            {/* Brushless Commutated TX10 Liquid Pump representation */}
            <g transform="translate(735, 360)" filter="url(#block-shadow)">
              <circle cx="22" cy="22" r="20" fill={testState === "active" ? "#1E3A8A" : "#334155"} stroke={testState === "active" ? "#38BDF8" : "#475569"} strokeWidth="1.5" className="transition-all duration-300" />
              <circle cx="22" cy="22" r="15" fill="#1E293B" />
              {/* Fan impeller detailing in the brushless core */}
              <path 
                d="M 22 22 L 22 7 M 22 22 L 32 30 M 22 22 L 12 30" 
                stroke="#38BDF8" 
                strokeWidth="3" 
                strokeLinecap="round" 
                className={testState === "active" ? "animate-[spin_0.8s_linear_infinite]" : isHighlighted("actuatorwires") ? "animate-[spin_4s_linear_infinite]" : ""} 
                style={{ transformOrigin: "22px 22px" }} 
              />
              {/* Waterproof epoxy outlet nozzle */}
              <rect x="-10" y="15" width="15" height="8" fill="#1E293B" rx="1" />
              <text x="22" y="25" fill="#E2E8F0" fontSize="5.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TX10</text>
            </g>

            {/* REAL-TIME SIMULATION ELECTRICAL TELEMETRY HUD TOOLTIP */}
            <g 
              id="actuator-telemetry-tooltip"
              className={`pointer-events-none ${testState !== "idle" ? "tooltip-active" : "tooltip-hidden"}`}
            >
              {/* Backdrop plate with neon aesthetic glow */}
              <rect 
                x="-5" 
                y="-5" 
                width="135" 
                height="72" 
                rx="6" 
                fill="#090D1E" 
                stroke={testState === "active" ? "#22D3EE" : testState === "deenergizing" ? "#F59E0B" : "#C084FC"} 
                strokeWidth="1.5" 
                opacity="0.95"
                style={{ filter: "url(#svg-neon-glow)" }}
              />
              
              {/* Decorative sub-grid/header */}
              <path d="M -5 13 L 130 13" stroke="#1E293B" strokeWidth="1" />
              
              {/* Telemetry Title */}
              <text x="5" y="8" fill="#94A3B8" fontSize="5.5" fontWeight="black" fontFamily="monospace">
                {isArabic ? "📡 مراقبة الطاقة المباشرة" : "⚡ LIVE POWER TELEMETRY"}
              </text>
              
              {/* Glowing simulation phase badge */}
              <g transform="translate(100, 3)">
                <rect 
                  x="-20" 
                  y="0" 
                  width="45" 
                  height="7" 
                  rx="2.5" 
                  fill={testState === "active" ? "#155E75" : testState === "deenergizing" ? "#78350F" : "#581C87"} 
                />
                <text 
                  x="2.5" 
                  y="5.2" 
                  fill="#FFFFFF" 
                  fontSize="4.5" 
                  fontWeight="black" 
                  fontFamily="monospace" 
                  textAnchor="middle"
                >
                  {testState.toUpperCase()}
                </text>
              </g>

              {/* Voltage Metric Block */}
              <g transform="translate(5, 25)">
                <text x="0" y="0" fill="#64748B" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  {isArabic ? "جهد الحمل (LOAD VOLTS):" : "LOAD VOLTAGE:"}
                </text>
                <text 
                  x="0" 
                  y="10" 
                  fill={telemetry.voltage > 10 ? "#22D3EE" : telemetry.voltage < 0 ? "#F87171" : "#E2E8F0"} 
                  fontSize="9" 
                  fontWeight="black" 
                  fontFamily="monospace"
                >
                  {telemetry.voltage >= 0 ? `+${telemetry.voltage.toFixed(2)}` : `${telemetry.voltage.toFixed(2)}`} VDC
                </text>
              </g>

              {/* Current Metric Block */}
              <g transform="translate(5, 48)">
                <text x="0" y="0" fill="#64748B" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  {isArabic ? "تيار الحمل (LOAD AMPS):" : "LOAD CURRENT:"}
                </text>
                <text 
                  x="0" 
                  y="10" 
                  fill={telemetry.current > 1.0 ? "#34D399" : telemetry.current > 0 ? "#FBBF24" : "#94A3B8"} 
                  fontSize="9" 
                  fontWeight="black" 
                  fontFamily="monospace"
                >
                  {telemetry.current.toFixed(3)} ADC
                </text>
              </g>

              {/* Coil Trigger Block */}
              <g transform="translate(72, 25)">
                <text x="0" y="0" fill="#64748B" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  {isArabic ? "جهد الملف (COIL V):" : "COIL TRIGGER:"}
                </text>
                <text x="0" y="10" fill="#C084FC" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  {telemetry.coilVoltage.toFixed(2)} V
                </text>
              </g>

              {/* Induction Flux Field Strength Gauge */}
              <g transform="translate(72, 48)">
                <text x="0" y="0" fill="#64748B" fontSize="5" fontWeight="bold" fontFamily="monospace">
                  {isArabic ? "حقل الملف (FLUX):" : "MAG FIELD:"}
                </text>
                <text x="0" y="10" fill="#F472B6" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  {telemetry.fieldStrength} G
                </text>
              </g>

              {/* Mini diagnostic warning label for active clamping */}
              {telemetry.spikeClamped && (
                <g transform="translate(68, 62)">
                  <rect x="-1" y="-5" width="60" height="7.5" rx="1.5" fill="#7F1D1D" />
                  <text x="29" y="0.5" fill="#FCA5A5" fontSize="4" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="animate-pulse">
                    {isArabic ? "⚠️ تفعيل الدايود الكابح" : "⚠️ DIODE CLAMPED"}
                  </text>
                </g>
              )}
              
              {/* Rightward pointing anchor bubble line towards relay inputs */}
              <path d="M 130 31 L 138 31" stroke={testState === "active" ? "#22D3EE" : "#C084FC"} strokeWidth="1.5" />
              <circle cx="138" cy="31" r="1.5" fill={testState === "active" ? "#22D3EE" : "#C084FC"} />
            </g>
          </g>


          {/* ========================================================
              ESP-NOW P2P DECENTRALIZED WIRELESS BRIDGES (STEP 5 Animation)
              ======================================================== */}
          
          {/* Pulsing signal telemetry packet propagation lines */}
          <g id="wireless-p2p" opacity={isHighlighted("espnow_signals") ? 1.0 : 0.05} className="transition-opacity duration-1000">
            {/* Communication link between Master (Node 1) and Sensor Acquisition (Node 2) */}
            <path 
              d="M 120 145 C 90 200, 110 230, 150 260" 
              stroke="#06B6D4" 
              strokeWidth="2.5" 
              fill="none" 
              strokeDasharray="5 5" 
              className={isHighlighted("espnow_signals") ? "animate-[dash_12s_linear_infinite]" : ""}
              style={{ filter: "url(#svg-neon-glow)" }}
            />
            {/* Direct control broadcast channel from Master Coordinator (Node 1) to Relay Muscle (Node 3) */}
            <path 
              d="M 200 110 C 350 110, 450 110, 560 180" 
              stroke="#A78BFA" 
              strokeWidth="3.5" 
              fill="none" 
              strokeDasharray="7 5" 
              className={isHighlighted("espnow_signals") ? "animate-[dash_10s_linear_infinite]" : ""}
              style={{ filter: "url(#svg-neon-glow)" }}
            />
            
            {/* Glowing wireless waves emanating from antennas */}
            <path d="M 160 30 A 15 15 0 0 1 180 44" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
            <path d="M 160 30 A 25 25 0 0 1 190 52" fill="none" stroke="#60A5FA" strokeWidth="1" strokeLinecap="round" />
            
            <path d="M 200 240 A 15 15 0 0 1 210 255" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
            
            {/* Text labels for wireless transmission packets */}
            <g transform="translate(145, 195)">
              <rect x="-42" y="-9" width="84" height="15" rx="3.5" fill="#0F172A" stroke="#0891B2" strokeWidth="1" />
              <text x="0" y="1" fill="#22D3EE" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                ESP-NOW ESP32 BUS
              </text>
            </g>
            <g transform="translate(365, 125)">
              <rect x="-45" y="-9" width="90" height="15" rx="3.5" fill="#0F172A" stroke="#7C3AED" strokeWidth="1" />
              <text x="0" y="1" fill="#C084FC" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                P2P LOW-LATENCY PACKET
              </text>
            </g>
          </g>

        </svg>

      </div>

      {/* Live Simulation Console Readout */}
      {isTestRunning && (
        <div 
          className="bg-slate-950/90 border border-purple-500/30 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-[10px] sm:text-[11px] transition-all duration-300 shadow-md shadow-purple-950/20"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
            <span className="text-purple-300 uppercase font-black tracking-wider text-[11px]">
              {isArabic ? "تقرير محاكاة الاختبار المباشر:" : "Live Test Simulation Tracker:"}
            </span>
          </div>
          <div className="text-slate-300 font-medium flex-1 sm:text-right">
            {testState === "energizing" && (
              <span className="text-amber-400 animate-pulse">
                {isArabic 
                  ? "تفعيل ملف تشغيل المرحل (Relay Coils Energizing ● Isolation Activated)" 
                  : "Relay control signals high ● Internal optocoupler activation..."}
              </span>
            )}
            {testState === "active" && (
              <span className="text-cyan-400">
                {isArabic 
                  ? "المرحلات مغلقة ● تدفق تيار الـ 12V ● الملف الكهرومغناطيسي للصمام مفتوح والمضخة تعمل بأقصى سرعة" 
                  : "Relay contacts closed ● 12v flow path active ● Solenoid open & brushless pump spinning"}
              </span>
            )}
            {testState === "deenergizing" && (
              <span className="text-rose-400 font-bold animate-[pulse_1s_infinite]">
                {isArabic 
                  ? "قطع التغذية المفاجئ ⚡ الارتداد المغناطيسي العالي تم امتصاصه بنجاح عبر ديود الحماية 1N5408!" 
                  : "Coil power cut off! ⚡ Huge negative voltage spike clamped safely by Flyback Diode 1N5408!"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Assembly step brief walkthrough overlay caption */}
      <div 
        className={`bg-slate-900 border-l-4 ${activeHighlight.color} p-4 rounded-xl flex flex-col gap-1 transition-all duration-300 font-sans`}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <span className="text-[10px] uppercase font-mono font-black text-slate-500 tracking-wider">
          {isArabic ? "توجية المحاكاة العتادية" : "Current Physical Step Guidance"}
        </span>
        <h5 className="text-white text-xs md:text-sm font-black flex items-center gap-1.5 leading-snug">
          <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
          {isArabic ? activeHighlight.titleAr : activeHighlight.titleEn}
        </h5>
        <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed mt-1">
          {isArabic ? activeHighlight.descAr : activeHighlight.descEn}
        </p>
      </div>

      {/* Embedded style tag for standard SVG dash offset animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translate(485px, 282px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(485px, 275px) scale(1);
          }
        }
        .tooltip-active {
          animation: tooltipFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: 485px 275px;
        }
        .tooltip-hidden {
          opacity: 0;
          transform: translate(485px, 282px) scale(0.95);
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: 485px 275px;
        }
      `}</style>

    </div>
  );
}
