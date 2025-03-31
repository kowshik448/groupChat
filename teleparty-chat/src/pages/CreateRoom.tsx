import React, { useState } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserInfoForm from '../components/UserInfoForm';
import { useChat } from '../context/ChatContext';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom, connected } = useChat();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (user: { nickname: string, userIcon?: string }) => {
    if (!connected) {
      setError('Connection not ready. Please wait or reload the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createRoom(user.nickname, user.userIcon);
      navigate('/chat');
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Back to Home
        </Button>
        
        {!connected ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Connecting to server...
            </Typography>
          </Box>
        ) : (
          <>
            {loading ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Creating room...
                </Typography>
              </Box>
            ) : (
              <UserInfoForm
                onSubmit={handleCreate}
                title="Create a New Chat Room"
                buttonText="Create Room"
              />
            )}
            
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};
export default CreateRoom;
