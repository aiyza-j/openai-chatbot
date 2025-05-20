'use client'
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Box, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const messageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', gap: 0.5, mt: 1, ml: 1 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -5, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut"
        }}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#9CA3AF'
        }}
      />
    ))}
  </Box>
);

const ChatMessage = ({ message, index }) => {
  const { role, content } = message;
  const isUser = role === 'user';

  return (
    <motion.div
      key={index}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3,
          width: '100%',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'grey.300',
            color: isUser ? 'white' : 'text.primary',
            width: 36,
            height: 36,
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
        </Avatar>

        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{ maxWidth: '75%' }}
        >
          <Box
            sx={{
              p: 5,
              borderRadius: 2,
              backgroundColor: isUser ? 'primary.light' : 'background.paper',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 10,
                height: 10,
                backgroundColor: isUser ? 'primary.light' : 'background.paper',
                transform: 'rotate(45deg)',
                top: 16,
                left: isUser ? 'auto' : -5,
                right: isUser ? -5 : 'auto',
                boxShadow: isUser ?
                  '-1px 1px 1px rgba(0, 0, 0, 0.05)' :
                  '1px -1px 1px rgba(0, 0, 0, 0.05)',
                zIndex: 0
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600}}>
              {isUser ? 'You' : 'Assistant'}
            </Typography>

            {content ? (
              <Box sx={{
                '& p': {
                  m: 0,
                  mb: 1.5,
                  wordBreak: 'break-word',
                  lineHeight: 1.6,
                },
                '& p:last-child': {
                  mb: 0
                },
                '& code': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: '2px 4px',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                },
                '& pre': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  padding: 1.5,
                  borderRadius: 1,
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                }
              }}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </Box>
            ) : (
              <TypingIndicator />
            )}
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default ChatMessage;