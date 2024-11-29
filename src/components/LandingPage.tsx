import React from 'react';
import { Shield, Zap, Lock, Users, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-white mb-6">
              FFC <span className="text-blue-400">Floating Channel Chat</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              تواصل بأمان مطلق مع تشفير من النهاية إلى النهاية. منصة دردشة سريعة وقوية مصممة للخصوصية.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg inline-flex items-center gap-2 transition-all transform hover:scale-105"
            >
              ابدأ الآن
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">مميزات المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Lock className="w-8 h-8 text-blue-400" />}
            title="تشفير كامل"
            description="تشفير من النهاية إلى النهاية لجميع المحادثات"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-blue-400" />}
            title="سرعة فائقة"
            description="أداء عالي وسرعة استجابة فورية"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-blue-400" />}
            title="حماية قصوى"
            description="أمان متقدم لحماية بياناتك ومحادثاتك"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-400" />}
            title="قنوات متعددة"
            description="إنشاء وإدارة قنوات متعددة بسهولة"
          />
        </div>
      </div>

      {/* Discord-like Features */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
            
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
} 