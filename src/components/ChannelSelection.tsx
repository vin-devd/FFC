import React, { useState } from 'react';
import { Plus, LogIn } from 'lucide-react';

interface ChannelSelectionProps {
  onCreateChannel: (name: string) => void;
  onJoinChannel: (code: string) => void;
}

export default function ChannelSelection({ onCreateChannel, onJoinChannel }: ChannelSelectionProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [channelName, setChannelName] = useState('');
  const [channelCode, setChannelCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && channelName) {
      onCreateChannel(channelName);
    } else if (mode === 'join' && channelCode) {
      onJoinChannel(channelCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          {mode === 'select' ? 'Choose an Option' : 
           mode === 'create' ? 'Create Channel' : 'Join Channel'}
        </h2>

        {mode === 'select' ? (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMode('create')}
              className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Channel
            </button>
            <button
              onClick={() => setMode('join')}
              className="flex items-center justify-center gap-3 bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Join Channel
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'create' ? 'Channel Name' : 'Channel Code'}
              </label>
              <input
                type="text"
                value={mode === 'create' ? channelName : channelCode}
                onChange={(e) => 
                  mode === 'create' 
                    ? setChannelName(e.target.value)
                    : setChannelCode(e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                placeholder={mode === 'create' ? 'Enter channel name' : 'Enter channel code'}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {mode === 'create' ? 'Create' : 'Join'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}