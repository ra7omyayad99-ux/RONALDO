import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEM_COMPONENTS } from '../data';
import { ComponentSpec } from '../types';
import { Search, Layers, ShieldCheck, Cpu, Info, Check, Sparkles, MapPin, ClipboardList, HelpCircle, Sprout, Droplet, CloudRain, Thermometer, Fan, Zap, Wrench } from 'lucide-react';

const getComponentMiniIcon = (compId: string) => {
  switch (compId) {
    case 'esp32':
      return <Cpu className="w-4.5 h-4.5 text-blue-600" />;
    case 'tds_sensor':
      return <Droplet className="w-4.5 h-4.5 text-emerald-600" />;
    case 'soil_moisture':
      return <Sprout className="w-4.5 h-4.5 text-emerald-600" />;
    case 'solenoid_valve':
      return <Layers className="w-4.5 h-4.5 text-rose-600" />;
    case 'submersible_pump':
      return <Fan className="w-4.5 h-4.5 text-rose-600" />;
    case 'switching_ps':
      return <Zap className="w-4.5 h-4.5 text-amber-600" />;
    case 'lm2596':
      return <Zap className="w-4.5 h-4.5 text-amber-600" />;
    case 'relays_4ch':
      return <Cpu className="w-4.5 h-4.5 text-rose-600" />;
    case 'dht22':
      return <Thermometer className="w-4.5 h-4.5 text-emerald-600" />;
    case 'rain_sensor':
      return <CloudRain className="w-4.5 h-4.5 text-emerald-600" />;
    case 'ds18b20':
      return <Thermometer className="w-4.5 h-4.5 text-emerald-600" />;
    case 'multimeter':
    case 'soldering_iron':
    case 'wire_stripper':
    case 'oscilloscope':
    case 'calibration_meter':
      return <Wrench className="w-4.5 h-4.5 text-blue-600" />;
    default:
      return <Cpu className="w-4.5 h-4.5 text-slate-500" />;
  }
};

const renderComponentImage = (compId: string) => {
  switch (compId) {
    case 'esp32':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-esp32">
          {/* PCB development board */}
          <rect x="25" y="15" width="150" height="90" rx="6" fill="#1b2a4a" stroke="#253e6d" strokeWidth="2" />
          {/* ESP-WROOM-32 Metal Shield */}
          <rect x="55" y="30" width="55" height="55" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="58" y="33" width="49" height="15" rx="1.5" fill="#64748b" />
          <text x="62" y="44" className="text-[6.5px] font-mono font-bold fill-slate-100" textAnchor="start">ESP32-S</text>
          <text x="62" y="58" className="text-[5.5px] font-mono fill-slate-350" textAnchor="start">FCC ID: 2AC7Z</text>
          <text x="62" y="67" className="text-[5.5px] font-mono fill-slate-350" textAnchor="start">KDB9399X</text>
          <text x="62" y="76" className="text-[5px] font-mono fill-amber-400 font-bold" textAnchor="start">ESPRESSIF</text>
          
          {/* Onboard PCB trace antenna at left edge of module */}
          <path d="M 54 35 L 43 35 L 43 45 L 50 45 L 50 55 L 43 55 L 43 65 L 50 65 L 50 75 L 43 75 L 43 83 L 54 83" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <rect x="40" y="30" width="13" height="55" fill="none" stroke="#3b4f74" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Header Pins - Top & Bottom of Dev Board */}
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={`top-pin-${i}`}>
              <rect x={35 + i * 8.5} y="15" width="4" height="6" fill="#f59e0b" rx="0.5" />
              <rect x={35 + i * 8.5} y="21" width="4" height="4" fill="#334155" />
            </g>
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={`bot-pin-${i}`}>
              <rect x={35 + i * 8.5} y="99" width="4" height="6" fill="#f59e0b" rx="0.5" />
              <rect x={35 + i * 8.5} y="95" width="4" height="4" fill="#334155" />
            </g>
          ))}

          {/* Micro USB Port */}
          <rect x="163" y="47" width="13" height="26" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          <rect x="165" y="53" width="9" height="14" rx="1" fill="#1e293b" />

          {/* Onboard LEDs and Buttons */}
          <circle cx="150" cy="35" r="2.5" fill="#ef4444" className="animate-pulse" /> {/* Red Power Led */}
          <rect x="145" y="32.5" width="3" height="5" fill="#f1f5f9" rx="0.5" />
          <circle cx="150" cy="85" r="2.5" fill="#3b82f6" /> {/* Blue Active Led */}
          <rect x="145" y="82.5" width="3" height="5" fill="#f1f5f9" rx="0.5" />

          {/* Regulatory / Revision tags */}
          <text x="135" y="65" className="text-[7px] font-mono fill-slate-400 rotate-90" textAnchor="middle">NodeMCU-32S</text>
        </svg>
      );
    case 'tds_sensor':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-tds">
          {/* Water vessel outline context */}
          <rect x="15" y="10" width="80" height="100" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <path d="M 15 45 C 35 40, 55 50, 75 45 C 85 42, 90 44, 95 45 L 95 102 C 95 106, 91 110, 87 110 L 23 110 C 19 110, 15 106, 15 102 Z" fill="#0284c7" fillOpacity="0.25" />
          <path d="M 15 45 C 35 40, 55 50, 75 45 C 85 42, 90 44, 95 45" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

          {/* TDS Waterproof Cylindrical Probe submerged */}
          <rect x="45" y="30" width="20" height="60" rx="3" fill="#111827" stroke="#4b5563" strokeWidth="1" />
          <rect x="51" y="20" width="8" height="15" fill="#4b5563" rx="1" />
          
          {/* Metal contacts/pins at the bottom */}
          <line x1="51" y1="90" x2="51" y2="98" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="59" y1="90" x2="59" y2="98" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Probe cable */}
          <path d="M 55 20 Q 55 5, 80 5 T 105 15 T 130 15" fill="none" stroke="#4b5563" strokeWidth="2.5" />

          {/* TDS Signal Transmitter PCB Module */}
          <rect x="125" y="25" width="60" height="65" rx="5" fill="#1b2a4a" stroke="#253e6d" strokeWidth="2" />
          {/* Adjust Potentiometer */}
          <rect x="135" y="35" width="12" height="12" fill="#2563eb" rx="1" />
          <circle cx="141" cy="41" r="3.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          <line x1="138" y1="41" x2="144" y2="41" stroke="#334155" strokeWidth="1" />

          {/* JST Connectors */}
          <rect x="172" y="47" width="15" height="15" rx="1" fill="#f1f5f9" />
          <rect x="176" y="52" width="11" height="5" fill="#94a3b8" />
          <text x="135" y="75" className="text-[6.5px] font-mono fill-slate-350" textAnchor="start">DFRobot TDS</text>
          <text x="135" y="83" className="text-[5px] font-mono fill-emerald-400" textAnchor="start">OUT: ANALOG</text>

          {/* Micro chip */}
          <rect x="150" y="55" width="12" height="12" fill="#0f172a" />
          <line x1="147" y1="58" x2="150" y2="58" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="147" y1="62" x2="150" y2="62" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="162" y1="58" x2="165" y2="58" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="162" y1="62" x2="165" y2="62" stroke="#cbd5e1" strokeWidth="0.8" />
        </svg>
      );
    case 'soil_moisture':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-soil">
          {/* Soil layer line */}
          <rect x="0" y="80" width="200" height="40" fill="#3b2314" fillOpacity="0.4" />
          <line x1="0" y1="80" x2="200" y2="80" stroke="#7c2d12" strokeWidth="1.5" strokeDasharray="4 4" />
          
          {/* Blade Body (Capacitive board) */}
          <g transform="translate(80, 5) scale(0.9)">
            {/* Black matte PCB blade */}
            <path d="M 10 0 L 40 0 C 42 0, 43 1, 43 3 L 43 75 L 26 108 L 24 108 L 7 75 L 7 3 C 7 1, 8 0, 10 0 Z" fill="#18181b" stroke="#374151" strokeWidth="2" />
            
            {/* Capacitive loop trace inside blade (Silver/copper paths) */}
            <path d="M 14 30 L 14 74 L 25 100 L 36 74 L 36 30" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 18 35 L 18 70 L 25 90 L 32 70 L 32 35" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Silk screen text */}
            <text x="22" y="47" className="text-[5px] font-mono fill-slate-350 font-bold" textAnchor="middle" transform="rotate(-90 22 47)">Capacitive Soil</text>
            <text x="29" y="47" className="text-[4.5px] font-mono fill-slate-400" textAnchor="middle" transform="rotate(-90 29 47)">Moisture v1.2</text>
            
            {/* JST Connector at top */}
            <rect x="16" y="2" width="18" height="12" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="20" y="2" width="10" height="3" fill="#cbd5e1" />
            <line x1="20" y1="8" x2="20" y2="2" stroke="#ef4444" strokeWidth="1" /> {/* Red wire */}
            <line x1="25" y1="8" x2="25" y2="2" stroke="#1e293b" strokeWidth="1" /> {/* Black wire */}
            <line x1="30" y1="8" x2="30" y2="2" stroke="#3b82f6" strokeWidth="1" /> {/* Blue wire */}
          </g>

          {/* Ambient Waves indicating active electromagnetism field */}
          <path d="M 64 60 A 15 15 0 0 0 64 90" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
          <path d="M 136 60 A 15 15 0 0 1 136 90" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse" />
        </svg>
      );
    case 'solenoid_valve':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-solenoid">
          {/* Valve brass base */}
          <path d="M 35 75 L 35 95 L 65 95 L 75 88 L 125 88 L 135 95 L 165 95 L 165 75 L 140 75 L 130 55 L 70 55 L 60 75 Z" fill="#cca43b" stroke="#92721d" strokeWidth="2" />
          <rect x="25" y="75" width="12" height="20" fill="#a48123" rx="1" />
          <rect x="163" y="75" width="12" height="20" fill="#a48123" rx="1" />

          {/* Thread lines on connectors */}
          <line x1="28" y1="79" x2="28" y2="91" stroke="#7c6014" strokeWidth="1.5" />
          <line x1="32" y1="79" x2="32" y2="91" stroke="#7c6014" strokeWidth="1.5" />
          <line x1="168" y1="79" x2="168" y2="91" stroke="#7c6014" strokeWidth="1.5" />
          <line x1="172" y1="79" x2="172" y2="91" stroke="#7c6014" strokeWidth="1.5" />

          {/* Flow Indicator arrow */}
          <path d="M 90 73 L 110 73 M 104 68 L 111 73 L 104 78" fill="none" stroke="#684e0e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Solder cylinder assembly (Plunger housing) */}
          <rect x="73" y="40" width="54" height="16" fill="#475569" stroke="#334155" strokeWidth="1.5" />
          
          {/* Black Solenoid Coil Cylinder */}
          <rect x="80" y="10" width="40" height="30" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          
          {/* Dynamic electromagnetic active waves */}
          <ellipse cx="100" cy="25" rx="32" ry="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />

          {/* Solid copper wire terminals */}
          <g transform="translate(100, 25)">
            <line x1="0" y1="-15" x2="-25" y2="-25" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /> {/* Red supply wire */}
            <line x1="5" y1="-15" x2="30" y2="-25" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /> {/* Black ground wire */}
          </g>
          <circle cx="100" cy="10" r="2.5" fill="#f8fafc" />
        </svg>
      );
    case 'submersible_pump':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-pump">
          {/* Floating fluid container bottom */}
          <rect x="10" y="90" width="180" height="25" rx="5" fill="#0284c7" fillOpacity="0.25" />
          <line x1="10" y1="90" x2="190" y2="90" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 1" />

          {/* Submersible pump main housing */}
          <rect x="40" y="35" width="95" height="55" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          
          {/* Rubber suction cups */}
          <path d="M 50 90 L 50 95 L 62 95 Z" fill="#475569" />
          <path d="M 113 90 L 113 95 L 125 95 Z" fill="#475569" />

          {/* Front intake grille slots (water filter) */}
          <g transform="translate(48, 48)">
            <rect x="0" y="0" width="4" height="28" rx="1" fill="#0284c7" />
            <rect x="8" y="0" width="4" height="28" rx="1" fill="#0284c7" />
            <rect x="16" y="0" width="4" height="28" rx="1" fill="#0284c7" />
            <rect x="24" y="0" width="4" height="28" rx="1" fill="#0284c7" />
          </g>

          {/* Dynamic suction bubbles/flow vector */}
          <path d="M 32 62 Q 22 62, 42 62" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" className="animate-pulse" />
          
          {/* Vertical outlet nozzle */}
          <rect x="105" y="15" width="16" height="20" rx="1" fill="#334155" stroke="#475569" strokeWidth="1" />
          {/* Water stream shooting out */}
          <path d="M 113 15 L 113 -5 C 113 -12, 133 -15, 145 -15 L 180 -15" fill="none" stroke="#60a5fa" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 113 15 L 113 -5 C 113 -12, 133 -15, 145 -15 L 180 -15" fill="none" stroke="#dbeafe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Motor backing casing cap */}
          <rect x="125" y="42" width="10" height="41" fill="#475569" rx="1" />
          
          {/* Heavy gauge electric wire leading away */}
          <path d="M 135 62 Q 155 62, 160 52 T 185 52" fill="none" stroke="#000000" strokeWidth="3" />
          
          <text x="100" y="70" className="text-[5.5px] font-mono fill-slate-350" textAnchor="middle">BLDC PUMP TX10</text>
          <text x="100" y="78" className="text-[4px] font-mono fill-emerald-400" textAnchor="middle">FLOW: 240 L/H</text>
        </svg>
      );
    case 'switching_ps':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-power">
          {/* Metal casing chassis */}
          <rect x="20" y="15" width="160" height="90" rx="4" fill="#334155" stroke="#475569" strokeWidth="2.5" />
          <rect x="25" y="20" width="150" height="60" rx="2" fill="#1e293b" />
          
          {/* Hex Mesh Vents Layout */}
          <pattern id="hex-mesh" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
            <path d="M 6 0 L 12 3 L 12 9 L 6 12 L 0 9 L 0 3 Z" fill="none" stroke="#475569" strokeWidth="0.8" />
          </pattern>
          <rect x="30" y="25" width="140" height="50" fill="url(#hex-mesh)" />

          {/* Active Status glowing Green LED */}
          <circle cx="163" cy="92" r="2.5" fill="#22c55e" className="animate-pulse" />
          <text x="156" y="94" className="text-[5px] font-mono fill-slate-400" textAnchor="end">V+ ADJ</text>

          {/* Potentiometer screw */}
          <circle cx="145" cy="92" r="3" fill="#eab308" />
          <line x1="143" y1="92" x2="147" y2="92" stroke="#475569" strokeWidth="1" />

          {/* Bottom Terminal Guard Block */}
          <rect x="20" y="80" width="112" height="25" rx="1" fill="#ca8a04" fillOpacity="0.8" stroke="#ca8a04" strokeWidth="1" />
          
          {/* Terminal divider ribs inside */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`term-${i}`}>
              <line x1={25 + i * 13} y1="80" x2={25 + i * 13} y2="105" stroke="#451a03" strokeWidth="1" />
              <circle cx={31.5 + i * 13} cy="92.5" r="2.5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              <line x1={31.5 + i * 13} y1="90" x2={31.5 + i * 13} y2="95" stroke="#334155" strokeWidth="1" />
            </g>
          ))}
          
          {/* Screws symbols L, N, GND, COM, COM, V+, V+ */}
          <text x="31" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">L</text>
          <text x="44" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">N</text>
          <text x="57" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">FG</text>
          <text x="70" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">-V</text>
          <text x="83" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">-V</text>
          <text x="96" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">+V</text>
          <text x="109" y="103" className="text-[5px] font-mono font-bold fill-amber-950" textAnchor="middle">+V</text>
        </svg>
      );
    case 'lm2596':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-buck">
          {/* Blue/Green PCB substrate */}
          <rect x="25" y="15" width="150" height="90" rx="4" fill="#047857" stroke="#065f46" strokeWidth="2.5" />
          
          {/* Copper plane outlines rendering schematic detail */}
          <path d="M 30 20 L 70 20 L 70 85 L 30 85 Z" fill="#065f46" fillOpacity="0.4" />
          <path d="M 120 20 L 170 20 L 170 85 L 120 85 Z" fill="#065f46" fillOpacity="0.4" />

          {/* Solder connection pins at edges */}
          <rect x="18" y="25" width="10" height="15" fill="#cbd5e1" rx="0.5" />
          <text x="21" y="35" className="text-[5.5px] font-mono font-bold fill-slate-800 rotate-90" textAnchor="middle">IN+</text>
          <rect x="18" y="80" width="10" height="15" fill="#cbd5e1" rx="0.5" />
          <text x="21" y="90" className="text-[5.5px] font-mono font-bold fill-slate-800 rotate-90" textAnchor="middle">IN-</text>
          
          <rect x="172" y="25" width="10" height="15" fill="#cbd5e1" rx="0.5" />
          <text x="175" y="35" className="text-[5.5px] font-mono font-bold fill-slate-800 rotate-90" textAnchor="middle">OUT+</text>
          <rect x="172" y="80" width="10" height="15" fill="#cbd5e1" rx="0.5" />
          <text x="175" y="90" className="text-[5.5px] font-mono font-bold fill-slate-800 rotate-90" textAnchor="middle">OUT-</text>

          {/* Input Filter Capacitor left (metallic cylinder) */}
          <circle cx="50" cy="53" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <rect x="39" y="51" width="22" height="4" fill="#f8fafc" />
          <text x="50" y="55" className="text-[5px] font-mono font-bold fill-slate-400" textAnchor="middle">220μF</text>

          {/* Output Filter Capacitor right */}
          <circle cx="150" cy="53" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <rect x="139" y="51" width="22" height="4" fill="#f8fafc" />
          <text x="150" y="55" className="text-[5px] font-mono font-bold fill-slate-400" textAnchor="middle">330μF</text>

          {/* Solid copper wire coil power inductor */}
          <circle cx="100" cy="40" r="15" fill="#78350f" stroke="#b45309" strokeWidth="1" />
          <circle cx="100" cy="40" r="10" fill="#1e293b" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`loop-${i}`} x1="100" y1="40" x2={100 + Math.cos(i * Math.PI / 3) * 13} y2={40 + Math.sin(i * Math.PI / 3) * 13} stroke="#f59e0b" strokeWidth="2" />
          ))}

          {/* LM2596 IC body */}
          <rect x="85" y="70" width="30" height="23" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
          {/* Metal heat sink tab of IC */}
          <rect x="87" y="66" width="26" height="4" fill="#94a3b8" />
          {/* Output leads */}
          <line x1="91" y1="93" x2="91" y2="99" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="97" y1="93" x2="97" y2="99" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="103" y1="93" x2="103" y2="99" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="109" y1="93" x2="109" y2="99" stroke="#cbd5e1" strokeWidth="1" />
          <text x="100" y="82" className="text-[5.5px] font-mono font-bold fill-slate-100" textAnchor="middle">LM2596S</text>
          <text x="100" y="89" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">-5.0 P+</text>

          {/* Precision adjustment multi-turn Potentiometer */}
          <rect x="73" y="18" width="22" height="12" fill="#1d4ed8" rx="1" />
          <rect x="89" y="21" width="4" height="6" fill="#f5d020" rx="0.5" />
          <text x="84" y="26" className="text-[5px] font-mono fill-slate-100 font-bold" textAnchor="end">W103</text>
        </svg>
      );
    case 'relays_4ch':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-relay">
          {/* Relay Blue board PCB */}
          <rect x="15" y="15" width="170" height="90" rx="5" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="2.5" />
          
          {/* 4 relays blocks nested side-by-side */}
          {Array.from({ length: 4 }).map((_, i) => (
            <g key={`relay-chan-${i}`} transform={`translate(${20 + i * 35}, 30)`}>
              {/* SONGLE Relay blue cubes */}
              <rect x="0" y="0" width="30" height="42" rx="2" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
              <text x="15" y="13" className="text-[5.5px] font-mono font-bold fill-slate-100" textAnchor="middle">SONGLE</text>
              <text x="15" y="21" className="text-[4.5px] font-mono fill-blue-100" textAnchor="middle">SRD-12V</text>
              <text x="15" y="29" className="text-[4px] font-mono font-black fill-yellow-400" textAnchor="middle">10A 250VAC</text>
              <text x="15" y="37" className="text-[4px] font-mono font-black fill-yellow-400" textAnchor="middle">10A 30VDC</text>

              {/* PC817 Optocouplers (black ICs) */}
              <rect x="10" y="48" width="10" height="8" fill="#18181b" rx="0.5" />
              <circle cx="12" cy="50" r="0.8" fill="#e2e8f0" />
              <text x="15" y="54" className="text-[3.5px] font-mono fill-slate-400" textAnchor="middle">817</text>

              {/* Terminal blocks at the top edge */}
              <rect x="2" y="-12" width="26" height="12" fill="#047857" rx="1" />
              <circle cx="7" cy="-6" r="2" fill="#94a3b8" />
              <line x1="6" y1="-6" x2="8" y2="-6" stroke="#475569" strokeWidth="0.8" />
              <circle cx="15" cy="-6" r="2" fill="#94a3b8" />
              <line x1="14" y1="-6" x2="16" y2="-6" stroke="#475569" strokeWidth="0.8" />
              <circle cx="23" cy="-6" r="2" fill="#94a3b8" />
              <line x1="22" y1="-6" x2="24" y2="-6" stroke="#475569" strokeWidth="0.8" />
              
              {/* Active status LED */}
              <circle cx="15" cy="61" r="1.8" fill={i === 0 ? "#ef4444" : "#4b5563"} className={i === 0 ? "animate-pulse" : ""} />
            </g>
          ))}

          {/* Header input pins */}
          <g transform="translate(162, 50)">
            <rect x="0" y="0" width="18" height="30" rx="1" fill="#0f172a" />
            <circle cx="9" cy="6" r="1.5" fill="#f59e0b" />
            <circle cx="9" cy="12" r="1.5" fill="#f59e0b" />
            <circle cx="9" cy="18" r="1.5" fill="#f59e0b" />
            <circle cx="9" cy="24" r="1.5" fill="#f59e0b" />
            <text x="-4" y="16" className="text-[5.5px] font-mono fill-slate-350 -rotate-90" textAnchor="middle">INPUT BUS</text>
          </g>
        </svg>
      );
    case 'dht22':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-dht">
          {/* Ambient atmospheric steam lines */}
          <path d="M 15 30 Q 30 15, 45 30 T 75 30" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" className="animate-pulse" />
          <path d="M 15 50 Q 30 35, 45 50 T 75 50" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" className="animate-pulse" />

          {/* White plastic grid body */}
          <g transform="translate(80, 10)">
            <rect x="0" y="0" width="40" height="75" rx="3" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
            
            {/* Grid vent slots */}
            {Array.from({ length: 8 }).map((_, row) => (
              <g key={`row-${row}`} transform={`translate(4, ${5 + row * 7.5})`}>
                <rect x="0" y="0" width="5" height="3" fill="#94a3b8" rx="0.5" />
                <rect x="8" y="0" width="5" height="3" fill="#94a3b8" rx="0.5" />
                <rect x="16" y="0" width="5" height="3" fill="#94a3b8" rx="0.5" />
                <rect x="24" y="0" width="5" height="3" fill="#94a3b8" rx="0.5" />
              </g>
            ))}

            {/* Solder panel with markings */}
            <rect x="-5" y="75" width="50" height="15" rx="1" fill="#047857" />
            <text x="20" y="84" className="text-[5px] font-mono font-bold fill-emerald-100" textAnchor="middle">AM2302 / DHT22</text>
            
            {/* 4 Connection Pins out the bottom */}
            <line x1="5" y1="90" x2="5" y2="105" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <text x="5" y="102" className="text-[3.5px] font-mono fill-emerald-200" textAnchor="middle">VCC</text>
            <line x1="15" y1="90" x2="15" y2="105" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <text x="15" y="102" className="text-[3.5px] font-mono fill-emerald-200" textAnchor="middle">SDA</text>
            <line x1="25" y1="90" x2="25" y2="105" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" /> {/* NC pin grayed out */}
            <text x="25" y="102" className="text-[3.5px] font-mono fill-slate-400" textAnchor="middle">NC</text>
            <line x1="35" y1="90" x2="35" y2="105" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <text x="35" y="102" className="text-[3.5px] font-mono fill-emerald-200" textAnchor="middle">GND</text>
          </g>
        </svg>
      );
    case 'rain_sensor':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-rain">
          {/* Backdrop Rain clouds */}
          <g className="opacity-70">
            <path d="M 25 20 Q 32 10, 42 18 Q 50 10, 58 18 Q 66 10, 73 20" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="28" x2="26" y2="35" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />
            <line x1="45" y1="28" x2="41" y2="35" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />
            <line x1="60" y1="28" x2="56" y2="35" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />
          </g>

          {/* Flat sensor rectangular plate with immersion gold tracks */}
          <g transform="translate(95, 15)">
            <rect x="0" y="0" width="65" height="90" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Interdigitating parallel gold traces */}
            <line x1="5" y1="12" x2="5" y2="78" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="12" x2="60" y2="78" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />

            <line x1="5" y1="18" x2="50" y2="18" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="5" y1="30" x2="50" y2="30" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="5" y1="42" x2="50" y2="42" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="5" y1="54" x2="50" y2="54" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="5" y1="66" x2="50" y2="66" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="5" y1="78" x2="50" y2="78" stroke="#ca8a04" strokeWidth="2.2" />

            <line x1="15" y1="24" x2="60" y2="24" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="15" y1="36" x2="60" y2="36" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="15" y1="48" x2="60" y2="48" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="15" y1="60" x2="60" y2="60" stroke="#ca8a04" strokeWidth="2.2" />
            <line x1="15" y1="72" x2="60" y2="72" stroke="#ca8a04" strokeWidth="2.2" />

            {/* Solder junction terminals */}
            <rect x="25" y="-10" width="15" height="12" fill="#1e293b" rx="0.5" />
            <rect x="28" y="-12" width="2" height="6" fill="#cbd5e1" />
            <rect x="35" y="-12" width="2" height="6" fill="#cbd5e1" />
            <text x="32" y="-1" className="text-[3.5px] font-mono fill-slate-400" textAnchor="middle">RAIN SENS</text>

            {/* Droplets */}
            <path d="M 28 42 C 28 43.5, 30 44, 30 42 C 30 40, 28 42, 28 42" fill="#38bdf8" />
            <path d="M 40 60 C 40 61.5, 42 62, 42 60 C 42 58, 40 60, 40 60" fill="#38bdf8" />
          </g>
        </svg>
      );
    case 'ds18b20':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-ds18b20">
          <path d="M 10 95 C 40 92, 60 97, 100 95 C 140 93, 160 96, 190 95 L 190 115 L 10 115 Z" fill="#3b82f6" fillOpacity="0.15" />
          <line x1="10" y1="95" x2="190" y2="95" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />

          {/* DS18b20 Stainless steel probe tip */}
          <g transform="translate(100, 50) rotate(25)">
            <path d="M -110 5 Q -70 5, -50 5 T 0 5" fill="none" stroke="#000000" strokeWidth="3.5" />
            <rect x="-10" y="2" width="20" height="6" fill="#18181b" rx="1" />
            <rect x="-8" y="1" width="12" height="8" fill="#111827" rx="0.5" />
            
            {/* Metal sheath */}
            <rect x="10" y="1.5" width="55" height="7" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="15" y1="1.5" x2="15" y2="8.5" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="18" y1="1.5" x2="18" y2="8.5" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="21" y1="1.5" x2="21" y2="8.5" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="53" y="1.5" width="12" height="7" rx="1.5" fill="#cbd5e1" />
            
            <text x="-48" y="15" className="text-[5.5px] font-mono fill-slate-400 font-bold -rotate-25" textAnchor="middle">DS18B20 1-WIRE</text>

            <circle cx="65" cy="5" r="4" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2 2" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          </g>
        </svg>
      );
    case 'multimeter':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-multimeter">
          <rect x="65" y="10" width="70" height="100" rx="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <rect x="71" y="16" width="58" height="88" rx="5" fill="#1e293b" />
          <rect x="77" y="24" width="46" height="24" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <rect x="79" y="26" width="42" height="20" rx="1" fill="#0284c7" fillOpacity="0.2" />
          <text x="100" y="38" className="text-[9px] font-mono font-bold fill-sky-400 animate-pulse text-center" textAnchor="middle">12.04 V</text>
          <text x="118" y="43" className="text-[4px] font-mono fill-sky-500" textAnchor="end">DC AUTO</text>
          
          <circle cx="100" cy="65" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
          <circle cx="100" cy="65" r="10" fill="#0f172a" />
          <line x1="100" y1="65" x2="100" y2="53" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
          <text x="100" y="86" className="text-[4.5px] font-mono fill-slate-400 font-bold" textAnchor="middle">V=-</text>
          <text x="84" y="67" className="text-[4.5px] font-mono fill-slate-400 font-bold" textAnchor="middle">OFF</text>
          <text x="116" y="67" className="text-[4.5px] font-mono fill-slate-400 font-bold" textAnchor="middle">Ω</text>

          <circle cx="85" cy="92" r="3" fill="#ef4444" />
          <circle cx="100" cy="92" r="3" fill="#0c0a09" />
          <circle cx="115" cy="92" r="3" fill="#3b82f6" />

          <path d="M 85 94 C 85 110, 50 115, 45 95" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M 100 94 C 100 112, 140 115, 145 95" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          <rect x="42" y="75" width="6" height="20" rx="1" fill="#ef4444" />
          <line x1="45" y1="75" x2="45" y2="60" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          
          <rect x="142" y="75" width="6" height="20" rx="1" fill="#111827" />
          <line x1="145" y1="75" x2="145" y2="60" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'soldering_iron':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-soldering-iron">
          <path d="M 12 60 Q 25 60, 40 60" fill="none" stroke="#1e293b" strokeWidth="3" />
          
          <rect x="40" y="48" width="85" height="24" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <rect x="45" y="52" width="10" height="16" rx="1" fill="#ef4444" />
          
          <rect x="75" y="53" width="35" height="14" rx="1" fill="#0f172a" />
          <text x="92" y="62" className="text-[5.5px] font-mono fill-sky-400 font-bold" textAnchor="middle">350°C</text>

          <rect x="125" y="52" width="12" height="16" fill="#cbd5e1" />
          <rect x="137" y="55" width="30" height="10" fill="#94a3b8" />
          
          <path d="M 167 57 L 187 60 L 167 63 Z" fill="#e2e8f0" />
          <path d="M 180 59 L 188 60 L 180 61 Z" fill="#ea580c" />
          <path d="M 183 50 Q 185 45, 187 48" fill="none" stroke="#ef4444" strokeWidth="0.8" className="animate-pulse" />
          <path d="M 188 53 Q 190 48, 192 51" fill="none" stroke="#ef4444" strokeWidth="0.8" className="animate-pulse" />
        </svg>
      );
    case 'wire_stripper':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-wire-stripper">
          <path d="M 35 45 Q 65 30, 110 35" fill="none" stroke="#ea580c" strokeWidth="12" strokeLinecap="round" />
          <path d="M 35 45 Q 65 30, 110 35" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          
          <path d="M 35 75 Q 65 90, 110 85" fill="none" stroke="#ea580c" strokeWidth="12" strokeLinecap="round" />
          <path d="M 35 75 Q 65 90, 110 85" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

          <circle cx="108" cy="60" r="10" fill="#64748b" stroke="#475569" strokeWidth="2" />
          <line x1="88" y1="50" x2="88" y2="70" stroke="#cbd5e1" strokeWidth="2.5" />
          <path d="M 88 50 C 95 48, 95 72, 88 70" fill="none" stroke="#94a3b8" strokeWidth="2" />

          <path d="M 108 55 L 155 35 L 140 60 Z" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="1" />
          <path d="M 108 65 L 155 85 L 140 60 Z" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="1" />
          
          <g transform="translate(125, 47)">
            <circle cx="0" cy="13" r="1.5" fill="#1e293b" />
            <circle cx="5" cy="13" r="2.2" fill="#1e293b" />
            <circle cx="10" cy="13" r="3.0" fill="#1e293b" />
          </g>

          <path d="M 185 60 L 145 60" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 145 60 L 132 60" fill="none" stroke="#eab308" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'oscilloscope':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-oscilloscope">
          <rect x="20" y="10" width="160" height="100" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <rect x="23" y="13" width="154" height="94" rx="2" fill="#334155" />

          <rect x="28" y="18" width="92" height="66" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
          
          <line x1="28" y1="51" x2="120" y2="51" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="1 1" />
          <line x1="74" y1="18" x2="74" y2="84" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="1 1" />

          <path d="M 28 51 Q 40 20, 50 51 T 72 51 T 94 51 T 116 35 T 120 51" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />

          <circle cx="138" cy="30" r="7" fill="#64748b" stroke="#475569" strokeWidth="1" />
          <line x1="138" y1="30" x2="142" y2="25" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <text x="138" y="42" className="text-[4.5px] font-mono fill-slate-400" textAnchor="middle">VOLTS/DIV</text>

          <circle cx="158" cy="30" r="7" fill="#64748b" stroke="#475569" strokeWidth="1" />
          <line x1="158" y1="30" x2="154" y2="25" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <text x="158" y="42" className="text-[4.5px] font-mono fill-slate-400" textAnchor="middle">TIME/DIV</text>

          <circle cx="138" cy="65" r="5" fill="#475569" />
          <circle cx="138" cy="65" r="2.5" fill="#e2e8f0" />
          <text x="138" y="76" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">CH A</text>

          <circle cx="158" cy="65" r="5" fill="#475569" />
          <circle cx="158" cy="65" r="2.5" fill="#e2e8f0" />
          <text x="158" y="76" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">CH B</text>

          <circle cx="34" cy="95" r="3" fill="#22c55e" />
          <text x="41" y="97.5" className="text-[5.5px] font-mono fill-emerald-400 font-bold">POWER ON</text>
          <text x="162" y="97.5" className="text-[5.5px] font-mono fill-slate-400" textAnchor="end">100MSa/s</text>
        </svg>
      );
    case 'calibration_meter':
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px] select-none" id="component-svg-calibration-meter">
          <rect x="25" y="40" width="45" height="60" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 26 62 Q 47 60, 69 62 L 69 98 L 26 98 Z" fill="#10b981" fillOpacity="0.3" />
          <line x1="26" y1="62" x2="69" y2="62" stroke="#34d399" strokeWidth="1" strokeDasharray="2 1" />

          <g transform="translate(42, 25)">
            <rect x="0" y="0" width="10" height="55" rx="1" fill="#475569" fillOpacity="0.8" stroke="#64748b" strokeWidth="1" />
            <circle cx="5" cy="55" r="4" fill="#cbd5e1" fillOpacity="0.9" stroke="#94a3b8" />
            <path d="M 5 0 C 5 -10, 85 -5, 100 20" fill="none" stroke="#1e293b" strokeWidth="1.8" />
          </g>

          <rect x="95" y="25" width="85" height="75" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="103" y="33" width="69" height="25" rx="2" fill="#0f172a" />
          <text x="138" y="48" className="text-[8px] font-mono font-bold fill-emerald-400" textAnchor="middle">1413 µS/cm</text>
          <text x="108" y="54" className="text-[4.2px] font-mono fill-emerald-600">NaCl REF</text>
          <text x="167" y="54" className="text-[4.2px] font-mono fill-slate-450" textAnchor="end">ATC 25.0°C</text>

          <circle cx="112" cy="72" r="3.5" fill="#3b82f6" />
          <text x="112" y="81" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">CAL</text>
          
          <circle cx="127" cy="72" r="3.5" fill="#64748b" />
          <text x="127" y="81" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">MODE</text>

          <circle cx="142" cy="72" r="3.5" fill="#64748b" />
          <text x="142" y="81" className="text-[4px] font-mono fill-slate-400" textAnchor="middle">ENTER</text>

          <circle cx="165" cy="72" r="3.5" fill="#22c55e" className="animate-pulse" />
          <text x="165" y="81" className="text-[4.2px] font-mono fill-emerald-400 font-bold" textAnchor="middle">READY</text>
        </svg>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center p-6 text-slate-500">
          <Cpu className="w-12 h-12 stroke-1 animate-pulse" />
        </div>
      );
  }
};

interface ComponentExplorerProps {
  isArabic: boolean;
}

export default function ComponentExplorer({ isArabic }: ComponentExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompId, setSelectedCompId] = useState<string>('esp32');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Components' },
    { id: 'controller', labelAr: 'المتحكمات', labelEn: 'Controllers' },
    { id: 'sensor', labelAr: 'المستشعرات والمجسات', labelEn: 'Sensors' },
    { id: 'actuator', labelAr: 'المشغلات والصمامات', labelEn: 'Actuators' },
    { id: 'power', labelAr: 'الطاقة والشبكة والبطارية', labelEn: 'Power & Regulation' },
    { id: 'tool', labelAr: 'أدوات التجميع والمعايرة والمختبر', labelEn: 'Lab Assembly & Calibration Tools' }
  ];

  const filteredComponents = SYSTEM_COMPONENTS.filter(comp => {
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const searchLow = searchQuery.toLowerCase();
    const nameMatch = comp.nameAr.toLowerCase().includes(searchLow) || comp.nameEn.toLowerCase().includes(searchLow);
    const principleMatch = comp.principleAr.toLowerCase().includes(searchLow) || comp.principleEn.toLowerCase().includes(searchLow);
    return matchesCategory && (nameMatch || principleMatch);
  });

  const selectedComp = SYSTEM_COMPONENTS.find(c => c.id === selectedCompId) || SYSTEM_COMPONENTS[0];

  // Helper to color category badges
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'controller': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'sensor': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'actuator': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'power': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'tool': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="component-explorer-container">
      
      {/* Left Column: Grid list & filter */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={isArabic ? 'البحث عن قطعة، مستشعر، أو وظيفة...' : 'Search components, sensors, or principles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              dir={isArabic ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Quick categories chips */}
          <div className="flex flex-wrap gap-1.5" dir={isArabic ? 'rtl' : 'ltr'}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Components List */}
        <div 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollbar-thin"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2 block border-b border-slate-100 pb-2">
            {isArabic ? `قطع التجميع المتوفرة (${filteredComponents.length})` : `Available Components (${filteredComponents.length})`}
          </span>

          <div className="flex flex-col gap-2">
            {filteredComponents.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`cursor-pointer w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  selectedCompId === comp.id
                    ? 'bg-blue-50/40 border-blue-500 shadow-2xs ring-1 ring-blue-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Miniature icon based on category */}
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getCategoryColor(comp.category)}`}>
                    {getComponentMiniIcon(comp.id)}
                  </div>
                  <div className="truncate text-right">
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">
                      {isArabic ? comp.nameAr : comp.nameEn}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block font-semibold">
                      {comp.specsEn[0].slice(0, 50)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200">
                    x{comp.quantity}
                  </span>
                </div>
              </button>
            ))}

            {filteredComponents.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">{isArabic ? "لم يتم العثور على نتائج تطابق معايير البحث." : "No matching parts found."}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Advanced Details of selected component */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedComp.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col gap-6"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Component Title Heading */}
            <div className="border-b border-slate-250/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(selectedComp.category)} mb-2`}>
                  <Layers className="w-3.5 h-3.5" />
                  {isArabic ? 
                    (selectedComp.category === 'controller' ? 'متحكم ذكي' : 
                     selectedComp.category === 'sensor' ? 'مستشعر قراءة' : 
                     selectedComp.category === 'actuator' ? 'مشغل كهروميكانيكي' : 
                     selectedComp.category === 'tool' ? 'أدوات التجميع والمعايرة والمختبر' : 'تنظيم وتزويد طاقة') 
                    : selectedComp.category.toUpperCase()}
                </span>
                <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight leading-normal">
                  {isArabic ? selectedComp.nameAr : selectedComp.nameEn}
                </h3>
              </div>
              
              <div className="bg-blue-50/50 rounded-lg p-3 text-center border border-blue-200 shrink-0 min-w-[100px]">
                <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider">{isArabic ? "الكمية المطلوبة" : "Comp Quantity"}</span>
                <span className="text-2xl font-black font-mono text-blue-800">{selectedComp.quantity}</span>
              </div>
            </div>

            {/* Interactive Vector Illustration Card */}
            <div className="w-full h-48 md:h-56 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-850 shadow-inner group">
              {/* Radial backdrop light */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
              
              {/* Dynamic SVG Visual Render */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                {renderComponentImage(selectedComp.id)}
              </div>
              
              {/* Graphic Blueprint overlay badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-[10px] font-mono font-bold" dir="ltr">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isArabic ? "مخطط تفاعلي مصغر" : "Schematic Asset Model"}
                </span>
                <span className="text-blue-400 font-bold uppercase tracking-wide">#{selectedComp.id}</span>
              </div>
            </div>

            {/* Quick specifications Bullet list */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                {isArabic ? "المواصفات الهندسية والكهربائية المعتمدة" : "Technical & Electrical Parameters"}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                {(isArabic ? selectedComp.specsAr : selectedComp.specsEn).map((spec, index) => (
                  <li key={index} className="flex gap-2 p-2.5 bg-slate-50 border border-slate-200/50 rounded-lg transition-colors">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Physical working principle - physical chemistry deep info */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-650 animate-pulse" />
                {isArabic ? "آلية العمل الفيزيائية والكيميائية المحكمة" : "Physical & Chemical Working Principle"}
              </h4>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                {isArabic ? selectedComp.principleAr : selectedComp.principleEn}
              </p>
            </div>

            {/* Country of Origin / Manufacturing */}
            <div className="mt-auto border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>
                  <strong className="text-slate-700 font-bold">{isArabic ? "بلد المنشأ / التصميم:" : "Origin / Fabrication:"}</strong>{' '}
                  {isArabic ? selectedComp.originAr : selectedComp.originEn}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-150">
                <ShieldCheck className="w-4 h-4" />
                <span>{isArabic ? "معتمد ومختبر مختبرياً" : "Lab Verified & Tested"}</span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
