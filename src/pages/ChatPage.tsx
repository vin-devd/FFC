import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, Users } from 'lucide-react';
import { useChannelStore } from '../stores/channelStore';
import { useUserStore } from '../stores/userStore';
import { socketService } from '../services/socketService';

export default function ChatPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  
  const channel = useChannelStore(state => state.selectedChannel);
  const user = useUserStore(state => state.user);
  const addMessage = useChannelStore(state => state.addMessage);
  const channels = useChannelStore(state => state.channels);

  useEffect(() => {
    if (!channel && channelId) {
      const savedChannel = channels.find(ch => ch.id === channelId);
      if (savedChannel) {
        useChannelStore.getState().setCurrentChannel(savedChannel);
      } else {
        navigate('/channels');
      }
    }
  }, [channel, channelId, channels, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel?.messages]);

  useEffect(() => {
    if (channel && user) {
      socketService.connect(channel.id);

      const messageCleanup = socketService.onNewMessage((newMessage) => {
        if (!channel.messages.some(m => m.id === newMessage.id)) {
          addMessage({ ...newMessage, edited: false });
        }
      });

      const participantCleanup = socketService.onNewParticipant((newParticipant) => {
        if (!channel.participants.some(p => p.id === newParticipant.id)) {
          useChannelStore.getState().addParticipant(newParticipant);
        }
      });

      return () => {
        messageCleanup();
        participantCleanup();
        socketService.disconnect();
      };
    }
  }, [addMessage, channel, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !channel) return;

    const newMessage = {
      id: crypto.randomUUID(),
      content: message.trim(),
      type: 'text' as const,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      timestamp: Date.now(),
      edited: false
    };

    socketService.sendMessage(newMessage);
    setMessage('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !channel) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newMessage = {
          id: crypto.randomUUID(),
          content: event.target.result as string,
          type: 'image' as const,
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          timestamp: Date.now(),
          edited: false
        };

        addMessage(newMessage);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!channel) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">{channel.name}</h2>
          <span className="text-sm text-gray-400">Code: {channel.code}</span>
        </div>
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <Users className="w-5 h-5" />
          <span>{channel.participants.length} متصل</span>
        </button>
      </div>

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="absolute top-16 right-4 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 w-64">
          <h3 className="text-white font-semibold mb-3">المشاركون</h3>
          <div className="space-y-2">
            {channel.participants.map(participant => (
              <div key={participant.id} className="flex items-center gap-2">
                <img 
                  src={participant.avatar} 
                  alt={participant.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white">{participant.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {channel.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${
              msg.userId === user?.id ? 'bg-blue-600' : 'bg-gray-700'
            } rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <img 
                  src={msg.avatar} 
                  alt={msg.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-300">{msg.username}</span>
              </div>
              {msg.type === 'image' ? (
                <img
                  src={msg.content}
                  alt="Shared image"
                  className="rounded-lg max-w-full"
                />
              ) : (
                <p className="text-white">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <ImageIcon className="w-6 h-6 text-gray-400 hover:text-blue-400" />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}