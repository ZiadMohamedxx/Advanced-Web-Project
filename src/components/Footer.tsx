import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Find Jobs", to: "/jobs" },
      { label: "Candidate Portal", to: "/candidate-portal" },
      { label: "Employer Portal", to: "/employer-portal" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Accessibility", to: "/accessibility" },
      { label: "About Us", to: "/about" },
      { label: "AI Features", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/" },
      { label: "Contact Us", to: "/" },
      { label: "Privacy Policy", to: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50" role="contentinfo">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Accessibility className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-gradient">InclusiveHire</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering people with disabilities to find meaningful careers through AI-driven matching and accessibility-first design.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} InclusiveHire. Built with accessibility at its core.
        </div>
      </div>
    </footer>
  );
}
