"use client";

import { useState, useRef, useEffect } from "react";

const REELS = [
  { label: "2026 Showreel", href: "https://www.instagram.com/reel/DWDiaxBjlOa/" },
  { label: "2024 Showreel", href: "https://www.instagram.com/reel/DBQcn9fu9Qq/" },
];

export function ShowreelDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-[12px] border border-white/20 bg-transparent px-4 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:border-white/40 hover:bg-white/5 xl:px-5 xl:text-xs"
      >
        View our Showreel
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[190px] overflow-hidden rounded-[12px] border border-white/10 bg-[#111111] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {REELS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
