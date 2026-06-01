import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Award, 
  Cpu, 
  Zap, 
  Sprout, 
  CheckCircle2, 
  Clock, 
  Flag, 
  Beaker, 
  Activity, 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Wrench
} from 'lucide-react';

interface Milestone {
  id: string;
  periodAr: string;
  periodEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  status: 'completed' | 'current' | 'planned';
  tasksAr: string[];
  tasksEn: string[];
  deliverablesAr: string[];
  deliverablesEn: string[];
  iconType: 'study' | 'sourcing' | 'programming' | 'testing' | 'defense';
  labReportAr: string;
  labReportEn: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    periodAr: 'أيلول - تشرين الأول ٢٠٢٥',
    periodEn: 'September - October 2025',
    titleAr: 'صياغة المفهوم العلمي ودراسة الجدوى الاسموزية',
    titleEn: 'Scientific Conceptualization & Feasibility Studies',
    descAr: 'تحديد النطاق الهندسي لحل مشكلة تملح شط العرب وأثره على جذور نخيل البصرة، وبناء هيكلية النظام الموزع المقاوم للأعطال.',
    descEn: 'Engineering scope identification to reverse the osmotic stress on palm roots from Basra’s saline water intrusion, planning a fail-safe multi-node mesh.',
    status: 'completed',
    iconType: 'study',
    tasksAr: [
      'دراسة بيئة التربة ونقاط تملح مياه الري في الفاو وأبو الخصيب.',
      'تخطيط بروتوكول ESP-NOW اللاسلكي منخفض الطاقة بين ثلاث عقد موزعة.',
      'تحديد الخواص الكهرومغناطيسية المطلوبة لعزل ملفات صمامات الري الإندكتيف.'
    ],
    tasksEn: [
      'Analyzing soil mechanics and water salinity matrices across Al-Fao and Abu Al-Khaseeb.',
      'Designing energy-optimized peer-to-peer ESP-NOW RF link topologies between 3 modules.',
      'Studying electromagnetic isolation parameters for inductive solenoid switching.'
    ],
    deliverablesAr: [
      'مخطط المنظومة المبدئي المقترح لحماية التربة.',
      'تقرير دراسة الأحمال الكهربائية وحساب تيار الاستعداد القليل جداً (15µA).'
    ],
    deliverablesEn: [
      'Preliminary structural block diagram of the osmotic defense system.',
      'Electrical power allocation report auditing the 15µA target deep sleep current.'
    ],
    labReportAr: 'تمت مراجعة دراسة شط العرب الملحية ومطابقتها مع قراءات مزارع التجربة.',
    labReportEn: 'Salinity profile indices of Shatt al-Arab verified against active field trial data.'
  },
  {
    id: 'm2',
    periodAr: 'تشرين الثاني - كانون الأول ٢٠٢٥',
    periodEn: 'November - December 2025',
    titleAr: 'شراء وتدقيق العتاد وبناء النماذج المعزولة',
    titleEn: 'Hardware Sourcing & Galvanic Isolated Prototyping',
    descAr: 'تأمين قطع الميكروكنترولر ESP32، وتجميع دارات العزل الكهرومغناطيسي، فحص ديودات الـ Flyback والتوصيل عبر خطوط حماية مخصصة.',
    descEn: 'Sourcing industrial grade ESP32 controllers, assembling galvanic isolation modules, and verifying flyback diodes to filter out inductive coil surge.',
    status: 'completed',
    iconType: 'sourcing',
    tasksAr: [
      'اختبار سلامة معالجات ESP32 وترددات تشغيلها البالغة 240MHz.',
      'تركيب ديودات الحماية العكسية 1N5408 لمنع الارتداد الكهربائي للملف اللولبي.',
      'تحجيم دوائر تنظيم الجهد الخافضة LM2596 وتثبيت خطوط الـ 5V و 3.3V الحساسة.'
    ],
    tasksEn: [
      'Testing the integrity of the sourced 240MHz dual-core ESP32 microcontrollers.',
      'Installing 1N5408 flyback bypass protection diodes on solenoid terminal blocks.',
      'Calibrating step-down Buck converters (LM2596) to generate precise 5V & 3.3V voltage rails.'
    ],
    deliverablesAr: [
      'لوحة التقييم المعملية الأحادية لعقد الري والملوحة.',
      'تثبيت العوازل الكهروميكانيكية والريليهات الثنائية المعزولة ضوئياً.'
    ],
    deliverablesEn: [
      'Fully assembled single-node lab prototyping board with TDS interface.',
      'Integrated optocoupler-isolated power relays preventing switching transients.'
    ],
    labReportAr: 'أظهر الفلوك ميتر عازلية كاملة (مقاومة إدخال فائقة) وتطابق جهود منظم الجهد بنسبة خطأ أقل من 0.02 فولت.',
    labReportEn: 'Multimeter measurement reads perfect 5.01V & 3.29V rails under dynamic solenoid loads.'
  },
  {
    id: 'm3',
    periodAr: 'كانون الثاني - شباط ٢٠٢٦',
    periodEn: 'January - February 2026',
    titleAr: 'تطوير الكود البرمجي ومعايرة فلاتر القراءات للـ TDS',
    titleEn: 'Embedded Systems Coding & TDS Filter Calibrations',
    descAr: 'برمجة نوية التحكم لشبكة ESP-NOW اللاسلكية، كتابة خوارزميات التصفية ومعايرة مجس الملوحة تماثلياً باستخدام سوائل هانا المرجعية.',
    descEn: 'Programming the dual-core scheduler, custom ESP-NOW frame structure, and applying average-window calibration to stabilize TDS readings.',
    status: 'completed',
    iconType: 'programming',
    tasksAr: [
      'برمجة أنماط السكون العميق وقرصنة المؤقت الخارجي للاستيقاظ الدوري.',
      'تطوير مرشح رياضي مدمج لفلترة قراءات مستشعر الملوحة ومنع تذبذب الإشارات.',
      'تطبيق معايرة خماسية النقاط لمحلول كلوريد الصوديوم المرجعي (1413 µS/cm).'
    ],
    tasksEn: [
      'Programming microsecond deep-sleep schedules and active wake-up timer cycles.',
      'Implementing a linear mathematical noise-filter on TDS analog data streams.',
      'Performing multi-point calibrations utilizing Hanna reference buffer (1413 µS/cm).'
    ],
    deliverablesAr: [
      'الكود المصدري المستقر للمتحكم الأساسي وعقد المحيط الموزعة.',
      'منحنى المعايرة الخطي لتوصيل الجهد الكهربائي بملوحة المياه الفعلية.'
    ],
    deliverablesEn: [
      'Stable firmware for Master Controller and distributed peer sensor nodes.',
      'Linear calibration curve mapping analog input voltage levels to absolute PPM values.'
    ],
    labReportAr: 'تم الحصول على استجابة تماثلية ممتازة وتم تخزين مصفوفات المعايرة بداخل الـ EEPROM غير المتطايرة للـ ESP32.',
    labReportEn: 'Solid linear response achieved and saved inside the ESP32 partition to persist calibration offsets.'
  },
  {
    id: 'm4',
    periodAr: 'آذار - نيسان ٢٠٢٦',
    periodEn: 'March - April 2026',
    titleAr: 'المحاكاة المعملية ورصد موجات التشويش وحرارة التربة',
    titleEn: 'Lab Simulation & High-Frequency Noise Isolation Audit',
    descAr: 'إخضاع المنظومة لاختبارات الإجهاد وتتبع إشارات التفعيل ونبضات الارتداد المغناطيسي باستخدام راسم الإشارات الرقمي المحمول ريجول.',
    descEn: 'Subjecting the core nodes to extensive noise tests, tracking wave transients and RF pulse timings using Rigol Dual-Channel Oscilloscope.',
    status: 'completed',
    iconType: 'testing',
    tasksAr: [
      'رصد تشويش المضخات الكهربائية وتتبع موجات شوشرة الـ EMI لملف الري ثنائي القطب.',
      'مراقبة استقرار وسرعة استجابة قراءات مستشعر الحرارة المعدني DS18B20 عازل السلك.',
      'اختبار فعالية حزم الاتصال اللاسلكي وتحديد معدل الفقد تحت الحواجز المانعة.'
    ],
    tasksEn: [
      'Tracing inductive solenoid EMI transients and analyzing switching harmonics on current lines.',
      'Verifying the response time and accuracy of shielded DS18B20 digital temperature probes.',
      'Auditing the ESP-NOW transmission success rate under dense physical barriers.'
    ],
    deliverablesAr: [
      'مخطط راسم الإشارات الذي يثبت هبوط قمم الارتداد للصفر بفضل ديود الحماية.',
      'ثبات بيانات الربط اللاسلكي ومقاومة التلاشي بنسبة نجاح تفوق 99.5%.'
    ],
    deliverablesEn: [
      'Oscilloscope transient decay waves showing clean zero voltage flyback dampings.',
      'Robust RF telemetry validation with 99.5% packet delivery success over 80 meters.'
    ],
    labReportAr: 'رصد راسم الإشارة ريجول انخماداً فورياً للجهد العابر بفضل الـ 1N5408، مما يؤمن حماية قصوى ودواماً طويلاً للشريحة الرقمية.',
    labReportEn: 'Rigol scope reports instantaneous transient damping under Flyback diode config, securing ESP32 logic.'
  },
  {
    id: 'm5',
    periodAr: 'أيار - حزيران ٢٠٢٦',
    periodEn: 'May - June 2026',
    titleAr: 'تجميع العلب الحقلية، ومناقشة مشروع التخرج المتميز',
    titleEn: 'Field Protection Assembly & Academic Project Defense',
    descAr: 'تنسيق التركيب النهائي داخل حاويات معملية معزولة ومحمية IP57، واختبار الواجهة التفاعلية متكاملة المخرجات أمام كليات جامعة المعقل.',
    descEn: 'Final packaging inside heavy-duty IP57 water-safe chemical containers, testing custom interactive software, and major academic defense.',
    status: 'current',
    iconType: 'defense',
    tasksAr: [
      'تجهيز غلاف العقد المقاوم للرطوبة العالية وحرارة شمس البصرة اللاهبة.',
      'بناء واجهة المحاكاة والتحكم الرقمية متكاملة الحلول لتسهيل شرح المنظومة.',
      'استكمال ملف المناقشة المنهجية وعرض اللوحة العملية أمام لجنة التقييم الأكاديمي.'
    ],
    tasksEn: [
      'Constructing humidity-proof physical node enclosures resilient to extreme summer climates.',
      'Optimizing the companion digital visual simulation system to simplify field operability.',
      'Perfecting the technical research paper for presentation before the Academic Council.'
    ],
    deliverablesAr: [
      'الحقيبة الهندسية العملية الجاهزة للتشغيل والاستخدام الميداني.',
      'أعلى درجة تقييمية ممنوحة لمشروعات التخرج المبتكرة والمتميزة بقسم السيطرة.'
    ],
    deliverablesEn: [
      'Fully packaged standalone laboratory-to-field automation hardware set.',
      'Distinguished project honor index bestowed by the Faculty Assessment Committee.'
    ],
    labReportAr: 'المنظومة متكاملة وتخضع حالياً للتشغيل المستمر مع استهلاك طاقة مثالي متناهي الصغر.',
    labReportEn: 'Continuous test operational metrics confirm stable performance under real-time parameters.'
  }
];

interface ProjectTimelineProps {
  isArabic: boolean;
}

export default function ProjectTimeline({ isArabic }: ProjectTimelineProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('m5');

  const selectedMilestone = MILESTONES.find(m => m.id === selectedMilestoneId) || MILESTONES[4];

  const getIcon = (type: string) => {
    switch (type) {
      case 'study':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'sourcing':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'programming':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'testing':
        return <Activity className="w-5 h-5 text-cyan-600" />;
      case 'defense':
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-slate-650" />;
    }
  };

  const getStatusColor = (status: 'completed' | 'current' | 'planned') => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 border-emerald-300 ring-emerald-100';
      case 'current':
        return 'bg-amber-500 border-amber-300 ring-amber-100 animate-pulse';
      case 'planned':
        return 'bg-slate-300 border-slate-200 ring-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6" id="project-timeline-container">
      {/* Title Header Section */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-right w-full" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2 justify-start">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0"></div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5 leading-snug">
              {isArabic ? "المخطط الزمني التاريخي وتطور مراحل العمل (Research Timeline)" : "Project Construction & Milestones Timeline"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans font-semibold">
            {isArabic ? 
              "تتبع المسار الهندسي لصياغة الفكرة وتجريب العتاد وبرمجة المتحكمات حتى المناقشة النهائية." : 
              "Follow the technical pipeline from fundamental study, firmware creation, up to academic defense."}
          </p>
        </div>
      </div>

      {/* Visual Timeline Path */}
      <div className="relative pt-4 pb-6 px-2 overflow-x-auto select-none scrollbar-thin" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Horizontal Progress bar line */}
        <div className="absolute top-[41px] left-8 right-8 h-1 bg-slate-100 -z-1" id="timeline-line">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 transition-all duration-500"
            style={{ 
              width: selectedMilestoneId === 'm1' ? '10%' : 
                     selectedMilestoneId === 'm2' ? '35%' : 
                     selectedMilestoneId === 'm3' ? '58%' : 
                     selectedMilestoneId === 'm4' ? '80%' : '100%' 
            }}
          />
        </div>

        {/* Nodes Container */}
        <div className="flex justify-between items-start min-w-[720px] relative z-10">
          {MILESTONES.map((milestone) => {
            const isSelected = selectedMilestoneId === milestone.id;
            return (
              <button
                key={milestone.id}
                onClick={() => setSelectedMilestoneId(milestone.id)}
                className="cursor-pointer flex flex-col items-center text-center focus:outline-hidden group max-w-[140px]"
                id={`milestone-node-${milestone.id}`}
              >
                {/* Node Date badge inside hover scale container */}
                <div className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-full mb-3 border transition-all ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs scale-105' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700'
                }`}>
                  {isArabic ? milestone.periodAr.split(' ')[0] : milestone.periodEn.split(' ')[0]}
                </div>

                {/* Node Bullet and Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ring-4 ${
                  isSelected 
                    ? 'bg-white border-blue-600 shadow-md ring-blue-50 scale-110 z-20' 
                    : milestone.status === 'completed'
                    ? 'bg-emerald-50/60 border-emerald-500/65 hover:border-emerald-600 shadow-xs ring-emerald-50/20'
                    : 'bg-white border-slate-300 group-hover:border-slate-500 ring-slate-50'
                }`}>
                  {getIcon(milestone.iconType)}
                </div>

                {/* Node Mini status indicator dot */}
                <span className={`w-2 h-2 rounded-full border mt-3 transition-transform duration-300 ${
                  isSelected ? 'scale-125' : ''
                } ${getStatusColor(milestone.status)}`} />

                {/* Node Small Title */}
                <p className={`text-[10px] md:text-xs font-black mt-2 leading-relaxed tracking-tight max-w-[120px] transition-all ${
                  isSelected ? 'text-blue-700 font-black scale-102' : 'text-slate-500 group-hover:text-slate-800'
                }`}>
                  {isArabic ? milestone.titleAr.substring(0, 22) + '...' : milestone.titleEn.substring(0, 22) + '...'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMilestoneId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col gap-5 text-right"
          dir={isArabic ? 'rtl' : 'ltr'}
          id="milestone-details-panel"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3.5 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-xs shrink-0">
                {getIcon(selectedMilestone.iconType)}
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5 font-mono">
                  {selectedMilestone.periodEn} • {selectedMilestone.periodAr}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedMilestone.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className={`text-[10px] font-black ${selectedMilestone.status === 'completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {selectedMilestone.status === 'completed' 
                      ? (isArabic ? 'تم إكمالها بنجاح' : 'Phase Completed') 
                      : (isArabic ? 'المرحلة النشطة حالياً' : 'Active Phase')}
                  </span>
                </span>
              </div>
            </div>
            
            <h4 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
              {isArabic ? selectedMilestone.titleAr : selectedMilestone.titleEn}
            </h4>
          </div>

          {/* Description Block */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-semibold">
            {isArabic ? selectedMilestone.descAr : selectedMilestone.descEn}
          </p>

          {/* Detailed Lists (Tasks & Deliverables) inside high-contrast grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch mt-1">
            {/* Column A: Tasks Completed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/50 flex flex-col gap-2 shadow-xs">
              <span className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5 mb-1.5 block flex items-center gap-1.5 justify-start">
                <Sliders className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {isArabic ? "المهام والأنشطة التقنية المنجزة:" : "Technical Activities Drafted:"}
              </span>
              <ul className="text-xs text-slate-650 leading-relaxed font-sans font-medium space-y-2.5">
                {(isArabic ? selectedMilestone.tasksAr : selectedMilestone.tasksEn).map((task, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-right">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column B: Deliverables / Outcomes */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/50 flex flex-col gap-2 shadow-xs">
              <span className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5 mb-1.5 block flex items-center gap-1.5 justify-start">
                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {isArabic ? "مرجعية مخرجات المرحلة والمستندات:" : "Milestone Deliverables & Files:"}
              </span>
              <ul className="text-xs text-slate-650 leading-relaxed font-sans font-medium space-y-2.5">
                {(isArabic ? selectedMilestone.deliverablesAr : selectedMilestone.deliverablesEn).map((deliv, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-right">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Simulated Lab Calibration / Audit log badge bottom */}
          {selectedMilestone.labReportAr && (
            <div className="bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent border border-amber-500/25 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div className="flex items-center gap-2 shrink-0">
                <Beaker className="w-4 h-4 text-amber-600" />
                <span className="font-mono font-black text-amber-800 uppercase tracking-wider text-[10px]">
                  {isArabic ? "سجل عيوب التدقيق للمختبر:" : "LAB AUDIT LOG:"}
                </span>
              </div>
              <p className="font-sans font-medium text-amber-950 font-bold leading-relaxed text-right">
                {isArabic ? selectedMilestone.labReportAr : selectedMilestone.labReportEn}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
