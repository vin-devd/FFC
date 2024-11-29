import { Shield, Zap, Lock, Users, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <div className="inline-block animate-float">
              <img src="/logo.png" alt="FFC Logo" className="w-24 h-24 mx-auto mb-6" />
            </div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
              FFC Chat
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              تواصل بأمان مطلق مع تشفير من النهاية إلى النهاية. منصة دردشة سريعة وقوية مصممة للخصوصية.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                text-white text-lg font-semibold px-8 py-4 rounded-lg inline-flex items-center gap-2 
                transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                ابدأ الآن
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://discord.gg/8YHsMGgmVx"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-lg font-semibold px-8 py-4 
                rounded-lg inline-flex items-center gap-2 transition-all transform hover:scale-105 
                shadow-lg hover:shadow-[#5865F2]/25"
              >
                <img src="/discord-icon.png" alt="Discord Icon" className="w-5 h-5" />
                انضم لمجتمعنا
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          مميزات المنصة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Lock className="w-8 h-8 text-blue-400" />}
            title="تشفير كامل"
            description="تشفير من النهاية إلى النهاية لجميع المحادثات"
            gradient="from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="سرعة فائقة"
            description="أداء عالي وسرعة استجابة فورية"
            gradient="from-yellow-500 to-yellow-600"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-green-400" />}
            title="حماية قصوى"
            description="أمان متقدم لحماية بياناتك ومحادثاتك"
            gradient="from-green-500 to-green-600"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="قنوات متعددة"
            description="إنشاء وإدارة قنوات متعددة بسهولة"
            gradient="from-purple-500 to-purple-600"
          />
        </div>
      </div>

      {/* Discord Section */}
      <div className="bg-[#5865F2]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src="/discord-icon.png" alt="Discord Icon" className="w-16 h-16 text-[#5865F2] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-white">انضم إلى مجتمعنا على Discord</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            كن جزءاً من مجتمعنا النشط، شارك أفكارك، واحصل على المساعدة الفورية
          </p>
          <a
            href="https://discord.gg/8YHsMGgmVx"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold px-8 py-4 rounded-lg 
            inline-flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <img src="/discord-icon.png" alt="Discord Icon" className="w-5 h-5" />
            انضم الآن
          </a>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 
    transition-all border border-gray-700/50 hover:border-gray-600/50 group`}>
      <div className={`mb-4 bg-gradient-to-br ${gradient} p-3 rounded-lg w-fit group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
} 