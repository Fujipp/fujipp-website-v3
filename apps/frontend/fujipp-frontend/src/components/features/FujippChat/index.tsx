import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import styles from './FujippChat.module.css';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatApiMessage {
  role: ChatRole;
  content: string;
}

interface ChatApiResponse {
  reply?: string;
  error?: string;
}

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL as string | undefined;

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'สวัสดีครับ ผมคือ Fujipp AI ตอนนี้ยังเป็นเวอร์ชันทดลองอยู่นะครับ ถามเรื่องประวัติ ทักษะ โปรเจกต์ หรือช่องทางติดต่อของอนวัตรได้เลยครับ',
  },
];

const QUICK_PROMPTS = [
  'เล่าเกี่ยวกับ Fujipp หน่อย',
  'มีทักษะอะไรบ้าง',
  'โปรเจกต์เด่นคืออะไร',
  'ติดต่อได้ทางไหน',
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getFallbackReply(question: string) {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes('ติดต่อ') || normalizedQuestion.includes('contact')) {
    return 'ติดต่อ Fujipp ได้ผ่าน Gmail: anawat.grudtoop@gmail.com, GitHub: https://github.com/Fujipp, Instagram: https://www.instagram.com/f.janw/, Facebook: https://www.facebook.com/fujipp และ Discord: fujipp. ครับ';
  }

  if (normalizedQuestion.includes('skill') || normalizedQuestion.includes('ทักษะ')) {
    return 'ทักษะหลักของ Fujipp คือ React, Vue.js, TypeScript, Tailwind CSS, Spring Boot, MySQL, Discord Bot, Automation และสนใจด้าน System Architecture กับ AI workflow ครับ';
  }

  if (normalizedQuestion.includes('project') || normalizedQuestion.includes('โปรเจกต์')) {
    return 'โปรเจกต์เด่นคือ Chat2Date แอปหาคู่แบบ full stack/mobile ที่มี matching, chat, AI game, GPS filtering, date planning และระบบความปลอดภัยครับ';
  }

  return 'Fujipp หรือ อนวัตร กรุดธูป เป็นนักศึกษา Information Technology ที่สนใจ Full Stack Development, System Architecture, AI workflow และการทำระบบที่โครงสร้างชัดเจน พัฒนาต่อได้ง่ายครับ';
}

async function requestChatReply(messages: ChatMessage[]) {
  const latestQuestion = messages.at(-1)?.content ?? '';

  if (!CHAT_API_URL) {
    return getFallbackReply(latestQuestion);
  }

  const payload: { messages: ChatApiMessage[] } = {
    messages: messages
      .filter((message) => message.role === 'assistant' || message.role === 'user')
      .slice(-8)
      .map(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as ChatApiResponse;

  if (!response.ok) {
    throw new Error(data.error || 'ตอนนี้ Fujipp AI ยังตอบไม่ได้ ลองถามใหม่อีกครั้งนะครับ');
  }

  if (!data.reply) {
    throw new Error('AI ยังไม่ส่งคำตอบกลับมา');
  }

  return data.reply;
}

export function FujippChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitDisabled = isLoading || draft.trim().length === 0;
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const timerId = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timerId);
  }, [isOpen]);

  const submitMessage = async (content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) return;

    const nextMessages = [
      ...messages,
      { id: createMessageId(), role: 'user' as const, content: trimmedContent },
    ];

    setMessages(nextMessages);
    setDraft('');
    setError('');
    setIsLoading(true);

    try {
      const reply = await requestChatReply(nextMessages);
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: createMessageId(), role: 'assistant', content: reply },
      ]);
    } catch (chatError) {
      const message = chatError instanceof Error ? chatError.message : 'เกิดข้อผิดพลาดขณะคุยกับ AI';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage(draft);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void submitMessage(draft);
  };

  return (
    <div className={styles.chatRoot}>
      {isOpen ? (
        <section className={styles.panel} aria-label="Fujipp AI chat">
          <header className={styles.header}>
            <div className={styles.identity}>
              <div className={styles.avatar} aria-hidden="true">
                <img src="/images/users/fujipp/profile-fujipp.png" alt="" />
              </div>
              <div>
                <h2 className={styles.title}>Fujipp AI</h2>
                <p className={styles.subtitle}>กำลังพัฒนาอยู่</p>
              </div>
            </div>

            <button
              className={styles.closeButton}
              type="button"
              aria-label="Close Fujipp AI chat"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
              <div
                className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                key={message.id}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <span className={styles.typing} aria-label="Fujipp AI is typing">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.composer}>
            <div className={styles.quickActions} aria-label="Quick questions">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  className={styles.quickButton}
                  key={prompt}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void submitMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className={styles.input}
                rows={1}
                value={draft}
                placeholder="ถามเรื่อง Fujipp..."
                aria-label="Message Fujipp AI"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button
                className={styles.sendButton}
                type="submit"
                disabled={isSubmitDisabled}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          className={styles.launcher}
          type="button"
          aria-label="Open Fujipp AI chat"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
          <span className={styles.statusDot} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
