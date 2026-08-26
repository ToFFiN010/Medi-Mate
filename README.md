# MediMate — Medication Management & AI Health Assistant

MediMate is a modern, responsive healthcare web application designed to help patients manage prescription schedules, track medication stock levels, receive automated dosage reminders and audio alarms, track adherence analytics, and interact with an intelligent AI Health Assistant.

![MediMate Interface Banner](public/index.html)

---

## 🌟 Features

- **🔐 User Authentication & Patient Profiles**: Secure Login, Registration, Password Recovery, and editable patient profile profiles with custom avatar uploading.
- **💊 Medication Cabinet & Schedule**: Full CRUD management of medications with name, dosage, timing, stock tracking, type categories (Pills, Capsules, Injections, Liquids, Topicals), and custom notes.
- **⏰ Real-Time Reminders & Audio Alarms**: Automated pop-up reminders at dose times, customizable snooze durations, audible chime alerts, and voice text-to-speech reminder synthesis.
- **⚠️ Low-Stock Tracking**: Real-time warnings when medication inventory drops below 10 doses, ensuring timely refills.
- **📊 Health Compliance & Analytics**: Daily, weekly, and monthly adherence metrics with interactive compliance charts and historical dose logging.
- **🤖 MediMate AI Health Assistant**: Intelligent assistant powered by Google Gemini API (with rule-based offline fallback) offering guidance on schedule management, stock checks, and medical safety notices.
- **📱 Mobile-First Responsive UI**: Modern dark glassmorphism SaaS interface optimized across all screen sizes (320px to 1440px+), featuring a desktop sidebar and mobile bottom navigation bar with touch-friendly 44px+ targets.
- **♿ Accessibility Compliant**: Keyboard focus rings (`:focus-visible`), ARIA attributes, semantic HTML elements, high contrast, and `prefers-reduced-motion` animation support.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Variables, Flexbox/Grid), JavaScript (ES6+ Native Modules, Web Audio API, SpeechSynthesis API).
- **Backend**: Node.js, Express.js (ES Modules), CORS, Dotenv.
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`) with structured health safety boundaries.
- **Icons & Fonts**: Lucide Icons, Google Fonts (Inter & Outfit).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (Node Package Manager)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ToFFiN010/Medi-Mate.git
   cd medimate
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If `GEMINI_API_KEY` is omitted, MediMate automatically uses its built-in rule-based offline AI assistant engine.*

4. **Run the Application**:

   - **Development Mode** (with automatic restart):
     ```bash
     npm run dev
     ```

   - **Production Mode**:
     ```bash
     npm start
     ```

5. **Access MediMate**:
   Open your browser and navigate to `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

---

## 🔑 Environment Variables

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | Local Express web server port | No | `3000` |
| `GEMINI_API_KEY` | Google Gemini API Key for AI Health Assistant | No | Rule-based engine fallback |

---

## 🐙 GitHub Repository Setup

To initialize and push changes to GitHub:

```bash
git init
git remote add origin https://github.com/ToFFiN010/Medi-Mate.git
git branch -M main
git add .
git commit -m "Enhance MediMate UI/UX, mobile responsiveness, and accessibility"
git push -u origin main
```

---

## 🔒 Security & Privacy

MediMate enforces strict health safety rules within the AI Assistant prompt structure, emphasizing that AI responses are informational and should never substitute professional medical advice. Sensitive credentials and `.env` configuration files are strictly excluded via `.gitignore`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
