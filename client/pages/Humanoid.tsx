import { useState, useRef, useEffect } from "react";
import EmotionDetector from "@/components/EmotionDetector";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Humanoid() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor. How can I help you learn today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionDetected = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
          >
            ← Home
          </a>
          <div>
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-purple-700 border border-purple-200">
              ✨ Humanoid AI Tutor
            </span>
          </div>
          <div className="w-20" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Humanoid AI Tutor
          </h1>
          <p className="text-gray-600">
            Photorealistic AI tutor with natural conversation and emotion
            detection
          </p>
        </section>

        {/* Main Grid Layout: Avatar (left) + Chat (right) + Emotion Detector (bottom left) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Avatar + Emotion Detector */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* D-ID Avatar Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-96">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Live AI Avatar</h2>
                <p className="text-xs text-gray-600">Powered by D-ID</p>
              </div>
              <div
                id="did-agent-container"
                className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center"
              >
                <p className="text-gray-500 text-center text-sm px-4">
                  D-ID Avatar will load here
                </p>
              </div>
            </div>

            {/* Emotion Detector */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Emotion Detector</h2>
                <p className="text-xs text-gray-600">Real-time emotion analysis</p>
              </div>
              <div className="p-4">
                <EmotionDetector onEmotionDetected={handleEmotionDetected} />
              </div>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-96 lg:h-auto">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-800">Chat with Tutor</h2>
                  <p className="text-xs text-gray-600">
                    Ask questions and learn
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-semibold text-green-700 border border-green-200">
                  ● Active
                </span>
              </div>
              {currentEmotion && (
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  Your emotion: <span className="font-bold">{currentEmotion}</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-blue-50 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gradient-to-r from-blue-500 to-green-500"
                    }`}
                  >
                    {message.role === "user" ? "Y" : "T"}
                  </div>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg"
                        : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-green-500">
                    T
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60 animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60 animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-white border border-purple-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:opacity-50 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          If avatar doesn't load, refresh the page or check your network
          connection.
        </p>
      </main>

      {/* D-ID Web Agent Script - Add valid credentials to use */}
    </div>
  );
}
