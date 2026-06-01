import { ComponentSpec, NodeData } from './types';

export const UNIVERSITY_INFO = {
  universityAr: "جامعة المعقل",
  universityEn: "Al-Maaqal University",
  collegeAr: "كلية الهندسة - قسم هندسة السيطرة والحاسبات",
  collegeEn: "College of Engineering - Department of Control and Computers Engineering",
  projectNameAr: "منظم الري الذكي المستشعر للملوحة لمزارع تمور البصرة",
  projectNameEn: "Smart Salinity-Aware Irrigation Controller for Basra Date Farms",
  preparedByAr: [
    "عبدالرحمن اياد عثمان",
    "عباس هادي مطرود",
    "علاء مهدي حمدان",
    "فهد طلال خليل",
    "محمد علي جواد"
  ],
  preparedByEn: [
    "Abdulrahman Ayad Othman",
    "Abbas Hadi Matroud",
    "Alaa Mahdi Hamdan",
    "Fahad Talal Khalil",
    "Mohammed Ali Jawad"
  ],
  supervisorAr: "د. أيمن م. إسماعيل",
  supervisorEn: "Dr. Ayman M. Ismaiel",
  year: "2026-2025"
};

export const MOOD_THEME = {
  primary: 'emerald',
  secondary: 'slate',
  accent: 'blue'
};

export const SYSTEM_COMPONENTS: ComponentSpec[] = [
  {
    id: 'esp32',
    nameAr: 'متحكم ESP32 الأساسي (3 قطع)',
    nameEn: 'ESP32 Microcontroller Core (3 Units)',
    category: 'controller',
    quantity: 3,
    specsAr: [
      'معالج ثنائي النواة Tensilica Xtensa 32-bit LX6 بتردد من 80 إلى 240 ميجاهرتز.',
      'ذاكرة SRAM داخلية بحجم 520 كيلوبايت وذاكرة فلاش خارجية سعة 4 ميجابايت.',
      'دعم الاتصال اللاسلكي المدمج Wi-Fi و BLE وبروتوكول الاتصال السريع ESP-NOW.',
      'جهد التشغيل 3.3 فولت (وينظم من خلال منظم AMS1117 LDO على اللوحة).'
    ],
    specsEn: [
      'Dual-core Tensilica Xtensa 32-bit LX6 processor running at 80 to 240 MHz.',
      'SRAM size: 520 KB; External SPI flash memory: 4 MB (non-volatile).',
      'Built-in Wi-Fi, Bluetooth BLE, and low-latency ESP-NOW wireless communication protocol.',
      'Operating voltage: 3.3V DC (integrated board AMS1117 LDO regulator).'
    ],
    originAr: 'تصميم شركة إكسبريسيف سيستمز (شانغهاي، الصين)، وتصنيع مسابك TSMC (تايوان).',
    originEn: 'Designed by Espressif Systems (Shanghai, China), Fabricated by TSMC (Taiwan) 40nm CMOS.',
    principleAr: 'يعمل كأدمغة النظام الموزع. يتم تقسيم العمل إلى ثلاث عقد (العقدة الرئيسية والمستشعرات والمشغلات)، ويتواصلون لاسلكياً عبر بروتوكول ESP-NOW لتقليل تداخل الإشارات والضوضاء الكهرومغناطيسية وتجنب انهيار النظام بنقطة فشل واحدة.',
    principleEn: 'Acts as the brain of the distributed system. It partitions operations across 3 independent nodes (Master, Sensors, Drivers) that communicate wirelessly via ESP-NOW, isolating high-current switching noise from sensitive inputs.',
    imagePlaceholder: 'esp32'
  },
  {
    id: 'tds_sensor',
    nameAr: 'حساس قياس ملوحة المياه التماثلي (1 قطعة)',
    nameEn: 'Analog TDS Salinity Sensor Module (1 Unit)',
    category: 'sensor',
    quantity: 1,
    specsAr: [
      'مدى قياس الملوحة: من 0 إلى 1000 جزء في المليون (ppm).',
      'دقة القياس: ±10% عند درجة حرارة 25 مئوية.',
      'أقطاب مغلفة بالتيتانيوم المقاوم للمواد الكيميائية لمنع القطبية وتأكسد الأقطاب.',
      'جهد تغذية تماثلي من 3.3 إلى 5.5 فولت.'
    ],
    specsEn: [
      'Measurement range: 0 to 1000 ppm (parts per million).',
      'Accuracy: ±10% Full Scale (at baseline temp of 25°C).',
      'Two waterproof aerospace-grade titanium metal pins on 1m cable.',
      'Operating input voltage: 3.3V to 5.5V DC.'
    ],
    originAr: 'تصميم وهندسة شركة DFRobot، تجميع مصانع شنغهاي، الصين.',
    originEn: 'Engineered by DFRobot Robotics Tech Co., manufactured in Shanghai, China.',
    principleAr: 'يقيس التوصيل الكهربائي (EC) للمحلول. لمنع تأكسد واستقطاب الأقطاب، تستخدم وحدة معالجة الإشارة جهد تيار متردد AC عالي التردد، ثم يمر عبر مضخم إشارة وترشيح قبل إرساله للعقدة الثانية عبر منفذ ADC1 (تجنباً للتداخل مع شبكة الواي فاي).',
    principleEn: 'Measures Electrical Conductivity (EC) of the water. To completely avoid electrolysis, polarization, and fouling, the transmitter uses AC high-frequency excitation across titanium probes, outputting an analog voltage mapped to ADC1.',
    imagePlaceholder: 'tds'
  },
  {
    id: 'soil_moisture',
    nameAr: 'مستشعر رطوبة التربة السعوي V1.2 (3 قطع)',
    nameEn: 'Capacitive Soil Moisture Probe V1.2 (3 Units)',
    category: 'sensor',
    quantity: 3,
    specsAr: [
      'تقنية القياس السعوية التي تمتاز بمقاومة التآكل والصدأ على المدى الطويل.',
      'رقاقة توقيت TLC555 LinCMOS عالية السرعة لإنشاء موجات التذبذب.',
      'مدى الخرج التماثلي: من 0.0 فولت (مشبع بالماء تماماً) إلى 3.0 فولت (جاف تماماً في الهواء).',
      'مصنوع من ورقة الألياف الزجاجية FR4 عالية الكثافة لحمايته من التربة.'
    ],
    specsEn: [
      'Capacitive measurement resistant to organic soil corrosion over long-term deployment.',
      'Employs a Texas Instruments TLC555 LinCMOS high-speed timer as astable oscillator.',
      'Output voltage range: 0.0V DC (fully saturated wet) to 3.0V DC (absolute dry in air).',
      'Built with standard FR4 double-sided glass fiber substrate with solder mask isolating the traces.'
    ],
    originAr: 'تصميم عتاد مفتوح المصدر ومصنع في شنجن، الصين.',
    originEn: 'Open-source hardware design refined and manufactured in Shenzhen, China.',
    principleAr: 'يشكل حقل تموج مغناطيسي حول التربة حيث تعمل رطوبتها كعازل كهربائي متغير يغير من سعة المكثف المتكون. تقوم رقاقة المؤقت بتحويل هذا التغير السعوي بتردد عالٍ إلى جهد مستمر متناسب طردياً، مما يعزل الإشارات الكهربائية عن الرطوبة المباشرة.',
    principleEn: 'Establishes a high-frequency electromagnetic field where soil acts as a dynamic dielectric medium. Changes in water content shift the dielectric constant between copper plates, resulting in frequency shifts converted to an analog voltage.',
    imagePlaceholder: 'soil'
  },
  {
    id: 'solenoid_valve',
    nameAr: 'صمام ماء كهربائي ملفي 12V تيار مستمر (3 قطع)',
    nameEn: 'Direct-Acting 12V NC Solenoid Water Valve (3 Units)',
    category: 'actuator',
    quantity: 3,
    specsAr: [
      'جهد التحكم: 12 فولت تيار مستمر، استهلاك تيار من 400 إلى 500 مللي أمبير.',
      'الوضعية الافتراضية: مغلق طبيعياً (Normally Closed) كأمان للحد من هدر المياه عند انقطاع الطاقة.',
      'مدى ضغط المياه: من 0.02 ميجا باسكال إلى 0.8 ميجا باسكال.',
      'قطر المداخل والمخارج: نصف بوصة (1/2" inch) مع وصلات خرطوم مسننة.'
    ],
    specsEn: [
      'Control voltage: 12V DC; continuous current draw: 400mA to 500mA.',
      'Solenoid state: Normally Closed (N/C) fail-safe action prevents flood during power outage.',
      'Fluid operating pressure: 0.02 MPa to 0.8 MPa (requires pressurized lines).',
      'Inlet/outlet ports: 1/2-inch outer diameter matching standard pipe hose barbs.'
    ],
    originAr: 'مصنع بواسطة مجمعات تصنيع عتاد السوائل في إقليم جيجيانغ، الصين.',
    originEn: 'Zhejiang, China industrial fluid-control clusters.',
    principleAr: 'يعتمد الصمام على قانون أمبير الكهرومغناطيسي. يحتوي الملف على سلك نحاسي ملفوف حول قلب حديدي متحرك (مكبس). عند تزويد الملف بالكهرباء بقوة 12 فولت، يتولد حقل مغناطيسي يسحب القلب للأعلى متغلباً على قوة النابض الميكانيكي مما يرفع لسان الغشاء المطاطي ويفتح مجرى المياه للتمرير.',
    principleEn: 'Utilizes an electromagnetic copper inductive coil surrounding a ferromagnetic plunger. When energized via a relay, the solid magnetic flux overcomes spring tension, pulling the plunger up, lifting the sealing membrane and allowing flow.',
    imagePlaceholder: 'solenoid'
  },
  {
    id: 'submersible_pump',
    nameAr: 'مضخة غاطسة هادئة 12V تيار مستمر (1 قطعة)',
    nameEn: 'Quiet DC 12V Submersible Liquid Pump TX10 (1 Unit)',
    category: 'actuator',
    quantity: 1,
    specsAr: [
      'نوع المحرك: محرك عديم المسفرات (Brushless BLDC - عمر أطول وتداخل أقل).',
      'معدل الضخ الأقصى: 240 لتر في الساعة.',
      'ارتفاع الدفع الهيدروليكي العمودي الأقصى: 3 أمتار كاملة.',
      'استهلاك الطاقة: 12 فولت وبقدرة 4.8 واط، مستوى ضجيج منخفض < 40 ديسيبل.'
    ],
    specsEn: [
      'BLDC Brushless motor with electronic commutation for high durability and zero sparking EMI.',
      'Flow rate: 240 L/H (Liters per Hour).',
      'Maximum vertical head lift: 3 meters (3M vertical capacity).',
      'Power specifications: 12V DC / 4.8W continuous power, quiet running < 40dB.'
    ],
    originAr: 'تم تصنيعه بواسطة مجمعات تصنيع المضخات الإلكتروميكانيكية المتخصصة في مقاطعة غوانغدونغ، الصين.',
    originEn: 'Guangdong, China specialized micro-pump electromagnetic fabricators.',
    principleAr: 'تتميز المضخة بالعزل المالي الكامل حيث يتم تشميع وصناعة الجزء الثابت (الملف الكهرومغناطيسي) بالإيبوكسي المقاوم لمرور السوائل لمنع تسريب الكهرباء تماماً، وتتحرك دوارة المغناطيس الدائم بشكل مغناطيسي بدون مسفرات كربونية مما يلغي تآكل الأجزاء.',
    principleEn: 'The electrical stator is hermetically sealed in epoxy resin, preventing chemical path contact. The rotor is magnetically coupled, avoiding any mechanical brushes or sparks (which prevents RF noise).',
    imagePlaceholder: 'pump'
  },
  {
    id: 'switching_ps',
    nameAr: 'مزود طاقة رئيسي 12V 10A 120W (1 قطعة)',
    nameEn: 'DC 12V 10A 120W Switching Power Supply SMPS (1 Unit)',
    category: 'power',
    quantity: 1,
    specsAr: [
      'جهد الدخل: من 100 إلى 240 فولت تيار متردد AC، بتردد 50/60 هرتز.',
      'جهد الخرج الموحد والمستمر: 12 فولت تيار مستمر DC وبأمبيرية قصوى تصل إلى 10 أمبير.',
      'كفاءة تشغيل ممتازة مع خصائص حماية من زيادة الحمل، الجهد، والالتماس الكهربائي.'
    ],
    specsEn: [
      'Input: 100V to 240V AC; 50/60Hz grid power support.',
      'Output: 12V DC stabilized industrial line, up to 10A current (120W Max).',
      'Integrated protection against overvoltage, overload short-circuits with passive metal thermal dissipate.'
    ],
    originAr: 'إنتاج شركة Mean Well العالمية وتجميع مصانع تايوان والصين.',
    originEn: 'Manufactured by Mean Well / industrial standard electronics cluster.',
    principleAr: 'يقوم الرأس المنظم للمحوّل بتقطيع جهد التيار المتردد المغذى من المنفذ المنزلي بتردد يفوق 150 كيلوهرتز، لتحويل الجهد المتردد المرتفع إلى مستمر منخفض وتنظيمه عبر حلقة تغذية راجعة لضمان تيار تيار تغذية ثابت للمضخات وصمامات الري والمنظمات الفرعية.',
    principleEn: 'Converts AC mains voltage (high) to 12V DC (low) with high-efficiency switching mechanism. Directs the steady 12V power rail down to solenoids, pumps, and step-buck inputs.',
    imagePlaceholder: 'power_supply'
  },
  {
    id: 'lm2596',
    nameAr: 'منظم غلق خافض الجهد LM2596 (4 قطع)',
    nameEn: 'LM2596 Step-Down Buck Regulator Module (4 Units)',
    category: 'power',
    quantity: 4,
    specsAr: [
      'مبدأ العمل: مخفض جهد مستمر نبضي (Step-Down Buck Switching-Mode Converter).',
      'مدى إدخال الجهد: من 5 إلى 35 فولت تيار مستمر.',
      'إمكانية التحكم في الجهد الخارج بدقة عبر مقاومة متغيرة (مقياس جهد مطلي بالنحاس) بين 1.25 إلى 30 فولت.',
      'التيار الخارج: 3 أمبير أقصى (ويفضل تعزيز التبريد بالخافض الحراري عند أكثر من 2 أمبير).'
    ],
    specsEn: [
      'DC-to-DC step-down buck converter using 150 kHz internal oscillator switching frequency.',
      'Input voltage window: 5V DC to 35V DC limits.',
      'Adjustable output via precision potentiometer (W103): output ranges down from 1.25V.',
      'Current rating: 3A Maximum output (requiring heat sinking if continuous draw exceed 2A).'
    ],
    originAr: 'براءة التصميم والرقاقة الأساسية لشركة Texas Instruments (الولايات المتحدة)، ومجمّعة في الصين.',
    originEn: 'Original IC patent by Texas Instruments (USA), assembled into standardized modules in China.',
    principleAr: 'بدلًا من إضاعة فروق الجهد وتحويلها لحرارة مهدرة من خلال المنظمات الخطية مثل 7805، تعمل هذه الشريحة على تقطيع الجهد النبضي بتردد 150 كيلوهرتز وتمريره مرشح سعوي ومحث نحاسي ينعم ويرسّخ جهدي تشغيل المتحكمات (3.3 فولت) والمرحلات والشاشات (5 فولت) بكفاءة تفوق 90%.',
    principleEn: 'Switches the 12V inputs on and off dynamically at 150kHz. Instead of wasting differential drop as thermal heat, the switching regulator stores magnetic energy in an inductor and capacitor smoothing net, outputting highly efficient 5V and 3.3V lines with >90% power efficiency.',
    imagePlaceholder: 'buck'
  },
  {
    id: 'relays_4ch',
    nameAr: 'وحدة مرحل عزل رباعية القنوات 12V (4 قطع)',
    nameEn: '4-Channel Isolated 12V Relay Board (4 Units)',
    category: 'actuator',
    quantity: 4,
    specsAr: [
      'الجهد المشغل للملف: 12 فولت تيار مستمر؛ استهلاك تيار تفعيل الملف: 5 مللي أمبير.',
      'تتحمل قدرة تحويل أحمال كهربائية تصل لـ 10 أمبير عند 250 فولت متردد أو 30 فولت مستمر.',
      'عزل كامل بفضل عوازل بصرية ضوئية PC817 (Optocouplers) مدمجة بكل قناة.',
      'آلية التفعيل: إشارة تفعيل منخفضة النشاط (Active-Low Control Signal).'
    ],
    specsEn: [
      'Operating coil voltage: 12V DC; trigger activation current is low (~5 mA).',
      'Load capacity: 10A at 250V AC / 10A at 30V DC (Vastly exceeding solenoid and pump currents).',
      'Isolation structure: Onboard active PC817 Optocouplers separating high/low logic paths.',
      'Trigger state: Active-Low (pulling the drive pin to ground activates the relay).'
    ],
    originAr: 'المرحل الأساسي من شركة Songle (الصين) والعوازل البصرية من شركة Sharp اليابانية، ومجمعة في الصين.',
    originEn: 'Relay core designed by Songle (China), Optocouplers engineered by Sharp (Japan).',
    principleAr: 'مفتاح مغناطيسي كهربائي. عند إرسال أمر تفعيل منخفض (LOW) من أطراف ESP32، يضيء الصمام الضوئي الداخلي للمانع الضوئي، فيستقبل الترانزستور الضوئي الحقل المولد ويوصل الدائرة لتشغيل مغناطيس المرحل الكهربائي، مما يجذب ذراع التوصيل من الوضع الطبيعي المفتوح (NO) للمغلق دون أي اتصال مادي للكهرباء مع المتحكم.',
    principleEn: 'Electromechanical switches. When the ESP32 drives the input LOW, the internal optocoupler LED turns on and activates a phototransistor. This safely energizes the inductive coil of the relay block and physically pulls the copper contact without electric link between logic and actuator lines.',
    imagePlaceholder: 'relay_board'
  },
  {
    id: 'dht22',
    nameAr: 'حساس الرطوبة والحرارة الرقمي DHT22 (1 قطعة)',
    nameEn: 'DHT22 Digital Humidity & Temperature Sensor (1 Unit)',
    category: 'sensor',
    quantity: 1,
    specsAr: [
      'مدى رطوبة الجو: 0-100% نسبة رطوبة تفاوت دقة ±2%.',
      'مدى قياس الحرارة: -40 إلى +80 درجة مئوية بتفاوت دقة ±0.5 مئوية.',
      'يتطلب زمن لا يقل عن ثانيتين بين القراءات المتتالية (Data sampling rate: 0.5Hz).',
      'واجهة اتصال بسلك مركب منفرد (Single-wire proprietary digital bus) المقاوم للتدهور.'
    ],
    specsEn: [
      'Humidity spectrum: 0% to 100% RH; accuracy limit: ±2% RH.',
      'Temperature range: -40 to +80°C; accuracy limit: ±0.5°C.',
      'Minimum reading period: 2.0 seconds between sequential samples.',
      'Data interface: proprietary single-wire digital bus requiring 4.7k ohm external pullup resistor.'
    ],
    originAr: 'تصميم وصناعة شركة Aosong Electronics (غوانزو، الصين).',
    originEn: 'Exclusively engineered and manufactured by Aosong Electronics Co., Ltd. (Guangzhou, China).',
    principleAr: 'يحتوي على رقاقة معالجة 8-بت مدمجة قوية ومستشعر تماثلي سعوي للرطوبة ومقاوم حراري NTC. تقوم الرقاقة المدمجة بقراءة القيم الميكانيكية للبيئة وتحولها لبيانات خطية مبرمجة ترسل عبر خيط اتصال رقمي معالج بطول 40 بت إلى منفذ ESP32 مباشر للحد من أي تشويش للإشارت.',
    principleEn: 'Utilizes a polymer capacitive substrate for moisture and an NTC thermistor. An onboard 8-bit microcontroller handles calibrations and outputs a robust 40-bit digital frame via a single wire, eliminating analog drift.',
    imagePlaceholder: 'dht22'
  },
  {
    id: 'rain_sensor',
    nameAr: 'حساس استشعار هطول المطر التماثلي (1 قطعة)',
    nameEn: 'Rain Water Level / Surface Droplet Sensor (1 Unit)',
    category: 'sensor',
    quantity: 1,
    specsAr: [
      'مساحة الكشف النحاسية: 40 × 16 مم مطلية بالنيكل ومقواة لمقاومة الأكسدة والبلل.',
      'توفير مخرجين: تماثلي لقيمة الجهد الخطي، ورقمي للمقارنة عبر مقارن LM393 المدمج.',
      'تيار استهلاك الحساس: أقل من 15 مللي أمبير عند تزويده بـ 3.3 إلى 5 فولت.'
    ],
    specsEn: [
      'Sensing surface field: 40mm x 16mm nickel/immersion gold plated to resist long-term oxidation.',
      'Dual output: Outputs analog voltage (AO) and digital threshold alarm (DO).',
      'Operating current draw: < 15 mA; operates on 3.3V to 5V absolute supply.'
    ],
    originAr: 'عتاد قياسي ومصنع في مجمعات تصنيع المكونات الإلكترونية بإقليم غوانغدونغ، الصين.',
    originEn: 'Generic open-source schematic standard, assembled in Guangdong, China industrial facilities.',
    principleAr: 'يعمل المستشعر كجسر تقسيم جهد متغير المقاومة. يضمن جفاف اللوحة مقاومة لولبية لا نهائية بين مسارات النحاس المتداخلة. عند التفاف قطرات مياه المطر (المشبعة بأيونات الجو) عليها، يتم توصيل هذه المقاومة ويهبط جهد الإشارة تدريجيًا نحو 0 فولت فيتم رصده لتفعيل إغلاق صمام الري الطارئ لمنع إغراق الجذور.',
    principleEn: 'Operates as a variable resistive voltage divider. Dry state offers near-infinite resistance. Raindrops behavior acts as ionic conducting bridge across interleaving copper tracks, lowering overall resistance to output proportional drop towards 0V.',
    imagePlaceholder: 'rain'
  },
  {
    id: 'ds18b20',
    nameAr: 'حساس حرارة السوائل الرقمي العازل DS18B20 (1 قطعة)',
    nameEn: 'DS18B20 Waterproof Thermal Probe with Signal Adapter (1 Unit)',
    category: 'sensor',
    quantity: 1,
    specsAr: [
      'عزل كامل بفضل غطائه المصنوع من الفولاذ المقاوم للصدأ البحري 316 بقطر 6 × 50 مم.',
      'بروتوكول تواصل متطور ذو خط واحد 1-Wire الخاص بشركة دالاس و مكسيم.',
      'دقة تماثلية مدمجة قابلة للتعديل برمجياً بين 9 إلى 12 بت بنطاق دقة ±0.5 مئوية.',
      'عنوان تعريفي فريد ROM بحجم 64 بت مبرمج ليزريًا في كل متحكم مستقل.'
    ],
    specsEn: [
      'IP68 absolute hermetic waterproof grading via 6mm x 50mm marine-grade 316 stainless steel probe cap.',
      'Protocol: Dedicated 1-Wire serial bus master-slave digital protocol.',
      'Programmable resolution from 9 to 12 bits; precision accuracy margin is ±0.5°C.',
      'Hardware address: Every sensor contains factory-laser-etched absolute, unique 64-bit ROM ID.'
    ],
    originAr: 'براءة تصميم وتصميم الشريحة لشركة Dallas Semiconductor / Maxim Integrated (الولايات المتحدة)، ومغلفة في الصين.',
    originEn: 'Designed/Patented by Dallas Semiconductor / Maxim Integrated (USA), packaged and encapsulated in China.',
    principleAr: 'يقيس درجة الحرارة تحت التربة أو في وعاء خلط وري المياه بدقة. يتولى الحساس قراءة الحرارة رقمياً في بيئة محصنة وتحويلها إلى بيانات عبر سلك ومقاومة رفع 4.7K. يتيح عنوانه الفريد ربط حساسات متعددة على قناة نقل رقمية واحدة دون تعارض أو تشويش.',
    principleEn: 'Utilizes internal silicon direct-to-digital bandgap semiconductor core. Communicates on Maxim Integrated 1-Wire serial bus, allowing multiple probes multiplexed onto a single, shared digital GPIO pin.',
    imagePlaceholder: 'ds18b20'
  },
  {
    id: 'multimeter',
    nameAr: 'جهاز الأفوميتر / ملتيميتر رقمي معملي (1 قطعة)',
    nameEn: 'Handheld Digital Multimeter / Voltmeter (1 Unit)',
    category: 'tool',
    quantity: 1,
    specsAr: [
      'جهاز قياس كهربائي متعدد رقمي عالي الدقة مزود بمدى قياس تلقائي ومقاومة إدخال 10MΩ.',
      'يقيس الجهد المستمر DC حتى 1000 فولت والجهد المتردد AC حتى 750 فولت بدقة تبلغ ±0.5%.',
      'يقيس المقاومة والسعة واختبار التوصيلية المباشرة بصوت تنبيه جهير (Continuity buzzer).',
      'حماية مدمجة مزدوجة من زيادة الحمل عبر صمامات سيراميكية معيارية F400mA/250V.'
    ],
    specsEn: [
      'High-precision digital multimeter with auto-ranging and 10 Megohm input impedance.',
      'Measures DC voltage up to 1000V and AC voltage up to 750V with ±0.5% basic accuracy.',
      'Features diagnostic modes: resistance, capacitance, diode testing, and audible continuity.',
      'Double insulation safety class CAT III 600V with ceramic fuse overload protections.'
    ],
    originAr: 'تصميم فلوك كوربوريشن (ولاية واشنطن، الولايات المتحدة)، ومجمّعة في فروعهم الإقليمية.',
    originEn: 'Designed by Fluke Corporation (Washington, USA), manufactured to strict laboratory grades.',
    principleAr: 'يعمل بجسر مقاوم ومحوّل تماثلي-رقمي (ADC) ذو دقة عالية لتحويل الجهود والتيارات الضعيفة إلى أرقام عشرية دقيقة. يُستخدم لتأكيد خطوط الـ 5V و 3.3V الخارجة من منظمات LM2596 وتتبع الأرضي المشترك وتصحيح التوصيلات المفتوحة قبل تزويد الدوائر الحساسة بالطاقة.',
    principleEn: 'Utilizes a dual-slope integration analog-to-digital converter paired with a high-resistance divisor. Used to verify stable 5V & 3.3V rails from LM2596 buck converters, confirm common ground continuity, and trace potential open-circuits prior to hot testing.',
    imagePlaceholder: 'multimeter'
  },
  {
    id: 'soldering_iron',
    nameAr: 'كاوية لحام قصدير رقمية ذكية قابلة للضبط (1 قطعة)',
    nameEn: 'Intelligent Digital Soldering Iron TS101 (1 Unit)',
    category: 'tool',
    quantity: 1,
    specsAr: [
      'عنصر تسخين داخلي سيراميكي بقدرة 65 واط وفتحة إدخال تيار USB-C / DC5525.',
      'شاشة OLED رقمية مدمجة لعرض دقيق وبث حي لدرجة الحرارة من 100 إلى 400 درجة مئوية.',
      'نظام حماية وسكون تلقائي مبرمج لحفظ الطاقة الكهروميكانيكية وزيادة عمر الرأس المعدني.',
      'مقاومة التسريب الأرضي متناهية الصغر مع عزل كهربائي كامل لمنع التيارات العشوائية.'
    ],
    specsEn: [
      'Internal ceramic-core heating element rated at 65W with dual USB-PD and DC5525 power inputs.',
      'Integrated OLED screen mapping micro-controller parameters and live temperatures (100°C - 400°C).',
      'Smart firmware supporting automated standby, drop protection, and dynamic offset calibrations.',
      'Zero ground leak resistance protecting sensitive ESD MOS structures on the ESP32 during assembly.'
    ],
    originAr: 'تصميم شركة ميني واير (شينزين، الصين) وهي منصة عتاد مفتوح لمحترفي المعامل هندسياً.',
    originEn: 'Designed by Miniware Corp, built with high thermal efficiency and modular soldering tips.',
    principleAr: 'تستخدم حلقة تحكم مغلقة بنظام التناسب والتكامل والتفاضل (PID) مدمج بالرقاقة الداخلية لتنظيم نبضات الحرارة بسرعة ممتازة. تُستخدم لتثبيت دبابيس المتحكمات والملفات اللولبية وديودات الحماية 1N5408 وتثبيت المقاومات بأسلاك التوصيل.',
    principleEn: 'Employs an onboard PID closed-loop control microcontroller reading an internal thermocouple to dynamically adjust PWM power. This maintains stable tip temperature for soldering header pins on ESP32, flyback diodes, and pullup resistors.',
    imagePlaceholder: 'soldering_iron'
  },
  {
    id: 'wire_stripper',
    nameAr: 'أداة تقشير وقطع الأسلاك والكابلات الدقيقة (1 قطعة)',
    nameEn: 'Precision Wire Stripper & Shear Cutter (1 Unit)',
    category: 'tool',
    quantity: 1,
    specsAr: [
      'مصنوعة من الفولاذ الطرقي عالي الكربون المعالج بالحرارة ومغلفة بالوقاية للصدأ.',
      'ثقوب تقشير دقيقة ومصححة لمعايير AWG من 10 إلى 22 (بين 0.6 و 2.6 مم).',
      'مقبض مريح ثنائي المكونات غير قابل للانزلاق يوفر تحكماً فائقاً بالضغط الميكانيكي.',
      'زنبرك ميكانيكي داخلي لإرجاع المقبض تلقائياً لتسهيل عمليات قطع الأسلاك المتكررة حركياً.'
    ],
    specsEn: [
      'Forged from heavy-duty high-carbon tool steel with heat treatment for clean cuts.',
      'Precision wire-stripping holes matching AWG 10-22 standards (0.6mm to 2.6mm core wires).',
      'Ergonomic dual-density non-slip grips for secure control of mechanical shear leverage.',
      'Integrated return spring for low-fatigue operations during continuous field harness stripping.'
    ],
    originAr: 'هندسة شركة كيستون لتصنيع العتاد والتجميع اليدوي التخصصي، البصرة / شينزين.',
    originEn: 'Engineered by certified hardware tool clusters, designed for laboratory-grade cabling.',
    principleAr: 'تعتمد على الشحذ الليزري للثقوب المتدرجة لتقشير النسيج البلاستيكي الخارجي دون جرح أو كشط الأسلاك النحاسية الداخلية. تُستخدم لتجهيز كابلات الحساسات وتوصيل صمامات الري 12V وسلك الإشارة ذو القلب الكبلي.',
    principleEn: 'Utilizes laser-ground concentric stripping apertures sized to selectively pierce polymeric insulation without scoring or damaging the fragile copper wire strands beneath. Essential for cabling sub-nodes, solenoids, & power harnesses.',
    imagePlaceholder: 'wire_stripper'
  },
  {
    id: 'oscilloscope',
    nameAr: 'راسم إشارات رقمي محمول ثنائي القنوات (1 قطعة)',
    nameEn: 'Dual-Channel Portable Digital Oscilloscope (1 Unit)',
    category: 'tool',
    quantity: 1,
    specsAr: [
      'عرض شبكة النطاق الموجي الترددي: 100 ميجاهرتز ومعدل أخذ عينات حقيقي 1GSa/s لكل قناة.',
      'شاشة ملونة عالية الدقة LCD لعرض ترددات إشارات الاتصال اللاسلكي ونبضات التفعيل.',
      'ذاكرة عميقة لتخزين الأشكال الموجية وحفظ لقطات عابرة الجهد للـ Transients والـ Spikes.',
      'حوامل ومجسات معزولة ومرنة CAT II 300V مزودة بخاصية التعويض الترددي X1/X10.'
    ],
    specsEn: [
      'Analog Bandwidth: 100 MHz with real-time acquisition digitizer rate of 1 GSa/s over two paths.',
      'Color high-resolution screen visualizing high-speed SPI/I2C signals and RF pulse intervals.',
      'Deep acquisition memory capturing microsecond system transients and dynamic coil flyback spikes.',
      'Includes balanced standard dual 100MHz 1X/10X attenuation probes rated for secure high-frequency tracking.'
    ],
    originAr: 'تصميم شركة ريجول للتقنيات والقياسات الفيزيائية المعقدة المعتمدة لدى كليات الهندسة.',
    originEn: 'Manufactured by Rigol Technologies/Siglent core lab measuring assemblies.',
    principleAr: 'يقوم بتحويل الموجات الكهربائية المستمرة في الزمن إلى صور مرئية سريعة التحديث عبر دوائر معارضة ومحوّل ADC خارق ومصفوفة عتادية FPGA. تم استخدامه بالتجارب لفحص ورصد إشارات اتصالات ESP-NOW اللاسلكية وتأكيد خلو خطوط الحساسات من شوشرة محركات المضخات الكهربائية.',
    principleEn: 'Digitizes raw analog voltage waveforms using high-speed flash ADCs and reconstructs live signals onto an FPGA graphics engine. Critical during research development to track 2.4GHz RF pulse timing and diagnose solenoid switching EMI.',
    imagePlaceholder: 'oscilloscope'
  },
  {
    id: 'calibration_meter',
    nameAr: 'مقياس معايرة السوائل والملوحة المخبرية القياسي (1 قطعة)',
    nameEn: 'Benchtop Precision Salinity & EC Reference Calibrator (1 Unit)',
    category: 'tool',
    quantity: 1,
    specsAr: [
      'مدى دقيق ومعياري لتوصيل الكهرباء والسوائل: 0.1µS/cm إلى 200mS/cm بدقة تفوق ±1%.',
      'حساس حرارة بلاتيني تعويضي مدمج عالي المعايرة بدرجات الحرارة.',
      'يدعم معايرة تلقائية خماسية النقاط للمحاليل القياسية (500, 1413, 12880 ppm).',
      'هيكل معزول وقوي مضاد للانسكاب ومستقل الطاقة لتوفير غطاء حماية معملي.'
    ],
    specsEn: [
      'Ultra-precise Electrical Conductivity range: 0.1 µS/cm to 200 mS/cm with ±1% full scale resolution.',
      'Onboard platinum RTD sensor ensuring direct automated temperature compensation (ATC) reference.',
      'Supports automated 5-point calibration matrices for analytical lab chemicals (such as NaCl standards).',
      'Waterproof IP57 benchtop station with integrated storage memories for multi-sample validation.'
    ],
    originAr: 'صناعة معامل هانا للآلات والمعدات التحليلية الكيميائية، المعتمدة أكاديمياً.',
    originEn: 'Engineered by Hanna Instruments Corporation (Woonsocket, Rhode Island, USA).',
    principleAr: 'يوفر قراءات تحليلية معملية مرجعية خالية من الأخطاء عبر خلية تيار متناوب رباعية الحلقات. يُسخدم لإنشاء وتحضير عينات المحاليل الملحية القياسية المتدرجة المستخدمة في معايرة ومعادلة حساس الملوحة التماثلي ومقارنة الخرج الفعلي بنظام جامعة المعقل لضمان الدقة وتفادي الأخطاء الكلية.',
    principleEn: 'Utilizes a 4-ring potentiometric conductivity cell setup to determine absolute EC without polarization. Used to formulate reliable brine control samples (e.g. 500ppm, 1000ppm, 2000ppm) for calibrating Node 2’s analog TDS sensor.',
    imagePlaceholder: 'calibration_meter'
  }
];

export const SYSTEM_NODES: NodeData[] = [
  {
    id: 'node1',
    nameAr: 'العقدة الأولى: وحدة التنسيق والتحكم الرئيسية والشاشة',
    nameEn: 'Node 1: Central Coordination Hub & Human-Machine Interface (HMI)',
    descriptionAr: 'تعمل كقلب إداري مركزي للنظام بأكمله لمراقبة الأزمنة والعوامل الجوية وعرض المؤشرات.',
    descriptionEn: 'Acts as the administrative and temporal supervisor for the entire network. Installed in a weather-proof chassis.',
    roleAr: 'تحسب أوقات الري الموسمية المناسبة (المساء والصباح الباكر لتقليل التبخر) عبر الاتصال بمنظّم الساعة الدقيقة DS3231 وتقوم بنشر واجهة القراءة على شاشة LCD 20x4 وتتبع الهواء وحرارته عبر حساس DHT22.',
    roleEn: 'Calculates optimal seasonal irrigation schedules via DS3231 Chrono RTC, drives the 20x4 alphanumeric LCD via PCF8574 backpack, and queries the DHT22 climate sensor to evaluate atmospheric evapotranspiration risk.',
    gpioPins: [
      { pin: 'GPIO 21', targetAr: 'خط البيانات المسلسل لشاشة LCD ومنظم الساعة', targetEn: 'SDA (Serial Data Line) split to LCD Backpack & DS3231 RTC', protocol: 'I2C (Shared Bus)' },
      { pin: 'GPIO 22', targetAr: 'خط النبضات المسلسل لشاشة LCD ومنظم الساعة', targetEn: 'SCL (Serial Clock Line) split to LCD Backpack & DS3231 RTC', protocol: 'I2C (Shared Bus)' },
      { pin: 'GPIO 4', targetAr: 'ربط بيانات حساس DHT22 الجوي (مقاومة سحب 4.7k)', targetEn: 'DHT22 Data Line with physical 4.7k ohm pullup', protocol: 'Digital 1-Wire' },
      { pin: 'GPIO 12', targetAr: 'خارج التحكم المباشر بمروحة تبريد الصندوق الرئيسية', targetEn: 'Chassis exhaust cooling fan relay trigger', protocol: 'Digital output (Active Low)' }
    ]
  },
  {
    id: 'node2',
    nameAr: 'العقدة الثانية: وحدة استشعار وجمع قراءات التربة والملوحة',
    nameEn: 'Node 2: Low-Voltage Isolated Telemetry Data Acquisition Hub',
    descriptionAr: 'تتمركز في الحقل الزراعي ومهمتها قراءة متغيرات التربة لضمان عزل الإشارات بعيداً عن أية مشغلات ضوضاء.',
    descriptionEn: 'Located out in the field adjacent to date palms to gather rhizosphere inputs without wiring losses.',
    roleAr: 'هذه العقدة حساسة جداً وتقوم بقراءة 3 حساسات رطوبة وتماثلي الملوحة TDS وحساس المطر عبر قنوات وحدة ADC1 تحديداً لتجنب غلق القراءة المرافقة لوحدة ADC2 عند إرسال وإستقبال بيانات شبكة ESP-NOW لضمان الموثوقية.',
    roleEn: 'Gathers inputs from 3x soil moisture probes, 1x analog TDS salinity probe, and 1x raindrop plate. All analog pipelines are strictly isolated onto ADC1 (GPIOs 32-36) because ADC2 pins are disabled when ESP-NOW wireless transmitter fires packets, avoiding calibration corruption.',
    gpioPins: [
      { pin: 'GPIO 32', targetAr: 'قراءة رطوبة التربة للمنطقة الأولى (حساس سعوي 1)', targetEn: 'Soil Moisture Capacitive Sensor Zone 1', protocol: 'Analog Input (ADC1_CH4)' },
      { pin: 'GPIO 33', targetAr: 'قراءة رطوبة التربة للمنطقة الثانية (حساس سعوي 2)', targetEn: 'Soil Moisture Capacitive Sensor Zone 2', protocol: 'Analog Input (ADC1_CH5)' },
      { pin: 'GPIO 34', targetAr: 'قراءة رطوبة التربة للمنطقة الثالثة (حساس سعوي 3)', targetEn: 'Soil Moisture Capacitive Sensor Zone 3', protocol: 'Analog Input (ADC1_CH6)' },
      { pin: 'GPIO 35', targetAr: 'إدخال جهد ملوحة المياه التماثلي للأقطاب المترددة TDS', targetEn: 'Analog TDS Salinity Sensor output signal', protocol: 'Analog Input (ADC1_CH7)' },
      { pin: 'GPIO 36', targetAr: 'قراءة تماثلية من لوحة كشف هطول المياه والمطر', targetEn: 'Precipitator Rain Sensor plate analog signal', protocol: 'Analog Input (ADC1_CH0)' },
      { pin: 'GPIO 15', targetAr: 'تلقي قراءة درجة حرارة الجذور المائية عبر حساس DS18B20', targetEn: 'DS18B20 waterproof thermal probe 1-Wire line', protocol: 'Digital 1-Wire' }
    ]
  },
  {
    id: 'node3',
    nameAr: 'العقدة الثالثة: وحدة تفعيل الري وتشغيل المشغلات',
    nameEn: 'Node 3: High-Current Power Execution & Actuator Driver Node',
    descriptionAr: 'الوحدة المسؤولة عن التشغيل الميكانيكي للمضخة وصمامات التحكم الموزعة لكل نطاق ري.',
    descriptionEn: 'The muscle of the distributed architecture, controlling high-load electromechanical pumps and solenoids.',
    roleAr: 'تستقبل الأوامر الرقمية لاسلكياً من العقدة الأولى عبر بروتوكول ESP-NOW وتتحكم ميكانيكياً بالمرحلات المعزولة ضوئياً PC817 لتشغيل مضخة المياه 12V والصمامات الثلاثة، وتحتوي ديودات 1N5408 لتصريف نبضات عودة المحركات الذاتية المرتدة لحماية العقدة.',
    roleEn: 'Receives wireless actuation commands from Node 1 via ESP-NOW, utilizing isolated optocoupled relays to toggle a 12V Brushless Pump and 3 zone-routing water solenoids. Driven by isolated power sub-grids protected by 1N5408 flyback clamping diodes.',
    gpioPins: [
      { pin: 'GPIO 13', targetAr: 'قناة تحكم بمرحل تشغيل مضخة المياه الغاطسة 12 فولت', targetEn: 'Submersible water pump 12V Relay Channel', protocol: 'Digital Output (Active Low)' },
      { pin: 'GPIO 14', targetAr: 'قناة تفعيل صمام الري الكهربائي للمنطقة الأولى', targetEn: 'Zone 1 Solenoid Valve 12V Relay Channel', protocol: 'Digital Output (Active Low)' },
      { pin: 'GPIO 27', targetAr: 'قناة تفعيل صمام الري الكهربائي للمنطقة الثانية', targetEn: 'Zone 2 Solenoid Valve 12V Relay Channel', protocol: 'Digital Output (Active Low)' },
      { pin: 'GPIO 12', targetAr: 'قناة تفعيل صمام الري الكهربائي للمنطقة الثالثة', targetEn: 'Zone 3 Solenoid Valve 12V Relay Channel', protocol: 'Digital Output (Active Low)' },
      { pin: 'GPIO 19', targetAr: 'قناة المرحل الإضافي لتشغيل مروحة التهوية السفلية 2', targetEn: 'Auxiliary chassis exhaust fan 2 relay', protocol: 'Digital Output (Active Low)' }
    ]
  }
];



export const WIRING_DIAGRAM_CONNECTIONS = [
  // Node 1: Master
  { id: 'n1-c1', from: 'ESP32 (Node 1)', to: 'LCD 20x4 Screen', pin: 'GPIO 21 (SDA) / GPIO 22 (SCL)', color: '#10B981', labelAr: 'خط المشرف I2C المشترك', labelEn: 'Shared I2C SDA/SCL lines', descAr: 'ربط شاشة عرض المعلومات الرقمية I2C بنفس المسار مع وحدة التوقيت.', descEn: 'Shares character feed seamlessly with the LCD expander.' },
  { id: 'n1-c2', from: 'ESP32 (Node 1)', to: 'DS3231 Chrono RTC', pin: 'GPIO 21 (SDA) / GPIO 22 (SCL)', color: '#3B82F6', labelAr: 'خط التوقيت الدقيق I2C', labelEn: 'Shared I2C Clock Bus', descAr: 'يضمن تتبع دقيق لزمن الري الحقيقي لمنع ري النخيل في فترات التبخر القصوى.', descEn: 'Maintains exact calendar scheduling and low-drift timestamp feeds.' },
  { id: 'n1-c3', from: 'ESP32 (Node 1)', to: 'DHT22 Climate Sensor', pin: 'GPIO 4', color: '#F59E0B', labelAr: 'سلك قراءة الرطوبة والحرارة جوياً', labelEn: 'DHT22 Digital Communication Line', descAr: 'يتلقى الإطارات الرقمية المحدثة للطقس مع مقاومة رفع خارجية 4.7K كبل حماية.', descEn: 'Streams accurate environmental humidity and temperature data.' },
  { id: 'n1-c4', from: 'ESP32 (Node 1)', to: 'Cooling Chassis Fan 1', pin: 'GPIO 12', color: '#EF4444', labelAr: 'خط التحكم بمروحة عزل الصندوق', labelEn: 'Exhaust Fan Relay Command', descAr: 'يقوم بتدوير وتخفيف سخونة الصندوق المغلق بالطقس الخارجي الشديد.', descEn: 'Triggers the cooling fan 1 channel when temperatures breach safe bounds.' },

  // Node 2: Sensors
  { id: 'n2-c1', from: 'ESP32 (Node 2)', to: 'Capacitive Moisture Sensor 1', pin: 'GPIO 32 (ADC1_CH4)', color: '#84CC16', labelAr: 'قناة الرطوبة الأولى (المنطقة 1)', labelEn: 'Capacitive probe 1 pipeline', descAr: 'قراءة الرطوبة التماثلية لمنطقة رصف النخيل الأولى.', descEn: 'Analog signal mapped exclusively below 3.0V back on secure ADC1.' },
  { id: 'n2-c2', from: 'ESP32 (Node 2)', to: 'Capacitive Moisture Sensor 2', pin: 'GPIO 33 (ADC1_CH5)', color: '#10B981', labelAr: 'قناة الرطوبة الثانية (المنطقة 2)', labelEn: 'Capacitive probe 2 pipeline', descAr: 'قراءة الرطوبة التماثلية لمنطقة رصف النخيل الثانية.', descEn: 'Analog input for soil volumetric water content calculation.' },
  { id: 'n2-c3', from: 'ESP32 (Node 2)', to: 'Capacitive Moisture Sensor 3', pin: 'GPIO 34 (ADC1_CH6)', color: '#06B6D4', labelAr: 'قناة الرطوبة الثالثة (المنطقة 3)', labelEn: 'Capacitive probe 3 pipeline', descAr: 'قراءة الرطوبة التماثلية لمنطقة رصف النخيل الثالثة.', descEn: 'Analyzes third node zone for high accuracy farming irrigation.' },
  { id: 'n2-c4', from: 'ESP32 (Node 2)', to: 'Analog TDS Salinity Sensor', pin: 'GPIO 35 (ADC1_CH7)', color: '#6366F1', labelAr: 'خط الملوحة وتجمع المياه العذب', labelEn: 'Analog salinity voltage scale', descAr: 'مستشعر قياس نسبة ملووحة مزارع البصرة لتعويض الصدمات الاسموزية للايونات بالمياه.', descEn: 'Reports salt levels as raw voltage corrected by subsurface temperature inputs.' },
  { id: 'n2-c5', from: 'ESP32 (Node 2)', to: 'Rain Surface Sensor', pin: 'GPIO 36 (ADC1_CH0)', color: '#EC4899', labelAr: 'قناة كشف ورصد هطول الأمطار', labelEn: 'Resistive rain sensor path', descAr: 'يقوم بنقل هبوط تيار الجسر النحاسي لمعرفة سقوط الأمطار ووقف صمامات العقدة 3 طارئاً.', descEn: 'Streams droplet levels to trigger rain cutoff state directly over ESP-NOW.' },
  { id: 'n2-c6', from: 'ESP32 (Node 2)', to: 'Waterproof DS18B20 Temp Probe', pin: 'GPIO 15', color: '#D946EF', labelAr: 'خادم تتبع حرارة المياه العازل', labelEn: 'Waterproof thermal digital logic', descAr: 'توصيل سلك الحساس بمقاومة شد 4.7K للايبوكسي لتحديد درجة حرارة الخلط لتصحيح ملوحة الـ TDS.', descEn: 'Translates temperature metrics to calculate accurate salinity payloads.' }
];

export const STEP_BY_STEP_GUIDE = [
  {
    step: 1,
    titleAr: "التحضير وهيكلة العقد الموزعة للري",
    titleEn: "Step 1: Preparation & Decentralized Node Setup",
    descriptionAr: "تنظيم جميع المكونات وتثبيت المتحكمات الثلاثة على اللوحات التعريفية مع عزل الطاقة لضمان الموثوقية.",
    descriptionEn: "Organize the 3x ESP32 cores and prepare the Screw Terminal Breakout Adapter boards. Partition the project into three clear physical blocks: Coordination (Node 1), Sensing (Node 2), and Driver/Muscle (Node 3).",
    tipsAr: [
      "قم بإلصاق وتسمية كل متحكم ESP32 باسم العقدة المخصصة له لتجنب خلط الأسلاك.",
      "العقدة الأولى للاشراف والشاشة، الثانية للحساسات وتلقي البيانات، والثالثة لتلقي الاوامر والمرحلات."
    ],
    tipsEn: [
      "Label each ESP32 board (Master, Sensors, Relays) to eliminate debugging wire errors.",
      "Keep heavy inductive actuators strictly isolated near Node 3 with independent ground loops."
    ]
  },
  {
    step: 2,
    titleAr: "بناء منظم الطّاقة الخافض LM2596 وتغذيها",
    titleEn: "Step 2: Voltage Regulation & Power Matrix Assembly",
    descriptionAr: "خفض وتثبيت الجهد الرئيسي المغذى من الـ SMPS بقوة 12V إلى مستويين آمنين (5V للمرحلات والشاشات، و3.3V للمتحكمات).",
    descriptionEn: "Configure the 4x LM2596 step-down modules. Connect the 12V DC Switching Power Supply (SMPS) to the inputs. Adjust the precision potentiometers using a voltmeter to deliver steady 5.0V and 3.3V rails.",
    tipsAr: [
      "اضبط منظمات الجهد قبل ربطها بالمتحكمات الحساسة لتفادي حرق المنافذ بالجهد المرتفع.",
      "تتطلب المرحلات والشاشات طاقة مستقلة 5V، بينما تعمل دوائر الملوحة ومتحكم ESP32 بجهد 3.3V آمن ونظيف."
    ],
    tipsEn: [
      "Double-check output voltages with a digital multimeter BEFORE connecting to any ESP32 pin.",
      "Ensure proper ventilation. The LM2596 modules switch at 150kHz efficiently, but high relay currents generate heat."
    ]
  },
  {
    step: 3,
    titleAr: "توصيل شبكة أجهزة الاستشعار بحماية الـ ADC",
    titleEn: "Step 3: Secure Sensor Assembly (GPIO Isolations on Node 2)",
    descriptionAr: "ربط المجسات الحساسة (الرطوبة، الملوحة، المطر، والحرارة) على العقدة الثانية وتأمين عوازلها الكهرومغناطيسية.",
    descriptionEn: "Connect the 3x Capacitive moisture probes, the Analog TDS module, and the Rain sensor strictly onto ADC1 pins (GPIO 32 to 36) of your second ESP32. Wire the digital DS18B20 temp probe to GPIO 15 with a 4.7k ohm resistor.",
    tipsAr: [
      "لا تقم بربط أي مجس استشعاري بتماثلي على مخارج ADC2 لأن بث راديو ESP-NOW اللاسلكي سيفسد القراءة تماماً.",
      "استخدم كربونات التيتانيوم بحساس الملوحة لضمان متانة الأقطاب مع مياه ري تمور البصرة شديدة الملوحة."
    ],
    tipsEn: [
      "Do NOT use any ADC2 pins. Standard radio transactions from ESP-NOW disable ADC2, leading to corrupted data registers.",
      "Secure the waterproof DS18B20 probe near the reservoir mixer using its 316 stainless steel probe shell."
    ]
  },
  {
    step: 4,
    titleAr: "تركيب العوازل الكهرومغناطيسية وحماية ذروة المرحلات",
    titleEn: "Step 4: Actuator & Driver Suppression Configuration (Node 3)",
    descriptionAr: "عزل قمر التحكم والري الميكانيكي لحفظ القطع الحساسة عبر العزل البصري للـ PC817 وديودات قمع الضربات 1N5408.",
    descriptionEn: "Assemble the 4-Channel and 1-Channel relay modules driven by ESP32 Node 3. Solder the 1N5408 protective flyback rectifier diodes across the water pump and Zone Solenoids in a reverse-biased parallel fashion. Join the 3300uF smoothing capacitor across the primary 12V bus.",
    tipsAr: [
      "ركب ديود الحماية 1N5408 بالاتجاه المعاكس لتشكيل حلقة مقاومة تسحب الارتداد الناتج عن الصمامات الكهرومغناطيسية عند الغلق.",
      "يتحكم عازل PC817 بتفعيل المرحلات كهربائياً بالضوء دون اتصال مباشر بالنحاس لحفظ سلامة الـ ESP32."
    ],
    tipsEn: [
      "The 1N5408 flyback diodes MUST be reverse-biased (stripe on 12V VCC wire, tail on ground) across the pump and solenoids.",
      "Mount the 3300uF aluminum electrolytic smoothing capacitor parallel with the 12V bus to absorb pump turn-on sagging voltage."
    ]
  },
  {
    step: 5,
    titleAr: "اختبار تواصل العقد اللاسلكي وعرض البيانات على شاشة الHMI",
    titleEn: "Step 5: Master Node Coordination, LCD Display, & Testing",
    descriptionAr: "تنظيم تواصل بروتوكول ESP-NOW بين العقد وتشغيل شاشة العرض الرقمية ومستشعر التوقيت العتادي الRTC.",
    descriptionEn: "Integrate the DS3231 Chrono Clock and PCF8574 I2C Backpack LCD on Node 1 (GPIO 21, 22). Build the main dashboard coordinates translating the raw sensor signals into human telemetry. Ensure active cooling exhausts operate safely.",
    tipsAr: [
      "تواصل الـ ESP-NOW لا يحتاج لراوتر أو شبكة إنترنت خارجية مما يجعله مثاليًا للقرى والمزارع الريفية بالبصرة.",
      "تأكد من عزل مسارات الأرضيات (Grounds Loop) والتقائها فقط بنقطة النجم (Star Ground) لحماية قراءات الملوحة التماثلية."
    ],
    tipsEn: [
      "ESP-NOW acts as a peer-to-peer fast wireless bus, bypassing Wi-Fi routers. It is perfect for remote southern Iraq field farms.",
      "Ensure the shared I2C LCD and Real Time Clock use address calibrations (0x27) properly to print environmental alerts."
    ]
  }
];
