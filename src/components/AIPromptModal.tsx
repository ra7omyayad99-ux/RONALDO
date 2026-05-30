import React, { useState } from "react";
import { Sparkles, X, Loader2, Lightbulb, Check } from "lucide-react";
import { Question } from "../types";
import { getBackendUrl } from "../utils/api";

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: Question[]) => void;
}

const TOPIC_PRESETS = [
  { name: "ثقافة عامة وتاريخ", icon: "🌍", topic: "المعلومات العامة التاريخية والجغرافية والثقافة العامة" },
  { name: "رياضة وكرة قدم", icon: "⚽", topic: "رياضة كرة القدم العالمية والعربية، البطولات الكبرى واللاعبين التاريخيين" },
  { name: "فضاء وعلوم", icon: "🧪", topic: "العلوم العامة، الفضاء، الاختراعات، الأحياء والفيزياء بطريقة مشوقة وكوميدية" },
  { name: "أسئلة دينية وإسلامية", icon: "🕌", topic: "التاريخ الإسلامي، الأنبياء والقرآن الكريم والصحابة" },
  { name: "مسلسلات وأفلام", icon: "🎬", topic: "سينما عالمية وعربية، مسلسلات كرتونية وشخصيات شهيرة" },
  { name: "ألعاب وفيديو جيرز", icon: "🎮", topic: "عالم ألعاب الفيديو القديم والجديد، شركات الألعاب والشخصيات الأيقونية" },
  { name: "فوازير وألغاز ذكاء", icon: "🧠", topic: "ألغاز ذكاء رياضية وفوازير تتطلب تفكير عميق ومرحة" }
];

export default function AIPromptModal({ isOpen, onClose, onQuestionsGenerated }: AIPromptModalProps) {
  const [topic, setTopic] = useState("");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate(selectedTopic?: string) {
    const finalTopic = selectedTopic || topic;
    if (!finalTopic.trim()) {
      setError("الرجاء إدخال اسم الموضوع أو اختيار تصنيف جاهز.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(getBackendUrl() + "/api/generate-questions-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic, amount })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ غير متوقع أثناء توليد الأسئلة.");
      }

      if (data.questions && data.questions.length > 0) {
        onQuestionsGenerated(data.questions);
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setTopic("");
        }, 1500);
      } else {
        throw new Error("لم ترجع خوادم الذكاء الاصطناعي أية أسئلة.");
      }
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالذكاء الاصطناعي. يرجى مراجعة إعدادات مفتاح Gemini.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-right" dir="rtl">
      <div 
        id="ai-modal-card"
        className="relative w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              توليد أسئلة ذكية بـ Gemini AI
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-400">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold">تم توليد الأسئلة بنجاح!</p>
            <p className="text-xs text-gray-400 mt-1">جرى استيراد الأسئلة للمكتبة الخاصة بالمسابقة.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex items-start gap-2 text-indigo-200">
              <Lightbulb className="w-5 h-5 shrink-0 text-yellow-500 mt-0.5" />
              <p className="text-xs leading-relaxed">
                اكتب أي تصنيف أو موضوع يخطر في بالك (مثال: دول الغد والكرتون القديم، أسئلة صعبة للمبرمجين)، وسيقوم موديول الذكاء الاصطناعي بصباغة عدد مخصص من الأسئلة بأجوبتها المباشرة فوراً!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">عدد الأسئلة المطلوبة:</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAmount(num)}
                    className={`py-2 text-sm rounded-xl font-medium border transition-all duration-200 ${
                      amount === num
                        ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                        : "bg-gray-800 border-gray-750 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                  >
                    {num} أسئلة
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="topic-input" className="block text-sm font-medium text-gray-300 mb-1">اكتب موضوعاً مخصصاً:</label>
              <div className="relative">
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: عواصم العالم، تاريخ الأندلس، أسئلة طبية..."
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-white outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">أو اختر من المواضيع الجاهزة للسرعة:</label>
              <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                        setTopic(preset.name);
                        handleGenerate(preset.topic);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 text-right p-2.5 bg-gray-800/50 hover:bg-gray-800/90 hover:border-purple-500/50 transition-all border border-gray-850 rounded-xl group"
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <span className="text-xs font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs leading-relaxed">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all duration-250 hover:shadow-lg flex items-center justify-center gap-2 shadow-purple-600/20 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
                    <span>جاري التوليد بالذكاء الاصطناعي...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>توليد وحفظ للسلسلة</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 rounded-xl font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
