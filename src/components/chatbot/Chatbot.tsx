import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Trash2, Copy, 
  ChevronDown, Maximize2, Minimize2, Sparkles,
  Bot, User, Loader2, Hexagon, Zap, Target, Search, Info
} from "lucide-react";
import { SsButton } from "../ss/SsButton";
import { useAuth } from "@/context/AuthContext";
import { streamChatResponse, ChatMessage } from "@/services/aiService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GUEST_LIMIT = 10;

const QUICK_ACTIONS = [
  { label: "Analyze Trends", icon: <Zap className="w-3.5 h-3.5" />, prompt: "What are the latest business trends in India for 2026?" },
  { label: "Business Gaps", icon: <Target className="w-3.5 h-3.5" />, prompt: "Run a Business Gap Analysis for [City] in the [Industry] sector." },
  { label: "Market Search", icon: <Search className="w-3.5 h-3.5" />, prompt: "How does TrendAI use OSM data for market scanning?" },
  { label: "About TrendAI", icon: <Info className="w-3.5 h-3.5" />, prompt: "Explain the core features and ROI model of TrendAI." },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [guestCount, setGuestCount] = useState<number>(() => {
    const saved = localStorage.getItem("trendai_guest_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("trendai_guest_count", guestCount.toString());
  }, [guestCount]);

  useEffect(() => {
    if (scrollRef.current && isAutoScrolling) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, isAutoScrolling]);

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input;
    if (!textToSend.trim()) return;
    
    if (!isAuthenticated && guestCount >= GUEST_LIMIT) {
      toast.error("Guest limit reached. Please login to continue strategic analysis.");
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    let assistantContent = "";
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const stream = streamChatResponse([...messages, userMessage]);
      for await (const chunk of stream) {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: assistantContent }];
        });
      }
    } catch (err) {
      toast.error("TrendAI Intelligence is temporarily unavailable");
    } finally {
      setIsTyping(false);
      if (!isAuthenticated) {
        setGuestCount(prev => prev + 1);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const clearChat = () => {
    setMessages([]);
    toast.info("Session history cleared");
  };

  const formatContent = (content: string) => {
    if (!content) return null;
    return content.split("\n").map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine && i > 0) return <div key={i} className="h-2" />;
      
      // Handle Titles (###)
      if (trimmedLine.startsWith("###")) {
        return (
          <h4 key={i} className="font-display font-bold text-[15px] text-accent-emerald mt-4 mb-2 first:mt-0 animate-in fade-in slide-in-from-bottom-1 duration-500">
            {trimmedLine.replace(/###/g, "").trim()}
          </h4>
        );
      }

      // Parse bold text and bullets
      const isBullet = trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ");
      const cleanLine = isBullet ? trimmedLine.slice(2) : trimmedLine;
      
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedContent = parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="text-text-primary font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={i} className="ml-4 list-disc text-[13px] text-text-secondary leading-relaxed mb-2 animate-in fade-in slide-in-from-left-1 duration-300">
            {renderedContent}
          </li>
        );
      }
      
      return (
        <p key={i} className="mb-2 last:mb-0 text-[13.5px] leading-relaxed text-text-primary/90 animate-in fade-in duration-300">
          {renderedContent}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "64px" : isFullScreen ? "calc(100vh - 48px)" : "600px",
              width: isFullScreen ? "calc(100vw - 48px)" : "400px",
              bottom: isFullScreen ? "24px" : "auto",
              right: isFullScreen ? "24px" : "auto",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 glass-card-blur overflow-hidden shadow-2xl flex flex-col border border-border/50 rounded-2xl"
          >
            {/* Header */}
            <div className="bg-surface/80 backdrop-blur-md p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-accent-emerald/20">
                  <Hexagon className="w-5 h-5 text-white fill-white/20" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-text-primary">StarterScope Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                    <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">SaaS Intelligence Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                    setIsMinimized(false);
                  }}
                  className="p-1.5 hover:bg-elevated rounded-lg transition-all text-text-muted hover:text-text-primary"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen Mode"}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-elevated rounded-lg transition-all text-text-muted hover:text-text-primary"
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isMinimized && "rotate-180")} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-elevated rounded-lg transition-all text-text-muted hover:text-vivid-rose"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-6 bg-background/30 scroll-smooth custom-scrollbar"
                >
                  {!isAuthenticated && guestCount >= GUEST_LIMIT ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="w-14 h-14 rounded-full bg-elevated flex items-center justify-center mb-4 shadow-inner">
                        <User className="w-7 h-7 text-text-muted" />
                      </div>
                      <p className="font-display text-sm text-text-primary font-semibold mb-1">
                        SaaS Intelligence Locked
                      </p>
                      <p className="font-body text-xs text-text-muted mb-5 max-w-[200px]">
                        You've reached your guest limit of {GUEST_LIMIT} inquiries. Sign in to access unlimited real-time market data.
                      </p>
                      <SsButton variant="primary" size="sm" onClick={() => window.location.href = "/auth"}>
                        Authenticate Now
                      </SsButton>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-accent-emerald/20 blur-2xl rounded-full" />
                        <Hexagon className="w-12 h-12 text-accent-emerald relative animate-float" strokeWidth={1.5} />
                      </div>
                      <p className="font-display text-base text-text-primary font-bold">
                        Welcome, {isAuthenticated ? user?.email.split('@')[0] : "Guest Strategist"}
                      </p>
                      <p className="font-body text-[13px] text-text-secondary mt-2 max-w-[240px] leading-relaxed">
                        I'm your strategic intelligence partner. Ask me to analyze market trends or find business gaps in your city.
                        {!isAuthenticated && (
                          <span className="block mt-2 text-[10px] text-accent-emerald font-mono uppercase">
                            Guest Mode: {GUEST_LIMIT - guestCount} inquiries remaining
                          </span>
                        )}
                      </p>
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={i}
                        className={cn(
                          "flex flex-col max-w-[88%]",
                          m.role === "user" ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "p-4 rounded-2xl relative group transition-all duration-300",
                          m.role === "user" 
                            ? "bg-accent-emerald text-black font-medium rounded-tr-none shadow-md shadow-accent-emerald/10" 
                            : "bg-surface border border-border/40 text-text-primary rounded-tl-none shadow-sm backdrop-blur-sm"
                        )}>
                          {formatContent(m.content)}
                          {m.role === "assistant" && m.content && (
                            <div className="absolute -right-10 top-0 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => copyToClipboard(m.content)}
                                className="p-2 hover:bg-accent-emerald hover:text-white rounded-lg bg-surface border border-border shadow-sm transition-colors"
                                title="Copy Strategy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-text-muted mt-2 px-1 font-mono uppercase tracking-widest opacity-60">
                          {m.role === "user" ? "Client" : "StarterScope Engine"} · {m.timestamp}
                        </span>
                      </motion.div>
                    ))
                  )}
                  {isTyping && (
                    <div className="flex items-center gap-3 text-text-muted">
                      <div className="bg-surface/50 border border-border/40 p-3 rounded-2xl rounded-tl-none backdrop-blur-sm">
                        <div className="flex gap-1">
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono italic tracking-tight">StarterScope is analyzing...</span>
                    </div>
                  )}
                </div>

                {/* Footer UI */}
                <div className="p-4 border-t border-border/50 bg-surface/80 backdrop-blur-md">
                  {/* Quick Actions */}
                  {messages.length === 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleSend(action.prompt)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-elevated/50 border border-border/40 hover:border-accent-emerald/40 hover:bg-elevated transition-all text-left group"
                        >
                          <span className="text-accent-emerald group-hover:scale-110 transition-transform">{action.icon}</span>
                          <span className="text-[11px] font-medium text-text-secondary truncate">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={clearChat}
                      className="p-2.5 hover:bg-elevated rounded-xl transition-all text-text-muted hover:text-vivid-rose group"
                      title="Reset Session"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="flex-1 relative group">
                      <input
                        type="text"
                        placeholder="Inquire StarterScope Intelligence..."
                        className="w-full bg-elevated/60 border border-border/50 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald/40 transition-all pr-10 placeholder:text-text-muted/60"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      />
                      <button 
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent-emerald disabled:text-text-muted transition-all hover:scale-110"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-15 h-15 rounded-2xl bg-gradient-brand shadow-xl shadow-accent-emerald/30 flex items-center justify-center text-white relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
              <ChevronDown className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
              <Hexagon className="w-7 h-7 text-white fill-white/20" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-vivid-rose rounded-full border-2 border-background"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}
      </motion.button>
    </div>
  );
}
