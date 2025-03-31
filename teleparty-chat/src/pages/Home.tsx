import React from 'react';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Teleparty Chat
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Connect with friends in real-time chat rooms
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Create a Room
              </Typography>
              <Typography color="text.secondary" paragraph>
                Start a new chat room and invite your friends to join
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth 
                onClick={() => navigate('/create')}
              >
                Create Room
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Join a Room
              </Typography>
              <Typography color="text.secondary" paragraph>
                Enter a room ID to join an existing chat room
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large" 
                fullWidth
                onClick={() => navigate('/join')}
              >
                Join Room
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
