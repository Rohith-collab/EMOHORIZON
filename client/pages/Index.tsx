import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Brain,
  Heart,
  MessageCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function Index() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        <div className="absolute inset-0 gradient-bg -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-gradient-shift" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-gradient-shift animation-delay-2000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    AI-Powered Conversation
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Talk to <span className="gradient-text">Humanoid AI</span>{" "}
                  That Understands You
                </h1>
                <p className="text-xl text-muted-foreground mt-4">
                  Experience advanced AI conversations with real-time sentiment
                  analysis. Our humanoid chatbot understands emotions and
                  responds with empathy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/chat"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-base"
                >
                  Start Chatting <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
                  Watch Demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">ML</div>
                  <div className="text-sm text-muted-foreground">Powered</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="card-glow p-8 bg-gradient-to-br from-card to-muted/20">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      AI Chatbot Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by <span className="gradient-text">Advanced ML</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our humanoid chatbot combines cutting-edge machine learning with
              emotional intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Sentiment Analysis",
                description:
                  "Real-time emotion detection and empathetic responses tailored to user feelings",
              },
              {
                icon: Brain,
                title: "Deep Learning",
                description:
                  "Advanced neural networks trained on millions of conversations for natural dialogue",
              },
              {
                icon: MessageCircle,
                title: "Natural Conversation",
                description:
                  "Humanoid responses that feel genuine, personal, and contextually appropriate",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Instant responses powered by optimized ML models and edge computing",
              },
              {
                icon: TrendingUp,
                title: "Learning & Improvement",
                description:
                  "Continuously improves through interactions while maintaining privacy",
              },
              {
                icon: Sparkles,
                title: "Multi-Modal",
                description:
                  "Handles text, context, and intent analysis for comprehensive understanding",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card-glow p-6 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text">It Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to experience AI conversations like never
              before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Start a Conversation",
                description:
                  "Begin chatting naturally with our humanoid AI. Share your thoughts, questions, or ideas.",
              },
              {
                step: "02",
                title: "Real-time Sentiment Detection",
                description:
                  "Our ML models analyze your emotions and sentiment, understanding context and intent beneath the words.",
              },
              {
                step: "03",
                title: "Empathetic AI Response",
                description:
                  "Receive thoughtful, contextual responses that acknowledge your emotional state and needs.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="card-glow p-8 bg-gradient-to-br from-card to-muted/20 h-full">
                  <div className="text-5xl font-bold gradient-text mb-4 opacity-30">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sentiment Analysis Showcase */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Understand Every <span className="gradient-text">Emotion</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our sentiment analysis engine detects and responds to:
              </p>
              <ul className="space-y-4">
                {[
                  "Joy, happiness, and positive sentiment",
                  "Concern, frustration, and negative emotions",
                  "Confusion and knowledge gaps",
                  "Engagement level and interest",
                  "Implicit needs and desires",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-glow p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
              <div className="space-y-4">
                {[
                  {
                    label: "Positive Sentiment",
                    value: 78,
                    color: "from-accent",
                  },
                  {
                    label: "Neutral Sentiment",
                    value: 15,
                    color: "from-primary",
                  },
                  {
                    label: "Negative Sentiment",
                    value: 7,
                    color: "from-destructive",
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold gradient-text">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Experience{" "}
            <span className="gradient-text">AI Conversations</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start chatting with our humanoid AI today and discover how sentiment
            analysis can enhance your interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="btn-primary inline-flex items-center justify-center gap-2 text-base"
            >
              Try Free Now <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
