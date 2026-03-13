import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api";

type UserType = "candidate" | "corporate" | null;

// ─── OCR helpers ─────────────────────────────────────────────────────────────

const OCR_API_KEY = "K83147064488957";

async function extractTextFromFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apikey", OCR_API_KEY);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (json.IsErroredOnProcessing) {
    throw new Error(json.ErrorMessage?.[0] ?? "OCR failed");
  }

  return json.ParsedResults?.[0]?.ParsedText ?? "";
}

function parseCV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // ── Email ──
  let email = "";
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  for (const line of lines) {
    const m = line.match(emailRegex);
    if (m) {
      email = m[0].trim();
      break;
    }
  }

  // ── Phone ──
  let phone = "";
  const phoneRegex = /(\+?[\d\s\-().]{7,20})/;
  for (const line of lines) {
    if (line.includes("@")) continue;
    const m = line.match(phoneRegex);
    if (m) {
      const digits = m[1].replace(/\D/g, "");
      if (digits.length >= 7) {
        phone = m[1].trim();
        break;
      }
    }
  }

  // ── Name ──
  let firstName = "";
  let lastName = "";
  const nameRegex = /^([A-Za-z]+)\s+([A-Za-z]+)(\s+[A-Za-z]+)?$/;
  for (const line of lines) {
    if (line.includes("@")) continue;
    const m = line.match(nameRegex);
    if (m) {
      firstName = m[1];
      lastName = m[3] ? `${m[2]} ${m[3].trim()}` : m[2];
      break;
    }
  }

  return { firstName, lastName, phone, email };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SignUp() {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [candidateData, setCandidateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [corporateData, setCorporateData] = useState({
    companyName: "",
    contactFirst: "",
    contactLast: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let name = "";
    let email = "";
    let password = "";

    if (userType === "candidate") {
      name = `${candidateData.firstName} ${candidateData.lastName}`.trim();
      email = candidateData.email;
      password = candidateData.password;
    }

    if (userType === "corporate") {
      name = corporateData.companyName.trim();
      email = corporateData.email;
      password = corporateData.password;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Signup failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Account created!",
        description: `Your ${userType} account has been registered successfully.`,
      });

      navigate(userType === "candidate" ? "/candidate-portal" : "/employer-portal");
    } catch {
      toast({
        title: "Server error",
        description: "Could not connect to backend server",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container max-w-lg">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Join InclusiveHire</CardTitle>
                  <CardDescription>How would you like to use the platform?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <button
                    onClick={() => { setUserType("candidate"); setStep(2); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-lg border-2 transition-all hover:shadow-card-hover ${
                      userType === "candidate" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                    aria-label="Sign up as a candidate"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">I'm a Candidate</p>
                      <p className="text-sm text-muted-foreground">Looking for inclusive job opportunities</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                  </button>

                  <button
                    onClick={() => { setUserType("corporate"); setStep(2); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-lg border-2 transition-all hover:shadow-card-hover ${
                      userType === "corporate" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                    aria-label="Sign up as a corporate employer"
                  >
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">I'm a Corporate / Employer</p>
                      <p className="text-sm text-muted-foreground">Hiring talent and building inclusive teams</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <CardTitle className="text-2xl font-bold">
                    {userType === "candidate" ? "Candidate Sign Up" : "Corporate Sign Up"}
                  </CardTitle>
                  <CardDescription>
                    {userType === "candidate"
                      ? "Upload your CV to auto-fill your details"
                      : "Register your company and connect with talented candidates"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {userType === "candidate" ? (
                      <CandidateForm data={candidateData} setData={setCandidateData} />
                    ) : (
                      <CorporateForm data={corporateData} setData={setCorporateData} />
                    )}

                    <div className="flex items-start gap-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm leading-snug text-muted-foreground">
                        I agree to the{" "}
                        <span className="text-primary underline cursor-pointer">Terms of Service</span> and{" "}
                        <span className="text-primary underline cursor-pointer">Privacy Policy</span>
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                      <CheckCircle2 className="h-4 w-4" />
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Candidate Form ───────────────────────────────────────────────────────────

function CandidateForm({
  data,
  setData,
}: {
  data: { firstName: string; lastName: string; email: string; password: string; phone: string };
  setData: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string; password: string; phone: string }>>;
}) {
  const [ocrLoading, setOcrLoading] = useState(false);
  const { toast } = useToast();

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    toast({ title: "Reading your CV…", description: "Extracting your details, please wait." });

    try {
      const rawText = await extractTextFromFile(file);
      const { firstName, lastName, phone, email } = parseCV(rawText);

      setData((prev) => ({
        ...prev,
        ...(firstName && { firstName }),
        ...(lastName  && { lastName }),
        ...(phone     && { phone }),
        ...(email     && { email }),
      }));

      toast({
        title: "CV scanned ✓",
        description: "Fields filled in — please review and add your password.",
      });
    } catch (err) {
      toast({
        title: "OCR failed",
        description: (err as Error).message ?? "Could not read the CV. Fill in manually.",
        variant: "destructive",
      });
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <>
      {/* ── CV Upload ── */}
      <div className="space-y-2">
        <Label htmlFor="cv">Upload CV</Label>
        <div className="relative">
          <Input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="cursor-pointer"
            onChange={handleCVUpload}
            disabled={ocrLoading}
          />
          {ocrLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-md">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-primary font-medium">Scanning CV…</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Accepted: PDF, DOC, DOCX, PNG, JPG (max 10 MB) · Fields will be auto-filled from your CV
        </p>
      </div>

      {/* ── Name ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            required
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            required
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
          />
        </div>
      </div>

      {/* ── Email ── */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>

      {/* ── Password (never auto-filled for security) ── */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>

      {/* ── Phone ── */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
      </div>

      {/* ── Disability ── */}
      <div className="space-y-2">
        <Label htmlFor="disability">Disability Type</Label>
        <Select>
          <SelectTrigger id="disability">
            <SelectValue placeholder="Select disability type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">Visual Impairment</SelectItem>
            <SelectItem value="hearing">Hearing Impairment</SelectItem>
            <SelectItem value="mobility">Mobility / Physical</SelectItem>
            <SelectItem value="cognitive">Cognitive / Learning</SelectItem>
            <SelectItem value="speech">Speech Impairment</SelectItem>
            <SelectItem value="chronic">Chronic Illness</SelectItem>
            <SelectItem value="multiple">Multiple Disabilities</SelectItem>
            <SelectItem value="prefer-not">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Accommodations ── */}
      <div className="space-y-2">
        <Label>Preferred Accommodations</Label>
        <Textarea
          placeholder="e.g. Screen reader support, flexible hours, remote work…"
          className="resize-none"
          rows={3}
        />
      </div>
    </>
  );
}

// ─── Corporate Form ───────────────────────────────────────────────────────────

function CorporateForm({
  data,
  setData,
}: {
  data: { companyName: string; contactFirst: string; contactLast: string; email: string; password: string; phone: string };
  setData: React.Dispatch<React.SetStateAction<{ companyName: string; contactFirst: string; contactLast: string; email: string; password: string; phone: string }>>;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" placeholder="Acme Inc." required value={data.companyName}
          onChange={(e) => setData({ ...data, companyName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactFirst">Contact First Name</Label>
          <Input id="contactFirst" placeholder="Jane" required value={data.contactFirst}
            onChange={(e) => setData({ ...data, contactFirst: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactLast">Contact Last Name</Label>
          <Input id="contactLast" placeholder="Smith" required value={data.contactLast}
            onChange={(e) => setData({ ...data, contactLast: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="corpEmail">Work Email</Label>
        <Input id="corpEmail" type="email" placeholder="jane@acme.com" required value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="corpPassword">Password</Label>
        <Input id="corpPassword" type="password" placeholder="••••••••" required value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select>
          <SelectTrigger id="industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="nonprofit">Non-Profit</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="companySize">Company Size</Label>
        <Select>
          <SelectTrigger id="companySize"><SelectValue placeholder="Select company size" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1–10 employees</SelectItem>
            <SelectItem value="11-50">11–50 employees</SelectItem>
            <SelectItem value="51-200">51–200 employees</SelectItem>
            <SelectItem value="201-500">201–500 employees</SelectItem>
            <SelectItem value="500+">500+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="corpPhone">Phone Number</Label>
        <Input id="corpPhone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })} />
      </div>
    </>
  );
}