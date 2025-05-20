'use client'
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Container, Link } from '@mui/material';
import Chat from './components/Chat';

const theme = createTheme({
  palette: {
    primary: {
      light: '#E0E8FF',
      main: '#2563EB',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Head>
          <title>OpenAI Streaming Chatbot</title>
          <meta name="description" content="Chat with AI using streaming responses" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 4, md: 6 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'block', sm: 'inline-block' }
                  }}
                >
                  OpenAI Streaming Chat
                </Typography>
              </motion.div>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ maxWidth: '600px', mx: 'auto' }}
              >
                Experience real-time AI-powered conversations with streaming responses
              </Typography>
            </Box>
          </motion.div>

          <Chat />
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              Powered by{' '}
              <Link href="https://openai.com" color="primary.main" underline="hover">
                OpenAI
              </Link>
              ,{' '}
              <Link href="https://nextjs.org" color="primary.main" underline="hover">
                Next.js
              </Link>
              , and{' '}
              <Link href="https://fastapi.tiangolo.com" color="primary.main" underline="hover">
                FastAPI
              </Link>
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}