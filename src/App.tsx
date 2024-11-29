import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserSetupPage from './pages/UserSetupPage';
import ChannelPage from './pages/ChannelPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/setup');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
      <Route path="/setup" element={<UserSetupPage />} />
      <Route 
        path="/channels" 
        element={
          <ProtectedRoute>
            <ChannelPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat/:channelId" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;