
'use client'
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        bgcolor: '#f8fafc',
      }}
    >
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={disabled ? "Connection lost. Reconnecting..." : "Type your message..."}
        disabled={isLoading || disabled}
        variant="outlined"
        size="medium"
        sx={{
          mr: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'white',
          },
        }}
        InputProps={{
          endAdornment: disabled && (
            <InputAdornment position="end">
              <WifiOffIcon color="error" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading || !message.trim() || disabled}
        sx={{
          minWidth: '56px',
          height: '56px',
          borderRadius: theme.shape.borderRadius,
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <SendIcon />
        )}
      </Button>
    </Box>
  );
};

export default ChatInput;