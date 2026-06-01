import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Safe lazy initialization of Gemini API
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Student details dictionary for server fallback or reference
  const studentsContext = `
اسم المشروع: نظام الري الذكي المدرك للملوحة لمزارع نخيل البصرة
المؤسسة: جامعة المعقل - كلية الهندسة - قسم هندسة التحكم والحاسبات (2024 - 2025)
الأستاذ المشرف: د. أيمن م. إسماعيل

الطلاب المشاركون وأدوارهم ومواضيعهم:
1. عبدالرحمن اياد عثمان (عبدالرحمن اياد):
   - المقدمة، العمود الفقري الزراعي، مشاكل الري بالغمر والملوحة وتأثيرها على نخيل البصرة، وهيكل العقد (Node Topology) في المزرعة.
   - يدير الشرائح من 1 إلى 4.

2. عباس هادي مطرود (عباس هادي):
   - معمارية متحكم ESP32، مشكلة المعالج والـ ADC حريجة المزامنة (تصادم قراءة ADC1 مع Wi-Fi/ESP-NOW على ADC2)، ومجسات الرطوبة السعوية ومبدأ عملها الفيزيائي لعزل الصدأ.
   - يدير الشرائح من 5 إلى 8.

3. علاء مهدي حمدان (علاء مهدي):
   - مجس المناخ الرقمي DHT22، مسبار الحرارة المقاوم للماء DS18B20 وناقل الـ 1-Wire، ومستشعر قطرات المطر العازل للغمر ومكافحة رطوبة الجو الزائفة.
   - يدير الشرائح من 9 إلى 12.

4. فهد طلال خليل (فهد طلال):
   - بروتوكول توزيع شبكة الإرسال الموزعة ESP-NOW، مصفوفة التغذية وخفض الجهد LM2596، وتدابير الحماية والوقاية الكهربائية بالاعتماد على العازل البصري PC817، والدايود الحمائي 1N5408 الطائر لمنع التيارات العكسية للمضخات والصمامات.
   - يدير الشرائح من 13 إلى 16.

5. محمد علي جواد (محمد علي):
   - معادلات معايرة التربة والملوحة الممتدة (Polynomials)، حسابات وتحليل استهلاك البطارية ودورة السبات العميق (Deep Sleep) لـ ESP32 لضمان تشغيل يدوم لـ 120 يوماً، وجدول تسعير المواد وحساب الجدوى الاقتصادية الكلية (BOM) البالغة 198,500 دينار عراقي فقط للنموذج.
   - يدير الشرائح من 17 إلى 20.
`;

  // Local intelligent fallback response generator
  const getLocalFallbackResponse = (studentId: any, question: string, language: string) => {
    const lowercaseQ = question.toLowerCase();
    let fallbackResponse = "";
    const isAr = language === "ar";

    if (isAr) {
      fallbackResponse = `مرحباً بك! أنا المستشار العلمي المدمج لمشروع ري نخيل البصرة بجامعة المعقل. (مساعد محلي مدمج نشط)

`;
      
      if (studentId == 1 || lowercaseQ.includes("عبدالرحمن") || lowercaseQ.includes("أياد") || lowercaseQ.includes("عثمان") || lowercaseQ.includes("الغمر") || lowercaseQ.includes("ري تقليدي") || lowercaseQ.includes("ملوح")) {
        fallbackResponse += `• مراجعة موضوع الطالب م. عبدالرحمن اياد عثمان (سياق الري والملوحة وبنية الشبكة):
- يقوم عبدالرحمن بشرح خطورة "الري بالغمر" (Traditional Flood Irrigation) في ريف البصرة؛ حيث تؤدي هذه الطريقة التقليدية إلى تبخر سريع للمياه المتراكمة مسببةً ترسب الملح السام حول جذور النخيل.
- يركز عبدالرحمن على هيكلية العقد الموزعة (Cluster Network Topology) للسيطرة على المياه؛ حيث تقسم المزرعة لعقد ريفية ترتبط بطريقة Point-to-Point.
- يعتمد نظام عبدالرحمن على قراءة مستشعرات الملوحة TDS لوقف الحقن التلقائي في حال ارتفاع ملوحة رافد شط العرب في فترة المد الأحمر لمنع تملح التربة وتلف الجزيئات العضوية وحماية قلب النخلة.`;
      }
      else if (studentId == 2 || lowercaseQ.includes("عباس") || lowercaseQ.includes("هادي") || lowercaseQ.includes("مطرود") || lowercaseQ.includes("esp32") || lowercaseQ.includes("معالج") || lowercaseQ.includes("سعوية") || lowercaseQ.includes("capacitive") || lowercaseQ.includes("adc")) {
        fallbackResponse += `• مراجعة موضوع الطالب م. عباس هادي مطرود (معمارية المعالج ومستشعر الرطوبة السعوي):
- يوضح عباس اختيار معالج ESP32 ذو النواة الثنائية (Tensilica Dual-Core) بتردد 240 ميجاهرتز لدعم الاتصال اللاسلكي الفوري والحسّ الحركي.
- حل عباس المشكلة التاريخية للـ ADC الحريج في ESP32؛ حيث يتشارك الراديو اللاسلكي Wi-Fi/ESP-NOW مع قنوات ADC2، مما يعطل قراءة الحساسات المتصلة بها أثناء البث اللاسلكي. الحل البرمجي تم بالاعتماد الحصري على قنوات ADC1 وتفعيل قفل المزامنة (SemaPhore Locks) ومكافحة التداخل المغناطيسي.
- يوظف المشروع مستشعرات الرطوبة السعوية (Capacitive Moisture Sensor v1.2) بدلاً من المقاومة؛ لأن المستشعرات السعوية لا تعرض النحاس للتعرية والتحلل الإلكتروني المباشر بالملوحة، مما يضمن كفاءة طويلة الأمد دون صدأ.`;
      }
      else if (studentId == 3 || lowercaseQ.includes("علاء") || lowercaseQ.includes("مهدي") || lowercaseQ.includes("حمدان") || lowercaseQ.includes("dht22") || lowercaseQ.includes("مسبار") || lowercaseQ.includes("ds18b20") || lowercaseQ.includes("حرارة") || lowercaseQ.includes("قطرات") || lowercaseQ.includes("مطر") || lowercaseQ.includes("مناخ") || lowercaseQ.includes("رطوبة")) {
        fallbackResponse += `• مراجعة موضوع الطالب م. علاء مهدي حمدان (المناخ الرقمي ومسبار الحرارة الفولاذي):
- مستشعر DHT22 (AM2302) الرقمي المميز: يقيس الحرارة من -40 إلى 80 مئوية (بدقة ±0.5م) والرطوبة النسبية من 0% إلى 100% (بدقة ±2%) على بروتوكول السلك الواحد الرقمي المحمي من التشويش المغناطيسي والجو الرطب العالي.
- مسبار DS18B20 الفولاذي المقاوم للماء: يوضع على عمق 30 سم لقياس درجة حرارة باطن التربة والطبقة الجذور معتمداً على بروتوكول 1-Wire Bus؛ مما يتيح ربط عشرات الحساسات عبر سلك رقمي واحد بفضل العنوان الفيزيائي الفريد (64-bit ROM) لكل مسبار.
- مجس الهطول المطري الذكي: يقوم بتأكيد وجود قطرات ماء فيزيائية لفصل الصمامات تلقائياً، مضافاً إليه حل دقيق لمنع قراءات الندى والضباب الزائف عن طريق تسخين ذاتي خفيف للمصفوفة النحاسية.`;
      }
      else if (studentId == 4 || lowercaseQ.includes("فهد") || lowercaseQ.includes("طلال") || lowercaseQ.includes("خليل") || lowercaseQ.includes("esp-now") || lowercaseQ.includes("حماية") || lowercaseQ.includes("عزل") || lowercaseQ.includes("بصري") || lowercaseQ.includes("optocoupler") || lowercaseQ.includes("pc817") || lowercaseQ.includes("lm2596") || lowercaseQ.includes("1n5408") || lowercaseQ.includes("دايود")) {
        fallbackResponse += `• مراجعة موضوع الطالب م. فهد طلال خليل (بروتوكول ESP-NOW والوقاية الكهربائية):
- بروتوكول ESP-NOW: شبكة لاسلكية من نوع P2P مخصصة للأجهزة الذكية منخفضة الطاقة، تمتاز بزمن ربط فائق السرعة (< 5 مللي ثانية) مقارنة بالـ Wi-Fi التقليدي، مما يحقق توفيراً مذهلاً في الطاقة للبطارية.
- العوازل الضوئية PC817 (Optocoupler Isolation): توفر عزلاً كهربائياً كاملاً (حتى 5000 فولت RMS) بين المعالج الحساس ESP32 وجهد تشغيل الملفات الحثية الصاخبة للمضخات (12 فولت). يتم نقل الإشارة برمجياً عبر الأشعة تحت الحمراء داخلياً دون تلامس فيزيائي، مما يحمي ESP32 تماماً من الاحتراق وتأثير التيارات الارتدادية.
- دايود الفرملة 1N5408 (Flyback Protection Diode): يربط على التوازي العكسي مع ملف الريليه لمنع التيارات العكسية عالية الجهد (Reverse EMF Spike) الناتجة من انهيار المجال المغناطيسي للملف لحظة الإغلاق، مما يحمي المنظومة كقفل أمامي قوي.
- منظم LM2596 Buck Converter لخفض الجهد الكفؤ من 12 فولت إلى 5 فولت للمعقمات دون ضياع الطاقة بشكل حراري.`;
      }
      else if (studentId == 5 || lowercaseQ.includes("معايرة") || lowercaseQ.includes("polynomial") || lowercaseQ.includes("سبات") || lowercaseQ.includes("deep sleep") || lowercaseQ.includes("بطارية") || lowercaseQ.includes("استهلاك") || lowercaseQ.includes("bom") || lowercaseQ.includes("كلفة") || lowercaseQ.includes("تسعير")) {
        fallbackResponse += `• مراجعة موضوع الطالب م. محمد علي جواد (المعايرة الرياضية وميزانية الطاقة والتسعير):
- معادلات المعايرة غير الخطية (Polynomial Calibration): صاغ محمد معادلات من الدرجة الثالثة لربط فرق الجهد المقاس بالرطوبة الفعلية ونسب الملوحة بدقة عالية متجاوزاً الانحرافات الطبيعية لمستشعرات التربة السعوية.
- حسابات ميزانية الطاقة والسبات العميق (Deep Sleep): يعتمد النظام على وضع النوم العميق لـ ESP32 حيث يتم تجميد كافة العمليات المعالجة وإيقاف الراديو، لينخفض استهلاك التيار إلى 15 ميكرو أمبير فقط. يستيقظ الجهاز لمدة 10 ثوانٍ كل ساعة لإجراء القراءات وإرسال البيانات لتشغيل يدوم لـ 120 يوماً متواصلاً بسعة بطارية 12V 7Ah.
- الجدوى الاقتصادية وفاتورة المواد (BOM): بلغت تكلفة الإنتاج والقطع الفعلية للنموذج الأولي 198,500 دينار عراقي فقط، وهي كلفة معقولة للغاية.`;
      }
      else {
        fallbackResponse += `يتضمن مشروعنا رصداً علمياً متكاملاً لري بساتين النخيل بالبصرة بشكل مدرك لملوحة شط العرب ومكافح للري بالغمر وتملح ريف الفاو وأبي الخصيب.
تم تصميم كود العقد الموزعة بتقنيات ESP-NOW وعزل الأوبتوكبلر PC817 وحساب ميزانية استهلاك الطاقة الكلية بدقة متناهية تحت إشراف د. أيمن م. إسماعيل.
يرجى توجيه تفاصيل سؤالك حول أحد المواضيع:
- الري والملوحة (عبدالرحمن)
- الـ ESP32 والـ ADC والـ Capacitive Sensors (عباس)
- مجسات الحرارة والرطوبة والمطر DHT22, DS18B20 (علاء)
- بروتوكول ESP-NOW ومنظمات الفولتية وحماية PC817 والدايود 1N5408 (فهد)
- معادلات المعايرة والسبات العميق وفاتورة المواد الكلية البالغة 198,500 دينار عراقي (محمد)`;
      }
    } else {
      fallbackResponse = `Welcome! I am the embedded Academic Advisor for the Al-Maaqal University Smart Palm Irrigation capstone project. (Internal Offline Mode)

`;

      if (studentId == 1 || lowercaseQ.includes("abdulrahman") || lowercaseQ.includes("flood") || lowercaseQ.includes("irrigation") || lowercaseQ.includes("salinity")) {
        fallbackResponse += `• Review of student Eng. Abdulrahman Ayad Othman (Soil Salinity & Node Topology):
- Abdulrahman addresses the dangers of "Traditional Flood Irrigation" in Basra palm fields. Flood irrigation causes rapid evaporation of standing water, concentrating toxic salt crusts around the date palm root zone.
- He designed the distributed Node Network Topology (Cluster Layout) of the fields, connecting modules via p2p links.
- Uses TDS sensors to dynamically stop irrigation during high salinity water influxes in Shatt Al-Arab, preserving palm cores from salt overload.`;
      }
      else if (studentId == 2 || lowercaseQ.includes("abbas") || lowercaseQ.includes("esp32") || lowercaseQ.includes("microcontroller") || lowercaseQ.includes("capacitive") || lowercaseQ.includes("adc")) {
        fallbackResponse += `• Review of student Eng. Abbas Hadi Matroud (ESP32 CPU & Soil Probes):
- Abbas justifies using the dual-core Tensilica ESP32 processor running at 240 MHz to handle rapid local logic and low latency wireless transmissions.
- He solved the ADC conflict on ESP32, where Wi-Fi/ESP-NOW functions occupy ADC2 channels, locking any sensors connected to them. His code relies exclusively on ADC1 and implements semaphore locks for synchronization.
- Utilizes Capacitive Soil Moisture Sensors (v1.2) over resistive ones because capacitive plates are insulated from direct electrolytic action with salt water, preventing copper oxidation.`;
      }
      else if (studentId == 3 || lowercaseQ.includes("alaa") || lowercaseQ.includes("dht22") || lowercaseQ.includes("ds18b20") || lowercaseQ.includes("temperature") || lowercaseQ.includes("rain") || lowercaseQ.includes("sensor")) {
        fallbackResponse += `• Review of student Eng. Alaa Mahdi Hamdan (DHT22 Climate & DS18B20 Water Probes):
- DHT22 (AM2302) Digital Sensor: Accurately monitors ambient temperature (-40 to 80°C, ±0.5°C) and relative humidity (0 to 100%, ±2%) using a digital single-bus protocol.
- DS18B20 Waterproof Probe: Positioned 30cm deep in the soil to monitor root-zone soil temperature. Uses 1-Wire Bus allowing multiple sensors to be hooked to a single pin via their unique 64-bit ROM addresses.
- Rain Drop Detector: Implements a smart condensing filter with on-board subtle copper heating to avoid fake high-moisture triggers caused by humid fog or morning dew.`;
      }
      else if (studentId == 4 || lowercaseQ.includes("fahad") || lowercaseQ.includes("esp-now") || lowercaseQ.includes("pc817") || lowercaseQ.includes("isolation") || lowercaseQ.includes("buck") || lowercaseQ.includes("diode")) {
        fallbackResponse += `• Review of student Eng. Fahad Talal Khalil (ESP-NOW & Electrical Protection):
- ESP-NOW Protocol: High speed connection (< 5ms setup compared to standard Wi-Fi router overheads) for low-latency, ultra low-power peer-to-peer data transfers.
- PC817 Optocoupler Isolation: Completely isolates the low-voltage ESP32 logic circuitry from high inductions/spikes generated by the 12V water pumps and solenoid coils.
- 1N5408 Flyback Protection Diode: Connected in reverse-parallel with inductive load magnetic relays to clamp voltage spikes (Reverse EMF) generated during switching events, saving the microprocessor.
- LM2596 Buck Converter: Safely steps down the 12V battery power source to 5V with high efficiency compared to linear regulators.`;
      }
      else if (studentId == 5 || lowercaseQ.includes("calibration") || lowercaseQ.includes("polynomial") || lowercaseQ.includes("sleep") || lowercaseQ.includes("battery") || lowercaseQ.includes("bom")) {
        fallbackResponse += `• Review of student Eng. Mohammed Ali Jawad (Calibration Curve, Power Budget & BOM cost):
- Polynomial Calibration: Mohammed derived 3rd-order fitting equations to calibrate ADC readings into exact volumetric moisture content and TDS ppm values.
- Sleep Budget Analysis: Utilizes ESP32 Deep Sleep shutting down the CPU core and radios down to 15 µA. The node wakes up for 10s per hour to report data drawing 180 mA, keeping a 12V 7Ah battery alive for 120+ days.
- BOM & Feasibility: The total system prototype cost was documented at exactly 198,500 IQD, making it incredibly cost-effective.`;
      }
      else {
        fallbackResponse += `This is the smart salinity-aware date-palm irrigation project of Al-Maaqal University under the supervision of Dr. Ayman M. Ismaiel.
Please ask about any specific topic or student sub-system (Abdulrahman on Salinity, Abbas on ESP32/ADC, Alaa on Climate/DHT22, Fahad on PC817 Optocouplers/ESP-NOW, or Mohammed on Deep Sleep/BOM).`;
      }
    }

    return fallbackResponse;
  };

  // API Endpoint for Student Q&A Search Tool
  app.post("/api/student-query", async (req, res) => {
    try {
      const { studentId, question, language = "ar" } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question is required." });
      }

      // Check if Gemini Client is available
      const ai = getGeminiClient();

      if (ai) {
        try {
          // If Gemini client is active, prepare beautiful systemic prompt
          const systemInstruction = `You are "مساعد مشروع المعقل الذكي" (Al-Maaqal Smart Capstone AI Advisor), an elite academic engineer model.
You have access to the complete graduation project report for the academic year 2024-2025.
University: جامعة المعقل (Al-Maaqal University) - كلية الهندسة (College of Engineering) - قسم هندسة التحكم والحاسبات والأتمتة (Dept. of Control and Computer Engineering).
Project Title: نظام الري الذكي المدرك للملوحة لمزارع نخيل البصرة (Smart Salinity-Aware Irrigation Controller for Basra Date Farms).
Project Supervisor: الأستاذ المشرف الدكتور أيمن م. إسماعيل (Dr. Ayman M. Ismaiel).

Here is the exact team member breakdown and their master subjects:
${studentsContext}

Answer the user's question with utmost scientific rigor and high-quality detail. Follow these absolute constraints:
1. Ground your answers strictly on the actual project details above. If requested, cite the slides owned by the student.
2. If asked in Arabic (العربية), answer in professional, eloquent, technical Arabic. If asked in English, answer in English.
3. Be respectful and refer to students as distinguished engineering students of Al-Maaqal University.
4. Keep the answer highly focused and educational. Keep it around 1-3 concise paragraphs, neatly formatted. Don't mention system variables or model configs.`;

          const prompt = `Let's answer this question: "${question}".
Target Student Context Selected: ${studentId === "all" ? "Whole Team" : `Student ID: ${studentId}`}`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });

          return res.json({ response: response.text, isFallback: false });
        } catch (genAiErr: any) {
          console.warn("Gemini API call failed, automatically falling back to fully local high-fidelity advisor database:", genAiErr);
          const fallbackResponse = getLocalFallbackResponse(studentId, question, language);
          return res.json({ response: fallbackResponse, isFallback: true });
        }
      } else {
        const fallbackResponse = getLocalFallbackResponse(studentId, question, language);
        return res.json({ response: fallbackResponse, isFallback: true });
      }
    } catch (err: any) {
      console.error("Global student-query route error:", err);
      // Even if everything fails, we do not throw an HTTP 500. We fall back to standard local response!
      try {
        const { studentId, question, language = "ar" } = req.body || {};
        const fallbackResponse = getLocalFallbackResponse(studentId || "all", question || "", language || "ar");
        return res.json({ response: fallbackResponse, isFallback: true });
      } catch (nestedErr) {
        return res.status(500).json({ error: "Something went wrong processing your request." });
      }
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
