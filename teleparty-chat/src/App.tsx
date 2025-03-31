import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import ChatRoom from './pages/ChatRoom';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <Router>
          <Routes>
          <Route path="/teleparty-chat" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/chat" element={<ChatRoom />} />
          </Routes>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
