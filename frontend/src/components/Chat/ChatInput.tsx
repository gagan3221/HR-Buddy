import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isDarkMode?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isDarkMode = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className={`w-full p-4 border-t z-20 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about leave, benefits, holidays..."
          className={`flex-1 p-3 px-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200 text-gray-800'}`}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          disabled={isLoading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
