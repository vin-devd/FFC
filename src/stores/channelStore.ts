import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Channel, User, Message } from '../types';

interface ChannelState {
  selectedChannel: Channel | null;
  channels: Channel[];
  setCurrentChannel: (channel: Channel) => void;
  addMessage: (message: Message) => void;
  removeParticipant: (userId: string) => void;
  addParticipant: (participant: User) => void;
  clearChannel: () => void;
  addChannel: (channel: Channel) => void;
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set) => ({
      selectedChannel: null,
      channels: [],
      setCurrentChannel: (channel) => set((state) => {
        const existingChannelIndex = state.channels.findIndex(ch => ch.id === channel.id);
        const updatedChannels = [...state.channels];
        
        if (existingChannelIndex >= 0) {
          updatedChannels[existingChannelIndex] = channel;
        } else {
          updatedChannels.push(channel);
        }

        return {
          selectedChannel: channel,
          channels: updatedChannels
        };
      }),
      addMessage: (message) => set((state) => {
        if (!state.selectedChannel) return state;
        
        if (state.selectedChannel.messages.some(m => m.id === message.id)) {
          return state;
        }

        const updatedChannel = {
          ...state.selectedChannel,
          messages: [...state.selectedChannel.messages, message]
        };

        const updatedChannels = state.channels.map(ch =>
          ch.id === updatedChannel.id ? updatedChannel : ch
        );

        return {
          selectedChannel: updatedChannel,
          channels: updatedChannels
        };
      }),
      removeParticipant: (userId) => set((state) => {
        if (!state.selectedChannel) return state;

        const updatedChannel = {
          ...state.selectedChannel,
          participants: state.selectedChannel.participants.filter(p => p.id !== userId)
        };

        const updatedChannels = state.channels.map(ch =>
          ch.id === updatedChannel.id ? updatedChannel : ch
        );

        return {
          selectedChannel: updatedChannel,
          channels: updatedChannels
        };
      }),
      addParticipant: (participant) => set((state) => {
        if (!state.selectedChannel) return state;

        const updatedChannel = {
          ...state.selectedChannel,
          participants: [...state.selectedChannel.participants, participant]
        };

        const updatedChannels = state.channels.map(ch =>
          ch.id === updatedChannel.id ? updatedChannel : ch
        );

        return {
          selectedChannel: updatedChannel,
          channels: updatedChannels
        };
      }),
      clearChannel: () => set({ selectedChannel: null }),
      addChannel: (channel) => set((state) => ({
        channels: [...state.channels, channel]
      })),
    }),
    {
      name: 'channel-storage',
    }
  )
);