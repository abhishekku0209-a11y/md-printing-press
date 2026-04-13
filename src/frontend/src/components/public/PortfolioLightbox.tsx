import { Button } from "@/components/ui/button";
import type { PortfolioItem } from "@/types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface PortfolioLightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PortfolioLightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: PortfolioLightboxProps) {
  const current = items[currentIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        data-ocid="lightbox-overlay"
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10"
          onClick={onClose}
          aria-label="Close lightbox"
          data-ocid="lightbox-close"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Prev */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 w-12 h-12"
          onClick={onPrev}
          aria-label="Previous image"
          data-ocid="lightbox-prev"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-4 max-w-4xl w-full"
        >
          <img
            src={current.imageUrl}
            alt={current.title}
            className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
          />
          <div className="text-center">
            <h3 className="font-display font-bold text-white text-lg">
              {current.title}
            </h3>
            <span className="text-white/60 text-sm font-body">
              {current.serviceCategory}
            </span>
          </div>
          <p className="text-white/50 text-sm font-body">
            {currentIndex + 1} / {items.length}
          </p>
        </motion.div>

        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 w-12 h-12"
          onClick={onNext}
          aria-label="Next image"
          data-ocid="lightbox-next"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
