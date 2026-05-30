import React, { useEffect, useState } from "react";
import { 
  Users, QrCode, Timer, Play, Pause, RotateCcw, Trophy, Sparkles, 
  Medal, Volume2, UserX, ArrowLeft, ArrowRight, RefreshCw, Edit2, 
  CheckCircle2, XCircle, ChevronRight, Zap 
} from "lucide-react";
import { Question, Room, Player } from "../types";
import QuestionManager from "./QuestionManager";
import { QRCodeSVG } from "qrcode.react";
import { getBackendUrl, setBackendUrl } from "../utils/api";

interface HostDashboardProps {
  room: Room;
  onLeave: () => void;
}

export default function HostDashboard({ room: initialRoom, onLeave }: HostDashboardProps) {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [activeTab, setActiveTab] = useState<'lobby' | 'questions'>('lobby');
  const [editingTeamA, setEditingTeamA] = useState(false);
  const [editingTeamB, setEditingTeamB] = useState(false);
  const [teamAName, setTeamAName] = useState(room.teamAName);
  const [teamBName, setTeamBName] = useState(room.teamBName);
  const [timerInput, setTimerInput] = useState(room.timerDuration);
  const [revealMode, setRevealMode] = useState(false); // whether correct answer is revealed on Host screen
  const [pollingActive, setPollingActive] = useState(true);
  const isLocalMode = room.isLocalMode === true;
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [isServerSynced, setIsServerSynced] = useState(!isLocalMode);

  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(getBackendUrl());

  function handleSaveCustomServerUrl(url: string) {
    setBackendUrl(url);
    const cleaned = url.trim().endsWith("/") ? url.trim().slice(0, -1) : url.trim();
    setCustomServerUrl(cleaned);
    setSyncError("");
    setIsServerSynced(false);
  }

  // Play Mode Selection: 'buzz' (buzzer-in) vs 'options' (direct choices)
  const [gameMode, setGameMode] = useState<'buzz' | 'options'>('buzz');

  // Fetch the room state periodically to keep the lobby and game in sync (only in network mode)
  useEffect(() => {
    if (!pollingActive || isLocalMode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("text/html")) {
            // Server returned HTML (Vite fallback/maintenance state/rebuilding)
            setIsServerSynced(false);
            return;
          }
          const updatedRoom = await res.json();
          setRoom(updatedRoom);
          setIsServerSynced(true);
        } else if (res.status === 404) {
          // Room got cleared from server memory (e.g. server restarted or container cycled)
          setIsServerSynced(false);
        }
      } catch (err) {
        console.error("Error polling room status", err);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [room.id, pollingActive, isLocalMode]);

  // Local Mode timer ticker
  useEffect(() => {
    if (!isLocalMode || !room.timerActive) return;

    const interval = setInterval(() => {
      setRoom(prev => {
        const currentRemaining = prev.timerRemaining !== undefined ? prev.timerRemaining : prev.timerDuration;
        if (currentRemaining <= 1) {
          clearInterval(interval);
          return {
            ...prev,
            timerActive: false,
            timerRemaining: 0
          };
        }
        return {
          ...prev,
          timerRemaining: currentRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocalMode, room.timerActive]);

  // Local Mode buzzer keyboard listeners
  useEffect(() => {
    if (!isLocalMode || room.status !== 'playing' || room.buzzedBy) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (['input', 'textarea'].includes(document.activeElement?.tagName.toLowerCase() || '')) {
        return; // Don't trigger when typing in inputs/textareas!
      }
      if (e.key === 'a' || e.key === 'A' || e.key === '1') {
        localBuzz('A');
      } else if (e.key === 'l' || e.key === 'L' || e.key === '0') {
        localBuzz('B');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocalMode, room.status, room.buzzedBy]);

  function localBuzz(team: 'A' | 'B') {
    const teamPlayers = room.players.filter(p => p.team === team);
    const player = teamPlayers[0] || { 
      id: `virtual_${team}_${Date.now()}`, 
      name: team === 'A' ? "متسابق (أ)" : "متسابق (ب)", 
      team, 
      score: 0 
    };

    setRoom(prev => ({
      ...prev,
      timerActive: false,
      buzzedBy: {
        playerId: player.id,
        playerName: player.name,
        team: player.team,
        timestamp: Date.now()
      }
    }));
  }

  // Sync team name states when room payload shifts
  useEffect(() => {
    setTeamAName(room.teamAName);
    setTeamBName(room.teamBName);
  }, [room.teamAName, room.teamBName]);

  const apiBase = getBackendUrl();
  const joinLink = `${window.location.protocol}//${window.location.host}?room=${room.id}${apiBase ? `&backend=${encodeURIComponent(apiBase)}` : ""}`;

  async function handleUpdateTeamNames() {
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        teamAName,
        teamBName
      }));
      setEditingTeamA(false);
      setEditingTeamB(false);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/update-teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamAName, teamBName })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setEditingTeamA(false);
        setEditingTeamB(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateQuestions(updated: Question[]) {
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        questions: updated.map((q, index) => ({
          id: q.id || `local_q_${Date.now()}_${index}`,
          text: q.text || "سؤال مجهول",
          options: Array.isArray(q.options) ? q.options : ["أ", "ب", "ج", "د"],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          points: typeof q.points === 'number' ? q.points : 10
        }))
      }));
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/edit-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: updated })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleKickPlayer(playerId: string) {
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId)
      }));
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/kick-player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleStartGame() {
    if (room.questions.length === 0) {
      alert("الرجاء إضافة سؤال واحد على الأقل قبل بدء المباراة التنافسية!");
      return;
    }
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        status: 'playing',
        currentQuestionIndex: 0,
        scores: { A: 0, B: 0 },
        buzzedBy: null,
        answersSubmitted: {},
        timerActive: false,
        pausedRemaining: prev.timerDuration,
        timerEndTimestamp: null,
        timerRemaining: prev.timerDuration
      }));
      setRevealMode(false);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/start`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setRevealMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTimerAction(action: 'start' | 'pause' | 'reset') {
    if (isLocalMode) {
      setRoom(prev => {
        let active = prev.timerActive;
        let remaining = prev.timerRemaining !== undefined ? prev.timerRemaining : prev.timerDuration;
        if (action === 'start') {
          active = true;
        } else if (action === 'pause') {
          active = false;
        } else if (action === 'reset') {
          active = false;
          remaining = timerInput;
        }
        return {
          ...prev,
          timerActive: active,
          timerRemaining: remaining,
          timerDuration: timerInput,
          ...(action === 'reset' ? { buzzedBy: null, answersSubmitted: {} } : {})
        };
      });
      if (action === 'reset') {
        setRevealMode(false);
      }
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/timer-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, duration: timerInput })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        if (action === 'reset') {
          setRevealMode(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleResolveBuzzer(isCorrect: boolean) {
    if (isLocalMode) {
      setRoom(prev => {
        if (!prev.buzzedBy) return prev;
        const scoredTeam = prev.buzzedBy.team;
        const currentQ = prev.questions[prev.currentQuestionIndex];
        const qPoints = currentQ ? currentQ.points : 10;
        
        const nextScores = { ...prev.scores };
        if (isCorrect) {
          nextScores[scoredTeam] += qPoints;
        } else {
          nextScores[scoredTeam] = Math.max(0, nextScores[scoredTeam] - Math.ceil(qPoints / 2));
        }

        const updatedPlayers = prev.players.map(p => {
          if (p.id === prev.buzzedBy?.playerId) {
            return {
              ...p,
              score: isCorrect ? p.score + qPoints : Math.max(0, p.score - Math.ceil(qPoints / 2))
            };
          }
          return p;
        });

        return {
          ...prev,
          scores: nextScores,
          players: updatedPlayers,
          buzzedBy: null,
          timerActive: false
        };
      });
      setRevealMode(true);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/score-manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolveBuzzer: true, isCorrect })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setRevealMode(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRevealAndAutoScore() {
    if (isLocalMode) {
      setRoom(prev => {
        const currentQ = prev.questions[prev.currentQuestionIndex];
        const qPoints = currentQ ? currentQ.points : 10;
        
        let teamACorrect = 0;
        let teamBCorrect = 0;

        const updatedPlayers = prev.players.map(p => {
          const submission = prev.answersSubmitted[p.id];
          if (submission && submission.isCorrect) {
            if (p.team === 'A') teamACorrect++;
            else teamBCorrect++;
            return {
              ...p,
              score: p.score + qPoints
            };
          }
          return p;
        });

        const nextScores = { ...prev.scores };
        if (teamACorrect > 0) nextScores.A += qPoints;
        if (teamBCorrect > 0) nextScores.B += qPoints;

        return {
          ...prev,
          players: updatedPlayers,
          scores: nextScores,
          timerActive: false,
          timerRemaining: 0
        };
      });
      setRevealMode(true);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/reveal-answers`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRoom(data.room);
        setRevealMode(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleNextQuestion() {
    if (isLocalMode) {
      setRoom(prev => {
        const isNextIndexValid = prev.currentQuestionIndex + 1 < prev.questions.length;
        return {
          ...prev,
          buzzedBy: null,
          answersSubmitted: {},
          currentQuestionIndex: isNextIndexValid ? prev.currentQuestionIndex + 1 : prev.currentQuestionIndex,
          status: isNextIndexValid ? 'playing' : 'ended',
          timerActive: false,
          timerRemaining: prev.timerDuration
        };
      });
      setRevealMode(false);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/next-question`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setRevealMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleResetGame() {
    if (!confirm("هل أنت متأكد من رغبتك في إعادة تصفير اللعبة والبدء من جديد؟")) return;
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        status: 'lobby',
        currentQuestionIndex: 0,
        scores: { A: 0, B: 0 },
        players: prev.players.map(p => ({ ...p, score: 0 })),
        buzzedBy: null,
        answersSubmitted: {},
        timerActive: false,
        timerRemaining: prev.timerDuration
      }));
      setRevealMode(false);
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/reset`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setRevealMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleManualScoreChange(team: 'A' | 'B', offset: number) {
    if (isLocalMode) {
      setRoom(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          [team]: Math.max(0, prev.scores[team] + offset)
        }
      }));
      return;
    }
    try {
      const res = await fetch(getBackendUrl() + `/api/rooms/${room.id}/score-manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team, points: offset })
      });
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSyncLocalToCloud() {
    setSyncing(true);
    setSyncError("");
    try {
      const res = await fetch(getBackendUrl() + "/api/rooms/sync-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: { ...room, isLocalMode: false } })
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("تلقى التطبيق صفحة HTML بدلاً من رد الخادم. قد يكون الخادم قيد المزامنة أو تفعيل التحديثات حالياً.");
        }
        const updated = await res.json();
        setRoom({ ...updated, isLocalMode: false });
        setIsServerSynced(true);
      } else {
        const status = res.status;
        let errMsg = `فشل تفعيل البث (رمز الاستجابة: ${status}).`;
        try {
          const text = await res.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              errMsg = parsed.error || `خطأ: ${text.substring(0, 80)} (رمز: ${status})`;
            } catch {
              errMsg = `خطأ: ${text.substring(0, 80)} (رمز: ${status})`;
            }
          }
        } catch {
          // fallback
        }
        setSyncError(errMsg);
      }
    } catch (err: any) {
      setSyncError(err?.message || "تعذر الاتصال بالخادم الرئيسي لبث الرابط.");
    } finally {
      setSyncing(false);
    }
  }

  // Get grouped player lists
  const teamAPlayers = room.players.filter(p => p.team === 'A');
  const teamBPlayers = room.players.filter(p => p.team === 'B');

  const currentQuestion = room.questions[room.currentQuestionIndex];

  // Count submissions for Direct options voting
  const submittedCount = Object.keys(room.answersSubmitted).length;
  const totalPlayersCount = room.players.length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-right" dir="rtl">
      {/* HEADER BAR */}
      <div className="bg-indigo-900/50 rounded-2xl p-4 mb-6 border border-white/10 flex justify-between items-center flex-col md:flex-row gap-4 shadow-2xl select-none animate-fade-in">
        
        {/* Left Section: Room identifier */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 px-4 rounded-xl">
          <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-lg flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-extrabold leading-none mb-1">رمز الغرفة النشط</p>
            <h2 className="text-2xl font-black text-yellow-400 font-mono leading-none">#{room.id}</h2>
          </div>
        </div>

        {/* Middle Section: Display titles with custom alignment and italic styling */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white">تحدي العباقرة التفاعلي</h1>
          <p className="text-xs text-indigo-300 mt-1">
            {room.status === 'lobby' 
              ? "بانتظار تجهيز وانضمام المتنافسين..." 
              : `المباراة جارية • الجولة ${room.currentQuestionIndex + 1} من أصل ${room.questions.length}`
            }
          </p>
        </div>

        {/* Right Section: Action controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLeave}
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-full transition duration-150 shadow-lg shadow-rose-500/20 border-t border-white/10 flex items-center gap-1"
          >
            إنهاء الجلسة الحالية
          </button>
        </div>

      </div>

      {/* LOBBY STATE */}
      {room.status === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE: SCAN QR AND STATS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* MATCH CODE & QR CODE INFO */}
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              {isLocalMode ? (
                <div className="text-right space-y-4 w-full">
                  <span className="inline-block text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 animate-pulse">
                    الوضع المحلي النشط 💻
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                    أنت تلعب الآن باستخدام <span className="text-yellow-400 font-extrabold">الوضع المحلي الفائق</span> بشكل مستقل 100%!
                  </p>
                  <p className="text-2s text-gray-400 leading-relaxed">
                    لا تشغل بالك بالخوادم أو الهواتف. بإمكانك إضافة أسماء المتسابقين في بطاقات الفرق وحساب نقاطهم ونقر جرس الإجابة مباشرة من هذه شاشة:
                  </p>
                  <div className="text-2s space-y-2 bg-gray-950/60 p-3 rounded-xl border border-gray-850 text-gray-300 font-medium">
                    <p className="border-b border-gray-800 pb-1 font-bold text-gray-400">⌨️ اختصارات جرس الكبس السريع:</p>
                    <div className="flex justify-between items-center">
                      <span>{room.teamAName}:</span>
                      <kbd className="bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded text-3s font-bold">A</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{room.teamBName}:</span>
                      <kbd className="bg-rose-950/80 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded text-3s font-bold">L</kbd>
                    </div>
                  </div>

                  {/* Connect and Sync local room to cloud */}
                  <div className="pt-2.5 border-t border-gray-800/80 space-y-1.5">
                    <button
                      type="button"
                      disabled={syncing}
                      onClick={handleSyncLocalToCloud}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-2s py-2 px-3 rounded-xl transition duration-150 shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري تفعيل وبث الاتصال...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                          <span>تفعيل البث والربط السحابي (أونلاين) 📶</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center leading-normal leading-relaxed">
                      انقر هنا لمزامنة الغرفة وتفعيل البث السحابي ليتمكن المتسابقون من الدخول بهواتفهم.
                    </p>
                    {syncError && (
                      <p className="text-[10px] text-rose-400 text-center font-bold font-mono">{syncError}</p>
                    )}

                    <div className="pt-2 border-t border-gray-800/40 text-right space-y-2">
                      <div className="flex justify-between items-center">
                        <button 
                          type="button" 
                          onClick={() => setShowServerConfig(!showServerConfig)} 
                          className="text-[10px] text-purple-400 hover:text-purple-300 underline font-bold cursor-pointer"
                        >
                          {showServerConfig ? "إخفاء عنوان الخادم ✕" : "⚙️ تعديل رابط الخادم السحابي"}
                        </button>
                        <span className="text-[9px] text-gray-400 font-bold">إعدادات سحابية لـ Vercel</span>
                      </div>
                      
                      {showServerConfig && (
                        <div className="space-y-1.5 pt-1.5 bg-gray-950/40 p-2.5 rounded-xl border border-purple-500/10">
                          <p className="text-[10px] text-gray-300 leading-normal">
                            لتشغيل الربط بنجاح على استضافة خارجية (مثل Vercel)، أدخل رابط الخادم النشط الخاص بك على Cloud Run المكتوب في AI Studio:
                          </p>
                          <input
                            type="text"
                            dir="ltr"
                            placeholder="https://ais-pre-....run.app"
                            value={customServerUrl}
                            onChange={(e) => handleSaveCustomServerUrl(e.target.value)}
                            className="w-full text-center text-xs px-2 py-1 bg-black border border-purple-900/40 rounded-lg text-purple-200 outline-none focus:border-purple-500 transition font-mono"
                          />
                          <div className="flex justify-between items-center pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveCustomServerUrl("")}
                              className="text-[9px] text-rose-400 hover:text-rose-350 underline"
                            >
                              إعادة التعيين للتلقائي
                            </button>
                            <span className="text-[8px] text-gray-500 font-mono">
                              {customServerUrl ? "مخصص" : "تلقائي"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-3">
                    انضمام وتوصيل الهواتف 📱
                  </span>
                  <p className="text-xs text-gray-400 mb-4 max-w-xs leading-relaxed">
                    دع بقية الأعضاء يمسحون الرمز لتوصيل هواتفهم كأجهزة ريموت ذكية للكبس والإجابة!
                  </p>

                  {/* QR Code Frame */}
                  <div className="relative p-3 bg-white rounded-2xl border-4 border-indigo-900/20 shadow-xl max-w-[200px] w-full aspect-square flex items-center justify-center overflow-hidden">
                    <QRCodeSVG 
                      value={joinLink} 
                      size={180}
                      level="M"
                      includeMargin={false}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Join Link Copy Panel */}
                  <div className="mt-4 w-full">
                    <span className="block text-2s font-medium text-gray-500 mb-1">رابط مباشر للانضمام:</span>
                    <input
                      type="text"
                      readOnly
                      value={joinLink}
                      onClick={(e) => {
                        (e.target as HTMLInputElement).select();
                        navigator.clipboard.writeText(joinLink);
                      }}
                      className="w-full text-center text-2s px-2.5 py-2 bg-gray-950 border border-gray-800 rounded-xl text-purple-300 outline-none cursor-pointer hover:bg-gray-900 hover:border-purple-500/50 transition font-mono truncate"
                      title="اضغط للنسخ"
                    />
                    <span className="block text-2s text-gray-500 mt-1 font-medium">اضغط داخل المستطيل لنسخ الرابط.</span>
                  </div>

                  {/* Cloud Connection Panel (Always visible in Online Mode to resolve joining issues) */}
                  <div className="mt-5 pt-4 border-t border-gray-800/80 w-full space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2s font-bold text-gray-400">حالة الربط السحابي:</span>
                      {isServerSynced ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 animate-pulse">
                          ● متصل بالبث (نشط) 📶
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full px-2 py-0.5 animate-pulse">
                          ⚠️ غير متصل بالخادم
                        </span>
                      )}
                    </div>

                    {!isServerSynced ? (
                      <div className="space-y-2 text-right">
                        <p className="text-2s text-gray-300 leading-relaxed font-medium">
                          يبدو أن الخادم تمت إعادة تشغيله لتهيئة التحديثات أو توقف لبعض الوقت. اضغط على <span className="text-purple-400 font-extrabold">الزر البنفسجي</span> أدناه فوراً لإعادة بث وتفعيل الغرفة ليتمكن المتسابقون من الدخول بهواتفهم بسلام:
                        </p>
                        <button
                          type="button"
                          disabled={syncing}
                          onClick={handleSyncLocalToCloud}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-2s py-2 px-3 rounded-xl transition duration-150 shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                        >
                          {syncing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>جاري إعادة بث وتنشيط الغرفة...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                              <span>تنشيط البث السحابي (الزر البنفسجي) 📶</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-right">
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          الغرفة نشطة حالياً على خادم اللعبة بنجاح. إذا واجه أحد المتسابقين صعوبة بالدخول، بإمكانك المزامنة اليدوية وإعادة تهيئة اتصال الغرفة فوراً بالضغط هنا:
                        </p>
                        <button
                          type="button"
                          disabled={syncing}
                          onClick={handleSyncLocalToCloud}
                          className="w-full bg-gray-950 hover:bg-gray-900 border border-purple-500/30 text-purple-300 hover:text-purple-200 font-bold text-2s py-2 px-3 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {syncing ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-purple-400" />
                          )}
                          <span>تحديث البث ومزامنة الغرفة 📶</span>
                        </button>
                      </div>
                    )}

                    {syncError && (
                      <p className="text-[10px] text-rose-455 text-center font-bold font-mono">{syncError}</p>
                    )}

                    <div className="pt-2 border-t border-gray-800/40 text-right space-y-2">
                      <div className="flex justify-between items-center">
                        <button 
                          type="button" 
                          onClick={() => setShowServerConfig(!showServerConfig)} 
                          className="text-[10px] text-purple-400 hover:text-purple-300 underline font-bold cursor-pointer"
                        >
                          {showServerConfig ? "إخفاء عنوان الخادم ✕" : "⚙️ تعديل رابط الخادم السحابي"}
                        </button>
                        <span className="text-[9px] text-gray-400 font-bold">إعدادات سحابية لـ Vercel</span>
                      </div>
                      
                      {showServerConfig && (
                        <div className="space-y-1.5 pt-1.5 bg-gray-950/40 p-2.5 rounded-xl border border-purple-500/10">
                          <p className="text-[10px] text-gray-300 leading-normal">
                            لتشغيل الربط بنجاح على استضافة خارجية (مثل Vercel)، أدخل رابط الخادم النشط الخاص بك على Cloud Run المكتوب في AI Studio:
                          </p>
                          <input
                            type="text"
                            dir="ltr"
                            placeholder="https://ais-pre-....run.app"
                            value={customServerUrl}
                            onChange={(e) => handleSaveCustomServerUrl(e.target.value)}
                            className="w-full text-center text-xs px-2 py-1 bg-black border border-purple-900/40 rounded-lg text-purple-200 outline-none focus:border-purple-500 transition font-mono"
                          />
                          <div className="flex justify-between items-center pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveCustomServerUrl("")}
                              className="text-[9px] text-rose-400 hover:text-rose-350 underline"
                            >
                              إعادة التعيين للتلقائي
                            </button>
                            <span className="text-[8px] text-gray-500 font-mono">
                              {customServerUrl ? "مخصص" : "تلقائي"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* QUICK SETTINGS */}
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5 border-b border-gray-850 pb-2">
                <Timer className="w-4.5 h-4.5 text-purple-400" />
                خيارات المباراة التفاعلية
              </h4>

              <div className="space-y-4">
                <div>
                  <label htmlFor="duration-input" className="block text-xs font-medium text-gray-400 mb-1">العداد الزمني للسؤال (بالثانية):</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="duration-input"
                      type="number"
                      value={timerInput}
                      onChange={(e) => setTimerInput(Math.max(5, Number(e.target.value)))}
                      className="w-20 text-center py-1.5 bg-gray-950 border border-gray-800 text-sm text-yellow-400 font-bold rounded-lg outline-none"
                    />
                    <span className="text-xs text-gray-400">ثانية لكل سؤال</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">ميكانيكية ونظام اللعب المفضل:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGameMode('buzz')}
                      className={`py-2 text-2s font-bold rounded-xl border transition ${
                        gameMode === 'buzz'
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-gray-950 border-gray-850 text-gray-400 hover:text-white"
                      }`}
                    >
                      كبس الجرس المتسارع ⚡
                    </button>
                    <button
                      type="button"
                      onClick={() => setGameMode('options')}
                      className={`py-2 text-2s font-bold rounded-xl border transition ${
                        gameMode === 'options'
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-gray-950 border-gray-850 text-gray-400 hover:text-white"
                      }`}
                    >
                      التصويت المباشر (كاهوت) 📊
                    </button>
                  </div>
                  <p className="text-2s text-gray-500 mt-1 leading-relaxed">
                    {gameMode === 'buzz' 
                      ? "نظام الحماس! من يكبس الجرس أولاً على شاشة هاتفه يتوقف المؤقت فوراً وتمنح له فرصة الإجابة والحديث." 
                      : "نظام التصويت! يختار جميع اللاعبين خياراً (أ، ب، ج، د) على هواتفهم وتجمع النقاط تلقائياً للفريقين."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: TEAM PLAYERS AND QUESTION DATABASE */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* TAB SELECTION */}
            <div className="flex gap-2 p-1.5 bg-gray-950/80 border border-gray-850 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('lobby')}
                className={`flex items-center gap-1 bg-transparent border-0 px-4 py-1.5 text-xs font-bold rounded-xl transition ${
                  activeTab === 'lobby' 
                    ? "bg-gray-900 text-purple-400 shadow-md border border-gray-750" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                المشاركين بالفرق والأسماء ({room.players.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`flex items-center gap-1 bg-transparent border-0 px-4 py-1.5 text-xs font-bold rounded-xl transition ${
                  activeTab === 'questions' 
                    ? "bg-gray-900 text-purple-400 shadow-md border border-gray-750" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                بنك الأسئلة المعتمدة ({room.questions.length})
              </button>
            </div>

            {/* TAB CONTENT: LOBBY TEAMS */}
            {activeTab === 'lobby' && (
              <div className="space-y-6">
                {/* TEAMS GRID CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TEAM A (CYAN THEME) */}
                  <div className="bg-gradient-to-b from-cyan-950/20 to-transparent border border-cyan-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/10">
                      {editingTeamA ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={teamAName}
                            onChange={(e) => setTeamAName(e.target.value)}
                            className="bg-gray-950 border border-cyan-500/40 focus:border-cyan-400 text-xs px-2 py-1 text-white rounded outline-none w-36"
                          />
                          <button
                            type="button"
                            onClick={handleUpdateTeamNames}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white text-3s px-2 py-1 rounded"
                          >
                            حفظ
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-cyan-400 text-sm">{room.teamAName}</h4>
                          <button
                            type="button"
                            onClick={() => setEditingTeamA(true)}
                            className="p-1 text-gray-400 hover:text-white"
                            title="تعديل اسم الفريق"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-3s font-bold px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                        {teamAPlayers.length} من الأعضاء
                      </span>
                    </div>

                    {/* Team Players List */}
                    {isLocalMode && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const nameInput = form.elements.namedItem('playerNameA') as HTMLInputElement;
                        const name = nameInput.value.trim();
                        if (name) {
                          setRoom(prev => ({
                            ...prev,
                            players: [
                              ...prev.players,
                              { id: `local_p_${Date.now()}_A`, name, team: 'A', score: 0 }
                            ]
                          }));
                          nameInput.value = '';
                        }
                      }} className="mt-1 mb-4 flex gap-1.5 p-1 bg-cyan-950/20 rounded-xl border border-cyan-500/10">
                        <input
                          type="text"
                          name="playerNameA"
                          required
                          placeholder="اسم المتسابق..."
                          className="flex-1 bg-transparent text-xs px-2.5 py-1.5 text-white outline-none placeholder-cyan-300/40 text-right"
                        />
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-indigo-950 font-black text-xs px-3.5 py-1.5 rounded-lg transition active:scale-95 shrink-0">
                          + إضافة
                        </button>
                      </form>
                    )}

                    {teamAPlayers.length === 0 ? (
                      <div className="text-center py-10 text-gray-500 text-xs">
                        بانتظار انضمام الخصوم الأول...
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {teamAPlayers.map(player => (
                          <div 
                            key={player.id}
                            className="flex items-center justify-between p-2.5 bg-cyan-950/10 hover:bg-cyan-950/20 border border-cyan-500/10 rounded-xl transition"
                          >
                            <span className="font-medium text-xs text-gray-200">{player.name}</span>
                            <button
                              type="button"
                              onClick={() => handleKickPlayer(player.id)}
                              className="text-gray-500 hover:text-rose-400 p-1"
                              title="استبعاد من الفريق"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* TEAM B (ROSE THEME) */}
                  <div className="bg-gradient-to-b from-rose-950/20 to-transparent border border-rose-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-500/10">
                      {editingTeamB ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={teamBName}
                            onChange={(e) => setTeamBName(e.target.value)}
                            className="bg-gray-950 border border-rose-500/40 focus:border-rose-400 text-xs px-2 py-1 text-white rounded outline-none w-36"
                          />
                          <button
                            type="button"
                            onClick={handleUpdateTeamNames}
                            className="bg-rose-600 hover:bg-rose-500 text-white text-3s px-2 py-1 rounded"
                          >
                            حفظ
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-rose-400 text-sm">{room.teamBName}</h4>
                          <button
                            type="button"
                            onClick={() => setEditingTeamB(true)}
                            className="p-1 text-gray-400 hover:text-white"
                            title="تعديل اسم الفريق"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-3s font-bold px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                        {teamBPlayers.length} من الأعضاء
                      </span>
                    </div>

                    {/* Team Players List */}
                    {isLocalMode && (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const nameInput = form.elements.namedItem('playerNameB') as HTMLInputElement;
                        const name = nameInput.value.trim();
                        if (name) {
                          setRoom(prev => ({
                            ...prev,
                            players: [
                              ...prev.players,
                              { id: `local_p_${Date.now()}_B`, name, team: 'B', score: 0 }
                            ]
                          }));
                          nameInput.value = '';
                        }
                      }} className="mt-1 mb-4 flex gap-1.5 p-1 bg-rose-950/20 rounded-xl border border-rose-500/10">
                        <input
                          type="text"
                          name="playerNameB"
                          required
                          placeholder="اسم المتسابق..."
                          className="flex-1 bg-transparent text-xs px-2.5 py-1.5 text-white outline-none placeholder-rose-300/40 text-right"
                        />
                        <button type="submit" className="bg-rose-500 hover:bg-rose-400 text-white font-black text-xs px-3.5 py-1.5 rounded-lg transition active:scale-95 shrink-0">
                          + إضافة
                        </button>
                      </form>
                    )}

                    {teamBPlayers.length === 0 ? (
                      <div className="text-center py-10 text-gray-500 text-xs">
                        بانتظار انضمام الخصوم الثاني...
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {teamBPlayers.map(player => (
                          <div 
                            key={player.id}
                            className="flex items-center justify-between p-2.5 bg-rose-950/10 hover:bg-rose-950/20 border border-rose-500/10 rounded-xl transition"
                          >
                            <span className="font-medium text-xs text-gray-200">{player.name}</span>
                            <button
                              type="button"
                              onClick={() => handleKickPlayer(player.id)}
                              className="text-gray-500 hover:text-rose-400 p-1"
                              title="استبعاد من الفريق"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* LAUNCH BUTTON BAR */}
                <div className="flex items-center justify-between p-4 bg-indigo-900/50 border border-white/10 rounded-2xl shadow-xl">
                  <div className="text-right">
                    <p className="text-xs font-bold text-purple-300">هل الجميع جاهز ومستعد؟ 💪</p>
                    <p className="text-xs text-indigo-300 mt-0.5">عدد المشتركين الآن بالفرق {totalPlayersCount} لاعب.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="flex items-center gap-1.5 font-black text-xs bg-cyan-500 hover:bg-cyan-400 text-indigo-950 rounded-xl px-6 py-3 transition duration-150 shadow-md shadow-cyan-500/15"
                  >
                    <Play className="w-4.5 h-4.5" />
                    انطلق وابدأ اللعبة!
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: QUESTIONS DATABASE */}
            {activeTab === 'questions' && (
              <QuestionManager 
                questions={room.questions}
                onUpdateQuestions={handleUpdateQuestions}
              />
            )}
          </div>
        </div>
      )}

      {/* PLAYING GAME IN-PROGRESS STATE */}
      {room.status === 'playing' && currentQuestion && (() => {
        const totalScores = room.scores.A + room.scores.B;
        const ratioA = totalScores > 0 ? (room.scores.A / totalScores) * 100 : 50;
        const ratioB = totalScores > 0 ? (room.scores.B / totalScores) * 100 : 50;
        const diffPoints = Math.abs(room.scores.A - room.scores.B);

        return (
          <div className="space-y-6">
            
            {/* VIBRANT PALETTE 12-COLUMN COMPETITION ARENA */}
            <div className="grid grid-cols-12 gap-6 min-h-0 items-start">
              
              {/* TEAM A PANEL - CYAN THEME (3/12 COLS) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="bg-cyan-500 text-white rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-2xl transition duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <Trophy className="w-20 h-20 text-white" />
                  </div>
                  
                  <span className="text-3s uppercase tracking-widest text-cyan-100 font-extrabold mb-1">فريق المنافس الأول</span>
                  <h3 className="text-xl font-black mb-2 select-none truncate max-w-full text-center">{room.teamAName}</h3>
                  <div className="text-5xl font-black mb-4 font-mono tracking-tight">{room.scores.A}</div>
                  
                  {/* Manual quick points */}
                  <div className="flex gap-1.5 justify-center w-full z-10 mb-4 bg-white/10 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleManualScoreChange('A', 5)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-black py-1 rounded-lg transition"
                      title="أضف 5 نقاط يدوياً"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualScoreChange('A', -5)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-black py-1 rounded-lg transition"
                      title="خصم 5 نقاط"
                    >
                      -5
                    </button>
                  </div>

                  {/* Player list in Team A */}
                  <div className="w-full space-y-2 max-h-[220px] overflow-y-auto">
                    <p className="text-3s text-cyan-100 font-black border-b border-white/10 pb-1 text-center select-none">المتسابقون المتصلون</p>
                    {teamAPlayers.map((p) => (
                      <div key={p.id} className="bg-white/20 p-2 rounded-xl flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-white text-cyan-600 flex items-center justify-center font-black text-2s shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-2s font-black truncate">{p.name}</span>
                        <span className="text-3s bg-white/15 px-1.5 py-0.5 rounded-full font-mono font-bold mr-auto">{p.score}ن</span>
                      </div>
                    ))}
                    {teamAPlayers.length === 0 && (
                      <p className="text-3s text-cyan-100 text-center py-2 select-none">بانتظار المشتركين...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* QUESTION CENTER - PURE WHITE (6/12 COLS) */}
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                <div className="bg-white text-indigo-950 rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative border-4 border-indigo-100">
                  
                  {/* Floating Yellow badge */}
                  <div className="absolute -top-5.5 bg-yellow-400 text-indigo-950 px-8 py-2.5 rounded-full font-black text-sm shadow-xl tracking-wide select-none border border-yellow-300">
                    السؤال الحالي ({room.currentQuestionIndex + 1} من {room.questions.length})
                  </div>

                  {/* Conditional buzzer alarm vs. timer countdown */}
                  {room.buzzedBy ? (
                    <div className="w-full p-4 my-2 bg-rose-50 border-4 border-rose-500 rounded-3xl animate-bounce text-center space-y-2">
                      <span className="inline-block text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full animate-pulse">
                        🚨 تم قرع الجرس أولاً بالثانية المتسارعة!
                      </span>
                      <h4 className="text-2xl font-black text-indigo-950 italic">
                        المتسابق: {room.buzzedBy.playerName}
                      </h4>
                      <p className="text-xs font-bold text-gray-600">
                        من فريق: <span className="font-black text-indigo-900 underline">{room.buzzedBy.team === 'A' ? room.teamAName : room.teamBName}</span>
                      </p>

                      <div className="flex justify-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleResolveBuzzer(true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-2s py-2 px-4 rounded-xl transition shadow-md flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          صح (+{currentQuestion.points} ن)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveBuzzer(false)}
                          className="bg-rose-600 hover:bg-rose-550 text-white font-black text-2s py-2 px-4 rounded-xl transition shadow-md flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          خطأ (خصم بسيط)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="w-24 h-24 rounded-full border-8 border-rose-500 flex items-center justify-center mt-4 relative select-none">
                        <span className="text-3xl font-black text-rose-500 font-mono">{room.timerRemaining}</span>
                      </div>

                      {isLocalMode && (
                        <div className="flex bg-gray-50 p-2 border border-gray-100 rounded-2xl gap-3 w-full max-w-sm justify-center mb-4">
                          <button
                            type="button"
                            onClick={() => localBuzz('A')}
                            className="bg-cyan-500 hover:bg-cyan-400 text-indigo-950 font-black text-2xs py-2 px-3.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1 shrink-0"
                          >
                            🔔 {room.teamAName} (A)
                          </button>
                          <button
                            type="button"
                            onClick={() => localBuzz('B')}
                            className="bg-rose-500 hover:bg-rose-400 text-white font-black text-2xs py-2 px-3.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1 shrink-0"
                          >
                            🔔 {room.teamBName} (L)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Question Title */}
                  <p className="text-2xl md:text-3xl font-black leading-relaxed my-4 text-indigo-950">
                    {currentQuestion.text}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-4 text-right">
                    {currentQuestion.options.map((option, oIdx) => {
                      const isCorrect = oIdx === currentQuestion.correctIndex;
                      let optionClasses = "border-4 border-indigo-100 p-3.5 rounded-2xl font-bold text-sm text-indigo-900 bg-indigo-50/10";
                      
                      if (revealMode) {
                        if (isCorrect) {
                          optionClasses = "bg-indigo-600 text-white border-indigo-600 shadow-xl font-black scale-[1.01]";
                        } else {
                          optionClasses = "border-4 border-indigo-50/40 text-indigo-950/20 bg-indigo-50/5 opacity-40 line-through";
                        }
                      }

                      return (
                        <div key={oIdx} className={`transition-all duration-200 ${optionClasses}`}>
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded bg-indigo-100 text-indigo-955 font-black text-xs flex items-center justify-center shrink-0 ${
                              revealMode && isCorrect ? "bg-white text-indigo-600" : ""
                            }`}>
                              {["أ", "ب", "ج", "د"][oIdx]}
                            </span>
                            <span className="truncate">{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* OPTIONAL MULTI-CHOICE VOTE COUNT TRACKING */}
                  {gameMode === 'options' && (
                    <div className="w-full bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 my-2 text-right">
                      <div className="flex justify-between items-center text-2s font-bold text-indigo-950 mb-1">
                        <span>إحصائيات تصويت الهواتف:</span>
                        <span className="font-black text-indigo-700">{submittedCount} من {totalPlayersCount}</span>
                      </div>
                      <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${totalPlayersCount > 0 ? (submittedCount / totalPlayersCount) * 100 : 0}%` }}
                        />
                      </div>
                      {!revealMode && (
                        <button
                          type="button"
                          onClick={handleRevealAndAutoScore}
                          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-550 text-white font-black text-3s py-1.5 px-3 rounded-lg transition"
                        >
                          احسب إجابات الهواتف تلقائياً 📊
                        </button>
                      )}
                    </div>
                  )}

                  {/* ACTIVE TIMERS AND REVEAL ROW */}
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-indigo-100/80 w-full text-indigo-900">
                    <div className="flex items-center gap-1">
                      {room.timerActive ? (
                        <button
                          type="button"
                          onClick={() => handleTimerAction('pause')}
                          className="p-1 px-3.5 bg-yellow-500 text-indigo-950 text-3s font-black rounded-lg transition flex items-center gap-1"
                        >
                          <Pause className="w-3 h-3" />
                          إيقاف العداد
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTimerAction('start')}
                          className="p-1 px-3.5 bg-emerald-600 text-white text-3s font-black rounded-lg transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          تشغيل الوقت
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleTimerAction('reset')}
                        className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-3s font-bold rounded-lg transition"
                        title="إعادة تصفير"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>

                    {!revealMode && (
                      <button
                        type="button"
                        onClick={() => setRevealMode(true)}
                        className="bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-3s font-black px-4 py-1.5 rounded-xl transition"
                      >
                        كشف الجواب للجمهور 👀
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* TEAM B PANEL - ROSE THEME (3/12 COLS) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <div className="bg-rose-500 text-white rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-2xl transition duration-300">
                  <div className="absolute top-0 left-0 p-4 opacity-15">
                    <Trophy className="w-20 h-20 text-white" />
                  </div>
                  
                  <span className="text-3s uppercase tracking-widest text-rose-100 font-extrabold mb-1">فريق المنافس الثاني</span>
                  <h3 className="text-xl font-black mb-2 select-none truncate max-w-full text-center">{room.teamBName}</h3>
                  <div className="text-5xl font-black mb-4 font-mono tracking-tight">{room.scores.B}</div>
                  
                  {/* Manual quick points */}
                  <div className="flex gap-1.5 justify-center w-full z-10 mb-4 bg-white/10 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleManualScoreChange('B', 5)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-black py-1 rounded-lg transition"
                      title="أضف 5 نقاط يدوياً"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleManualScoreChange('B', -5)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-black py-1 rounded-lg transition"
                      title="خصم 5 نقاط"
                    >
                      -5
                    </button>
                  </div>

                  {/* Player list in Team B */}
                  <div className="w-full space-y-2 max-h-[220px] overflow-y-auto">
                    <p className="text-3s text-rose-100 font-black border-b border-white/10 pb-1 text-center select-none">المتسابقون المتصلون</p>
                    {teamBPlayers.map((p) => (
                      <div key={p.id} className="bg-white/20 p-2 rounded-xl flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center font-black text-2s shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-2s font-black truncate">{p.name}</span>
                        <span className="text-3s bg-white/15 px-1.5 py-0.5 rounded-full font-mono font-bold mr-auto">{p.score}ن</span>
                      </div>
                    ))}
                    {teamBPlayers.length === 0 && (
                      <p className="text-3s text-rose-100 text-center py-2 select-none">بانتظار المشتركين...</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* LOWER CONTROLS & NEXT SLIDE BAR */}
            <div className="flex items-center justify-between p-4 bg-indigo-900/50 border border-white/10 rounded-2xl shadow-xl">
              <button
                type="button"
                onClick={handleResetGame}
                className="bg-transparent text-indigo-300 hover:text-white text-xs border border-white/5 hover:border-white/10 font-bold px-4 py-2 rounded-xl transition"
              >
                إعادة تصفير المباراة بالكامل
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-1 font-black text-xs bg-cyan-500 hover:bg-cyan-400 text-indigo-950 rounded-xl px-6 py-3 transition shadow-lg shadow-cyan-500/10"
              >
                <span>{room.currentQuestionIndex + 1 < room.questions.length ? "السؤال التالي" : "عرض التصفيات والمنصة"}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* DUAL RELATIVE PROGRESS BAR (VIBRANT FOOTER INTERVENTION) */}
            <div className="bg-indigo-900/40 rounded-3xl p-6 border border-white/5 shadow-2xl mt-4 select-none">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-black text-cyan-400">
                  {room.teamAName} {room.scores.A > room.scores.B && "(متصدر)"}
                </span>
                <span className="text-sm font-black text-rose-400">
                  {room.teamBName} {room.scores.B > room.scores.A && "(متصدر)"}
                </span>
              </div>
              <div className="w-full h-6 bg-indigo-950 rounded-full flex overflow-hidden border-2 border-white/5 relative">
                <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${ratioA}%` }}></div>
                <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${ratioB}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-2 font-bold text-indigo-300">
                <span>فرق النقاط الحالي: +{diffPoints}</span>
                <span>إجمالي المتنافسين الحاضرين في الجلسة: {room.players.length} عباقرة</span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* GAME ENDED STATE (PODIUM & CELEBRATIONS) */}
      {room.status === 'ended' && (
        <div className="space-y-8 animate-fade-in text-center">
          {/* Winner banner */}
          <div className="bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30 p-8 rounded-3xl relative overflow-hidden text-center space-y-4 shadow-2xl">
            {/* sparkles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white">تهانينا الحارة للفريق البطل! 🏆</h2>
            
            {/* Winner team announcement */}
            <div className="text-xl md:text-2xl font-black tracking-wide my-4">
              {room.scores.A > room.scores.B ? (
                <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-2xl shadow-lg">
                  🎉 {room.teamAName} هو المنتصر الساحق!
                </span>
              ) : room.scores.B > room.scores.A ? (
                <span className="text-rose-400 bg-rose-505/10 border border-rose-500/20 px-4 py-2 rounded-2xl shadow-lg">
                  🎉 {room.teamBName} هو المنتصر الساحق!
                </span>
              ) : (
                <span className="text-yellow-400 bg-yellow-505/10 border border-yellow-500/20 px-4 py-2 rounded-2xl">
                  مباراة مذهلة! انتهت بالتعادل العادل 🤝
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              أداء تنافسي باهر من كلا المعسكرين لتوليد الحماس المثير! إليكم النتيجة النهائية للمباراة واللوحة لأفضل اللاعبين أداءً.
            </p>
          </div>

          {/* DUAL STAT PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-5 bg-cyan-950/10 border border-cyan-500/10 rounded-2xl text-center">
              <p className="text-xs text-gray-400 mb-1 font-bold">{room.teamAName}</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{room.scores.A} نقطة</p>
            </div>
            <div className="p-5 bg-rose-950/10 border border-rose-500/10 rounded-2xl text-center">
              <p className="text-xs text-gray-400 mb-1 font-bold">{room.teamBName}</p>
              <p className="text-2xl font-bold text-rose-400 font-mono">{room.scores.B} نقطة</p>
            </div>
          </div>

          {/* TOP PLAYERS HIGH SCORER LIST */}
          <div className="w-full max-w-xl mx-auto bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 text-right">
            <h4 className="text-sm font-bold text-gray-200 mb-4 pb-2 border-b border-gray-850 flex items-center gap-1.5">
              <Medal className="text-yellow-500 w-5 h-5 animate-pulse" />
              لوحة صدارة الأعضاء الأكثر مشاركةً ونقاطاً
            </h4>

            {room.players.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">لا توجد سجلات لاعبين حالية.</p>
            ) : (
              <div className="space-y-2">
                {[...room.players].sort((a,b) => b.score - a.score).map((player, idx) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-950/80 border border-gray-855 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                        idx === 1 ? "bg-gray-300/20 text-gray-300 border border-gray-400/30" :
                        idx === 2 ? "bg-amber-600/20 text-amber-600 border border-amber-500/30" :
                        "bg-gray-850 text-gray-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-200">{player.name}</span>
                      <span className={`text-3s px-2 py-0.5 rounded-full ${
                        player.team === 'A' ? "bg-cyan-500/10 text-cyan-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {player.team === 'A' ? room.teamAName : room.teamBName}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-yellow-400 font-mono">
                      {player.score} نقطة
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PLAY AGAIN CONTROL PANEL */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleResetGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition duration-150 flex items-center gap-1 shadow-lg shadow-purple-600/25"
            >
              <RefreshCw className="w-4 h-4" />
              أعد تشغيل مباراة جديدة
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm rounded-xl transition"
            >
              الخروج للرئيسية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
