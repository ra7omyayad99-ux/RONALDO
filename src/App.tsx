import React, { useEffect, useState } from "react";
import { Sparkles, Trophy, PlayCircle, Users, HelpCircle, Code, HelpCircle as HelpIcon, ArrowLeft } from "lucide-react";
import HostDashboard from "./components/HostDashboard";
import ContestantRemote from "./components/ContestantRemote";
import { Room } from "./types";
import { getBackendUrl } from "./utils/api";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'host' | 'player'>('landing');
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  // Parse URL query parameters for dynamic joining e.g. when scanning QR code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam) {
      const cleanRoomCode = roomParam.trim();
      setRoomCodeInput(cleanRoomCode);
      setCurrentView('player');
    }
  }, []);

  const defaultQuestionsSeed = [
    {
      id: "q1",
      text: "ما هي عاصمة جمهورية مصر العربية؟",
      options: ["الإسكندرية", "القاهرة", "الجيزة", "الأقصر"],
      correctIndex: 1,
      points: 10
    },
    {
      id: "q2",
      text: "أكبر محيط في العالم هو المحيط...",
      options: ["الأطلسي", "الهندي", "الهادئ", "المتجمد الشمالي"],
      correctIndex: 2,
      points: 15
    },
    {
      id: "q3",
      text: "كم عدد كواكب المجموعة الشمسية؟",
      options: ["7 كواكب", "8 كواكب", "9 كواكب", "10 كواكب"],
      correctIndex: 1,
      points: 10
    },
    {
      id: "q4",
      text: "مؤسس علم الجبر هو العالم العربي الشهير...",
      options: ["ابن سينا", "الفارابي", "الخوارزمي", "ابن رشد"],
      correctIndex: 2,
      points: 20
    },
    {
      id: "q5",
      text: "ما هو أسرع حيوان بري على وجه الأرض؟",
      options: ["الفهد", "الأسد", "الغزال", "الحصان البري"],
      correctIndex: 0,
      points: 10
    }
  ];

  function createLocalRoom(): Room {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    return {
      id: roomCode,
      createdAt: Date.now(),
      status: 'lobby',
      players: [],
      questions: [...defaultQuestionsSeed],
      currentQuestionIndex: 0,
      timerDuration: 20,
      timerEndTimestamp: null,
      pausedRemaining: null,
      timerActive: false,
      timerRemaining: 20,
      scores: {
        A: 0,
        B: 0
      },
      buzzedBy: null,
      answersSubmitted: {},
      teamAName: "الفريق الرمز (أ)",
      teamBName: "الفريق المنافس (ب)",
      isLocalMode: true
    };
  }

  async function handleCreateRoom() {
    setLoading(true);
    setErrorText("");
    try {
      const res = await fetch(getBackendUrl() + "/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: [] }) // default questions built inside servers
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("تلقى التطبيق صفحة HTML بدلاً من رد الخادم.");
        }
        const roomData = await res.json();
        setActiveRoom({ ...roomData, isLocalMode: false });
        setCurrentView('host');
      } else {
        // Fallback to local mode gracefully
        console.warn("Server API not ready. Activating Local Offline-First Mode.");
        const localRoom = createLocalRoom();
        setActiveRoom(localRoom);
        setCurrentView('host');
      }
    } catch (err) {
      // Fallback to local mode gracefully
      console.warn("Connection to server failed. Activating Local Offline-First Mode.", err);
      const localRoom = createLocalRoom();
      setActiveRoom(localRoom);
      setCurrentView('host');
    } finally {
      setLoading(false);
    }
  }

  function handlePlayerJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!roomCodeInput.trim() || roomCodeInput.length < 4) {
      setErrorText("من فضلك اكتب رمز الغرفة المكون من 4 أرقام بشكل صحيح.");
      return;
    }
    setErrorText("");
    setCurrentView('player');
  }

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* GLOW DECORATIVE BLURS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP GLOWING BORDER ACCENT */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-yellow-400 to-rose-500 pointer-events-none" />

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        
        {/* LANDING SCREEN PORTAL */}
        {currentView === 'landing' && (
          <div className="w-full max-w-xl text-center space-y-8 animate-fade-in text-right" dir="rtl">
            
            {/* BRAND APP TITLE BAR */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-yellow-400 font-black px-4 py-1.5 rounded-full text-xs shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span>مسابقة تفاعلية حية • إصدار التحدي التفاعلي</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight italic">
                منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-rose-400">تحدي العباقرة</span>
              </h1>
              
              <p className="text-sm text-indigo-200 max-w-lg mx-auto leading-relaxed font-medium">
                انشئ مسابقة دائرية بين فريقين متنافسين، وجه اللعبة كمنظم تحكيم، ودع أصدقائك يمسحون الرمز للانضمام بذكاء وسرعة جرس الهواتف!
              </p>
            </div>

            {errorText && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/35 text-rose-200 rounded-2xl text-xs max-w-sm mx-auto text-center font-bold">
                {errorText}
              </div>
            )}

            {/* DUAL MODE CARD NAVIGATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
              
              {/* CARD 1: HOST CHAIR */}
              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={loading}
                className="group p-6 bg-indigo-900/50 border border-white/10 hover:border-cyan-400/50 rounded-3xl transition-all duration-350 hover:-translate-y-1 shadow-xl hover:shadow-cyan-500/10 text-right cursor-pointer flex flex-col justify-between min-h-[230px]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 bg-cyan-500 text-indigo-950 rounded-xl group-hover:bg-cyan-400 transition-colors duration-250">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <span className="text-2s font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-0.5">
                    شاشة التحكيم 💻
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">منظم اللعبة (المضيف)</h3>
                  <p className="text-2s text-indigo-200 mt-1.5 lines-clamp-2 leading-relaxed">
                    أنشئ جلسة جديدة، حدد الأسئلة، اعرض الرمز والـ QR للجميع لمشاهدة النتائج وصدارة الأرقام.
                  </p>
                </div>
              </button>

              {/* CARD 2: JOIN CONTROLLER CHAIR */}
              <div className="group p-6 bg-indigo-900/50 border border-white/10 hover:border-rose-400/50 rounded-3xl transition-all duration-350 shadow-xl hover:shadow-rose-500/10 text-right flex flex-col justify-between min-h-[230px]">
                
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 bg-rose-500 text-white rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-2s font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-full px-2.5 py-0.5">
                    هواتف اللاعبين 📱
                  </span>
                </div>

                <form onSubmit={handlePlayerJoinSubmit} className="space-y-2 mt-4 w-full">
                  <span className="block text-2s font-bold text-indigo-200">انضم للمباراة كمتسابق:</span>
                  <div className="flex gap-1.5 w-full">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="رمز الغرفة (مثال: 1234)"
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="flex-1 min-w-0 px-3 py-1.5 text-center font-mono font-bold text-yellow-400 bg-indigo-950 border border-white/10 focus:border-rose-400 rounded-xl text-xs outline-none transition"
                    />
                    <button
                      type="submit"
                      className="bg-rose-500 hover:bg-rose-400 text-white text-3s font-black py-1.5 px-3.5 rounded-xl transition shadow-md whitespace-nowrap cursor-pointer"
                    >
                      دخول للغرفة
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* PRE-COMPUTED GRAPHIC BENEFIT STATS */}
            <div className="max-w-lg mx-auto bg-indigo-900/30 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
              <div className="space-y-1">
                <span className="block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">Gemini AI</span>
                <span className="text-3s text-indigo-200 font-bold">توليد الأسئلة فورياً بذكاء فائق</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
              <div className="space-y-1">
                <span className="block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-rose-400">التوقيت السريع</span>
                <span className="text-3s text-indigo-200 font-bold">مؤمن بعدادات ثواني حماسية</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
              <div className="space-y-1">
                <span className="block text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-450 to-cyan-300">ربط QR ورمز</span>
                <span className="text-3s text-indigo-200 font-bold">بث كامل بلمح البصر شاشات/هواتف</span>
              </div>
            </div>

          </div>
        )}

        {/* HOST CABINET VIEW */}
        {currentView === 'host' && activeRoom && (
          <HostDashboard 
            room={activeRoom} 
            onLeave={() => {
              setActiveRoom(null);
              setCurrentView('landing');
            }}
          />
        )}

        {/* PLAYER CONSOLE REMOTING VIEW */}
        {currentView === 'player' && roomCodeInput && (
          <ContestantRemote 
            roomId={roomCodeInput} 
            onLeave={() => {
              setRoomCodeInput("");
              setCurrentView('landing');
            }}
          />
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="py-4 text-center text-3s text-indigo-300/80 border-t border-white/5 relative z-10 select-none">
        جميع الحقوق محفوظة لمنصة تحدي العباقرة • تم التوصيل بشكل آمن وسريع عبر Gemini
      </footer>

    </div>
  );
}
