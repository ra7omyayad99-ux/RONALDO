import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEM_NODES } from '../data';
import { Network, Server, ShieldAlert, ArrowRight, Rss, Layers, Zap, Info, Cpu } from 'lucide-react';

interface SystemArchitectureProps {
  isArabic: boolean;
}

export default function SystemArchitecture({ isArabic }: SystemArchitectureProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node1');
  const activeNode = SYSTEM_NODES.find(n => n.id === selectedNodeId) || SYSTEM_NODES[0];

  return (
    <div className="flex flex-col gap-6" id="system-architecture-view">
      
      {/* Top Section: Distributed Node Map Visual Graphic */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Ambient star glowing background lines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              <Network className="w-3.5 h-3.5 text-blue-450" />
              ESP-NOW WIRELESS SENSORY NETWORK
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline font-bold">
              Latency: &lt; 2.5ms | Band: 2.4 GHz
            </span>
          </div>

          <div className="mt-2 text-right">
            <h3 className="text-lg font-black tracking-tight text-white font-sans leading-relaxed">
              {isArabic ? "الهيكل اللاسلكي الموزع ثلاثي العقد لحماية النظام" : "Decentralized 3-Node Architecture for High Noise Isolation"}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed font-semibold">
              {isArabic ? 
                "بدلاً من ربط كل المكونات بمتحكم واحد في شبكة كهربائية مشتركة مسببة لتشويش قراءات الحرارة والملوحة، قمنا بفصل النظام لثلاثة متحكمات ESP32 تتواصل لاسلكياً ببروتوكول سريع وموثّق." : 
                "To completely suppress heavy electromagnetic switching noise and common-mode offsets from groundwater telemetry, the hardware is segmented into three distinct wireless ESP32 processing systems."}
            </p>
          </div>

          {/* Visual Grid representing Node communications */}
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 mt-6">
            
            {/* Box 1 */}
            <button 
              onClick={() => setSelectedNodeId('node1')}
              className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                selectedNodeId === 'node1' 
                  ? 'bg-blue-600/20 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              } md:col-span-1`}
            >
              <Cpu className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-xs font-black font-sans">Node 1: Master</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-mono font-semibold">LCD, DS3231, DHT22</p>
            </button>

            {/* Link Arroa 1 */}
            <div className="hidden md:flex flex-col items-center justify-center md:col-span-1 text-blue-500 font-mono text-[9px] font-bold">
              <Rss className="w-4 h-4 animate-pulse text-blue-450" />
              <span className="mt-1 text-slate-400">ESP-NOW</span>
              <ArrowRight className="w-4 h-4 mt-1" />
            </div>

            {/* Box 2 */}
            <button 
              onClick={() => setSelectedNodeId('node2')}
              className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                selectedNodeId === 'node2' 
                  ? 'bg-blue-600/20 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              } md:col-span-1`}
            >
              <Server className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-xs font-black font-sans">Node 2: Sensors</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-mono font-semibold">ADC1 (Moisture/TDS/Rain)</p>
            </button>

            {/* Link Arroa 2 */}
            <div className="hidden md:flex flex-col items-center justify-center md:col-span-1 text-blue-500 font-mono text-[9px] font-bold">
              <Rss className="w-4 h-4 animate-pulse text-blue-450" />
              <span className="mt-1 text-slate-400">ESP-NOW</span>
              <ArrowRight className="w-4 h-4 mt-1" />
            </div>

            {/* Box 3 */}
            <button 
              onClick={() => setSelectedNodeId('node3')}
              className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                selectedNodeId === 'node3' 
                  ? 'bg-blue-600/20 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              } md:col-span-1`}
            >
              <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-xs font-black font-sans">Node 3: Drivers</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-mono font-semibold">Relays, Pump, Solenoid</p>
            </button>

          </div>
        </div>
      </div>

      {/* Bottom Section: Active Node Details Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Detail & explanation for the active node */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Select Operating Base
            </span>
            <div className="flex flex-col gap-2">
              {SYSTEM_NODES.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`cursor-pointer w-full text-right p-3 rounded-lg border transition-all ${
                    selectedNodeId === node.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-bold' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <p className="text-xs font-mono opacity-85 uppercase leading-none font-bold">
                    {node.id === 'node1' ? 'Node 01: Core' : node.id === 'node2' ? 'Node 02: Telemetry' : 'Node 03: Executive'}
                  </p>
                  <p className="text-sm mt-1 truncate block font-sans font-bold">
                    {isArabic ? node.nameAr.split(':')[1] || node.nameAr : node.nameEn.split(':')[1] || node.nameEn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Core Hardware design constraint Warning */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex flex-col gap-2.5" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? "قيد تصميمي حرج للغاية (Hardware Constraint)" : "Critical System Hardware Boundary"}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {isArabic ? 
                "تحذير فني مالي: عند نشاط البث الراديوي والواي فاي، تتعطل دوائر ADC2 كلياً. لذا يجب إلزاماً ربط كل مجسات الاستشعار بعقدة الحساسات على السلسلة الفرعية لقنوات الـ ADC1 فقط لضمان سلامة البيانات من التجميد." : 
                "Silicon restriction: Reading ADC2 channels during active Wifi/ESP-now telemetry streams will crash data registers. All analog sensors must be strictly placed exclusively on ADC1 (GPIOs 32-36)."}
            </p>
          </div>
        </div>

        {/* Right Side: Tabular GPIO Mapping table for active node */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 h-full" dir={isArabic ? 'rtl' : 'ltr'}>
            
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                {isArabic ? activeNode.nameAr : activeNode.nameEn}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-sans font-semibold">
                {isArabic ? activeNode.roleAr : activeNode.roleEn}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs md:text-sm font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-black tracking-wider text-[11px] uppercase">
                    <th className="py-2.5 px-3 text-right">{isArabic ? "المنفذ العتادي" : "GPIO/Pin"}</th>
                    <th className="py-2.5 px-3 text-right">{isArabic ? "القطعة والوظيفة" : "Target Component & Role"}</th>
                    <th className="py-2.5 px-3 text-right">{isArabic ? "البروتوكول الكهربائي" : "Signal Interface Protocol"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {activeNode.gpioPins.map((gpio, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-xs font-black border border-slate-200">
                          {gpio.pin}
                        </span>
                      </td>
                      <td className="py-3 px-3 leading-relaxed">
                        {isArabic ? gpio.targetAr : gpio.targetEn}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-100">
                          {gpio.protocol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Extra Technical Tip */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-auto flex items-start gap-2 text-[11px] text-slate-550 leading-normal font-semibold">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                {isArabic ? 
                  "ملاحظة السلامة للأطراف Strapping Pins: تم استثناء منافذ GPIO 0، GPIO 2، GPIO 5، GPIO 12، GPIO 15 من أي استشعار إدخال مباشر لمنع عطل بدء التشغيل العتادي للمتحكمات عند بدء اإقلاع." : 
                  "Note for Strapping Pins: GPIO 0, 2, 5, 12, 15 are structurally isolated from startup loops to safeguard the ESP32 internal bootloader routines."}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
