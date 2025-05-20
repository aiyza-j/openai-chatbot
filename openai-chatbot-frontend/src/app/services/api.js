const API_URL = "http://localhost:8000";

/**
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} onChunk - Callback function for each chunk of response
 * @returns {Promise} - Promise that resolves when the stream completes
 */
export const sendChatMessage = async (messages, onChunk) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    //creates a reader from the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();


    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      //completew messages
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            onChunk(data.content);
          } catch (e) {
            console.error('Error parsing SSE message:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

//alt with web sockets
export const connectChatWebSocket = (onMessage, onClose) => {
  const ws = new WebSocket(`ws://${API_URL.replace('http://', '')}/ws/chat`);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Error parsing WebSocket message:', e);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    if (onClose) onClose();
  };

  return {
    send: (messages) => {
      ws.send(JSON.stringify({ messages }));
    },
    close: () => ws.close(),
  };
};