export interface User {
  nickname: string;
  userIcon?: string;
}
  
export interface ChatMessage {
  isSystemMessage: boolean;
  userIcon?: string;
  userNickname?: string;
  body: string;
  permId: string;
  timestamp: number;
}

export interface UserTyping {
  anyoneTyping: boolean;
  usersTyping: string[];
}