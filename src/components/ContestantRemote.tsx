import React, { useState, useEffect } from "react";
import { Users, AlertCircle, CheckCircle2, QrCode, Timer, Shield, Info, Trophy, Wifi } from "lucide-react";
import { Room, Player } from "../types";
import { getBackendUrl } from "../utils/api";

interface ContestantRemoteProps {
  roomId: string; // prefilled from query params or input
  onLeave: () => void;
}

export default function ContestantRemote({ roomId, onLeave }: ContestantRemoteProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [joined, setJoined] = useState(false);
  
  // Contestant specs
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState<'A' | 'B'>('A');

  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Poll room data once joined
  useEffect(() => {
    if (!pollingActive || !playerId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(getBackendUrl() + `/api/rooms/${roomId}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            return; // Dev fallback HTML page, ignore and try again next tick
          }
          const updatedRoom = await res.json();
          setRoom(updatedRoom);

          // If current contestant is kicked from server, force exit
          const stillExists = updatedRoom.players.some((p: Player) => p.id === playerId);
          if (!stillExists && updatedRoom.status !== 'lobby') {
            alert("تم استبعادك من الجلسة بواسطة منظم اللعب.");
            clearInterval(interval);
            onLeave();
          }
        }
      } catch (err) {
        console.error("Polling error inside remote console", err);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [roomId, pollingActive, playerId, onLeave]);

  // Initial load to check if room is valid
  useEffect(() => {
    async function checkRoom() {
      setRegisterError("");
      try {
        const res = await fetch(getBackendUrl() + `/api/rooms/${roomId}`);
        if (!res.ok) {
          setRegisterError("رمز الغرفة المطلوب غير موجود أو انتهت صلاحيته.");
          return;
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          setRegisterError("الخادم في حالة تحديث أو إعادة تشغيل مؤقتة، يرجى الانتظار والمحاولة مرة أخرى.");
          return;
        }
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        setRegisterError("تعذر الاتصال بمركز البيانات.");
      }
    }
    checkRoom();
  }, [roomId, retryTrigger]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!playerName.trim()) {
      setRegisterError("من فضلك اكتب اسمك للتعريف.");
      return;
    }

    setLoading(true);
    setRegisterError("");

    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim(), team: playerTeam })
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        setRegisterError("فشل التسجيل بالخادم. قد يكون الخادم يعيد التشغيل مؤقتاً للتحديث.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.error || "خطأ أثناء محاولة الانضمام.");
        setLoading(false);
        return;
      }

      setPlayerId(data.playerId);
      setRoom(data.room);
      setJoined(true);
      setPollingActive(true);
    } catch (err) {
      setRegisterError("تعذر الاتصال بالغرفة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePressBuzzer() {
    if (!playerId) return;
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${roomId}/buzz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRoom(data.room);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmitOption(optionIndex: number) {
    if (!playerId) return;
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${roomId}/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, optionIndex })
      });
      if (res.ok) {
        // Force state reload
        const freshRes = await fetch(getBackendUrl() + `/api/rooms/${roomId}`);
        if (freshRes.ok) {
          const freshRoom = await freshRes.json();
          setRoom(freshRoom);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Not loaded yet state
  if (!room) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 text-right" dir="rtl">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <p className="text-sm text-yellow-500 font-bold animate-pulse">جاري التحقق من الغرفة وبث الاتصال السحابي...</p>
          {registerError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-2s leading-relaxed">
              {registerError}
            </div>
          )}
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setRetryTrigger(prev => prev + 1)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] py-2.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>إعادة محاولة الربط</span>
            </button>
            <button 
              type="button"
              onClick={onLeave}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-[11px] py-2.5 rounded-xl transition duration-150 cursor-pointer"
            >
              الرجوع للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentContestant = room.players.find(p => p.id === playerId);
  const myAssignedTeamName = playerTeam === 'A' ? room.teamAName : room.teamBName;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-right max-w-md mx-auto" dir="rtl">
      
      {/* 1. REGISTRATION PHASE (NOT JOINED YET) */}
      {!joined && (
        <div className="w-full bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 bg-purple-500/10 border border-purple-500/25 rounded-2xl text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">تسجيل المتسابق بالهاتف</h2>
            <p className="text-xs text-gray-400">
              أدخل اسمك واختر فريقك للاتصال بغرفة اللعب المباشر رقم <span className="font-bold text-yellow-400 font-mono">{roomId}</span>.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {registerError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <div>
              <label htmlFor="nickname" className="block text-xs font-semibold text-gray-400 mb-1">اسمك المستعار للمباراة:</label>
              <input
                id="nickname"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={18}
                placeholder="أدخل اسمك (مثال: رامي، زينة...)"
                className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-purple-500 rounded-xl text-sm text-white outline-none transition-colors duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">اختر فريق التحدي الخاص بك:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlayerTeam('A')}
                  disabled={loading}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col justify-center items-center gap-1 ${
                    playerTeam === 'A' 
                      ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold" 
                      : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{room.teamAName}</span>
                  <span className="text-3s font-normal opacity-70">الفريق الأول</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlayerTeam('B')}
                  disabled={loading}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col justify-center items-center gap-1 ${
                    playerTeam === 'B' 
                      ? "bg-rose-500/15 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10 font-bold" 
                      : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{room.teamBName}</span>
                  <span className="text-3s font-normal opacity-70">الفريق الثاني</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition duration-150 flex items-center justify-center gap-1 shadow-lg shadow-purple-600/15"
            >
              <span>انضم الآن وعلق التحدي! ⚔️</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button 
              type="button"
              onClick={onLeave}
              className="text-gray-500 hover:text-white text-3s transition"
            >
              إلغاء والرجوع للرئيسية
            </button>
          </div>
        </div>
      )}

      {/* 2. LIVE GAME RESPONDER CLIENT VIEW (JOINED AND REGISTERED) */}
      {joined && currentContestant && (
        <div className="w-full space-y-4">
          
          {/* Top minimal status card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-bold text-gray-200">متصل بالبث المباشر</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 font-mono">
              <span>{currentContestant.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-3s font-bold ${
                playerTeam === 'A' ? "bg-cyan-500/10 text-cyan-400" : "bg-rose-500/10 text-rose-400"
              }`}>
                {myAssignedTeamName}
              </span>
            </div>
          </div>

          {/* LOBBY STATE DETAILED STATS */}
          {room.status === 'lobby' && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />

              <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full animate-bounce">
                <Wifi className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-md font-bold text-white">لقد سجلت بنجاح في لوحة الغرفة!</h3>
                <p className="text-xs text-gray-400">أنت الآن عضو رسمي ومؤهل في فريق:</p>
                <p className={`text-md font-black tracking-wide ${
                  playerTeam === 'A' ? "text-cyan-400" : "text-rose-400"
                }`}>
                  {myAssignedTeamName}
                </p>
              </div>

              <div className="p-4 bg-gray-950/80 border border-gray-850 rounded-2xl text-center space-y-2">
                <p className="text-3s text-purple-300 font-bold">بانتظار بدء المنافسة من قبل موجه التحكيم...</p>
                <p className="text-2s text-gray-500 leading-relaxed">
                  بمجرد قيام المنظم بالنقر على زر البدء، ستتحول شاشة هاتفك لزر تحكم تفاعلي ذكي فورياً.
                </p>
              </div>

              <div className="pt-2 text-center">
                <button 
                  type="button"
                  onClick={onLeave}
                  className="text-xs text-rose-400 hover:underline hover:text-rose-300"
                >
                  الخروج وإلغاء التسجيل
                </button>
              </div>
            </div>
          )}

          {/* PLAY GAME SESSION STATE (BUZZER OR OPTIONS CONTROLLER) */}
          {room.status === 'playing' && (
            <div className="space-y-4">
              {/* Question information row */}
              <div className="bg-gray-900 border border-gray-850 p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg">
                <span className="text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  سؤال {room.currentQuestionIndex + 1}
                </span>

                <div className="flex items-center gap-1 text-gray-300">
                  <span className="font-mono text-xs">{room.timerRemaining}</span>
                  <span className="text-gray-500">ثانية متبقية</span>
                </div>
              </div>

              {/* DYNAMIC VIEW FOR BUZZ RECONSTRUCTIONS */}
              {room.buzzedBy ? (
                // Buzzer is claimed
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                  {room.buzzedBy.playerId === playerId ? (
                    <div className="space-y-3 animate-ping-custom">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                      </div>
                      <h4 className="text-md font-bold text-emerald-400">لقد نجحت في قرع الجرس! 🚨</h4>
                      <p className="text-xs text-gray-300">
                        تحدث فوراً وقدم جوابك الشفهي للجنة التحكيم لاعتماده. حظاً موفقاً!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-gray-950 rounded-full flex items-center justify-center mx-auto border border-gray-850 text-gray-500">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-gray-400">الجرس مأخوذ مسبقاً 🔒</h4>
                      <p className="text-2s text-gray-500 leading-relaxed">
                        قام المتسابق <span className="text-purple-400 font-bold">{room.buzzedBy.playerName}</span> من فريق الخصم بالقرع أولاً بالثانية المتسارعة.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Buzzer is active and unclaimed (Standard Buzzer mode)
                // Let's check if gameMode is actually buzz
                // Wait! Since standard response check has both possibilities, lets render nicely
                <>
                  {room.timerRemaining === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center text-gray-400 space-y-2">
                      <p className="text-xs font-bold">انتهى الوقت للتفكير في هذا السؤال!</p>
                      <p className="text-2s text-gray-500">من فضلك بانتظار توثيق أو نقل السؤال التالي من قبل المنظم.</p>
                    </div>
                  ) : (
                    <>
                      {/* Check if answersSubmitted already contains this playerId (In kahoot mode) */}
                      {room.answersSubmitted[playerId] ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 text-center space-y-4">
                          <div className="w-16 h-16 bg-purple-500/10 border border-purple-505/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h4 className="text-md font-bold text-gray-100">تم حفظ وتسجيل خيارك بنجاح!</h4>
                          <p className="text-xs text-gray-400">
                            أدليت بصوتك بالفعل. ننتظر الآن إطلاق اللجنة للتقييم الأتوماتيكي وإعلان النتائج.
                          </p>
                        </div>
                      ) : (
                        // Render inputs based on whether the active quiz modes
                        // We can provide both! On phone, let's display BOTH a big clickable buzzer and direct options א, ב, ג, ד so they can use either according to how the host hosts!
                        // This is unbelievably clean and covers both game modes perfectly!
                        <div className="bg-gray-905 border border-gray-800 rounded-3xl p-5 space-y-6 shadow-xl">
                          {/* BUZZER COMPONENT (IF CURRENT MODE) */}
                          <div className="flex flex-col items-center">
                            <span className="text-3s text-gray-400 font-bold bg-gray-950 px-2.5 py-1 rounded-full border border-gray-850 mb-4">
                              🚨 كابس السرين المباشر:
                            </span>
                            <button
                              type="button"
                              onClick={handlePressBuzzer}
                              className="w-36 h-36 rounded-full bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 active:scale-95 border-8 border-rose-800 shadow-2xl flex flex-col items-center justify-center text-white transition-all cursor-pointer relative group overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-150-all" />
                              <span className="font-extrabold text-sm tracking-wide shadow-text animate-pulse">اجب الآن</span>
                              <span className="text-4s opacity-80 mt-1 uppercase font-mono">B U Z Z</span>
                            </button>
                            <span className="text-4s text-gray-500 mt-2">انقر فور الكبس لتسجيل اسمك كأسرع مجيب بالثانية!</span>
                          </div>

                          {/* DIRECT MULTI CHOICE SELECTION BUTTONS */}
                          <div className="pt-4 border-t border-gray-850">
                            <p className="text-center text-3s text-gray-400 font-bold mb-3">
                              أو حدد خيار الإجابة بالخيار (التصويت المباشر):
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {[0, 1, 2, 3].map((oIdx) => (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSubmitOption(oIdx)}
                                  className="py-3 px-4 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-xs text-white rounded-2xl transition cursor-pointer flex items-center justify-between group active:scale-95"
                                >
                                  <span className="w-5 h-5 rounded bg-gray-950 font-bold flex items-center justify-center group-hover:text-purple-400">
                                    {["أ", "ب", "ج", "د"][oIdx]}
                                  </span>
                                  <span className="text-xs font-semibold">تحديد الخيار</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* GAME ENDED STATE */}
          {room.status === 'ended' && (
            <div className="bg-gray-900 border border-gray-850 rounded-3xl p-6 text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="inline-flex p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-md font-bold text-white">انتهى ماراثون المسابقة والمباراة!</h3>
                <p className="text-xs text-gray-400">درجتك الفردية الفعالة التي حققتها:</p>
                <div className="text-2xl font-black text-yellow-500 font-mono my-2">
                  {currentContestant.score} نقطة
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  تابع النتائج والترتيب النهائي وتوزيع المراكز بالمنصة على شاشة المدرب والتحكيم الرئيسية!
                </p>
              </div>

              <button
                type="button"
                onClick={onLeave}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2.5 rounded-xl transition"
              >
                الرجوع للرئيسية
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
