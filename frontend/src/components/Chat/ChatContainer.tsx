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

import { motion, AnimatePresence } from 'framer-motion';

export const ChatContainer = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm HR Buddy. I can help with leave, benefits, and policies. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [hasEntered, setHasEntered] = useState(false);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
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

    const handleActionConfirm = (data: any) => {
        if (data.action === 'APPLY_LEAVE' || data.startDate) { 
             setMessages(prev => [
                ...prev, 
                { role: 'assistant', content: `✅ Leave confirmed from ${data.startDate} to ${data.endDate} for reason: "${data.reason}".` }
            ]);
        } else if (data.action === 'CREATE_TICKET') {
            setMessages(prev => [
                ...prev, 
                { role: 'assistant', content: `🎫 Support Ticket #4830 created.\nSubject: ${data.summary}\nPriority: ${data.priority}` }
            ]);
        } else if (data.action === 'SCHEDULE_MEETING') {
             setMessages(prev => [
                ...prev, 
                { role: 'assistant', content: `📅 Meeting confirmed for ${data.slot}.` }
            ]);
        }
    };

    return (
        <div className={`h-screen overflow-hidden ${isDarkMode ? 'dark bg-gray-950' : 'light bg-white'} transition-colors duration-300 relative`}>
            <AnimatePresence>
                {!hasEntered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-emerald-600 p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                                HB
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to HR Buddy</h1>
                            <p className="text-gray-500 mb-8">Your intelligent assistant for all HR queries.</p>
                            
                            <div className="text-left mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Company Name</label>
                                <input 
                                    type="text" 
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                />
                            </div>

                            <button 
                                onClick={() => companyName.trim() && setHasEntered(true)}
                                disabled={!companyName.trim()}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
                            >
                                Get Started
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: hasEntered ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <header className={`p-4 border-b z-10 sticky top-0 flex justify-between items-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            HB
                        </div>
                        <div>
                            <h1 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>HR Buddy</h1>
                             <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {companyName ? `${companyName} • ` : ''}Online
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`p-3 rounded-full text-xl shadow-md ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 ring-1 ring-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 ring-1 ring-gray-200'} transition-all`}
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </header>

                <div className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-950' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
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


                <div className={`p-2 border-t flex gap-2 overflow-x-auto justify-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white/50 border-gray-100'}`}>
                    <button 
                        onClick={() => handleSend("I want to apply for leave")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${isDarkMode ? 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                        ✈️ Apply Leave
                    </button>
                    <button 
                        onClick={() => handleSend("I need to raise a support ticket")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${isDarkMode ? 'bg-orange-900/50 text-orange-300 hover:bg-orange-900' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                    >
                        🎫 Support Ticket
                    </button>
                    <button 
                        onClick={() => handleSend("Schedule a meeting with HR")}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${isDarkMode ? 'bg-purple-900/50 text-purple-300 hover:bg-purple-900' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    >
                        📅 Book Meeting
                    </button>
                </div>

                <ChatInput onSend={handleSend} isLoading={isLoading} isDarkMode={isDarkMode} />
            </motion.div>
        </div>
    );
};

