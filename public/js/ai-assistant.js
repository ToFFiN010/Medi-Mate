/* ==========================================================================
   MediMate AI Health Assistant Interface & Backend API Client
   ========================================================================== */

let lastAiResponseText = '';
let chatMessages = [];

/**
 * Initializes chat history from localStorage or seed message.
 */
function initChatHistory() {
  const saved = localStorage.getItem('medimate_chat_history');
  if (saved) {
    try {
      chatMessages = JSON.parse(saved);
    } catch (e) {
      chatMessages = [];
    }
  }

  if (!chatMessages || chatMessages.length === 0) {
    chatMessages = [
      {
        sender: 'ai',
        text: 'Hello! I am your MediMate Health Assistant. Ask me anything about your scheduled doses, stock levels, or medicine timings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  renderChatHistoryUI();
}

/**
 * Renders all stored chat bubbles into the chat history view.
 */
function renderChatHistoryUI() {
  const container = document.getElementById('chatHistory');
  if (!container) return;

  if (chatMessages.length === 0) {
    container.innerHTML = `
      <div class="empty-state text-center" style="padding: 2rem 1rem;">
        <i data-lucide="bot" style="width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <p class="text-secondary">Ask MediMate anything about your medication schedule.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = chatMessages.map((msg) => {
    const isUser = msg.sender === 'user';
    const bubbleClass = isUser ? 'user-message' : 'ai-message';
    const iconName = isUser ? 'user' : 'bot';

    return `
      <div class="chat-message ${bubbleClass}">
        <div class="msg-bubble">
          ${formatMarkdownText(escapeHtml(msg.text))}
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;

  // Track last AI text for voice reader
  const lastAiMsg = [...chatMessages].reverse().find((m) => m.sender === 'ai');
  if (lastAiMsg) {
    lastAiResponseText = lastAiMsg.text;
  }
}

/**
 * Sends a chat message to the Express AI backend (/api/health-assistant/).
 */
async function sendChatMessage() {
  const inputEl = document.getElementById('chatInput');
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  // User message
  const userMsg = {
    sender: 'user',
    text: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  chatMessages.push(userMsg);
  inputEl.value = '';
  renderChatHistoryUI();
  saveChatHistory();

  // Show typing loading indicator
  setAiTypingState(true);

  try {
    // Medication Context Payload
    const medicationsPayload = (window.medications || []).map((m) => ({
      name: m.name,
      dosage: m.dosage,
      time: m.time,
      status: m.taken ? 'Taken' : 'Pending',
      stock: m.stock
    }));

    const response = await fetch('/api/health-assistant/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        medications: medicationsPayload
      })
    });

    setAiTypingState(false);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.reply || 'I am sorry, I was unable to generate a response at this time.';

    const aiMsg = {
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatMessages.push(aiMsg);
    renderChatHistoryUI();
    saveChatHistory();

    // Auto-read aloud if voice reminders setting is enabled
    if (window.appSettings && window.appSettings.voiceReminders) {
      speakAIResponse(replyText);
    }

  } catch (err) {
    console.error('Error sending chat message:', err);
    setAiTypingState(false);

    const errorMsg = {
      sender: 'ai',
      text: '⚠️ I encountered an error connecting to the health assistant backend. Please try again.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages.push(errorMsg);
    renderChatHistoryUI();
  }
}

/**
 * Handles Enter key in chat input box.
 */
function handleChatKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChatMessage();
  }
}

/**
 * Triggers a preset prompt chip.
 */
function sendPresetPrompt(text) {
  const inputEl = document.getElementById('chatInput');
  if (inputEl) {
    inputEl.value = text;
    sendChatMessage();
  }
}

/**
 * Reads the latest AI response aloud using SpeechSynthesis.
 */
function speakLastResponse() {
  if (lastAiResponseText) {
    speakAIResponse(lastAiResponseText);
  } else {
    showToast('No AI response available to read.', 'warning');
  }
}

/**
 * Clears chat history.
 */
function clearChatHistory() {
  chatMessages = [];
  localStorage.removeItem('medimate_chat_history');
  renderChatHistoryUI();
  showToast('Chat history cleared.', 'info');
}

/**
 * Saves chat history to localStorage.
 */
function saveChatHistory() {
  localStorage.setItem('medimate_chat_history', JSON.stringify(chatMessages));
}

/**
 * Toggles AI typing indicator.
 */
function setAiTypingState(isTyping) {
  const indicator = document.getElementById('aiTypingIndicator');
  if (indicator) {
    if (isTyping) {
      indicator.classList.remove('hidden');
    } else {
      indicator.classList.add('hidden');
    }
  }
}

/**
 * Helper to render basic markdown formatting (*bold*, _italic_, newlines) safely.
 */
function formatMarkdownText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Global bindings
window.initChatHistory = initChatHistory;
window.sendChatMessage = sendChatMessage;
window.handleChatKey = handleChatKey;
window.sendPresetPrompt = sendPresetPrompt;
window.speakLastResponse = speakLastResponse;
window.clearChatHistory = clearChatHistory;
