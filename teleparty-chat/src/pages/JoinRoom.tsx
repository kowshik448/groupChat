import React, { useState } from 'react';
import { Container, Box, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserInfoForm from '../components/UserInfoForm';
import { useChat } from '../context/ChatContext';

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const { joinRoom, connected } = useChat();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [step, setStep] = useState(1); // 1 for room ID entry, 2 for user info

  const handleRoomIdSubmit = () => {
    if (!roomId.trim()) {
      setError('Room ID is required');
      return;
    }
    setStep(2);
  };

  const handleJoin = async (user: { nickname: string, userIcon?: string }) => {
    if (!connected) {
      setError('Connection not ready. Please wait or reload the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinRoom(user.nickname, roomId, user.userIcon);
      navigate('/chat');
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room. Please check the Room ID and try again.');
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
                  Joining room...
                </Typography>
              </Box>
            ) : (
              <>
                {step === 1 ? (
                  <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Join a Chat Room
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      error={!!error}
                      helperText={error}
                      sx={{ mb: 2 }}
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleRoomIdSubmit}
                    >
                      Next
                    </Button>
                  </Box>
                ) : (
                  <UserInfoForm
                    onSubmit={handleJoin}
                    title={`Join Room: ${roomId}`}
                    buttonText="Join Room"
                  />
                )}
              </>
            )}
            
            {error && step === 2 && (
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
export default JoinRoom;
