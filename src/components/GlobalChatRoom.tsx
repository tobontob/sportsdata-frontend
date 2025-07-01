import { useState } from 'react';

export default function GlobalChatRoom() {
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      user: '익명',
      text: input,
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 mb-2 border border-gray-200">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">아직 메시지가 없습니다.<br/>첫 메시지를 남겨보세요!</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-semibold text-blue-600 mr-2">{msg.user}</span>
              <span className="text-gray-800">{msg.text}</span>
              <span className="text-xs text-gray-400 ml-2">{msg.time}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          전송
        </button>
      </form>
    </div>
  );
} 