import React, { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { useChat } from '../context/ChatContext';

const ChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomId, user, connected, messages } = useChat();
  const [reconnecting, setReconnecting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    // If not in a room or not logged in, redirect to home
    if (!roomId || !user) {
      navigate('/');
    }
  }, [roomId, user, navigate]);

  useEffect(() => {
    if (messages.length > 0) {
      setLoadingHistory(false);
    }
  }, [messages]);

  const handleRefresh = () => {
    setReconnecting(true);
    window.location.reload();
  };

  if (!connected) {
    return (
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <Alert 
            severity="error" 
            sx={{ width: '100%', mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={reconnecting}
              >
                {reconnecting ? 'Reconnecting...' : 'Reconnect'}
              </Button>
            }
          >
            Connection lost. The server might be down or your internet connection might be unstable.
          </Alert>
          
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {reconnecting ? 'Reconnecting...' : 'Connection lost'}
          </Typography>
          
          {!reconnecting && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Reconnect
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  if (!roomId || !user) {
    return (
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <Typography variant="h6" gutterBottom>
            You're not in a chat room
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 16px)', m: 1 }}>
      {loadingHistory && messages.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading chat history...
          </Typography>
        </Box>
      ) : (
        <Box>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: 2 }}>
            Back to Home
            </Button>
            <ChatBox />
        </Box>
      )}
    </Box>
  );
};

export default ChatRoom;
