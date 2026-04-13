import { Printer } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  message = "Loading...",
  fullPage = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-elevated animate-pulse">
        <Printer className="w-6 h-6 text-primary-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-body animate-fade-in">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
}
