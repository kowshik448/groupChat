import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChat } from "../context/ChatContext";
import { ChatMessage } from "../types";

const ChatBox: React.FC = () => {
  const { messages, user, roomId, sendMessage, isTyping, setTypingStatus } =
    useChat();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [initialLoad, setInitialLoad] = useState(true);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: initialLoad ? "auto" : "smooth",
      });
      if (initialLoad) setInitialLoad(false);
    }
  }, [messages, initialLoad]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setTypingStatus(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTypingStatus(true);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setTypingStatus(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: ChatMessage[] } = {};

    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dateString = date.toLocaleDateString();

      if (!groups[dateString]) {
        groups[dateString] = [];
      }

      groups[dateString].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">Chat Room: {roomId}</Typography>
        <Typography variant="subtitle2">
          Logged in as {user?.nickname}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <Box key={date}>
            <Divider sx={{ my: 2 }}>
              <Typography
                variant="caption"
                sx={{ px: 2, color: "text.secondary" }}
              >
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </Typography>
            </Divider>

            {msgs.map((msg, index) => (
              <Box
                key={`${date}-${index}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isSystemMessage
                    ? "center"
                    : msg.permId === user?.nickname
                    ? "flex-end"
                    : "flex-start",
                  mb: 2,
                }}
              >
                {msg.isSystemMessage ? (
                  // System message
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1,
                      backgroundColor: "rgba(0,0,0,0.04)",
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color: "text.secondary",
                        textAlign: "center",
                      }}
                    >
                      {msg.body}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", textAlign: "center", mt: 0.5 }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Paper>
                ) : (
                  // Regular user message
                  <Box
                    sx={{
                      display: "flex",
                      maxWidth: "70%",
                      flexDirection:
                        msg.permId === user?.nickname ? "row-reverse" : "row",
                    }}
                  >
                    <Avatar
                      src={msg?.userIcon}
                      sx={{
                        mr: msg.permId === user?.nickname ? 0 : 1,
                        ml: msg.permId === user?.nickname ? 1 : 0,
                        width: 40,
                        height: 40,
                      }}
                      imgProps={{
                        onError: (e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        },
                      }}
                    >
                      {(msg.userNickname || "U").charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          textAlign:
                            msg.permId === user?.nickname ? "right" : "left",
                          fontWeight: "bold",
                        }}
                      >
                        {msg.userNickname}
                      </Typography>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1,
                          bgcolor:
                            msg.permId === user?.nickname
                              ? "primary.light"
                              : "background.paper",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1">{msg.body}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                        >
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}

        <div ref={messagesEndRef} />

        {/* Typing indicator */}
        {isTyping.anyoneTyping && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Someone is typing...
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Type your message..."
          value={message}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
