import { QuizQuestion } from './types';

export const SYSTEM_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    questionAr: "لماذا تم ربط جميع مجسات الاستشعار التماثلية (الملوحة، الرطوبة، والمطر) على قنوات وحدة الـ ADC1 فقط في العقدة الثانية وتجنب الـ ADC2 تمامًا؟",
    questionEn: "Why are all sensitive analog sensors (moisture, TDS, rain) strictly mapped onto ADC1 channels on Node 2 instead of ADC2?",
    optionsAr: [
      "لأن وحدة ADC2 تحتوي على قنوات تشخيصية معطوبة برمجياً.",
      "لأن قنوات وحدة ADC2 تتعطل وتفشل تماماً بسبب أولويات العتاد عندما ينشط مرسل الواي فاي والاتصال بروتوكول ESP-NOW.",
      "لأن وحدات ADC1 تحتوي على معدل ترميز 16-بت والأخرى 8-بت فقط.",
      "لأن أطراف منفذ ADC1 توفر جهداً كهربائياً مساعداً لتشغيل الإبر النحاسية."
    ],
    optionsEn: [
      "Because the ADC2 module is buggy and has permanent software compile errors.",
      "Because ADC2 is shared with the Wi-Fi/ESP-NOW wireless RF transceiver hub and gets hardware-prioritized/disabled during active radio transmissions.",
      "Because ADC1 channels support 16-bit resolution while ADC2 only supports 8-bit.",
      "Because ADC1 pins send feedback voltage to power the sensor plates directly."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعد هذه من التفاصيل الحساسة في عتاد شريحة ESP32؛ حيث تشترك الدوائر الداخلية لوحدة الـ ADC2 مع دوائر بث شريحة الراديو والواي فاي (ومنها بروتوكول ESP-NOW اللاسلكي)، مما يؤدي لتعطيل قراءة الـ ADC2 بالكامل برمجياً بمجرد بث أو استقبال الحزم وتوليد قراءات فاسدة.",
    explanationEn: "On the ESP32 chip, the ADC2 peripheral module shares silicon routing paths and registers with the 2.4 GHz RF (Wi-Fi/ESP-NOW) transceiver. Active RF communication disables ADC2 completely by hardware priority, causing reading corruptions or saturation errors."
  },
  {
    id: 2,
    questionAr: "ما هي الفائدة العلمية المرجوة من استخدام ديودات الحماية 1N5408 بالتوازي في عكس القطبية عبر أطراف المضخة وصمامات الري (Inductive Clamping)؟",
    questionEn: "What is the physical engineering purpose of welding the 1N5408 diodes in a reverse-biased parallel clamping configuration across pump and valve coils?",
    optionsAr: [
      "لزيادة سرعة فتح وإغلاق الصمامات الميكانيكية بخلية ضغط الهواء.",
      "لمنع انهيار وتشتيت تيار النبضات العكسي الضار (Flyback Spikes) عند فصل أو نزع التيار الكهرومغناطيسي عن الملفات الحثية.",
      "لتقليل استهلاك التيار الكهربائي والجهد المنقضي للمشغلات.",
      "لحماية المضخة من التلامس والتآكل الناتج عن التوصيل الطفيلي للأقطاب."
    ],
    optionsEn: [
      "To increase the structural opening and closing speed of mechanical diaphragms.",
      "To loop and damp the high-voltage flyback transient inductive kickback spikes generated when the coil is de-energized.",
      "To reduce active current draw and overall power consumption of active solenoids.",
      "To protect motor windings from galvanic oxidation and direct environmental exposure."
    ],
    correctAnswerIndex: 1,
    explanationAr: "عند إيقاف تغذية الملفات الحثية (مثل المضخات وصمامات الري الملفية)، ينهار حقل المغناطيس الدائري مسبباً توليد تيار عودة عكسي هائل يسمى بالـ (Flyback Voltage Spike / V = L * di/dt) والذي قد يخترق المرحلات ويدمر العتاد والمتحكمات. يقوم ديود 1N5408 بتسريب وحصار هذا النبض عبر مقاومة الملف بحد أقصى تشتيت 0.7 فولت.",
    explanationEn: "Solenoids and pump motors are heavy inductive loads. When de-energized, the collapsing magnetic field generates a massive instantaneous inverse high-voltage kickback spike (V = L·di/dt) that can destroy relay traces and trigger ESP32 resets. The 1N5408 diode shunts this surge safely at 0.7V."
  },
  {
    id: 3,
    questionAr: "لماذا يفضل استخدام قراءة ملوحة مياه الري (TDS) المرجعية مصححة بدرجة الحرارة من حساس DS18B20؟",
    questionEn: "Why is water salinity (TDS) reading corrected mathematically using temperature values from the DS18B20 probe?",
    optionsAr: [
      "لأن مياه البصرة تتميز بلونها الداكن مما يزيد من التوربين الطيفي للحرارة.",
      "لأن التوصيل الكهربائي للمياه (EC) يتأثر جداً بدرجة الحرارة، حيث تزداد حركة وأيونات الملوحة النشطة طردياً مع ارتفاع الحرارة مما يسبب تضليل القراءة.",
      "لأن درجة الحرارة المرتفعة تسرع تآكل أقطاب التيتانيوم.",
      "لتجنب حدوث تماس كهربائي داخل مجسات الفولاذ المقاوم للصدأ."
    ],
    optionsEn: [
      "Because Basra agricultural waters have high turbidity which skews standard light reflections.",
      "Because Electrical Conductivity (EC) of solutions is highly dependent on thermal variation; as temperature rises, viscosity drops, increasing ionic mobility and skewing raw outputs.",
      "Because elevated temperatures prompt rapid corrosion of the sensor's titanium pins.",
      "To avoid introducing short-circuits inside the marine-grade 316 stainless steel casing."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تزداد المهر السعوي لسرعة الأيونات الحرة في المياه بزيادة درجة الحرارة مما يغير قيمة التوصيل كيميائيًا، ولذلك تتم عملية التعويض الرياضي بتنظيم المعادلة المرجعية لدرجة حرارة 25 مئوية لضمان تتبع ملوحة دقيق وموثوق بمزارع تمور البصرة تحت التغيرات المناخية القاسية.",
    explanationEn: "Liquid electrical conductivity is temperature-dependent. Higher temperatures reduce water viscosity, boosting ionic mobility and making salinity appear higher than actual. Correcting values to a 25°C baseline using DS18B20 inputs guarantees accurate TDS tracking."
  },
  {
    id: 4,
    questionAr: "ما هو الدور الهندسي الذي يعطيه عازل الفوتوكوبلر PC817 المدمج بموديولات الري والموجب لتشغيل المرحلات؟",
    questionEn: "What is the structural isolation benefit provided by the PC817 Optocoupler integrated into the low-level relay modules?",
    optionsAr: [
      "يقوم بامتصاص بخار المياه والأوكسجين الرطب المحيط باللوحة.",
      "يفصل ويقطع تماماً أي تلامس سلكي أو نحاسي بين دوائر الخرج عالية التيار (12V) والمتحكمين الرقمي الحساس من الـ ESP32.",
      "يوفر طاقة تعويضية إضافية تصل إلى 24 فولت من دون استخدام بطارية.",
      "يقوم ببرمجة التوقيت الدفعي للمرحل برتبة منطقية بسيطة."
    ],
    optionsEn: [
      "It absorbs ambient humidity and soil moisture vapors around the terminal board.",
      "It completely breaks the physical copper link between high-voltage actuator lines (12V) and the sensitive micro-controller grid (3.3V) via galvanic light isolation.",
      "It supplies supplemental charging voltage upward of 24V without secondary batteries.",
      "It stores the chronographic pulse times in hardware registers."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يقوم الـ PC817 بعزل مسار التحكم الإلكتروني؛ تتوجه أطراف الـ ESP32 لإضاءة ضوء ليد داخلي مخفي فقط، والذي يفعّل ترانزستور ضوئي معزول لتشغيل شبكة الملف العالي وبذلك ينقطع أي اتصال نحاسي مباشر، مانعاً عبور التردد والضوضاء أو الجهد المدمر للمتحكم.",
    explanationEn: "Optocouplers isolate system blocks. The ESP32 logic pins light an internal infrared LED across a microscopic gap to trigger a photosensitive transistor. This eliminates direct copper link, saving the microchips from high-current EMI or ground loops."
  },
  {
    id: 5,
    questionAr: "لماذا تم استبدال حساسات الرطوبة ذات السلكين المقاومة (Resistive Probes) بنوع سعوي (Capacitive Probes V1.2)؟",
    questionEn: "Why are capacitive soil moisture probes utilized in the system instead of standard dual-pin resistive probes?",
    optionsAr: [
      "لأن السعوية تعطي ألوان كاشفة متميزة تميل للأخضر داخل التربة.",
      "لأن الحساسات المقاومة تسبب مرسوماً كيميائياً للتحلل الكهربائي (Electrolysis) مما يسبب صدأ وتآكل أطراف الحساس دفترياً خلال أسابيع معدودة وتلفها.",
      "لأن الحساس السعوي يتطلب سلك غليظ مغطى بمادة الفولاذ المقاومة للتآكسد.",
      "لأن السعوية لا تحتاج لمنفذ ADC على اللوحة وتدعم منفذ الـ I2C مباشرة."
    ],
    optionsEn: [
      "Because capacitive probes display vivid green indicator lights on their substrate paths.",
      "Because resistive probes continuously run a DC galvanic current that accelerates soil electrolysis, destroying copper probe traces within weeks due to rapid oxidation.",
      "Because capacitive models need thick steel wiring shielding.",
      "Because capacitive sensors bypass the ADC to run directly on the digital I2C bus."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعتمد الأشكال المقاومة على ضخ تيار مستمر مباشر ومكشوف في ركام التربة مما يعتبر محفزاً نشطاً للأكسدة والتحلل، بينما يعزل النموذج السعوي V1.2 مساراته الفضية والنحاسية تماما خلف طبقة عازلة كربونية ناعمة، ويقيس الرطوبة بالحقل الكهرومغناطيسي المتردد دون ملامسة المعادن للتربة.",
    explanationEn: "Resistive sensors pass a galvanic DC path directly into damp soil, accelerating metal electrolysis and destroying sensor traces within weeks. Capacitive probes keep copper lines isolated beneath a protective mask, sensing moisture with adjacent fields."
  },
  {
    id: 6,
    questionAr: "ما هو العنوان الافتراضي لتخزين البيانات I2C لشاشة الـ LCD المدعومة بممدد PCF8574؟",
    questionEn: "What is the standard I2C hexagonal address programmed to locate the PCF8574 LCD expander backpack?",
    optionsAr: [
      "0x3F أو 0x27",
      "0x11 أو 0x00",
      "0x80 أو 0x96",
      "0xFF أو 0xAA"
    ],
    optionsEn: [
      "0x27 or 0x3F",
      "0x00 or 0x11",
      "0x80 or 0x96",
      "0xAA or 0xFF"
    ],
    correctAnswerIndex: 0,
    explanationAr: "تتوجه أغلب موديولات ومكاثف التوصيل المساعد PCF8574 المدمجة بشاشات الـ 20x4 و 16x2 لحجز عنوان الإشارة الافتراضي 0x27 أو 0x3F للتقنية المسلسلة I2C.",
    explanationEn: "Typically, PCF8574 I2C backpacks for alphanumeric liquid crystal displays map sequentially to hexadecimal address 0x27 or 0x3F dynamically."
  },
  {
    id: 7,
    questionAr: "كيف يساهم حساس كشف المطر (Rain water level) في توفير الموارد بمزارع تمور البصرة؟",
    questionEn: "How does the Rain Water level sensor protect the date palm microclimate fields from waterlogging?",
    optionsAr: [
      "يتولى تدوير مياه الصرف الزراعي من القنوات الملحية للآبار.",
      "يقوم بقطع وإلغاء تفعيل دور ري المناطق فورًا عبر العقدة الثالثة عند هطول الأمطار حماية للتربة والمضخة من التشبع وهدر الطاقة.",
      "يتنبأ بهطول المطر لثلاثة أيام قادمة عبر اتصاله برادار الطقس الجوي.",
      "يزيل تراكم الغبار العالق على أوراق سعف النخيل العلوية."
    ],
    optionsEn: [
      "It recycles brackish water back into the deep ground water wells.",
      "It triggers an immediate system override to bypass irrigation cycles, preventing waterlogging and saving power when raindrops hit the plate.",
      "It predicts rain events 3 days in advance via satellite meteorological radar mapping.",
      "It washes sand particles off the date palm fronds autonomously."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يعمل الحساس كصمام حماية طوارئ مسبق؛ فبمجرد تراكم رذرات المياه على سطح اللوحة الحساسة ينخفض الجهد وتتوجه العقدة الثانية لوقف عمل صمامات ري العقدة الثالثة، مانعة لزيادة التشبع المائي وتراكم الملوحة السطحية وتوفير المياه الزائدة.",
    explanationEn: "When rainwater drops hit the sensor, they form conducting bridges that lower resistance. The sensor signals Node 2 which communicates an override command, letting Node 3 block current to solenoids to avoid over-irrigation."
  },
  {
    id: 8,
    questionAr: "لماذا يجب ربط الخطوط السالبة (GND) لمزود الطاقة 12V والمنظم الخافض LM2596 مع خط الأرضي (GND) للمتحكم ESP32 في نقطة مشتركة واحدة (Common Ground)؟",
    questionEn: "Why must the negative lines (GND) of the 12V power supply, LM2596 buck converter, and ESP32 microcontroller be tied to a single common ground system?",
    optionsAr: [
      "لتقليل استهلاك الطاقة المغناطيسية للملفات الكهرومغناطيسية.",
      "للوقاية من أخطار الصواعق الرعدية والظروف الجوية في حقول البصرة.",
      "لتوفير مسار مرجعي موحد وثابت لجهد الإشارات الرقمية والتماثلية، لتلافي عشوائية تفعيل المرحلات وتذبذب قراءات الحساسات.",
      "للسماح بالتحكم في سطوع شاشات الـ LCD بدون مقاومة رفع خارجية."
    ],
    optionsEn: [
      "To reduce the magnetic energy consumed inside the copper windings.",
      "To safeguard the outdoor units against structural damage from heavy lightning strikes in Basra.",
      "To establish a unified, stable voltage reference for both digital and analog signals, preventing random relay triggering and sensor calibration drifts.",
      "To enable active backlighting control on the main LCD without needing pullup resistors."
    ],
    correctAnswerIndex: 2,
    explanationAr: "في الأنظمة الهجينة التي تعمل بجهود مختلفة (12 فولت للمشغلات، و 5 أو 3.3 فولت للتحكم والمنطق)، يعتبر الأرضي المشترك صمام أمان لإرجاع التيارات وضمان أن يكون الصفر لجميع الإشارات متطابقاً، وإلا ستحدث تيارات طفيلية ومشاكل (Ground Loops) تسبب قراءات خاطئة وضوضاء تدمر دقة الحساسات.",
    explanationEn: "In mixed-voltage circuits (12V actuator rail & 3.3V/5V logic rails), a common ground is required so that logic high/low thresholds share an absolute zero reference. Without it, the signal loop remains open, producing massive EMI and erratic relay behavior."
  },
  {
    id: 9,
    questionAr: "ما الميزة التقنية الأساسية لبروتوكول تواصل ESP-NOW اللاسلكي المعتمد لربط العقد مقارنة بالاتصال التقليدي عبر راوتر واي فاي (Wi-Fi AP)؟",
    questionEn: "What is the primary technical advantage of using the peer-to-peer ESP-NOW protocol over traditional Router-based Wi-Fi connections?",
    optionsAr: [
      "إمكانية إرسال واستقبال حزم بيانات مشفرة تغطي مسافات قارية مباشرة عبر الأقمار الصناعية.",
      "إتاحة تواصل مباشر وسريع جداً (Peer-to-Peer) دون الحاجة لراوتر وسيط، مع تقليل استهلاك الطاقة لتمكين تشغيل عقد المستشعرات بالبطاريات لآجال طويلة وضمان زمن استجابة متناهي الصغر (~1ms).",
      "القدرة على البث المباشر للفيديو بجودة 4K لكاميرات المراقبة الحقلية المجاورة للنظام.",
      "توسيع نطاق عرض الموجة الحاملة ليبلغ 5 جيجاهرتز لتفادي تردد رادارات السفن في شط العرب."
    ],
    optionsEn: [
      "The ability to send encrypted climate packets across continental distances using satellite dishes directly.",
      "Allowing direct, rapid peer-to-peer transport (~1ms latency) with no dependency on central routers, while keeping power draw extremely low to facilitate long-term solar/battery sub-node operations.",
      "Adding high-speed channel bandwidth capable of supporting live 4K CCTV video streams from palm areas.",
      "Expanding the fundamental frequency band to 5 GHz to bypass shipping radar noise from Shatt al-Arab."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يعمل بروتوكول ESP-NOW في طبقة التحكم بالوصول للوسط (MAC Layer) مباشرة دون الحاجة لخطوات الربط والتحقق لشبكات TCP/IP (Handshaking). هذا يتيح لعقدة الحساسات أن تستيقظ وتغذي المعالج وترسل قراءة الرطوبة والملوحة بشكل خاطف خلال عدة أجزاء من الملي ثانية ثم تعود مباشرة لوضع النوم العميق (Deep Sleep) لحفظ الطاقة.",
    explanationEn: "ESP-NOW bypasses the complex TCP/IP protocol stack, communicating directly via MAC addresses on the PHY layer. This allows battery-powered sensor nodes to instantly wake from deep sleep, transmit sensor data in fractions of a millisecond, and return to sleep, minimizing power drain."
  },
  {
    id: 10,
    questionAr: "لماذا تم تفعيل ساعة حقيقية خارجية عالية الدقة (DS3231 RTC) لتحديد أوقات الري في العقدة الأولى بدلاً من استخدام دالة التوقيت الداخلي للمتحكم millis()؟",
    questionEn: "Why is an external high-precision Real-Time Clock (DS3231 RTC) essential for scheduling irrigation rather than using the ESP32 internal millis() timer function?",
    optionsAr: [
      "لأن دالة `millis()` الداخلية تستهلك مساحات شاسعة من الذاكرة العشوائية مما يؤدي لتعليق المعالج ثنائي النواة.",
      "لأن دالة الـ `millis()` تعاني من الانزياح الزمني المستمر وتعود لعلامة الصفر تلقائياً (Overflow) بعد 49.7 يوم تشغيل مستمر، فضلاً عن عدم قدرتها على استرجاع أو حفظ الوقت الفعلي (ساعات ودقائق) عند انقطاع مغذي الكهرباء عن اللوحة.",
      "لأن شريحة DS3231 تشمل حساس تماثلي لقياس نسبة ملوحة مياه السقي لتبسيط التصميم العتادي.",
      "لأن شريحة DS3231 تتواصل ببروتوكول SPI السريع جداً مما يحفظ قنوات الدخل التماثلي."
    ],
    optionsEn: [
      "Because the microchip internal millis() routine triggers dynamic memory allocation issues, crashing the dual-core processor.",
      "Because the software-based millis() counter undergoes baseline drift, overflows (returns to zero) after 49.7 days of continuous run-time, and is incapable of retaining civil calendar time (real hours/days) when main power is cut.",
      "Because the DS3231 silicon incorporates a backup sensor for analyzing irrigation saline concentrations.",
      "Because the DS3231 chip communicates using SPI which preserves more MCU analog ports than other solutions."
    ],
    correctAnswerIndex: 1,
    explanationAr: "دالة `millis()` هي مجرد عداد برمجي يبدأ من صفر منذ لحظة تشغيل الشريحة وينطفئ تماماً مع انقطاع الكهرباء، بينما تعد شريحة DS3231 ساعة حقيقية مستقلة بعتادها مجهزة ببطارية احتياطية تحافظ على الوقت بدقة هائلة لسنوات.",
    explanationEn: "The MCU-defined millis() relies strictly on crystal oscillation registers since power-up, meaning all scheduling disappears on power loss and wraps to zero after 49.7 days. The DS3231 is an independent hardware clock with built-in temperature compensation for high accuracy and a backup cell battery to survive outages."
  },
  {
    id: 11,
    questionAr: "كيف يتعامل نظام التشغيل المصغر (FreeRTOS) في متحكم ESP32 ثنائي النواة مع معالجة حزم الاتصال اللاسلكي وتطبيق المستخدم؟",
    questionEn: "How does the FreeRTOS scheduler inside the dual-core ESP32 distribute wireless communication packets and user app tasks?",
    optionsAr: [
      "يتم تشغيل كل المهام بالتتابع السلس على النواة الأولى فقط وتجنيب النواة الثانية.",
      "تقوم نواة البروتوكول (Core 0) بمعالجة العمليات اللاسلكية ذات الأولوية العالية (بما في ذلك بروتوكول ESP-NOW)، بينما تقوم نواة التطبيق (Core 1) بتشغيل واجهة برمجة المستخدم وقراءة الحساسات بشكل متوازٍ.",
      "تتبادل النواتان العمليات بشكل عشوائي دون تنظيم مسبق مما يسبب تجميد الذاكرة.",
      "يتم إلغاء تفعيل النواة الصفرية وتوجيه جميع مصادر الدائرة لتشغيل شاشة الـ LCD."
    ],
    optionsEn: [
      "It sequentially runs all software procedures on Core 1 while keeping Core 0 completely disabled.",
      "The protocol core (Core 0) executes RF-related real-time tasks (including ESP-NOW), while the application core (Core 1) executes user code and reads sensors in parallel.",
      "Both cores dynamically swap control registers without an arbiter, triggering memory leaks.",
      "It shuts down Core 0 during execution to dedicate entire battery resources to the I2C LCD lines."
    ],
    correctAnswerIndex: 1,
    explanationAr: "في معمارية ESP32، تقسم المهام عبر النواتين (Core 0 و Core 1)؛ تُكرس النواة الصفرية core0 بواسطة FreeRTOS لتنفيذ مهام الذاكرة والاتصالات اللاسلكية الحرجة، تاركة النواة الأولى core1 لكتابة التطبيق وقراءة الحساسات لتسهيل المعالجة المتوازية الحقيقية.",
    explanationEn: "The dual-core Xtensa LX6 architecture splits processing: Core 0 handles high-priority system networking and Wi-Fi drivers, while Core 1 executes standard user sketches and IO tasks, eliminating execution blocks."
  },
  {
    id: 12,
    questionAr: "ما هو الحجم الأقصى للبيانات (Payload Size) المسموح بإرسالها في حزمة تواصل ESP-NOW واحدة؟",
    questionEn: "What is the maximum payload size in bytes supported in a single ESP-NOW communication packet?",
    optionsAr: [
      "250 بايت",
      "1024 بايت",
      "64 بايت",
      "2048 بايت"
    ],
    optionsEn: [
      "250 bytes",
      "1024 bytes",
      "64 bytes",
      "2048 bytes"
    ],
    correctAnswerIndex: 0,
    explanationAr: "يتصف بروتوكول ESP-NOW بأنه خفيف وسريع جداً، ولذلك يحدد حجم بيانات الحمولة الصافية بـ 250 بايت كحد أقصى للحزمة الواحدة، وهو ما يعد كافياً جداً لنقل هياكل بيانات الاستشعار وقراءات الحقول.",
    explanationEn: "ESP-NOW is a lightweight wireless protocol developed by Espressif. To remain ultra-fast and low-power, the payload is restricted to a maximum of 250 bytes per frame, which is ideal for transmitting structured sensor telemetry."
  },
  {
    id: 13,
    questionAr: "ما هو إعداد التوهين (Attenuation) المناسب لوحدة الـ ADC في متحكم ESP32 لتوسيع نطاق قراءة الجهد التماثلي الكامل من 0 إلى 3.3 فولت للحجم الكامل؟",
    questionEn: "Which ADC attenuation setting must be configured on the ESP32 to accurately read analog voltage up to the 3.3V power rail?",
    optionsAr: [
      "ADC_ATTEN_DB_0 (0 dB)",
      "ADC_ATTEN_DB_2_5 (2.5 dB)",
      "ADC_ATTEN_DB_6 (6 dB)",
      "ADC_ATTEN_DB_11 (11 dB)"
    ],
    optionsEn: [
      "ADC_ATTEN_DB_0 (0 dB)",
      "ADC_ATTEN_DB_2_5 (2.5 dB)",
      "ADC_ATTEN_DB_6 (6 dB)",
      "ADC_ATTEN_DB_11 (11 dB)"
    ],
    correctAnswerIndex: 3,
    explanationAr: "يتطلب مسار القراءة الكامل حتى جهد 3.3 فولت تطبيق توهين بمعدل 11 ديسيبل (11dB Attenuation)، وبدون هذا الإعداد سيحدث تشبع للمنبئ التماثلي عند وصول الجهد لحوالي 1.1 فولت فقط.",
    explanationEn: "By default, the raw ESP32 ADC references voltages up to ~1.1V (0dB attenuation). To scale the input dynamically to measure up to the 3.3V output rail, we set the attenuation to 11dB (which scales inputs down on-chip)."
  },
  {
    id: 14,
    questionAr: "كيف تختلف فيزياء عمل مستشعرات رطوبة التربة السعوية (Capacitive) عن المقاومة (Resistive) من حيث القياس داخل التربة؟",
    questionEn: "How does the physical measurement theory of capacitive soil moisture sensors differ from resistive sensors in dry soil?",
    optionsAr: [
      "السعوية تقيس مقاومة النحاس الحرارية الناتجة عن تسخين التربة.",
      "المقاومة تعتمد على تغير المقاومة الكهربائية، بينما السعوية تقيس التغير في السعة الكهربائية للتربة الذي يعتمد كلياً على سماحية الماء الثنائية العالية (Dielectric Permittivity).",
      "السعوية تبعث موجات فوق صوتية لقياس حجم رذاذ الماء بالميكرومتر.",
      "المقاومة تقيس تركيز الهيدروجين الحمضي فقط والسعوية تقيس نسبة الأكسجين."
    ],
    optionsEn: [
      "Capacitive sensors measure the heat resistivity change generated inside soil elements.",
      "Resistive sensors measure direct circuit resistance, while capacitive sensors measure changes in soil dielectric permittivity where the high dielectric constant of water dominates the surrounding medium.",
      "Capacitive sensors emit ultrasonic waves to count micro-droplets in dynamic suspension.",
      "Resistive sensors only measure acidic soil pH while capacitive sensors measure overall oxygen concentration."
    ],
    correctAnswerIndex: 1,
    explanationAr: "بما أن السماحية الثنائية للماء (~80) أكبر بكثير من التربة الجافة (~3) والهواء (~1)، يتناسب شحن المجال الكهربائي المتولد حول وجه الحساس السعوي طردياً مع محتوى الماء بالتربة دون الحاجة للتسرب النحاسي أو الأيونات الملوثة.",
    explanationEn: "Water's relative permittivity (dielectric constant) is ~80, whereas dry soil is ~4 and air is 1. When moisture levels rise, the average dielectric index surrounding the capacitive probe plate increases, changing charging frequency."
  },
  {
    id: 15,
    questionAr: "ما هي العالقة الرياضية التقريبية المستخدمة لتحويل التوصيل الكهربائي للمياه (EC) إلى نسبة الأملاح الذائبة الكلية (TDS)؟",
    questionEn: "What mathematical conversion is standard to approximate Total Dissolved Solids (TDS in ppm) from Electrical Conductivity (EC in µS/cm)?",
    optionsAr: [
      "TDS (ppm) = EC (µS/cm) * 0.5 to 0.7",
      "TDS (ppm) = EC (µS/cm) * 10.0",
      "TDS (ppm) = EC (µS/cm) / 2.0",
      "TDS (ppm) = EC (µS/cm) * 100.0"
    ],
    optionsEn: [
      "TDS (ppm) = EC (µS/cm) * 0.5 to 0.7",
      "TDS (ppm) = EC (µS/cm) * 10.0",
      "TDS (ppm) = EC (µS/cm) / 2.0",
      "TDS (ppm) = EC (µS/cm) * 100.0"
    ],
    correctAnswerIndex: 0,
    explanationAr: "تعتمد الأجهزة الرقمية عموماً على تحويل التيار المار عبر عامل ضرب يتراوح من 0.5 إلى 0.7 تبعاً لطبيعة الأملاح الذائبة والمركبات الملحية السائدة في مياه شط العرب ومزارع البصرة.",
    explanationEn: "Since TDS consists of physical ions that conduct current, we estimate TDS by multiplying Electrical Conductivity (EC) by an empirical multiplier (typically 0.5 - 0.7) depending on local saline mineral signatures."
  },
  {
    id: 16,
    questionAr: "كيف تختلف آلية بث البيانات اللاسلكية عبر ESP-NOW بنمط البث التعددي (Broadcast) مقارنة بنمط البث الأحادي (Unicast)؟",
    questionEn: "How does ESP-NOW Broadcast mode differ in mechanism from Unicast mode during field communication?",
    optionsAr: [
      "البث الأحادي يرسل لجميع الأجهزة دون تشفير، والبث التعددي يتطلب كتابة رمز PIN سري.",
      "البث التعددي يرسل للجميع باستخدام عنوان MAC موحد (FF:FF:FF:FF:FF:FF) ولا ينتظر إشعار تأكيد الاستلام (ACK)، بينما البث الأحادي يستهدف جهازاً واحداً وينتظر تأكيد الاستلام لضمان موثوقية البث.",
      "التعددي يتطلب راوتر وسلكاً أرضياً متصلاً بالعقد.",
      "الأحادي يستهلك ضعف طاقة الإشارة مما يعجل تفريغ بطارية العقد."
    ],
    optionsEn: [
      "Unicast targets all nearby systems without encryption, whereas broadcast mode runs high security PIN handshakes.",
      "Broadcast sends packets to all nearby nodes using a unified MAC address (FF:FF:FF:FF:FF:FF) with no ACK feedback, whereas Unicast targets a single peer MAC and awaits an ACK response to verify delivery.",
      "Broadcast requires a router routing network backbones over optical wire line networks.",
      "Unicast drains four times more lithium-ion current, leading to sudden node shutdowns."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يُفضّل استخدام البث الأحادي (Unicast) في نظام مزارع النخيل لضمان وصول البيانات؛ حيث يُعلمنا المتحكم المُرسل بنجاح عملية التسليم أو عدمها عبر استرجاع علم الحالة، بينما البث التعددي سريع للغاية لكنه يفتقد موثوقية التأكيد.",
    explanationEn: "For reliable point-to-point sub-nodes, Unicast is used because it triggers hardware ACKs and retries on packet loss. Broadcast lacks built-in feedback loops, causing silent data drops in harsh EMI conditions."
  },
  {
    id: 17,
    questionAr: "لماذا تعد قيمة مقاومات الرفع (Pull-Up Resistors) لشاشات وساعات الـ I2C حيوية جداً، وما هي القيمة المعيارية الموصى بها عادة؟",
    questionEn: "Why is the selection of I2C bus Pull-Up resistors critical, and what is the standard recommended value?",
    optionsAr: [
      "لأنها تحد من سحب الجهد الزائد، وتتراوح القيمة بين 1MΩ إلى 5MΩ لتقليص الشحنة الستاتيكية.",
      "لأنها تؤمن تفريغ شحنات خطوط SDA/SCL لتمكين التحويل السريع للبيانات، وتتراوح القيمة الشائعة بين 2.2kΩ إلى 4.7kΩ طبقاً لسرعة الناقل وطول الأسلاك.",
      "لتنشيط الصمامات الثنائية المضيئة المدمجة في اللوحة.",
      "لرفع جهد التغذية الإجمالي من 3.3 فولت إلى 12 فولت تلقائياً."
    ],
    optionsEn: [
      "Because they prevent overall overvoltage, ranging from 1MΩ to 5MΩ to capture micro-sparks.",
      "Because they pull lines high quickly to fight bus parasite capacities, with standard values between 2.2kΩ and 4.7kΩ depending on bus speeds and physical wire lengths.",
      "To directly drive the backlight illumination grids of the liquid crystal displays.",
      "To automatically step up the logic level voltage dynamically from 3.3V to 12V."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تتطلب شبكة الـ I2C وجود مقاومات رفع خارجية للحصول على مستويات منطقية ناصعة. إذا كانت المقاومة كبيرة جداً (مثلاً 10k)، سيرتفع الجهد ببطء مما يشوه نبضات البيانات الرقمية عند السرعات العالية (400kHz) لخط السعة الكهرومغناطيسية الكلية للناقل.",
    explanationEn: "I2C is an open-drain bus, meaning pins can only drive lines LOW. Pull-up resistors drag lines HIGH when pins release. If resistors are too weak, current draw overflows; if too strong, slow rise times round off square pulses, causing I2C timeouts."
  },
  {
    id: 18,
    questionAr: "كم تبلغ الفترة الزمنية الدنيا الموصى بها هندسياً للفصل بين قراءات حساس DHT22 الرقمي لتفادي جمود القراءة؟",
    questionEn: "What is the minimum recommended polling interval for the DHT22 climate sensor to prevent reading stalls?",
    optionsAr: [
      "100 ملي ثانية",
      "2 ثانية",
      "30 ثانية",
      "5 ثوانٍ"
    ],
    optionsEn: [
      "100 milliseconds",
      "2 seconds",
      "30 seconds",
      "5 seconds"
    ],
    correctAnswerIndex: 1,
    explanationAr: "حساس الرطوبة والحرارة DHT22 يحتاج لفترة زمنية لا تقل عن ثانيتين (2000 ملي ثانية) بين القراءة والأخرى لإعادة معايرة واستقرار دوائره الإلكترونية وسحب البيانات بشكل سليم بلا تجمد أو أخطاء تعليق.",
    explanationEn: "The DHT22 employs a capacitive sensor substrate that requires slow relaxation intervals. Querying the sensor faster than once every 2 seconds results in stale data values, checksum errors, or internal warming."
  },
  {
    id: 19,
    questionAr: "كيف تساهم المكثفات كهرلية الضخمة (مثل 3300µF) المربوطة على ناقل الطاقة الرئيسي 12 فولت في تأمين استقرار معالج ESP32؟",
    questionEn: "How does adding a large electrolytic bulk capacitor (e.g., 3300µF) across the 12V main bus stabilize the ESP32?",
    optionsAr: [
      "تعمل كخلايا شحن شمسية مصغرة لحفظ الكهرباء لثلاث ساعات.",
      "تمنع انخفاض الجهد المفاجئ (Voltage Sag) والارتداد الناتج عن السحب العالي للتيار لحظة إقلاع مضخات المياه وصمامات الري الملفية.",
      "تقوم بترشيح الإطارات اللاسلكية غير الموثوقة من الهواء.",
      "تنظم معدل سطوع الإضاءة الخلفية لشاشة الشاحن."
    ],
    optionsEn: [
      "It acts as a micro-solar fuel cell that stores operational electricity for three hours.",
      "It suppresses voltage sag and electrical transients induced by high inrush current draws when inductive pump motors and solenoid valves start up.",
      "It filters invalid raw radio waves out of the ambient enclosure environment.",
      "It regulates output contrast values across our Liquid Crystal Displays."
    ],
    correctAnswerIndex: 1,
    explanationAr: "المشغلات الميكانيكية مثل المحركات تسحب تياراً لحظياً ضخماً عند بدء دورانها يسمى بتيار البدء (Inrush Current)، مما يسبب انخفاضاً حاداً ومفاجئاً في خط الجهد، فيعمل مكثف الـ 3300µF كخزان طاقة فوري يغذي التيار المفقود ليمنع إعادة إقلاع (Brownout Resets) معالجات الـ ESP32.",
    explanationEn: "DC motors generate huge startup current surges that cause voltage drops along power lines. Placing a bulk capacitor near the power terminal acts as an instantaneous energy reservoir, supplying current to prevent brownout MCU resets."
  },
  {
    id: 20,
    questionAr: "ما الذي يميز تواصل مسبار DS18B20 الرقمي للحرارة عبر بروتوكول السلك الواحد (1-Wire)؟",
    questionEn: "What is the unique defining feature of the DS18B20 1-Wire temperature sensor protocol?",
    optionsAr: [
      "يتطلب 4 أسلاك تواصل مفرغة لضمان ثبات التيار النبضي.",
      "يحمل كل حساس شفرة تعريفية فريدة بحجم 64 بت (64-bit Unique ROM ID) محفورة بالليزر، مما يسمح بربط مسبارات متعددة على سلك بيانات مشترك واحد دون تداخل.",
      "يبث البيانات عبر موجات الراديو بدون أسلاك نحاسية.",
      "يقوم بقياس الرطوبة الخلوية للتربة المجاورة تلقائياً."
    ],
    optionsEn: [
      "It requires exactly four individual digital channels to establish data integrity.",
      "Each device contains a laser-etched, unique 64-bit ROM registration address, allowing multiple probes to share a single microchip bus pin with zero data collision.",
      "It beams thermal metrics across radio frequencies without needing direct copper links.",
      "It measures surrounding soil volumetric water content automatically in parallel physical units."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يسمح بروتوكول 1-Wire بربط عشرات الحساسات على طرف GPIO واحد بفضل احتواء كل حساس على رقم تسلسلي فريد 64 بت محفور برمز المصنع، مما يسهل قياس درجات حرارة التربة على أعماق متباينة بسلك واحد.",
    explanationEn: "Maxim-Dallas 1-Wire standard utilizes a master-slave configuration wherein each sensor has a pre-programmed unique 64-bit silicon address. This minimizes needed microcontroller IO pins when tracking multiple heat points."
  },
  {
    id: 21,
    questionAr: "ما هو معدل استهلاك التيار الكهربائي المستهدف لمتحكم ESP32 في وضع السبات العميق (Deep Sleep) للمحافظة على سعة البطارية طويلاً؟",
    questionEn: "What is the target current consumption of the ESP32 in Deep Sleep mode to maximize battery lifespan in off-grid IoT setups?",
    optionsAr: [
      "حوالي 15 إلى 20 ميكرو أمبير (15-20 µA) عند استخدام مكونات ومنظمات جهد شديدة الكفاءة.",
      "حوالي 150 إلى 200 ملي أمبير (150-200 mA) بشكل كامل مستمر.",
      "حوالي 1.5 أمبير لتأمين تشغيل قنوات الراديو دايماً.",
      "لا يستهلك أي طاقة على الإطلاق لتوقف جميع الذرات الداخلية."
    ],
    optionsEn: [
      "Approximately 15 to 20 microamps (15-20 µA) when utilizing ultra-low-leakage LDOs and highly optimized circuitry.",
      "Around 150 to 200 milliamps (150-200 mA) continuous standby current drawing.",
      "Roughly 1.5 Amps to maintain internal radio transceiver warmups.",
      "Zero current draw, because physical molecular electron migrations stop completely."
    ],
    correctAnswerIndex: 0,
    explanationAr: "في وضع السبات العميق يتم إطفاء نوى المعالج المزدوجة ومودم الواي فاي ومعظم الأجهزة الطرفية، تاركاً فقط الذاكرة البطيئة (RTC RAM) ومؤقت اليقظة نشطين، مما يخفض سحب التيار إلى حوالي 15-20 ميكرو أمبير، مما يتيح عمله لأشهر ببطاريات صغيرة.",
    explanationEn: "During deep sleep, the ESP32 shuts down both CPU cores, digital peripherals, and RF transceivers. Only the Low-Power ULP coprocessor and RTC timer remain active, slashing battery currents to microamps."
  },
  {
    id: 22,
    questionAr: "ما هو السلوك الآمن الذي يتخذه كاشف انخفاض سعة الطاقة (Brownout Detector) في متحكم ESP32 عند هبوط تيار التغذية لأقل من الحدود الموصى بها؟",
    questionEn: "What fail-safe action does the built-in ESP32 Brownout Detector trigger when the supply voltage drops below the safe threshold?",
    optionsAr: [
      "يقوم بزيادة جهد المخرج المنظم تلقائياً لتفادي الانقطاع.",
      "يعيد تفعيل دور مضخات المياه عشوائياً بدون الرجوع لملف الكود.",
      "يقوم فوراً بإرسال نبضة إيقاف قاطعة وإعادة تشغيل المتحكم (System Reset) بشكل نظيف لحماية الذاكرة والمنطق من الجمود أو كتابة الفلاش الخاطئة.",
      "يتلف اللوحة الفيزيائية لحماية سرية البيانات."
    ],
    optionsEn: [
      "It boosts supply output lines internally to offset the power drops.",
      "It triggers random relay activations to drain remaining inductive energy safely.",
      "It immediately triggers a microchip system reset to protect storage and logic registers from entering unstable undefined states.",
      "It shorts out physical silicon traces to secure operational firmware keys."
    ],
    correctAnswerIndex: 2,
    explanationAr: "يعمل كاشف البراون آوت (عادة مهيأ عند 2.43 فولت) كحارس للنظام؛ فعندما يهبط الجهد بسبب تفريغ البطارية أو إقلاع مضخة، يقوم بإعادة تشغيل المتحكم كلياً لمنع تشوه البيانات وكتابة الفلاش الخاطئة.",
    explanationEn: "Under-voltage causes instability where logic gates behave unpredictably. The ESP32 brownout circuit monitors VDD. If voltage dips past threshold parameters (e.g., 2.43V), it stops operations and holds the chip under secure hardware reset."
  },
  {
    id: 23,
    questionAr: "كيف يعمل نمط الطاقة الطفيلية (Parasite Power Mode) في حساس الحرارة DS18B20؟",
    questionEn: "How does the Parasite Power Mode operate in the DS18B20 1-Wire temperature sensor?",
    optionsAr: [
      "يستمد الطاقة من المجالات المغناطيسية لمضخات المياه المجاورة له.",
      "يستمد الطاقة التشغيلية من سلك البيانات الأساسي (DQ) خلال فترات الارتفاع للمستويات المنطقية ويخزنها بمكثف داخلي، مقتصراً على سلكين للتوصيل (GND و DQ).",
      "يعيد شحن خلايا البطارية بامتصاص أشعة الشمس السطحية.",
      "يعتمد على مستويات رطوبة التربة المحيطة لتوليد الكهرباء."
    ],
    optionsEn: [
      "It steals electromotive current fields from adjacent high-power irrigation coils.",
      "It derives operating power straight from the high-logic periods of the DQ data line, storing it inside an internal capacitor to run over just two physical wires (GND & DQ).",
      "It recharges backup solar batteries by absorbing direct localized warmth.",
      "It relies on the mineral concentrations of localized irrigation pools to generate currents."
    ],
    correctAnswerIndex: 1,
    explanationAr: "في هذا النمط، يمكن تشغيل الحساس بسلكين فقط (GND و Data DQ)؛ يشحن الحساس مكثفًا داخليًا صغيرًا عندما يكون خط البيانات مرتفعًا (HIGH)، ثم يستغل هذه الشحنة لإجراء الحسابات والإرسال بينما يكون الخط منخفضًا.",
    explanationEn: "Parasitic power configuration ties the VDD pin of DS18B20 to GND. When the DQ data line goes high, an internal diode pulls current off the bus to charge an internal capacitor. This charge operates the chip during data transitions."
  },
  {
    id: 24,
    questionAr: "كيف تتأثر نسبة نقل التيار (Current Transfer Ratio - CTR) في عازل PC817 بمرور الوقت وظروف التشغيل؟",
    questionEn: "How does the Current Transfer Ratio (CTR) of the PC817 optocoupler degrade under long-term environmental stress?",
    optionsAr: [
      "تتزايد طردياً بمعدل 10% سنوياً بفعل تركز الذرات الضوئية.",
      "تنخفض تدريجياً بمرور الزمن ويزداد هذا التدهور مع درجات الحرارة المرتفعة وتيارات تشغيل الليّد العالية، مما يتطلب تصميم مقاومة تفرع آمنة.",
      "تظل ثابتة تماماً مدى الحياة لقوة حماية الطبقة المغناطيسية.",
      "تتحول إلى نسبة توافق ممانعات تفوق 200% تلقائياً."
    ],
    optionsEn: [
      "It boosts infinitely by roughly 10% annually due to photoelectric crystallization.",
      "It decreases gradually over active duty cycles, and this degradation accelerates dramatically under extreme field temperatures or excessive LED drive currents.",
      "It remains absolutely constant throughout its lifecycle owing to structural vacuum seals.",
      "It automatically converts to an inductive impedance alignment scale."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تتدهور جودة انبعاث الدايود الضوئي الداخلي والترانزستور بشكل طبيعي مع الاستنزاف والحرارة العالية، مما يقلل قيمة الـ CTR. لتفادي فشل تفعيل المرحلات في حقول البصرة الحارة، يجب تشغيل الليد بتيارات قيادة متحفظة وتجاوز الحسابات الحدية للاستجابة.",
    explanationEn: "Over years of service, the efficiency of the internal infrared emitter and phototransistor in optocouplers decreases (CTR degradation). Engineers prevent failures by driving LEDs with lower current and designing for worst-case CTR."
  },
  {
    id: 25,
    questionAr: "ما هو دور دبوس الـ Strapping الرقمي (GPIO 0) في متحكم ESP32 عند بدء الإقلاع أو إعادة التشغيل؟",
    questionEn: "What is the hardware role of the strapping pin GPIO 0 on the ESP32 during microcontroller boot-up?",
    optionsAr: [
      "يحدد سرعة منفذ الـ UART الافتراضي للاتصالات اللاسلكية.",
      "يتحكم في تحديد نمط تشغيل المعالج؛ إذا سُحب لأسفل (LOW) يدخل وضع البرمجة وتحميل الفلاش، وإذا سُحب لأعلى (HIGH) يدخل نمط التشغيل الطبيعي للكود.",
      "يفعل مقاومة الرفع لشاشة الـ LCD تلقائياً.",
      "يوقف عمل النواة الصفرية كلياً لحفظ الطاقة الفائضة."
    ],
    optionsEn: [
      "It determines the default baud-rate of UART ports during boot-ups.",
      "It determines the boot mode: if held LOW during reset, the chip enters Serial Bootloader mode to accept flash uploads; if held HIGH, it runs the standard program.",
      "It triggers static I2C pullup parameters internally for display routing.",
      "It halts Core 0 permanently to reduce ambient current overheads."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يعتبر GPIO 0 من دبابيس الإعداد الإجباري (Strap Pins) لعتاد الـ ESP32؛ حيث يتم قراءة حالته الكهربائية فورا عند التفعيل للحسم بين تشغيل الفلاش الحالي أو تهيئة المنفذ سلكياً لاستقبال برمجيات محدثة.",
    explanationEn: "Strapping pins configure the hardware state at boot. Pulled LOW, GPIO 0 instructs the ROM bootloader to await program flashing via serial pins. Left HIGH, execution boots directly into compiled program instruction sets."
  },
  {
    id: 26,
    questionAr: "لماذا تم اختيار تردد 2.4 جيجاهرتز لبروتوكول ESP-NOW اللاسلكي بدلاً من بروتوكولات الموجات الأطول؟",
    questionEn: "Why is the 2.4 GHz frequency band favored for ESP-NOW radio transmission in automated date palm plantations?",
    optionsAr: [
      "لأنها تسمح بنفاذية غير محدودة عبر كتل الصخور والجدران الحديدية.",
      "لأن ناقل 2.4GHz يقع ضمن النطاق الصناعي والعلمي والطبي المجاني (ISM Band) المتاح عالمياً دون تراخيص، بالإضافة لملائمة حجم الهوائيات المدمجة على شريحة الـ ESP32.",
      "لأنها تبث الموجات لمسافات تتخطى 50 كيلومتر طولي ومستمر.",
      "لأنها النطاق المائي الوحيد المتوافق مع بروتوكولات الملاحة البحرية."
    ],
    optionsEn: [
      "Because it penetrates deep limestone layers and solid protective iron walls with zero signal loss.",
      "Because 2.4 GHz is within the unlicensed Industrial, Scientific, and Medical (ISM) radio band, allowing worldwide deployment with PCB-printed antennas on standard ESP32 breakouts.",
      "Because it extends point-to-point wireless metrics past 50 kilometers in linear distance.",
      "Because it conforms to deep-sea maritime radar interference rules near localized channels."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعتمد الأجهزة الرقمية واللاسلكية الاستهلاكية على هذا النطاق المجاني ISM لفوائد التصنيع ومرونة التصريح والانتشار الكافي، فضلاً عن توافر عتاد الـ PCB المحفور بمحيط الهوائيات الصغيرة المربوطة بمتحكم الـ ESP32.",
    explanationEn: "2.4 GHz is part of the global unlicensed ISM band. Running radio links here yields high data rates and utilizes compact trace antennas, allowing simple integrations for agricultural telemetry."
  },
  {
    id: 27,
    questionAr: "ما هو السبب الأساسي لتفضيل ديودات الاستعادة السريعة (Fast Recovery Diodes) في حماية دوائر التبديل عالية التردد؟",
    questionEn: "Why are Fast Recovery Diodes preferred over standard rectifiers when protecting high-frequency switching transistor lines?",
    optionsAr: [
      "لأنها توفر ممانعة تعويضية لموجات الاتصال اللاسلكي.",
      "لأن زمن الاستجابة العكسي لها (Reverse Recovery Time) متناهي الصغر، مما يمنع حدوث قصر لحظي ويسرع قطع التيار العائد قبل غمر الترانزستور بالجهد.",
      "لأنها رخيصة جداً مقارنة بالأشكال التقليدية.",
      "لأنها تسمح بمرور التيار في الاتجاهين لتبسيط ممرات النحاس."
    ],
    optionsEn: [
      "Because they act as high-impedance RF antennas for cellular arrays.",
      "Because their extremely short reverse recovery time (trr) prevents transient short circuits and quickly dumps returning inductances before logic components are damaged.",
      "Because their fabrication steps are cheaper than conventional copper wiring arrays.",
      "Because they facilitate bidirectional power paths to halve our required trace counts."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تمنع ديودات الاستعادة السريعة (مثل UF4007) مرور تيارات الارتداد العكسية اللحظية؛ فعند التبديل بترددات هائلة (kHz) قد يعبر تيار عكسي مدمر عبر الديود التقليدي البطيء، بينما يقطع الديود السريع هذا الممر فورا حماية لسلامة المعالجة.",
    explanationEn: "Standard diodes like the 1N4007 take microseconds to block reverse current after switching (reverse recovery time). In high-frequency configurations, this slow response causes short circuits. Fast diodes isolate these surges instantly."
  },
  {
    id: 28,
    questionAr: "ما هو الخيار الأبسط لتجنب مشكلة الـ (Task Starvation) عند برمجة المهام بحلقات لا نهائية في نظام FreeRTOS بمتحكم ESP32؟",
    questionEn: "What is the simplest coding practice to avoid FreeRTOS Task Starvation when deploying infinite loops in custom sub-sketches?",
    optionsAr: [
      "رفع شدة الجهد التغذي للمعالج ليتفادي الصدمات.",
      "إدراج دالة التأخير اللامتزامن `vTaskDelay()` أو `delay()` داخل حلقة التكرار للسماح بتبديل السياق وإعطاء وقت لبقية المهام الأقل أولوية لتنفيذ أكوادها.",
      "برمجة اللوحة باستخدام لغة التجميع فقط لتفادي التعقيد.",
      "إيقاف قنوات الـ Watchdog كلياً برمجياً."
    ],
    optionsEn: [
      "Boosting operational CPU core voltage levels to run routines faster.",
      "Injecting `vTaskDelay()` or cooperative `delay()` commands inside the infinite loop to yield control to the scheduler, letting lower-priority processes execute.",
      "Writing all operational firmware purely in assembly registers to bypass core structures.",
      "Disabling all Task Watchdog Timers permanently in the build configuration."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يعتمد نظام FreeRTOS على مبدأ استباقية المهام (Preemptive Scheduling)؛ فإذا حجزت مهمة ذات أولوية مرتفعة المعالج بحلقة لا نهائية دون تجميدها برهة عبر التأخير، ستجوع بقية المهام (Starvation) وتفشل في تنقيط قراءات الحساسات أو التجاوب لاسلكياً.",
    explanationEn: "Preemptive multitasking runs on priorities. A high-priority task running an infinite loop with zero delay leaves no clock cycles for lower-priority tasks, stalling them. Calling `vTaskDelay` blocks the running task, yielding time slices."
  },
  {
    id: 29,
    questionAr: "ماذا يحدث عند تكرار عنوان الإشارة الـ I2C لخطين (مثلاً شاشة العرض الرقمية وشريحة الساعة) على نفس الناقل المشترك؟",
    questionEn: "What occurs at the hardware layer if two distinct modules (e.g., LCD backpack and RTC clock) share the same I2C address?",
    optionsAr: [
      "تنقسم البيانات بين الجهازين بالتناصف العادل.",
      "يحدث تعارض وعجز كامل في تسلیم حزم التخاطب (Bus Collision) مسبباً انهيار الاتصال وتجمد القراءة على المنافذ.",
      "يتحول الناقل تلقائياً لنظام الاتصال المتوازي فائق السرعة.",
      "تتلف اللدات الخلفية للشاشات فورا لتراكم التردد الحراري."
    ],
    optionsEn: [
      "The master neatly splits data frames and half-presents to both devices.",
      "A severe I2C bus collision occurs as both devices pull the SDA line low simultaneously, causing read timeouts and complete communication failure.",
      "The interface shifts to a high-speed parallel bus topology to bypass addressing.",
      "Integrated step-up LED drivers short-circuit due to excess resonance."
    ],
    correctAnswerIndex: 1,
    explanationAr: "لا يمكن لمرسلين متوازيين الرد على نفس العنوان في نظام I2C؛ فبمجرد صدارة النداء سيسحب كلاهما خط البيانات SDA لمستويات متباينة بالوقت عينه، مما ينتج تضارباً إلكترونياً (Acknowledge Collision) ويغلق مسار الحافلة بأكمله.",
    explanationEn: "I2C uses open-drain lines. If multiple devices share an address, both attempt to respond to queries simultaneously. This causes bus contention and corrupt responses, rendering both devices unresponsive."
  },
  {
    id: 30,
    questionAr: "أين تحفظ البيانات الحركية وقراءات الحساسات داخل متحكم ESP32 لضمان البقاء والاسترجاع عند إدخال المعالج في السبات العميق؟",
    questionEn: "Where must active variables and historical limits be stored in the ESP32 to prevent erasure during Deep Sleep?",
    optionsAr: [
      "في ذاكرة الـ Heap الخارجية شديدة الاستهلاك.",
      "في مسارات ذاكرة الـ RTC المخصصة (RTC Fast/Slow Memory) المجهزة برزمة `RTC_DATA_ATTR` البرمجية، لكونها ممهورة بمغذي التغذية الدائم خلال النوم.",
      "على ذاكرة الـ Cache السريعة للمعالج الأول.",
      "في ملفات التخزين المؤقت لشاشة الـ LCD."
    ],
    optionsEn: [
      "Within volatile Heap allocations which consume the most continuous power.",
      "In the dedicated non-volatile RTC memory blocks (RTC Fast or Slow SRAM) using the `RTC_DATA_ATTR` macro, which remain powered during sleep.",
      "Inside the high-speed L1 cache of the active Xtensa processor core.",
      "Inside the internal character generation register files of the LCD controller."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تفقد ذاكرة الوصول العشوائي القياسية (SRAM) كامل بياناتها عند دخول الـ Deep Sleep لإلغاء تغذيتها كهربائياً. توفر شريحة الـ ESP32 مساحة صغيرة 8 كيلوبايت تُسمى RTC RAM تظل مغذاة بالحد الأدنى من التيار لحفظ المتغيرات الهامة واسترجاعها فور اليقظة.",
    explanationEn: "Standard SRAM is powered down during Deep Sleep to reduce power consumption. The ESP32's 8KB RTC memory remains energized, allowing developers to preserve variables between sleep cycles using the `RTC_DATA_ATTR` attribute prefix."
  },
  {
    id: 31,
    questionAr: "ما هو السلوك الطبيعي لشجرة النخيل عند زيادة جفاف التربة وملوحتها وتجاوزها الحدود الموصى بها مائياً؟",
    questionEn: "How does the date palm biologically respond when soil dryness and salinity exceed safe thresholds?",
    optionsAr: [
      "تزيد النخلة من معدل امتصاص المياه المالحة دون قيود لتبريد الخلايا.",
      "تتعرض للجفاف الأسموزي (Osmotic Stress) حيث تعجز جذور النخلة عن سحب الماء من المحيط الملحي، مما يؤدي لذبول السعف وتراجع كمية ونوعية وجودة المحصول.",
      "تقوم باقتلاع جذورها للبحث عن مياه جوفية على أعماق أكبر.",
      "تفرز مادة شمعية مبردة تزيد معدل التحلل الكيميائي للأملاح."
    ],
    optionsEn: [
      "The palm actively boosts saline absorption to cool leaf temperatures.",
      "It undergoes osmotic stress wherein high salt concentrations block roots from absorbing moisture, leading to leaf desiccation, vascular restriction, and reduced date yield.",
      "It detaches its root system to search for lower-salinity aquifers elsewhere.",
      "It synthesizes high volumes of mineral-neutralizing waxes."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تسبب زيادة الملوحة حول جذور النخيل ارتفاع الضغط الأسموزي للتربة، مما يسحب الرطوبة عكسياً من الجذور الضعيفة إلى الخارج. يقيس نظامنا ملوحة TDS لإنذار المشرف قبل حدوث هذا التعطل الحاد لامتصاص النبات.",
    explanationEn: "High soil salinity lowers osmotic water potential. If the soil's osmotic pressure exceeds that of the root cells, water will flow out of the plant, causing dehydration even if the soil is visually damp. This requires TDS-guided cycles."
  },
  {
    id: 32,
    questionAr: "ما هو الضرر الزراعي الأساسي لزيادة وتراكم المياه (حالة ري فائض وغمر تام للتربة) حول جذوع أشجار النخيل؟",
    questionEn: "What is the primary agricultural hazard of soil waterlogging (excessive pooling) around date palm root zones?",
    optionsAr: [
      "تتكسر أوراق سعف النخيل العلوية لثقل الرطوبة الصاعدة.",
      "يحدث اختناق للجذور (Root Anoxia) لغياب وندرة الأكسجين بالتربة، مما يسبب تعفن الخلايا الجاذبة لنمو الفطريات وموت الجذور النشطة تدريجياً.",
      "تتحول التربة إلى مركب رملي هش لا يحمل الوزن الهيكلي للنخلة.",
      "تزداد نسبة السكر بالتمر لتصل لنسب مهددة للتخمير الموضعي."
    ],
    optionsEn: [
      "The excessive moisture makes the apical fronds brittle, causing structural collapse.",
      "It triggers root anoxia (oxygen starvation) because standing water blocks air pathways in soil pores, inducing anaerobic gas buildup, fungal decay, and root rot.",
      "The soil loses structural density, causing mature trees to tip over.",
      "It causes osmotic sugar concentrations to ferment, spoiling pre-harvest fruit."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تحتاج الخلايا الحية بجذور النخيل للتنفس الخلوي بالأكسجين المتخلل بمسام التربة، والغمر الزائد للمياه يطرد الهواء تماماً مما يمنع التنفس ويقود لنمو مستعمرات بكتيرية لاهوائية تعفن وتفتت الجذور النشطة للامتصاص.",
    explanationEn: "Roots require oxygen for cellular respiration. Waterlogging saturates soil pores, displacing soil air. This leads to anaerobic conditions (anoxia) and the accumulation of toxic compounds, damaging root tissues and encouraging root rot pathogens."
  },
  {
    id: 33,
    questionAr: "أية بنية برمجية في FreeRTOS تُفضل بشكل موثوق لنقل قراءات الحساسات بشكل فوري من روتين خدمة المقاطعة (ISR) إلى مهام العرض والري؟",
    questionEn: "Which FreeRTOS construct is standard for delivering sensor readouts from an Interrupt Service Routine (ISR) to logic tasks?",
    optionsAr: [
      "المتغيرات العامة المتذبذبة دون حظر أو كبح.",
      "رتل طوابير الانتظار التزامنية (Queues) المجهزة بدوال خاصة مثل `xQueueSendFromISR` لتفادي جمود التزامن وحفظ المزامنة الآمنة.",
      "ملفات القراءة والكتابة والوصول إلى فلاش الرقاقة لثوانٍ.",
      "كابل اتصال مادي إضافي يربط خلايا اللوحة ببعض تزامناً."
    ],
    optionsEn: [
      "Standard volatile global variables without synchronizing guards.",
      "Synchronous queues using ISR-safe API functions like `xQueueSendFromISR` to process data frames and preserve context switching safety.",
      "Direct write-to-flash actions within the interrupt handler.",
      "Adding a secondary hardware link that connects physical core ports explicitly."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعتبر رزمة الـ Queues من البنى الآمنة لمشاركة الموارد في أنظمة الوقت الحقيقي (RTOS)؛ حيث تمنع حدوث مشاكل سباق الموارد (Data Race conditions) وتوفر دوالاً مخصصة تعمل تحت المقاطعات بضوابط عزل بالغة الإحكام.",
    explanationEn: "In FreeRTOS, sharing global variables during execution interrupts leads to memory corruption. Using a queue with ISR-safe routines ensures thread-safe data passage, permitting orderly processing by target tasks."
  },
  {
    id: 34,
    questionAr: "ما هي الفائدة العملية والفيزيائية لتثبيت دائرة المخمد (RC Snubber Network) بالتوازي مع نقط تماس مرحلات المياه؟",
    questionEn: "What is the engineering purpose of applying a resistor-capacitor RC Snubber network across electromechanical relay contacts?",
    optionsAr: [
      "لزيادة توهين إرسال موجات بث الواي فاي المحيط.",
      "لقمع وإخماد الشرارة الكهربائية الناتجة عن القوة الدافعة الكهربائية العكسية عند فصل الأحمال الحثية لتأمين حرق نقاط التماس وإطالة عمر المرحل.",
      "لتسخين الأسلاك النحاسية بالبرودة القارسة في ليالي الشتاء.",
      "لبرمجة شدة استخلاص الطاقة من ناقلات الجهد المستمر."
    ],
    optionsEn: [
      "To increase the structural gain of nearby wireless antennas.",
      "To suppress and damp electrical arcing generated by high back-EMF when switching high-current inductive loads, preventing contact pitting and wear.",
      "To heat copper lines to maintain conductance during cold nights.",
      "To control battery charging ratios from external solar regulators."
    ],
    correctAnswerIndex: 1,
    explanationAr: "عند فصل المرحل لحمل حثي (مثل المضخة)، يحاول التيار مواصلة العبور عبر القفز فوق تلامسات المرحل مشكلاً قوساً كهربائياً شرارياً (Arcing). يمتص مكثف الـ Snubber مع المقاومة هذا التفريغ السريع الحاث للحرق حماية لنحاس المرحل.",
    explanationEn: "Switching heavy inductive loads causes contact bounce and huge voltage spikes. This vaporizes trace contact plating over time (pitting) and causes RF noise. An RC snubber Absorbs and dissolves this surge, extending contact life."
  },
  {
    id: 35,
    questionAr: "كيف يمكن لمشرف البرمجة تقليص استهلاك الطاقة الديناميكي لمتحكم ESP32 بمقدار ملحوظ دون إطفاء المعالجات تماماً؟",
    questionEn: "How can dynamic power consumption of the ESP32 be significantly reduced without putting the entire MCU to sleep?",
    optionsAr: [
      "بخفض التردد التشغيلي للمعالج (CPU Clock Frequency) برمجياً من 240MHz إلى 80MHz أو أقل بما يتوافق مع حاجة الكود.",
      "بزيادة دقة منافذ الـ ADC من 12-بت إلى 16-بت بالمعادلات.",
      "بربط المزيد من مقاومات الرفع على خطوط التوصيل المشترك.",
      "بإطفاء شاشات الـ LCD فورا وإلغاء تفعيل بروتوكول الـ I2C ثنائياً."
    ],
    optionsEn: [
      "By scaling down the CPU clock frequency from 240 MHz to 80 MHz or lower in firmware, matching execution needs.",
      "By increasing ADC resolution parameters from 12-bit to 16-bit mathematically.",
      "By adding pull-up resistors along the peripheral rails.",
      "By turning off the character LCD backlights and terminating the I2C interface lines."
    ],
    correctAnswerIndex: 0,
    explanationAr: "يتناسب استهلاك الطاقة الديناميكي للمعالجات الرقمية طردياً مع مربع الجهد والتردد (P = C * V^2 * f). خفض التردد لـ 80MHz يقلل استهلاك التيار من ~120mA إلى حوالي ~15mA فقط مع إبقاء جميع العمليات وقراءات المهام تعمل بانتظام وسلاسة.",
    explanationEn: "CMOS transient switching power is frequency-dependent. Standard ESP32 runs at 240 MHz, pulling substantial active currents. Clocking down the crystal firmware PLL to 80 MHz lowers power consumption dramatically while maintaining operation."
  },
  {
    id: 36,
    questionAr: "ما هي آلية التعويض الحراري المدمجة في صمام شريحة الساعة الحقيقية (DS3231 RTC) للحفاظ على توقيت ري ثابت وبدون انزياح سنوي؟",
    questionEn: "How does the DS3231 RTC maintain high accuracy of date palm irrigation times across searing summer temperatures?",
    optionsAr: [
      "تستخدم مكثفًا مائيًا صغيرًا لتبريد الوجه الخارجي للبلورة.",
      "تضم حساس حرارة مدمجاً ومكثفات متغيرة مدمجة لتعويض الانزياح الحراري لبلورة الكوارتز تلقائياً لتجنب تقديم أو تأخير الوقت.",
      "تبث رسائل مزامنة لاسلكية لأقرب راديو بحري بشط العرب.",
      "تعيد تهيئة المعالج بالكامل عند تفاوت حرارة الجو الخارجي."
    ],
    optionsEn: [
      "It uses a built-in fluidic capacitor to cool the crystal body physically.",
      "It integrates an internal temperature sensor and variable capacitor-arrays to compensate for thermal-induced quartz crystal frequency shifts.",
      "It transmits synchronized timing streams from nearby coastal beacons.",
      "It triggers a complete hardware reboot when high external temperatures are registered."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تتأثر بلورات الكوارتز بالصدمات الحرارية مسببة تسارعاً أو تباطؤاً بمعدل دقات الوقت. تجمع رقاقة الـ DS3231 حساساً للحرارة يصحح سعة شحن المكثفات حول الكوارتز آلياً، محطمة الانزياح ليكون أقل من دقيقتين بالعام تحت لظى مناخ البصرة الشديد.",
    explanationEn: "Piezoelectric crystals change properties with temperature, causing calendar drifts. The DS3231 is a Temperature-Compensated Crystal Oscillator (TCXO). It measures die temperature to fine-tune capacitance on its crystal lines."
  },
  {
    id: 37,
    questionAr: "كيف تختلف الظاهرة الفيزيائية المسماة (القصور الحراري للتربة - Soil Thermal Inertia) عن حرارة الغلاف الجوي المحيط بتمور البصرة؟",
    questionEn: "What is key about Soil Thermal Inertia compared to atmospheric climate variables?",
    optionsAr: [
      "حرارة الجو دائماً منخفضة والتربة دائماً مرتفعة الحرارة صيفاً.",
      "تتميز التربة بمقاومة جيدة للتغير الحراري السريع؛ حيث ترتفع وتنخفض درجة حرارة التربة العميقة ببطء شديد وتأخر زمني وافر مقارنة بالتغيرات الحادة والسريعة لطقس الهواء الخارجي الكلي.",
      "تمتص التربة الحرارة وتحتفظ بها لعدة أسابيع دون إمكانية فقدها.",
      "التربة لا تظهر أي تغيرات حرارية طوال فصول السنة."
    ],
    optionsEn: [
      "Soil thermal index is always higher than atmospheric variables, even in winter.",
      "Soil has high thermal inertia; deep soil temperatures change slowly and with a distinct time delay lagging behind rapid diurnal ambient air temperature swings.",
      "Subsurface soil absorbs heat and traps it permanently, preventing any loss.",
      "Soil exhibit zero thermal variation across seasonal transitions."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يقوم القصور الحراري للتربة بامتصاص وتلطيف الانعكاسات الحارة؛ فعند تتبعنا للحرارة تحت الأرض بواسطة مسبار DS18B20 المقاوم للماء نلاحظ ثباتاً غريباً يحمي جذور النخل ومستوعب المياه، مما يوضح الفرق بين ظروف البيئة العميقة وظروف الجو الخارجي للـ DHT22.",
    explanationEn: "Due to high thermal mass, soil functions as a thermal low-pass filter. While ambient air temperatures can fluctuate wildly, underground temperatures remain stabilized. This thermal delay protects root structures."
  },
  {
    id: 38,
    questionAr: "لماذا يصر مهندسو الشبكات على تثبيت جميع عقد تواصل ESP-NOW اللاسلكي على نفس قناة الراديو (Wi-Fi Channel)؟",
    questionEn: "Why is it important to synchronize all participating ESP-NOW nodes onto the same physical Wi-Fi RF channel?",
    optionsAr: [
      "لتجنب استهلاك مسارات الذاكرة العشوائية بمرحل تفعيل الصمام.",
      "لأن وحدات الإرسال والاستقبال اللاسلكية في الـ ESP32 لا يمكنها فك تشفير الحزم والنداءات إلا إذا كانت مضبوطة على نفس القناة الحاملة للتردد، والتفاوت يسبب فشل تسليم وفقدان دائم للحزم اللاسلكية.",
      "لمنع حدوث تماس كهربائي بالأطراف المعدنية التماثلية.",
      "لتوفير الطاقة عبر تفعيل قنوات التردد بالصوت فقط تلقائياً."
    ],
    optionsEn: [
      "To prevent dynamic heap allocation conflicts inside relay drives.",
      "Because standard ESP32 transceiver blocks operate sequentially on a single frequency band; nodes set to differing radio channels cannot hear or decode peer packets.",
      "To keep adjacent hardware pins from developing electrical short-circuits.",
      "To save power by activating frequency channels solely on acoustic triggers."
    ],
    correctAnswerIndex: 1,
    explanationAr: "في اتصال ESP-NOW، لا تُجري العقد أي عملية مزامنة أو تنقل آلي للقنوات كما يحدث بالراوتر؛ ويجب ضبط القناة يدوياً بالكود (مثلاً القناة 1) لجميع الأطراف وإلا ستضيع إشعارات الحساسات بالهواء بلا مستمع.",
    explanationEn: "Since ESP-NOW is connectionless, nodes do not negotiate and scan RF channels automatically. Operating channels must match explicitly; a node emitting on channel 1 cannot transmit to a receiver listening strictly on channel 6."
  },
  {
    id: 39,
    questionAr: "ما هو المبدأ الفيزيائي المتبع في دايود كبح الجهد العابر (TVS Diode) المضاف لحماية العقد من ضربات الصواعق وحقل الكهرباء الساكنة بالبصرة؟",
    questionEn: "What is the physical principle of a Transient Voltage Suppressor (TVS) diode protecting our outdoor IoT cards?",
    optionsAr: [
      "يقوم بامتصاص الرطوبة الكربوتية المحيطة بالصندوق الخشبي.",
      "يتميز بمقاومة عالية جداً في ظروف الجهد الطبيعي، لكنه ينهار وينخفض مقاومته بشكل مستنتج وفوري ليقود الجهد الزائد المدمر للأرضي (Shunt to Ground) عند حدوث ذروة جهد مفاجئ.",
      "يقوم بشحن بطارية المتحكم تلقائياً عند ضربات الصواعق.",
      "يزيد ممانعة معالجات التوهين اللاسلكي للرصيف ثنائياً."
    ],
    optionsEn: [
      "It absorbs localized humidity levels around the housing enclosure.",
      "It remains in a high-impedance state during normal operating levels, but collapses into low-impedance instantly during an overvoltage spike, shunting the surge safely to ground.",
      "It routes high-voltage lightning energy directly into charging batteries.",
      "It balances static antenna impedances automatically between transmitter blocks."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تقوم دايودات الـ TVS بصد وتفويض الجهود العابرة المدمرة الناتجة عن التفريغ الكهرستاتيكي (ESD) أو الحث الرعدي في الحقول المفتوحة، بقطع التوتر وتحديد مستوى السقف الآمن للجهد الذي تستقبله أرجل متحكم الـ ESP32.",
    explanationEn: "TVS devices clamp voltage transients. When a voltage spike crosses breakdown limits, the TVS diode breaks down, creating a low-resistance path to direct current safely to ground, limiting residual voltage to a safe ceiling."
  },
  {
    id: 40,
    questionAr: "ما هو الخطر الفني المحدق عند تلامس معدنين مختلفين (مثل النحاس والألمنيوم) في التمديدات الخارجية التماثلية بظروف ملوحة ورطوبة مزارع البصرة؟",
    questionEn: "What chemical hazard is encountered when bridging dissimilar metals in agricultural wiring under warm saline environments?",
    optionsAr: [
      "حدوث التفاعل المغناطيسي المغذي للأقطاب.",
      "حدوث التآكل الجلفاني (Galvanic Corrosion) بسبب فرق الجهد الكهروكيميائي بين المعدنين في وجود المحلول المائي المالح كريد الكتروليتي، مما يعطل ممر الإشارة سريعاً.",
      "تبخر وتطاير مسارات النحاس في الهواء وتحول الغلاف للون الأخضر.",
      "تغير قيمة مقاومة الممرات لتصبح سالبة الشحنة كهربائياً."
    ],
    optionsEn: [
      "Developing a supplementary inductive magnetic force that charges the loops.",
      "Galvanic corrosion, driven by electrochemical potential differences in the presence of saline humidity. This ruins conductor junctions and causes open-circuit failures.",
      "Spontaneous vaporization of physical conductor traces under hot summer climates.",
      "Altering physical connector resistance properties to become electrically negative."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يخلق تواجد الرطوبة الملحية الكثيفة بالتربة والجو بساط التوصيل الكيميائي بين المعادن المتباينة السلسة؛ مما يؤدي إلى تآكل المعدن الأنودي الأقل نبلاً بسرعة مذهلة وانقطاع ممر الحساس التماثلي لملوحة أو رطوبة التربة.",
    explanationEn: "Connecting materials with different electrode potentials in presence of salt moisture forms a galvanic cell. The anodic metal corrodes rapidly, creating high-resistance points or outright line failures."
  },
  {
    id: 41,
    questionAr: "كم يبلغ الحد الأقصى لعدد العقد الزميلة (Peers) غير المشفرة التي يمكن لمتحكم واحد من ESP32 تسجيلها والتخاطب معها ببروتوكول ESP-NOW؟",
    questionEn: "What is the maximum number of unencrypted peers that a single ESP32 can register in its ESP-NOW station table?",
    optionsAr: [
      "20 عقدة زميلة",
      "5 عقد فقط",
      "100 عقدة زميلة",
      "عدد غير محدود تماماً"
    ],
    optionsEn: [
      "20 peer nodes",
      "5 peer nodes",
      "100 peer nodes",
      "Unlimited peer registrations"
    ],
    correctAnswerIndex: 0,
    explanationAr: "يحدد نظام التشغيل الداخلي للراديو إطار تسجيل الأقران بحد أقصى 20 عقدة زميلة في حالة استخدام البث اللاسلكي العادي غير المشفر، وهو كاف لتغطية مصفوفات فرعية ممتازة من عقد المستشعرات بحقول التمور.",
    explanationEn: "Espressif's ESP-NOW implementation caps active table links. In standard versions, you can program up to 20 unencrypted peer MAC entries before memory table allocations reject supplementary nodes."
  },
  {
    id: 42,
    questionAr: "لماذا يجب الحذر والتحقق من حالة الدبوس GPIO 12 بالـ ESP32 عند إقلاع المتحكم من وضع قطع التيار؟",
    questionEn: "Why is careful handling of ESP32 strapping pin GPIO 12 critical at power-on-reset?",
    optionsAr: [
      "لأنه دبوس مخصص فقط لضخ الطاقة الحرارية لدوائر الشريحة.",
      "لأنه بمثابة دبوس تحديد جهد الذاكرة الوميضية (MTDI Boot Strap)؛ فإذا سُحب لجهد مرتفِع عند الإقلاع فسيجبر المتحكم على استخدام جهد 1.8V بدلاً من 3.3V للفلاش الوميضي مما يتسبب بفشل الإقلاع.",
      "لأنه يتلف شاشة الـ LCD إذا اتصل بمسار البيانات I2C.",
      "لأنه يعطل عمل منظمات الطاقة LM2596 البعيدة عتادياً."
    ],
    optionsEn: [
      "Because it acts as a heating pin designed to clear internal moisture condensation.",
      "Because it is the flash memory voltage boot loader latch (MTDI); drawing it HIGH at power-up forces internal LDOs to 1.8V instead of 3.3V, causing flash read corruption and boot loops.",
      "Because it shorts out the shared SDA path for LCD control metrics.",
      "Because it shuts down distant LM2596 buck converter switching arrays in hardware."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يعمل الدبوس GPIO 12 كحاسم لجهد ذاكرة الفلاش المدمجة (SPI Flash VDD)؛ فترك أية مدخلات تسحب هذا الدبوس للأعلى عند التشغيل يعوق المعالج عن قراءة برمجيات التشغيل المخزنة ليتوقف كلياً عن العمل برمز خطأ تالف.",
    explanationEn: "MTDI (GPIO 12) is a critical strapping pin that selects the operating voltage of internal SPI flash. Pulling GPIO 12 high forces flash voltages to 1.8V, making standard 3.3V flash modules fail on startup."
  },
  {
    id: 43,
    questionAr: "كيف يؤثر تغيير دقة قياس الحرارة (Resolution) لمسبار DS18B20 من 9-بت إلى 12-بت على سرعة المعالجة؟",
    questionEn: "How does modifying the temperature resolution of DS18B20 from 9-bit to 12-bit alter reading schedules?",
    optionsAr: [
      "تزيد الدقة من استهلاك الطاقة اللاسلكية باللوحة لثلاثة أضعاف.",
      "تمنحنا الدقة العالية قراءة بالغة التفصيل (0.0625°C) لكنها تزيد زمن التحويل الرياضي الرقمي بالداخل إلى حوالي 750 ملي ثانية لكل عينة.",
      "تسرع العملية برمتها لتتم في غضون 1 ميكروثانية فقط.",
      "تجبر المسبار الرقمي على استخدام كابل تيار رابع للحسابات."
    ],
    optionsEn: [
      "It boosts solar battery core currents to three times normal draws.",
      "It provides superior thermal precision (0.0625°C step resolutions) but increases internal analog-to-digital conversion times to a maximum of 750ms.",
      "It speeds up processing speeds to execute inside a single microsecond.",
      "It forces the 1-Wire bus to utilize a fourth physical communications trace."
    ],
    correctAnswerIndex: 1,
    explanationAr: "في مسبار DS18B20 يتطلب الحصول على قراءة عالية الفتح والترميز 12-بت زمناً لتنقية الشحنات داخل الأقطاب لتبلغ 750 ملي ثانية، وهو تفصيل هام يجب مراعاته برمجياً لتفادي حظر المعالجة المتزامنة للكود وحقن التأخير اللامتزامن.",
    explanationEn: "Internal thermal integration requires time. At 9-bit precision, conversion takes only 93.75ms. At 12-bit, resolving down to the standard 0.0625°C steps requires 750ms of waiting, needing non-blocking code routines."
  },
  {
    id: 44,
    questionAr: "كيف تساهم حركات المد والجزر في شط العرب في جعل نظام الري الذكي مجهزاً بقراءات الملوحة (TDS) حيوياً للنخيل؟",
    questionEn: "How does tidal salinity dynamics in Shatt al-Arab highlight the need for continuous TDS checking on farms?",
    optionsAr: [
      "تغير المد والجزر شكل السحب الفيزيائية وتمنع سقوط المطر.",
      "يتدفق اللسان الملحي الكربوني القادم من الخليج العربي نحو النهر عند المد الضعيف مع انخفاض الإمداد العذب مما يرفع قيم الملوحة بشكل فجائي وصادم للأشجار، فيتدخل الكاشف لحمايتها بري منظم من الآبار الاحتياطية.",
      "تمنع حركة المد ناقلات البيانات اللاسلكية من بث الإشارات.",
      "تسبب المد حركة تهتز معها جذور النخل وتحتاج لرفع مهارات التثبيت."
    ],
    optionsEn: [
      "Tide shifts alter local surface parameters, stopping storm progress.",
      "Tidal forces push a high-salinity marine water tongue from the Arabian Gulf deep into Shatt Al-Arab during seasonal low river runoff, triggering spikes that require irrigation shutoff and well redirection.",
      "High tides emit magnetic interferences that block ESP-NOW package routes.",
      "Tides vibrate physical ground layers, meaning root clamps require physical tuning."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعتبر ملوحة شط العرب شديدة التذبذب تزامناً مع المد البحري الخليجي في جنوب العراق. المراقبة التلقائية للـ TDS عبر العقدة الذكية توفر تتبعاً فورياً للأملاخ وحفظ استدامة مزارع نخيل البصرة وصحة غرساتها الحساسة.",
    explanationEn: "Basra agricultural lands face brackish tide intrusions. Continuous TDS monitoring detects these pulses as they occur, stopping valves before high-sodium water harms salt-sensitive soils and root systems."
  },
  {
    id: 45,
    questionAr: "ما هو المدى الفعلي والمسموح لقراءة الرطوبة النسبية لحساس DHT22 مع تحديد نسبة الدقة المعيارية؟",
    questionEn: "What is the physical humidity measurement range and typical precision of the DHT22 climate sensor?",
    optionsAr: [
      "من 50% إلى 100% بدقة انحراف تفوق ±20%.",
      "من 0% إلى 100% رطوبة نسبية مع دقة ممتازة تتراوح بين ±2% و ±5%.",
      "من 10% إلى 50% فقط للوقاية من الصدأ بالممرات.",
      "لا يقيس الرطوبة الجوية بل رطوبة الأراضي الطينية فقط."
    ],
    optionsEn: [
      "From 50% to 100% relative humidity with error margins past ±20%.",
      "From 0% to 100% Relative Humidity (RH) with typical core precision between ±2% and ±5%.",
      "From 10% to 50% bounds only to avoid condensation inside electronic screens.",
      "It only measures direct mud moisture instead of ambient air values."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يتفوق حساس الـ DHT22 على النسخة العادية DHT11 بنطاق قراءته الشامل من 0 إلى 100 بالمئة للرطوبة، وبدقة تتبع حراري بالغة الحساسية، مما يجعله ملائماً تماماً للأبحاث والنطاق التطبيقي للحقول المفتوحة.",
    explanationEn: "In contrast to cheap DHT11, the DHT22 features a capacitive humidity element and high-precision thermistor capable of measuring full 0-100% humidity scales with tight tolerances."
  },
  {
    id: 46,
    questionAr: "ما هو مجس القياس التماثلي المدمج سيلكونياً بداخل شريحة ESP32 والذي يمكن استخدامه لاختبار الحركية بظروف المغناطيس دون حساسات خارجية؟",
    questionEn: "Which native analog-sensing peripheral is embedded on-die inside the ESP32 silicon?",
    optionsAr: [
      "حساس تسارع الجاذبية ثلاثي المحاور.",
      "مستشعر تأثير هول المدمج (Built-in Hall Effect Sensor) والذي يتغير جهد خرج قراءته تزامناً مع تغير خطوط المجال المغناطيسي المار فوق الشريحة.",
      "حساس الضغط الجوي المائي المتقدم.",
      "مجس ريزونانس الموجات الكهرستاتيكية للخلية اللاسلكية."
    ],
    optionsEn: [
      "A native three-axis gravity accelerometer.",
      "An integrated Hall Effect Sensor on the die, which registers voltage changes when exposed to magnetic fields passing over the chip packaging.",
      "A barometric water pressure altitude transducer.",
      "An electrostatic wave resonance sensor designed to filter wireless cells."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تحتوي شريحة ESP32 على مستشعر تأثير هول داخلي يتصل تماثلياً مع مكبرات ومحولات الـ ADC المدمجة بالبنية، وهو مفيد لكشف الاختراقات الأمنية وموقع غلق أبواب الصناديق المعدنية عبر قراءة مغناطيسات مدمجة.",
    explanationEn: "The ESP32 features built-in Hall effect sensors on Silicon. When magnetic lines traverse the packaging, the sensing element detects dynamic micro-volt shifts, which are internally routed to the ADC."
  },
  {
    id: 47,
    questionAr: "لماذا تصاب القراءات التناظرية لوحدة الـ ADC بمتحكم ESP32 بعدم الخطية (Non-Linearity) عند استهداف الأطراف القصوى بالقرب من 0V أو 3V؟",
    questionEn: "Why does the native ESP32 ADC suffer from non-linear response curves near its extreme limits (0V and 3V)?",
    optionsAr: [
      "بسبب غارات الترددات اللاسلكية الصادرة عن هوائيات خادم البث.",
      "بسبب التصميم الداخلي لمقارنات شريحة الـ ADC (12-bit SAR) والتي تعاني طبيعياً من منطقة ميتة (Dead Zones) في المنحى المنخفض والمنحى شديد التشبع بالقرب من مرجعيات الطاقة.",
      "لأن خزان الطاقة الخارجي يقلل من ترميز النبضات عشوائياً.",
      "بسبب استهداف مجسات الاستشعار النحاسية لموجات مالح المياه."
    ],
    optionsEn: [
      "Because of continuous RF pulse transmissions from the Wi-Fi transceiver module.",
      "Due to the design limitations of the integrated 12-bit Successive Approximation Register (SAR) ADC, which exhibits dead zones and saturation near 0V and 3.3V rails.",
      "Because power supply rails reduce internal DAC bits dynamically during high computations.",
      "Because soil moisture pins degrade reading linearity through variable conductance spikes."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعتبر هذه اللاخطية من العيوب المعروفة بعتاد ESP32؛ حيث يفشل المحول التماثلي في التمييز الدقيق بين الجهود الأقل من 0.1V والجهود المتخطية لـ 3.1V (حالة تشبع). يعالج مطورو كود مزارع النخيل هذه المعضلة باستخدام قنوات معايرة هجينة وجداول تعويض رياضية لمعايرة التربة والملوحة.",
    explanationEn: "The ESP32's SAR ADC curve is non-linear at margins. Voltages below ~100mV register as 0, and voltages above ~3.13V (at 11dB attenuation) saturate at 4095. Custom polynomial code routines are used to straighten these outputs."
  },
  {
    id: 48,
    questionAr: "ما الميزة الفنية الأساسية التي يتفوق بها ناقل الاتصال المتوازي SPI على ناقل الـ I2C ثنائي السلك في الأنظمة الرقمية؟",
    questionEn: "What is the primary architectural advantage of the SPI bus protocol over the 2-wire I2C protocol?",
    optionsAr: [
      "توفيره لخط اتصال أحادي موفر لثماني قنوات مستقلة.",
      "يدعم اتصال اتجاهي كامل (Full-Duplex) وسرعات نقل تبلغ عشرات الميجاهرتز (MHz)، مما يجعله أسرع بكثير من الـ I2C الذي يدعم الاتجاه النصفي وسرعات أبطأ.",
      "عمله بدون سلك أرضي مشترك لسلامة العقد.",
      "تأمين اتصال الحساسات بمسافة حقلية تتجاوز 1000 متر دون توهين."
    ],
    optionsEn: [
      "Its ability to run unidirectional loops using a single signal trace.",
      "It supports Full-Duplex communications and achieves data transfer rates of dozens of MHz, vastly outperforming I2C's Half-Duplex master-slave limits.",
      "Its capability to resolve serial signals without sharing a physical common ground track.",
      "Its ability to transmit low-voltage sensor lines past 1000 meters without signal degradation."
    ],
    correctAnswerIndex: 1,
    explanationAr: "بينما يتطلب ناقل I2C سلكين فقط لخدمة أجهزة متعددة وعناوين مبرمجة، يبرز ناقل SPI كوسيط سرعة من الطراز الأول لنقل شاشات العرض الملونة الرسومية وبطاقات الذاكرة مضحياً بأطراف منافذ إضافية لتوصيل خطوط العقد المتعددة.",
    explanationEn: "SPI uses dedicated hardware channels (MOSI, MISO, SCK) to enable simultaneous read/write cycles. Operating without address protocols or pullup delays, its clocks run much faster than standard I2C channels."
  },
  {
    id: 49,
    questionAr: "كيف تعمل رزمة ساعة المراقبة للحارس البرمجي (Task Watchdog Timer - TWDT) في تأمين نظام ري النخيل من الفشل الذاتي؟",
    questionEn: "How does the Task Watchdog Timer (TWDT) safeguard the plantation's embedded systems from software locks?",
    optionsAr: [
      "بمراقبة منسوب مياه السحب بالصمام الرئيسي.",
      "بمطالبة الكود بتغذية الحارس وإعادة تصفير العداد بانتظام (Kicking the Dog)، وإذا تجمدت مهمة أو دخلت بحقة ميتة دون الرد فستقوم الساعة بقطع العملية وإعادة إقلاع الشريحة تلقائياً.",
      "بتقليل فترات تشغيل مراوح التهوية عند حدوث تجمد.",
      "ببث نداءات رادارية لأجهزة المشرف لتأكيدات النداءات البيئية."
    ],
    optionsEn: [
      "By physical monitoring of main reservoir inlet plumbing levels.",
      "By requiring active firmware loops to periodically reset (kick) a countdown timer, triggering a hardware system reboot if a thread freezes or locks up permanently.",
      "By lowering fan cycle speeds whenever a network conflict occurs.",
      "By sending local alarm warnings to active system administrators over external cellular bands."
    ],
    correctAnswerIndex: 1,
    explanationAr: "ساعة الكلب الحارس (Watchdog) هي حاميكم البرمجي الأمين؛ ففي حال تعثر المعالج في خضم حلقة انتظار معقدة لحل إشارة أو فقدان ناقل I2C، تنفد ثواني العداد ليقوم مجدول الرقاقة بفرض ريست قسري لإعادة إيقاظ وظائف الكارت الموزون.",
    explanationEn: "Software errors can stall execution. The hardware watchdog timer operates in the background. If critical loops fail to reset the watchdog timer within designated intervals, the watchdog assumes a crash and triggers a reboot."
  },
  {
    id: 50,
    questionAr: "ما الميزة الأساسية لبطاريات الليثيوم والحديد والفوسفات (LiFePO4) في تغذية عقد المستشعرات بحقول التمور صيفاً؟",
    questionEn: "Why are Lithium Iron Phosphate (LiFePO4) battery cells preferred for outdoor solar-recharged IoT sensor nodes?",
    optionsAr: [
      "تمثل مصدراً لجهود منخفضة تبهر المعالجات بالبرودة.",
      "تتمتع باستقرار كيميائي وهيكلي فائق للأمان ضد الانفجار تحت درجات الحرارة المحيطة المرتفعة بالبصرة (تتخطى 50°C)، مع عمر افتراضي طويل لدورات الشحن والتفريغ تفوق 2000 دورة.",
      "لا تحتاج لحمايات شحن خارجية وتتعامل مع الجهد العشوائي مباشرة.",
      "تقلص فترات تواصل العقد اللاسلكي لحفظ الشحنات أوتوماتيكياً."
    ],
    optionsEn: [
      "They deliver unique low-volt arcs that keep circuit boards cool in summer.",
      "They offer exceptional thermal and chemical stability, preventing explosions under high heat (exceeding 50°C), while yielding an extensive lifespan of over 2000 charge cycles.",
      "They operate without protection circuits and can tolerate raw overcharging voltage directly.",
      "They throttle wireless communication protocols automatically to preserve charge."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تعد بطاريات LiFePO4 التكنولوجيا الأقوى للمشاريع الحقلية المعزولة؛ حيث ترتفع كفاءتها تحت وهج الشمس مقارنة ببطاريات الليثيوم والبوليمر الحساسة للانتفاخ والانفجار، وتؤمن عائداً زمنياً طويلاً لتشغيل مصفوفة مجسات الاستشعار الريفي.",
    explanationEn: "LiFePO4 cells withstand hot temperatures without triggering thermal runaway (explosion hazards). They also support thousands of deep-discharge duty cycles, whereas standard LiPo batteries degrade within a year."
  },
  {
    id: 51,
    questionAr: "كيف تتم عملية نقل نبضات التحكم بداخل رقاقة عزل الـ PC817 Optocoupler دون حدوث اتصال مادي بالنحاس؟",
    questionEn: "How does the PC817 optocoupler inside the driver boards transmit control triggers without physical copper contact?",
    optionsAr: [
      "باستخدام مجالات مغناطيسية تولدها موجات الراديو في الهواء.",
      "عن طريق بث داخلي بالأشعة تحت الحمراء عبر ثنائي مضيء (IR LED) يستقبله ترانزستور ضوئي حساس معزول ميكانيكياً بمسافة قصيرة مبردة بالراتنج العازل.",
      "بالاعتماد على مستويات رطوبة التربة لتوصيل نبض منطقي ضعيف.",
      "بتقريب خطوط التوصيل النحاسي لدرجة التلامس الكهرستاتيكي النبضي."
    ],
    optionsEn: [
      "By utilizing localized radio frequencies in the micro-meter scale.",
      "By transforming input currents into infrared light pulses from an internal LED, which cross a tiny air or resin gap to activate an adjacent isolated phototransistor.",
      "By utilizing soil capacitance pathways to guide low-voltage trigger currents.",
      "By bringing dual copper paths close enough to trigger high-voltage static arcs."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يحقق العازل الضوئي عزلًا كهرومغناطيسيًا مثاليًا؛ فالجهة الحساسة من الكارت لا تشهد أي حركة لإلكترونات الجهة المشغلة عالية الفولت للريليه والصمامات، حاملاً نبض الإشارة بوسط وسيط نقي من الفوتونات الضوئية المعتمة.",
    explanationEn: "The input signal flows through an infrared LED, emitting photons across an insulating gap of transparent resin. These photons strike the base of a photodetector transistor, bringing it to saturation to bridge the output circuit."
  },
  {
    id: 52,
    questionAr: "ما هو المقدار التقريبي للسماحية الثنائية الكهربائية المطلقة لمياه الري النقية والتربة الجافة؟",
    questionEn: "What is the approximate scale difference in relative dielectric permittivity between air, dry soil, and water?",
    optionsAr: [
      "سماحية مياه الري تبلغ حوالي 80، بينما الهواء يساوي 1 والتربة الجافة تتراوح بين 3 و 5، مما يفسر التحسس الشديد للمجال السعوي للمياه.",
      "سماحية مياه الري تساوى 1 والتكامل الترابي يبلغ 1000 بالترميز المكثف.",
      "كل المواد بالطبيعة تشمل نفس النطاق الثنائي للكهرباء الساكنة بالكسر.",
      "تعتمد القيم على أطوار تواصل الراديو اللاسلكية بدوائر المعالجة."
    ],
    optionsEn: [
      "Water's relative dielectric index is ~80, while air is 1 and dry soil is between 3 to 5, which explains why capacitive fields are highly reactive to soil water changes.",
      "Water's dielectric constant is 1, and dry soil's permittivity is around 1000 in physical units.",
      "All physical earth materials share the exact same dielectric permittivity parameters.",
      "The value varies depending on the operational frequency of the wireless transceivers."
    ],
    correctAnswerIndex: 0,
    explanationAr: "يفسر هذا التباين الشاسع نجاح مستشعر الرطوبة السعوي؛ فارتفاع محتوى الماء بالتربة يزيد بشكل مهول ومضطرد من القدرة المكافئة لشحن المكثف المفتوح المحيط بالتربة مما يغير التردد المقاس لتحديد نسبة رطوبة الأراضي الطينية.",
    explanationEn: "Relative dielectric permittivity describes a material's capability to store charge. Because water has a very high dielectric constant (~80) compared to dry soil (~4) and air (1), small additions of water change soil system capacitance."
  },
  {
    id: 53,
    questionAr: "ما هي الظاهرة الهيدروليكية الضارة والمسماة بـ (مطرقة المياه - Water Hammer) وكيف يتلافاها نظام الري الذكي؟",
    questionEn: "What is the physical hazard of 'Water Hammer' in automatic solenoid distribution piping networks?",
    optionsAr: [
      "تآكل الإبر النحاسية بحساس الملوحة من الرذاذ المتطاير.",
      "تولد صدمة ضغط لحظية قوية وعنيفة بداخل الأنابيب عند غلق صمام الري الكهربائي الملفي بشكل مباغت وسريع جداً، مما يهدد بتفجير الممرات والمشتركات البلاستيكية.",
      "انسداد صمامات الري بسبب الرصف وتراكم ذرات الرمال في المزارع صيفاً.",
      "ارتداد مياه شط العرب للخارج مسبباً تغييراً بنسبة ترشيح الملوحة."
    ],
    optionsEn: [
      "Galvanic rust buildup on the sub-surface moisture sensor plates.",
      "An instantaneous hydraulic shockwave generated when a high-velocity flow is forced to stop abruptly (such as sudden solenoid shutoffs), threatening to rupture PVC pipes.",
      "Nozzle clogging induced by micro-sediment accumulation during agricultural cycles.",
      "A tidal reverse-flow that raises TDS levels inside upstream fresh reservoirs."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تحدث ظاهرة مطرقة المياه عند الإيقاف اللحظي للكتلة السائلة سريعة الحركة؛ حيث تتحول طاقة الحركة فورا لطاقة ضغط تسير كموجة صدمة مدمرة بالأنابيب. يتلافى نظامنا هذا الخطر بربط صمامات ري ذات إغلاق مخمد ناعم وتنظيم سقف الضغط بمضخات الطوارئ.",
    explanationEn: "Water hammer occurs when kinetic fluid energy is converted into pressure spikes due to an abrupt stop. Slow-closing solenoid valves, shock absorbers, or soft-starting pumps are used to protect high-pressure pipelines from structural failure."
  },
  {
    id: 54,
    questionAr: "أية خطة لإدارة الذاكرة (Memory Management Schemes) في مجمع FreeRTOS تُفضل لتجنب تجزؤ الذاكرة في التطبيقات الطويلة؟",
    questionEn: "Which FreeRTOS heap memory allocation scheme is optimal to prevent runtime memory fragmentation in long-running applications?",
    optionsAr: [
      "مخطط heap_1.c لكونه الأسرع بالتجربة.",
      "مخطط heap_4.c لأنه يمتلك استراتيجية لدمج كتل الذاكرة الشاغرة المتجاورة (Coalescing) لضمان مساحات مستمرة وتجنب تشتيت الهيب.",
      "مخطط heap_5.c لتقليص سعة المتغيرات اللامتناهية.",
      "لا يهم نمط التخصيص فالـ ESP32 يفرغ ذاكرته بشكل كامل كل دقيقة."
    ],
    optionsEn: [
      "The heap_1.c scheme, as it is the fastest during basic prototyping experiments.",
      "The heap_4.c scheme, which implements memory coalescing (merging adjacent free blocks) to combat heap fragmentation over thousands of dynamic allocations.",
      "The heap_5.c scheme, to limit variable sizes across multiple physical memory areas.",
      "Type of allocation does not matter, as the ESP32 flushes its standard RAM every minute."
    ],
    correctAnswerIndex: 1,
    explanationAr: "يوفر الكود والعتاد الخاص بمزارع النخيل ثبات تشغيل موثوق باستعمال مخطط الذاكرة heap_4؛ فبينما يكتفي heap_1 بالتخصيص دون إمكانية التحرير، يتيح heap_4 تحرير كتل الذاكرة الخاصة بهياكل قراءة الحساسات وإعادة دمجها آلياً حماية لنواة التشغيل.",
    explanationEn: "In long-running IoT devices, dynamic memory allocation can fragment the heap. The heap_4 allocator addresses this by combining adjacent freed blocks of RAM into larger contiguous blocks, keeping memory allocations stable."
  },
  {
    id: 55,
    questionAr: "لماذا تصبح كفاءة منظم الجهد الخطي (LDO Regulator) منخفضة جداً ومهدرة للطاقة عند خفض الجهد من 12V إلى 3.3V لتغذية الـ ESP32 مباشرة؟",
    questionEn: "Why is utilizing a Linear Regulator (LDO) to step down voltage from 12V to 3.3V highly inefficient and wasteful for batteries?",
    optionsAr: [
      "لأنها تعيق عمل بث شبكة ESP-NOW عن بعد.",
      "لأن منظم الجهد الخطي يبدد فارق الجهد الكبير (8.7V) بالكامل في صورة حرارة مهدرة (P = V_drop * I)، مما يستنزف طاقة التيار بينما المنظمات النبضية خافضة الجهد (Buck Converter) تعد كفؤة وتحفظ مخزون الطاقة.",
      "لأن المنظم الخطي يزيد من ملوحة وتوصيل ممرات مجسات الأقطاب باللوحة.",
      "لأنه يعمل بنصف الموثوقية برسم تفاوت تردد رادارات السفن."
    ],
    optionsEn: [
      "Because it acts as a high-frequency RF shield that blocks ESP-NOW transceivers.",
      "Because linear regulators burn off the voltage differential (8.7V) purely as waste heat (P = V_drop * I), whereas high-efficiency step-down switching (Buck) converters preserve energy.",
      "Because linear regulators increase galvanic corrosion on the sensor boards.",
      "Because it operates at half efficiency due to maritime radar interference."
    ],
    correctAnswerIndex: 1,
    explanationAr: "منظم الجهد الخطي يمرر نفس طاقة تيار الحمل عبر المقارنات الحرارية مع فقدان الطاقة بالفارق (12V - 3.3V)؛ وبذلك تتبدد طاقة ثمينة من البطاريات لتسخين الكارت، ولذلك اخترنا منظمات تيار النبض الذكي LM2596 التي تستخدم التبديل النبضي السريع بكفاءة تتجاوز 90%.",
    explanationEn: "Linear regulators drop voltage in a divider-like format. Passing 12V down to 3.3V at 100mA burns 0.87 Watts as heat, while only 0.33W powers the MCU (~27.5% efficiency). Switched-mode buck converters route current without linear burns."
  },
  {
    id: 56,
    questionAr: "ما هو المقدار التقريبي لقيم مقاومات الرفع والشد الداخلية (Internal Pull-Up Resistors) بمنافذ الـ GPIO لمتحكم ESP32 وهل تكفي للـ I2C؟",
    questionEn: "What is the approximate range of native ESP32 internal pull-up/pull-down resistors, and are they sufficient for high-speed I2C buses?",
    optionsAr: [
      "تتراوح بين 30kΩ إلى 80kΩ (بمعدل تقريبي 45kΩ)، ولا تكفي لشاشات وساعات الـ I2C السريعة مما يجعل المقاومات الخارجية إجبارية للموثوقية.",
      "تتراوح بين 1Ω إلى 10Ω وتعد كافية لجميع أنواع الشاشات والمحركات القوية.",
      "غير موجودة عتادياً ويجب تثبيتها يدوياً باستخدام كابل الطاقة.",
      "تبلغ حوالي 1MΩ وتدعم تفعيل قنوات التوهين اللاسلكي بدقة تماثلية."
    ],
    optionsEn: [
      "Between 30kΩ and 80kΩ (averaging ~45kΩ), and they are too weak for reliable high-speed I2C paths, which requires dedicated stronger external resistors.",
      "Around 1Ω to 10Ω, which is perfectly capable of driving high-current digital displays directly.",
      "They do not exist physically in the silicon and are purely modeled in simulation software.",
      "They are exactly 1MΩ, which is ideal for isolating active analog soil sensing probes."
    ],
    correctAnswerIndex: 0,
    explanationAr: "مقاومات الشد المدمجة بداخل شريحة ESP32 تسمى بالمقاومات الضعيفة (Weak Pull-ups) لارتفاع قيمتها. لتبادل المعلومات فائق الموثوقية والسريع لشاشات وساعات الـ I2C دون حدوث أخطاء تعليق وتوقيت على طول الأسلاك، يُنصح بإضافة مقاومات خارجية أقوى (2.2kΩ إلى 4.7kΩ).",
    explanationEn: "The ESP32's built-in pull-ups are weak (~45kΩ). In high-speed/long-line I2C setups, a weak pullup results in a high RC time constant, causing rounded signals and data corruption. External 4.7kΩ resistors are highly recommended."
  },
  {
    id: 57,
    questionAr: "كيف تختلف فعالية شحن الألواح الشمسية (Solar Charging Efficiency) لعقد مزارع النخيل صيفاً عند بلوغ درجات حرارة المحيط حدوداً تفوق 50°C؟",
    questionEn: "How does dynamic solar panel charging efficiency degrade as outdoor temperatures climb past 50°C during southern Iraqi summers?",
    optionsAr: [
      "تتزايد الكفاءة بشكل هندسي ضخم بسبب زيادة أشعة الشمس النشطة.",
      "تنخفض الكفاءة وصناعة الجهد (Voltage Production) للألواح الشمسية طردياً مع ارتفاع درجة الحرارة عن الحدود القياسية (25°C) نتيجة تفاوت ممانعة ممرات السيليكون.",
      "تظل ثابتة بدون تأثر لكون الألواح مغطاة بطبقة زجاج عازل تفريغي.",
      "تتحول الدائرة تلقائياً لسحب الطاقة التشغيلية من أقطاب الحساسات بالتربة."
    ],
    optionsEn: [
      "Efficiency climbs geometrically because of advanced photothermal conversion rates.",
      "Efficiency and open-circuit voltage output drop because silicon photovoltaic semiconductor performance drops as temperature rises past the 25°C standard testing baselines.",
      "Charging rates remain static due to protective vacuum-sealed anti-heat glass layers.",
      "The charging matrix shifts dynamically to draw ionic soil potential off underground probes."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تمتلك الألواح الفولتوضوئية ما يعرف بالمعادل الحراري للجهد؛ حيث ينخفض الجهد الأقصى للخلية بشكل ملحوظ لزيادة نشاط الأيونات والشحنات العكسية المهدرة بالطاقة مع ارتفاع درجة حرارة اللوح الشمسي السطحية، مما يتطلب تدارك حساب منظمات الطاقة والبطاريات بحكمة.",
    explanationEn: "All solar panels suffer from negative temperature coefficients. As temperature rises, the output open-circuit voltage of silicon cells drops due to increased carrier recombination. This requires planning high voltage margins."
  },
  {
    id: 58,
    questionAr: "ما هو الإجراء العتادي الأبسط لحماية عقد الري اللاسلكية المعرضة للجو من أضرار الكهرباء الإستاتيكية (ESD) والتشويش الكهرومغناطيسي؟",
    questionEn: "What is the best physical enclosure design practice to shield digital boards from high ESD and EMI surges?",
    optionsAr: [
      "استخدام خيوط من الصوف لتغليف المكونات المعدنية داخل العقد.",
      "استخدام صناديق بلاستيكية أو معدنية محكمة الغلق ومقاومة للعوامل الجوية (درجة IP65 أو أعلى)، مع تأريض الأجزاء المعدنية والشبك الأرضي الحامي من صواعق وتعرية الرمال صيفاً.",
      "إلغاء اتصال الأرض المشترك للبطاقات وتوجيهها نحو الممرات الخشبية.",
      "دهان اللوحة النحاسية بطبقة صبغ جيري عاكس للضوء كربونياً."
    ],
    optionsEn: [
      "Wrapping internal copper chips with dense woolen yarn to buffer static discharges.",
      "Securing cards inside IP65 or higher rated weatherproof enclosures, and tying metallic shield surfaces directly to earth ground lines to dissipate electrostatic discharges.",
      "Severing common ground loops and placing the boards on isolated wood frameworks.",
      "Coating overall PCB surfaces in lime-based light-reflective paint coatings."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تتعرض الأجهزة بمزارع التمور للهواء والأتربة العاصفة المحملة بالكهرباء الساكنة التي قد تخترق الكارت وتدمر بوابات السيليكون الحساسة بمتحكم الـ ESP32. الصناديق بتصنيف حماية IP65 المعزولة تبعد سحب الغبار وعوامل التآثر وتحفظ الكروت لسنوات.",
    explanationEn: "Outdoor nodes in dusty southern winds gather high static charges (ESD). A weather-sealed enclosure rated IP65 block dust/gases, and tying shielding panels straight to dedicated ground stakes diverts safe surges away from MCU logic lines."
  },
  {
    id: 59,
    questionAr: "كيف يمكن تأمين قنوات تواصل بروتوكول ESP-NOW اللاسلكي من التنصت والعبث ومحاولات غمر العقد بأوامر ري وهمية؟",
    questionEn: "How can ESP-NOW data frames in automated palm layouts be protected from malicious packet sniffing and relay hijacking?",
    optionsAr: [
      "بربط كابلات ألياف بصرية تحت الأراضي لتوصيل إشارات العقد.",
      "بتفعيل خوارزمية التشفير المدمجة بروتوكولياً (AES-128 Encryption) بنظام الاتصال اللاسلكي وتحديد مفتاح مفاضلة موحد (PMK) ورمز حماية المجموعات (LMK) لجميع العقد.",
      "بتعقيد برمجية تفعيل الري لتشمل تفعيل النور بالصوت.",
      "لا توجد حماية حقيقية للـ ESP-NOW ويجب استبداله بالبلوتوث حصراً."
    ],
    optionsEn: [
      "By adding physical military fiber-optic cables beneath the sand.",
      "By enabling hardware-accelerated AES-128 encryption features native to ESP-NOW, utilizing shared Primary Master Keys (PMK) and Local Master Keys (LMK) for authorization.",
      "By requiring voice activation algorithms before any water valves can trigger.",
      "No security features exist for ESP-NOW, which requires routing connections using standard Bluetooth."
    ],
    correctAnswerIndex: 1,
    explanationAr: "على الرغم من السرعة والخفة، يوفر بروتوكول ESP-NOW طبقة أمن نفاذة مدمجة؛ حيث يمكن إعداد حراسة تشفير الحزم باستخدام مفتاح تشفير مشترك يُثبت برمجياً بداخل بنية تسجيل الزملاء (Peers Definition) لمنع التنصت الخارجي.",
    explanationEn: "ESP-NOW supports AES-128 frames. Setting a Primary Master Key (PMK) on the access level and registering a Local Master Key (LMK) for each sensor node secures the wireless payloads from hijacking."
  },
  {
    id: 60,
    questionAr: "ما هو الاختلاف الجوهري في الاحتياج المائي لأشجار النخيل الفتية المزروعة حديثاً (الفسائل) مقارنة بأشجار النخيل البالغة المثمرة؟",
    questionEn: "How do dynamic watering requirements of young date palm offshoots differ from mature palms?",
    optionsAr: [
      "الفسائل الصغيرة بمزارع النخيل تحتاج لتوفير مياه عالية الملوحة لتشجيع الجذور.",
      "تحتاج الفسائل الفتية لري متقارب وتربة رطبة باستمرار لضعف جذورها السطحية، بينما تحتاج الأشجار البالغة لري عميق متباعد زمنيًا لتتبع جذورها الطويلة والممتدة للمياه العميقة.",
      "البالغة لا يتم ريها نهائياً لكونها تمتص مياه الجو بسحافة السعف.",
      "تتطلب الصغيرة رياً ضخماً بالغمر يطرد كامل الأكسجين من التربة."
    ],
    optionsEn: [
      "Young offshoots must be irrigated with highly saline waters to toughen root development.",
      "Young offshoots require frequent, shallow irrigation to keep roots moist while structural systems mature, whereas mature palms need deep, spaced watering cycles corresponding to deep roots.",
      "Mature date palms require zero irrigation as they absorb moisture from air humidity.",
      "Young shoots require continuous complete flooding that displaces all soil oxygen."
    ],
    correctAnswerIndex: 1,
    explanationAr: "تمتلك الفسائل الفتية نظام ري وحاجة حساسة جداً؛ فالرطوبة الزائدة للتربة تعفن جذورها الرقيقة والجفاف يقتلها لعدم قدرتها على النفاذ لعمق الأرض. يراعي نظامنا الذكي هذه الفصائل بمساعدة قياس حساسات الرطوبة وتتبع جداول الري المبرمجة بالـ RTC.",
    explanationEn: "Young offshoots have shallow, fragile roots. Underwatering kills them, while overwatering prompts root rot. Fully grown palms are drought-hardy, having roots that reach deeper ground aquifers, demanding spaced deep watering."
  }
];
