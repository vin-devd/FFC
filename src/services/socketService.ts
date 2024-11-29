import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: Set<(message: Message) => void> = new Set();
  private participantHandlers: Set<(participant: User) => void> = new Set();

  connect(channelId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:3001', {
      query: { channelId }
    });

    this.socket.on('message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('participantJoined', (participant: User) => {
      this.participantHandlers.forEach(handler => handler(participant));
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      if (this.socket) {
        this.socket.emit('getInitialData', { channelId });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  sendMessage(message: Message) {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', message);
    }
  }

  onNewMessage(handler: (message: Message) => void) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onNewParticipant(handler: (participant: User) => void) {
    this.participantHandlers.add(handler);
    return () => this.participantHandlers.delete(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageHandlers.clear();
    this.participantHandlers.clear();
  }
}

export const socketService = new SocketService(); 