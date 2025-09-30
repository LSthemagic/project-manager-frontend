'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SimpleCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: React.ReactNode[];
  autoPlayInterval?: number;
}

const SimpleCarousel = React.forwardRef<HTMLDivElement, SimpleCarouselProps>(
  ({ className, slides, autoPlayInterval = 5000, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = useCallback(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    }, [slides.length]);

    const goToNext = useCallback(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, [slides.length]);

    useEffect(() => {
      if (autoPlayInterval) {
        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
      }
    }, [autoPlayInterval, goToNext]);

    return (
      <div
        ref={ref}
        className={cn("relative w-full h-full overflow-hidden", className)}
        {...props}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "p-1",
                currentIndex === index ? "text-white" : "text-white/50"
              )}
            >
              <Circle className="h-2 w-2 fill-current" />
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SimpleCarousel.displayName = "SimpleCarousel";

export { SimpleCarousel };