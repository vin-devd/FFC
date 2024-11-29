import React, { useState, useRef, useEffect } from 'react';
import { Send, Edit2, Trash2, AlertTriangle, ExternalLink, Image as ImageIcon, Check, X } from 'lucide-react';
import type { User, Message } from '../types';
import { useChannelStore } from '../stores/channelStore';

interface ChatProps {
  channelName: string;
  channelCode: string;
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'image' | 'link') => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export default function Chat({
  channelName,
  channelCode,
  currentUser,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showLinkWarning, setShowLinkWarning] = useState<{ url: string; isSecure: boolean } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const participants = useChannelStore(state => state.selectedChannel?.participants || []);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    content: string;
  } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', preventDefault);
    return () => document.removeEventListener('contextmenu', preventDefault);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const isLink = /^https?:\/\//.test(newMessage);
    if (isLink) {
      const isSecure = newMessage.startsWith('https://');
      if (!isSecure) {
        setShowLinkWarning({ url: newMessage, isSecure });
        return;
      }
    }

    onSendMessage(newMessage, isLink ? 'link' : 'text');
    setNewMessage('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSendMessage(event.target.result as string, 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = (messageId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      onDeleteMessage(messageId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (message.userId === currentUser.id) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        messageId: message.id,
        content: message.content
      });
    }
  };

  const handleTouchStart = (message: Message) => {
    if (message.userId === currentUser.id) {
      const timer = setTimeout(() => {
        setContextMenu({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          messageId: message.id,
          content: message.content
        });
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && !(e.target as HTMLElement).closest('.context-menu')) {
        setContextMenu(null);
      }
    };
    
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Channel Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-2 hover:bg-gray-700 px-3 py-1 rounded-lg"
          >
            <h2 className="text-xl font-semibold text-white">{channelName}</h2>
            <span className="text-sm text-gray-400">
              ({participants.length} متصل)
            </span>
          </button>
          <span className="text-sm text-gray-400">Code: {channelCode}</span>
        </div>
        
        {/* Participants Modal */}
        {showParticipants && (
          <div className="absolute top-16 left-4 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">المشاركون</h3>
            <div className="space-y-2">
              {participants.map((participant: User) => (
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
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            onContextMenu={(e) => handleContextMenu(e, message)}
            onTouchStart={() => handleTouchStart(message)}
            onTouchEnd={handleTouchEnd}
            className={`flex ${
              message.userId === currentUser.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-[70%] ${
              message.userId === currentUser.id 
                ? 'bg-blue-600' 
                : 'bg-gray-700'
            } rounded-lg p-3`}>
              {editingMessage === message.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded px-2 py-1"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onEditMessage(message.id, editContent);
                        setEditingMessage(null);
                      }}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingMessage(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {message.type === 'image' ? (
                    <img
                      src={message.content}
                      alt="Shared image"
                      className="rounded-lg max-w-full"
                    />
                  ) : message.type === 'link' ? (
                    <a
                      href={message.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 flex items-center gap-1"
                    >
                      <ExternalLink size={16} />
                      {message.content}
                    </a>
                  ) : (
                    <p className="text-white">{message.content}</p>
                  )}
                  
                  {message.userId === currentUser.id && (
                    <div className="flex gap-2 mt-2 text-gray-400">
                      <button
                        onClick={() => {
                          setEditingMessage(message.id);
                          setEditContent(message.content);
                        }}
                        className="hover:text-blue-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(message.id)}
                        className="hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  {message.edited && (
                    <span className="text-xs text-gray-400 mt-1">(معدل)</span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Link Warning Modal */}
      {showLinkWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 text-yellow-400 mb-4">
              <AlertTriangle />
              <h3 className="text-xl font-semibold">تحذير أمني</h3>
            </div>
            <p className="text-white mb-4">
              هذا الرابط غي مؤمن (HTTP). هل تريد المتابعة؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSendMessage(showLinkWarning.url, 'link');
                  setShowLinkWarning(null);
                  setNewMessage('');
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                متابعة
              </button>
              <button
                onClick={() => setShowLinkWarning(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/50 
          overflow-hidden context-menu animate-fadeIn"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                setEditingMessage(contextMenu.messageId);
                setEditContent(contextMenu.content);
                setContextMenu(null);
              }}
              className="w-full px-6 py-2 text-sm text-white hover:bg-blue-600/50 text-right flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              تعديل الرسالة
            </button>
            <button
              onClick={() => {
                confirmDelete(contextMenu.messageId);
                setContextMenu(null);
              }}
              className="w-full px-6 py-2 text-sm text-red-400 hover:bg-red-600/50 text-right flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              حذف الرسالة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}