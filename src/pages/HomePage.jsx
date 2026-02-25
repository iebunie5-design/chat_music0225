import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart, Music4 } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            gap: '32px'
        }}>

            {/* 어르신을 환영하는 아주 큰 문구 */}
            <h1 className="title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                반갑습니다!<br />
                오늘은 무엇을<br />
                하고 싶으신가요?
            </h1>

            {/* 대화하기 큼직한 버튼 */}
            <button
                className="primary"
                onClick={() => navigate('/chat')}
                style={{
                    minHeight: '140px', // 화면을 꽉 채우는 거대한 버튼 
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <MessageCircleHeart size={48} />
                <span style={{ fontSize: '32px' }}>AI 친구와 대화하기</span>
            </button>

            {/* 음악듣기 큼직한 버튼 */}
            <button
                className="secondary"
                onClick={() => navigate('/music')}
                style={{
                    minHeight: '140px',
                    flexDirection: 'column',
                    gap: '16px'
                }}
            >
                <Music4 size={48} />
                <span style={{ fontSize: '32px' }}>나만의 음악 듣기</span>
            </button>

        </div>
    );
}
