import { Button } from "@/components/ui/button";
import { Accessibility, X } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useRef, useState, useEffect } from "react";

export default function AccessibilityButton() {
  const { isOpen, setIsOpen } = useAccessibility();

  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; bx: number; by: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { mx: e.clientX, my: e.clientY, bx: pos.x, by: pos.y };
    moved.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    const x = Math.min(Math.max(dragStart.current.bx + dx, 0), window.innerWidth - 56);
    const y = Math.min(Math.max(dragStart.current.by + dy, 0), window.innerHeight - 56);
    setPos({ x, y });
  };

  const onPointerUp = () => {
    dragStart.current = null;
    setDragging(false);
  };

  const handleClick = () => {
    if (!moved.current) setIsOpen(!isOpen);
  };

  return (
    <Button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handleClick}
      style={{ left: pos.x, top: pos.y, cursor: dragging ? "grabbing" : "grab" }}
      className="fixed z-[9999] h-14 w-14 rounded-full shadow-xl select-none touch-none"
      size="icon"
      aria-label={isOpen ? "Close accessibility tools" : "Open accessibility tools"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
    </Button>
  );
}