import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

interface DraggableShelfProps {
  children: React.ReactNode;
  step?: number;
  className?: string;
}

export const DraggableShelf: React.FC<DraggableShelfProps> = ({
  children,
  step = 490,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse drag states
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(maxScroll > 15 && el.scrollLeft < maxScroll - 15);

    const progress = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, children]);

  const handleScroll = () => {
    checkScroll();
  };

  const scrollByAmount = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  // Mouse wheel horizontal scroll support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (
        (e.deltaY > 0 && el.scrollLeft < maxScroll - 2) ||
        (e.deltaY < 0 && el.scrollLeft > 2)
      ) {
        el.scrollLeft += e.deltaY * 1.2;
      }
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    // Don't drag if user clicked directly on a button
    if ((e.target as HTMLElement).closest('button')) return;

    isDownRef.current = true;
    hasMovedRef.current = false;
    setIsDraggingState(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDownRef.current = false;
    setIsDraggingState(false);
  };

  // Intercept click when user dragged so rider cards don't open by accident
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMovedRef.current = false;
    }
  };

  return (
    <div className="relative group/shelf select-none">
      {/* Floating Left Arrow Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            scrollByAmount(-step);
          }}
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#12141c]/95 hover:bg-[#E10600] text-white border-2 border-white/20 hover:border-[#E10600] shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Geser Kiri"
          aria-label="Geser ke kiri"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Floating Right Arrow Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            scrollByAmount(step);
          }}
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#12141c]/95 hover:bg-[#E10600] text-white border-2 border-white/20 hover:border-[#E10600] shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md animate-pulse hover:animate-none"
          title="Geser Kanan"
          aria-label="Geser ke kanan"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Edge Fading Vignette Indicators */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-6 w-10 bg-gradient-to-r from-[#0c0d12] to-transparent pointer-events-none z-10" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-6 w-10 bg-gradient-to-l from-[#0c0d12] to-transparent pointer-events-none z-10" />
      )}

      {/* Scrollable & Draggable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        className={`flex space-x-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-proximity ${
          isDraggingState ? 'cursor-grabbing select-none' : 'cursor-grab'
        } ${className}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>

      {/* Bottom Interactive Scroll Indicator & User Guidance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 px-1 text-xs text-gray-400">
        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#E10600] shrink-0 animate-pulse" />
          <span>Tahan & geser mouse, scroll horizontal, atau gunakan tombol panah bulat</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full sm:w-48 h-1.5 bg-[#1a1d29] rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-[#E10600] rounded-full transition-all duration-150"
            style={{ width: `${Math.max(18, scrollProgress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
