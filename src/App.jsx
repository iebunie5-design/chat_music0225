import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircleHeart, Music4, AArrowUp, AArrowDown } from 'lucide-react';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MusicPage from './pages/MusicPage';
import './index.css';

const FONT_SCALE_KEY = 'danjjak-font-scale';
const SCALES = [1, 1.15, 1.3]; // 보통, 크게, 아주 크게
const SCALE_LABELS = ['보통', '크게', '아주크게'];

function applyFontScale(scale) {
  const root = document.documentElement;
  root.style.setProperty('--font-base', `${Math.round(22 * scale)}px`);
  root.style.setProperty('--font-lg', `${Math.round(28 * scale)}px`);
  root.style.setProperty('--font-xl', `${Math.round(36 * scale)}px`);
  root.style.setProperty('--font-xxl', `${Math.round(48 * scale)}px`);
}

// 가장 하단에 항상 고정되는 시니어용 큼직한 메뉴바 레이아웃
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scaleIndex, setScaleIndex] = useState(() => {
    const saved = localStorage.getItem(FONT_SCALE_KEY);
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    applyFontScale(SCALES[scaleIndex]);
    localStorage.setItem(FONT_SCALE_KEY, scaleIndex);
  }, [scaleIndex]);

  const cycleFontSize = () => {
    setScaleIndex((prev) => (prev + 1) % SCALES.length);
  };

  const navItems = [
    { path: '/', name: '첫 화면', icon: <Home size={36} /> },
    { path: '/chat', name: '말벗 채팅', icon: <MessageCircleHeart size={36} /> },
    { path: '/music', name: '음악 감상', icon: <Music4 size={36} /> },
  ];

  return (
    <div className="container">
      {/* 본문 영역 */}
      <main style={{ flex: 1, padding: '24px 24px 120px 24px', overflowY: 'auto' }}>
        {children}
      </main>

      {/* 글씨 크기 조절 버튼 */}
      <button
        onClick={cycleFontSize}
        style={{
          position: 'fixed',
          top: '12px',
          right: 'max(12px, calc((100vw - 600px) / 2 + 12px))',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          padding: 0,
          backgroundColor: 'white',
          color: 'var(--text-dim)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          zIndex: 100,
          fontSize: '14px',
          flexDirection: 'column',
          gap: '2px',
          minHeight: '52px',
        }}
        title="글씨 크기 조절"
      >
        <AArrowUp size={20} />
        <span style={{ fontSize: '11px', fontWeight: 600, lineHeight: 1 }}>{SCALE_LABELS[scaleIndex]}</span>
      </button>

      {/* 하단 고정 네비게이션 바 (터치하기 아주 쉽게) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '600px',
        height: '100px',
        backgroundColor: 'white',
        borderTop: '2px solid #EEEEEE',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)' // 아이폰 하단 홈바 안전영역
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: 0,
                minHeight: '100px',
              }}
            >
              {item.icon}
              <span style={{ fontSize: '20px', fontWeight: isActive ? 800 : 500 }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/music" element={<MusicPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
