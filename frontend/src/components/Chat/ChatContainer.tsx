'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import axios from 'axios';

// Define Message type to match what we use in MessageBubble
interface Message {
    role: 'user' | 'assistant';
    content: string;
    action?: any;
}

export const ChatContainer = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm HR Buddy. I can help with leave, benefits, and policies. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        // Add user message immediately
        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Prepare history for API (exclude action objects to keep context clean for LLM if desired, or keep them)
            // For now, we'll send a simplified history
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await axios.post('http://localhost:4000/chat', {
                message: text,
                history: history
            });

            const botMessage: Message = {
                role: 'assistant',
                content: response.data.content,
                action: response.data.action
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleActionConfirm = (action: any) => {
        if (action.action === 'APPLY_LEAVE') {
             setMessages(prev => [
                ...prev, 
                { role: 'assistant', content: `✅ Leave confirmed from ${action.data.startDate} to ${action.data.endDate}. Your manager has been notified.` }
            ]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="p-4 border-b border-gray-100 bg-white z-10 sticky top-0">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        HB
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900">HR Buddy</h1>
                        <p className="text-xs text-gray-500">Online • AI Assistant</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-3xl mx-auto">
                    {messages.map((msg, idx) => (
                        <MessageBubble 
                            key={idx} 
                            message={msg} 
                            onActionConfirm={handleActionConfirm}
                        />
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 mb-6">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <span className="animate-pulse">...</span>
                            </div>
                            <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none">
                                <span className="text-gray-400 text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
    );
};

