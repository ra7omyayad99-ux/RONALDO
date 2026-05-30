import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, Sparkles, Check, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Question } from "../types";
import AIPromptModal from "./AIPromptModal";

interface QuestionManagerProps {
  questions: Question[];
  onUpdateQuestions: (updated: Question[]) => void;
}

export default function QuestionManager({ questions, onUpdateQuestions }: QuestionManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Form State
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [points, setPoints] = useState(10);
  const [formError, setFormError] = useState("");

  function handleSaveNew() {
    if (!text.trim()) {
      setFormError("يرجى إدخال نص السؤال أولاً.");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setFormError("يرجى ملء جميع الخيارات الأربعة للسؤال.");
      return;
    }

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: text.trim(),
      options: options.map(o => o.trim()),
      correctIndex,
      points
    };

    onUpdateQuestions([...questions, newQuestion]);
    resetForm();
  }

  function handleSaveEdit(id: string) {
    if (!text.trim()) {
      setFormError("يرجى إدخال نص السؤال أولاً.");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setFormError("يرجى ملء جميع الخيارات الأربعة للسؤال.");
      return;
    }

    const updated = questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          text: text.trim(),
          options: options.map(o => o.trim()),
          correctIndex,
          points
        };
      }
      return q;
    });

    onUpdateQuestions(updated);
    resetForm();
  }

  function startEdit(q: Question) {
    setEditingId(q.id);
    setIsAddingNew(false);
    setText(q.text);
    setOptions([...q.options]);
    setCorrectIndex(q.correctIndex);
    setPoints(q.points);
    setFormError("");
  }

  function handleDelete(id: string) {
    const filtered = questions.filter(q => q.id !== id);
    onUpdateQuestions(filtered);
  }

  function startAdding() {
    setIsAddingNew(true);
    setEditingId(null);
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setPoints(10);
    setFormError("");
  }

  function resetForm() {
    setEditingId(null);
    setIsAddingNew(false);
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setPoints(10);
    setFormError("");
  }

  function handleOptionChange(index: number, val: string) {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  }

  function handleAIQuestionsGenerated(generated: Question[]) {
    // Merge or overwrite questions. Let's append to existing set!
    onUpdateQuestions([...questions, ...generated]);
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            مكتبة الأسئلة المخصصة للمباراة
            <span className="text-xs font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              {questions.length} سؤال
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">يمكنك إضافة بنك أسئلتك يدوياً أو استخدام توليد الذكاء الاصطناعي لـ Gemini.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition duration-200"
          >
            <Sparkles className="w-4 h-4" />
            توليد ذكي بـ Gemini
          </button>
          {!isAddingNew && !editingId && (
            <button
              type="button"
              onClick={startAdding}
              className="flex items-center gap-1 text-xs font-bold px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              أضف سؤالاً يدوياً
            </button>
          )}
        </div>
      </div>

      {/* Manual Add / Edit Form Block */}
      {(isAddingNew || editingId) && (
        <div className="bg-gray-950/80 border border-purple-500/20 gap-4 rounded-xl p-5 mb-6 animate-slide-up">
          <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-1">
            <Edit3 className="w-4 h-4" />
            {isAddingNew ? "إنشاء سؤال مخصص جديد" : "تعديل بيانات السؤال"}
          </h4>

          {formError && (
            <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="question-text" className="block text-xs font-medium text-gray-400 mb-1">نص السؤال:</label>
              <input
                id="question-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="مثال: كم عدد قارات العالم؟"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-lg text-sm text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, idx) => (
                <div key={idx} className="relative">
                  <label htmlFor={`option-${idx}`} className="block text-xs font-medium text-gray-400 mb-1">
                    الخيار {["أ", "ب", "ج", "د"][idx]}:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`option-${idx}`}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`الخيار ${["المقترح الأول", "المقترح الثاني", "المقترح الثالث", "المقترح الرابع"][idx]}`}
                      className={`w-full px-3 py-2 bg-gray-900 border focus:border-purple-500 rounded-lg text-xs text-white outline-none ${
                        correctIndex === idx ? "border-emerald-500 bg-emerald-950/20" : "border-gray-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      className={`shrink-0 p-2 rounded-lg border transition duration-200 ${
                        correctIndex === idx
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                      }`}
                      title="تحديد كإجابة صحيحة"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 mb-1">نقاط الصعوبة للسؤال:</label>
                <div className="flex gap-2">
                  {[10, 15, 20, 30].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPoints(p)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                        points === p 
                          ? "bg-indigo-600/90 border-indigo-500 text-white" 
                          : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-900">
              <button
                type="button"
                onClick={() => (isAddingNew ? handleSaveNew() : handleSaveEdit(editingId!))}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-1"
              >
                <Save className="w-4 h-4" />
                <span>احفظ السؤال</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 rounded-lg transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table/Grid showing current questions library */}
      {questions.length === 0 ? (
        <div className="text-center py-8 bg-gray-950/40 rounded-xl border border-dashed border-gray-850">
          <p className="text-sm text-gray-400">لا توجد لديك أسئلة مسجلة حالياً.</p>
          <p className="text-xs text-gray-500 mt-1">اضغط على زر التوليد فوق لتبهر أصدقاءك بأسئلة فورية بالذكاء الاصطناعي!</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {questions.map((q, idx) => (
            <div 
              key={q.id}
              className="flex items-center justify-between p-3.5 bg-gray-950/70 border border-gray-850 hover:border-gray-800 rounded-xl transition gap-3"
            >
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="flex items-center justify-center font-mono text-2s font-bold px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
                    {idx + 1}
                  </span>
                  <span className="text-2s font-bold px-2 py-0.5 bg-indigo-505/10 text-indigo-400 rounded-full border border-indigo-500/20">
                    {q.points} نقطة
                  </span>
                </div>
                <h5 className="text-sm font-bold text-gray-200 truncate">{q.text}</h5>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx}
                      className={`text-2s px-2 py-1 rounded flex items-center gap-1.5 min-w-0 ${
                        q.correctIndex === oIdx 
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold" 
                          : "bg-gray-900/60 text-gray-400 truncate"
                      }`}
                    >
                      <span className="font-bold shrink-0">{["أ", "ب", "ج", "د"][oIdx]}:</span>
                      <span className="truncate">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex sm:flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(q)}
                  className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition duration-200"
                  title="تعديل السؤال"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition duration-200"
                  title="حذف السؤال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AIPromptModal integration */}
      <AIPromptModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onQuestionsGenerated={handleAIQuestionsGenerated}
      />
    </div>
  );
}
