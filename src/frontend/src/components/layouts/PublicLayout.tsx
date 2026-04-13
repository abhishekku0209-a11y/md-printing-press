import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Footer } from "../shared/Footer";
import { Navbar } from "../shared/Navbar";
import { WhatsAppButton } from "../shared/WhatsAppButton";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
