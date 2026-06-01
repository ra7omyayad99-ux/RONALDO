import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MonitorPlay, 
  BookOpen, 
  User, 
  CheckCircle,
  FileText,
  BadgeAlert,
  Cpu,
  Zap,
  Clock,
  Waves,
  Lightbulb,
  ArrowLeftRight,
  Sparkles,
  Send,
  Brain,
  MessageSquare,
  Loader2,
  Copy,
  ArrowUpRight,
  Check,
  ZoomIn,
  HelpCircle
} from 'lucide-react';

interface ProjectPresentationProps {
  isArabic: boolean;
}

interface Student {
  id: number;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  avatarInitials: string;
  accentClass: string;
  bgGradClass: string;
  slides: number[]; // Slides this student leads
}

interface Slide {
  id: number;
  speakerId: number | 'all';
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  bulletsAr: string[];
  bulletsEn: string[];
  graphicType?: 'title' | 'intro' | 'agriculture' | 'problem' | 'objectives' | 'specs' | 'chart' | 'protection' | 'math' | 'closing';
}

const students: Student[] = [
    {
      id: 1,
      nameAr: "عبدالرحمن اياد عثمان",
      nameEn: "Abdulrahman Ayad Othman",
      roleAr: "مقدّم 1: معمارية النظام الموزعة ومواصفات المعالج وجرد الأجهزة الميدانية",
      roleEn: "Presenter 1: Distributed Architecture, Processor Specs & Field Hardware Inventory",
      avatarInitials: "ع ع",
      accentClass: "border-cyan-500 text-cyan-600 bg-cyan-50",
      bgGradClass: "from-cyan-500 to-blue-600",
      slides: [1, 2, 3]
    },
    {
      id: 2,
      nameAr: "عباس هادي مطرود",
      nameEn: "Abbas Hadi Matroud",
      roleAr: "مقدّم 2: المبدأ السعوي للرطوبة، استشعار ملوحة شط العرب ومسبار الأعماق النظري",
      roleEn: "Presenter 2: Capacitive Moisture Principle, Shatt Al-Arab TDS/EC & Thermal Soil Theory",
      avatarInitials: "ع م",
      accentClass: "border-purple-500 text-purple-600 bg-purple-50",
      bgGradClass: "from-purple-500 to-indigo-600",
      slides: [4, 5, 6]
    },
    {
      id: 3,
      nameAr: "علاء مهدي حمدان",
      nameEn: "Alaa Mahdi Hamdan",
      roleAr: "مقدّم 3: التوصيلات وتخطيط الـ GPIO وبث حزم ESP-NOW والبرمجة اللاسلكية الاستراتيجية",
      roleEn: "Presenter 3: Pin Mapping, GPIO Strapping Rules, Raw ESP-NOW Frames & System Interconnections",
      avatarInitials: "ع ح",
      accentClass: "border-emerald-500 text-emerald-600 bg-emerald-50",
      bgGradClass: "from-emerald-500 to-teal-600",
      slides: [7, 8, 9]
    },
    {
      id: 4,
      nameAr: "فهد طلال خليل",
      nameEn: "Fahad Talal Khalil",
      roleAr: "مقدّم 4: خوارزمية التحكم للري، حظر المطر، عزل الإشارات PC817 وكبح الفلايباك 1N5408",
      roleEn: "Presenter 4: Closed-Loop Irrigation Logic, Rain Blocks, PC817 Opto-Isolation & 1N5408 Flyback Protection",
      avatarInitials: "ف خ",
      accentClass: "border-amber-500 text-amber-600 bg-amber-50",
      bgGradClass: "from-amber-400 to-orange-600",
      slides: [10, 11, 12]
    },
    {
      id: 5,
      nameAr: "محمد علي جواد",
      nameEn: "Mohammed Ali Jawad",
      roleAr: "مقدّم 5: معادلات المعايرة للرطوبة والـ TDS ورياضيات السبات العميق وإدارة طاقة البطارية وقائمة الـ BOM",
      roleEn: "Presenter 5: VWC% & TDS Calibration Formulas, Low-Power Sleep Math & Bill of Materials (BOM)",
      avatarInitials: "م ج",
      accentClass: "border-pink-500 text-pink-600 bg-pink-50",
      bgGradClass: "from-pink-500 to-rose-600",
      slides: [13, 14, 15]
    }
  ];

const slides: Slide[] = [
    {
      id: 0,
      speakerId: 'all',
      titleAr: "نظام الري الذكي المدرك للملوحة لمزارع نخيل البصرة",
      titleEn: "Smart Salinity-Aware Irrigation Controller for Basra Date Farms",
      subtitleAr: "جامعة المعقل · كلية الهندسة · قسم هندسة التحكم والحاسبات\nمشروع تخرج لنيل درجة البكالوريوس (2024 - 2025)",
      subtitleEn: "Al-Maaqal University · College of Engineering · Dept. of Control and Computer Engineering\nGraduation Capstone Project (2024 - 2025)",
      bulletsAr: [
        "إشراف الأستاذ المتميز: د. أيمن م. إسماعيل",
        "مشروع تخرج تطبيقي مصمم بالكامل لمكافحة ملوحة شط العرب وتصحر البصرة.",
        "توظيف شبكي موزع باستخدام 3 ميكروكنترولرات مستقلة تعمل بنظام تواصل لاسلكي مباشر ESP-NOW.",
        "نظام ذكي متكامل لعزل الضجيج الحثي وتوفير استهلاك طاقة استثنائي للمشاتل الميدانية الصحراوية."
      ],
      bulletsEn: [
        "Supervised by: Dr. Ayman M. Ismaiel",
        "A field-applied capstone hardware system targeting date palms salt protection in Shatt Al-Arab zones.",
        "Wired via a distributed topology consisting of 3 independent ESP32 nodes connected via peer-to-peer ESP-NOW protocol.",
        "Engineered with galvanic logic isolation, flyback suppression, and Ultra-Low-Power sleep routines."
      ],
      graphicType: 'title'
    },
    // STUDENT 1 (عبدالرحمن اياد عثمان) - Topic 1: معمارية النظام والمكونات (System Architecture and Core Components)
    {
      id: 1,
      speakerId: 1,
      titleAr: "1. معمارية ومكونات النظام الموزع (المتحدث: عبدالرحمن اياد)",
      titleEn: "1. Distributed System Architecture & Components (Speaker: Abdulrahman Ayad)",
      bulletsAr: [
        "بناء موزع لاسلكي متعدد العقد (Multi-Node architecture) يفصل دوائر القراءات الحساسة عن المحركات الصاخبة ضوئياً.",
        "فصل كامل في الحقل الفيزيائي بين عقد رصد المستشعرات (الإشارات التماثلية الضعيفة) وعقد التبديل والمحركات (المضخة والصمام).",
        "تعتمد البنية اللاسلكية لمشروع التخرج على معالجات ESP32 المتطورة ثنائية النواة هندسة Xtensa LX6.",
        "الهدف: حوكمة الري الذكي وتأسيس حلقة معالجة مغلقة مدمجة بالسيليكون لمكافحة ملوحة شط العرب العالية."
      ],
      bulletsEn: [
        "Designing a distributed multi-node ring splitting sensitive sensor readings from noisy inductive actuators.",
        "Complete physical and electrical isolation of weak analog sensor inputs from high-current pump/solenoid spikes.",
        "Built upon the premium Tensilica Xtensa dual-core LX6 ESP32 processing platform with built-in P2P transceivers.",
        "Goal: Autonomous closed-loop control to bypass saline water and optimize date palm water usage."
      ],
      graphicType: 'intro'
    },
    {
      id: 2,
      speakerId: 1,
      titleAr: "مواصفات المعالج ومكافحة معضلة قيد معالج السيليكون",
      titleEn: "Compute Platform Specs & Shared ADC-Radio Constraint",
      bulletsAr: [
        "المعالج الأساسي: ESP32 بتردد 240 ميغاهيرتز، سعة 520 كيلوبايت SRAM عشوائية وفلاش 4 ميغابايت لتخزين خوارزميات الري المعقدة.",
        "قيد تعارض قنوات الاستشعار: يشترك بنك ADC2 داخلياً بشريط السيليكون مع الروافع اللاسلكية لـ WIFI والـ ESP-NOW.",
        "النتيجة الكارثية: تفعيل البث اللاسلكي لعقد التليمتري يعطل قراءة بنك ADC2 الموصول قسرياً معطياً قيمة 4095 ثابتة خطرة.",
        "الحل الهندسي للربط: إلزامية تعدين وتوجيه جميع المجسات التناظرية ببوابات بنك ADC1 فقط (مسارات GPIO 32 إلى GPIO 39)."
      ],
      bulletsEn: [
        "Core Hardware: Dual-core Tensilica Xtensa LX6 running up to 240 MHz, 520 KB SRAM, and 4 MB SPI flash.",
        "Silicon Conflict: ADC2 registers share internal hardware multiplexing with the 2.4 GHz RF radio transceivers.",
        "Fatal Bug: Triggering radio packet emissions immediately locks the ADC2 bank, generating static dry signals at 4095.",
        "Engineering Rule: All active analog inputs (soil, TDS, rain) must be routed exclusively to ADC1 pins (GPIOs 32–39)."
      ],
      graphicType: 'specs'
    },
    {
      id: 3,
      speakerId: 1,
      titleAr: "جرد وإحصاء الأجهزة الميدانية والمكونات العتادية الكاملة",
      titleEn: "Field Hardware Inventory & Executed Sourcing Checklist",
      bulletsAr: [
        "المعالجات: 3 وحدات ESP32 مستقلة تتواصل راديوياً لتقليص حجم وأكلاف كابلات تمديد الحقل إلى الصفر.",
        "المشغلات المائية: مضخة ماء غاطسة DC 12V صامتة، مع صمامات ري كهرومغناطيسية (Solenoids) للفتح الانتقائي الموزع.",
        "عناصر الحماية والمراقبة المباشرة: حساس ملوحة ومعايرة TDS/EC، وحساسات الرطوبة السعوية V1.2 المقاومة للصدأ.",
        "واجهات العرض والملحقات: شاشة LCD 20x4 مع وحدة التوسعة PCF8574، وحساس المطر والمستشعرات الجوية والأعماق."
      ],
      bulletsEn: [
        "Processing Core: 3x standalone ESP32 units communicating via radio frames to eliminate high copper wiring costs.",
        "Hydraulic Actuators: 12V DC silent submersible water pump with selective electromagnetic solenoid valves for zone switching.",
        "Telemetry Protection: Alternating-current TDS/EC analyzer coupled with capacitive soil moisture V1.2 anti-rust probes.",
        "Information Interfaces: Rich 20x4 LCD using PCF8574 logic expanders, standalone rain board, and sub-soil heaters."
      ],
      graphicType: 'specs'
    },
    // STUDENT 2 (عباس هادي مطرود) - Topic 2: الأساس النظري وفيزياء المستشعرات (Theoretical Foundations and Sensor Physics)
    {
      id: 4,
      speakerId: 2,
      titleAr: "2. النظري والربط والآليات الفيزيائية للمستشعرات (المتحدث: عباس هادي)",
      titleEn: "2. Theoretical Interconnection & Physical Sensing Principles (Speaker: Abbas Hadi)",
      bulletsAr: [
        "دراسة فيزيائية معملية تفوق الري التقليدي لتجنب الجفاف الأسموزي وتدمير جذور نخيل البصرة الفاخر (Phoenix dactylifera).",
        "التحليل النصف قطري للسماحية الكهربائية للتربة (Dielectric Permittivity) لقياس رطوبة البنية الحجمية للممرات المائية للتربة.",
        "نظرية الإثارة بالتيار المتردد (AC Excitation) للتغلب التام على ظاهرة استقطاب أقطاب الملوحة وحماية دقة التليمتري.",
        "صياغة ناقل السلك الواحد الرقمي لتمرير إشارات مجسات الـ 1-Wire لتقليص حجم كابلات تمديد الحقل بشكل غير مسبوق."
      ],
      bulletsEn: [
        "Advanced physical investigation of soil moisture and osmotic pressure to protect Basra date palms from root rot.",
        "Analyzing soil dielectric permittivity to measure Volumetric Water Content (VWC) within core soil structures.",
        "Developing Alternating Current excitation to completely eradicate salinity probe polarization and safeguard precision.",
        "Formulating digital single-wire protocols (1-Wire DQ Bus) to scale buried sensors with minimal copper cabling."
      ],
      graphicType: 'intro'
    },
    {
      id: 5,
      speakerId: 2,
      titleAr: "المبدأ السعوي وحساس رطوبة التربة المضاد للأكسدة V1.2",
      titleEn: "Capacitive Volumetric Soil Moisture Sensing & TI TLC555 Timer Logic",
      bulletsAr: [
        "فشل الحساس المقاوم: الحساسات النحاسية التقليدية تصدأ سريعاً من أثر تمرير التيار الكهربائي المستمر، مما يعطل قراءات التربة ويشوهها.",
        "الآلية السعوية الممتازة: قياس رطوبة التربة عبر معامل السماحية الكهربائية المباشر (dielectric permittivity) كعنصر مكثف تماثلي.",
        "مطلب التردد المرتفع: توظيف شريحة Texas Instruments TLC555 LinCMOS لإنتاج نبضات مستمرة تترجم لجهود خطية دقيقة.",
        "تكامل حماية اللوحة: كبس مسارات النحاس تماماً وعزلها خلف قناع اللحام الإيبوكسي (Solder Mask) لمنع أي تلامس كيميائي أو تآكل جلفاني."
      ],
      bulletsEn: [
        "Resistive Failure: Exposed steel-pin soil probes corrode within weeks of moisture exposure due to severe electrolysis.",
        "Capacitive Paradigm: Measures soil volumetric hydration via capacitive shift using water permittivity as dielectric.",
        "TI TLC555 LinCMOS: Deploys a high-frequency astable oscillator to output steady frequency streams scaled to water content.",
        "Immutable Security: Absolute separation of copper traces using solder mask layer, ensuring a 100% rustproof design."
      ],
      graphicType: 'specs'
    },
    {
      id: 6,
      speakerId: 2,
      titleAr: "الإثارة بالتيار المتردد لمقاوم الملوحة TDS بشط العرب والتصحيح الحراري",
      titleEn: "AC Excitation & Salinity Monitoring Theory of Shatt Al-Arab",
      bulletsAr: [
        "خطر التملح البصري: قفزات الملوحة الحادة بشط العرب ترفع الأسموزية السلبية في التربة المروية وجفاف عالي لنبات النخيل.",
        "كشف النطاق EC/TDS: قياس التوصيل الكهربائي الكلي لنسبة الأملاح الذائبة بالمنبع المائي لتفادي استخدام مياه البحار الفتاكة.",
        "إثارة تيار متردد AC Excitation: توليد موجات جيبية تماثلية مترددة عالية التردد لتجاوز ظواهر استقطاب وترسبات التيتانيوم.",
        "مسبار حرارة الأعماق DS18B20: معزول IP68 في إطار فولاذي 316 مضاد للأكسدة، لمراقبة وتعديل نسب معامل الملوحة كيميائياً."
      ],
      bulletsEn: [
        "Saline Danger: Tremendous Shatt Al-Arab TDS spikes create extreme negative osmotic pressures that rot date palm roots.",
        "EC/TDS Tracking: Continuous evaluation of electrical conductivity of source water to automatically isolate seawater intrusion.",
        "AC Excitation: Leverages high-frequency alternating current waves to avoid metal polarization and chemical plating.",
        "DS18B20 Sub-soil Temp: Encased IP68 stainless steel probe monitoring deep soil temperatures for salinity offset math."
      ],
      graphicType: 'agriculture'
    },
    // STUDENT 3 (علاء مهدي حمدان) - Topic 3: التصميم والتوصيلات والبرمجة (Electrical Design, Wiring, and Programming)
    {
      id: 7,
      speakerId: 3,
      titleAr: "3. التصميم والتوصيلات والبرمجة اللاسلكية الاستراتيجية (المتحدث: علاء مهدي)",
      titleEn: "3. Design, Connections & Strategic Wireless Programming (Speaker: Alaa Mahdi)",
      bulletsAr: [
        "تكامل خطوط الربط المادية لجميع العقد وحوكمة توزيع وباب دبابيس ومنافذ الـ GPIO لمتحكمات العقد الموزعة.",
        "بناء برمجيات البث اللاسلكي منخفض الكمون ونظام ESP-NOW للشبكة غير المركزية العازلة تماماً لنويز المحركات والحقول المغناطيسية.",
        "تكامل شاشات التحكم الحقلية Master Local HMI وتواصل شاشة الـ LCD عبر خطوط I2C ثنائية الأطراف SDA/SCL لتوفير المخارج.",
        "تحييد ارتدادات الفولط العنيف وعزل الإشارات المنطقية للمعالجات عن ملفات الريلايات كهربائياً وحفظ السيليكون."
      ],
      bulletsEn: [
        "Integrating physical wiring diagrams and carefully mapping GPIO registers across the distributed nodes.",
        "Coding sub-millisecond wireless data frames via peer-to-peer decentralized ESP-NOW protocol to isolate motor noise.",
        "Driving localized terminal with efficient I2C-expanded Master LCD interfaces saving processing pins via PCF8574 backpack.",
        "Eliminating voltage spikes and isolating high-noisy loops from low-voltage processors."
      ],
      graphicType: 'intro'
    },
    {
      id: 8,
      speakerId: 3,
      titleAr: "تخطيط الـ GPIO وباقة التوصيلات العتادية لتفادي قيود البدء",
      titleEn: "GPIO Pin Map Strategy & Rigid Wiring Layouts for Safe Startup",
      bulletsAr: [
        "العقدة الأولى (Master LCD): حجز SDA (GPIO 21) و SCL (GPIO 22) للناقل I2C، والمنفذ GPIO 4 لقراءة تليمتري مجس DHT22 الجوي الجاف.",
        "العقدة الثانية (مجسات الحقل): استخدام قنوات ADC1 الفردية (GPIO 34, 35, 32) لقراءة الرطوبة وحساس المطر وتوصيل TDS دون مشاكل الراديو.",
        "العقدة الثالثة (المشغلات الميدانية): توجيه الأطراف GPIO 13, 14, 27 لمنع قمع وانهيار ملفات ريلايات الري وصمامات المياه والمضخة.",
        "حصانة دبابيس البدء المانعة للاحتجاز (Strapping Pins): تجنب تماماً ربط مجسات الحيز النشط بالدبابيس (GPIO 0, 2, 5, 12, 15) لضمان الاستقرار الكلي عند الإقلاع الصعب."
      ],
      bulletsEn: [
        "Node 1 (Coordinator): Utilizes I2C SDA (GPIO 21) & SCL (GPIO 22), with pin GPIO 4 mapped to DHT22 single-wire bus.",
        "Node 2 (Field Hub): Dedicated ADC1 ports (GPIO 34, 35, 32) read soil VWC, TDS, and rain levels alongside ESP-NOW radio.",
        "Node 3 (Actuator Unit): Safe GPIO ports (GPIO 13, 14, 27) drive relay panels with perfect high/low state thresholds.",
        "Strapping Pin Immunity: Avoided mapping active field sensors to strapping pins (GPIO 0, 2, 5, 12, 15) to guarantee cold-starts."
      ],
      graphicType: 'problem'
    },
    {
      id: 9,
      speakerId: 3,
      titleAr: "بروتوكول الاتصال הلاسلكي المباشر السريع ومكدس ESP-NOW",
      titleEn: "Sub-millisecond Peer-to-Peer Communication via Raw ESP-NOW Packets",
      bulletsAr: [
        "لاسلكي مباشر غير مركزي: إلغاء أسلاك الاتصال النحاسية الطويلة كلياً وبث البيانات مباشرة بمدى يغطي المحيط الميداني دون تكاليف تمديد.",
        "تجاوز بروتوكول TCP/IP: تفادي تأخيرات الاقتران بالراوتر عبر بث حزم MAC-to-MAC مباشرة بزمن كمون يقل عن 1 مللي ثانية.",
        "تكامل مخصص للحزمة: إرسال هيكل بيانات منسق (Struct Frame) يشمل الرطوبة، الملوحة، المطر، وتأكيد وصول البيانات (Callback ACK).",
        "المرونة المطلقة للشبكة: عزل أي عطل، حيث يمكن لأي عقدة استشعار أو مشغل إقلاع محلي والتحكم دون انهيار النظام الإجمالي."
      ],
      bulletsEn: [
        "Decentralized P2P Network: Drastically cuts wire expenses, communicating over miles using peer-to-peer radio frames.",
        "Circumventing Standard IP Stack: Skips long router handshakes, using rapid MAC-to-MAC frames with <1 ms latency.",
        "Telemetry Struct Packaging: Packs complex sensor states, CRC checksums, and delivery callback flags dynamically.",
        "Fail-Safe Infrastructure: Eliminates single-point master failures; nodes manage localized emergency tasks autonomously."
      ],
      graphicType: 'protection'
    },
    // STUDENT 4 (فهد طلال خليل) - Topic 4: الحماية وتكامل الطاقة (Electrical Protection, Power Integration, and Calibration)
    {
      id: 10,
      speakerId: 4,
      titleAr: "4. الحماية الكهربائية ومعايرة وتكامل الطاقة لشبكة العقد (المتحدث: فهد طلال)",
      titleEn: "4. Electrical Protection, Power Integration & Calibration (Speaker: Fahad Talal)",
      bulletsAr: [
        "تأسيس تغذية مستقرة ومصفاة من الضجيج كهرومغناطيسياً لتشغيل السيليكون وعقد الاتصال الموزعة بحماية قوية.",
        "بناء منظمات تيار لخفض الفولطية مخصصة للتحمل الميداني لمنع حدوث انخفاضات الفولطية المفاجئة أثناء تشغيل المضخة.",
        "الحماية الكهربائية المباشرة لمحركات وصمامات الحقل عبر معزل ريلايات البصري ومبدأ كبح التيارات العكسية الفلايباك.",
        "موازنة وتصميم حظائر طاقة تدعم أنماط التشغيل الهجين اللاسلكية والبطاريات وحفظ معدلات الالتزام."
      ],
      bulletsEn: [
        "Establishing a highly stable, electromagnetically filtered power network to drive sensitive silicon cores.",
        "Designing rugged voltage regulators to eliminate voltage brownout events during inductive pump triggers.",
        "Implementing direct protection arrays for field solenoid coils using optical path isolators and reverse voltage clampers.",
        "Balancing of hybrid power lines to shield telemetry data lines from electromagnetic field interference."
      ],
      graphicType: 'intro'
    },
    {
      id: 11,
      speakerId: 4,
      titleAr: "هيكل شبكة طاقة المنظومة الميدانية ومنظمات LM2596",
      titleEn: "Industrial Power Distribution & Dual LM2596 Buck Regulators",
      bulletsAr: [
        "العمود الفقري للطاقة: محول صناعي (SMPS) بقدرة 12 فولت و10 أمبير (120 واط) لدفع التيارات العالية لصمامات وصنابير الري الكهرومغناطيسية.",
        "منظم الجهد الأول (LM2596 #1): خافض جهد فعال يوفر تياراً مرناً بجهد 5.0 فولت لتغذية بوابات الريلايات وشاشة LCD 20x4.",
        "منظم الجهد الثاني (LM2596 #2): يوفر مخرجاً ناعماً ومستقراً بقوة 3.3 فولت لتغطية استهلاك البث اللاسلكي المكثف لمعالجات ESP32.",
        "حقل الطاقة الاحتياطي: استخدام بطاريتي ليثيوم 18650 متصلتين على التوالي (7.4V 2S) ومدعومتين ببطاقة BMS للحماية التلقائية."
      ],
      bulletsEn: [
        "Primary Input: Active industrial SMPS transformer converting 220V AC into stable 12V DC at 10A (120W) for solenoid coils.",
        "LM2596 Buck #1: Highly efficient DC-DC step down delivering standard 5.0V to isolated relay bars and the HMI LCD backlight.",
        "LM2596 Buck #2: Generates clean 3.3V DC line with low ripple noise to support heavy active current draws of ESP32 transceivers.",
        "Secondary Battery Bank: 2S lithium 18650 batteries providing 7.4V DC, monitored by an active Battery Management System (BMS)."
      ],
      graphicType: 'specs'
    },
    {
      id: 12,
      speakerId: 4,
      titleAr: "حماية العابرة الكهربائية وعزل الأوبتوكابلر وفيلتر النجم الأرضي",
      titleEn: "Logic Isolation, Solenoid Surge Protection & Ground Design",
      bulletsAr: [
        "عزل الأوبتوكابلر البصري (PC817): يعزل المعالج منطقياً وكهربائياً عن جهود ملفات الريلايات المسببة للنويز بمسار فوتوني آمن.",
        "دايودات الفلايباك (1N5408): دايود بقوة 3 أمبير / 1000 فولت يتصل بشكل متوازٍ عكسي على المضخة والصمامات لامتناع وتشتيت شرارات الـ Back-EMF.",
        "مكثف التنعيم القياسي (3300µF / 63V): خزان تفريغ فوري لابتلاع فجوات انخفاض تيار البدء وحماية عزل طاقة العقد من إثارة إعادة التشغيل (Reset).",
        "خط النجم الأرضي (Star-Ground): ربط مسارات الأرضيات بنقطة واحدة لتبديد ضجيج المحركات التماثلية وتصفير أي تشويه للقراءات."
      ],
      bulletsEn: [
        "PC817 Opto-Isolation: Integrates infrared phototransistors to isolate sensitive ESP32 logic from heavy relay coils.",
        "1N5408 Flyback Protection: Robust 3A rated diodes capture and dissipate dangerous reverse inductive spikes (V = L * di/dt).",
        "3300µF Bulk Reservoir: High-capacitance decoupling buffer preventing voltage drops and sudden MCU resets when motors kick in.",
        "Star-Ground Architecture: Isolates sensor return lines from noisy motor grounds, avoiding circular offset potentials."
      ],
      graphicType: 'protection'
    },
    // STUDENT 5 (محمد علي جواد) - Topic 5: النتائج والاستنتاجات ومنطق اتخاذ القرارات والجدوى الاقتصادية (Results, Conclusions, Decision-Making Logic, and Economic Feasibility)
    {
      id: 13,
      speakerId: 5,
      titleAr: "5. منطق التحكم والنتائج الميدانية والجدوى الاقتصادية (المتحدث: محمد علي)",
      titleEn: "5. Decision Logic, Field Testing Results & Project Feasibility (Speaker: Mohammed Ali)",
      bulletsAr: [
        "هندسة برمجيات التحكم مغلقة الحلقة (Closed-Loop) لمعالجة قراءات الرطوبة وحظر الملوحة والصمامات تلقائياً.",
        "صياغة المعادلات تماثلية السيليكون لمعايرة الرطوبة وارتفاع ملوحة شط العرب TDS مع تصحيح درجة الحرارة.",
        "حسابات السبات العميق وإدارة الاستهلاك لتشغيل المنظومة لـ 120 يوماً متواصلة بالاستعانة بخلايا الطاقة الميدانية الخفيفة.",
        "تحليل كلفة المواد المجمعة (BOM) ومكاسب الجدوى السوقية لمكافحة ملوحة المياه والإنتاج التجاري المرن."
      ],
      bulletsEn: [
        "Coding on-board closed-loop controllers utilizing dynamic sensory thresholds to override active solenoid valves.",
        "Formulating calibration equations to align analog soil permittivity and Shatt Al-Arab polynomial salinity profiles.",
        "Engineering power budget formulas for deep-sleep cycles, ensuring up to 120 days of autonomous field operations.",
        "Itemizing the Bill of Materials (BOM) to demonstrate the economic and market advantage of the distributed setup."
      ],
      graphicType: 'intro'
    },
    {
      id: 14,
      speakerId: 5,
      titleAr: "رياضيات معادلات معايرة حساس التربة رطوبة والـ TDS",
      titleEn: "Calibration Mathematics: VWC % & Salinity Polynomials",
      bulletsAr: [
        "معادلة الرطوبة الحجمية VWC (%): [(V_dry - V_sampled) / (V_dry - V_wet)] * 100 ثوابت المعايرة: الجفاف 3.0V والتشبع 1.1V.",
        "معادلة ملوحة شط العرب TDS متعددة الحدود: TDS (ppm) = 133.42 * V^3 - 255.86 * V^2 + 857.39 * V (دقة مواءمة ممتازة).",
        "معادلة التصحيح الحراري للملوحة (EC25): استقرار ملوحة المنبع وتثبيتها عند معيار 25 مئوية: EC25 = EC_T / [1 + 0.02 * (T - 25)].",
        "منطق حظر الري بالإرسال المنعكس: إطفاء عاجل ومؤتمت للمضخات والصمامات إذا تخطت مستويات TDS حاجز 2500 ppm الحرج."
      ],
      bulletsEn: [
        "Soil Permittivity Conversion: VWC (%) = [(V_dry - V_sampled) / (V_dry - V_wet)] * 100 (using air dry 3.0V and wet 1.1V baselines).",
        "TDS Salinity Third-Order Curve: TDS (ppm) = 133.42 * V³ - 255.86 * V² + 857.39 * V (where V is the temperature-corrected EC voltage).",
        "Standard Temp-Compensation (EC25): Eliminating thermal noise to isolate ion movement error: EC25 = EC_T / [1 + 0.02 * (T - 25)].",
        "Autonomous Salt-Lock: Pre-emptively clamps solenoids closed if water salinity matches seawater spikes exceeding 2500 ppm."
      ],
      graphicType: 'math'
    },
    {
      id: 15,
      speakerId: 5,
      titleAr: "حساب السبات العميق واستهلاك الطاقة وجدول الكلفة BOM",
      titleEn: "Low-Power Budget Sizing & Cumulative Bill of Materials (BOM)",
      bulletsAr: [
        "السبات العميق (Deep Sleep): تيار السبات = 15µA لفترة 15 دقيقة (900 ثانية)، متناوباً مع 2 ثانية استيقاظ نشط باستهلاك 180mA.",
        "تيار التشغيل المرجح (Weighted Draw): تيار متوسط = 0.414mA، بطارية ليثيوم 1200mAh توفر 120 يوماً من التشغيل الحقل الكامل.",
        "الكلفة المالية التفصيلية (BOM): العقد المعالجة تبلغ 33,000 د.ع، باقة الحساسات 15,250 د.ع، والمشغلات مادية 25,500 د.ع.",
        "جدوى المشروع السوقية: الكلفة الكلية للمواد والوحدات والحماية تبلغ 198,500 دينار عراقي فقط! كلفة متدنية تتيح حماية واسعة للنخيل."
      ],
      bulletsEn: [
        "Deep-Sleep Economy: Draws a microscopic 15µA for 15 minutes (900s), alternating with a 2-second active burst of 180mA.",
        "Average Autonomous Workload: Weighted current = 0.414mA. Two 1200mAh series cells yield a massive 120 days of lifespan.",
        "Itemized Sourcing Sheet (BOM): Main microcontrollers: 33,000 IQD; sensor array: 15,250 IQD; actuating valves/pump: 25,500 IQD.",
        "Economic Viability Summary: Cumulative assembly equals precisely 198,500 IQD, offering saving options for Basra farms."
      ],
      graphicType: 'chart'
    },
    // Slide 16 (Closing)
    {
      id: 16,
      speakerId: 'all',
      titleAr: "خاتمة عرض التخرج وشكر اللجان العلمية والمشرف القدير",
      titleEn: "Conclusion & Boundless Gratitude",
      subtitleAr: "برعاية كلية الهندسة جامعة المعقل / قسم هندسة السيطرة والحاسبات والأتمتة",
      subtitleEn: "Sponsored by College of Engineering, Al-Maaqal University / Dept of Control & Computers Engineering",
      bulletsAr: [
        "إثبات الكفاءة الفنية: نجحنا في بناء نموذج عتادي حقيقي فعال ومعزول كهرومغناطيسياً بالكامل لحماية نخيل البصرة العظيم.",
        "الموثوقية والجدوى البارزة: كلفة تجميع محلية متدنية (198.5 ألف د.ع) تتيح إنتاجًا تجاريًا مرنًا لخدمة مزارعينا الأفاضل.",
        "الأثر التشاركي والموزع: شراكة هندسية قادها الطلاب الخمسة (عبدالرحمن، عباس، علاء، فهد، ومحمد) بنظام أدوار متناغم ودقيق.",
        "عظيم الشكر والامتنان: نجدد عظيم التقدير لمشرفنا د. أيمن م. إسماعيل وأعضاء الهيئة الكريمة ومناقشي اللجنة الأكارم."
      ],
      bulletsEn: [
        "Proven Technical Feasibility: Built a reliable, electromagnetically isolated multi-node system on the ground.",
        "High Economic Viability: Itemized BOM cost of 198,500 IQD makes it fully prepared for local date farm adoptions.",
        "Synergistic Collaboration: Unified responsibilities across all 5 engineering presenters (Abdulrahman, Abbas, Alaa, Fahad, Mohammed).",
        "Sincere Gratitude: Infinite appreciation goes to supervisor Dr. Ayman Ismaiel, department faculty, and the evaluation committee."
      ],
      graphicType: 'closing'
    }
  ];

const EXPECTED_VIVA_QUESTIONS: Record<number, { qAr: string, aAr: string, qEn: string, aEn: string }[]> = {
    0: [{
      qAr: "من هو المشرف الرئيسي على هذا المشروع؟",
      aAr: "المشرف هو الأستاذ المتميز د. أيمن م. إسماعيل من قسم هندسة التحكم والحاسبات بجامعة المعقل.",
      qEn: "Who is the primary academic advisor or supervisor?",
      aEn: "The supervisor is Dr. Ayman M. Ismaiel from the Department of Control and Computers Engineering at Al-Maaqal University."
    }],
    1: [{
      qAr: "ما هو الهدف الجوهري الذي يعالجه هذا المشروع للزراعة في البصرة؟",
      aAr: "يعالج المشروع ملوحة شط العرب العالية (ارتفاع معدلات الـ TDS) والتبخر الشديد للتربة في البصرة عبر ابتكار نظام ري ذكي مغلق الحلقة يتجنب سقي النخيل بالمياه المالحة.",
      qEn: "What is the core problem addressed in Basra agriculture?",
      aEn: "The project addresses Shatt Al-Arab high salinity spikes (TDS rates) and extreme soil evaporation in Basra through an innovative closed-loop smart irrigation system that avoids watering palms with saline water."
    }],
    2: [{
      qAr: "لماذا تم اختيار بنية موزعة لاسلكية للمشروع؟",
      aAr: "لعزل ضوضاء تفعيل المضخات الحثية الكبيرة كهربائياً ومغناطيسياً عن دوائر قراءة المستشعرات التماثلية الضعيفة وحماية السيليكون من الانهيار والتشوهات.",
      qEn: "Why was a distributed wireless architecture chosen?",
      aEn: "To physically and electromagnetically isolate the high-current inductive pump activation noise from weak analog soil readings, preventing silicon latch-up and telemetry corruption."
    }],
    3: [{
      qAr: "ما هي الأجهزة الإلكترونية والمكونات الأساسية المستخدمة في هذا النظام؟",
      aAr: "يتكون النظام من 3 متحكمات ESP32، ومصدر طاقة صناعي 12 فولت 10 أمبير، ومنظمات جهد LM2596، وريلايات معزولة بصرياً وصمامات ري كهرومغناطيسية ومضخة ماء، مع حساسات الرطوبة السعوية والملوحة وحرارة التربة والجو والمطر وشاشة LCD.",
      qEn: "What are the core electronic devices and components used in the system?",
      aEn: "The system comprises 3x ESP32 MCUs, active industrial 12V 10A SMPS, LM2596 step-down regulators, isolated opto-relays, solenoid valves, a water pump, capacitive soil moisture, TDS, DS18B20 temperature, DHT22 climate detectors, and a 20x4 LCD screen."
    }],
    4: [{
      qAr: "لماذا يعتبر نخيل التمر في البصرة حساساً للتملح؟ وما دور عباس هادي في رصده؟",
      aAr: "يقود عباس هادي المحور النظري لآليات الاستشعار. تسبب الملوحة ضغطاً أسموزياً يمنع الجذور من امتصاص المياه، مما يؤدي لموت الشعيرات الجذورية تدريجياً لعدم قدرتها على التبادل الأسموزي.",
      qEn: "Why is Basra date palm sensitive to salinity, and what is Abbas Hadi's conceptual role?",
      aEn: "Abbas Hadi leads the physical sensing concept. High salinity generates osmotic pressure that blocks water intake, causing osmotic root rot. This system tracks moisture and salinity dynamically to avoid saline water contact."
    }],
    5: [{
      qAr: "كيف يتغلب مستشعر الرطوبة السعوي V1.2 على مشكلة الأكسدة والصدأ؟",
      aAr: "المستشعر السعوي مغطى بطبقة حماية عازلة (Epoxy Solder Mask) فلا يمرر تياراً كهربائياً مستمراً بالتربة ليكون خاضعاً للأكسدة، بل يستشعر التغير في الفراغ عبر المذبذبات الترددية TLC555 التي تقيس سماحية التربة السعوية.",
      qEn: "How does the capacitive soil moisture sensor prevent rust and oxidation?",
      aEn: "Capacitive probes are sealed within a protective solder mask layer, passing no direct current through wet soil. They register volumetric content via a TLC555 high-frequency oscillator monitoring dielectric permittivity."
    }],
    6: [{
      qAr: "لماذا نستخدم تياراً متردداً (AC Excitation) في مستشعر ملوحة شط العرب TDS؟",
      aAr: "يمنع استخدام التيار المتردد عالي التردد ظاهرة استقطاب الأقطاب (Electrode Polarization) والتفاعلات الكيميائية والطلاء الجلفاني فوق مجسات التيتانيوم، مما يضمن قراءة دقيقة مستمرة ومستقرة للملوحة.",
      qEn: "Why do we use Alternating Current (AC Excitation) for Shatt Al-Arab TDS sensing?",
      aEn: "High-frequency AC excitation completely avoids electrode polarization, chemical plating, and galvanic fouling at the titanium pins, ensuring clean, continuous, and reliable salinity tracking."
    }],
    7: [{
      qAr: "كيف تم تخطيط وحجز دبابيس الـ GPIO وتجنب تصادم STRAAPING PINS؟",
      aAr: "قاد علاء مهدي توصيلات النظام الفيزيائية والبرمجة. تم عزل أطراف التمهيد الاستراتيجية (GPIO 0, 2, 5, 12, 15) تماماً عن مجسات الحقل لضمان إقلاع آمن للمتحكم دون الدخول العشوائي لنمط البرمجة السلكي.",
      qEn: "How did you plan GPIO pin mapping and avoid boot-up strapping conflicts?",
      aEn: "Alaa Mahdi spearheaded physical connections. We kept critical strapping pins (GPIO 0, 2, 5, 12, 15) isolated from active sensors to guarantee a robust autonomous cold-start sequence without entering flashing modes."
    }],
    8: [{
      qAr: "كيف يساهم بروتوكول ESP-NOW في تأمين المنظومة وحلها للمسافات البعيدة؟",
      aAr: "يسمح بروتوكول ESP-NOW باتصال لاسلكي تشاركي مباشر وسريع جداً (Peer-to-Peer) دون الحاجة لجهاز موجه (Router) مركزي، مما يقلل الكابلات النحاسية إلى الصفر تقريباً ويمنع سقوط وتوقف الشبكة بالكامل.",
      qEn: "How does the ESP-NOW protocol secure transmission over long distances?",
      aEn: "It permits direct, ultra-fast peer-to-peer radio messaging without a central router. This eliminates layout cabling and ensures that if one node crashes, other nodes can maintain fail-safe states."
    }],
    9: [{
      qAr: "كيف يتم توجيه والتحكم بشاشة الـ Master LCD 20x4؟",
      aAr: "تم استخدام رقاقة التوسيع PCF8574 المدمجة بظهر شاشة LCD لتعمل ببروتوكول I2C ثنائي السلك، مما يتيح التحكم بالـ 20 عمود في 4 سطور للبيانات التشغيلية باستخدام دبوسين فقط (SDA و SCL).",
      qEn: "How are processor pins saved while driving the large Master LCD 20x4?",
      aEn: "We added a PCF8574 I2C IO expander backpack behind the LCD layout. This converts serial characters into parallel streams, allowing entire 20x4 content updates over just 2 serial wires (SDA & SCL)."
    }],
    10: [{
      qAr: "ما هو منطق اتخاذ القرار ومستويات العتب المطلوبة لفتح وإغلاق الصمامات والمضخات؟",
      aAr: "يقود فهد طلال لغة التحكم والنتائج الميدانية. يفتح الصمام والمضخة المخصصان لزون معين فقط إذا سقطت الرطوبة عن عتبة الري المحددة للنوع وعتبة TDS آمنة، مع فترات زمنية مجدولة لتقنين التبخر.",
      qEn: "What is the irrigation decision-making logic and threshold rules?",
      aEn: "Fahad Talal leads decision control. Active zone valves and the main pump trigger only if VWC moisture drops below customized limits and salinity TDS is verified within safe ranges, specifically during scheduled cold times."
    }],
    11: [{
      qAr: "ما هو مبدأ عمل حساس المطر؟ وكيف يحقق حماية الجذور من الغرق؟",
      aAr: "يعمل حساس المطر كمجزئ جهد تماثلي مقاوم. عند تساقط الأمطار، تعمل قطرات الماء كجسر يقلل المقاومة تدريجياً، ليرسل إشارة تماثلية تنزلق نحو 0 فولت في قناة ADC1_CH0 مما يفعل قيد الإغلاق العاجل لحماية النخيل.",
      qEn: "How does the rain sensor block water logging during active precipitation?",
      aEn: "The open-air gold plate acts as a variable resistive divider. Rainfall droplets bridge traces to decrease resistance, causing output voltages to slide toward 0V. ADC1_CH0 catches this plunge and overrides other triggers."
    }],
    12: [{
      qAr: "ما الذي أثبتته دراسة وفحوص الاستباقية للنظام الموزع ميدانياً؟",
      aAr: "أثبتت النتائج نجاح عزل النويز الكهربائي العنيف لملفات الصمامات الكهرومغناطيسية والمضخة تماماً عن متحكمات القراءة بفضل العازل الضوئي PC817 ودايودات 1N5408، والحصول على دقة وثبات قراءات تماثلية تامة.",
      qEn: "What did field testing of this distributed setup prove?",
      aEn: "It proved that isolating high-current spikes generated by pump and solenoid activations using PC817 optocouplers, 1N5408 flyback diodes, and a star ground yields perfect, noise-free analog telemetry."
    }],
    13: [{
      qAr: "اشرح رياضيات معادلة معايرة ملوحة شط العرب TDS الثالثة متعددة الحدود؟",
      aAr: "تتبع المعادلة الرياضية للتماثل المبرمجة بالسيليكون بواسطة محمد علي جواد: TDS (ppm) = 133.42 * V^3 - 255.86 * V^2 + 857.39 * V مع تعويض تغيرات درجة الحرارة برمجياً من حساس DS18B20 ومعيار 25 مئوية.",
      qEn: "Explain the third-order polynomial mathematics for Shatt Al-Arab TDS mapping.",
      aEn: "The equation resolves TDS (ppm) = 133.42 * V³ - 255.86 * V² + 857.39 * V programmed in the ESP32 chip by Mohammed Ali, with automatic standard temperature correction calibrated around 25°C."
    }],
    14: [{
      qAr: "كيف يتم توقيت وحساب تيار طاقة السبات العميق للحصول على 120 يوماً من التشغيل؟",
      aAr: "يدخل المعالج بالسبات ليسحب 15 ميكرو أمبير بالتحيز الفعال لمدة 15 دقيقة، ويخرج لمدة ثانيتين فيسحب 180 مللي أمبير. يعطيك هذا تيار متوسط مشغل 0.414 مللي أمبير مما يجعل خط الطاقة في بطاريتي 1200 مللي أمبير تدوم لـ 120 يوماً.",
      qEn: "How was deep-sleep timing and ULP math integrated for battery lifetime?",
      aEn: "By alternating 2 seconds active (180mA draw) with 15 minutes of deep sleep (15µA draw). This results in a weighted average consumption of only 0.414mA, letting a 1200mAh 18650 support up to 120 days of autonomy."
    }],
    15: [{
      qAr: "كم تبلغ كلفة بناء هذا النموذج الموزع العتادي وهل يحقق جدوى سوقية مرنة؟",
      aAr: "تبلغ الكلفة الكلية التفصيلية للمواد والعلب والمجسات واللوحات المزدوجة 198,500 دينار عراقي فقط! وهي كلفة زهيدة جداً لتثبيت منظومة حقلية فريدة من نوعها تلائم مزارعينا الأكارم لإنقاذ النخيل.",
      qEn: "What is the detailed BOM cost, and is it economically feasible?",
      aEn: "The total compiled Bill of Materials (BOM) is exactly 198,500 IQD (roughly $150). This serves as an exceptionally affordable, high-end alternative to expensive, imported closed-loop agricultural installations."
    }],
    16: [{
      qAr: "ما هو المحصل الرئيسي لعرض التخرج وما هي الكلمات الختامية لجامعة المعقل؟",
      aAr: "تشرف فريق التحكم والحاسبات: عبدالرحمن، عباس، علاء، فهد، ومحمد بتقديم هذا المنظم الميداني المدرك للملوحة لخدمة البصرة وحماية نخيلها العظيم.",
      qEn: "What is the main conclusion of the graduation project?",
      aEn: "The team (Abdulrahman, Abbas, Alaa, Fahad, Mohammed) concluded the defense proving that local control engineers can build viable, salt-tolerant automatic ecosystems under advisor Dr. Ayman Ismaiel."
    }]
};


const getSuggestedQuestions = (studentId: number | 'all') => {
  if (studentId === 1) {
    return [
      "ما هي معمارية النظام الموزعة وكيف يتصل الـ Master مع الـ Nodes اللاسلكية؟",
      "لماذا اخترنا تردد 2.4GHz وبث ESP-NOW عوضاً عن Wi-Fi القياسي؟",
      "ما هي المواصفات الفنية المجهرية لمعالج ESP32 المعتمد بالمشروع؟"
    ];
  }
  if (studentId === 2) {
    return [
      "كيف يعمل مستشعر الرطوبة السعوي v1.2 وما الفرق الفيزيائي بينه وبين المقاوم؟",
      "كيف تؤثر زيادة ملوحة شط العرب في قراءات الـ TDS والـ EC؟",
      "كيف يعمل مسبار الحرارة DS18B20 المقاوم للماء رقمياً؟"
    ];
  }
  if (studentId === 3) {
    return [
      "وضح مخطط التوزيع المادي ومقاييس Pin-Mapping ونظام GPIO Strapping.",
      "كيف نحمي متحكم ESP32 عند البرمجة السلكية في وجود تغذية خارجية؟",
      "ما هي بنية حزم الـ Raw Broadcast في بروتوكول ESP-NOW اللامتزامن؟"
    ];
  }
  if (studentId === 4) {
    return [
      "كيف يعمل عازل Optocoupler PC817 على صد نويز ملف الريلية؟",
      "لماذا تم توازي دايود Flyback 1N5408 عكسياً على الصمام والمضخة؟",
      "تحدث عن خوارزمية التحكم المغلقة واستغلال قفل مستشعر هطول المطر."
    ];
  }
  if (studentId === 5) {
    return [
      "كيف قمت بمعايرة التربة وتحديد ثوابت الجفاف 3.0V والتشبع 1.1V؟",
      "اشرح منطق السبات العميق Deep Sleep لتقليص الاستهلاك إلى 15µA.",
      "اعرض تحليل الكلفة لقائمة المواد BOM والموافقة الاقتصادية للمشروع."
    ];
  }
  return [
    "ما هي الأهداف الاستراتيجية الخمسة لنظام مزارع نخيل البصرة الذكي؟",
    "وضح كيف تتعاون العقد اللاسلكية مع المحطة الرئيسية كفريق تخرج متكامل.",
    "ما هي التوصية الهندسية الأساسية لتشغيل ومعايرة النظام حقلياً؟"
  ];
};


export default function ProjectPresentation({ isArabic }: ProjectPresentationProps) {
  const [activeStudent, setActiveStudent] = useState<number | 'all'>('all');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [slideLang, setSlideLang] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');

  // New PPT document mode state
  const [presentationMode, setPresentationMode] = useState<'projector' | 'document'>('projector');
  const [zoomedSlideIdx, setZoomedSlideIdx] = useState<number | null>(null);
  const [docFilter, setDocFilter] = useState<number | 'all'>('all');
  const [docLang, setDocLang] = useState<'ar' | 'en'>(isArabic ? 'ar' : 'en');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [openHotspots, setOpenHotspots] = useState<Record<number, boolean>>({});

  const handleCopyAllSlidesText = () => {
    const lang = docLang;
    const str = slides.map((slide, idx) => {
      const title = lang === 'ar' ? slide.titleAr : slide.titleEn;
      const subtitle = slide.subtitleAr || slide.subtitleEn 
        ? ` (${lang === 'ar' ? slide.subtitleAr : slide.subtitleEn})` 
        : '';
      const bullets = (lang === 'ar' ? slide.bulletsAr : slide.bulletsEn)
        .map(b => `• ${b}`)
        .join('\n');
      return `Slide ${idx + 1}: ${title}${subtitle}\n${bullets}\n-------------------\n`;
    }).join('\n');

    navigator.clipboard.writeText(str);
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
    }, 2000);
  };

  const toggleHotspot = (idx: number) => {
    setOpenHotspots(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // AI Q&A Search State
  const [aiSelectedStudent, setAiSelectedStudent] = useState<number | 'all'>('all');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiIsFallback, setAiIsFallback] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  const handleAskAI = async (customQuestion?: string) => {
    const targetQuestion = customQuestion || questionInput;
    if (!targetQuestion.trim()) return;

    // Use passed question or input field, set state for input field if clicked suggest
    if (customQuestion) {
      setQuestionInput(customQuestion);
    }

    setAiLoading(true);
    setAiError('');
    setAiResponse('');

    try {
      const response = await fetch('/api/student-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: aiSelectedStudent,
          question: targetQuestion,
          language: isArabic ? 'ar' : 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setAiResponse(data.response || '');
      setAiIsFallback(!!data.isFallback);
    } catch (err: any) {
      console.error(err);
      setAiError(isArabic 
        ? 'حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي.' 
        : 'An error occurred while connecting to the AI helper.');
    } finally {
      setAiLoading(false);
    }
  };

  // Define isolated filtered slides for the projector
  const filteredSlides = useMemo(() => {
    if (activeStudent === 'all') return slides;
    return slides.filter(s => s.speakerId === activeStudent);
  }, [activeStudent]);

  // Find index of current slide within the filtered slides
  const filteredCurrentIdx = useMemo(() => {
    const idx = filteredSlides.findIndex(s => s.id === slides[currentSlideIdx]?.id);
    return idx !== -1 ? idx : 0;
  }, [filteredSlides, currentSlideIdx]);

  const activeSlide = slides[currentSlideIdx];

  const displayStudent = useMemo(() => {
    return activeStudent === 'all' 
      ? (activeSlide ? activeSlide.speakerId : 'all') 
      : activeStudent;
  }, [activeStudent, activeSlide]);

  // Synchronize AI topic selector with the currently displayed student
  useEffect(() => {
    setAiSelectedStudent(displayStudent);
  }, [displayStudent]);

  // Auto-play interval handling within the isolated slide deck
  const handleNextSlide = () => {
    if (filteredCurrentIdx + 1 < filteredSlides.length) {
      const nextSlide = filteredSlides[filteredCurrentIdx + 1];
      const origIdx = slides.findIndex(s => s.id === nextSlide.id);
      if (origIdx !== -1) setCurrentSlideIdx(origIdx);
    } else {
      const firstSlide = filteredSlides[0];
      const origIdx = slides.findIndex(s => s.id === firstSlide.id);
      if (origIdx !== -1) setCurrentSlideIdx(origIdx);
    }
  };

  const handlePrevSlide = () => {
    if (filteredCurrentIdx - 1 >= 0) {
      const prevSlide = filteredSlides[filteredCurrentIdx - 1];
      const origIdx = slides.findIndex(s => s.id === prevSlide.id);
      if (origIdx !== -1) setCurrentSlideIdx(origIdx);
    } else {
      const lastSlide = filteredSlides[filteredSlides.length - 1];
      const origIdx = slides.findIndex(s => s.id === lastSlide.id);
      if (origIdx !== -1) setCurrentSlideIdx(origIdx);
    }
  };

  useEffect(() => {
    let timerID: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      timerID = setInterval(() => {
        handleNextSlide();
      }, 7000); // 7sec auto transition
    }
    return () => {
      if (timerID) clearInterval(timerID);
    };
  }, [isAutoPlaying, filteredCurrentIdx, filteredSlides]);

  // Map student speaker information for the active slide
  const getSpeakerInfo = (speakerId: number | 'all') => {
    if (speakerId === 'all') {
      return {
        nameAr: "جميع طلاب الفريق",
        nameEn: "Entire Project Team",
        avatar: <Users className="w-4 h-4 text-white" />,
        bgColor: "bg-slate-800 border-slate-700"
      };
    }
    const currentStudent = students.find(s => s.id === speakerId);
    if (!currentStudent) {
      return {
        nameAr: "معلم غائب",
        nameEn: "Unknown Speaker",
        avatar: <User className="w-4 h-4 text-white" />,
        bgColor: "bg-slate-700"
      };
    }
    return {
      nameAr: currentStudent.nameAr,
      nameEn: currentStudent.nameEn,
      avatar: <span className="text-[9px] font-black">{currentStudent.avatarInitials}</span>,
      bgColor: `bg-gradient-to-r ${currentStudent.bgGradClass} border-transparent text-white`
    };
  };

  const handleStudentSelect = (id: number | 'all') => {
    setActiveStudent(id);
    if (id === 'all') {
      // Show first slide
      setCurrentSlideIdx(0);
    } else {
      // Find the first slide assigned to this student
      const matchedIdx = slides.findIndex(s => s.speakerId === id);
      if (matchedIdx !== -1) {
        setCurrentSlideIdx(matchedIdx);
      }
    }
  };

  const activeSpeaker = getSpeakerInfo(activeSlide.speakerId);

  return (
    <div className="flex flex-col gap-6 w-full" id="presentation-outer-wrapper">
      
      {/* MODE SELECTOR SUB-TABS */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex gap-2 w-full max-w-4xl mx-auto mb-2" dir={isArabic ? "rtl" : "ltr"}>
        <button
          onClick={() => setPresentationMode('projector')}
          className={`cursor-pointer flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            presentationMode === 'projector'
              ? 'bg-blue-600 shadow-md text-white border border-blue-500'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="mode-projector-btn"
        >
          <MonitorPlay className="w-4 h-4" />
          <span>{isArabic ? "📽️ جهاز العرض والتحسينات التفاعلية" : "📽️ Interactive Slide Projector"}</span>
        </button>
        <button
          onClick={() => setPresentationMode('document')}
          className={`cursor-pointer flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            presentationMode === 'document'
              ? 'bg-blue-600 shadow-md text-white border border-blue-500'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="mode-document-btn"
        >
          <BookOpen className="w-4 h-4" />
          <span>{isArabic ? "📖 مستند العرض والشرائح الكاملة" : "📖 Complete Slides Gallery"}</span>
        </button>
      </div>

      {presentationMode === 'projector' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="presentation-container" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* LEFT RAIL / SIDEBAR: STUDENT LIST & EXPLANATION PARTS */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Title Badge in Sidebar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-widest inline-block mb-2">
            {isArabic ? "فريق تخرج المهندسين" : "CAPSTONE GRAD ENGINEERING TEAM"}
          </span>
          <h3 className="text-sm font-black text-slate-800 leading-tight">
            {isArabic ? "توزيع المسؤوليات والشرائح" : "Deliverables & Slide Ownership"}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isArabic ? "انقر على اسم أي طالب لعزل شرائح الشرح الخاصة بموضوعه وعرض مفاصلها الهندسية." : "Select any student name below to snap the projector to their speaking subject."}
          </p>
        </div>

        {/* List of 5 students + "All Team" controller */}
        <div className="flex flex-col gap-2.5">
          {/* Universal team trigger */}
          <button
            onClick={() => handleStudentSelect('all')}
            className={`cursor-pointer w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between ${
              activeStudent === 'all' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeStudent === 'all' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black block">
                  {isArabic ? "كامل طلاب مشروع التخرج" : "Full Graduation Team"}
                </span>
                <span className={`text-[9px] block ${activeStudent === 'all' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {isArabic ? "عرض الملف التقديمي كاملاً (17 شريحة)" : "View all 17 slide assets continuously"}
                </span>
              </div>
            </div>
            <div className={`text-[10px] font-black font-mono border px-1.5 py-0.5 rounded ${activeStudent === 'all' ? 'bg-blue-800/60 border-blue-500/30' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              ALL
            </div>
          </button>

          {/* Students list */}
          {students.map((student) => {
            const isSelected = activeStudent === student.id;
            return (
              <button
                key={student.id}
                onClick={() => handleStudentSelect(student.id)}
                className={`cursor-pointer w-full text-right p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-2.5 text-right">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {student.avatarInitials}
                    </div>
                    <div>
                      <span className="text-xs font-black block">
                        {isArabic ? student.nameAr : student.nameEn}
                      </span>
                      <span className={`text-[8.5px] font-semibold block ${isSelected ? 'text-slate-300' : 'text-blue-600'}`}>
                        {student.id === 1 ? (isArabic ? 'معمارية النظام والمكونات' : 'System Architecture') :
                         student.id === 2 ? (isArabic ? 'الربط والنظري والفيزياء' : 'Interfacing & Physics') :
                         student.id === 3 ? (isArabic ? 'التصميم والبرمجة والتوصيل' : 'Wiring & Programming') :
                         student.id === 4 ? (isArabic ? 'الحماية وتكامل الطاقة' : 'Electrical Protection') :
                         (isArabic ? 'النتائج والقرارات والجدوى' : 'Results & Feasibility')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Indicators */}
                  <span className={`text-[9.5px] font-black font-mono rounded px-1.5 py-0.5 ${
                    isSelected ? 'bg-white/15 text-yellow-300 border border-white/10' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    SLIDES {student.id === 1 ? '1-3' : student.id === 2 ? '4-6' : student.id === 3 ? '7-9' : student.id === 4 ? '10-12' : '13-15'}
                  </span>
                </div>
                
                {/* Topic Scope Text */}
                <span className={`text-[10px] text-right block leading-relaxed font-sans font-medium line-clamp-2 ${
                  isSelected ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  {isArabic ? student.roleAr : student.roleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Presenter Technical Discussion Briefing Sheet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayStudent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col gap-3 relative overflow-hidden text-right"
          >
            {/* Visual glow accent matching student */}
            <div className={`absolute top-0 right-0 w-20 h-20 opacity-15 blur-2xl pointer-events-none rounded-full bg-gradient-to-br ${
              displayStudent === 'all' ? 'from-blue-500' :
              displayStudent === 1 ? 'from-cyan-500' :
              displayStudent === 2 ? 'from-purple-500' :
              displayStudent === 3 ? 'from-emerald-500' :
              displayStudent === 4 ? 'from-amber-500' :
              'from-pink-500'
            }`} />

            <div className="flex justify-between items-center pb-2 border-b border-slate-800" dir={isArabic ? "rtl" : "ltr"}>
              <span className="text-[9.5px] uppercase font-black text-blue-400 tracking-wider font-mono">
                {isArabic ? "📋 ملخص الشرح والمناقشة الشفهية" : "📋 Oral Exam Technical Brief"}
              </span>
              <span className="text-[9px] text-slate-500 font-mono font-bold">
                {displayStudent === 'all' ? 'TEAM OVERVIEW' : `ENGINEER #${displayStudent}`}
              </span>
            </div>

            {displayStudent === 'all' ? (
              <div className="flex flex-col gap-2 text-right">
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "يقوم الفريق بالكامل (عبدالرحمن، عباس، علاء، فهد، محمد) بتنسيق العرض هندسياً لتغطية كامل جوانب المنظومة من التحكم اللاسلكي ومعالجة الإشارات والسبات والوقاية الكهربائية."
                    : "The team (Abdulrahman, Abbas, Alaa, Fahad, Mohammed) coordinates their presentation sectors dynamically, covering the entire smart date palm irrigation loop securely."}
                </p>
                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                  {["الري والملوحة", "ESP32 والحسّ", "المناخ والحرارة", "الحماية والعزل", "السبات والكلفة"].map((t, i) => (
                    <span key={i} className="text-[8.5px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-300 font-semibold font-sans">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : displayStudent === 1 ? (
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs font-black text-cyan-400">{isArabic ? "عبدالرحمن اياد - الري الموزع" : "Abdulrahman Ayad - Distributed Irrigation"}</span>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "يشرح مخاطر الري بالغمر التقليدي الذي يبخر المياه ويراكم الأملاح السامة حول الجذور. صمم حוكمة الشبكة الموزعة وعقد استشعار الملوحة لمنع الري بماء شط العرب المالح."
                    : "Focuses on flood irrigation failures causing root salinization. Crafted the field cluster topology to trigger water-stops when the Shatt Al-Arab salinity concentration trends above safety thresholds."}
                </p>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[10px] text-cyan-300 font-mono font-medium">
                  {isArabic ? "⚠️ صمام الأمان: الإيقاف التلقائي للمضخات عند تجاوز الملوحة 2500 ppm" : "⚠️ Salt-Lock safeguard: Forced pump lockdown if TDS exceeds 2500 ppm"}
                </div>
              </div>
            ) : displayStudent === 2 ? (
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs font-black text-purple-400">{isArabic ? "عباس هادي - معالجة الإشارات" : "Abbas Hadi - ESP32 & ADC Core"}</span>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "حل معضلة تجميد قراءات ADC2 التاريخية في ESP32 الناجمة عن تعارض البث اللاسلكي برمجياً وكهرومغناطيسياً عبر قنوات ADC1، موضحاً المبدأ السعوي للرطوبة v1.2 لعزل أثر الصدأ."
                    : "Erindicated the notorious ESP32 ADC2 bank lockups caused by Wi-Fi/ESP-NOW hardware overlaps, routing inputs strictly to ADC1. Justifies capacitive soil moisture v1.2 probes to halt corrosive oxidation."}
                </p>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[10px] text-purple-300 font-mono font-medium">
                  {isArabic ? "⚙️ هندسة الربط: التوجيه الإلزامي للحساسات التناظرية لقنوات ADC1" : "⚙️ Interfacing Rule: Mandatory analog routing to ADC1 channels"}
                </div>
              </div>
            ) : displayStudent === 3 ? (
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs font-black text-emerald-400">{isArabic ? "علاء مهدي - التناغم البيئي" : "Alaa Mahdi - Climate & 1-Wire"}</span>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "صاغ ربط مستشعرات DHT22 ومسابير DS18B20 المقاومة للماء بالأعماق على ناقل الرقمي أحادي السلك 1-Wire DQ Bus، مع دمج عناصر تسخين مصفوفة المطر لعزل قراءات الندى والضباب الزائف."
                    : "Formulated waterproof core depth DS18B20 sensors mapped using 64-bit ROM keys via a 1-Wire DQ Bus. Configured rain sensor micro-heaters to evaporate fake fog/morning dew condensation."}
                </p>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[10px] text-emerald-300 font-mono font-medium">
                  {isArabic ? "🌧️ تصفية الطقس: التسخين النحاسي الخفيف يزيل قراءات الندى والضباب" : "🌧️ Climate filter: Subtle matrix heating isolates genuine rainfall from dew"}
                </div>
              </div>
            ) : displayStudent === 4 ? (
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs font-black text-amber-400">{isArabic ? "فهد طلال - العزل والوقاية الكهربائية" : "Fahad Talal - Isolation & Safety"}</span>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "أشرف على بروتوكول ESP-NOW اللامتزامن لربط العقد بتقديم عزل كهرومغناطيسي تام (5000V) عبر الأوبتوكبلر PC817، وتخميد نويز ملفات الريليهات الحثية العنيفة بدايودات الفرملة 1N5408."
                    : "Supervised asymmetric low-latency ESP-NOW links. Implements full 5000V galvanic insulation via PC817 optocouplers to suppress noise. Anchored parallel 1N5408 diodes to absorb spikes."}
                </p>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[10px] text-amber-300 font-mono font-medium">
                  {isArabic ? "⚡ حماية الدوائر: عزل الأوبتوكبلر PC817 والدايود 1N5408 لمنع الانهيار" : "⚡ Electrical safety: PC817 Opto-isolation & 1N5408 diodes clamp spike damage"}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs font-black text-pink-400">{isArabic ? "محمد علي - المعايرة والجدوى والميزانية" : "Mohammed Ali - Energy, Math & BOM"}</span>
                <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                  {isArabic 
                    ? "وضع معادلات المعايرة متعددة الحدود وملامسات السبات الحاد لتقليص التيار إلى 15µA لحفظ البطارية لـ 120 يوماً، مع صياغة فاتورة المواد BOM الكلية البالغة 198,500 د.ع."
                    : "Formulated 3rd-order non-linear polynomial calibrations for soil and water TDS. Scaled ultra low-power standby down to 15µA for 120 days lifespan. Documented the BOM sheet at 198,500 IQD."}
                </p>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[10px] text-pink-300 font-mono font-medium">
                  {isArabic ? "💵 جدوى المواد: فاتورة المواد الكلية BOM تبلغ 198,500 دينار عراقي" : "💵 Itemised cost: Total system BOM optimized at precisely 198,500 IQD"}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick supervisor signature note */}
        <div className="mt-auto bg-slate-100 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-slate-700">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-black">{isArabic ? "تحت إشراف الأستاذ:" : "Under Supervising of:"}</span>
          </div>
          <span className="text-xs font-bold text-slate-900 pl-5">
            {isArabic ? "د. أيمن م. إسماعيل" : "Dr. Ayman M. Ismaiel"}
          </span>
          <p className="text-[10px] text-slate-500 inline-block font-sans">
            {isArabic ? "جامعة المعقل - كلية الهندسة - قسم هندسة السيطرة والحاسبات والأتمتة." : "Al-Maaqal University Engineering - Control, Computers & Automation Department."}
          </p>
        </div>

      </div>

      {/* RIGHT STAGE: INDEPENDENT INTERACTIVE SLIDE PROJECTOR */}
      <div className="lg:col-span-8 flex flex-col justify-between gap-4">
        
        {/* Projector Deck HUD control bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 font-mono tracking-wider uppercase">
              {isArabic ? "محاكي العرض التقديمي للتخرج" : "GRADUATION PROJECTOR LIVE FEED"}
            </span>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-2">
            {/* Auto Play trigger toggle */}
            <button
              onClick={() => setIsAutoPlaying(prev => !prev)}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                isAutoPlaying 
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? (isArabic ? "إيقاف مؤقت للتشغيل" : "PAUSE ADVANCE") : (isArabic ? "تقديم تلقائي" : "AUTO ADVANCE")}</span>
            </button>

            {/* Manual Language Overrider for Slide deck only */}
            <button
              onClick={() => setSlideLang(prev => prev === 'ar' ? 'en' : 'ar')}
              className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
              title="Toggle slide deck language locally"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>{slideLang === 'ar' ? "ENGLISH SLIDES" : "الشرائح بالعربية"}</span>
            </button>
          </div>

        </div>

        {/* ACTUAL POWERPOINT SLIDE VIEWPORT */}
        <div className="bg-[#0B1528] text-slate-100 rounded-2xl p-6 md:p-8 shadow-md border border-[#1A2E4E] relative overflow-hidden flex flex-col justify-between align-stretch aspect-video min-h-[380px]">
          
          {/* Subtle Grid backdrop simulating real presentation projectors */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          
          {/* Watermark Logo Al-maaqal university */}
          <div className="absolute top-4 right-4 opacity-[0.06] select-none text-[32px] md:text-[40px] font-black tracking-widest uppercase font-sans pointer-events-none text-right">
            AL-MAAQAL
          </div>

          {/* SLIDE TOP ROW: Speaker indicator, indices */}
          <div className="relative z-10 flex justify-between items-start gap-4">
            
            {/* Speaker Tag indicator */}
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-xs border border-slate-800 rounded-full py-1 px-3">
              <span className="text-[9px] font-black text-slate-400 font-mono tracking-wider">
                {isArabic ? "المتحدث الحالي:" : "SPEAKER STATE:"}
              </span>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono ${activeSpeaker.bgColor}`}>
                {activeSpeaker.avatar}
              </div>
              <span className="text-[10px] font-bold text-white">
                {slideLang === 'ar' ? activeSpeaker.nameAr : activeSpeaker.nameEn}
              </span>
            </div>

            {/* Slide Index indicator */}
            <div className="bg-slate-900/60 border border-slate-800 text-[10px] font-black font-mono py-1 px-2.5 rounded-full text-blue-400">
               SLIDE {filteredCurrentIdx + 1} / {filteredSlides.length}
            </div>

          </div>

          {/* SLIDE CENTER CONTENT AREA */}
          <div className="relative z-10 my-auto flex flex-col gap-4 text-right justify-center py-4" dir={slideLang === 'ar' ? 'rtl' : 'ltr'}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIdx + slideLang}
                initial={{ opacity: 0, x: slideLang === 'ar' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideLang === 'ar' ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 shrink-0"
              >
                {/* Cover/Title Slide Layout Specific */}
                {activeSlide.graphicType === 'title' ? (
                  <div className="flex flex-col gap-3 py-4 text-center items-center justify-center">
                    
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center mb-2 shadow-lg hover:border-amber-400 transition-all">
                      <svg viewBox="0 0 100 100" className="w-11 h-11 text-amber-500" fill="currentColor">
                        {/* Outer circle */}
                        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4.5" />
                        {/* Triangular Roof / Pediment */}
                        <polygon points="16,34 50,13 84,34" />
                        {/* Architrave */}
                        <rect x="20" y="37" width="60" height="4.5" rx="1" />
                        {/* Columns / Pillars */}
                        <rect x="23" y="44" width="6" height="23" rx="0.5" />
                        <rect x="35" y="44" width="6" height="23" rx="0.5" />
                        <rect x="47" y="44" width="6" height="23" rx="0.5" />
                        <rect x="59" y="44" width="6" height="23" rx="0.5" />
                        <rect x="71" y="44" width="6" height="23" rx="0.5" />
                        {/* Base Steps */}
                        <rect x="20" y="70" width="60" height="4.5" rx="1" />
                        <rect x="14" y="77" width="72" height="4.5" rx="1" />
                      </svg>
                    </div>

                    <h1 className="text-lg md:text-2xl font-black text-white leading-normal tracking-tight max-w-[620px]">
                      {slideLang === 'ar' ? activeSlide.titleAr : activeSlide.titleEn}
                    </h1>

                    <div className="h-1 w-28 bg-[#E2B13C] rounded-full my-1.5" />

                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-[550px] font-sans font-semibold whitespace-pre-line bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
                      {slideLang === 'ar' ? activeSlide.subtitleAr : activeSlide.subtitleEn}
                    </p>

                    {/* Highly visible bullet points for Slide 0 */}
                    <div className="mt-2 max-w-[550px] text-right bg-slate-950/20 p-3 rounded-xl border border-slate-800/40">
                      <ul className="space-y-1.5">
                        {(slideLang === 'ar' ? activeSlide.bulletsAr : activeSlide.bulletsEn).map((bullet, idx) => (
                          <li key={idx} className="text-[11px] md:text-xs text-slate-300 flex items-start gap-1.5 justify-start text-right">
                            <span className="text-yellow-400 shrink-0">✦</span>
                            <span className="font-sans font-medium">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 mt-5 max-w-[500px]">
                      {students.map(s => (
                        <div key={s.id} className="bg-slate-900/50 border border-slate-800 px-2 py-1 rounded-sm flex flex-col gap-1 text-center">
                          <span className="text-[8px] text-slate-400 font-mono">Student {s.id}</span>
                          <span className="text-[9px] font-bold text-slate-200 truncate">{slideLang === 'ar' ? s.nameAr.split(" ")[0] : s.nameEn.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : activeSlide.graphicType === 'intro' ? (
                  // Introductory transition slides
                  <div className="flex flex-col gap-3 text-center justify-center items-center py-6">
                    
                    <span className="text-[9px] uppercase font-black text-amber-500 tracking-widest font-mono">
                      {slideLang === 'ar' ? "محاورة التقديم" : "PRESENTER SESSION PASS"}
                    </span>
                    
                    <h2 className="text-base md:text-xl font-bold font-sans text-white">
                      {slideLang === 'ar' ? activeSlide.titleAr : activeSlide.titleEn}
                    </h2>

                    <div className="h-[1.5px] w-20 bg-slate-800 rounded-full my-2" />

                    <div className="flex flex-col gap-2 mt-2 items-center justify-center text-center max-w-[580px]">
                      {activeSlide.bulletsAr.map((bullet, idx) => (
                        <div key={idx} className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 text-xs text-slate-300 font-sans leading-relaxed max-w-[480px]">
                          {slideLang === 'ar' ? activeSlide.bulletsAr[idx] : activeSlide.bulletsEn[idx]}
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  // General Slide bullet listing
                  <div className="flex flex-col gap-3">
                    <h2 className="text-sm md:text-base font-black text-white leading-normal flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#E2B13C]" />
                      <span>{slideLang === 'ar' ? activeSlide.titleAr : activeSlide.titleEn}</span>
                    </h2>

                    <ul className="flex flex-col gap-2 md:gap-2.5 mt-1.5">
                      {activeSlide.bulletsAr.map((bullet, idx) => (
                        <li 
                          key={idx} 
                          className="flex gap-2 items-start text-xs md:text-[13px] leading-relaxed text-slate-300 font-medium"
                          style={{ textIndent: '-16px', paddingLeft: '16px' }}
                        >
                          <span className="text-[#E2B13C] select-none font-bold mr-1 shrink-0">•</span>
                          <span>{slideLang === 'ar' ? activeSlide.bulletsAr[idx] : activeSlide.bulletsEn[idx]}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Dynamic slide contextual diagrams to elevate PPT richness */}
                    <div className="mt-4 flex justify-end gap-2 text-right">
                      {activeSlide.graphicType === 'agriculture' && (
                        <div className="bg-slate-900/70 p-2 px-3 rounded-lg border border-slate-800 text-[10px] text-green-400 font-mono font-semibold flex items-center gap-1.5">
                          <Waves className="w-3.5 h-3.5 text-blue-400" />
                          <span>{slideLang === 'ar' ? "ملوحة شط العرب الزاحفة: 0-1000 ppm" : "Rising Shatt Al-Arab salinity trend: 0-1000 ppm"}</span>
                        </div>
                      )}
                      
                      {activeSlide.graphicType === 'problem' && (
                        <div className="bg-red-950/20 p-2 px-3 rounded-lg border border-red-500/20 text-[10px] text-red-400 font-mono font-semibold flex items-center gap-1.5 animate-pulse">
                          <BadgeAlert className="w-3.5 h-3.5" />
                          <span>{slideLang === 'ar' ? "قيد سيليكون: إبطال تفعيل ADC2" : "Hardware limit: forced ADC2 shutdown active"}</span>
                        </div>
                      )}

                      {activeSlide.graphicType === 'objectives' && (
                        <div className="bg-blue-950/20 p-2 px-3 rounded-lg border border-blue-500/20 text-[10px] text-cyan-400 font-mono font-semibold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{slideLang === 'ar' ? "3 عقد مستقلة لاسلكياً (ESP-NOW)" : "3 wireless independent node networks (ESP-NOW)"}</span>
                        </div>
                      )}

                      {activeSlide.graphicType === 'math' && (
                        <div className="bg-yellow-950/10 p-2 px-3 rounded-lg border border-yellow-500/20 text-[10px] text-amber-500 font-mono font-semibold">
                          VWC% = [(V_dry - V_sampled)/(V_dry - V_wet)] * 100
                        </div>
                      )}

                      {activeSlide.graphicType === 'protection' && (
                        <div className="bg-emerald-950/20 p-2 px-3 rounded-lg border border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{slideLang === 'ar' ? "حماية Flyback: دايود 1N5408 موازٍ" : "Flyback safety: Parallel 1N5408 suppression"}</span>
                        </div>
                      )}

                      {activeSlide.graphicType === 'chart' && (
                        <div className="bg-purple-950/20 p-2 px-3 rounded-lg border border-purple-500/20 text-[10px] text-purple-400 font-mono font-semibold flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{slideLang === 'ar' ? "اقتصادي: الكلفة الإجمالية 198,500 د.ع" : "Cost plans: Sourced at 198,500 IQD total"}</span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

          {/* SLIDE FOOTER BAR: Project details & supervisor signature */}
          <div className="relative z-10 border-t border-slate-900 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500">
            
            <div>
              {slideLang === 'ar' ? (
                <span>جامعة المعقل · قسم هندسة التحكم والحاسبات</span>
              ) : (
                <span>Al-Maaqal University · Dept. and Computer Engineering</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">
                {slideLang === 'ar' ? "إشراف الأستاذ: د. أيمن م. إسماعيل" : "Advisor: Dr. Ayman M. Ismaiel"}
              </span>
              <span>|</span>
              <span className="font-mono text-[9px]">2024-2025</span>
            </div>

          </div>

        </div>

        {/* BOTTOM PROJECTOR NAVIGATION SLIDER */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            
            {/* Prev Trigger Button */}
            <button
              onClick={handlePrevSlide}
              className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
              id="presentation-prev-btn"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isArabic ? "الشريحة السابقة" : "PREVIOUS SLIDE"}</span>
            </button>

            {/* Pagination Bullet Indicators */}
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[320px]">
              {filteredSlides.map((slide, idx) => {
                const isActive = idx === filteredCurrentIdx;
                // Color bullets by which student owns that slide index
                let speakerColor = 'bg-slate-200';
                if (isActive) {
                  speakerColor = 'bg-blue-600 ring-2 ring-blue-300 ring-offset-1 scale-125';
                } else if (slide.speakerId !== 'all') {
                  const student = students.find(s => s.id === slide.speakerId);
                  if (student) {
                    if (student.id === 1) speakerColor = 'bg-cyan-400/70 hover:bg-cyan-500';
                    else if (student.id === 2) speakerColor = 'bg-purple-400/70 hover:bg-purple-500';
                    else if (student.id === 3) speakerColor = 'bg-emerald-400/70 hover:bg-emerald-500';
                    else if (student.id === 4) speakerColor = 'bg-amber-400/70 hover:bg-amber-500';
                    else if (student.id === 5) speakerColor = 'bg-pink-400/70 hover:bg-pink-500';
                  }
                } else {
                  speakerColor = 'bg-slate-300 hover:bg-slate-400';
                }

                return (
                  <button
                    key={slide.id}
                    onClick={() => {
                      const origIdx = slides.findIndex(s => s.id === slide.id);
                      if (origIdx !== -1) setCurrentSlideIdx(origIdx);
                    }}
                    className={`cursor-pointer w-3 h-3 rounded-full transition-all ${speakerColor}`}
                    title={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Next Trigger Button */}
            <button
              onClick={handleNextSlide}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
              id="presentation-next-btn"
            >
              <span>{isArabic ? "الشريحة التالية" : "NEXT SLIDE"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

          {/* Quick Contextual helper regarding Slide topics */}
          <div className="bg-slate-50/50 p-2 px-3 rounded-lg border border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between gap-4">
             <span>
               <strong>{isArabic ? "أكاديمية المعقل:" : "Interactive Advisor Note:"}</strong>{" "}
               {isArabic ? "انقر على النقاط الملوّنة أعلاه للتنقل الفوري بين شرائح المشروع." : "Click on the colored bubble endpoints above to teleport directly into specific presentation phases."}
             </span>
             <span className="font-mono text-[9px] text-blue-600 font-bold shrink-0">
               {isArabic ? "موجز المخططات" : "SLIDES DIAG"}
             </span>
          </div>

        </div>

      </div>

    </div>
      ) : (
        /* ORIGINAL PPT SLIDES GALLERY MODE */
        <div className="flex flex-col gap-6" dir={isArabic ? "rtl" : "ltr"}>
          
          {/* Top Control Bar of Document Sub-Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-right md:text-left w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 font-sans">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{isArabic ? "مستند العرض التقديمي الأصلي المعتمد (22 صفحة)" : "Approved Original PPT Slides Document (22 Slides)"}</span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 pl-4 font-sans">
                {isArabic ? "تصفح واعرض شرائح مشروع الطلاب الأصيلة بالكامل باللغتين العربية والإنكليزية للاستعداد التام لمناقشة اللجنة." : "Browse and study all original slides in both English and Arabic to prepare for the oral defense panel."}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
              {/* Copy Slides Plain Text Outline */}
              <button
                onClick={handleCopyAllSlidesText}
                className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Copy all 22 slides text content formatted"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? (isArabic ? "تم نسخ النصوص!" : "Copied Outline!") : (isArabic ? "نسخ نصوص العرض" : "Copy PPT Text")}</span>
              </button>

              {/* Language Switcher of Doc section */}
              <button
                onClick={() => setDocLang(prev => prev === 'ar' ? 'en' : 'ar')}
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{docLang === 'ar' ? "ENGLISH" : "العربية"}</span>
              </button>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" id="doc-tabs-filter">
            {[
              { id: 'all', labelAr: "كل العرض التقدمي المعتمد (17 شريحة)", labelEn: "All Approved PPT (17 slides)" },
              { id: 1, labelAr: "عبدالرحمن اياد - المعمارية والمكونات (1-3)", labelEn: "Abdulrahman - Architecture & Components (1-3)" },
              { id: 2, labelAr: "عباس هادي - الربط المادي والأساس النظري (4-6)", labelEn: "Abbas - Interfacing & Theory (4-6)" },
              { id: 3, labelAr: "علاء مهدي - التصميم والتوصيلات والبرمجة (7-9)", labelEn: "Alaa - Design, Wiring & Programming (7-9)" },
              { id: 4, labelAr: "فهد طلال - الحماية الكهربائية ومعايرة الطاقة (10-12)", labelEn: "Fahad - Electrical Protection & Calibration (10-12)" },
              { id: 5, labelAr: "محمد علي - النتائج والقرارات والجدوى الاقتصادية (13-15)", labelEn: "Mohammed - Results, Decision Control & Economy (13-15)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDocFilter(f.id)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                  docFilter === f.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform -translate-y-0.5'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isArabic ? f.labelAr : f.labelEn}
              </button>
            ))}
          </div>

          {/* Slides Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="slides-document-grid">
            {slides
              .filter(slide => {
                if (docFilter === 'all') return true;
                return slide.speakerId === docFilter;
              })
              .map((slide) => {
                const uniqueId = slide.id;
                const isTransition = slide.graphicType === 'intro';
                const isTitle = slide.graphicType === 'title';
                const isClosing = slide.graphicType === 'closing';
                
                // Color theme styled exactly like PPT pages
                let cardBg = "bg-[#0b162a]"; // Dark navy blue theme
                let titleColor = "text-yellow-400 font-extrabold";
                let bulletColor = "text-slate-200";
                let borderStyle = "border-slate-800";
                
                if (isTransition) {
                  cardBg = "bg-[#00a2d2]"; // Vibrant cyan theme
                  titleColor = "text-white font-extrabold";
                  bulletColor = "text-white/90 font-medium";
                  borderStyle = "border-cyan-400/50";
                } else if (isTitle) {
                  cardBg = "bg-[#071329] border border-blue-900/50";
                  titleColor = "text-yellow-400 font-extrabold";
                  bulletColor = "text-slate-300";
                }

                return (
                  <div
                    key={uniqueId}
                    className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 relative flex flex-col justify-between ${cardBg} ${borderStyle} hover:shadow-xl hover:-translate-y-1`}
                  >
                    {/* Top Slide indicator row */}
                    <div className="flex justify-between items-center mb-4 text-[10px] opacity-80 border-b border-white/10 pb-2">
                      <span className="font-mono text-white font-black font-sans">
                        {isArabic ? `الشريحة ${uniqueId + 1} من 22` : `Slide ${uniqueId + 1} of 22`}
                      </span>
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded font-black font-sans uppercase">
                        {isTitle ? (isArabic ? "شريحة العنوان" : "TITLE PAGE") :
                         isClosing ? (isArabic ? "شريحة الختام" : "CLOSING PAGE") :
                         isTransition ? (isArabic ? "تقديم الطالب" : "TRANSITION") :
                         (isArabic ? "محتوى هندسي" : "TECHNICAL CONTENT")}
                      </span>
                    </div>

                    {/* Content Block of Slate card */}
                    <div className="flex-1 min-h-[140px] flex flex-col justify-center text-right">
                      <h4 className={`text-sm md:text-base mb-3 leading-snug tracking-tight font-sans ${titleColor}`}>
                        {docLang === 'ar' ? slide.titleAr : slide.titleEn}
                      </h4>

                      {/* Subtitle if any */}
                      {(docLang === 'ar' ? slide.subtitleAr : slide.subtitleEn) && (
                        <p className="text-[11px] text-slate-200 italic mb-3 font-sans opacity-95 text-right w-full">
                          {docLang === 'ar' ? slide.subtitleAr : slide.subtitleEn}
                        </p>
                      )}

                      {/* Bullet list of Slide content */}
                      <ul className="space-y-2 mt-1">
                        {(docLang === 'ar' ? slide.bulletsAr : slide.bulletsEn).map((bullet, bidx) => (
                          <li key={bidx} className={`text-xs leading-relaxed flex items-start gap-1.5 ${bulletColor} justify-start text-right`}>
                            <span className="text-yellow-400 mt-1 shrink-0">✦</span>
                            <span className="font-sans font-medium">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-5 pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      {/* Zoom trigger */}
                      <button
                        onClick={() => setZoomedSlideIdx(uniqueId)}
                        className="cursor-pointer bg-white/10 border border-white/10 hover:bg-white/15 px-3 py-1.5 text-[10px] font-bold rounded-lg text-white flex items-center justify-center gap-1 transition-all"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{isArabic ? "تكبير الشاشة وعرض" : "Zoom View"}</span>
                      </button>

                      <div className="text-[9px] text-slate-400 text-right font-mono self-end sm:self-auto">
                        {isTransition ? (
                          <span className="text-yellow-300 font-bold">
                            {isArabic ? "بطاقة انتقال التقديم" : "Presenter Breakout"}
                          </span>
                        ) : (
                          <span>Al-Maaqal Uni · Capstone</span>
                        )}
                      </div>
                    </div>

                    {/* EXPECTED VIVA QUESTIONS EXPANSE HOTSPOT */}
                    {EXPECTED_VIVA_QUESTIONS[uniqueId] && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <button
                          onClick={() => toggleHotspot(uniqueId)}
                          className="cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 hover:text-amber-200 font-black text-[10px] w-full py-1.5 px-3 rounded-lg flex items-center justify-between transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                            {isArabic ? "💡 مفاصل أسئلة ومناقشات اللجنة المتوقعة ونموذج الإجابة" : "💡 Expected Viva Committee Questions & Direct Answer"}
                          </span>
                          <span className="font-bold text-xs">{openHotspots[uniqueId] ? "▲" : "▼"}</span>
                        </button>

                        <AnimatePresence>
                          {openHotspots[uniqueId] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-2 bg-slate-950/80 p-3 rounded-lg border border-white/5 flex flex-col gap-3 font-sans text-right"
                            >
                              {EXPECTED_VIVA_QUESTIONS[uniqueId].map((it, qidx) => (
                                <div key={qidx} className="text-right border-b border-white/5 last:border-b-0 pb-2.5 last:pb-0">
                                  <div className="text-amber-300 font-black text-[11px] mb-1 flex items-start gap-1 font-sans">
                                    <span className="font-mono text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded shrink-0 font-sans">Q</span>
                                    <span>{docLang === 'ar' ? it.qAr : it.qEn}</span>
                                  </div>
                                  <div className="text-slate-300 text-[11px] leading-relaxed font-sans font-medium pl-2 pr-1 flex items-start gap-1 font-sans">
                                    <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded shrink-0 font-sans font-sans">A</span>
                                    <span>{docLang === 'ar' ? it.aAr : it.aEn}</span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* FULLSCREEN IMMERSIVE PPT ZOOMED VIEW MODAL */}
      <AnimatePresence>
        {zoomedSlideIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Modal Top Control Bar */}
            <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-white/10 max-w-6xl mx-auto w-full">
              <div className="text-right flex items-center gap-2">
                <span className="font-mono text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded font-black font-sans">
                  {isArabic ? `شريحة ${zoomedSlideIdx + 1}` : `Slide ${zoomedSlideIdx + 1}`}
                </span>
                <span className="text-xs text-white font-black font-sans">
                  {isArabic ? slides[zoomedSlideIdx].titleAr : slides[zoomedSlideIdx].titleEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomedSlideIdx(prev => prev !== null && prev > 0 ? prev - 1 : slides.length - 1)}
                  className="cursor-pointer hover:bg-white/10 text-white p-2 rounded-lg border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomedSlideIdx(prev => prev !== null && prev < slides.length - 1 ? prev + 1 : 0)}
                  className="cursor-pointer hover:bg-white/10 text-white p-2 rounded-lg border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomedSlideIdx(null)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-black transition-colors animate-pulse"
                >
                  {isArabic ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>

            {/* Immersive Widescreen Slide Container */}
            <div className="flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-4">
              <div className={`aspect-[16/9] w-full max-w-5xl rounded-3xl p-6 md:p-12 relative flex flex-col justify-between border shadow-2xl ${
                slides[zoomedSlideIdx].graphicType === 'intro' ? 'bg-[#00a2d2] border-cyan-400/40 text-white' : 
                slides[zoomedSlideIdx].graphicType === 'title' ? 'bg-gradient-to-br from-[#071329] to-[#0f2a58] border-slate-800 text-white' :
                'bg-[#0b162a] border-slate-800 text-white'
              }`}>
                {/* Embedded Logo and Header background */}
                <div className="flex justify-between items-center text-[10px] md:text-xs opacity-75 border-b border-white/10 pb-4">
                  <span className="font-sans font-bold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-yellow-400" />
                    {isArabic ? "جامعة المعقل - كلية الهندسة" : "Al-Maaqal University - Engineering"}
                  </span>
                  <span className="bg-white/15 px-2 py-0.5 rounded uppercase font-black tracking-wider font-sans">
                    {isArabic ? "العرض الرئاسي المعتمد" : "Presidential Presentation Deck"}
                  </span>
                </div>

                {/* Big Body Information Area */}
                <div className="my-auto py-4 text-right">
                  <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-6 text-yellow-400 leading-tight font-sans">
                    {docLang === 'ar' ? slides[zoomedSlideIdx].titleAr : slides[zoomedSlideIdx].titleEn}
                  </h3>
                  {(docLang === 'ar' ? slides[zoomedSlideIdx].subtitleAr : slides[zoomedSlideIdx].subtitleEn) && (
                    <p className="text-sm md:text-base text-slate-300 font-sans italic mb-4 md:mb-6 leading-relaxed">
                      {docLang === 'ar' ? slides[zoomedSlideIdx].subtitleAr : slides[zoomedSlideIdx].subtitleEn}
                    </p>
                  )}
                  <ul className="space-y-3 font-sans">
                    {(docLang === 'ar' ? slides[zoomedSlideIdx].bulletsAr : slides[zoomedSlideIdx].bulletsEn).map((bullet, idx) => (
                      <li key={idx} className="text-xs md:text-base text-slate-100 flex items-start gap-2 leading-relaxed justify-start text-right font-sans">
                        <span className="text-yellow-400 mt-1 md:mt-1.5 shrink-0">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide Footer */}
                <div className="flex justify-between items-center text-[9px] md:text-xs opacity-60 border-t border-white/5 pt-4 font-mono">
                  <span>{isArabic ? "موجز لجنة التخرج 25-26" : "Graduation Board Briefing 25-26"}</span>
                  <span>{isArabic ? `شريحة عرض رقم ${zoomedSlideIdx + 1}` : `Slide sheet #${zoomedSlideIdx + 1}`}</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Help Bar */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 max-w-6xl mx-auto w-full text-center">
              <p className="text-xs text-slate-400 font-sans">
                {isArabic ? "استخدم الأسهم بالزاوية العلوية للتنقل السريع بين لوحات المشروع" : "Use standard navigation buttons above to slide freely through panels"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW BENTO SECTION: AI CAPSTONE QUERY & SEARCH TOOL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-5 md:p-6 rounded-2xl border border-slate-800 shadow-xl" id="ai-presentation-qa" dir={isArabic ? "rtl" : "ltr"}>
        
        {/* Header decoration */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-850">
          <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                {isArabic ? "المستشار العلمي التفاعلي لمناقشة التخرج" : "Interactive AI Graduation Capstone Advisor"}
                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest font-mono shrink-0">
                  GEMINI 3.5
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                {isArabic 
                  ? "مساعد ذكي يحلل تقرير ومخططات طلاب جامعة المعقل ويجيب على أسئلتك التقنية والتحليلية فوراً." 
                  : "Smart assistant that processes the Maaqal capstone report & answers engineering queries."
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-850 shrink-0 self-start sm:self-auto">
            <Brain className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-mono text-slate-300 select-none">
              {isArabic 
                ? "قاعدة معرفة السيطرة والأتمتة" 
                : "Control & Automation Knowledge Hub"
              }
            </span>
          </div>
        </div>

        {/* Middle Deck: Select Target Student Topic */}
        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 font-mono">
              {isArabic ? "1. حدد موضوع البحث أو الطالب المستهدف لموضوع السؤال:" : "1. SELECT TARGET STUDENT OR DISCIPLINE TOPIC:"}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              
              {/* All team */}
              <button
                onClick={() => setAiSelectedStudent('all')}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 'all'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "كامل مشروع التخرج" : "Entire Project"}
              </button>

              {/* Abdulrahman */}
              <button
                onClick={() => setAiSelectedStudent(1)}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 1
                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "عبدالرحمن (الري والغمر)" : "Abdulrahman (Irrigation)"}
              </button>

              {/* Abbas */}
              <button
                onClick={() => setAiSelectedStudent(2)}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 2
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "عباس (المعالج والـ ADC)" : "Abbas (ESP32)"}
              </button>

              {/* Alaa */}
              <button
                onClick={() => setAiSelectedStudent(3)}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 3
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "علاء (مسبار المطر والحرارة)" : "Alaa (Climate)"}
              </button>

              {/* Fahad */}
              <button
                onClick={() => setAiSelectedStudent(4)}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 4
                    ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "فهد (الحماية والأوبتو PC817)" : "Fahad (Safety & Pwr)"}
              </button>

              {/* Mohammed */}
              <button
                onClick={() => setAiSelectedStudent(5)}
                className={`cursor-pointer px-3 py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  aiSelectedStudent === 5
                    ? 'bg-pink-600 border-pink-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-750 hover:bg-slate-800/50'
                }`}
              >
                {isArabic ? "محمد (المعايرة والبطارية)" : "Mohammed (Calibrations)"}
              </button>

            </div>
          </div>

          {/* Quick Suggested Questions Grid */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 pb-1.5 border-b border-slate-850 font-mono">
              {isArabic ? "💡 أسئلة مقترحة سريعة للامتحان التجريبي ومناقشة هذا الطالب:" : "💡 SUGGESTED QUESTIONS FOR VIVA REVIEWS ON THIS SUBJECT:"}
            </span>
            <div className="flex flex-col gap-2">
              {getSuggestedQuestions(aiSelectedStudent).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  disabled={aiLoading}
                  className="cursor-pointer text-right text-xs text-blue-400 hover:text-blue-300 font-sans font-medium flex items-center gap-2 py-1 px-2.5 rounded-lg hover:bg-slate-900 transition-all text-ellipsis overflow-hidden"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span className="truncate">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ask Form */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block font-mono">
              {isArabic ? "2. اكتب سؤالك التقني المخصص حول هذا الموضوع:" : "2. WRITE YOUR CUSTOM GRADUATION INTERROGATION:"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder={
                  isArabic 
                    ? "مثال: كيف يعمل العزل الضوئي PC817 على حماية العقدة من صدمة الريلية والمضخة؟" 
                    : "e.g., How does PC817 optocoupler isolate the ESP32 chip from inductive relay spikes?"
                }
                className="font-sans flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-700"
                disabled={aiLoading}
              />
              <button
                onClick={() => handleAskAI()}
                disabled={aiLoading || !questionInput.trim()}
                className={`cursor-pointer px-4 rounded-xl flex items-center justify-center font-bold text-xs gap-1.5 transition-all ${
                  aiLoading || !questionInput.trim()
                    ? 'bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white font-black hover:shadow-lg hover:shadow-blue-500/20 border border-blue-500'
                }`}
              >
                {aiLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isArabic ? "اسأل الآن" : "ASK AI"}</span>
              </button>
            </div>
          </div>

          {/* AI Output Window */}
          <AnimatePresence mode="wait">
            {(aiLoading || aiResponse || aiError) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-xl border border-slate-850 bg-slate-950/70 backdrop-blur-md relative overflow-hidden"
              >
                {/* Visual grid light accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl pointer-events-none" />

                {/* Loading state */}
                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-xs text-slate-400 font-sans font-medium">
                      {isArabic 
                        ? "جاري مراجعة تقرير مشروع ري بساتين البصرة وصياغة الرد الهندسي المعتمد..." 
                        : "Querying Shatt Al-Arab smart palms capstone report models..."
                      }
                    </p>
                  </div>
                )}

                {/* Error State */}
                {aiError && (
                  <div className="text-red-400 text-xs py-2 font-sans font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Answer Output block */}
                {aiResponse && !aiLoading && (
                  <div className="flex flex-col gap-3">
                    
                    {/* Top utility row */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-850 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {isArabic ? "صياغة علمية موثقة" : "Academic Validated Formulation"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {aiIsFallback && (
                          <span className="text-[9.5px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded mr-1">
                            {isArabic ? "قاعدة محلية" : "Local Database"}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiResponse);
                            alert(isArabic ? 'تم نسخ الشرح الهندسي للحافظة!' : 'AI response copied to clipboard!');
                          }}
                          className="cursor-pointer hover:text-white flex items-center gap-1 focus:outline-none transition-colors"
                          title="Copy formulation to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isArabic ? "نسخ الإجابة" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Response body */}
                    <p className="text-xs md:text-sm leading-relaxed text-slate-205 whitespace-pre-wrap font-sans text-right placeholder-gray-400 pl-2">
                      {aiResponse}
                    </p>

                    {/* Synchronized Slides Teleporter Action */}
                    {aiSelectedStudent !== 'all' && (
                      <div className="mt-3 pt-3 border-t border-slate-850 flex justify-end">
                        <button
                          onClick={() => {
                            // Teleport the main slide view presentation to the chosen student
                            handleStudentSelect(aiSelectedStudent);
                            // Scroll presentation section into visibility
                            const container = document.getElementById("presentation-container");
                            if (container) {
                              container.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 font-black text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          <MonitorPlay className="w-4 h-4 shrink-0" />
                          <span>
                            {isArabic 
                              ? `انقل شاشة العرض لشرائح شرح هذا الطالب (#${aiSelectedStudent})` 
                              : `Project slides for this student (#${aiSelectedStudent})`
                            }
                          </span>
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
