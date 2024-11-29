export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image';
  userId: string;
  username: string;
  avatar: string;
  timestamp: number;
  edited?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  code: string;
  participants: User[];
  messages: Message[];
  createdAt: number;
} 