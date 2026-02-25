import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart, Music4, Phone, PhoneCall, X, Check, Trash2 } from 'lucide-react';

const CONTACT_KEY = 'danjjak-emergency-contact';

function loadContact() {
    try {
        const saved = localStorage.getItem(CONTACT_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export default function HomePage() {
    const navigate = useNavigate();
    const [contact, setContact] = useState(loadContact);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    const saveContact = () => {
        const name = editName.trim();
        const phone = editPhone.trim().replace(/[^0-9]/g, '');
        if (!name || !phone) {
            alert('이름과 전화번호를 모두 입력해주세요.');
            return;
        }
        const newContact = { name, phone };
        localStorage.setItem(CONTACT_KEY, JSON.stringify(newContact));
        setContact(newContact);
        setIsEditing(false);
    };

    const deleteContact = () => {
        if (!window.confirm('연락처를 삭제할까요?')) return;
        localStorage.removeItem(CONTACT_KEY);
        setContact(null);
    };

    const startEdit = () => {
        setEditName(contact?.name || '');
        setEditPhone(contact?.phone || '');
        setIsEditing(true);
    };

    const formatPhone = (phone) => {
        if (phone.length === 11) return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
        if (phone.length === 10) return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
        return phone;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            gap: '28px'
        }}>

            {/* 어르신을 환영하는 아주 큰 문구 */}
            <h1 className="title" style={{ textAlign: 'center', marginBottom: '24px' }}>
                반갑습니다!<br />
                오늘은 무엇을<br />
                하고 싶으신가요?
            </h1>

            {/* 대화하기 큼직한 버튼 */}
            <button
                className="primary"
                onClick={() => navigate('/chat')}
                style={{
                    minHeight: '120px',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <MessageCircleHeart size={44} />
                <span style={{ fontSize: '30px' }}>AI 친구와 대화하기</span>
            </button>

            {/* 음악듣기 큼직한 버튼 */}
            <button
                className="secondary"
                onClick={() => navigate('/music')}
                style={{
                    minHeight: '120px',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                <Music4 size={44} />
                <span style={{ fontSize: '30px' }}>나만의 음악 듣기</span>
            </button>

            {/* 긴급 연락처 영역 */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}>
                <p style={{ fontSize: '18px', color: 'var(--text-dim)', fontWeight: 600, textAlign: 'center' }}>
                    긴급 연락처
                </p>

                {/* 연락처 편집 모드 */}
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="이름 (예: 아들)"
                            style={{ fontSize: '20px', padding: '12px 16px' }}
                        />
                        <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="전화번호 (예: 01012345678)"
                            style={{ fontSize: '20px', padding: '12px 16px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="success"
                                onClick={saveContact}
                                style={{ flex: 1, minHeight: '56px', fontSize: '20px' }}
                            >
                                <Check size={24} /> 저장
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{
                                    width: '56px', minHeight: '56px', padding: 0,
                                    backgroundColor: 'var(--bg-color)', boxShadow: 'none', color: 'var(--text-dim)'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* 등록된 연락처 전화 버튼 */}
                        {contact ? (
                            <a
                                href={`tel:${contact.phone}`}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '12px', minHeight: '70px', borderRadius: 'var(--radius-lg)',
                                    backgroundColor: 'var(--success)', color: 'white',
                                    fontSize: '24px', fontWeight: 700, textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(102, 187, 106, 0.3)',
                                }}
                                onClick={(e) => {
                                    if (!window.confirm(`${contact.name}(${formatPhone(contact.phone)})에게 전화할까요?`)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <PhoneCall size={28} />
                                {contact.name}에게 전화
                            </a>
                        ) : (
                            <button
                                onClick={startEdit}
                                style={{
                                    flex: 1, minHeight: '70px',
                                    backgroundColor: 'var(--bg-color)', boxShadow: 'none',
                                    color: 'var(--text-dim)', fontSize: '20px',
                                }}
                            >
                                <Phone size={24} />
                                연락처 등록하기
                            </button>
                        )}

                        {/* 119 긴급전화 */}
                        <a
                            href="tel:119"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', width: '120px', minHeight: '70px',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: '#EF5350', color: 'white',
                                fontSize: '24px', fontWeight: 700, textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(239, 83, 80, 0.3)',
                            }}
                            onClick={(e) => {
                                if (!window.confirm('119 긴급전화를 걸까요?')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Phone size={24} />
                            119
                        </a>

                        {/* 수정/삭제 버튼 (등록된 경우만) */}
                        {contact && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <button
                                    onClick={startEdit}
                                    style={{
                                        width: '56px', minHeight: '32px', padding: 0,
                                        backgroundColor: 'var(--bg-color)', boxShadow: 'none',
                                        color: 'var(--text-dim)', fontSize: '13px',
                                        flexDirection: 'column', gap: '2px',
                                    }}
                                >
                                    <Phone size={16} />
                                    수정
                                </button>
                                <button
                                    onClick={deleteContact}
                                    style={{
                                        width: '56px', minHeight: '32px', padding: 0,
                                        backgroundColor: 'var(--bg-color)', boxShadow: 'none',
                                        color: '#EF5350', fontSize: '13px',
                                        flexDirection: 'column', gap: '2px',
                                    }}
                                >
                                    <Trash2 size={16} />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
