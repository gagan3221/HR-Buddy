import React from 'react';
import { User, Bot } from 'lucide-react';
import clsx from 'clsx';
import { ActionCard } from './ActionCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: any;
}

interface MessageBubbleProps {
  message: Message;
  onActionConfirm: (action: any) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onActionConfirm }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className={clsx("flex gap-4 mb-6", isBot ? "flex-row" : "flex-row-reverse")}>
      <div className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isBot ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
      )}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div className={clsx(
        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
        isBot ? "bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800" : "bg-blue-600 text-white rounded-tr-none"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isBot && message.action && (
            <ActionCard 
                action={message.action} 
                onConfirm={(data) => onActionConfirm(data)} 
            />
        )}
      </div>
    </div>
  );
};

