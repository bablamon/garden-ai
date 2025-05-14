// Chat history
let messages = [
  { role: 'system', content: 'You are a helpful assistant specializing in herbal medicine and the Virtual Herbal Garden.' }
];

// Handle form submission
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  addMessage(userMessage, 'user');
  messages.push({ role: 'user', content: userMessage });
  input.value = '';

  try {
    // Call the Gemini API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: messages.filter(m => m.role !== 'system'), // Gemini doesn't use system messages
        systemInstruction: messages.find(m => m.role === 'system')?.content // Pass system message separately
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      addMessage('Error: ' + data.error, 'bot');
      return;
    }

    // Add bot response
    const botResponse = data.content || data.response; // Handle both possible response formats
    addMessage(botResponse, 'bot');
    messages.push({ role: 'assistant', content: botResponse });
    
  } catch (error) {
    console.error('API Error:', error);
    addMessage('Error: Failed to connect to the server. Please try again.', 'bot');
  }
});

// Add message to chat window
function addMessage(content, role) {
  const messagesDiv = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  // Avatar based on role
  const avatar = document.createElement('span');
  avatar.className = `avatar ${role}-avatar`;
  avatar.textContent = role === 'user' ? '🧑' : '🌿'; // You can put emoji or text icons here
  messageDiv.appendChild(avatar);

  // Message content
  const contentSpan = document.createElement('span');
  contentSpan.className = 'message-content';
  contentSpan.innerHTML = content.replace(/\n/g, '<br>'); // Keep line breaks
  messageDiv.appendChild(contentSpan);

  messagesDiv.appendChild(messageDiv);

  // Auto-scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Chat toggle function
function toggleChat() {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) {
    console.error('Chat window not found in toggleChat!');
    return;
  }
  chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}