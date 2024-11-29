import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useChannelStore } from '../stores/channelStore';

export default function ChannelPage() {
  const navigate = useNavigate();
  const user = useUserStore(state => state.user);
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel);
  
  const [channelName, setChannelName] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');

  const createChannel = async () => {
    if (!channelName.trim() || !user) return;
    setLoading(true);
    setError('');

    try {
      console.log('Creating channel with:', { name: channelName, creator: user });

      const response = await fetch('http://localhost:3001/api/channels/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: channelName, creator: user })
      });
      
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        setCurrentChannel(data.channel);
        navigate(`/chat/${data.channel.id}`);
      } else {
        setError(data.message || 'فشل إنشاء القناة');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setError('تعذر الاتصال بالخادم. تأكد من تشغيل الخادم على المنفذ 3001');
    } finally {
      setLoading(false);
    }
  };

  const joinChannel = async () => {
    if (!channelCode.trim() || !user) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/channels/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: channelCode.toUpperCase(), user })
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentChannel(data.channel);
        navigate(`/chat/${data.channel.id}`);
      } else {
        setError(data.message || 'فشل الانضمام للقناة');
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          اختر خياراً
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setMode('create')}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            إنشاء قناة
          </button>
          <button
            onClick={() => setMode('join')}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            الانضمام لقناة
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {mode === 'select' ? (
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => setMode('create')}>إنشاء قناة</button>
            <button onClick={() => setMode('join')}>الانضمام لقناة</button>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (mode === 'create') {
              createChannel();
            } else {
              joinChannel();
            }
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'create' ? 'اسم القناة' : 'كود القناة'}
              </label>
              <input
                type="text"
                value={mode === 'create' ? channelName : channelCode}
                onChange={(e) => 
                  mode === 'create' 
                    ? setChannelName(e.target.value)
                    : setChannelCode(e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder={mode === 'create' ? 'أدخل اسم القناة' : 'أدخل كود القناة'}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold 
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} 
                  transition-colors`}
              >
                {loading ? 'جاري التحميل...' : (mode === 'create' ? 'إنشاء' : 'انضمام')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}