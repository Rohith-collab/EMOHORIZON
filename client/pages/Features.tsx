import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center py-20">
      <div className="text-center space-y-8 animate-fade-in max-w-2xl px-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Coming Soon
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Detailed <span className="gradient-text">Features</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We're building out a comprehensive features page to showcase all the
            capabilities of Humanoid AI. This page is coming soon!
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            In the meantime, you can:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Learn About Features on Home <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/chat"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              Try Chat Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="card-glow p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 mt-12">
          <p className="text-muted-foreground text-sm">
            📝 Want to help us build this page? Share what features you'd like
            to see or contribute ideas by contacting us.
          </p>
        </div>
      </div>
    </div>
  );
}
