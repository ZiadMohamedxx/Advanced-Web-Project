import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Briefcase, MapPin, Clock, Building2, Accessibility,
  CheckCircle2, ArrowLeft, Plus, X, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

const disabilityOptions = [
  "Visual Impairment",
  "Hearing Impairment",
  "Mobility / Physical",
  "Cognitive / Learning",
  "Speech Impairment",
  "Chronic Illness",
  "Any Disability",
];

const accommodationOptions = [
  "Screen reader compatible",
  "Wheelchair accessible",
  "Flexible hours",
  "Remote work",
  "Sign language interpreter",
  "Voice-to-text software",
  "Ergonomic workspace",
  "Assistive technology provided",
  "Modified workload",
  "Accessible parking",
];

export default function PostJob() {
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [isLoggedIn, setIsLoggedIn]                     = useState(false);
  const [submitted, setSubmitted]                       = useState(false);
  const [loading, setLoading]                           = useState(false);
  const [skills, setSkills]                             = useState<string[]>([]);
  const [skillInput, setSkillInput]                     = useState("");
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [title, setTitle]           = useState("");
  const [location, setLocation]     = useState("");
  const [workType, setWorkType]     = useState("");
  const [industry, setIndustry]     = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role === "corporate") setIsLoggedIn(true);
    }
  }, []);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const toggleDisability    = (d: string) => setSelectedDisabilities((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  const toggleAccommodation = (a: string) => setSelectedAccommodations((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token    = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description,
          location,
          workType,
          industry,
          requiredSkills:           skills.join(","),
          physicalRequirements:     selectedDisabilities.join(", "),
          disabilityAccommodations: selectedAccommodations.join(", "),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({ title: "Failed to post job", description: data.message || "Something went wrong", variant: "destructive" });
        return;
      }
      setSubmitted(true);
      toast({ title: "Job posted successfully!", description: "Your inclusive job listing is now live." });
    } catch {
      toast({ title: "Server error", description: "Could not connect to backend server", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSkills([]);
    setSkillInput("");
    setSelectedDisabilities([]);
    setSelectedAccommodations([]);
    setTitle("");
    setLocation("");
    setWorkType("");
    setIndustry("");
    setDescription("");
  };

  // ── The actual form JSX (used in both logged-in and blurred states) ──
  const formContent = (
    <Card className="shadow-card">
      <CardHeader>
        <Link to="/employer-portal" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Portal
        </Link>
        <CardTitle className="text-2xl font-bold">Post an Inclusive Job</CardTitle>
        <CardDescription>Define the role, specify disability accommodations, and reach matched candidates.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Role Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Role Details
            </h3>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" placeholder="e.g. Frontend Developer" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="Remote / City" className="pl-10" required value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workType">Work Type</Label>
                <Select value={workType} onValueChange={setWorkType}>
                  <SelectTrigger id="workType"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="industry" placeholder="e.g. Technology" className="pl-10" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" placeholder="Describe the role responsibilities..." rows={4} className="resize-none" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="font-semibold">Required Skills</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Disability Types */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-primary" /> Suitable Disability Types
            </h3>
            <p className="text-sm text-muted-foreground">Select which disability types this role is accessible for.</p>
            <div className="grid grid-cols-2 gap-2">
              {disabilityOptions.map((d) => (
                <label key={d} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                  selectedDisabilities.includes(d) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}>
                  <Checkbox checked={selectedDisabilities.includes(d)} onCheckedChange={() => toggleDisability(d)} />
                  {d}
                </label>
              ))}
            </div>
          </div>

          {/* Accommodations */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Available Accommodations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {accommodationOptions.map((a) => (
                <label key={a} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                  selectedAccommodations.includes(a) ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"
                }`}>
                  <Checkbox checked={selectedAccommodations.includes(a)} onCheckedChange={() => toggleAccommodation(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {loading ? "Publishing..." : "Publish Job Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <AnimatePresence mode="wait">

          {/* ── Success ── */}
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <Card className="shadow-card">
                <CardContent className="p-10 text-center space-y-5">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Job Posted!</h2>
                  <p className="text-muted-foreground">
                    Your inclusive job listing is live. Our AI will start matching candidates based on ability compatibility.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Button variant="outline" onClick={resetForm}>Post Another</Button>
                    <Button onClick={() => navigate("/employer-dashboard")}>View Dashboard</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          ) : isLoggedIn ? (
            /* ── Logged in ── */
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {formContent}
            </motion.div>

          ) : (
            /* ── Not logged in — blurred ── */
            <motion.div key="blur" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none">
                  {formContent}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 border rounded-xl px-8 py-6 text-center shadow-lg max-w-sm w-full mx-4">
                    <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-lg mb-1">Sign in to post a job</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create an employer account to post inclusive job listings.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => navigate("/signup")} className="gap-2 flex-1">Get Started</Button>
                      <Button onClick={() => navigate("/signin")} variant="outline" className="flex-1">Sign In</Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}