import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    SendHorizonal, Plus, MessageCircle, Wand2, PenLine, Rocket, ImageIcon,
    Copy, Check, Download, Paperclip, X, FileText, History, Trash2, ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("authToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const SUGGESTIONS = [
    { icon: Wand2, label: "Explain a concept", prompt: "Can you explain how machine learning works in simple terms?" },
    { icon: PenLine, label: "Write an email", prompt: "Help me write a professional email to request time off from work." },
    { icon: Rocket, label: "Brainstorm ideas", prompt: "Give me 5 creative ideas for a weekend side project." },
    { icon: ImageIcon, label: "Generate an image", prompt: "Generate an image of a futuristic city at sunset with neon lights" },
];

const IMAGE_RE = /\b(generate|create|draw|paint|make|design|show|render|produce|give me)\b.{0,40}\b(image|picture|photo|illustration|artwork|painting|drawing|logo|banner|wallpaper|portrait|landscape|art)\b/i;
const isImageReq = (t) => IMAGE_RE.test(t);
const extractPrompt = (t) =>
    t.replace(/^(generate|create|draw|paint|make|design|show me|render|produce|give me)\s+(an?\s+)?(image|picture|photo|illustration|artwork|painting|drawing|logo|banner|wallpaper|portrait|landscape|art)\s+(of\s+)?/i, "").trim() || t.trim();

const ACCEPTED = "image/jpeg,image/png,image/gif,image/webp,text/plain,.txt,.md,.csv";

export default function AiChatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const [convId, setConvId] = useState(null);    // current MongoDB conversation ID
    const [history, setHistory] = useState([]);      // list of past conversations
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    /* ── scroll to bottom ── */
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    /* ── auto-resize textarea ── */
    useEffect(() => {
        const el = textareaRef.current;
        if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }
    }, [input]);

    /* ── load conversation list ── */
    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const { data } = await axios.get(`${API}/chat-history`, { headers: authHeader() });
            setHistory(data);
        } catch {
            toast.error("Could not load chat history.");
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    /* ── open history panel ── */
    const openHistory = () => { setHistoryOpen(true); loadHistory(); };

    /* ── auto-save after each bot reply ── */
    const saveConversation = useCallback(async (msgs, existingId) => {
        if (!msgs.length || !getToken()) return existingId;
        try {
            const { data } = await axios.post(
                `${API}/chat-history`,
                { conversationId: existingId || undefined, messages: msgs },
                { headers: authHeader() }
            );
            return data._id;
        } catch { return existingId; }
    }, []);

    /* ── load a past conversation ── */
    const loadConversation = async (id) => {
        try {
            const { data } = await axios.get(`${API}/chat-history/${id}`, { headers: authHeader() });
            setMessages(data.messages || []);
            setConvId(data._id);
            setHistoryOpen(false);
        } catch { toast.error("Failed to load conversation."); }
    };

    /* ── delete a conversation ── */
    const deleteConversation = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`${API}/chat-history/${id}`, { headers: authHeader() });
            setHistory((h) => h.filter((c) => c._id !== id));
            if (convId === id) { setMessages([]); setConvId(null); }
            toast.success("Deleted.");
        } catch { toast.error("Failed to delete."); }
    };

    /* ── file picker ── */
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const isText = file.type === "text/plain" || /\.(txt|md|csv)$/i.test(file.name);
        if (!isImage && !isText) { toast.error("Unsupported file. Use an image or text file."); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Max file size is 5 MB."); return; }
        const reader = new FileReader();
        if (isImage) {
            reader.onload = () => setAttachment({ file, previewUrl: reader.result, type: "image", mimeType: file.type });
            reader.readAsDataURL(file);
        } else {
            reader.onload = () => setAttachment({ file, type: "text", textContent: reader.result });
            reader.readAsText(file);
        }
    };

    /* ── send ── */
    const sendMessage = async (text) => {
        const trimmed = (text ?? input).trim();
        if (!trimmed && !attachment) return;
        if (isTyping) return;

        const displayContent = trimmed || (attachment?.type === "image" ? "📷 [Image uploaded]" : `📄 ${attachment?.file?.name}`);
        const userMsg = {
            id: Date.now().toString(), role: "user", content: displayContent,
            ...(attachment?.type === "image" && { previewUrl: attachment.previewUrl }),
            ...(attachment?.type === "text" && { fileName: attachment.file.name }),
        };
        const nextMsgs = [...messages, userMsg];
        const currentAtt = attachment;
        setMessages(nextMsgs);
        setInput("");
        setAttachment(null);
        setIsTyping(true);

        try {
            const histCtx = nextMsgs.slice(0, -1).map((m) => ({
                role: m.role === "image" ? "bot" : m.role,
                content: m.role === "image" ? `[AI image: ${m.prompt}]` : m.content,
            }));

            let botMsg;

            if (currentAtt?.type === "image") {
                const base64 = currentAtt.previewUrl.split(",")[1];
                const { data } = await axios.post(`${API}/ai/analyze`, { imageBase64: base64, mimeType: currentAtt.mimeType, question: trimmed || "Describe this image.", history: histCtx });
                botMsg = { id: (Date.now() + 1).toString(), role: "bot", content: data.reply };
            } else if (currentAtt?.type === "text") {
                const fileCtx = `[File: ${currentAtt.file.name}]\n${currentAtt.textContent.slice(0, 4000)}`;
                const question = trimmed ? `${fileCtx}\n\nUser question: ${trimmed}` : `${fileCtx}\n\nSummarize or analyze this file.`;
                const { data } = await axios.post(`${API}/ai/chat`, { message: question, history: histCtx });
                botMsg = { id: (Date.now() + 1).toString(), role: "bot", content: data.reply };
            } else if (isImageReq(trimmed)) {
                const prompt = extractPrompt(trimmed);
                const seed = Math.floor(Math.random() * 999999);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=512&seed=${seed}&nologo=true&enhance=true`;
                await new Promise((res, rej) => { const img = new Image(); img.onload = res; img.onerror = rej; img.src = imageUrl; });
                botMsg = { id: (Date.now() + 1).toString(), role: "image", content: imageUrl, prompt };
            } else {
                const { data } = await axios.post(`${API}/ai/chat`, { message: trimmed, history: histCtx });
                botMsg = { id: (Date.now() + 1).toString(), role: "bot", content: data.reply };
            }

            const finalMsgs = [...nextMsgs, botMsg];
            setMessages(finalMsgs);

            /* ── auto-save ── */
            const savedId = await saveConversation(finalMsgs, convId);
            if (savedId && !convId) setConvId(savedId);

        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to get a response.");
            setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: "bot", content: "⚠️ Something went wrong. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    };

    const copyMessage = (msg) => {
        navigator.clipboard.writeText(msg.content);
        setCopiedId(msg.id);
        toast.success("Copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const downloadChat = () => {
        const lines = messages.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.role === "image" ? `[Image: ${m.prompt}]` : m.content}`);
        const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `chat-${new Date().toISOString().slice(0, 10)}.txt` });
        a.click(); URL.revokeObjectURL(a.href);
        toast.success("Downloaded!");
    };

    const startNewChat = () => { setMessages([]); setInput(""); setIsTyping(false); setAttachment(null); setConvId(null); };
    const isEmpty = messages.length === 0 && !isTyping;
    const canSend = (input.trim().length > 0 || !!attachment) && !isTyping;
    const renderText = (t) => ({ __html: t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />") });

    return (
        <div style={{ display: "flex", height: "calc(100vh - 80px)", fontFamily: "Inter, sans-serif", position: "relative" }}>

            {/* ── HISTORY SIDEBAR ── */}
            <AnimatePresence>
                {historyOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ background: "#f9fafb", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}
                    >
                        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>Chat History</span>
                            <button onClick={() => setHistoryOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                            {historyLoading && <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: 16 }}>Loading…</p>}
                            {!historyLoading && history.length === 0 && (
                                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: 16 }}>No saved chats yet.</p>
                            )}
                            {history.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => loadConversation(c._id)}
                                    style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: convId === c._id ? "#f3f4f6" : "transparent", border: "1px solid", borderColor: convId === c._id ? "#e5e7eb" : "transparent", display: "flex", alignItems: "flex-start", gap: 8, transition: "all 0.15s" }}
                                    onMouseEnter={(e) => { if (convId !== c._id) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#e5e7eb"; } }}
                                    onMouseLeave={(e) => { if (convId !== c._id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                                >
                                    <MessageCircle size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{new Date(c.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteConversation(e, c._id)}
                                        style={{ border: "none", background: "transparent", cursor: "pointer", color: "#d1d5db", display: "flex", flexShrink: 0, padding: 2 }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#d1d5db"}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb" }}>
                            <button
                                onClick={startNewChat}
                                style={{ width: "100%", padding: "8px", borderRadius: 10, border: "1px dashed #d1d5db", background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "Inter, sans-serif" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.borderColor = "#9ca3af"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                            >
                                <Plus size={14} /> New Chat
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── MAIN CHAT ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0 }}>

                {/* Header */}
                <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid #e5e7eb", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MessageCircle size={16} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 15, color: "#111827", letterSpacing: "-0.01em" }}>ChatBot</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <HeaderBtn onClick={openHistory} icon={<History size={14} />} label="History" />
                        {messages.length > 0 && <HeaderBtn onClick={downloadChat} icon={<Download size={14} />} label="Download" />}
                        <HeaderBtn onClick={startNewChat} icon={<Plus size={15} />} label="New Chat" />
                    </div>
                </header>

                {/* Messages */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
                    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
                        {isEmpty ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: 32 }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                        <MessageCircle size={24} color="#9ca3af" />
                                    </div>
                                    <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.02em" }}>How can I help you today?</h1>
                                    <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>Ask anything, upload media, or generate art</p>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, width: "100%", maxWidth: 480 }}>
                                    {SUGGESTIONS.map((s, i) => (
                                        <motion.button key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                                            onClick={() => sendMessage(s.prompt)}
                                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", textAlign: "left", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                                            <s.icon size={16} color="#9ca3af" />
                                            <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{s.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {messages.map((msg) => (
                                    <div key={msg.id} style={{ display: "flex", gap: 10, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
                                        {msg.role !== "user" && (
                                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                                {msg.role === "image" ? <ImageIcon size={14} color="#9ca3af" /> : <MessageCircle size={14} color="#9ca3af" />}
                                            </div>
                                        )}

                                        {msg.role === "image" ? (
                                            <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 8 }}>
                                                <img src={msg.content} alt={msg.prompt} style={{ borderRadius: 14, maxWidth: "100%", display: "block", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                                    <span style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{msg.prompt}"</span>
                                                    <a href={msg.content} download={`image-${msg.prompt?.slice(0, 30).replace(/\s+/g, "-")}.jpg`} target="_blank" rel="noreferrer"
                                                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                                                        <Download size={12} /> Download
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bubble-group" style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: "80%" }}>
                                                {msg.previewUrl && <img src={msg.previewUrl} alt="uploaded" style={{ borderRadius: 12, maxWidth: 220, maxHeight: 160, objectFit: "cover", display: "block", marginBottom: 4 }} />}
                                                {msg.fileName && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#f3f4f6", borderRadius: 10, width: "fit-content", marginBottom: 4 }}>
                                                        <FileText size={14} color="#6b7280" /><span style={{ fontSize: 12, color: "#374151" }}>{msg.fileName}</span>
                                                    </div>
                                                )}
                                                {msg.content && msg.content !== "📷 [Image uploaded]" && (
                                                    <div dangerouslySetInnerHTML={renderText(msg.content)} style={{ padding: "10px 16px", borderRadius: 18, fontSize: 14, lineHeight: 1.65, fontFamily: "Inter, sans-serif", wordBreak: "break-word", ...(msg.role === "user" ? { background: "#111827", color: "#fff", borderBottomRightRadius: 5 } : { background: "#f3f4f6", color: "#111827", borderBottomLeftRadius: 5 }) }} />
                                                )}
                                                {msg.role === "bot" && (
                                                    <button onClick={() => copyMessage(msg)} className="copy-action-btn"
                                                        style={{ display: "flex", alignItems: "center", gap: 5, alignSelf: "flex-start", padding: "3px 10px", borderRadius: 6, border: "1px solid", background: "#fff", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif", opacity: 0, transition: "opacity 0.2s, color 0.2s, border-color 0.2s", color: copiedId === msg.id ? "#16a34a" : "#9ca3af", borderColor: copiedId === msg.id ? "#bbf7d0" : "#e5e7eb" }}>
                                                        {copiedId === msg.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                            <MessageCircle size={14} color="#9ca3af" />
                                        </div>
                                        <div style={{ background: "#f3f4f6", borderRadius: 18, borderBottomLeftRadius: 5, padding: "12px 16px", display: "flex", gap: 4 }}>
                                            {[0, 150, 300].map((d, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", display: "inline-block", animation: `typingDot 1.2s ease-in-out ${d}ms infinite` }} />)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Input */}
                <div style={{ borderTop: "1px solid #e5e7eb", background: "#fff", padding: "12px 16px 16px", flexShrink: 0 }}>
                    <div style={{ maxWidth: 720, margin: "0 auto" }}>
                        <AnimatePresence>
                            {attachment && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 8 }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f3f4f6", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                                        {attachment.type === "image" ? <img src={attachment.previewUrl} alt="preview" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} /> : <FileText size={18} color="#6b7280" />}
                                        <span style={{ fontSize: 12, color: "#374151", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{attachment.file.name}</span>
                                        <button onClick={() => setAttachment(null)} style={{ display: "flex", padding: 2, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }} onMouseEnter={(e) => e.currentTarget.style.color = "#374151"} onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}><X size={14} /></button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            style={{ display: "flex", alignItems: "flex-end", gap: 8, background: "rgba(243,244,246,0.6)", border: "1px solid #e5e7eb", borderRadius: 18, padding: "8px 10px 8px 14px", transition: "border-color 0.2s, box-shadow 0.2s" }}
                            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#111827"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(17,24,39,0.06)"; e.currentTarget.style.background = "#fff"; }}
                            onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(243,244,246,0.6)"; }}
                        >
                            <input ref={fileInputRef} type="file" accept={ACCEPTED} style={{ display: "none" }} onChange={handleFileChange} />
                            <button onClick={() => fileInputRef.current?.click()} title="Attach file"
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: attachment ? "#111827" : "#9ca3af", flexShrink: 0 }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#111827"} onMouseLeave={(e) => e.currentTarget.style.color = attachment ? "#111827" : "#9ca3af"}>
                                <Paperclip size={17} />
                            </button>
                            <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                placeholder={attachment ? "Add a message or press Send…" : "Type a message, or attach an image/file…"} rows={1}
                                style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 14, color: "#111827", fontFamily: "Inter, sans-serif", lineHeight: 1.6, padding: "4px 0", maxHeight: 120, overflowY: "auto" }} />
                            <button onClick={() => sendMessage(input)} disabled={!canSend}
                                style={{ width: 34, height: 34, borderRadius: 10, border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: canSend ? "pointer" : "not-allowed", background: canSend ? "#111827" : "#e5e7eb", transition: "background 0.15s" }}>
                                <SendHorizonal size={14} color={canSend ? "#fff" : "#9ca3af"} />
                            </button>
                        </div>
                        <p style={{ textAlign: "center", fontSize: 11, color: "#d1d5db", marginTop: 8, fontFamily: "Inter, sans-serif" }}>
                            Supports images &amp; text files · Chats auto-saved · Type "generate an image of…" to create art
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes typingDot { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
        .bubble-group:hover .copy-action-btn { opacity: 1 !important; }
        .copy-action-btn:hover { border-color: #d1d5db !important; color: #374151 !important; }
      `}</style>
        </div>
    );
}

function HeaderBtn({ onClick, icon, label }) {
    return (
        <button onClick={onClick}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#111827"; e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#f9fafb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "transparent"; }}>
            {icon}{label}
        </button>
    );
}
