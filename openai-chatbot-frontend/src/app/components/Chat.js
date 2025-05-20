'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Paper,
  Typography,
  Container,
  useMediaQuery,
  Badge
} from '@mui/material';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    success: {
      main: '#10B981'
    },
    error: {
      main: '#EF4444'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.08)',
    '0px 8px 12px rgba(0, 0, 0, 0.12)',
  ],
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Connect to WebSocket on component mount
  useEffect(() => {
    // Create WebSocket connection
    const wsUrl = `ws://${API_URL.replace('http://', '')}/api/ws/chat`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.content) {

          setMessages(prev => {
            const updated = [...prev];
            const lastAssistantMessageIndex = updated
              .map((msg, index) => ({ role: msg.role, index }))
              .filter(msg => msg.role === 'assistant')
              .pop()?.index;

            if (lastAssistantMessageIndex !== undefined) {
              updated[lastAssistantMessageIndex] = {
                role: 'assistant',
                content: updated[lastAssistantMessageIndex].content + data.content
              };
            }
            return updated;
          });
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    // Store the WebSocket reference
    wsRef.current = socket;

    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [API_URL]);

  // Reconnection logic
  useEffect(() => {
    if (!isConnected) {
      const reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        // This will trigger the first useEffect again
        wsRef.current = null;
      }, 3000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [isConnected]);

  const handleSendMessage = (content) => {
    if (!isConnected) {
      alert('Cannot send message: WebSocket is disconnected');
      return;
    }

    // Add user message to chat
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    // Add empty assistant message (will be filled by WebSocket responses)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    setIsLoading(true);

    // Send message via WebSocket
    try {
      wsRef.current.send(
        JSON.stringify({
          messages: [...messages, userMessage]
        })
      );
    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
      // Update the assistant message with error info
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, there was an error sending your message.'
        };
        return updated;
      });
    } finally {
      // We'll set isLoading to false after a short delay
      // This gives time for the first message chunk to arrive
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              height: isMobile ? 'calc(100vh - 120px)' : 600,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            <motion.div
              transition={{ duration: 0.2 }}
              style={{
                padding: '16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="h5" component="h2" sx={{ mr: 1 }}>
                OpenAI Chat
              </Typography>
              <Badge
                color={isConnected ? "success" : "error"}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    height: 12,
                    width: 12,
                    borderRadius: '50%'
                  }
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: isConnected ? 'success.main' : 'error.main',
                    ml: 1,
                    fontSize: '0.7rem'
                  }}
                >
                  {isConnected ? 'CONNECTED' : 'RECONNECTING'}
                </Typography>
              </Badge>
            </motion.div>
            <ChatHistory messages={messages} />
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!isConnected}
            />
          </Paper>
        </Container>
      </motion.div>
    </ThemeProvider>
  );
};

export default Chat;