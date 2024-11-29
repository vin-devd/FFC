export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Channel {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  messages: Message[];
  participants: User[];
}

export interface Message {
  avatar: string | undefined;
  username: string | undefined;
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'link';
  edited: boolean;
}