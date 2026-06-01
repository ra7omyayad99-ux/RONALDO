import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Cpu, 
  CheckCircle2, 
  XOctagon, 
  Zap, 
  Activity, 
  ShieldCheck, 
  HelpCircle, 
  Sliders, 
  Wrench, 
  Thermometer, 
  Droplets, 
  Wifi, 
  Layers, 
  ArrowRight, 
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Award,
  Power,
  BatteryCharging,
  Info,
  ExternalLink,
  Search,
  Battery
} from 'lucide-react';

interface QAItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
  tags: string[];
}

interface ComponentSpec {
  id: string;
  nameAr: string;
  nameEn: string;
  qty: number;
  mfg: string;
  mfgAr: string;
  specsAr: string[];
  specsEn: string[];
  purposeAr: string;
  purposeEn: string;
}

// Highly comprehensive study questions based on university curriculum & active examination defense criteria
const STUDY_GUIDE_QA: QAItem[] = [
  {
    qAr: "ما هو الهدف الجوهري لمشروع الري الذكي لنخيل البصرة؟",
    qEn: "What is the core objective of the Basra Date Palms Smart Irrigation project?",
    aAr: "معالجة أزمة تملح التربة ومياه السقاية القادمة من شط العرب. يعمل النظام على حماية جذور نخيل التمر من 'الضغط الأسموزي العكسي' عبر المراقبة المستمرة لمجموع الأملاح المذابة (TDS)، وفي حالة تخطي نسبة الملوحة للحد الآمن، يتم إيقاف الري فوراً وتنبيه المزارع، لضمان سقاية النخيل بمياه عذبة أو معتدلة فقط.",
    aEn: "To mitigate the soil salinization crisis and salt-water intrusion from Shatt Al-Arab. The system protects date palm roots from 'reverse osmotic stress' by continuously monitoring Total Dissolved Solids (TDS). If salinity exceeds safe thresholds, irrigation is suspended immediately and the farmer is alerted, ensuring palms are irrigated only with fresh or moderate water.",
    tags: ["الهدف", "المفهوم", "الزراعة"]
  },
  {
    qAr: "لماذا تم اختيار بروتوكول ESP-NOW اللاسلكي بدلاً من Wi-Fi التقليدي؟",
    qEn: "Why was ESP-NOW RF protocol selected instead of traditional Wi-Fi?",
    aAr: "بروتوكول ESP-NOW هو بروتوكول اتصال لاسلكي مباشر (Peer-to-Peer) يعمل بتردد 2.4GHz مطور من Espressif. يتميز بـ: ا) لا يتطلب موجه شبكة (Router/Access Point) مما يلائم المزارع البعيدة وبساتين البصرة الشاسعة، ب) سرعة استجابة فائقة (Low Latency < 5ms)، ج) استهلاك طاقة متدني جداً يدعم السكون العميق (Deep Sleep) للمتحكمات الموزعة مما يطيل عمر البطاريات لعدة أشهر.",
    aEn: "ESP-NOW is a direct, point-to-point wireless communication protocol operating at 2.4GHz developed by Espressif. It offers: 1) Router-less direct connection making it perfect for remote date palm farmlands, 2) Ultra-low latency (< 5ms), 3) Extremely low power overhead, allowing external nodes to maximize deep sleep and stretch battery lifespan to months.",
    tags: ["الشبكة", "اللاسلكي", "الطاقة"]
  },
  {
    qAr: "ما هي وظيفة ديود الحماية العكسية (1N5408 Flyback Diode) في خط الصمام؟",
    qEn: "What is the purpose of the 1N5408 Flyback protection diode on the solenoid driver?",
    aAr: "عند إيقاف تشغيل صمام الري الكهرومغناطيسي، ينهار مجاله المغناطيسي دافعاً تياراً ارتدادياً حثياً عالي الجهد (Inductive Kickback) قد يصل لمئات الفولتات. يعمل ديود 1N5408 المتصل بالتوازي العكسي مع الملف اللولبي كممر حماية آمن بتفريغ جهد هذا الارتداد ومنع مروره نحو بطاقة الريليه الضوئية وشريحة ESP32، مما يحمي الدقة والقطع الرقمية من الاحتراق السلبي.",
    aEn: "When the inductive coil of the solenoid valve is toggled OFF, its electric magnetic field collapses, prompting a massive high-voltage reverse spike (Inductive Kickback) reaching hundreds of volts. The 1N5408 diode linked in reverse-parallel with the valve absorbs and dampens this charge, shielding the opto-isolated relay and the digital ESP32 chip from damage.",
    tags: ["العتاد", "الحماية", "الإلكترونيات"]
  },
  {
    qAr: "لماذا تم عزل مسارات الإشارة التماثلية بالكامل وتخصيصها لمنفذ ADC1 دون منفذ ADC2؟",
    qEn: "Why must analog sensor lines be mapped exclusively to ADC1 instead of ADC2?",
    aAr: "لأن منفذ التحويل الرقمي التماثلي الثاني ADC2 في شريحة ESP32 يتشارك عتادياً السليكون ومسارات التردد مع وحدة الراديو والواي فاي والاتصال لاسلكي (ESP-NOW). عند تفعيل الراديو لإرسال أو استقبال القياسات، يتم تعطيل بنك ADC2 بالكامل من قبل منطق الأولوية عتادياً، مما يسبب فساد قراءة الحساسات المتصلة به، ولذلك نقصر حساسة Soil Moisture ومجس الـ TDS وحساس المطر على ADC1 (دبابيس GPIO 32 إلى 39).",
    aEn: "Because the ESP32's ADC2 peripheral shares silicon routing and register blocks with the 2.4 GHz RF wireless network module (Wi-Fi/ESP-NOW). When transmission actively executes, the ADC2 bank is disabled by priority logic locks. Sampling ADC2 during active transmission returns corrupted registers or saturation, making it mandatory to map sensitive TDS and soil moisture sensors to ADC1.",
    tags: ["العتاد", "الحصانة", "التردد"]
  },
  {
    qAr: "ما هو 'الضغط الأسموزي العكسي' وكيف يعالجه المشروع زراعياً؟",
    qEn: "What is 'reverse osmotic stress' and how does the project cure it?",
    aAr: "عندما تكون مياه الري عالية الملوحة، يرتفع تركيز الأملاح في التربة مقارنة بالخلايا الداخلية لجذور النخلة. بدلاً من سحب الجذور للماء، يسحب الملح المرتفع الماء خارج خلايا النخلة مما يؤدي لذبولها وموتها (موت أسموزي). يعالج المشروع هذا بالتحسس اللحظي لتوصيلية المياه، فإذا رصد ملوحة مرتفعة يغلق صمامات التغذية فوراً، مانعاً تخلل الأملاح لجذور النخيل الحساسة بالبصرة.",
    aEn: "When irrigation water is laden with salt, the soil water potential drops below the root cells internal fluid potential. Rather than drinking water, date palm roots lose their cell moisture to the saline soil, resulting in severe dehydration (reverse osmosis). The project cures this by executing instantaneous shut-off of solenoid feed lines when high TDS conductivity is mapped.",
    tags: ["الزراعة", "التربة", "العلوم"]
  },
  {
    qAr: "ما هي أهمية استخدام مكثف التنعيم بسعة 3300µF والجهد 63V في دائرة التغذية؟",
    qEn: "What is the critical significance of using the 3300µF 63V electrolytic capacitor?",
    aAr: "يعمل المكثف الإليكتروليتي الكبير بمثابة خزان شحنة لحظي فور إقلاع مضخة الماء الكبرى (DC 12V 240L/H). تسحب المضخة تيار إقلاع عالٍ يسبب هبوطاً مفاجئاً في فولتية الخط (Voltage Sags)، مما قد يعرض معالجات ESP32 للمقاطعة أو إعادة الإقلاع الفجائي (Brownout Reset). هذا المكثف يمتص النبضات وينعم الخط حامياً استقرار النظام بالكامل.",
    aEn: "It serves as an instantaneous energy reservoir for peak loads. When the heavy DC submersible water pump triggers, its high dynamic starting current produces a voltage sag on the 12V rail that can brownout the ESP32 microcontrollers. The 3300µF capacitor discharges rapidly to buffer voltage drops and ensure system computing continuity.",
    tags: ["الطاقة", "الحماية", "التنعيم"]
  }
];

// Complete, comprehensive list of ALL 28 ACTUAL Project Bill of Materials (BOM) components with accurate unit quantities and manufacturing data
const COMPONENT_SPECS: ComponentSpec[] = [
  {
    id: "bom1",
    nameAr: "متحكم معالج ESP32-WROOM-32 (نسخة Type-C)",
    nameEn: "38-Pin ESP32 WROOM-32 Development Board",
    qty: 3,
    mfg: "Espressif Systems Inc. (Shanghai, China Co-HQ)",
    mfgAr: "شركة إسبريسيف سيستمز العالمية - شنغهاي",
    purposeAr: "معالجة القراءات الحساسة الموزعة وإرسال الإشارات اللاسلكية عبر بروتوكول ESP-NOW منخفض الطاقة.",
    purposeEn: "Acting as the local computational core processing sensor arrays and transmitting telemetry with low-power ESP-NOW.",
    specsAr: [
      "تردد معالج ثنائي النواة يصل لـ 240 ميغاهيرتز.",
      "مجهر اتصال مدمج بتردد 2.4 جيجاهيرتز للاتصال المباشر.",
      "طاقة استهلاك سكون عميق مذهلة لا تتجاوز 15 ميكرو أمبير."
    ],
    specsEn: [
      "Tensilica Xtensa dual-core processor clocked up to 240 MHz.",
      "Integrated 2.4 GHz RF matching network for point-to-point link.",
      "Unparalleled ultra-low sleep current draw (15 µA) during passive cycles."
    ]
  },
  {
    id: "bom2",
    nameAr: "مجهز طاقة تحويلي ذكي (Industrial SMPS Power Supply)",
    nameEn: "Industrial DC 12V 10A 120W Switching Power Supply",
    qty: 1,
    mfg: "Mean Well Enterprises Co., Ltd. (New Taipei, Taiwan)",
    mfgAr: "شركة مين ويل للمعدات الكهربائية ودوائر الطاقة",
    purposeAr: "تحويل فولتية تيار المنزل المتردد (220V) إلى تيار مستمر آمن وثابت 12V لتغذية المضخة والصمامات والريليهات.",
    purposeEn: "Rectifies incoming standard AC power (100V-240V AC) to stable high-power 12V DC for high-current execution devices.",
    specsAr: [
      "سعة طاقة تبلغ 120 واط لتدعيم المحركات.",
      "مخرج تيار مستمر مستقر 12V بتيار أقصى 10A.",
      "حماية داخلية ضد الماس الكهربائي وارتفاع التيار والحرارة الزائدة."
    ],
    specsEn: [
      "12V DC / 120W maximum energy storage limit.",
      "Provides continuous current support up to 10 Amps safely.",
      "Integrated protection for short circuit failures, excessive overload, and heat."
    ]
  },
  {
    id: "bom3",
    nameAr: "محول تيار متردد مرن وقابل للتعديل 3V-12V",
    nameEn: "Adjustable 3V-12V 5A Universal AC/DC Power Adapter",
    qty: 1,
    mfg: "Generic High-Precision Electronics",
    mfgAr: "مصانع الدوائر الكهربائية وتعديل الجهد التماثلي",
    purposeAr: "توفير فولتية تشغيل واختبار مرنة أثناء ضبط ومعايرة تيار ريليات المضخة وبطاقات العتاد في المختبر.",
    purposeEn: "Supplies auxiliary testing voltages for manual calibration of relay switching limits on the lab bench.",
    specsAr: [
      "مفتاح تدوير للتحكم التماثلي اليدوي بالجهد من 3V إلى 12V.",
      "قدرة سحب تيار قصوى تصل لـ 5 أمبير كاملة.",
      "شاشة رقمية مدمجة لعرض الجهد اللحظي المسحوب بدقة."
    ],
    specsEn: [
      "Manual rotary dial for linear voltage scaling from 3.0V to 12.0V.",
      "High capacity limits tracking up to 5 Amps.",
      "Integrated mini LED voltmeter showing active output parameters."
    ]
  },
  {
    id: "bom4",
    nameAr: "مخفض الجهد والجهود الحساسة (Buck Converter LM2596)",
    nameEn: "LM2596 DC-DC Step-Down Buck Converter Module",
    qty: 4,
    mfg: "Texas Instruments Inc. (Dallas, Texas, USA)",
    mfgAr: "شركة تكساس إنسترومنتس العالمية للدوائر المتكاملة",
    purposeAr: "تخفيض الفولت المستمر من 12V إلى 5V لتغذية الكروت الضوئية والشاشات، وإلى 3.3V لتأمين شرائح الـ ESP32 الحساسة.",
    purposeEn: "Regulates and steps down the dirty 12V DC power lines down to highly stable 5.0V for screens and 3.3V for microprocessors.",
    specsAr: [
      "كفاءة تحويل ممتازة تفوق %90 تمنع نشوء الحرارة العالية.",
      "تردد تقطيع داخلي يبلغ 150 كيلوهيرتز.",
      "مقاومة متغيرة (Potentiometer) دقيقة لتحديد جهد الخرج المطلوب بدقة."
    ],
    specsEn: [
      "High conversion efficiency exceeding 90% reducing heat buildup.",
      "High-frequency internal oscillation of 150 kHz.",
      "Precision multi-turn potentiometer for micro-adjusting line voltages."
    ]
  },
  {
    id: "bom5",
    nameAr: "مستشعر رطوبة التربة السعوي ضد التآكل (V1.2 Capacitive)",
    nameEn: "Capacitive Soil Moisture Sensor V1.2 (Anti-Corrosive)",
    qty: 3,
    mfg: "DFRobot Robotics & Technology (Shanghai, China)",
    mfgAr: "مجموعة دي إف روبوت لأنظمة الاستشعار والبحث العلمي",
    purposeAr: "مراقبة نسبة رطوبة باطن التربة حول جذور النخيل بدون تعريض الأقطاب إلى التأكسد أو الصدأ بفعل الأملاح.",
    purposeEn: "Probes active root volumetric water levels utilizing non-corrosive capacitive fields to block galvanic oxidation.",
    specsAr: [
      "عزل كامل بطلاء عالي الكثافة يحمي الدارات الداخلية من الملوحة.",
      "مخرج تماثلي يعطي من 0.0V (رطوبة كاملة) إلى 3.0V (جفاف تام).",
      "جهد تشغيل تيار مستمر يتراوح من 3.3V إلى 5.5V."
    ],
    specsEn: [
      "Hermetically sealed casing insulated to prevent corrosion from saline soils.",
      "Analog voltage output ranging from 0.0V (full saturation) to 3.0V (dry air limit).",
      "Operating voltage range of 3.3V to 5.5V DC."
    ]
  },
  {
    id: "bom6",
    nameAr: "صمام ري كهرومغناطيسي معدني صناعي (12V Solenoid)",
    nameEn: "Direct-Acting 12V DC Solenoid Electric Water Valve (1/2\")",
    qty: 3,
    mfg: "U.S. Solid Industrial LLC (Ohio, USA)",
    mfgAr: "شركة يو إس سوليد وفروع الإنتاج في جيجيانغ",
    purposeAr: "التحكم الهيدروليكي المغلق بجريان مياه السقاية وتحويلها إلى المناطق الثلاث حسب أوامر التحكم الموزعة.",
    purposeEn: "Acts as a mechanical block, sealing default flow lines and opening only when energized by 12V DC control logic.",
    specsAr: [
      "القطر والفتحة: نصف بوصة (1/2 inch) لمدخل الخراطيم.",
      "النمط الافتراضي مغلق آلياً (Normally Closed) حماية من التسرب في حالات انقطاع الطاقة.",
      "مغناطيس حثي يسحب تياراً من 400mA إلى 500mA أثناء التفعيل المفتوح."
    ],
    specsEn: [
      "Standard 1/2-inch outer diameter connection threads.",
      "Normally Closed (N/C) failsafe layout blocking fluids during blackouts.",
      "Requires continuous holding current of 400mA to 500mA during operation."
    ]
  },
  {
    id: "bom7",
    nameAr: "ديود كبت وتفريغ التيارات العابرة (Rectifier Diode 1N5408)",
    nameEn: "1N5408 3A 1000V Inductive Kickback Rectifier Diode",
    qty: 4,
    mfg: "ON Semiconductor Corp. (Phoenix, Arizona, USA)",
    mfgAr: "مجموعة أون سيميكوندكتر لحلول الإلكترونيات والترانزستور",
    purposeAr: "امتصاص موجات الارتداد العاتية (Spikes) المتولدة هيدروكهرومغناطيسياً عند فتح وإقفال الصمام، حامياً الريليه ومجلس المعالج.",
    purposeEn: "Damps severe electromagnetic counter-EMF spikes (inductive kickbacks) generated by de-energizing solenoid coils.",
    specsAr: [
      "يتحمل جهوداً حادة عكسية متكررة تبلغ 1000 فولت كاملة.",
      "شدة تيار ممررة مستقرة بالاتجاه المباشر تبلغ 3 أمبير.",
      "سرعة تفريغ فوري تحول الشرارة الكهرومغناطيسية للصفر بكسور الثانية."
    ],
    specsEn: [
      "Handles peak reverse voltage stress up to 1000V safely.",
      "Allows continuous forward currents up to 3.0 Amps.",
      "Clamps voltage transients to 0.7V with instantaneous discharge timing."
    ]
  },
  {
    id: "bom8",
    nameAr: "مكثف تنعيم وترشيح التيار الكهربائي المانع لهبوط الجهد",
    nameEn: "3300uF 63V Aluminum Electrolytic Capacitor",
    qty: 1,
    mfg: "Rubycon Corporation (Nagano, Japan)",
    mfgAr: "شركة روبيكون اليابانية لتصنيع المكثفات الفائقة",
    purposeAr: "منع إعادة التشغيل المفاجئ لمعالج الـ ESP32 الناجم عن هبوط الجهد عند إقلاع مضخة المياه، عن طريق تخزين وتفريغ الطاقة اللحظية.",
    purposeEn: "Acts as a primary reservoir to smooth out transient voltage sags on the 12V DC rail during pump start up.",
    specsAr: [
      "سعة تفريغ كهروستاتيكية عملاقة تبلغ 3300 ميكروفاراد.",
      "تصنيف جهد أقصى آمن يبلغ 63 فولت تفادياً للارتجاع العابر.",
      "مقاومة داخلية مكافئة متدنية جداً (Ultra-low ESR)."
    ],
    specsEn: [
      "Extremely large capacitance rating of 3300 microfarads.",
      "Maximum voltage tolerance rated up to 63V DC.",
      "Optimized for high ripple currents with very low equivalent series resistance."
    ]
  },
  {
    id: "bom9",
    nameAr: "مستشعر حرارة التربة الرقمي المدرع (DS18B20 1m)",
    nameEn: "DS18B20 Waterproof Digital Thermal Probe (1 Meter)",
    qty: 1,
    mfg: "Maxim Integrated / Analog Devices (San Jose, USA)",
    mfgAr: "شركة ماكسيم وجامعة سليكون فالي لأشباه الموصلات",
    purposeAr: "قياس حرارة جذور النخيل والتربة العميقة بدقة لموازنة معدل البخر وحساب حيوية التمثيل الغذائي للنخلة.",
    purposeEn: "Captures subsurface soil layer temperature gradients utilizing a waterproof stainless steel probe directly around palm roots.",
    specsAr: [
      "بروتوكول اتصال أحادي السلك (1-Wire) يوفر منافذ المعالج.",
      "مقاوم للماء والرطوبة بغطاء معدني مدرع طوله 1 متر.",
      "دقة متناهية بقيمة خطأ لا تتعدى ±0.5 درجة مئوية."
    ],
    specsEn: [
      "Proprietary 1-Wire communication interface allowing multi-probe bus routing.",
      "Shielded inside robust marine-grade 316 stainless steel waterproof casing.",
      "High accuracy mapping of ±0.5°C variations spanning -10°C to +85°C."
    ]
  },
  {
    id: "bom10",
    nameAr: "لوحة موصل ومعاير مقاوم محيط مستشعر DS18B20",
    nameEn: "DS18B20 Active Pluggable Terminal Signal Adapter Module",
    qty: 1,
    mfg: "Maxim Integrated / Generic",
    mfgAr: "شركة ماكسيم وموزعي قطع الهواة التقنية",
    purposeAr: "مبيت وتجميع أسلاك مستشعر الحرارة، مع تزويده بمقاومة الرفع الآمنة (4.7k Ohm Pull-up) لمنع فقدان البيانات اللاسلكية.",
    purposeEn: "Provides easy screw-terminal wiring for the thermal probe, with a built-in 4.7k Ohm pull-up resistor to secure single-wire signals.",
    specsAr: [
      "مقاومة رفع مدمجة 4.7K أوم ضرورية للـ One-Wire.",
      "منفاست كابلات ثلاثية سهلة الربط والتدقيق.",
      "مؤشر ليد يبين وصول التغذية والنبضات اللحظية."
    ],
    specsEn: [
      "Built-in 4.7k Ohm pull-up resistor required for robust 1-Wire protocol execution.",
      "Easy screw terminals for direct clamping without solder degradation.",
      "Power indicator LED tracing signal transmissions dynamically."
    ]
  },
  {
    id: "bom11",
    nameAr: "مستشعر قياس هطول المطر ورصد مستوى المياه السطحي",
    nameEn: "Rain Water Level / Surface Droplet Detection Plate Array",
    qty: 1,
    mfg: "Generic Open-Source Robotics",
    mfgAr: "مصانع الدوائر وتصفير إشارات حقول الصين الموحدة",
    purposeAr: "رصد هطول الأمطار فوراً لوقف عمليات الري كلياً وحماية البساتين من التملح والفيضان وتوفير المياه الزائدة.",
    purposeEn: "Provides rain precipitation sensing, driving instant software overrides to suspend unnecessary irrigation cycles.",
    specsAr: [
      "سطح مطلي بالنيكل ومحمي بالكامل لمقاومة الأكسدة والتآكل بفعل مطر البصرة الحامضي.",
      "نظام إخراج ثنائي متكامل: تماثلي تناظري، ورقمي بالمرجع بالمقارن LM393.",
      "استهلاك طاقة قليل جداً لا يتعدى 15 مللي أمبير."
    ],
    specsEn: [
      "Immersion nickel-plated sensing surface resistant to corrosion and acidic rain.",
      "Dual Output interface: analog voltage curve, plus digital logic using LM393 comparator.",
      "Extremely light operational current draw under 15 mA."
    ]
  },
  {
    id: "bom12",
    nameAr: "مستشعر الوقت الحقيقي عالي الدقة (DS3231 RTC Module)",
    nameEn: "DS3231 High-Precision Hardware I2C Real-Time Clock",
    qty: 1,
    mfg: "Maxim Integrated / Analog Devices (USA)",
    mfgAr: "شركة ماكسيم ومهندسي أنظمة الميكروكرونا للمناطق العارية",
    purposeAr: "جدولة أوقات الري الدورية بدقة متناهية (مثال: السقاية فقط بآخر الليل وبدر الصباح) ومنع الري أثناء وهج الظهيرة لتفادي تبخر المياه.",
    purposeEn: "Provides independent, highly accurate chronological tracking to lock irrigation to low-evaporation periods.",
    specsAr: [
      "يتضمن مذبذب بلوري مدمج معوض حرارياً (TCXO) يمنع انحراف الساعة بفعل القيظ العالي للمزارع.",
      "مبيت وبطارية ليثيوم احتياطية CR2032 للعمل الدائم لسنوات حتى مع انقطاع الكهرباء الرئيسي.",
      "اتصال بروتوكول I2C ثنائي السلك من طراز خط سريع."
    ],
    specsEn: [
      "Contains a Temperature-Compensated Crystal Oscillator (TCXO) preventing thermal drift.",
      "Battery backup bay with CR2032 lithium coin cell securing long-term clock functionality.",
      "Serial I2C bus communication link operating at high frequency."
    ]
  },
  {
    id: "bom13",
    nameAr: "شاشة عرض البيانات والتحذيرات الكبرى (LCD 20x4 Screen)",
    nameEn: "Alphanumeric LCD 20x4 Display with I2C PCF8574 Backpack",
    qty: 1,
    mfg: "Hitachi Display Ltd. / NXP Semiconductors",
    mfgAr: "شركة هيتاشي بالتعاون مع إن إكس بي للهندسة الرقمية",
    purposeAr: "عرض قراءات الأملاح والحرارة ورطوبة التربة الثلاثية أمام مهندس الحقل وفنيي جامعة المعقل في الوقت الفعلي.",
    purposeEn: "Serves as the master HMI console, displaying real-time sensor array stats, diagnostic warnings, and node states.",
    specsAr: [
      "تتكون من 20 عموداً و 4 أسطر تتيح مساحات عرض غنية بالنصوص.",
      "شريحة حافلة الـ I2C المدمجة PCF8574 تقلل أسلاك التوصيل من 10 أسلاك إلى سلكين ثنائيين فقط.",
      "إضاءة خلفية زرقاء ساطعة ذات كفاءة تشغيل 5 فولت متواصل."
    ],
    specsEn: [
      "Large layout of 20 columns by 4 rows.",
      "Back-soldered PCF8574 I2C adapter backpack reducing digital pins down to 2 (SDA/SCL).",
      "Vibrant high-contrast Blue LED backlight with white text matrix."
    ]
  },
  {
    id: "bom14",
    nameAr: "بطاقة ريليه تفعيل مخارج الصمامات عازلة الإشارة المزدوجة",
    nameEn: "4-Channel Low Level Relay Switching Board (PC817 Optocoupled)",
    qty: 1,
    mfg: "Songle Relay Co. / Sharp Corporation",
    mfgAr: "شركة سونغلي للريليهات بالتعاون مع عوازل شارب الضوئية",
    purposeAr: "توصيل إشارات فتح وإغلاق الصمامات الكهرومغناطيسية الثلاثية والمضخة الرئيسية بجهد 12 فولت مع عزل إشارة الـ ESP32 الحساس تيارياً.",
    purposeEn: "Safely controls the 12V DC valves and water pumps using optocoupler isolation to protect low-power ESP32 pins.",
    specsAr: [
      "العازل الضوئي الحاسم (PC817 Optocoupler) يحبس قمم التداخلات المغناطيسية.",
      "قدرة تحميل هائلة للمفاتيح تصل لـ 10A عند جهود مترددة ومستمرة.",
      "مؤشر ضوئي ليد لكل قناة يبين تفعيل مخرجات الري اللحظي."
    ],
    specsEn: [
      "Features high-speed PC817 optocouplers providing true galvanic separation.",
      "Heavy load switching capacity of 10 Amps at up to 30V DC.",
      "Dynamic state LED indicators capturing live relay activations."
    ]
  },
  {
    id: "bom15",
    nameAr: "وحدة مفتاح ريليه أحادي القناة بجهد ١٢ فولت لقنوات العادم والتهوية",
    nameEn: "1-Channel Optocoupled Relay Board Module (12V Variant)",
    qty: 2,
    mfg: "Songle Relay Co., Ltd. (China)",
    mfgAr: "شركة سونغلي لمعدات السيطرة والري الميداني",
    purposeAr: "تشغيل مراوح تبريد العلبة وخاصية طرد الهواء الساخن لتفادي تلف معالجات شريحة السيطرة.",
    purposeEn: "Controls auxiliary high-current fans and vent systems within the master electrical enclosure.",
    specsAr: [
      "جهد ملف الريليه الأساسي 12V DC.",
      "تتضمن ديود توازي حامٍ مدمج على بورد الريليه لحماية منافذ الترانزستور.",
      "أطراف مخارج برغي (NO / COM / NC) متينة ذات قمط شديد."
    ],
    specsEn: [
      "12V DC relay coil excitation rating.",
      "Integrated freewheeling flyback protection built on the circuit board.",
      "Industrial tier terminal screw blocks (Normally Open, Common, Normally Closed)."
    ]
  },
  {
    id: "bom16",
    nameAr: "وحدة ريليه أحادي القناة بجهد ٥ فولت لتفعيل العقد الجانبية",
    nameEn: "1-Channel Optocoupled Relay Board Module (5V Variant)",
    qty: 1,
    mfg: "Songle Relay Co. / Sharp Corp.",
    mfgAr: "شركة سونغلي لتكنولوجيا الإلكترونيات الاستهلاكية",
    purposeAr: "إنتيجريشن وتكامل تشغيل الحساسات ذات الجهد المتدني وفصل الطاقة عنها آلياً أثناء أنماط السكون العميق.",
    purposeEn: "Manages power rails for secondary digital chips and shuts down current draw during deep sleep cycles.",
    specsAr: [
      "يعمل بإشارة تحفيز 5V DC منخفضة الطاقة.",
      "عزل ضوئي كامل يمنع تراجع الإشارة لنوية الـ ESP32.",
      "استهلاك تيار تشغيل بسيط لا يتخطى بضعة مللي أمبيرات."
    ],
    specsEn: [
      "Low power 5V DC active-low logic trigger.",
      "Full optoelectronic galvanic barrier avoiding noise feedback loops.",
      "Ultra-compact form factor designed for dense circuit boards."
    ]
  },
  {
    id: "bom17",
    nameAr: "مروحة تشتيت برودة العلبة الحقلية (9025 Brushless Fan)",
    nameEn: "12V 90x90x25mm Dual Ball Bearing Brushless Cooling Fan",
    qty: 3,
    mfg: "Delta Electronics Inc. (Taipei, Taiwan)",
    mfgAr: "شركة دلتا العالمية للمستشعرات وقوانين الري والتهوية",
    purposeAr: "طرد وخلخلة درجات الحرارة والقيظ اللاهب داخل العلبة المغلقة لـ IP57 حماية من تلف المعالج والريليهات.",
    purposeEn: "Draws extremely hot air out of sealed IP57 master boxes, avoiding thermal build-ups and processor throttling.",
    specsAr: [
      "تعمل بجهد 12 فولت مستمر بكفاءة تدفق هواء عالية.",
      "نظام المحمل الكروي المزدوج (Dual Ball Bearing) لدوام يتجاوز 70 ألف ساعة.",
      "حشوة عازلة من البلاستيك الصلب تقاوم الرطوبة وسرعة الرياح المغبرة."
    ],
    specsEn: [
      "DC 12V brush-free operating design.",
      "Dual Ball Bearing core designed for an lifespan of over 70,000 continuous hours.",
      "Rigid thermoplastic casing constructed to withstand high dust climates."
    ]
  },
  {
    id: "bom18",
    nameAr: "مضخة مياه صامتة بجهد ١٢ فولت (TX10 Brushless Pump)",
    nameEn: "Quiet DC 12V Brushless Submersible Solenoid Water Pump (TX10)",
    qty: 1,
    mfg: "Guangdong Micro-Pump Engineering Co.",
    mfgAr: "مصنع غوانغدونغ لمضخات المياه والعتاد الثقيل",
    purposeAr: "سحب وضخ المياه العذبة من خزان التوزيع الصفي ودفعها بقوة خلال الصمامات باتجاه جذور نخيل الفاو.",
    purposeEn: "Generates fluid flow and lift from master water storage, acting under Node-3 command structures.",
    specsAr: [
      "سعة تدفق مائي غنية تبلغ 240 لترًا في الساعة (240 L/H).",
      "هامة رفع ونبض هيدروليكي آمن يصل لسطح عمودي بارتفاع 3 أمتار متواصلة.",
      "محرك عديم المسفرات (Brushless) لعمل صامت ومقاومة ممتازة للتآكل المالح."
    ],
    specsEn: [
      "High fluid displacement rate of 240 Liters per Hour (240 L/H).",
      "Dynamic vertical lift head capacity rated up to 3 Meters (3M / 10ft).",
      "Brushless electronic commutation (BLDC) eliminating electrical sparks and EMI."
    ]
  },
  {
    id: "bom19",
    nameAr: "مستشعر حرارة ورطوبة غلاف العلبة الخارجي (DHT22 Climate)",
    nameEn: "DHT22 (AM2302) Analog/Digital Dual Climate Sensor",
    qty: 1,
    mfg: "Aosong Guangzhou Electronics Ltd. (Guangzhou, China)",
    mfgAr: "شركة أوسونغ هوانغ الأهلية لصناعة الفلاتر والمجسات",
    purposeAr: "تحديد مؤشرات التبخر الجوي عبر الفحص المشترك لدرجات حرارة وهواء البقعة ونسبة الرطوبة المعيارية الخارجية.",
    purposeEn: "Monitors ambient air temperature and relative humidity levels to gauge regional plant transpiration indices.",
    specsAr: [
      "تطبيقات قراءة رطوبة كاملة المدى من %0 إلى %100.",
      "نطاق حراري واسع من -40 إلى +80 درجة مئوية.",
      "دقة رطوبة فائقة الحساسية ±2% ودقة حرارية ±0.5 درجة."
    ],
    specsEn: [
      "Relative humidity scaling from 0% to 100% RH.",
      "Expanded operating temperature spectrum of -40°C to +80°C.",
      "Extremely tight ±2% relative humidity accuracy boundaries."
    ]
  },
  {
    id: "bom20",
    nameAr: "خلية بطارية ليثيوم بجهد ٣.٧ فولت (Battery 18650)",
    nameEn: "High-Capacity 18650 Cylindrical Lithium-Ion Cell (3.7V / 1200mAh)",
    qty: 2,
    mfg: "Panasonic Energy Corp. (Osaka, Japan)",
    mfgAr: "شركة باناسونيك العالمية للطاقة وخطوط البطاريات",
    purposeAr: "مصدر التغذية الاحتياطي للنظام (Backup Power) لضمان عدم توقف مراقبة النخيل في حالات انقطاع التيار الشبكي.",
    purposeEn: "Provides deep-reserve secondary battery backups in series to protect the node network during power cuts.",
    specsAr: [
      "سعة وفيرة تبلغ 1200 مللي أمبير لكل خلية.",
      "نوع الخلايا ليثيوم أيون معمرة من الطراز الكيميائي المتوازن.",
      "تدعم الشحن والتفريغ حتى 1000 دورة دون فقد السعة."
    ],
    specsEn: [
      "Provides nominal power backup storage rated at 1200mAh per cell.",
      "Highly stable lithium-ion chemistry supporting long duty cycles.",
      "Retains charge integrity over 1000+ deep recharge phases."
    ]
  },
  {
    id: "bom21",
    nameAr: "حجاب بطاريات الليثيوم الثنائي الموصل (Battery Holder 18650)",
    nameEn: "2-Slot 18650 Series Battery Chassis Holder with Lead Wires",
    qty: 1,
    mfg: "Keystone Electronics Corp. (New York, USA)",
    mfgAr: "شركة كيستون الأمريكية للهياكل المعدنية والحشايا الباردة",
    purposeAr: "جمع خليتي الليثيوم وتوصيلهما على التوالي لإنتاج خط طاقة مديد يبلغ 7.4 فولت كخط سليم لدارات الـ ESP32.",
    purposeEn: "Houses both 18650 cells in series configuration, providing a stable 7.4V raw power rail output.",
    specsAr: [
      "بلاستيك مقوى بيفيل بولي بروبيلين مقاوم للحرارة والصدمات الميدانية.",
      "نقاط اتصال برونزية عالية التوصيل مطعمة بمادة النيكل حماية للتسريب.",
      "أسلاك مخرج سميكة تضمن ثبات ممر التيار بدون مقاومة تذكر."
    ],
    specsEn: [
      "Heat-resistant high-impact polypropylene base with integrated wire guides.",
      "Nickel-plated steel contacts preventing surface corrosion and scaling.",
      "Pre-tinned copper lead wires for zero-resistance current distribution."
    ]
  },
  {
    id: "bom22",
    nameAr: "شاحن بطاريات الليثيوم الأوتوماتيكي الذكي",
    nameEn: "1-Slot Universal Smart Lithium Battery Charger Station",
    qty: 1,
    mfg: "LiitoKala Power Tech Co., Ltd. (Shenzhen, China)",
    mfgAr: "شركة ليتوكالا لتصنيع حلول الشحن والبطاريات الذكية",
    purposeAr: "إعادة تعبئة شحن بطاريات طاقة الطوارئ آلياً وبصورة آمنة مع حماية الخلايا من التدمير والشحن الزائد.",
    purposeEn: "Manages automatic charging routines for the 18650 lithium batteries with built-in cut-off bounds.",
    specsAr: [
      "فحم شحن ذكي مبرمج آلياً لقطع التيار تماماً فور شحن الخلية (%100).",
      "تيار شحن مستقر وتدريجي يعزز طول عمر البطارية وسلامتها.",
      "أضواء ليد ملونة تظهر مراحل الشحن والجاهزية بدقة."
    ],
    specsEn: [
      "Smart micro-controller charging protocol with voltage sensor cutoff.",
      "Gentle constant-current charging algorithm protecting battery lifetime.",
      "Interactive multi-LED displaying active charge percentages."
    ]
  },
  {
    id: "bom23",
    nameAr: "لوحة معالجة النماذج وسولد الأطراف مزدوجة النحاس",
    nameEn: "8x12cm Double-Sided Prototype PCB Vero Board",
    qty: 3,
    mfg: "Sino-Tech Prototyping Ltd. (Guangdong, China)",
    mfgAr: "تكتلات بورد النحاس وتشفير دوائر رابيد الصينية",
    purposeAr: "لحام وتجميع الأسلاك والقطع الحماية (الريليهات، المكثفات، المقاومات والديودات) وتكوين شبكة النحاس الحقلية بثبات هندسي عالي.",
    purposeEn: "Provides a rigid physical substrate for soldering and organizing raw circuits, decoupling components, and flyback protection.",
    specsAr: [
      "مادة الفايبر جلاس العازلة عالية المتانة FR-4 مزدوجة الأوجه.",
      "فتحات نحاسية مطلية بالكامل لتسهيل اللحامات وتفادي فك الأسلاك.",
      "أبعاد متوازنة 8x12 سم ملائمة للعلب الحقلية تماماً."
    ],
    specsEn: [
      "Double-sided FR-4 epoxy fiberglass structure with copper plated holes.",
      "Pre-tinned solder pads designed for rapid heat absorption.",
      "Grid dimensions of 8x12 cm suited for modular outdoor enclosures."
    ]
  },
  {
    id: "bom24",
    nameAr: "بوردة المخرج اللولبي والمشابك الفولاذية لمعالج الـ ESP32",
    nameEn: "38-Pin ESP32 Screw Terminal Breakout Expansion Board",
    qty: 1,
    mfg: "Shenzhen Industrial Automation Clusters",
    mfgAr: "الائتلاف الصناعي لأجهزة السيطرة والتركيب بشبكات الصين",
    purposeAr: "منع اهتزاز أو فك الأسلاك الميدانية الحساسة داخل مزارع النخيل عن طريق تحويل دبابيس المعالج إلى مرابط لولبية متينة.",
    purposeEn: "Secures external wire connections by replacing loose breadboard lines with solid, industrial screw-clamp terminals.",
    specsAr: [
      "موزع أطراف كامل لجميع دبابيس معالج ESP32 البالغ عددها 38 دي بورت.",
      "مشابك براغي فولاذية تضمن قوة شد تمنع الرش وتلاشي التماس الكهربائي.",
      "بنية عريضة معزولة بمادة الفينوليك لتلافي قصر مسارات الطاقة."
    ],
    specsEn: [
      "Dedicated terminal footprint mapping for all 38 ESP32 I/O channels.",
      "Heavy torque retention screws blocking wire detaching from field vibration.",
      "Solid double-layer isolation design preventing common-mode shorts."
    ]
  },
  {
    id: "bom25",
    nameAr: "لوحة التقييم الأولية الخالية من اللحامات (MB102 Breadboard)",
    nameEn: "Prototyping Tools: MB102 830-Point Solderless Breadboard",
    qty: 1,
    mfg: "Generic High-Quality Prototyping Supply",
    mfgAr: "موردين قطع تجارب الإلكترونيات الدقيقة",
    purposeAr: "تدشين واختبار الكود البرمجي الأولي وربط الحساسات مع المعالج بالمعمل دون لحام لتأمين صحة الفروض العلمية.",
    purposeEn: "Allows rapid, solderless proof-of-concept assembly and testing in laboratory research before hardware fabrication.",
    specsAr: [
      "تحتوي على 830 نقطة تلامس مكسوة بالفوسفور والبرونز حاملاً للتيار.",
      "نطاقات جانبية موصولة لجهود التغذية تضمن مسارات الـ 5V والـ 3.3V.",
      "قاعدة لاصقة متينة تتيح دمج اللوحة بقوة إلى طاولات الفحص المعملي."
    ],
    specsEn: [
      "Includes 830 dynamic contact tie-points with phosphor bronze plating.",
      "Built-in side power distribution lines for easy node testing.",
      "Adhesive foam tape base allowing secure mounting on laboratory tables."
    ]
  },
  {
    id: "bom26",
    nameAr: "حزمة أسلاك مبرومة مخصصة للدوائر الإلكترونية (F-F & M-F Jumpers)",
    nameEn: "30cm Row Dupont Cables (Female-Female & Male-Female Panels)",
    qty: 2,
    mfg: "Generic Prototyping Interconnects",
    mfgAr: "مصانع الكابلات المجدولة والموصلات عالية التردد",
    purposeAr: "تأمين التوصيل السريع للمقاطعات وإقران خطوط الإشارة بين المعالج بورد وبورد المرابط ومودم الشاشات بالمستشعرات.",
    purposeEn: "Links various circuit modules, sensors, and screens together with flexible, easy-to-trace ribbon cables.",
    specsAr: [
      "مصنوعة من معدن النحاس الصافي المرن المغلف بمادة الـ PVC عالية العزل.",
      "رؤوس عازلة ذات كفاءة مموجة للوقاية من تذبذبات التماسات.",
      "طول مناسب 30 سم لتنظيم مسارات الأسلاك والأسلاك بداخل الصندوق."
    ],
    specsEn: [
      "Constructed from 100% molecular copper shielded with high-grade PVC.",
      "Reinforced terminal blocks preventing slide-outs and wire fatigue.",
      "Convenient 30 cm wire lengths to keep internal enclosure paths clean."
    ]
  },
  {
    id: "bom27",
    nameAr: "خرطوم نقل وضخ المياه المرن ومحولات الضغط (PVC Water Hose)",
    nameEn: "Water Hose 6x8mm Gauge (TPU/PVC Flexible Hydration Tube)",
    qty: 1,
    mfg: "Industrial Hydro-Tubes LLC",
    mfgAr: "الشركة الفنية الموحدة لأنابيب الهيدروليك والري",
    purposeAr: "توصيل وتوجيه تدفق المياه المندفعة من مضخة مياه الـ TX10 وتفرعتها باتجاه جذور نخيل التمر بالبساتين الثلاثة.",
    purposeEn: "Channels the pressurized water output from the submersible water pump down to target root basins.",
    specsAr: [
      "مصنع من البلاستيك البوليمري PVC عديم التأثر بالكلور والمواد الملحية لشط العرب.",
      "أبعاد دقيقة: قطر داخلي 6 ملم وقابل للشد والتحميل الهيدروليكي الآمن للبراغي.",
      "عقد جدارية متينة تقاوم التجعيد والالتواء والحرارة تحت الطمر الشمسي."
    ],
    specsEn: [
      "Highly durable thermoplastic PVC material impervious to mineral salt buildup.",
      "Perfect sizing calibration matching 6mm inner / 8mm outer diameter bars.",
      "Excellent resistance to cracking, kinking, and structural degradation from solar UV rays."
    ]
  },
  {
    id: "bom28",
    nameAr: "مقاومة المعايرة ومجمعات دبابيس السليكون المانعة للتشويش",
    nameEn: "Breadboard Jumper Wires & Pull-up Clamping Accessories Pack",
    qty: 1,
    mfg: "Generic Electronics Hardware Pack",
    mfgAr: "مصانع مباعدات النحاس والقطع المساندة",
    purposeAr: "مباعدة وربط بورد الفيرو بورد في الزوايا الأربع وتأمين خلع وتسكين المعالج بشكل هندسي بداخل العلبة.",
    purposeEn: "Consolidates micro resistors, copper standoffs, and mounting hardware within the main junction box.",
    specsAr: [
      "تتضمن مباعدات نحاسية وبولي أميد لعزل البوردات عن العلبة.",
      "مجموعة مقاومات سحب مخصصة لبروتوكول الـ I2C وباص الـ One-Wire.",
      "مسامير معدنية مقاومة للصدأ مع حلقات إحكام مطاطية ضد الحرارة."
    ],
    specsEn: [
      "Includes brass and nylon standoffs to secure the double-sided Vero boards.",
      "Includes custom passive resistors for pull-down and I2C lines.",
      "Contains stainless steel bolts and nuts to achieve weather-proof seals."
    ]
  }
];

export default function ProjectStudyGuide({ isArabic }: { isArabic: boolean }) {
  const [activeGuideTab, setActiveGuideTab] = useState<'study' | 'monitor'>('study');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Realtime Live Monitor States for ALL core sensors and batteries requested
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [overridePump, setOverridePump] = useState<'auto' | 'on' | 'off'>('auto');
  const [tdsInput, setTdsInput] = useState<number>(1150); // TDS sensor
  const [tempSoil, setTempSoil] = useState<number>(27.5); // DS18B20 digital soil temp probe
  const [tempModule, setTempModule] = useState<number>(31.2); // DS18B20 Temperature Sensor Module
  const [humidityAir, setHumidityAir] = useState<number>(55); // DHT22 relative humidity (%)
  const [tempAir, setTempAir] = useState<number>(33.8); // DHT22 air temp (°C)
  const [moistureZ1, setMoistureZ1] = useState<number>(38); // Capacitive moisture Zone 1
  const [moistureZ2, setMoistureZ2] = useState<number>(42); // Capacitive moisture Zone 2
  const [moistureZ3, setMoistureZ3] = useState<number>(31); // Capacitive moisture Zone 3
  const [rainLevel, setRainLevel] = useState<number>(10); // Rain water level plate (%)
  const [batteryCharge, setBatteryCharge] = useState<number>(85); // 2x 18650 charge state (%)
  const [distanceInput, setDistanceInput] = useState<number>(45); // ESP-NOW Wireless spacing gap

  // Real-time ticking chronographic time tracking imitating the DS3231 precision RTC Module
  const [currentTimeWord, setCurrentTimeWord] = useState<string>("08:30:15");

  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      // Keep exact formatting for LCD
      const hh = String(now.getUTCHours() % 12 || 12).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentTimeWord(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Logical Safety Bounds calculations:
  const isSalinityExtremelyHigh = tdsInput > 2000;
  const isRainActive = rainLevel > 30;
  const isTempExtreme = tempSoil < 15 || tempSoil > 38;
  const isLinkSignalFailing = distanceInput > 120;
  const isBatteryLow = batteryCharge < 15;

  // Real Closed-Loop mechanical actions:
  // Valve triggers only if dry soil is detected (< 35%), salinity is safe, no active downpours, soil temperature is okay, batteries are healthy, ESP-NOW link is up!
  const isValve1Active = moistureZ1 < 35 && !isSalinityExtremelyHigh && !isRainActive && !isTempExtreme && !isLinkSignalFailing && !isBatteryLow;
  const isValve2Active = moistureZ2 < 35 && !isSalinityExtremelyHigh && !isRainActive && !isTempExtreme && !isLinkSignalFailing && !isBatteryLow;
  const isValve3Active = moistureZ3 < 35 && !isSalinityExtremelyHigh && !isRainActive && !isTempExtreme && !isLinkSignalFailing && !isBatteryLow;

  // The 12V High-Pressure Submersible Fluid Pump tx10 turns ON if ANY zone solenoid requires water, or overridden manually!
  const isPumpActive = overridePump === 'on' 
    ? true 
    : overridePump === 'off' 
      ? false 
      : (isValve1Active || isValve2Active || isValve3Active);

  // Safe battery voltage output model based on Lithium series nominal curves
  const batteryVoltage = (6.4 + (batteryCharge / 100) * 2.0).toFixed(2);

  // Wireless Signal Strength indicators dBM estimate
  const getDbmSignalValue = (meters: number) => {
    if (meters < 30) return { dbm: -52, textAr: "ممتاز جداً (Excellent)", color: "text-emerald-400" };
    if (meters < 70) return { dbm: -68, textAr: "مستقر وطبيعي (Good)", color: "text-teal-400" };
    if (meters < 120) return { dbm: -84, textAr: "ضعيف ومذبذب (Weak)", color: "text-amber-400" };
    return { dbm: -98, textAr: "إشارة غائبة كلياً (Disconnected)", color: "text-rose-500 font-bold animate-pulse" };
  };

  const currentSignal = getDbmSignalValue(distanceInput);

  // Filter components search function
  const filteredComponents = COMPONENT_SPECS.filter(comp => {
    const q = searchQuery.toLowerCase();
    return (
      comp.nameAr.toLowerCase().includes(q) ||
      comp.nameEn.toLowerCase().includes(q) ||
      comp.mfg.toLowerCase().includes(q) ||
      comp.mfgAr.toLowerCase().includes(q)
    );
  });

  // Biology & Physics Simulation loop: when on "Play", simulates real crop soil moisture increase if water is flowing!
  useEffect(() => {
    if (!isPlaying) return;

    const simulationLoop = setInterval(() => {
      // Zone 1 Moisture update
      setMoistureZ1(prev => {
        const delta = (isValve1Active && isPumpActive) ? 0.9 : -0.25; // if valve open and pump active, moisture goes up. Else, it evaporates
        const noise = (Math.random() - 0.5) * 0.3;
        return Number(Math.max(10, Math.min(95, prev + delta + noise)).toFixed(1));
      });

      // Zone 2 Moisture update
      setMoistureZ2(prev => {
        const delta = (isValve2Active && isPumpActive) ? 1.1 : -0.2; // slightly different drying characteristics representing distinct soil compositions
        const noise = (Math.random() - 0.5) * 0.3;
        return Number(Math.max(10, Math.min(95, prev + delta + noise)).toFixed(1));
      });

      // Zone 3 Moisture update
      setMoistureZ3(prev => {
        const delta = (isValve3Active && isPumpActive) ? 0.8 : -0.3;
        const noise = (Math.random() - 0.5) * 0.3;
        return Number(Math.max(10, Math.min(95, prev + delta + noise)).toFixed(1));
      });

      // TDS micro fluctuations
      setTdsInput(prev => {
        // Active watering slightly dilutes soil minerals
        const dilution = isPumpActive ? -4 : 2;
        const noise = Math.floor((Math.random() - 0.5) * 10);
        return Math.max(120, Math.min(3500, prev + dilution + noise));
      });

      // Air Temperature & Soil temperature tiny drifts based on evaporation
      setTempSoil(prev => {
        const cooling = isPumpActive ? -0.05 : 0.02;
        const noise = Number(((Math.random() - 0.5) * 0.06).toFixed(2));
        return Number(Math.max(12, Math.min(48, prev + cooling + noise)).toFixed(2));
      });

      setTempAir(prev => {
        const noise = Number(((Math.random() - 0.5) * 0.08).toFixed(2));
        return Number(Math.max(15, Math.min(52, prev + noise)).toFixed(2));
      });

      setTempModule(prev => {
        // active processing increases chip heat
        const processingDelta = isPumpActive ? 0.08 : -0.04;
        const noise = Number(((Math.random() - 0.5) * 0.05).toFixed(2));
        return Number(Math.max(20, Math.min(45, prev + processingDelta + noise)).toFixed(2));
      });

      // Air humidity trends
      setHumidityAir(prev => {
        const evaporationBoost = isPumpActive ? 0.4 : -0.1;
        const noise = Number(((Math.random() - 0.5) * 0.5).toFixed(1));
        return Number(Math.max(15, Math.min(98, prev + evaporationBoost + noise)).toFixed(1));
      });

      // Battery Slowly depletes if we aren't charging, or fluctuates slightly
      setBatteryCharge(prev => {
        const depletionRate = isPumpActive ? -0.08 : -0.01;
        return Number(Math.max(8, Math.min(100, prev + depletionRate)).toFixed(2));
      });

    }, 1200);

    return () => clearInterval(simulationLoop);
  }, [isPlaying, isValve1Active, isValve2Active, isValve3Active, isPumpActive]);

  // Sync normal values when pump is active, and reset to 0/safe defaults when pump is stopped
  useEffect(() => {
    if (isPumpActive) {
      // Re-initialize to healthy normal operating values if they are 0 (e.g. freshly turned ON)
      setMoistureZ1(prev => (prev <= 1 ? 32.5 : prev));
      setMoistureZ2(prev => (prev <= 1 ? 38.0 : prev));
      setMoistureZ3(prev => (prev <= 1 ? 29.5 : prev));
      setTdsInput(prev => (prev <= 10 ? 1150 : prev));
      // if tempSoil is below threshold of 10, set to safe 27.5 °C so that tempExtreme doesnt block auto mode
      setTempSoil(prev => (prev < 15 ? 27.5 : prev));
      setTempModule(prev => (prev <= 1 ? 31.2 : prev));
      setHumidityAir(prev => (prev <= 1 ? 55.0 : prev));
      setTempAir(prev => (prev <= 1 ? 33.8 : prev));
      setRainLevel(prev => (prev > 30 ? 10 : prev)); // ensure rain doesn't block pump
    } else {
      // When stopped, all sensors zero out!
      // This is for: "وعند الايقاف تصفر جميع الحساسات وتكون هذه في شاشة اختبار القرائات"
      setMoistureZ1(0);
      setMoistureZ2(0);
      setMoistureZ3(0);
      setTdsInput(0);
      setTempSoil(0);
      setTempModule(0);
      setHumidityAir(0);
      setTempAir(0);
      setRainLevel(0);
    }
  }, [isPumpActive]);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-4 sm:p-6 gap-6" id="study-panel-wrapper">
      
      {/* Interactive Sub Header Switch Container */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-2 rounded-xl gap-2 shadow-xs" id="interactive-sub-navigation">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveGuideTab('study')}
            className={`cursor-pointer px-4 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
              activeGuideTab === 'study'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600'
            }`}
            id="subtab-study-guide"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{isArabic ? "الدليل الأكاديمي الشامل للمناقشة والعتاد الأسلم" : "Comprehensive Study QA & Specs"}</span>
          </button>
          
          <button
            onClick={() => setActiveGuideTab('monitor')}
            className={`cursor-pointer px-4 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
              activeGuideTab === 'monitor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600'
            }`}
            id="subtab-live-monitor"
          >
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
            <span>{isArabic ? "شاشة اختبار القراءات الحية التجريبية (Live Monitor)" : "Interactive Live Sensor Monitor"}</span>
          </button>
        </div>

        <div className="text-right flex items-center gap-1.5" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[10px] md:text-xs font-black text-slate-550 font-sans">
            {isArabic ? "منصة إعداد الطلاب وشاشات الاختبار" : "Academic Study Panel & Live Simulation Sandbox"}
          </span>
        </div>
      </div>

      {/* RENDER CONTENT BASED ON SELECTED TAB */}
      <AnimatePresence mode="wait">
        {activeGuideTab === 'study' ? (
          <motion.div
            key="guide-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Banner block informing students of the total academic material and project owners */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden text-right" dir="rtl">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="space-y-2 max-w-4xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Info className="w-3.5 h-3.5" />
                    المفهوم الأكاديمي ودليل الهيكل العتادي الموثق لجامعة المعقل
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white leading-normal font-sans">
                    دليل الطالب لمناقشة مشروع التحكم الذكي بالملوحة بنخيل التمر
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-medium">
                    مرحباً بكم يا شباب في هذا الدليل الجامعي المخصص للتدقيق من قبل اللجنة! لقد قمنا بصياغة وتصنيف جميع الأجهزة والأسلاك وحساسات الملوحة البالغ عددها ٢٨ قطعة والمذكورة في فواتير براءة الاختراع وتقرير التخرج. تم تبسيط المعلومات وتقدير كفاءة التشغيل لكل حساس لتسهيل مراجعتها والإلمام بكافة الإجابات الدقيقة لعرضها بفخر أمام المحكمين بامتياز.
                  </p>
                </div>
                
                <div className="flex flex-row md:flex-col gap-3 min-w-[170px] w-full md:w-auto">
                  <div className="bg-white/5 border border-white/10 p-2 rounded-lg flex-1 text-center">
                    <span className="text-[9px] text-slate-400 font-bold block">مجموع قطع المشروع</span>
                    <span className="text-base font-black text-amber-400">٢٨ أداة حقيقية</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 rounded-lg flex-1 text-center">
                    <span className="text-[9px] text-slate-400 font-bold block">إجمالي كلفة النموذج</span>
                    <span className="text-base font-black text-emerald-400">198,500 دينار عراقي</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section A: Q&A Academic Prep Block */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2 justify-start text-right" dir="rtl">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>أولاً: الأسئلة المتوقعة من لجنة المناقشة وحلولها المعتمدة (Exam QAs):</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STUDY_GUIDE_QA.map((qa, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-blue-400 transition-all flex flex-col justify-between gap-3 shadow-xs text-right"
                    dir="rtl"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="bg-slate-100 text-slate-705 text-slate-650 font-black text-[10px] px-2.5 py-1 rounded-full border border-slate-200">
                          {isArabic ? `السؤال المنهجي ${index + 1}` : `Exam QA ${index + 1}`}
                        </span>
                        <div className="flex gap-1">
                          {qa.tags.map((tg, idx) => (
                            <span key={idx} className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h4 className="text-sm md:text-base font-black text-slate-800 leading-relaxed font-sans">
                        {isArabic ? qa.qAr : qa.qEn}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {isArabic ? qa.aAr : qa.aEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: The Comprehensive 28 Components Spec Sheet */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-250 pb-4">
                <div className="text-right flex-1" dir="rtl">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2 justify-start">
                    <Layers className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>ثانياً: كتالوج القطع الأساسية والشركات المصنعة الدولية ونطاق عملها (28 Parts Spec Sheet):</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-sans font-bold mt-1">
                    دليل تفصيلي كامل لجميع القطع الحقيقية المستخدمة وعددها، الجهة الصانعة، والوظيفة للرد على أسئلة غلاف الدارات.
                  </p>
                </div>
                
                {/* Search Bar filter */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder={isArabic ? "ابحث بالبحث السريع (مثال: ESP32)..." : "Search components (e.g. Diode)..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs font-bold pl-9 pr-4 py-2.5 rounded-xl border border-slate-350 focus:border-blue-500 focus:outline-hidden bg-white shadow-xs text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Grid map for components specs sheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((spec) => (
                    <div 
                      key={spec.id} 
                      className="bg-white border hover:border-blue-400 border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm text-right transition-all group"
                      dir="rtl"
                    >
                      <div>
                        {/* Component Card Header */}
                        <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
                          <span className="bg-amber-100/60 text-amber-800 font-black text-[10px] px-2.5 py-1 rounded-md">
                            {isArabic ? `الكمية: ${spec.qty} وحدات` : `Qty: ${spec.qty} units`}
                          </span>
                          <span className="text-[9px] font-mono font-black text-slate-400 tracking-wide uppercase">
                            BOM SPEC LOG
                          </span>
                        </div>

                        <h4 className="text-sm md:text-base font-black text-slate-850 leading-snug group-hover:text-blue-700 transition-colors">
                          {isArabic ? spec.nameAr : spec.nameEn}
                        </h4>

                        {/* Manufacturer specification badge */}
                        <div className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 my-2.5 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 font-bold block">الشركة المصنعة والأصل (Manufacturer)</span>
                            <span className="text-xs font-black text-slate-700 tracking-tight leading-none mt-0.5 block">
                              {isArabic ? spec.mfgAr : spec.mfg}
                            </span>
                          </div>
                        </div>

                        {/* Intended purpose block */}
                        <div className="space-y-1 mt-1">
                          <span className="text-[10px] font-black text-slate-400 block">{isArabic ? "دوره ووظيفته بالكامل في المشروع:" : "Project Functional Role:"}</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans font-semibold">
                            {isArabic ? spec.purposeAr : spec.purposeEn}
                          </p>
                        </div>
                      </div>

                      {/* Bullet specs list */}
                      <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 bg-gradient-to-b from-transparent to-slate-50/20 -mx-5 -mb-5 p-5 rounded-b-xl">
                        <span className="text-[10px] font-black text-slate-400 block">{isArabic ? "المواصفات التقنية والمصنعية للقطعة:" : "Component Data Specifications:"}</span>
                        <ul className="text-xs text-slate-700 font-sans font-semibold space-y-1.5">
                          {(isArabic ? spec.specsAr : spec.specsEn).map((sp, idx) => (
                            <li key={idx} className="flex gap-2 items-start justify-start">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              <span>{sp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-bold">
                    {isArabic ? "⚠️ لم يتم العثور على قطع تطابق عبارة البحث الخاصة بك." : "⚠️ No components found matching your query."}
                  </div>
                )}
              </div>
            </div>

            {/* Operating, Safe Execution Flow, and Pros & Environmental Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              
              {/* Box 1: Startup & Shutdown Cycle Procedures */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-right flex flex-col gap-4" dir="rtl">
                <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start flex items-center gap-1">
                  <Power className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  {isArabic ? "آلية تشغيل وإيقاف المشروع الآمن متكاملاً" : "System Powering Steps"}
                </span>

                <div className="flex flex-col gap-4 mt-1">
                  {/* Boot steps */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {isArabic ? "طريقة عملية التشغيل البدئية (Startup Cycle):" : "Safe Startup Steps:"}
                    </h4>
                    <ul className="text-xs text-slate-600 font-medium space-y-2 font-sans pl-1.5 leading-relaxed">
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">١.</span>
                        <span>تزويد النظام بالتيار عن طريق لوحة SMPS أو محول 12V لتفجير فولتية الريليه والصمامات والمضخة.</span>
                      </li>
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">٢.</span>
                        <span>دفع التيار عبر منظمي الجهد LM2596 لتأمين قنوات الـ 5V والـ 3.3V بشكل مستقل حماية للشرائح.</span>
                      </li>
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">٣.</span>
                        <span>إقلاع متحكم ESP32 وتفعيل خوارزمية تصفية الإشارات وقرصنة الـ EEPROM لاستدعاء أوفسيتات معايرة الـ TDS.</span>
                      </li>
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">٤.</span>
                        <span>بدء البث اللاسلكي السريع بروتوكول ESP-NOW والاقتران مع العقد الحقلية والتحويل الرقمي (ADC1).</span>
                      </li>
                    </ul>
                  </div>

                  {/* Shutdown steps */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <h4 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      {isArabic ? "آلية عملية الإيقاف والحماية الفورية (Shutdown Cycle):" : "Stop / Sleep Mode Steps:"}
                    </h4>
                    <ul className="text-xs text-slate-600 font-medium space-y-2 font-sans pl-1.5 leading-relaxed">
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">١.</span>
                        <span>سحب إشارة التحكم (GPIO Output Low) من بوردة الريليهات المعزولة ضوئياً PC817.</span>
                      </li>
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">٢.</span>
                        <span>تفريع فوري لصدمة الارتداد الكهرومغناطيسي لملف الصمام (counter-EMF) عبر ديود الـ 1N5408 لتجنب تلف شرارات ريليه السيطرة.</span>
                      </li>
                      <li className="flex gap-1.5 justify-start">
                        <span className="text-slate-400 font-black">٣.</span>
                        <span>إرسال تعليمة السكون العميق (Deep Sleep 15µA) لكافة المعالجات وإرخاء النوابض لتوفير طاقة الخلايا والبطاريات.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Box 2: Project Pros & Benefits (What does it solve?) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-right flex flex-col justify-between gap-4" dir="rtl">
                <div className="space-y-3">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-250 px-3 py-1 rounded-full self-start flex items-center gap-1 w-max">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {isArabic ? "إيجابيات وفوائد المشروع وحلول الأزمات" : "Project Pros & Problem Solving Guide"}
                  </span>

                  <h4 className="text-sm md:text-base font-black text-slate-850 pt-1 leading-normal">
                    الأزمات والمشكلات البيئية الكبرى التي يعالجها النظام:
                  </h4>

                  <ul className="text-xs sm:text-sm text-slate-650 font-sans font-medium space-y-3 pl-1.5">
                    <li className="flex gap-2 justify-start items-start">
                      <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-amber-200 font-mono">١</div>
                      <div className="text-right">
                        <span className="text-slate-800 font-black text-xs block">مواجهة زحف شط العرب وتحييد أضرار ملوحته:</span>
                        <span className="text-slate-600 text-xs block mt-0.5 font-sans leading-relaxed">حظر فوري للري اليدوي الضار وقت دخول المد المالح، لصد تملح وذبول وموت جذور بساتين أبو الخصيب والفاو أسموزياً.</span>
                      </div>
                    </li>
                    <li className="flex gap-2 justify-start items-start">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-blue-200 font-mono">٢</div>
                      <div className="text-right">
                        <span className="text-slate-800 font-black text-xs block">ترشيد مائي واقتصادي هائل (Water Conservation):</span>
                        <span className="text-slate-600 text-xs block mt-0.5 font-sans leading-relaxed">سقاية النخيل بدقة متناهية حسب جداول الرطوبة وبأوقات الصباح الرطب، مانعين تبخر كميات هائلة من مياه السقي.</span>
                      </div>
                    </li>
                    <li className="flex gap-2 justify-start items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-indigo-200 font-mono">٣</div>
                      <div className="text-right">
                        <span className="text-slate-800 font-black text-xs block">تفعيل الـ Closed-Loop والسيطرة الموزعة:</span>
                        <span className="text-slate-650 text-xs block mt-0.5 font-sans leading-relaxed">تقسيم المهام بين ٣ عقد موزعة يمنع انهيار النظام بالكامل في حال تعطل أحد المستشعرات، مع عزل كامل للشوشرة الكهروكيميائية.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/30 border border-emerald-250 p-3.5 rounded-lg flex items-center gap-2 text-xs text-emerald-850 mt-1">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-sans font-bold text-emerald-950">
                    ملخص للجنة الامتحان: المشروع يحقق كفاءة استدامة فائقة للأمن الغذائي والزراعة الدقيقة باستخدام معالجات رخيصة الكلفة وذات حصانة تيارية كاملة.
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="monitor-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* Simulation Header / Active Switcher banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 border border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right" dir="rtl">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-xs font-black text-teal-400 font-mono tracking-wider flex items-center gap-1.5 justify-start">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE INTERACTIVE SANDBOX DEMO (ALL SENSORS ACTIVE)
                </span>
                <h3 className="text-base sm:text-lg font-black font-sans leading-none">
                  لوحة اختبار ومعايرة القراءات الحية التفاعلية لكافة حساسات المشروع
                </h3>
                <p className="text-xs text-slate-450 font-sans leading-relaxed mt-1">
                  قم بتحريك الأشرطة التفاعلية بالجانب وضبط قراءات رطوبة التربة للمناطق الثلاث (Zone 1, Zone 2, Zone 3)، مستوى الأملاح (TDS PPM)، مستشعر المطر، درجة حرارة التربة والهواء الخارجي لـ DHT22، وشاهد في الحال كيف يستجيب عقل المنظومة اللاسلكي لاتخاذ القرار بفتح أو غلق صمام ري كل منطقة!
                </p>
              </div>

              {/* Play Pause button simulation */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`cursor-pointer px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 bg-slate-800 border ${
                  isPlaying 
                    ? 'border-emerald-500/20 text-emerald-400' 
                    : 'border-slate-700 text-slate-400'
                }`}
                id="btn-trigger-play-pause-simulation"
              >
                <div className={`h-2.5 w-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span>{isPlaying ? (isArabic ? "تذبذب بيولوجي تلقائي نشط" : "Dynamic Auto-Drift Active") : (isArabic ? "تم تجميد القيم للضبط اليدوي" : "Values Frozen (Manual)")}</span>
              </button>
            </div>

            {/* Twin Columns Layout: Controls Sliders vs LCD Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Column 1: Controls (Sliders for ALL project sensors) */}
              <div className="lg:col-span-6 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-6 text-right" dir="rtl">
                <h4 className="text-xs sm:text-sm font-black text-slate-850 pb-2 border-b border-slate-100 flex items-center gap-2 justify-start">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  {isArabic ? "لوحة ضبط وتوليد الإشارات الحساسة:" : "Simulated Physical Sensor Sliders:"}
                </h4>

                {/* Sub-grid of soil moistures (Zone 1, Zone 2, Zone 3) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                    {isArabic ? "مجموعة قياس رطوبة التربة السعوية (3x Capacitive Moisture Sensors):" : "3x Capacitive Soil Moisture Probes:"}
                  </span>

                  {/* Slider Zone 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-750">
                      <span>{isArabic ? "رطوبة المنطقة الأولى (Zone 1):" : "Zone 1 Moisture:"}</span>
                      <span className={`font-mono font-black text-xs ${moistureZ1 < 35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {moistureZ1}% {moistureZ1 < 35 ? (isArabic ? "(جافة - سقاية مطلوبة)" : "(Dry)") : (isArabic ? "(مروية)" : "(Okey)")}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="95" 
                      value={moistureZ1} 
                      onChange={(e) => {
                        setMoistureZ1(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1.5 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Slider Zone 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-750">
                      <span>{isArabic ? "رطوبة المنطقة الثانية (Zone 2):" : "Zone 2 Moisture:"}</span>
                      <span className={`font-mono font-black text-xs ${moistureZ2 < 35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {moistureZ2}% {moistureZ2 < 35 ? (isArabic ? "(جافة - سقاية مطلوبة)" : "(Dry)") : (isArabic ? "(مروية)" : "(Okey)")}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="95" 
                      value={moistureZ2} 
                      onChange={(e) => {
                        setMoistureZ2(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1.5 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Slider Zone 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-750">
                      <span>{isArabic ? "رطوبة المنطقة الثالثة (Zone 3):" : "Zone 3 Moisture:"}</span>
                      <span className={`font-mono font-black text-xs ${moistureZ3 < 35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {moistureZ3}% {moistureZ3 < 35 ? (isArabic ? "(جافة - سقاية مطلوبة)" : "(Dry)") : (isArabic ? "(مروية)" : "(Okey)")}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="95" 
                      value={moistureZ3} 
                      onChange={(e) => {
                        setMoistureZ3(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1.5 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Slider: TDS Salinity Sensor */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      {isArabic ? "مستوى ملوحة مياه شط العرب (TDS Saliity Module):" : "Water Salinity Level (TDS):"}
                    </span>
                    <span className={`font-mono font-black ${isSalinityExtremelyHigh ? 'text-rose-600 animate-pulse' : 'text-blue-600'}`}>
                      {tdsInput} PPM
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="3500" 
                    value={tdsInput} 
                    onChange={(e) => {
                      setTdsInput(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-650 accent-blue-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{isArabic ? "عذبة ممتازة (<1000)" : "Fresh <1000 PPM"}</span>
                    <span>{isArabic ? "الحد الحرج للحظر (2000)" : "Salt Block >2000 PPM"}</span>
                    <span>{isArabic ? "شديدة التملح (3500)" : "Hazard 3500 PPM"}</span>
                  </div>
                </div>

                {/* Slider: DS18B20 Temp Probe */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                      {isArabic ? "حرارة باطن التربة (DS18B20 Soil Probe):" : "Deep Soil Temp (DS18B20):"}
                    </span>
                    <span className={`font-mono font-black ${isTempExtreme ? 'text-rose-600 font-black' : 'text-slate-750'}`}>
                      {tempSoil} °C
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="48" 
                    step="0.5"
                    value={tempSoil} 
                    onChange={(e) => {
                      setTempSoil(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{isArabic ? "باردة (10°C)" : "10°C"}</span>
                    <span>{isArabic ? "النطاق الآمن للجذور (15°C - 38°C)" : "Soil Safe bounds (15°C - 38°C)"}</span>
                    <span>{isArabic ? "حارة (48°C)" : "48°C"}</span>
                  </div>
                </div>

                {/* Slider: DHT22 Humidity & Temp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-slate-550 block">{isArabic ? "رطوبة هواء الغلاف (DHT22 Humidity):" : "DHT22 Humid %:"}</label>
                    <div className="flex justify-between items-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="98" 
                        value={humidityAir} 
                        onChange={(e) => {
                          setHumidityAir(Number(e.target.value));
                          setIsPlaying(false);
                        }}
                        className="w-2/3 h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="font-mono text-xs font-black text-indigo-700">{humidityAir}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-slate-550 block">{isArabic ? "حرارة هواء المحيط (DHT22 Temp):" : "DHT22 Temperature:"}</label>
                    <div className="flex justify-between items-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="52" 
                        value={tempAir} 
                        onChange={(e) => {
                          setTempAir(Number(e.target.value));
                          setIsPlaying(false);
                        }}
                        className="w-2/3 h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <span className="font-mono text-xs font-black text-orange-700">{tempAir}°C</span>
                    </div>
                  </div>
                </div>

                {/* Sliders: Rain level Sensor & Battery Charge & ESP-NOW Distance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Rain Sensor */}
                  <div className="space-y-1 bg-blue-50/45 border border-blue-100 p-2.5 rounded-lg text-right">
                    <span className="text-[9px] uppercase font-black text-blue-600 block">{isArabic ? "حساس هطول المطر" : "Rain Level Sensor"}</span>
                    <div className="flex justify-between items-center text-xs font-bold my-1">
                      <span className={isRainActive ? 'text-rose-600 font-bold' : 'text-blue-700'}>
                        {rainLevel}%
                      </span>
                      <span className="text-[8px] text-slate-500">{isRainActive ? (isArabic ? "مطر غزير" : "Heavy Rain") : (isArabic ? "صاحٍ" : "Dry")}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={rainLevel} 
                      onChange={(e) => {
                        setRainLevel(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Battery Reserve */}
                  <div className="space-y-1 bg-emerald-50/45 border border-emerald-100 p-2.5 rounded-lg text-right">
                    <span className="text-[9px] uppercase font-black text-emerald-600 block">{isArabic ? "شحن وقوة البطارية" : "18650 Battery"}</span>
                    <div className="flex justify-between items-center text-xs font-bold my-1">
                      <span className={isBatteryLow ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}>
                        {batteryCharge}%
                      </span>
                      <span className="text-[8px] text-slate-500 font-mono">{batteryVoltage}V</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={batteryCharge} 
                      onChange={(e) => {
                        setBatteryCharge(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* ESP-NOW Link Distance */}
                  <div className="space-y-1 bg-indigo-50/45 border border-indigo-100 p-2.5 rounded-lg text-right">
                    <span className="text-[9px] uppercase font-black text-indigo-600 block">{isArabic ? "تباعد عقد البث" : "ESP-NOW distance"}</span>
                    <div className="flex justify-between items-center text-xs font-bold my-1">
                      <span className={isLinkSignalFailing ? 'text-rose-600 font-bold' : 'text-indigo-700'}>
                        {distanceInput}م
                      </span>
                      <span className="text-[8px] text-slate-500">{isLinkSignalFailing ? (isArabic ? "مفصول" : "Over") : (isArabic ? "متصل" : "Ok")}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="180" 
                      value={distanceInput} 
                      onChange={(e) => {
                        setDistanceInput(Number(e.target.value));
                        setIsPlaying(false);
                      }}
                      className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

              </div>

              {/* Column 2: Dashboard Visual LCD display & output signals */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                
                {/* Simulated 20x4 Alphanumeric LCD display representing the actual HD44780 standard with PCF8574 I2C Backpack */}
                <div className="bg-blue-950 p-5 rounded-2xl border-8 border-slate-800 flex flex-col gap-3.5 text-blue-100 shadow-xl relative overflow-hidden" id="simulated-digital-lcd">
                  {/* LCD Backlight Glass overlay styling */}
                  <div className="absolute inset-0 bg-radial-gradient from-blue-900 via-blue-950 to-slate-950 pointer-events-none opacity-90" />
                  
                  {/* Top LCD Plate Label */}
                  <div className="relative z-10 flex justify-between items-center text-[8px] tracking-widest text-blue-300 font-mono border-b border-blue-900/40 pb-2">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                      HMI: 20x4 CHAR LCD (I2C: 0x27)
                    </span>
                    <span>AL-MAAQAAL UNIVERSITY</span>
                  </div>

                  {/* Simulated 4 lines on a real 20x4 LCD Display Box */}
                  <div className="relative z-10 bg-blue-900/60 p-4 rounded-lg border border-blue-400/30 font-mono text-center space-y-2 text-sm md:text-base text-cyan-200 select-all shadow-inner">
                    {/* Line 1: Soil moistures for zones 1, 2, 3 */}
                    <div className="flex justify-between border-b border-blue-950/40 pb-1">
                      <span className="text-[10px] text-blue-400 font-bold">Line1:</span>
                      <span className="tracking-widest">Z1:{Math.floor(moistureZ1)}% Z2:{Math.floor(moistureZ2)}% Z3:{Math.floor(moistureZ3)}%</span>
                    </div>
                    
                    {/* Line 2: TDS Salinity and Weather info */}
                    <div className="flex justify-between border-b border-blue-950/40 pb-1">
                      <span className="text-[10px] text-blue-400 font-bold">Line2:</span>
                      <span className="tracking-widest text-cyan-100">TDS:{tdsInput}ppm  R:{Math.floor(rainLevel)}%</span>
                    </div>

                    {/* Line 3: Air DHT22 sensors & Soil Temperature */}
                    <div className="flex justify-between border-b border-blue-950/40 pb-1">
                      <span className="text-[10px] text-blue-400 font-bold">Line3:</span>
                      <span className="tracking-widest">AirH:{Math.floor(humidityAir)}% S_Tmp:{tempSoil}°C</span>
                    </div>

                    {/* Line 4: Actuator and Battery health indicators */}
                    <div className="flex justify-between pb-1">
                      <span className="text-[10px] text-blue-400 font-bold">Line4:</span>
                      <span className="tracking-widest text-emerald-300 font-bold">
                        Pmp:{isPumpActive ? "ON " : "OFF"} Bat:{Math.floor(batteryCharge)}% {batteryVoltage}V
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Time ticker simulation from DS3231 RTC Module */}
                  <div className="relative z-10 flex justify-between items-center text-[10px] text-blue-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {isArabic ? `فولطية المنظم: 3.3V / 5V` : `Regulated Power: 3.3V / 5.0V`}
                    </span>
                    <span className="bg-blue-900/40 px-2 py-0.5 rounded border border-blue-800/20">
                      ⏱️ RTC CLOCK: {currentTimeWord} UTC
                    </span>
                  </div>
                </div>

                {/* Real-time mechanical status indicators of all Zone Valves and Submersible Pumps */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-right" dir="rtl">
                  <h4 className="text-xs font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2 justify-start">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    {isArabic ? "مستوى تفعيل الصمامات ومضخة الخزان اللحظي:" : "Active Valve & Pump Outputs:"}
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    
                    {/* Solenoid Valve 1 */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      isValve1Active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 scale-102 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <Zap className={`w-4 h-4 ${isValve1Active ? 'text-emerald-500 animate-bounce' : 'text-slate-300'}`} />
                      <span className="text-[10px] font-black">{isArabic ? "صمام المنطقة ١" : "Solenoid 1"}</span>
                      <span className="text-xs font-black font-sans">{isValve1Active ? "ON (12V)" : "OFF"}</span>
                    </div>

                    {/* Solenoid Valve 2 */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      isValve2Active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 scale-102 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <Zap className={`w-4 h-4 ${isValve2Active ? 'text-emerald-500 animate-bounce' : 'text-slate-300'}`} />
                      <span className="text-[10px] font-black">{isArabic ? "صمام المنطقة ٢" : "Solenoid 2"}</span>
                      <span className="text-xs font-black font-sans">{isValve2Active ? "ON (12V)" : "OFF"}</span>
                    </div>

                    {/* Solenoid Valve 3 */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      isValve3Active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 scale-102 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <Zap className={`w-4 h-4 ${isValve3Active ? 'text-emerald-500 animate-bounce' : 'text-slate-300'}`} />
                      <span className="text-[10px] font-black">{isArabic ? "صمام المنطقة ٣" : "Solenoid 3"}</span>
                      <span className="text-xs font-black font-sans">{isValve3Active ? "ON (12V)" : "OFF"}</span>
                    </div>

                    {/* DC TX10 Water Pump */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      isPumpActive
                        ? 'bg-blue-50 border-blue-300 text-blue-700 scale-102 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <Activity className={`w-4 h-4 ${isPumpActive ? 'text-blue-500 animate-spin' : 'text-slate-300'}`} />
                      <span className="text-[10px] font-black">{isArabic ? "مضخة الماء TX10" : "Solenoid Pump"}</span>
                      <span className="text-xs font-black font-sans">{isPumpActive ? "ON (12V)" : "OFF"}</span>
                    </div>

                  </div>

                  {/* Manual Pump Control Buttons */}
                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-right" dir="rtl" id="manual-pump-control-container">
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-800 block">
                          {isArabic ? "التحكم اليدوي بمضخة الخزان (Pump Override):" : "Manual Pump Override Control:"}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-medium">
                          {isArabic ? "تفعيل تشغيل أو إيقاف المضخة يدوياً متجاوزاً منطق الحساسات التلقائي." : "Force-power the pump ON or OFF, bypassing the automated soil and salinity logics."}
                        </span>
                      </div>
                    </div>

                    <div className="flex p-0.5 bg-slate-200/50 rounded-lg w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setOverridePump('on');
                          setIsPlaying(false);
                        }}
                        className={`cursor-pointer px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex-1 sm:flex-initial flex items-center justify-center gap-1 ${
                          overridePump === 'on'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
                        }`}
                        id="btn-force-pump-on"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{isArabic ? "تشغيل المضخة" : "Force ON"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setOverridePump('off');
                          setIsPlaying(false);
                        }}
                        className={`cursor-pointer px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex-1 sm:flex-initial flex items-center justify-center gap-1 ${
                          overridePump === 'off'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
                        }`}
                        id="btn-force-pump-off"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>{isArabic ? "إيقاف المضخة" : "Force OFF"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setOverridePump('auto');
                        }}
                        className={`cursor-pointer px-4 py-1.5 rounded-md text-[11px] font-bold transition-all flex-1 sm:flex-initial flex items-center justify-center gap-1 ${
                          overridePump === 'auto'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-transparent text-slate-700 hover:bg-slate-200/60'
                        }`}
                        id="btn-force-pump-auto"
                      >
                        <span>{isArabic ? "النظام التلقائي" : "Auto System"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Contextual notification card for sensor zeroing-out rule requested by user */}
                  <div className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2 ${
                    isPumpActive 
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-850' 
                      : 'bg-amber-50/40 border-amber-200/70 text-slate-700'
                  }`} dir="rtl" id="sensor-status-rule-notice">
                    <div className="w-2 h-2 rounded-full shrink-0 animate-pulse bg-current" />
                    <p className="text-xs font-sans leading-relaxed">
                      {isArabic ? (
                        <>
                          {isPumpActive ? (
                            <span><strong>حالة القراءات الحالية:</strong> الحساسات تعمل وتعطي القراءات الطبيعية لتشغيل المضخة بنجاح.</span>
                          ) : (
                            <span><strong>نظام تصفير الحساسات نشط:</strong> تم تصفير جميع الحساسات تلقائياً لكون المضخة متوقفة (حالة السكون وحفظ الطاقة).</span>
                          )}
                        </>
                      ) : (
                        <>
                          {isPumpActive ? (
                            <span><strong>Readings State:</strong> Sensors are active and displaying normal/natural operating values with the pump active.</span>
                          ) : (
                            <span><strong>Sensor Zeroing Active:</strong> All sensors have zeroed out because the pump is idle (sleep & power-saving mode).</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Active diagnosis logs console simulating serial diagnostics */}
                  <div className="bg-slate-900 rounded-lg p-3 text-[10px] font-mono text-emerald-400 space-y-1 text-left max-h-24 overflow-y-auto mt-2">
                    <p className="text-slate-500">{"[SERIAL DIAGNOSTICS - STABLE CORES]"}</p>
                    <p>{"[00:02:11] Node 1 (Coordination): Sending parameters to Node 3 via ESP-NOW."}</p>
                    <p>{"[00:02:12] Sensor readouts: TDS=" + tdsInput + "ppm, AirTemp=" + tempAir + "C, SoilTemp=" + tempSoil + "C"}</p>
                    <p>{"[00:02:13] Moistures: Z1=" + Math.floor(moistureZ1) + "%, Z2=" + Math.floor(moistureZ2) + "%, Z3=" + Math.floor(moistureZ3) + "%"}</p>
                    <p>{"[00:02:14] Rain sensor: " + Math.floor(rainLevel) + "% (" + (isRainActive ? "RAIN ACTIVATED INTERRUPT OVERRIDE!" : "STABLE") + ")"}</p>
                    <p>{"[00:02:15] Batteries: voltage = " + batteryVoltage + "V (" + (isBatteryLow ? "CRITICALLY LOW VOLTAGE!" : "GOOD") + ")"}</p>
                    {isPumpActive ? (
                      <p className="text-emerald-300">{"[00:02:16] DECISION -> GPIO_13 Trigger HIGH! 12V Submersible Pump running."}</p>
                    ) : (
                      <p className="text-amber-400">{"[00:02:16] DECISION -> Standby Sleep Mode active. Current draw: 15µA."}</p>
                    )}
                  </div>
                </div>

                {/* Simulated Oscilloscope Waveform diagram explaining Flyback action */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between text-right" dir="rtl">
                  <div className="space-y-1 md:max-w-md w-full">
                    <span className="text-[10px] font-black uppercase text-blue-600 block">FLYBACK DIODE TRANSIENT AUDIT (1N5408)</span>
                    <h4 className="text-sm font-black text-slate-800">
                      موجة الارتداد عند انقطاع تيار صمام السقاية:
                    </h4>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">
                      يعرض هذا المخطط الموجي نبضة إغلاق الريليه. في غياب الديود، تولد الملفات موجات ذات قمم عريضة متقلبة قادرة على حرق ESP32. لكن بتواجد ديود 1N5408، تهبط الشحنة تدريجياً وبسرعة فائقة إلى خط الصفر الآمن.
                    </p>
                  </div>

                  {/* Oscilloscope Visual SVG Canvas representation */}
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 w-full md:w-48 h-24 flex items-center justify-center relative overflow-hidden" id="mini-oscilloscope-screen">
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.1] border-slate-700 pointer-events-none">
                      <div className="border-r border-b"></div>
                      <div className="border-r border-b"></div>
                      <div className="border-r border-b"></div>
                      <div className="border-r"></div>
                    </div>
                    {/* SVG wave signal */}
                    <svg className="w-full h-full text-emerald-400 relative z-10" viewBox="0 0 160 80">
                      {/* Original spike dashed */}
                      <path 
                        d="M 10,40 L 40,40 L 40,5 L 43,75 L 46,20 L 50,40 L 150,40" 
                        fill="none" 
                        stroke="rgba(239, 68, 68, 0.45)" 
                        strokeWidth="1" 
                        strokeDasharray="2,2"
                      />
                      {/* Damped spike with diode (solid green/blue) */}
                      <path 
                        d="M 10,40 L 40,40 L 40,40 L 41,55 L 45,45 L 48,41 L 52,40 L 150,40" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    </svg>
                    <span className="absolute bottom-1 right-2.5 text-[7px] text-rose-500 font-bold tracking-widest uppercase">No Diode Spike</span>
                    <span className="absolute top-1 left-2.5 text-[7px] text-emerald-400 font-bold tracking-widest uppercase">1N5408 Clamp</span>
                  </div>
                </div>

              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
