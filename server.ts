import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Initialize the Gemini client if available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Enable CORS manually to support cross-origin requests from external deployments like Vercel
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

const ROOMS_FILE = path.join(process.cwd(), "rooms_backup.json");

function saveRooms(data: any) {
  try {
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save rooms backup:", err);
  }
}

const apiLogs: string[] = [];
app.use("/api", (req, res, next) => {
  const logStr = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  apiLogs.push(logStr);
  console.log(logStr);
  
  const originalJson = res.json;
  res.json = function(body) {
    const respLog = `[${new Date().toISOString()}] Status ${res.statusCode} for ${req.method} ${req.originalUrl}`;
    apiLogs.push(respLog);
    console.log(respLog);
    
    const result = originalJson.call(this, body);
    if (req.method !== "GET" && req.originalUrl.includes("/api/rooms")) {
      saveRooms(rooms);
    }
    return result;
  };
  next();
});

app.get("/api/debug-sync-logs", (req, res) => {
  res.json({ logs: apiLogs.slice(-100) });
});

const PORT = 3000;

interface Player {
  id: string;
  name: string;
  team: 'A' | 'B';
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: string[]; // usually 4 choices
  correctIndex: number; // 0 to 3
  points: number;
}

interface Room {
  id: string; // 4-digit code e.g. '1234'
  createdAt: number;
  status: 'lobby' | 'playing' | 'ended';
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  
  // High-performance Stateless Timer configuration
  timerDuration: number; // default duration e.g. 20
  timerEndTimestamp: number | null; // time when current count goes to 0
  pausedRemaining: number | null; // remaining seconds if paused
  timerActive: boolean;

  scores: {
    A: number;
    B: number;
  };
  
  // Game Actions
  buzzedBy: {
    playerId: string;
    playerName: string;
    team: 'A' | 'B';
    timestamp: number;
  } | null;

  // Answers tracker
  answersSubmitted: {
    [playerId: string]: {
      optionIndex: number;
      isCorrect: boolean;
      timestamp: number;
    }
  };

  teamAName: string;
  teamBName: string;
}

function loadRooms(): { [id: string]: Room } {
  try {
    if (fs.existsSync(ROOMS_FILE)) {
      const data = fs.readFileSync(ROOMS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load rooms backup:", err);
  }
  return {};
}

// In-memory rooms cache preloaded from persistent backup file to persist hot-reloads and container cycles
const rooms: { [id: string]: Room } = loadRooms();

// Helper to calculate timer remaining without ticking loops
function refreshRoomTimer(room: Room) {
  if (!room.timerActive) {
    return;
  }
  
  if (room.timerEndTimestamp) {
    const remaining = Math.max(0, Math.ceil((room.timerEndTimestamp - Date.now()) / 1000));
    if (remaining === 0) {
      room.timerActive = false;
      room.timerEndTimestamp = null;
      room.pausedRemaining = 0;
    }
  }
}

// Helper to get active timer state
function getTimerRemaining(room: Room): number {
  if (room.timerActive && room.timerEndTimestamp) {
    return Math.max(0, Math.ceil((room.timerEndTimestamp - Date.now()) / 1000));
  }
  if (room.pausedRemaining !== null) {
    return room.pausedRemaining;
  }
  return room.timerDuration;
}

// Default questions bank in Arabic
const defaultQuestionsSeed: Question[] = [
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

// 1. Create a game room
app.post("/api/rooms/create", (req, res) => {
  const customQuestions = req.body.questions as Question[] | undefined;
  
  // Generate 4-digit unique code
  let roomCode = "";
  let attempts = 0;
  do {
    roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    attempts++;
  } while (rooms[roomCode] && attempts < 50);

  const newRoom: Room = {
    id: roomCode,
    createdAt: Date.now(),
    status: 'lobby',
    players: [],
    questions: customQuestions && customQuestions.length > 0 ? customQuestions : [...defaultQuestionsSeed],
    currentQuestionIndex: 0,
    timerDuration: 20,
    timerEndTimestamp: null,
    pausedRemaining: null,
    timerActive: false,
    scores: {
      A: 0,
      B: 0
    },
    buzzedBy: null,
    answersSubmitted: {},
    teamAName: "الفريق الرمز (أ)",
    teamBName: "الفريق المنافس (ب)"
  };

  rooms[roomCode] = newRoom;
  res.json(newRoom);
});

// Sync and register room that was originally initialized locally
app.post("/api/rooms/sync-local", (req, res) => {
  const { room } = req.body;
  if (!room || !room.id) {
    return res.status(400).json({ error: "بيانات الغرفة غير صالحة" });
  }

  rooms[room.id] = {
    ...room,
    isLocalMode: false // Mark as online on the server
  };

  res.json(rooms[room.id]);
});

// 2. Fetch room status
app.get("/api/rooms/:id", (req, res) => {
  const room = rooms[req.params.id];
  if (!room) {
    return res.status(404).json({ error: "غرفة اللعب غير موجودة! يرجى التأكد من الرمز الإضافي." });
  }
  
  refreshRoomTimer(room);
  
  // Return extra calculated properties
  res.json({
    ...room,
    timerRemaining: getTimerRemaining(room)
  });
});

// 3. Join a room as a player
app.post("/api/rooms/:id/join", (req, res) => {
  const { name, team } = req.body;
  const room = rooms[req.params.id];
  
  if (!room) {
    return res.status(404).json({ error: "غرفة اللعب غير موجودة!" });
  }

  if (!name || !team || (team !== 'A' && team !== 'B')) {
    return res.status(400).json({ error: "البيانات المدخلة غير صحيحة. يرجى توفير الاسم واختيار الفريق." });
  }

  // Generate unique player ID
  const playerId = "p_" + Math.random().toString(36).substr(2, 9);
  const newPlayer: Player = {
    id: playerId,
    name: name.trim(),
    team,
    score: 0
  };

  room.players.push(newPlayer);
  res.json({ playerId, player: newPlayer, room });
});

// 4. Update team names
app.post("/api/rooms/:id/update-teams", (req, res) => {
  const { teamAName, teamBName } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  if (teamAName) room.teamAName = teamAName;
  if (teamBName) room.teamBName = teamBName;

  res.json(room);
});

// 5. Update or set questions bank
app.post("/api/rooms/:id/edit-questions", (req, res) => {
  const { questions } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  if (Array.isArray(questions)) {
    room.questions = questions.map((q: any, index) => ({
      id: q.id || `q_${Date.now()}_${index}`,
      text: q.text || "سؤال مجهول",
      options: Array.isArray(q.options) ? q.options : ["أ", "ب", "ج", "د"],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      points: typeof q.points === 'number' ? q.points : 10
    }));
  }

  res.json(room);
});

// 6. Start the game session
app.post("/api/rooms/:id/start", (req, res) => {
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  room.status = 'playing';
  room.currentQuestionIndex = 0;
  room.scores = { A: 0, B: 0 };
  room.buzzedBy = null;
  room.answersSubmitted = {};
  
  // Set default question clock
  room.timerActive = false;
  room.pausedRemaining = room.timerDuration;
  room.timerEndTimestamp = null;

  res.json(room);
});

// 7. Question timer actions
app.post("/api/rooms/:id/timer-action", (req, res) => {
  const { action, duration } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  refreshRoomTimer(room);

  if (duration && typeof duration === 'number') {
    room.timerDuration = duration;
  }

  if (action === "start") {
    room.timerActive = true;
    const remaining = room.pausedRemaining !== null ? room.pausedRemaining : room.timerDuration;
    room.timerEndTimestamp = Date.now() + remaining * 1000;
    room.pausedRemaining = null;
  } else if (action === "pause") {
    if (room.timerActive && room.timerEndTimestamp) {
      const remaining = Math.max(0, Math.ceil((room.timerEndTimestamp - Date.now()) / 1000));
      room.pausedRemaining = remaining;
    }
    room.timerActive = false;
    room.timerEndTimestamp = null;
  } else if (action === "reset") {
    room.timerActive = false;
    room.timerEndTimestamp = null;
    room.pausedRemaining = room.timerDuration;
    room.buzzedBy = null;
    room.answersSubmitted = {};
  }

  res.json({
    ...room,
    timerRemaining: getTimerRemaining(room)
  });
});

// 8. Player buzzing
app.post("/api/rooms/:id/buzz", (req, res) => {
  const { playerId } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "غرفة اللعب غير صالحة" });

  if (room.status !== 'playing') {
    return res.status(400).json({ error: "المسابقة لم تبدأ بعد" });
  }

  // Already buzzed
  if (room.buzzedBy) {
    return res.json({ buzzed: false, message: "تم الضغط بالفعل مسبقاً من لاعب آخر!", currentBuzz: room.buzzedBy });
  }

  // Find player
  const player = room.players.find(p => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: "لا يمكن العثور على اللاعب في هذا الفريق" });
  }

  // Auto-pause timer when buzzing
  refreshRoomTimer(room);
  if (room.timerActive && room.timerEndTimestamp) {
    const remaining = Math.max(0, Math.ceil((room.timerEndTimestamp - Date.now()) / 1000));
    room.pausedRemaining = remaining;
  }
  room.timerActive = false;
  room.timerEndTimestamp = null;

  // Set buzzer owner
  room.buzzedBy = {
    playerId: player.id,
    playerName: player.name,
    team: player.team,
    timestamp: Date.now()
  };

  res.json({ buzzed: true, room: { ...room, timerRemaining: getTimerRemaining(room) } });
});

// 9. Host manual scoring or resolving buzzer
app.post("/api/rooms/:id/score-manual", (req, res) => {
  const { team, points, resolveBuzzer, isCorrect } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "غرفة اللعب غير موجودة" });

  if (resolveBuzzer && room.buzzedBy) {
    const scoredTeam = room.buzzedBy.team;
    const currentQ = room.questions[room.currentQuestionIndex];
    const qPoints = currentQ ? currentQ.points : 10;

    if (isCorrect) {
      room.scores[scoredTeam] += qPoints;
      // Mark player score too if found
      const player = room.players.find(p => p.id === room.buzzedBy?.playerId);
      if (player) player.score += qPoints;
    } else {
      // Deduct half or full points, let's keep it safe (subtract nothing, or optional toggle)
      // We will subtract 5 to provide thrill!
      room.scores[scoredTeam] = Math.max(0, room.scores[scoredTeam] - Math.ceil(qPoints / 2));
    }
    room.buzzedBy = null; // Reset buzzer
  } else if (team && typeof points === 'number') {
    const targetTeam = team as 'A' | 'B';
    room.scores[targetTeam] = Math.max(0, room.scores[targetTeam] + points);
  }

  res.json(room);
});

// 10. Submit Answer directly for quiz answer sheets
app.post("/api/rooms/:id/submit-answer", (req, res) => {
  const { playerId, optionIndex } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "غرفة اللعبة غير موجودة" });

  const player = room.players.find(p => p.id === playerId);
  if (!player) return res.status(404).json({ error: "اللاعب غير مسجل" });

  const currentQ = room.questions[room.currentQuestionIndex];
  if (!currentQ) return res.status(400).json({ error: "السؤال الحالي غير صالح" });

  const isCorrect = optionIndex === currentQ.correctIndex;

  // Record this player's submission
  room.answersSubmitted[playerId] = {
    optionIndex,
    isCorrect,
    timestamp: Date.now()
  };

  res.json({ success: true, isCorrect });
});

// 11. Host triggers automated calculation for the current question
// For client devices that directly vote on correct answers
app.post("/api/rooms/:id/reveal-answers", (req, res) => {
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "غرفة اللعبة غير موجودة" });

  const currentQ = room.questions[room.currentQuestionIndex];
  if (!currentQ) return res.status(400).json({ error: "لا يوجد سؤال نشط لتقييمه" });

  // Calculate scores automatically for everyone who answered correctly!
  // Points are given to the overall team score based on the count of correct players.
  // We can add a proportional score, or flat points if at least one player got it correct.
  // Let's add full question points to the team if at least one correct answer, or points proportional!
  // Proportional looks extremely cool: points = correct_players_count * 5!
  // Let's do: Every correct player earns flat question points for their team!
  let teamACorrect = 0;
  let teamBCorrect = 0;

  room.players.forEach(p => {
    const submission = room.answersSubmitted[p.id];
    if (submission && submission.isCorrect) {
      p.score += currentQ.points;
      if (p.team === 'A') teamACorrect++;
      else teamBCorrect++;
    }
  });

  // Score multiplier for teams
  if (teamACorrect > 0) room.scores.A += currentQ.points;
  if (teamBCorrect > 0) room.scores.B += currentQ.points;

  // Stop timer
  room.timerActive = false;
  room.timerEndTimestamp = null;
  room.pausedRemaining = 0;

  res.json({
    room,
    stats: {
      teamACorrect,
      teamBCorrect,
      scoredPoints: currentQ.points
    }
  });
});

// 12. Host moves to Next Question
app.post("/api/rooms/:id/next-question", (req, res) => {
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "غرفة اللعب غير صالحة" });

  room.buzzedBy = null;
  room.answersSubmitted = {};

  if (room.currentQuestionIndex + 1 < room.questions.length) {
    room.currentQuestionIndex += 1;
    // Reset Timer values
    room.timerActive = false;
    room.pausedRemaining = room.timerDuration;
    room.timerEndTimestamp = null;
  } else {
    room.status = 'ended';
  }

  res.json(room);
});

// 13. Kick player
app.post("/api/rooms/:id/kick-player", (req, res) => {
  const { playerId } = req.body;
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  room.players = room.players.filter(p => p.id !== playerId);
  res.json(room);
});

// 14. Reset/Clear Room
app.post("/api/rooms/:id/reset", (req, res) => {
  const room = rooms[req.params.id];
  if (!room) return res.status(404).json({ error: "الغرفة غير موجودة" });

  room.status = 'lobby';
  room.currentQuestionIndex = 0;
  room.scores = { A: 0, B: 0 };
  room.players.forEach(p => p.score = 0);
  room.buzzedBy = null;
  room.answersSubmitted = {};
  room.timerActive = false;
  room.pausedRemaining = room.timerDuration;
  room.timerEndTimestamp = null;

  res.json(room);
});

// 15. Generate questions dynamically using Gemini AI on any requested topic!
app.post("/api/generate-questions-ai", async (req, res) => {
  const { topic, amount } = req.body;
  const count = Math.min(Math.max(Number(amount) || 5, 3), 15); // limit between 3 to 15 questions
  const selectedTopic = topic || "الثقافة العامة والتاريخ";

  if (!process.env.GEMINI_API_KEY || !ai) {
    return res.status(422).json({ 
      error: "مفتاح الذكاء الاصطناعي (GEMINI_API_KEY) لم يتم ضبطه في إعدادات التطبيق. يرجى توفير المفتاح في لوحة الأسرار (Secrets)." 
    });
  }

  try {
    const prompt = `أنت خبير مسابقات ثقافية وترفيهية ممتعة.
قم بإنشاء عدد ${count} أسئلة اختيار من متعدد في موضوع: "${selectedTopic}".
يجب أن تكون الأسئلة بالكامل باللغة العربية، شيقة، وممتعة للغاية.
كل سؤال يجب أن يحتوي على أربعة خيارات واضحة، وخيار واحد صحيح فقط.
يجب إرجاع النتيجة كـ JSON صارم مطابق لهيكل البيانات الموصوف أدناه بالكامل ولا تضف أي نص آخر قبله أو بعده.

هيكل الـ JSON المطلوب:
أعد مصفوفة من العناصر، كل عنصر يمثل سؤالاً ويحتوي على الحقول التالية:
- text: نص السؤال في جملة كاملة واضحة ومثيرة.
- options: مصفوفة تحتوي على 4 نصوص تمثل الاختيارات (أ، ب، ج، د).
- correctIndex: رقم يمثل الفهرس الصحيح للجواب من (0 إلى 3).
- points: قيمة النقاط المناسبة لصعوبة السؤال (مثلاً: 10 أو 15 أو 20 أو 25).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "نص السؤال بالكامل" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "أربعة خيارات للسؤال"
              },
              correctIndex: { type: Type.INTEGER, description: "الرقم الصحيح للجواب من 0 إلى 3" },
              points: { type: Type.INTEGER, description: "عدد النقاط للسؤال" }
            },
            required: ["text", "options", "correctIndex", "points"]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("لم يقم الذكاء الاصطناعي بإنشاء رد صحيح");
    }

    const cleanedText = textOutput.trim();
    const questionsData = JSON.parse(cleanedText);
    
    // Add unique IDs to the questions
    const formattedQuestions = questionsData.map((q: any, i: number) => ({
      id: `ai_${Date.now()}_${i}`,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      points: q.points || 10
    }));

    res.json({ questions: formattedQuestions });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "فشل توليد الأسئلة الذكية: " + (error.message || error) });
  }
});

// Configure Vite compiler middleware for development, serving index.html on secondary fallback
async function serveApp() {
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
    console.log(`Express multi-user game server started on http://0.0.0.0:${PORT}`);
  });
}

serveApp();
