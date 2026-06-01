import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEM_QUIZ } from '../data_quiz';
import { HelpCircle, Star, RotateCcw, Check, X, BookmarkCheck, ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface TechnicalQuizProps {
  isArabic: boolean;
}

export default function TechnicalQuiz({ isArabic }: TechnicalQuizProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const activeQuestion = SYSTEM_QUIZ[currentIdx];

  const handleAnswerClick = (index: number) => {
    if (isSubmitted) return;
    setSelectedAns(index);
  };

  const handleSubmittingAnswer = () => {
    if (selectedAns === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedAns === activeQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < SYSTEM_QUIZ.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Congratulatory message helper based on final score
  const getFeedbackMessage = () => {
    const ratio = score / SYSTEM_QUIZ.length;
    if (ratio === 1) {
      return {
        ar: "ممتاز ومبهر بامتياز! أنت حتماً مستعد للوقوف أمام لجنة المناقشة وجامعة المعقل بكل ثقة وجدارة وسعة فكر هندسي.",
        en: "Exceptional Score! You possess pristine understanding of the graduation system constraints and physical logic."
      };
    } else if (ratio >= 0.7) {
      return {
        ar: "عمل رائع ومستعد جداً! فهمك للقطع الهندسية والوقاية الكهرومغناطيسية ممتاز ويمهد لك نيل أعلى التقييمات.",
        en: "Great Job! You are well-prepared to navigate tricky examiner hardware questions with ease."
      };
    } else {
      return {
        ar: "جيد، لكن ينصح بمراجعة قيد قنوات التشويش ADC2 ومسار ديود الحماية 1N5408 لتأمين إجاباتك أمام اللجنة ومراجعة الدليل.",
        en: "A quick review of ADC2 conflicts and flyback diodes in the component explorer will help solidify your score."
      };
    }
  };

  const adviceMessage = getFeedbackMessage();

  return (
    <div className="max-w-3xl mx-auto font-sans" id="quiz-assessment-layout">
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col gap-6"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Header progress info */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                {isArabic ? `السؤال ${currentIdx + 1} من ${SYSTEM_QUIZ.length}` : `Question ${currentIdx + 1} of ${SYSTEM_QUIZ.length}`}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-105">
                <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                <span>{isArabic ? `النقاط: ${score}` : `Score: ${score}`}</span>
              </div>
            </div>

            {/* The Question Text */}
            <div className="text-right">
              <h3 className="text-base md:text-lg font-black text-slate-800 leading-relaxed font-sans">
                {isArabic ? activeQuestion.questionAr : activeQuestion.questionEn}
              </h3>
            </div>

            {/* Answer Options list */}
            <div className="flex flex-col gap-2.5">
              {(isArabic ? activeQuestion.optionsAr : activeQuestion.optionsEn).map((option, idx) => {
                let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold";
                
                if (isSubmitted) {
                  if (idx === activeQuestion.correctAnswerIndex) {
                    // Correct answer highlights green for high-accessibility clarity
                    optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-500/30";
                  } else if (idx === selectedAns) {
                    // Selected wrong answer highlights red
                    optionStyle = "border-rose-500 bg-rose-50 text-rose-800 font-bold ring-1 ring-rose-500/30";
                  } else {
                    optionStyle = "border-slate-100 bg-white opacity-50 text-slate-400";
                  }
                } else if (idx === selectedAns) {
                  // Pre-submitted selection highlights the blue theme
                  optionStyle = "border-blue-600 bg-blue-50/40 text-blue-800 ring-2 ring-blue-600/20 font-bold";
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleAnswerClick(idx)}
                    className={`cursor-pointer w-full text-right p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span className="font-sans font-semibold leading-relaxed">{option}</span>
                    <div className="shrink-0 flex items-center justify-center">
                      {isSubmitted && idx === activeQuestion.correctAnswerIndex ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : isSubmitted && idx === selectedAns ? (
                        <X className="w-4 h-4 text-rose-600 font-bold" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 bg-slate-50">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <div className="flex gap-2">
                {!isSubmitted ? (
                  <button
                    disabled={selectedAns === null}
                    onClick={handleSubmittingAnswer}
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm ${
                      selectedAns !== null 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{isArabic ? "تأكيد الإجابة وإرسالها" : "Verify Answer"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-all shadow-sm"
                  >
                    <span>{isArabic ? "السؤال التالي" : "Next Question"}</span>
                    {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Submit justification review block */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 text-xs md:text-sm leading-relaxed"
                >
                  <p className="font-bold text-slate-800 block mb-1.5">
                    {isArabic ? "التبرير والتعليل العلمي المحكّم:" : "Technical Justification / Thesis Background:"}
                  </p>
                  <span className="font-sans font-medium">
                    {isArabic ? activeQuestion.explanationAr : activeQuestion.explanationEn}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          /* Finished score screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10 text-center flex flex-col items-center gap-6"
            dir={isArabic ? 'rtl' : 'ltr'}
            id="quiz-finished-layout"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
              <Award className="w-9 h-9 text-blue-600" />
            </div>

            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-black text-slate-800">
                {isArabic ? "اكتمل الاختبار والتقييم العتادي!" : "Graduation Quiz Completed!"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono font-bold">
                {isArabic ? `حققت ${score} إجابات صحيحة من أصل ${SYSTEM_QUIZ.length}` : `You correctly answered ${score} out of ${SYSTEM_QUIZ.length}`}
              </p>
            </div>

            {/* Score Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center border-4 border-blue-100 rounded-full">
              <div className="text-center font-sans">
                <span className="text-4xl font-black text-blue-700">{Math.round((score / SYSTEM_QUIZ.length) * 100)}%</span>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-wider">{isArabic ? "التقييم الكلي" : "Accuracy"}</p>
              </div>
            </div>

            {/* Specialized Graduation feedback */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-xl text-center leading-relaxed">
              <p className="text-xs md:text-sm text-slate-700 font-bold font-sans">
                {isArabic ? adviceMessage.ar : adviceMessage.en}
              </p>
            </div>

            <button
              onClick={handleResetQuiz}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-all shadow-md focus:outline-hidden ring-2 ring-slate-800/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isArabic ? "إعادة التقييم والاختبار" : "Retake Assessment Quiz"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
