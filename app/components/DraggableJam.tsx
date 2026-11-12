"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { advanceJam, constrainJam, jamBounds, type Point as Position } from "./jam-motion";
type Face = "open" | "blink" | "wink" | "drag" | "flying" | "idle";


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

export default function DraggableJam({ onOpenContact }: DraggableJamProps) {
  const [free, setFree] = useState(false);
  const [face, setFace] = useState<Face>("open");
  const [dragging, setDragging] = useState(false);
  const [released, setReleased] = useState(false);
  const mascot = useRef<HTMLButtonElement>(null);
  const pointerOffset = useRef<Position>({ x: 0, y: 0 });
  const position = useRef<Position | null>(null);
  const draggingRef = useRef(false);
  const lastSample = useRef({ x: 0, y: 0, time: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const faceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bounds = () => jamBounds(
    mascot.current?.offsetWidth || 0,
    mascot.current?.offsetHeight || 0,
    document.documentElement.clientWidth,
    window.innerHeight,
  );

  const paint = (next: Position) => {
    position.current = next;
    if (mascot.current) mascot.current.style.translate = `${next.x}px ${next.y}px`;
  };

  const stop = () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    if (faceTimer.current) clearTimeout(faceTimer.current);
  };

  useEffect(() => {
    const handleResize = () => {
      if (!mascot.current || !position.current) return;
      paint(constrainJam(position.current, jamBounds(mascot.current.offsetWidth, mascot.current.offsetHeight, document.documentElement.clientWidth, window.innerHeight)));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dragging || released) return;
    let blinkTimer: ReturnType<typeof setTimeout>;
    const interval = window.setInterval(() => {
      setFace("blink");
      blinkTimer = setTimeout(() => setFace("open"), 180);
    }, 4200);
    return () => { clearInterval(interval); clearTimeout(blinkTimer); };
  }, [dragging, released]);

  useEffect(() => () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    if (faceTimer.current) clearTimeout(faceTimer.current);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    stop();
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    const rect = element.getBoundingClientRect();
    const start = position.current ?? { x: rect.left, y: rect.top };
    pointerOffset.current = { x: event.clientX - start.x, y: event.clientY - start.y };
    // The fixed outer button only translates. Expression animations belong
    // to the image, so they cannot distort pointer coordinates or bounds.
    element.style.left = "0px";
    element.style.top = "0px";
    element.style.right = "auto";
    element.style.bottom = "auto";
    paint(start);
    setFree(true);
    setDragging(true);
    draggingRef.current = true;
    setReleased(false);
    setFace("drag");
    lastSample.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    velocity.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const now = performance.now();
    const elapsed = Math.max(now - lastSample.current.time, 1);
    const blend = 1 - Math.exp(-elapsed / 30);
    velocity.current = {
      x: velocity.current.x * (1 - blend) + ((event.clientX - lastSample.current.x) / elapsed) * 1000 * blend,
      y: velocity.current.y * (1 - blend) + ((event.clientY - lastSample.current.y) / elapsed) * 1000 * blend,
    };
    lastSample.current = { x: event.clientX, y: event.clientY, time: now };
    position.current = constrainJam({ x: event.clientX - pointerOffset.current.x, y: event.clientY - pointerOffset.current.y }, bounds());
    if (animationFrame.current === null) animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = null;
      if (position.current) paint(position.current);
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    stop();
    if (position.current) paint(position.current);
    setDragging(false);
    const now = performance.now();
    // A held drag or cancelled touch should settle, not launch an old flick.
    if (event.type === "pointercancel" || event.type === "lostpointercapture" || now - lastSample.current.time > 100) velocity.current = { x: 0, y: 0 };
    const speed = Math.hypot(velocity.current.x, velocity.current.y);
    const limit = Math.min(1, 2200 / (speed || 1));
    velocity.current = { x: velocity.current.x * limit, y: velocity.current.y * limit };
    if (speed < 35) { setReleased(false); setFace("open"); return; }
    setReleased(true);
    setFace("flying");
    let lastTime = now;
    const coast = (time: number) => {
      if (!position.current) return;
      const elapsed = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const next = advanceJam(position.current, velocity.current, bounds(), elapsed);
      velocity.current = next.velocity;
      paint(next.position);
      if (Math.hypot(next.velocity.x, next.velocity.y) > 35) {
        animationFrame.current = requestAnimationFrame(coast);
      } else {
        animationFrame.current = null;
        setReleased(false);
        setFace("idle");
        faceTimer.current = setTimeout(() => setFace("open"), 900);
      }
    };
    animationFrame.current = requestAnimationFrame(coast);
  };

  const handleDoubleClick = () => {
    stop();
    draggingRef.current = false;
    position.current = null;
    velocity.current = { x: 0, y: 0 };
    for (const property of ["left", "top", "right", "bottom", "translate"]) mascot.current?.style.removeProperty(property);
    setFree(false);
    setDragging(false);
    setReleased(false);
    setFace("wink");
    faceTimer.current = setTimeout(() => setFace("open"), 650);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Drag Lil’ Jam to move him. Double-click to return him to the right side."
        ref={mascot}
        className={`jam-mascot ${free ? "is-free" : ""} ${dragging ? "is-dragging" : ""} ${released ? "is-released" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
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
