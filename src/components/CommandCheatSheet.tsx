import { useEffect, useState } from "react";
import { X, Copy } from "lucide-react";
import { getAvailableCommands } from "@/voice/exactCommandMatcher";

type CommandGroup = keyof ReturnType<typeof getAvailableCommands>;

const groupLabels: Record<CommandGroup, string> = {
  navigation: "🧭 Navigation",
  search: "🔍 Search Jobs",
  scrolling: "📜 Scrolling",
  accessibility: "♿ Accessibility",
  reading: "📖 Reading",
  utility: "⚙️ Utility",
};

// Command aliases for reference
const commandExamples: Record<string, string[]> = {
  "open jobs": ["go to jobs", "jobs page"],
  "go home": ["open home", "home page"],
  "open profile": ["go to profile"],
  "افتح الوظايف": ["روح للوظايف"],
  "روح للرئيسية": ["افتح الصفحة الرئيسية"],
  "افتح البروفايل": ["روح للبروفايل"],
  "scroll down": ["scroll"],
  "scroll up": [],
  "انزل تحت": ["انزل"],
  "اطلع فوق": ["اطلع"],
  "read this page": ["read page", "start reading"],
  "اقرأ الصفحة": ["اقرا الصفحة"],
  "stop reading": ["pause reading"],
  "dark mode on": ["enable dark mode"],
  "شغل الوضع الليلي": [],
  "search frontend jobs": ["find frontend"],
  "دور على وظائف فرونت اند": [],
  "refresh page": ["reload"],
  "اعمل ريفريش": [],
};

export default function CommandCheatSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const commands = getAvailableCommands();

  useEffect(() => {
    const handleOpenCheatSheet = () => setIsOpen(true);
    window.addEventListener("openCommandCheatSheet", handleOpenCheatSheet);
    return () => window.removeEventListener("openCommandCheatSheet", handleOpenCheatSheet);
  }, []);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
        <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4 z-10">
            <h2 className="text-2xl font-bold text-foreground">🎙️ Voice Commands</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {(Object.entries(commands) as [CommandGroup, string[]][]).map(
              ([group, items]) => (
                <div key={group}>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {groupLabels[group]}
                  </h3>
                  <div className="space-y-2">
                    {items.map((command) => {
                      const aliases = commandExamples[command] || [];
                      return (
                        <div
                          key={command}
                          className="rounded-lg border border-border/50 bg-muted/20 p-3 hover:bg-muted/30 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => copyCommand(command)}
                                className="flex items-center gap-2 group hover:opacity-80 transition"
                                title="Copy command"
                              >
                                <span className="font-mono text-sm font-semibold text-primary break-words">
                                  "{command}"
                                </span>
                                <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0" />
                              </button>
                              {aliases.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Also try: {aliases.map((a) => `"${a}"`).join(", ")}
                                </p>
                              )}
                            </div>
                            {copied === command && (
                              <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                                ✓ Copied
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {/* Help Text */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 mt-6">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">💡 Tips:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Say commands naturally – punctuation and capitalization don't matter</li>
                  <li>Click any command to copy it</li>
                  <li>Try aliases if a command doesn't work (they all do the same thing)</li>
                  <li>Speak clearly and at normal volume</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
