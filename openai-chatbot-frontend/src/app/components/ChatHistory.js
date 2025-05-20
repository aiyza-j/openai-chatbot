'use client'
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import ChatMessage from './ChatMessage';

const ChatHistory = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // auto scroll when change in chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: 'background.default',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(0,0,0,0.2)',
          }
        }
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} index={index} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>
    </Box>
  );
};

export default ChatHistory;