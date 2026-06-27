"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/assets";

interface VideoCardProps {
  item: PortfolioItem;
  index: number;
  hovered: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
}

const GRADIENTS = [
  "linear-gradient(135deg,#e9edf6 0%,#d7def0 100%)",
  "linear-gradient(135deg,#eef0ee 0%,#dfe6e3 100%)",
  "linear-gradient(135deg,#edeaf5 0%,#dcdcec 100%)",
  "linear-gradient(135deg,#eaeef2 0%,#d9e2ec 100%)",
];

// Card width across breakpoints (72vw → 42vw → 300px → 320px).
const POSTER_SIZES =
  "(max-width: 640px) 72vw, (max-width: 768px) 42vw, (max-width: 1024px) 300px, 320px";

export default function VideoCard({
  item,
  index,
  hovered,
  dimmed,
  onHover,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false); // user clicked → inline playback engaged
  const [started, setStarted] = useState(false); // video has produced frames
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Hover preview — only when the card isn't engaged by a click.
  const handleEnter = () => {
    onHover(item.id);
    if (active) return;
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    onHover(null);
    if (active) return; // engaged video keeps playing inline
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setStarted(false);
  };

  // Click → play the video inline, inside this same card. Play/pause toggle.
  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (!active) {
      setActive(true);
      v.muted = muted;
      if (v.paused) v.play().catch(() => {});
      return;
    }
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) v.muted = next;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-cursor="play"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="group relative block w-full cursor-pointer text-left outline-none transition-[opacity,transform] duration-500 ease-cinematic focus-visible:ring-2 focus-visible:ring-accent/50"
      style={{
        opacity: dimmed ? 0.5 : 1,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
      aria-label={
        active
          ? `${isPlaying ? "Pause" : "Play"} ${item.title}`
          : `Play ${item.title}`
      }
    >
      <div
        className={`film-grain relative aspect-[9/13] w-full overflow-hidden rounded-[22px] bg-[#0c0c0e] transition-all duration-500 ease-cinematic ${
          hovered ? "is-active shadow-cinematic" : "shadow-float"
        }`}
      >
        {item.src ? (
          // cinematic zoom wrapper (positioned, so next/image `fill` works)
          <div className="absolute inset-0 scale-[1.03] transition-transform duration-[1.4s] ease-cinematic group-hover:scale-[1.09]">
            {item.poster ? (
              <Image
                src={item.poster}
                alt={item.title}
                fill
                sizes={POSTER_SIZES}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#0c0c0e]" />
            )}
            <video
              ref={videoRef}
              src={item.src}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={() => setStarted(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                started ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        ) : (
          // Elegant placeholder when no video is uploaded yet.
          <div
            className="absolute inset-0 flex items-end p-5"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/40 backdrop-blur">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="#111" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* cinematic letterbox — top + bottom gradients */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/4"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.5) 0%, rgba(8,8,10,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0) 0%, rgba(8,8,10,0.35) 55%, rgba(8,8,10,0.82) 100%)",
          }}
        />

        {/* index badge */}
        <div className="absolute left-3.5 top-3.5 flex h-7 items-center rounded-full bg-white/12 px-2.5 text-[11px] font-medium tabular-nums tracking-wide text-white/90 backdrop-blur-md ring-1 ring-white/20">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* play / pause indicator (visual; clicking the card toggles) */}
        {item.src && (
          <div
            aria-hidden
            className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-md transition-all duration-500 ${
              hovered || active
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0"
            }`}
          >
            {active && isPlaying ? (
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor" />
              </svg>
            )}
          </div>
        )}

        {/* mute / unmute — appears once inline playback is engaged */}
        {item.src && active && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="absolute bottom-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
          >
            {muted ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 6a9 9 0 0 1 0 12" />
              </svg>
            )}
          </button>
        )}

        {/* caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 pr-14">
          <span
            className={`text-[10.5px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
              hovered ? "text-accent-2" : "text-white/60"
            }`}
          >
            {item.category}
          </span>
          <h3 className="mt-1 text-[15.5px] font-medium leading-snug text-white">
            {item.title}
          </h3>
          <div
            className={`mt-2 h-px origin-left bg-gradient-to-r from-accent-2 to-transparent transition-transform duration-700 ease-cinematic ${
              hovered ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </div>

        {/* hover edge highlight */}
        <div
          aria-hidden
          className={`absolute inset-0 rounded-[22px] ring-1 transition-all duration-500 ${
            hovered ? "ring-white/15" : "ring-white/8"
          }`}
        />
      </div>
    </div>
  );
}
