import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Humanoid() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI tutor. How can I help you learn today?",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://agent.d-id.com/v2/index.js";
    script.setAttribute("data-mode", "fabio");
    script.setAttribute("data-client-key", "Z29vZ2xlLW9hdXRoMnwxMTE0MDkyMjE1OTkzNjQ0OTgzMzA6Mlh0TW53bWxPb3g1VGk5ZVpUX2JS");
    script.setAttribute("data-agent-id", "v2_agt__m8h5T0f");
    script.setAttribute("data-name", "did-agent");
    script.setAttribute("data-monitor", "true");
    script.setAttribute("data-orientation", "horizontal");
    script.setAttribute("data-position", "right");

    if (agentContainerRef.current) {
      agentContainerRef.current.appendChild(script);
    }

    return () => {
      if (agentContainerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI tutor. How can I help you learn today?",
        timestamp: new Date()
      }
    ]);
    setInput("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(
            80rem 50rem at 10% 10%,
            rgba(109, 40, 217, 0.15),
            transparent 60%
          ),
          radial-gradient(
            60rem 40rem at 90% 20%,
            rgba(0, 183, 255, 0.12),
            transparent 55%
          ),
          radial-gradient(
            70rem 50rem at 50% 100%,
            rgba(0, 255, 136, 0.12),
            transparent 60%
          ),
          linear-gradient(180deg, #0a0a1a, #0f1025)
        `,
        color: "#ffffff",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0))",
          backdropFilter: "blur(6px)"
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#e5e7eb",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            ← Home
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(90deg, rgba(109, 40, 217, 0.25), rgba(0, 183, 255, 0.25))",
              padding: "6px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              fontSize: "12px",
              color: "#e5e7eb"
            }}
          >
            <span>✨</span> Humanoid AI Tutor
          </div>

          <div style={{ width: "80px" }} />
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px 40px",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)"
        }}
      >
        {/* Title Section */}
        <section style={{ marginBottom: "12px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              margin: "0 0 6px 0"
            }}
          >
            Humanoid AI Tutor
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
            Photorealistic AI tutor with natural conversation and emotions
          </p>
        </section>

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "24px",
            flex: 1
          }}
        >
          {/* Chat Section - Left */}
          <div
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.45)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                background: "linear-gradient(135deg, rgba(109, 40, 217, 0.5), rgba(0, 183, 255, 0.5), rgba(0, 255, 136, 0.45))",
                filter: "blur(18px)",
                zIndex: -1,
                opacity: 0.35
              }}
            />

            {/* Card Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                flexShrink: 0
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>Chat with Tutor</div>
                <div style={{ color: "#a1a1aa", fontSize: "14px" }}>
                  Ask questions and learn
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(90deg, rgba(109, 40, 217, 0.25), rgba(0, 183, 255, 0.25))",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  fontSize: "12px",
                  color: "#e5e7eb"
                }}
              >
                Active
              </div>
            </div>

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    animation: "slideIn 0.3s ease-out"
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(90deg, #6d28d9, #00b7ff)"
                          : "linear-gradient(90deg, #00b7ff, #00ff88)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    {msg.role === "user" ? "Y" : "T"}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      maxWidth: "80%",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(90deg, #6d28d9, #00b7ff)"
                          : "rgba(255, 255, 255, 0.08)",
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(90deg, #00b7ff, #00ff88)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    T
                  </div>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#a1a1aa",
                        animation: "bounce 1.4s infinite"
                      }}
                    />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#a1a1aa",
                        animation: "bounce 1.4s infinite",
                        animationDelay: "0.2s"
                      }}
                    />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#a1a1aa",
                        animation: "bounce 1.4s infinite",
                        animationDelay: "0.4s"
                      }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                gap: "12px",
                flexShrink: 0
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "#fff",
                  fontWeight: 600,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #6d28d9, #00b7ff)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: "0 10px 30px rgba(0, 183, 255, 0.25)",
                  transition: "all 0.15s ease",
                  opacity: isLoading || !input.trim() ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && input.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.filter = "brightness(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.filter = "";
                }}
              >
                <Send size={16} />
                <span style={{ display: "none" }}>Send</span>
              </button>
            </form>
          </div>

          {/* Avatar Section - Right */}
          <div
            style={{
              position: "relative",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.45)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                background: "linear-gradient(135deg, rgba(109, 40, 217, 0.5), rgba(0, 183, 255, 0.5), rgba(0, 255, 136, 0.45))",
                filter: "blur(18px)",
                zIndex: -1,
                opacity: 0.35
              }}
            />

            {/* Card Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                flexShrink: 0
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>Live AI Avatar</div>
                <div style={{ color: "#a1a1aa", fontSize: "14px" }}>
                  Powered by D-ID
                </div>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(90deg, rgba(109, 40, 217, 0.25), rgba(0, 183, 255, 0.25))",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  fontSize: "12px",
                  color: "#e5e7eb"
                }}
              >
                Active
              </div>
            </div>

            {/* Avatar Container */}
            <div
              ref={agentContainerRef}
              style={{
                flex: 1,
                width: "100%",
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))"
              }}
            />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
