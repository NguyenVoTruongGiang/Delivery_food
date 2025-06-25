<script>
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";

  // State variables
  let isOpen = false;
  let messages = [];
  let inputMessage = "";
  let errorMessage = "";
  let chatboxElement;
  let userId = Number(localStorage.getItem("user_id"));
  let user = JSON.parse(localStorage.getItem("user"));
  let receiverId = 2; // Admin user_id
  let token = localStorage.getItem("token");
  let isLoading = false;
  let hoveredMessageId = null;

  // API configuration
  const API_BASE = "http://localhost:8080/api/chat";
  const SEND_API = `${API_BASE}/send`;
  const HISTORY_API = `${API_BASE}/history?senderId=${userId}&receiverId=${receiverId}`;

  // Send message via API
  async function sendMessage() {
    if (!inputMessage.trim() || !token) {
      errorMessage = token ? "Vui lòng nhập tin nhắn." : "Vui lòng đăng nhập.";
      return;
    }

    const userMessage = {
      senderId: userId,
      receiverId: receiverId,
      content: inputMessage.trim(),
    };

    try {
      isLoading = true;

      // Send user message
      const userResponse = await fetch(SEND_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMessage),
      });

      if (!userResponse.ok) {
        const text = await userResponse.text();
        console.error("Server response (user message):", text);
        throw new Error(`HTTP error: ${userResponse.status}`);
      }

      const newUserMessage = await userResponse.json();
      messages = [
        ...messages,
        {
          id: newUserMessage.id,
          content: newUserMessage.content,
          sender: newUserMessage.sender,
          receiver: newUserMessage.receiver,
          timestamp: newUserMessage.timestamp,
        },
      ];

      // Fetch updated chat history to include auto-response
      await fetchChatHistory();

      inputMessage = "";
      scrollToBottom();
    } catch (error) {
      errorMessage = "Không thể gửi tin nhắn. Vui lòng thử lại.";
      console.error("Send message error:", error);
    } finally {
      isLoading = false;
    }
  }

  // Fetch chat history
  async function fetchChatHistory() {
    if (!token) {
      errorMessage = "Vui lòng đăng nhập để trò chuyện.";
      return;
    }
    try {
      isLoading = true;
      const response = await fetch(HISTORY_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP error: ${response.status}`);
      }
      const history = await response.json();
      messages = history.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender, 
        receiver: msg.receiver, 
        timestamp: msg.timestamp,
      }));
      scrollToBottom();
    } catch (error) {
      errorMessage = "Không thể tải lịch sử chat. Vui lòng thử lại.";
      console.error("Fetch history error:", error);
    } finally {
      isLoading = false;
    }
  }

  // Other functions
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      fetchChatHistory();
    } else {
      messages = [];
      errorMessage = "";
      hoveredMessageId = null;
    }
  }

  function deleteMessage(messageId) {
    messages = messages.filter((msg) => msg.id !== messageId);
    if (hoveredMessageId === messageId) hoveredMessageId = null;
  }

  function deleteAllMessages() {
    messages = [];
    hoveredMessageId = null;
  }

  function scrollToBottom() {
    if (chatboxElement) {
      chatboxElement.scrollTop = chatboxElement.scrollHeight;
    }
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleKeypress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
      userId = user.id || 1;
    }
  });

  onDestroy(() => {
    messages = [];
    hoveredMessageId = null;
  });
</script>

<div class="chatbox-container">
  <button class="chat-icon" on:click={toggleChat} title="Mở khung chat">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </button>
  {#if isOpen}
    <div class="chat-popup" transition:fly={{ y: 50, duration: 300 }}>
      <div class="chat-header">
        <h4>Trò chuyện với hỗ trợ</h4>
        <div class="header-buttons">
          <button class="delete-all-btn" on:click={deleteAllMessages} title="Xóa tất cả tin nhắn">Xóa tất cả</button>
          <button class="close-btn" on:click={toggleChat} title="Đóng khung chat">✖</button>
        </div>
      </div>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
      {#if isLoading}
        <div class="loading">Đang tải...</div>
      {/if}
      <div class="chat-messages" bind:this={chatboxElement}>
        {#each messages as message (message.id)}
          <div
            class="message {message.sender?.id === 2 ? 'admin-message' : 'user-message'}"
            on:mouseenter={() => (hoveredMessageId = message.id)}
            on:mouseleave={() => (hoveredMessageId = null)}
          >
            <p>{message.content}</p>
            <span class="timestamp">{formatTimestamp(message.timestamp)}</span>
            {#if hoveredMessageId === message.id}
              <button class="delete-msg-btn" on:click={() => deleteMessage(message.id)}>X</button>
            {/if}
          </div>
        {/each}
      </div>
      <div class="chat-input">
        <input
          type="text"
          bind:value={inputMessage}
          placeholder="Nhập tin nhắn..."
          on:keydown={handleKeypress}
          disabled={isLoading}
        />
        <button on:click={sendMessage} disabled={isLoading || !inputMessage.trim()}>Gửi</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .chatbox-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .chat-icon {
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .chat-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .chat-popup {
    background: #ffffff;
    border-radius: 16px;
    width: 400px;
    height: 500px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(90deg, #f5f5f5, #e8ecef);
    border-bottom: 1px solid #e0e0e0;
  }

  .chat-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
  }

  .header-buttons {
    display: flex;
    gap: 8px;
  }

  .close-btn,
  .delete-all-btn {
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: #718096;
    transition: color 0.2s ease;
  }

  .delete-all-btn {
    background-color: #ff4d4f;
    color: white;
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 12px;
  }

  .close-btn:hover,
  .delete-all-btn:hover {
    color: #e53e3e;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f7fafc;
    scroll-behavior: smooth;
  }

  .message {
    margin: 8px 0;
    padding: 10px 14px;
    border-radius: 12px;
    max-width: 75%;
    position: relative;
    animation: fadeIn 0.3s ease;
  }

  .user-message {
    background: #bee3f8;
    margin-left: auto;
    text-align: right;
    border-top-right-radius: 4px;
  }

  .admin-message {
    background: #e2e8f0;
    margin-right: auto;
    text-align: left;
    border-top-left-radius: 4px;
  }

  .message p {
    margin: 0;
    font-size: 14px;
    color: #2d3748;
    word-break: break-word;
  }

  .timestamp {
    font-size: 10px;
    color: #a0aec0;
    margin-top: 4px;
    display: block;
  }

  .delete-msg-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .message:hover .delete-msg-btn {
    opacity: 1;
  }

  .user-message .delete-msg-btn {
    right: auto;
    left: 8px;
  }

  .chat-input {
    display: flex;
    padding: 12px;
    border-top: 1px solid #e0e0e0;
    background: #ffffff;
  }

  .chat-input input {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .chat-input input:focus {
    border-color: #ff4d4f;
  }

  .chat-input button {
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    margin-left: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;
  }

  .chat-input button:hover {
    background: #e53e3e;
  }

  .chat-input button:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }

  .error-message {
    padding: 8px 16px;
    background: #fed7d7;
    color: #e53e3e;
    font-size: 12px;
    text-align: center;
  }

  .loading {
    text-align: center;
    padding: 8px;
    color: #718096;
    font-size: 12px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    .chat-icon {
      width: 50px;
      height: 50px;
    }

    .chat-popup {
      width: 320px;
      height: 450px;
    }

    .chat-header h4 {
      font-size: 14px;
    }

    .message p {
      font-size: 13px;
    }

    .chat-input input,
    .chat-input button {
      font-size: 13px;
      padding: 6px 12px;
    }
  }
</style>