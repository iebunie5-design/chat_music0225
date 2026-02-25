import { useState, useRef } from 'react';
import { Search, PlayCircle, X, Mic, MicOff } from 'lucide-react';
import { searchYoutube, hasYoutubeKey } from '../lib/youtube';

export default function MusicPage() {
    const [musicInput, setMusicInput] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // YouTube 검색
    const handleSearch = async () => {
        const query = musicInput.trim();
        if (!query || isSearching) return;

        setIsSearching(true);
        setCurrentVideo(null);
        try {
            const items = await searchYoutube(query);
            setResults(items);
            if (items.length === 0) {
                alert('검색 결과가 없습니다. 다른 노래를 검색해 보세요.');
            }
        } catch {
            alert('검색 중 문제가 생겼습니다. 다시 시도해 주세요.');
        } finally {
            setIsSearching(false);
        }
    };

    // 노래 선택 → 재생
    const playVideo = (video) => {
        setCurrentVideo(video);
    };

    // 플레이어 닫기
    const closePlayer = () => {
        setCurrentVideo(null);
    };

    // 음성 입력
    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저에서는 음성 입력을 지원하지 않습니다.\nChrome 브라우저를 사용해 주세요.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((r) => r[0].transcript)
                .join('');
            setMusicInput(transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('마이크 사용이 차단되어 있습니다.\n\nChrome 주소창 왼쪽 자물쇠 아이콘 → 마이크 → 허용으로 변경해 주세요.');
            } else if (event.error === 'no-speech') {
                // 말을 안 한 경우 - 무시
            } else {
                alert('음성 인식 오류: ' + event.error);
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // API 키 미설정 안내
    if (!hasYoutubeKey()) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
                <h1 className="title">음악 감상</h1>
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
                    <p style={{ fontSize: 'var(--font-lg)', marginBottom: '16px' }}>
                        음악 검색 설정이 필요합니다
                    </p>
                    <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-dim)' }}>
                        프로젝트 폴더의 <strong>.env</strong> 파일에<br />
                        아래 내용을 추가해주세요:
                    </p>
                    <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginTop: '16px', textAlign: 'left' }}>
                        <code style={{ fontSize: '18px' }}>VITE_YOUTUBE_API_KEY=여기에_API키_입력</code>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
            <h1 className="title" style={{ marginBottom: 0 }}>음악 감상</h1>

            {/* 검색 영역 */}
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-dim)', margin: 0 }}>
                    듣고 싶은 노래를 말씀해 주세요
                </p>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* 마이크 버튼 */}
                    <button
                        onClick={toggleListening}
                        disabled={isSearching}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            padding: 0,
                            backgroundColor: isListening ? '#EF5350' : 'var(--secondary)',
                            color: 'white',
                            boxShadow: isListening
                                ? '0 0 0 6px rgba(239, 83, 80, 0.25)'
                                : '0 4px 12px rgba(66, 165, 245, 0.3)',
                            animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
                        }}
                    >
                        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>

                    <input
                        type="text"
                        value={musicInput}
                        onChange={(e) => setMusicInput(e.target.value)}
                        placeholder={isListening ? '듣고 있어요...' : '예) 나훈아 테스형'}
                        style={{
                            flex: 1,
                            fontSize: 'var(--font-lg)',
                            borderRadius: '99px',
                            padding: '0 24px',
                            borderColor: isListening ? '#EF5350' : undefined,
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSearch();
                        }}
                    />

                    {/* 검색 버튼 */}
                    <button
                        className="primary"
                        onClick={handleSearch}
                        disabled={isSearching}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            padding: 0,
                            opacity: isSearching ? 0.6 : 1,
                        }}
                    >
                        <Search size={28} />
                    </button>
                </div>
            </div>

            {/* YouTube 플레이어 (노래 선택 시 표시) */}
            {currentVideo && (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <p style={{ flex: 1, fontSize: 'var(--font-base)', fontWeight: 700 }}>
                            {currentVideo.title}
                        </p>
                        <button
                            onClick={closePlayer}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                padding: 0,
                                backgroundColor: 'var(--bg-color)',
                                boxShadow: 'none',
                                color: 'var(--text-dim)',
                                minHeight: '48px',
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* 검색 중 로딩 */}
            {isSearching && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: 'var(--font-lg)', color: 'var(--text-dim)' }} className="loading-dots">
                        노래를 찾고 있어요
                    </p>
                </div>
            )}

            {/* 검색 결과 목록 */}
            {!isSearching && results.length > 0 && (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}>
                    {results.map((video) => (
                        <button
                            key={video.id}
                            onClick={() => playVideo(video)}
                            style={{
                                backgroundColor: currentVideo?.id === video.id ? 'var(--primary-light)' : 'white',
                                color: currentVideo?.id === video.id ? 'white' : 'var(--text-main)',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                textAlign: 'left',
                                minHeight: '80px',
                            }}
                        >
                            {/* 썸네일 */}
                            <img
                                src={video.thumbnail}
                                alt=""
                                style={{
                                    width: '100px',
                                    height: '66px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {video.title}
                                </p>
                                <p style={{
                                    fontSize: '16px',
                                    color: currentVideo?.id === video.id ? 'rgba(255,255,255,0.8)' : 'var(--text-dim)',
                                    marginTop: '4px',
                                }}>
                                    {video.channel}
                                </p>
                            </div>
                            <PlayCircle
                                size={36}
                                style={{ flexShrink: 0, opacity: 0.6 }}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* 검색 전 안내 */}
            {!isSearching && results.length === 0 && !currentVideo && (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                        <PlayCircle size={80} style={{ opacity: 0.3 }} />
                        <p style={{ marginTop: '16px', fontSize: '24px' }}>
                            마이크 버튼을 누르고<br />
                            듣고 싶은 노래를 말해보세요!
                        </p>
                        <p style={{ marginTop: '12px', fontSize: '20px', opacity: 0.7 }}>
                            예) "나훈아 테스형"<br />
                            예) "신나는 트로트"<br />
                            예) "비틀즈 렛잇비"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
