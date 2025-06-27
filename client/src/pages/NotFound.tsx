
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
    
    // Auto-redirect to home after 3 seconds for mobile app
    const timer = setTimeout(() => {
      setLocation("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [location, setLocation]);

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <p className="text-sm text-muted-foreground mb-6">Redirecting to home in 3 seconds...</p>
        <Button onClick={handleGoHome} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Go to Home Now
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
