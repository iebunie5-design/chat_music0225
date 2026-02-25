import { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Trash2, Mic, MicOff } from 'lucide-react';
import { initChat, sendMessage, hasApiKey } from '../lib/gemini';

const STORAGE_KEY = 'danjjak-chat-history';

// localStorage에서 대화 기록 불러오기
function loadHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

// localStorage에 대화 기록 저장
function saveHistory(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // 초기화: 대화 기록 불러오기 + Gemini 세션 시작
    useEffect(() => {
        const history = loadHistory();
        setMessages(history);

        if (hasApiKey()) {
            initChat(history);
            setApiReady(true);
        }
    }, []);

    // 새 메시지가 추가되면 자동으로 맨 아래로 스크롤
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 보내기
    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || isLoading) return;

        // 사용자 메시지 추가
        const userMsg = { role: 'user', text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
        const updated = [...messages, userMsg];
        setMessages(updated);
        saveHistory(updated);
        setInputText('');

        // AI 응답 요청
        setIsLoading(true);
        try {
            const reply = await sendMessage(text);
            if (reply) {
                const aiMsg = { role: 'model', text: reply, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
                const withReply = [...updated, aiMsg];
                setMessages(withReply);
                saveHistory(withReply);
            }
        } catch (err) {
            const errorMsg = { role: 'model', text: '죄송합니다, 잠시 문제가 생겼어요. 다시 말씀해 주시겠어요? 😊', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
            const withError = [...updated, errorMsg];
            setMessages(withError);
            saveHistory(withError);
        } finally {
            setIsLoading(false);
        }
    };

    // 음성 입력 (Web Speech API)
    const toggleListening = () => {
        // 이미 듣고 있으면 중지
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
                .map((result) => result[0].transcript)
                .join('');
            setInputText(transcript);
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

    // 대화 기록 전체 삭제
    const handleClear = () => {
        if (!window.confirm('대화 내용을 모두 지울까요?')) return;
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
        initChat([]);
    };

    // API 키 미설정 안내
    if (!hasApiKey()) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
                <h1 className="title">AI 말벗 친구</h1>
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
                    <p style={{ fontSize: 'var(--font-lg)', marginBottom: '16px' }}>
                        AI 연결 설정이 필요합니다
                    </p>
                    <p style={{ fontSize: 'var(--font-base)', color: 'var(--text-dim)' }}>
                        프로젝트 폴더에 <strong>.env</strong> 파일을 만들고<br />
                        아래 내용을 입력해주세요:
                    </p>
                    <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginTop: '16px', textAlign: 'left' }}>
                        <code style={{ fontSize: '18px' }}>VITE_GEMINI_API_KEY=여기에_API키_입력</code>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 상단 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1 className="title" style={{ marginBottom: 0 }}>AI 말벗 친구</h1>
                {messages.length > 0 && (
                    <button
                        onClick={handleClear}
                        style={{
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            color: 'var(--text-dim)',
                            minHeight: '50px',
                            width: '50px',
                            padding: 0,
                        }}
                    >
                        <Trash2 size={28} />
                    </button>
                )}
            </div>

            {/* 채팅 내역 영역 */}
            <div style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                {/* 첫 접속 시 환영 메시지 */}
                {messages.length === 0 && !isLoading && (
                    <div style={{
                        alignSelf: 'flex-start',
                        maxWidth: '85%',
                        backgroundColor: 'var(--bg-color)',
                        padding: '20px',
                        borderRadius: '24px',
                        borderTopLeftRadius: '4px',
                    }}>
                        <p style={{ fontSize: 'var(--font-lg)' }}>
                            안녕하세요! 저는 단짝친구예요. 😊<br />
                            오늘 하루는 어떠셨나요?<br />
                            편하게 말씀해 주세요!
                        </p>
                    </div>
                )}

                {/* 메시지 목록 */}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                        }}
                    >
                        <div style={{
                            backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-color)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                            padding: '18px 22px',
                            borderRadius: '24px',
                            borderTopRightRadius: msg.role === 'user' ? '4px' : '24px',
                            borderTopLeftRadius: msg.role === 'user' ? '24px' : '4px',
                        }}>
                            <p style={{ fontSize: 'var(--font-base)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {msg.text}
                            </p>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-dim)',
                            marginTop: '6px',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            paddingLeft: '8px',
                            paddingRight: '8px',
                        }}>
                            {msg.time}
                        </p>
                    </div>
                ))}

                {/* 로딩 표시 (AI 응답 대기 중) */}
                {isLoading && (
                    <div style={{
                        alignSelf: 'flex-start',
                        maxWidth: '85%',
                        backgroundColor: 'var(--bg-color)',
                        padding: '18px 22px',
                        borderRadius: '24px',
                        borderTopLeftRadius: '4px',
                    }}>
                        <p style={{ fontSize: 'var(--font-lg)' }} className="loading-dots">
                            생각하고 있어요
                        </p>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* 입력 영역 */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* 마이크 버튼 */}
                <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        padding: 0,
                        backgroundColor: isListening ? '#EF5350' : 'var(--secondary)',
                        color: 'white',
                        boxShadow: isListening
                            ? '0 0 0 8px rgba(239, 83, 80, 0.25)'
                            : '0 4px 12px rgba(66, 165, 245, 0.3)',
                        animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    }}
                >
                    {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? '듣고 있어요...' : '여기에 말씀해주세요...'}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        fontSize: 'var(--font-lg)',
                        borderRadius: '99px',
                        padding: '0 28px',
                        opacity: isLoading ? 0.6 : 1,
                        borderColor: isListening ? '#EF5350' : undefined,
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend();
                    }}
                />

                {/* 전송 버튼 */}
                <button
                    className="primary"
                    onClick={handleSend}
                    disabled={isLoading}
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        padding: 0,
                        opacity: isLoading ? 0.6 : 1,
                    }}
                >
                    <SendHorizonal size={32} />
                </button>
            </div>
        </div>
    );
}
