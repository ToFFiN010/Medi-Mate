import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory User Database with default seed user
const usersDb = [
  {
    id: 'user-8492',
    fullName: 'John Doe',
    email: 'john.doe@medimate.health',
    password: 'Password123!', // In production, use bcrypt hash
    phone: '+1 (555) 234-5678',
    createdAt: 'August 19, 2026',
    avatarInitials: 'JD',
    avatarUrl: null
  }
];

function buildUserPayload(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    avatarInitials: user.avatarInitials,
    avatarUrl: user.avatarUrl || null
  };
}

// ==========================================
// AUTHENTICATION API ENDPOINTS
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = `token_${user.id}_${Date.now()}`;
  return res.json({ token, user: buildUserPayload(user) });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const existingUser = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const nameParts = fullName.trim().split(' ');
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : fullName.substring(0, 2).toUpperCase();

  const nowOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const newUser = {
    id: `user-${Date.now()}`,
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    phone: phone ? phone.trim() : '',
    createdAt: new Date().toLocaleDateString('en-US', nowOptions),
    avatarInitials: initials,
    avatarUrl: null
  };

  usersDb.push(newUser);

  const token = `token_${newUser.id}_${Date.now()}`;
  return res.status(201).json({ token, user: buildUserPayload(newUser) });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const user = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'No account registered with this email address.' });
  }

  return res.json({ message: `Password reset instructions have been dispatched to ${email}.` });
});

// POST /api/auth/profile
app.post('/api/auth/profile', (req, res) => {
  const { userId, fullName, email, phone, avatarUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const user = usersDb.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  if (fullName) {
    user.fullName = fullName.trim();
    const parts = user.fullName.split(' ');
    user.avatarInitials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
  }
  if (email) user.email = email.toLowerCase().trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  return res.json({ user: buildUserPayload(user) });
});

// ==========================================
// AI HEALTH ASSISTANT ENGINE
// ==========================================

const SYSTEM_SAFETY_PROMPT = `
You are the MediMate AI Health Assistant. Your goal is to help users understand their medication schedule, stock, dosages, and basic health info.
CRITICAL SAFETY CONSTRAINTS:
1. You are an AI assistant providing general health information only. You are NOT a doctor or medical professional.
2. DO NOT diagnose diseases or medical conditions.
3. DO NOT recommend changing medication dosages or stopping prescription medications.
4. Always advise consulting a qualified doctor or pharmacist before making any changes to prescribed medication.
5. If the user mentions severe or dangerous symptoms (e.g. chest pain, shortness of breath, sudden weakness), advise them to seek emergency medical attention immediately.
6. Be friendly, empathetic, concise, and clear.
`;

function generateRuleBasedReply(message, medications = []) {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes('chest pain') ||
    lowerMsg.includes('can\'t breathe') ||
    lowerMsg.includes('shortness of breath') ||
    lowerMsg.includes('heart attack') ||
    lowerMsg.includes('stroke') ||
    lowerMsg.includes('severe pain')
  ) {
    return '🚨 **Important Safety Notice**: If you are experiencing severe symptoms such as chest pain or breathing difficulty, please call emergency services (e.g. 911 or local emergency) or visit the nearest emergency room immediately. I am an AI assistant and cannot provide emergency medical care.';
  }

  if (
    lowerMsg.includes('today') ||
    lowerMsg.includes('schedule') ||
    lowerMsg.includes('what medicines') ||
    lowerMsg.includes('what meds') ||
    lowerMsg.includes('my medications') ||
    lowerMsg.includes('how many')
  ) {
    if (!medications || medications.length === 0) {
      return 'You currently have no medications in your MediMate cabinet. You can add your medications using the "Add Medication" button.';
    }
    const takenList = medications.filter((m) => m.status === 'taken' || m.taken);
    const pendingList = medications.filter((m) => m.status !== 'taken' && !m.taken);

    let summary = `You have **${medications.length} total medication(s)** registered:\n\n`;
    if (pendingList.length > 0) {
      summary += `⏳ **Pending Doses (${pendingList.length}):**\n` +
        pendingList.map((m) => `• **${m.name}** (${m.dosage}) at **${m.time}** [Stock: ${m.stock}]`).join('\n') + '\n\n';
    } else {
      summary += '🎉 All scheduled doses for today have been completed!\n\n';
    }

    if (takenList.length > 0) {
      summary += `✅ **Taken Today (${takenList.length}):**\n` +
        takenList.map((m) => `• **${m.name}** (${m.dosage})`).join('\n') + '\n\n';
    }
    summary += '_Disclaimer: Please consult your doctor or pharmacist if you have questions about your prescribed timing._';
    return summary;
  }

  if (lowerMsg.includes('pending') || lowerMsg.includes('remaining') || lowerMsg.includes('left to take')) {
    const pendingList = medications.filter((m) => m.status !== 'taken' && !m.taken);
    if (pendingList.length === 0) {
      return 'Great news! You have **0 pending medications** for today. All scheduled doses have been taken.';
    }
    return `You have **${pendingList.length} pending dose(s)** remaining today:\n` +
      pendingList.map((m) => `• **${m.name}** (${m.dosage}) scheduled at **${m.time}**`).join('\n');
  }

  if (lowerMsg.includes('low stock') || lowerMsg.includes('refill') || lowerMsg.includes('running low')) {
    const lowStockList = medications.filter((m) => m.stock < 10);
    if (lowStockList.length === 0) {
      return 'All your medications are currently well-stocked (10 or more doses remaining).';
    }
    return `⚠️ **Low Stock Alert**: The following medication(s) need refilling soon:\n` +
      lowStockList.map((m) => `• **${m.name}**: ${m.stock} doses remaining`).join('\n');
  }

  if (lowerMsg.includes('tonight') || lowerMsg.includes('evening') || lowerMsg.includes('night')) {
    const eveningMeds = medications.filter((m) => {
      const hour = parseInt(m.time.split(':')[0], 10);
      return hour >= 18;
    });
    if (eveningMeds.length === 0) {
      return 'You have no medications scheduled for tonight (after 6:00 PM).';
    }
    return `Here are your evening/tonight medications:\n` +
      eveningMeds.map((m) => `• **${m.name}** (${m.dosage}) at **${m.time}** - ${(m.status === 'taken' || m.taken) ? 'Taken ✅' : 'Pending ⏳'}`).join('\n');
  }

  const matchedMed = medications.find((m) =>
    lowerMsg.includes(m.name.toLowerCase())
  );
  if (matchedMed) {
    const isTaken = matchedMed.status === 'taken' || matchedMed.taken;
    if (lowerMsg.includes('when') || lowerMsg.includes('time')) {
      return `**${matchedMed.name}** (${matchedMed.dosage}) is scheduled for **${matchedMed.time}**. Status: **${isTaken ? 'Taken ✅' : 'Pending ⏳'}** (Stock: **${matchedMed.stock}**).`;
    }
    return `**${matchedMed.name}** (${matchedMed.dosage}):\n- Scheduled Time: **${matchedMed.time}**\n- Status: **${isTaken ? 'Taken ✅' : 'Pending ⏳'}**\n- Current Stock: **${matchedMed.stock} doses**\n\nFor specific clinical instructions, please consult your prescribing doctor.`;
  }

  if (
    lowerMsg.includes('stop') ||
    lowerMsg.includes('increase') ||
    lowerMsg.includes('decrease') ||
    lowerMsg.includes('change dose') ||
    lowerMsg.includes('double dose') ||
    lowerMsg.includes('side effect')
  ) {
    return '⚠️ **Medical Caution**: Please do NOT alter your prescribed dosage or stop taking prescription medication without first consulting your doctor or pharmacist. Your healthcare provider will safely guide any adjustments needed.';
  }

  return `Hello! I am your MediMate AI Health Assistant. I am tracking your medication cabinet (${medications.length} items registered).\n\nYou can ask me:\n- "What medicines do I have today?"\n- "Which medicines are pending?"\n- "Which medicine has low stock?"\n- "What is scheduled tonight?"\n\n*Note: I provide general information only. Always consult your doctor for medical advice.*`;
}

app.post('/api/health-assistant/', async (req, res) => {
  try {
    const { message, medications } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message field is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const reply = generateRuleBasedReply(message, medications);
      return res.json({ reply });
    }

    const promptContext = `
${SYSTEM_SAFETY_PROMPT}

CURRENT USER MEDICATION CONTEXT:
${JSON.stringify(medications || [], null, 2)}

USER QUESTION:
${message}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptContext }] }]
      })
    });

    if (!geminiRes.ok) {
      const reply = generateRuleBasedReply(message, medications);
      return res.json({ reply });
    }

    const data = await geminiRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      return res.json({ reply: candidateText });
    } else {
      const reply = generateRuleBasedReply(message, medications);
      return res.json({ reply });
    }
  } catch (err) {
    const reply = generateRuleBasedReply(req.body.message || '', req.body.medications || []);
    return res.json({ reply });
  }
});

function startServer(portToTry, attempt = 1) {
  const server = app.listen(portToTry, () => {
    console.log(`\n==================================================`);
    console.log(`  MediMate server is running on http://localhost:${portToTry}`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt <= 3) {
        setTimeout(() => startServer(portToTry, attempt + 1), 400);
      } else {
        startServer(portToTry + 1, 1);
      }
    } else {
      console.error('Server startup error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
