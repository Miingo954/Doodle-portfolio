"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

type Position = { x: number; y: number };
type Face = "open" | "blink" | "wink" | "drag" | "flying" | "idle";

const JAM_SIZE = 148;

const faceImages: Record<Face, string> = {
  open: "/doodle/assets/lil-mal-v2-open.png",
  blink: "/doodle/assets/lil-mal-v2-blink.png",
  wink: "/doodle/assets/lil-mal-v2-wink.png",
  drag: "/doodle/assets/lil-mal-v2-drag.png",
  flying: "/doodle/assets/lil-mal-v2-flying.png",
  idle: "/doodle/assets/lil-mal-v2-idle.png",
};

type DraggableJamProps = {
  onOpenContact: () => void;
};

function constrain(position: Position): Position {
  return {
    x: Math.min(Math.max(position.x, 8), window.innerWidth - JAM_SIZE - 8),
    y: Math.min(Math.max(position.y, 76), window.innerHeight - JAM_SIZE - 8),
  };
}

export default function DraggableJam({ onOpenContact }: DraggableJamProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [face, setFace] = useState<Face>("open");
  const [dragging, setDragging] = useState(false);
  const [released, setReleased] = useState(false);
  const pointerOffset = useRef<Position>({ x: 0, y: 0 });
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionRef = useRef<Position | null>(null);
  const draggingRef = useRef(false);
  const lastSample = useRef({ x: 0, y: 0, time: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  const updatePosition = (next: Position | null) => {
    positionRef.current = next;
    setPosition(next);
  };

  useEffect(() => {
    const handleResize = () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      if (releaseTimer.current) {
        clearTimeout(releaseTimer.current);
        releaseTimer.current = null;
      }
      draggingRef.current = false;
      positionRef.current = null;
      setDragging(false);
      setReleased(false);
      setFace("open");
      setPosition(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dragging) return;
    const interval = window.setInterval(() => {
      setFace("blink");
      window.setTimeout(() => setFace("open"), 180);
    }, 4200);
    return () => window.clearInterval(interval);
  }, [dragging]);

  useEffect(
    () => () => {
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    },
    [],
  );

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const startPosition = position ?? { x: rect.left, y: rect.top };
    updatePosition(startPosition);
    pointerOffset.current = {
      x: event.clientX - startPosition.x,
      y: event.clientY - startPosition.y,
    };
    setDragging(true);
    draggingRef.current = true;
    setReleased(false);
    setFace("drag");
    lastSample.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };
    velocity.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const elapsed = Math.max(now - lastSample.current.time, 8);
    const throwBoost = 1.35;
    velocity.current = {
      x: ((event.clientX - lastSample.current.x) / elapsed) * 18 * throwBoost,
      y: ((event.clientY - lastSample.current.y) / elapsed) * 18 * throwBoost,
    };
    lastSample.current = { x: event.clientX, y: event.clientY, time: now };
    updatePosition(
      constrain({
        x: event.clientX - pointerOffset.current.x,
        y: event.clientY - pointerOffset.current.y,
      }),
    );
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    draggingRef.current = false;
    setReleased(true);
    setFace("flying");

    const coast = () => {
      const current = positionRef.current;
      if (!current) return;
      let nextX = current.x + velocity.current.x;
      let nextY = current.y + velocity.current.y;
      const maxX = window.innerWidth - JAM_SIZE - 8;
      const maxY = window.innerHeight - JAM_SIZE - 8;

      if (nextX <= 8 || nextX >= maxX) {
        velocity.current.x *= -0.68;
        nextX = Math.min(Math.max(nextX, 8), maxX);
      }
      if (nextY <= 76 || nextY >= maxY) {
        velocity.current.y *= -0.68;
        nextY = Math.min(Math.max(nextY, 76), maxY);
      }

      velocity.current.x *= 0.982;
      velocity.current.y *= 0.982;
      updatePosition({ x: nextX, y: nextY });

      if (Math.hypot(velocity.current.x, velocity.current.y) > 0.8) {
        animationFrame.current = requestAnimationFrame(coast);
      } else {
        animationFrame.current = null;
        setReleased(false);
        setFace("idle");
        releaseTimer.current = setTimeout(() => setFace("open"), 900);
      }
    };

    animationFrame.current = requestAnimationFrame(coast);
  };

  const handleDoubleClick = () => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    updatePosition(null);
    setFace("wink");
    setTimeout(() => setFace("open"), 650);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Drag Lil’ Jam to move him. Double-click to return him to the right side."
        className={`jam-mascot ${position ? "is-free" : ""} ${dragging ? "is-dragging" : ""} ${released ? "is-released" : ""}`}
        style={
          position
            ? {
                left: position.x,
                top: position.y,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <Image
          src={faceImages[face]}
          alt="Lil’ Jam, Jamal’s draggable portfolio mascot"
          width={190}
          height={190}
          priority
          draggable={false}
        />
      </button>
      <button
        type="button"
        className="jam-mail-bubble"
        aria-label="Email Jamal Ferguson"
        title="Email Jamal"
        aria-haspopup="dialog"
        onClick={onOpenContact}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />
        </svg>
      </button>
    </>
  );
}
