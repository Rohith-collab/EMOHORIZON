import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-theme(spacing.32))] flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold gradient-text">404</h1>
          <p className="text-2xl font-semibold text-foreground">Page Not Found</p>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist yet. This feature is coming soon!
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Would you like to:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
              Go Home <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/chat" className="btn-secondary inline-flex items-center justify-center gap-2">
              Try Chat Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
