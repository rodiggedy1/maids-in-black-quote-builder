import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/admin");
      } else {
        window.location.href = getLoginUrl();
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-ember border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
