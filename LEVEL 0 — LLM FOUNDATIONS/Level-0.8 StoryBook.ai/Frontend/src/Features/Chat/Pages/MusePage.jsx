import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Sparkles, Brain, Compass, BookOpen,
    Loader2, X, AlertCircle, RefreshCw, Feather, Info
} from 'lucide-react';
import { startChat, retrieveChat, sendMessage, getMemoryBank } from '../Service/chatService';

const modeOptions = [
    {
        id: 'chat',
        name: 'Standard Chat',
        description: 'Brainstorm lore, explore characters, or chat about blocks.',
        icon: Compass
    },
    {
        id: 'prompt',
        name: 'Provocation',
        description: 'Get a challenging constraint or twist with ambient atmospheric tags.',
        icon: Sparkles
    },
    {
        id: 'coach',
        name: 'Writing Coach',
        description: 'Focus on narrative arcs, subtext, showing vs. telling, and mechanics.',
        icon: Feather
    },
    {
        id: 'feedback',
        name: 'Literary Mirror',
        description: 'Direct pace analysis, emotional crutches check, and pacing critiques.',
        icon: BookOpen
    }
];

const MusePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [activeMode, setActiveMode] = useState('chat');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [convoLoading, setConvoLoading] = useState(true);
    const [error, setError] = useState(null);
    const [memoryOpen, setMemoryOpen] = useState(false);
    const [memories, setMemories] = useState([]);
    const [memoriesLoading, setMemoriesLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Parse out [mood: type] tags (keeping function for backend compatibility but not using mood state)
    const parseMessageText = (text) => {
        const moodRegex = /\[mood:\s*([a-zA-Z0-9_-]+)\]/i;
        const match = text.match(moodRegex);
        if (match) {
            const detectedMood = match[1].toLowerCase();
            const cleanText = text.replace(moodRegex, '').trim();
            return { detectedMood, cleanText };
        }
        return { detectedMood: null, cleanText: text };
    };

    const loadConversation = async (isStart = false) => {
        try {
            setConvoLoading(true);
            setError(null);
            let response;
            if (isStart) {
                response = await startChat();
            } else {
                response = await retrieveChat();
            }

            if (response.success && response.data) {
                const rawMsgs = response.data.messages || [];
                const parsedMsgs = rawMsgs.map(msg => {
                    const { detectedMood, cleanText } = parseMessageText(msg.content);
                    return { ...msg, content: cleanText, moodTag: detectedMood };
                });
                setMessages(parsedMsgs);
            }
        } catch (err) {
            console.error(err);
            if (!isStart) {
                loadConversation(true);
            } else {
                setError("Failed to communicate with the Muse server. Please refresh or try again.");
            }
        } finally {
            setConvoLoading(false);
        }
    };

    const fetchMemories = async () => {
        try {
            setMemoriesLoading(true);
            const response = await getMemoryBank();
            if (response.success) {
                setMemories(response.data || []);
            }
        } catch (err) {
            console.error("Failed to load memory bank:", err);
        } finally {
            setMemoriesLoading(false);
        }
    };

    useEffect(() => {
        loadConversation();
    }, []);

    useEffect(() => {
        if (memoryOpen) {
            fetchMemories();
        }
    }, [memoryOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput('');
        setLoading(true);

        const optimisticMsg = {
            _id: `temp-${Date.now()}`,
            role: 'user',
            content: userText,
            mode: activeMode,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const response = await sendMessage({ text: userText, activeMode });
            if (response.success && response.text) {
                const { detectedMood, cleanText } = parseMessageText(response.text);

                const aiMsg = {
                    _id: `ai-${Date.now()}`,
                    role: 'assistant',
                    content: cleanText,
                    mode: activeMode,
                    moodTag: detectedMood,
                    createdAt: new Date().toISOString()
                };

                setMessages(prev => [...prev, aiMsg]);
            } else if (response?.message) {
                setError(response.message);
            }
        } catch (err) {
            console.error(err);
            const waitHint =
                err.retryAfterSeconds > 0
                    ? ` Try again in about ${err.retryAfterSeconds} seconds.`
                    : '';
            setError(`${err.message || "The Muse couldn't respond."}${waitHint}`);
        } finally {
            setLoading(false);
        }
    };

    const memoryGroups = {
        'writing-style': { title: 'Writing Styles', color: 'border-l-purple-500' },
        'character-lore': { title: 'Character Lore', color: 'border-l-purple-400' },
        'themes': { title: 'Core Themes', color: 'border-l-purple-300' },
        'structural-flaws': { title: 'Structural Flaws', color: 'border-l-purple-600' }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] bg-[#F8F9FA] overflow-hidden font-sans text-zinc-800">
            {/* FIXED GLOBAL HEADER */}
            <header className="flex-none flex items-center justify-between px-10 py-5 bg-white border-b border-purple-100/40 z-20 shadow-[0_4px_30px_-15px_rgba(147,51,234,0.08)]">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2.5">
                            AI Muse
                            <span className="relative flex h-2.5 w-2.5 ml-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]"></span>
                            </span>
                        </h1>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border border-purple-200/50 text-purple-600 bg-purple-50/50">
                            Active
                        </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1.5 font-light tracking-wide">
                        Your personal creative soundboard & literary critique
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        onClick={() => loadConversation()}
                        disabled={convoLoading}
                        className="p-2.5 rounded-full hover:bg-purple-50/80 transition-colors text-zinc-400 hover:text-purple-600 disabled:opacity-50"
                        title="Reload thread"
                    >
                        <RefreshCw className={`w-4.5 h-4.5 ${convoLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setMemoryOpen(true)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-purple-700 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-200/50 rounded-full transition-all hover:shadow-[0_4px_20px_-8px_rgba(168,85,247,0.3)]"
                    >
                        <Brain className="w-4 h-4" />
                        Memory Bank
                    </button>
                </div>
            </header>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="flex-none mx-8 mt-6 overflow-hidden"
                    >
                        <div className="p-3.5 bg-red-50/90 border border-red-100/80 rounded-xl flex items-center justify-between text-sm text-red-600 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-2.5">
                                <AlertCircle className="w-4.5 h-4.5" />
                                <span className="font-medium">{error}</span>
                            </div>
                            <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-100/80 rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDE-BY-SIDE SPLIT SECTION */}
            <main className={`flex-1 flex overflow-hidden p-6 md:p-8 gap-6 md:gap-8 ${error ? 'pt-0' : ''}`}>

                {/* LEFT COLUMN: Chat Stream Canvas */}
                <section className="flex-[2.5] flex flex-col bg-white rounded-3xl border border-purple-100/40 shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden relative">
                    
                    {/* Information Strip */}
                    <div className="flex-none bg-zinc-50/40 px-8 py-3 border-b border-purple-100/30 flex items-center gap-2.5 text-xs text-zinc-500 font-medium">
                        <Info className="w-4 h-4 text-purple-400" />
                        Thread is wiped every 24h. Insights are committed to permanent memory.
                    </div>

                    {/* Chat Viewport */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 scroll-smooth pb-40 custom-scrollbar">
                        {convoLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-5 text-zinc-400">
                                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                                <span className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500">Awakening Muse...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-400">
                                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                                    <Sparkles className="w-8 h-8 text-purple-300" />
                                </div>
                                <p className="text-base font-light text-zinc-500">The canvas is blank. Ignite the spark.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {messages.map((msg) => {
                                    const isUser = msg.role === 'user';
                                    return (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] xl:max-w-[70%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-6 py-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${isUser
                                                    ? 'bg-zinc-900 text-zinc-100 rounded-tr-md font-light'
                                                    : 'bg-white text-zinc-700 border border-purple-100/50 rounded-tl-md font-light shadow-[0_8px_30px_-12px_rgba(147,51,234,0.12)]'
                                                    }`}>
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 font-medium px-2">
                                                    {!isUser && msg.mode && (
                                                        <span className="capitalize text-purple-500/80 tracking-wide">{msg.mode}</span>
                                                    )}
                                                    <span className="opacity-70">
                                                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} className="h-6" />
                            </div>
                        )}
                    </div>

                    {/* Input Anchored Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent pt-16 pointer-events-none">
                        <form onSubmit={handleSend} className="pointer-events-auto relative flex items-center shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl bg-white border border-purple-100/60 overflow-hidden focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:border-purple-300/50 transition-all duration-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading || convoLoading}
                                placeholder="Whisper into the void..."
                                className="flex-1 bg-transparent px-6 py-5 text-[15px] text-zinc-800 placeholder-zinc-400 focus:outline-none font-light disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading || convoLoading}
                                className="p-3.5 mr-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-100 disabled:text-zinc-300 transition-all duration-200 shadow-sm active:scale-95 disabled:active:scale-100"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                {/* RIGHT COLUMN: Modular Engine Switches */}
                <aside className="w-[340px] flex-none flex flex-col">
                    <div className="bg-white rounded-3xl border border-purple-100/40 shadow-[0_8px_40px_rgba(0,0,0,0.02)] p-6 md:p-7 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        <div className="mb-8">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em] px-2 mb-1">Editorial Engine</h3>
                            <p className="text-xs text-zinc-400/80 px-2 font-light">Select your AI's behavioral mode.</p>
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            {modeOptions.map(modeOpt => {
                                const Icon = modeOpt.icon;
                                const isActive = activeMode === modeOpt.id;

                                return (
                                    <button
                                        key={modeOpt.id}
                                        onClick={() => setActiveMode(modeOpt.id)}
                                        className={`group relative flex flex-col text-left p-5 rounded-2xl transition-all duration-300 z-10 overflow-hidden ${isActive
                                            ? 'text-purple-800'
                                            : 'text-zinc-500 hover:text-zinc-800'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeEngineMode"
                                                className="absolute inset-0 bg-purple-50/70 border border-purple-200/50 rounded-2xl shadow-[0_4px_20px_-8px_rgba(147,51,234,0.15)] -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="flex items-center gap-3.5 mb-2">
                                            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-purple-100/50 text-purple-600' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-600'}`}>
                                                <Icon className="w-4.5 h-4.5" />
                                            </div>
                                            <span className="font-semibold text-[15px] tracking-tight">{modeOpt.name}</span>
                                        </div>
                                        <span className={`text-[12px] leading-relaxed transition-colors px-1 ${isActive ? 'text-purple-700/80' : 'text-zinc-400 group-hover:text-zinc-500'}`}>
                                            {modeOpt.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="mt-auto pt-8 px-2">
                            <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100/80 text-xs text-zinc-500 font-light leading-relaxed">
                                <span className="font-medium text-zinc-700 block mb-1">Pro Tip</span>
                                Switch modes mid-conversation to gain diverse perspectives on your current block.
                            </div>
                        </div>
                    </div>
                </aside>

            </main>

            {/* Permanent Memory Bank Drawer */}
            <AnimatePresence>
                {memoryOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMemoryOpen(false)}
                            className="fixed inset-0 bg-zinc-900/10 backdrop-blur-[2px] z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-purple-100/50 z-50 flex flex-col p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between pb-6 border-b border-zinc-100/80">
                                <div>
                                    <h3 className="font-semibold text-zinc-900 text-xl flex items-center gap-2.5">
                                        <Brain className="w-5.5 h-5.5 text-purple-500" />
                                        Permanent Memory
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-1.5 font-light">Long-term creative writer profile</p>
                                </div>
                                <button
                                    onClick={() => setMemoryOpen(false)}
                                    className="p-2.5 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-8 space-y-10 pr-2 custom-scrollbar">
                                {memoriesLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-4 text-zinc-400">
                                        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">Reading memory...</span>
                                    </div>
                                ) : memories.length === 0 ? (
                                    <div className="text-center py-20 px-6">
                                        <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-5">
                                            <Brain className="w-8 h-8 text-zinc-300" />
                                        </div>
                                        <h4 className="font-semibold text-[15px] text-zinc-800 mb-2">Memory is blank</h4>
                                        <p className="text-[13px] text-zinc-500 font-light leading-relaxed">
                                            As you chat, key writing styles, lore, themes, and flaws will be extracted seamlessly.
                                        </p>
                                    </div>
                                ) : (
                                    Object.keys(memoryGroups).map(key => {
                                        const group = memoryGroups[key];
                                        const groupMemories = memories.find(m => m.memoryType === key);
                                        const insights = groupMemories?.data || [];

                                        return (
                                            <div key={key} className="space-y-4">
                                                <h4 className="font-bold text-[11px] text-zinc-400 tracking-[0.2em] uppercase flex items-center gap-2.5">
                                                    <span className={`w-2 h-2 rounded-full ${key === 'writing-style' ? 'bg-purple-500' : key === 'character-lore' ? 'bg-purple-400' : key === 'themes' ? 'bg-purple-300' : 'bg-purple-600'}`} />
                                                    {group.title}
                                                </h4>

                                                {insights.length === 0 ? (
                                                    <p className="text-[13px] text-zinc-400 font-light italic px-4">
                                                        No insights yet.
                                                    </p>
                                                ) : (
                                                    <div className="grid gap-3">
                                                        {insights.map((insight, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`p-5 bg-white border border-purple-50/80 rounded-2xl border-l-4 ${group.color} shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] text-[14px] leading-relaxed text-zinc-700 font-light`}
                                                            >
                                                                {insight}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MusePage;
