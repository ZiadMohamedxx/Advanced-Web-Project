import { Button } from "@/components/ui/button";
import { Accessibility, X } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";

export default function AccessibilityButton() {
  const { isOpen, setIsOpen } = useAccessibility();

  return (
    <Button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full shadow-xl"
      size="icon"
      aria-label={isOpen ? "Close accessibility tools" : "Open accessibility tools"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
    </Button>
  );
}