import { useState, useRef, useEffect } from "react";
import { Send, Smile, Frown, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: Date;
}

const SENTIMENT_RESPONSES: Record<string, { message: string; sentiment: "positive" | "neutral" | "negative" }[]> = {
  positive: [
    {
      message: "That's wonderful! I'm glad you're feeling optimistic. Tell me more about what brings you joy.",
      sentiment: "positive"
    },
    {
      message: "I love your enthusiasm! Your positive energy is contagious. What's making you so happy?",
      sentiment: "positive"
    },
    {
      message: "That's fantastic! It sounds like things are going great. How can I help you celebrate this moment?",
      sentiment: "positive"
    }
  ],
  negative: [
    {
      message: "I can sense some frustration in your words. I'm here to help. What's bothering you?",
      sentiment: "neutral"
    },
    {
      message: "It sounds like you're going through a tough time. I'm here to listen and support you.",
      sentiment: "neutral"
    },
    {
      message: "I understand this is difficult. Let's work through this together. What do you need?",
      sentiment: "neutral"
    }
  ],
  neutral: [
    {
      message: "I understand. Could you tell me more about what you're thinking?",
      sentiment: "neutral"
    },
    {
      message: "That's interesting. Help me understand your perspective better.",
      sentiment: "neutral"
    },
    {
      message: "I see. What would you like to explore further?",
      sentiment: "neutral"
    }
  ]
};

function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["good", "great", "awesome", "love", "happy", "wonderful", "amazing", "excellent", "fantastic"];
  const negativeWords = ["bad", "terrible", "hate", "sad", "angry", "frustrated", "awful", "horrible", "upset"];
  
  const lowerText = text.toLowerCase();
  const hasPositive = positiveWords.some(word => lowerText.includes(word));
  const hasNegative = negativeWords.some(word => lowerText.includes(word));
  
  if (hasPositive && !hasNegative) return "positive";
  if (hasNegative && !hasPositive) return "negative";
  return "neutral";
}

function getSentimentIcon(sentiment: string) {
  switch (sentiment) {
    case "positive":
      return <Heart className="w-4 h-4 text-accent" />;
    case "negative":
      return <Frown className="w-4 h-4 text-destructive" />;
    default:
      return <Zap className="w-4 h-4 text-primary" />;
  }
}

function getSentimentBadge(sentiment: string) {
  const colors = {
    positive: "bg-accent/20 text-accent border-accent/30",
    negative: "bg-destructive/20 text-destructive border-destructive/30",
    neutral: "bg-primary/20 text-primary border-primary/30"
  };
  const labels = {
    positive: "😊 Positive",
    negative: "😔 Negative",
    neutral: "😐 Neutral"
  };
  
  return (
    <div className={cn("text-xs font-semibold px-2 py-1 rounded border", colors[sentiment as keyof typeof colors])}>
      {labels[sentiment as keyof typeof labels]}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your humanoid AI assistant. I can understand and respond to your emotions through advanced sentiment analysis. Tell me how you're feeling today!",
      sentiment: "positive",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    const sentiment = analyzeSentiment(input);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      sentiment,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const responses = SENTIMENT_RESPONSES[sentiment];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        sentiment: response.sentiment,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const exampleQuestions = [
    "I'm feeling great today!",
    "I'm a bit confused about something",
    "Tell me something interesting",
    "I'm interested in AI and ML"
  ];

  const handleQuickReply = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Chat with <span className="gradient-text">Humanoid AI</span></h1>
          <p className="text-muted-foreground">Real-time sentiment analysis powered by machine learning</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 card-glow bg-card overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 animate-slide-in",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-gradient-to-br from-secondary to-primary"
                    : "bg-gradient-to-br from-primary to-accent"
                )}>
                  {message.role === "user" ? (
                    <span className="text-white text-sm font-bold">You</span>
                  ) : (
                    <span className="text-white text-sm font-bold">AI</span>
                  )}
                </div>

                {/* Message */}
                <div className={cn(
                  "flex-1 space-y-2 max-w-2xl",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 inline-block",
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}>
                    <p className="text-sm md:text-base">{message.content}</p>
                  </div>
                  
                  {/* Sentiment Badge */}
                  <div className={cn(
                    "flex gap-2 items-center text-xs",
                    message.role === "user" ? "flex-row-reverse justify-end" : "justify-start"
                  )}>
                    {getSentimentIcon(message.sentiment)}
                    {getSentimentBadge(message.sentiment)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 animate-slide-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 inline-block">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 p-6 space-y-4 bg-muted/20">
            {messages.length <= 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Quick suggestions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exampleQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(question)}
                      className="text-left text-sm p-3 rounded-lg border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
                    >
                      <div className="font-medium group-hover:translate-x-1 transition-transform">{question}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message... (The AI analyzes your sentiment)"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary px-4 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              💡 The AI analyzes your sentiment and responds accordingly. Try different emotions!
            </p>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-glow p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{messages.length}</div>
            <div className="text-xs text-muted-foreground">Messages</div>
          </div>
          <div className="card-glow p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {messages.filter(m => m.sentiment === "positive").length}
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="card-glow p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {messages.filter(m => m.sentiment === "neutral").length}
            </div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="card-glow p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {messages.filter(m => m.sentiment === "negative").length}
            </div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>
      </div>
    </div>
  );
}
