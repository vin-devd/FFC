const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://fcc-lemon.vercel.app']
    : 'http://localhost:5173'
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://fcc-lemon.vercel.app']
      : 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
});

const CHANNELS_FILE = path.join(__dirname, 'channels.json');

// قراءة القنوات من الملف
function readChannels() {
  try {
    const data = fs.readFileSync(CHANNELS_FILE, 'utf8');
    return JSON.parse(data).channels;
  } catch (error) {
    return {};
  }
}

// حفظ القنوات في الملف
function saveChannels(channelsData) {
  try {
    const filePath = CHANNELS_FILE;
    const data = JSON.stringify({ channels: channelsData }, null, 2);
    
    console.log('Saving channels to:', filePath);
    console.log('Channel data:', data);

    fs.writeFileSync(filePath, data, 'utf8');
    channels = channelsData;
    
    console.log('Channels saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving channels:', error);
    console.error('File path:', CHANNELS_FILE);
    console.error('Data being saved:', channelsData);
    return false;
  }
}

// تحميل القنوات عند بدء الخادم
let channels = readChannels();

// API endpoints
app.post('/api/channels/create', (req, res) => {
  try {
    console.log('Received create request:', req.body);

    const { name, creator } = req.body;
    if (!name || !creator) {
      console.log('Missing required fields:', { name, creator });
      return res.status(400).json({ 
        success: false, 
        message: 'بيانات غير مكتملة' 
      });
    }

    const channelId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newChannel = {
      id: channelId,
      name,
      code: channelId,
      creator,
      participants: [creator],
      messages: [],
      createdAt: Date.now()
    };

    console.log('Creating new channel:', newChannel);

    const updatedChannels = { ...channels, [channelId]: newChannel };
    saveChannels(updatedChannels);

    console.log('Channel created successfully:', newChannel);
    res.json({ success: true, channel: newChannel });
  } catch (error) {
    console.error('Error in channel creation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في إنشاء القناة',
      error: error.message 
    });
  }
});

app.post('/api/channels/join', (req, res) => {
  try {
    const { code, user } = req.body;
    const channel = Object.values(channels).find(ch => ch.code === code);

    if (!channel) {
      console.log('Channel not found:', code);
      return res.status(404).json({ 
        success: false, 
        message: 'لم يتم العثور على القناة. تأكد من صحة الكود.' 
      });
    }

    if (!channel.participants.find(p => p.id === user.id)) {
      channel.participants.push(user);
      const updatedChannels = { ...channels, [channel.id]: channel };
      saveChannels(updatedChannels);
      console.log('User joined channel:', { user: user.username, channelId: channel.id });
    }

    res.json({ success: true, channel });
  } catch (error) {
    console.error('Error joining channel:', error);
    res.status(500).json({ success: false, message: 'فشل الانضمام للقناة' });
  }
});

app.get('/api/channels', (req, res) => {
  try {
    const allChannels = readChannels();
    res.json({ 
      success: true, 
      channels: allChannels 
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في جلب القنوات',
      error: error.message 
    });
  }
});

// Socket.IO logic
const activeChannels = new Map();

io.on('connection', (socket) => {
  const { channelId } = socket.handshake.query;
  
  if (!channelId || !channels[channelId]) {
    socket.disconnect();
    return;
  }

  socket.join(channelId);
  
  if (!activeChannels.has(channelId)) {
    activeChannels.set(channelId, new Set());
  }
  
  socket.on('getInitialData', () => {
    const channel = channels[channelId];
    if (channel) {
      socket.emit('initialData', {
        messages: channel.messages,
        participants: channel.participants
      });
    }
  });

  socket.on('sendMessage', (message) => {
    if (!channels[channelId]) return;
    
    const channel = channels[channelId];
    channel.messages.push(message);
    saveChannels(channels);
    
    // إرسال الرسالة لجميع المتصلين في نفس القناة
    io.to(channelId).emit('message', message);
  });

  socket.on('disconnect', () => {
    const channelParticipants = activeChannels.get(channelId);
    if (channelParticipants) {
      channelParticipants.delete(socket.id);
      if (channelParticipants.size === 0) {
        activeChannels.delete(channelId);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 


