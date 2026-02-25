import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircleHeart, Music4 } from 'lucide-react';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MusicPage from './pages/MusicPage';
import './index.css';

// 가장 하단에 항상 고정되는 시니어용 큼직한 메뉴바 레이아웃
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

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
