import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { TelepartyClient, SocketEventHandler, SocketMessageTypes, SessionChatMessage, MessageList } from 'teleparty-websocket-lib';
import { ChatMessage, User, UserTyping } from '../types';

interface ChatContextProps {
  client: TelepartyClient | null;
  roomId: string | null;
  messages: ChatMessage[];
  user: User | null;
  connected: boolean;
  isTyping: UserTyping;
  setRoomId: (id: string) => void;
  setUser: (user: User) => void;
  sendMessage: (message: string) => void;
  createRoom: (nickname: string, userIcon?: string) => Promise<string>;
  joinRoom: (nickname: string, roomId: string, userIcon?: string) => Promise<void>;
  setTypingStatus: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const clientRef = useRef<TelepartyClient | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<UserTyping>({ anyoneTyping: false, usersTyping: [] });
  const [isClientInitialized, setIsClientInitialized] = useState<boolean>(false);

  // Enhanced system message formatting
  const formatSystemMessage = (message: string): string => {
    // Parse "X has joined the room" messages
    const joinRegex = /^(.*) has joined the room$/;
    const joinMatch = message.match(joinRegex);
    if (joinMatch) {
      const username = joinMatch[1];
      return `${username} has joined the chat room`;
    }
    
    // Parse "X has left the room" messages
    const leaveRegex = /^(.*) has left the room$/;
    const leaveMatch = message.match(leaveRegex);
    if (leaveMatch) {
      const username = leaveMatch[1];
      return `${username} has left the chat room`;
    }
    
    // Parse "Room X has been created" messages
    const roomRegex = /^Room (.*) has been created$/;
    const roomMatch = message.match(roomRegex);
    if (roomMatch) {
      const roomId = roomMatch[1];
      return `Chat room ${roomId} has been created`;
    }
    
    return message;
  };

  useEffect(() => {
    if (isClientInitialized) {
      return;
    }
    
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        setConnected(true);
      },
      onClose: () => {
        setConnected(false);
      },
      onMessage: (message) => {
        try {
          
          if (message.type === SocketMessageTypes.SEND_MESSAGE) {
            // Check if it's a message list (history) or a single message
            if (Array.isArray(message.data.messages)) {
              // It's a message list/history
              const messageList = message.data as MessageList;
              const formattedMessages = messageList.messages.map(msg => {
                if (msg.isSystemMessage) {
                  return {
                    ...msg,
                    body: formatSystemMessage(msg.body)
                  };
                }
                return msg;
              });
              
              setMessages(formattedMessages);
            } else {
              // It's a single message
              const chatMessage = message.data as SessionChatMessage;

              if (chatMessage.isSystemMessage) {
                chatMessage.body = formatSystemMessage(chatMessage.body);
              }
              
              setMessages(prev => [...prev, chatMessage]);
            }
          } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
            const typingData = message.data as UserTyping;
            setIsTyping(typingData);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    };

    // Create a new client only once
    const newClient = new TelepartyClient(eventHandler);
    clientRef.current = newClient;
    setIsClientInitialized(true);
  }, [isClientInitialized]);

  const createRoom = async (nickname: string, userIcon?: string): Promise<string> => {
    if (!clientRef.current) {
      throw new Error("Client not initialized");
    }
    
    if (!connected) {
      console.warn("Attempting to create room while disconnected");
    }
    
    // Clear previous messages when creating a new room
    setMessages([]);
    
    try {
      const roomId = await clientRef.current.createChatRoom(nickname, userIcon);
      setRoomId(roomId);
      setUser({ nickname, userIcon });
      return roomId;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  };

  const joinRoom = async (nickname: string, roomId: string, userIcon?: string): Promise<void> => {
    if (!clientRef.current) {
      throw new Error("Client not initialized");
    }
    
    if (!connected) {
      console.warn("Attempting to join room while disconnected");
    }
    
    try {
      await clientRef.current.joinChatRoom(nickname, roomId, userIcon);
      setRoomId(roomId);
      setUser({ nickname, userIcon });
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  };

  const sendMessage = (messageBody: string) => {
    if (!clientRef.current || !connected || !roomId) {
      console.error("Cannot send message: not connected to a room");
      return;
    }
    
    try {
      clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
        body: messageBody
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const setTypingStatus = (typing: boolean) => {
    if (!clientRef.current || !connected || !roomId) {
      return;
    }
    
    try {
      clientRef.current.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
        typing
      });
    } catch (error) {
      console.error("Error setting typing status:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        client: clientRef.current,
        roomId,
        messages,
        user,
        connected,
        isTyping,
        setRoomId,
        setUser,
        sendMessage,
        createRoom,
        joinRoom,
        setTypingStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
