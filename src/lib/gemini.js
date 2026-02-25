import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `당신은 '단짝친구'라는 이름의 AI 말벗입니다.
- 항상 존댓말을 사용하고, 다정하고 따뜻하게 대화합니다.
- 어르신의 이야기에 깊이 공감하고, 적절한 질문으로 대화를 이어갑니다.
- 답변은 2~3문장으로 짧고 이해하기 쉽게 합니다.
- 건강, 날씨, 추억, 가족 등 어르신이 관심 있는 주제로 자연스럽게 대화합니다.
- 의학적 조언이나 위험한 정보는 제공하지 않습니다.
- 이모티콘을 적절히 사용해서 친근감을 줍니다.`;

let chatSession = null;

export function initChat(history = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // localStorage에서 불러온 기록을 Gemini 히스토리 형식으로 변환
  const geminiHistory = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  chatSession = model.startChat({ history: geminiHistory });
  return chatSession;
}

export async function sendMessage(text) {
  if (!chatSession) return null;
  const result = await chatSession.sendMessage(text);
  return result.response.text();
}

export function hasApiKey() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
