import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Accessibility, Sun, Moon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  profileImage?: string;
};

const guestLinks = [
  { label: "Home",          to: "/" },
  { label: "Find Jobs",     to: "/jobs" },
  { label: "Candidates",    to: "/candidate-portal" },
  { label: "Employers",     to: "/employer-portal" },
  { label: "Accessibility", to: "/accessibility" },
  { label: "About",         to: "/about" },
];

const candidateLinks = [
  { label: "Home",       to: "/jobs" },           // ✅ Find Jobs renamed to Home
  { label: "Candidates", to: "/candidate-portal" },
  { label: "About",      to: "/about" },
];

const corporateLinks = [
  { label: "Home",      to: "/employer-portal" }, // ✅ Employers renamed to Home
  { label: "About",     to: "/about" },
];

export default function Navbar() {
  const [open, setOpen]                 = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [user, setUser]                 = useState<StoredUser | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const profileImageUrl =
    user?.profileImage && user.profileImage.trim() !== ""
      ? `${API_BASE_URL}/${user.profileImage.replace(/\\/g, "/")}`
      : "";

  const navLinks =
    user?.role === "candidate" ? candidateLinks :
    user?.role === "corporate" ? corporateLinks :
    guestLinks;

  const portalLink =
  user?.role === "corporate"
    ? { label: user.companyName || user.name || "My Company", to: "/employer-portal", icon: Building2 }
    : null;
  return (
    <nav
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl" aria-label="InclusiveHire home">
          <Accessibility className="h-7 w-7 text-primary" aria-hidden="true" />
          <span className="text-gradient">InclusiveHire</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary ${
                location.pathname === link.to ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleContrast} aria-label="Toggle high contrast mode">
            {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <>
              {portalLink && (
                <Button variant="outline" size="sm" className="gap-2 max-w-[160px] truncate" onClick={() => navigate(portalLink.to)}>
                  <portalLink.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{portalLink.label}</span>
                </Button>
              )}

              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:bg-secondary transition-colors"
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/signin"><Button variant="outline" size="sm">Sign In</Button></Link>
              <Link to="/signup"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === link.to ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user && portalLink && (
            <Link to={portalLink.to} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/5">
              <portalLink.icon className="h-4 w-4" />
              {portalLink.label}
            </Link>
          )}

          {user ? (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => { navigate("/profile"); setOpen(false); }}
                className="w-full flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-secondary"
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={toggleContrast}>
                {highContrast ? "Standard" : "High Contrast"}
              </Button>
              <Link to="/signup" className="flex-1">
                <Button size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}