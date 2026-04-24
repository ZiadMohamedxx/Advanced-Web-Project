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
import { useLanguage } from "@/contexts/LanguageContext";

type UserType = "candidate" | "corporate" | null;

// ─── OCR helpers ─────────────────────────────────────────────────────────────

async function extractTextFromFile(file: File): Promise<string> {
  // ✅ FIXED: Call our own backend proxy instead of OCR.space directly
  //    (direct browser → OCR.space calls are blocked by CORS)
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/ocr`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`OCR proxy error: ${res.status}`);
  }

  const json = await res.json();

  if (json.IsErroredOnProcessing) {
    throw new Error(json.ErrorMessage?.[0] ?? "OCR failed");
  }

  return json.ParsedResults?.[0]?.ParsedText ?? "";
}

function parseCV(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let email = "";
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  for (const line of lines) {
    const m = line.match(emailRegex);
    if (m) { email = m[0].trim(); break; }
  }

  let phone = "";
  const phoneRegex = /(\+?[\d\s\-().]{7,20})/;
  for (const line of lines) {
    if (line.includes("@")) continue;
    const m = line.match(phoneRegex);
    if (m) {
      const digits = m[1].replace(/\D/g, "");
      if (digits.length >= 7) { phone = m[1].trim(); break; }
    }
  }

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

export default function SignUp() {
  const { t } = useLanguage();
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [candidateData, setCandidateData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", disabilityType: "", preferredAccommodations: "", cv: null as File | null,
  });

  const [corporateData, setCorporateData] = useState({
    companyName: "", contactFirst: "", contactLast: "",
    email: "", password: "", phone: "", industry: "", companySize: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      if (userType === "candidate") {
        formData.append("role", "candidate");
        formData.append("name", `${candidateData.firstName} ${candidateData.lastName}`.trim());
        formData.append("email", candidateData.email);
        formData.append("password", candidateData.password);
        formData.append("phone", candidateData.phone);
        formData.append("disabilityType", candidateData.disabilityType);
        formData.append("preferredAccommodations", candidateData.preferredAccommodations);
        if (candidateData.cv) formData.append("cv", candidateData.cv);
      }

      if (userType === "corporate") {
        formData.append("role", "corporate");
        formData.append("name", corporateData.companyName);
        formData.append("email", corporateData.email);
        formData.append("password", corporateData.password);
        formData.append("phone", corporateData.phone);
        formData.append("companyName", corporateData.companyName);
        formData.append("contactFirstName", corporateData.contactFirst);
        formData.append("contactLastName", corporateData.contactLast);
        formData.append("industry", corporateData.industry);
        formData.append("companySize", corporateData.companySize);
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: t("signUp.signupFailed"), description: data.message || t("signUp.somethingWrong"), variant: "destructive" });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: t("signUp.accountCreated"),
        description: t("signUp.accountCreatedDesc").replace("{type}", userType ?? ""),
      });

      navigate(userType === "candidate" ? "/candidate-portal" : "/employer-portal");
    } catch {
      toast({ title: t("signUp.serverError"), description: t("signUp.serverErrorDesc"), variant: "destructive" });
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
                  <CardTitle className="text-2xl font-bold">{t("signUp.joinTitle")}</CardTitle>
                  <CardDescription>{t("signUp.joinDesc")}</CardDescription>
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
                      <p className="font-semibold text-foreground">{t("signUp.iAmCandidate")}</p>
                      <p className="text-sm text-muted-foreground">{t("signUp.candidateDesc")}</p>
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
                      <p className="font-semibold text-foreground">{t("signUp.iAmCorporate")}</p>
                      <p className="text-sm text-muted-foreground">{t("signUp.corporateDesc")}</p>
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
                    <ArrowLeft className="h-4 w-4" /> {t("signUp.back")}
                  </button>
                  <CardTitle className="text-2xl font-bold">
                    {userType === "candidate" ? t("signUp.candidateSignUp") : t("signUp.corporateSignUp")}
                  </CardTitle>
                  <CardDescription>
                    {userType === "candidate" ? t("signUp.candidateSubDesc") : t("signUp.corporateSubDesc")}
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
                        {t("signUp.agreeTerms")}{" "}
                        <span className="text-primary underline cursor-pointer">{t("signUp.termsOfService")}</span>{" "}
                        {t("signUp.and")}{" "}
                        <span className="text-primary underline cursor-pointer">{t("signUp.privacyPolicy")}</span>
                      </Label>
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                      <CheckCircle2 className="h-4 w-4" />
                      {loading ? t("signUp.creatingAccount") : t("signUp.createAccount")}
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
  data, setData,
}: {
  data: {
    firstName: string; lastName: string; email: string; password: string;
    phone: string; disabilityType: string; preferredAccommodations: string; cv: File | null;
  };
  setData: React.Dispatch<React.SetStateAction<{
    firstName: string; lastName: string; email: string; password: string;
    phone: string; disabilityType: string; preferredAccommodations: string; cv: File | null;
  }>>;
}) {
  const { t } = useLanguage();
  const [ocrLoading, setOcrLoading] = useState(false);
  const { toast } = useToast();

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setData((prev) => ({ ...prev, cv: file }));

    const ocrSupported = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!ocrSupported.includes(file.type)) return;

    setOcrLoading(true);
    toast({ title: t("signUp.readingCV"), description: t("signUp.extractingDetails") });

    try {
      const rawText = await extractTextFromFile(file);
      const { firstName, lastName, phone, email } = parseCV(rawText);

      setData((prev) => ({
        ...prev, cv: file,
        ...(firstName && { firstName }),
        ...(lastName  && { lastName }),
        ...(phone     && { phone }),
        ...(email     && { email }),
      }));

      toast({ title: t("signUp.cvScanned"), description: t("signUp.cvScannedDesc") });
    } catch (err) {
      toast({
        title: t("signUp.ocrFailed"),
        description: (err as Error).message ?? t("signUp.fillManually"),
        variant: "destructive",
      });
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cv">{t("signUp.uploadCV")}</Label>
        <div className="relative">
          <Input
            id="cv" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="cursor-pointer" onChange={handleCVUpload} disabled={ocrLoading}
          />
          {ocrLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-md">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-primary font-medium">{t("signUp.scanningCV")}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t("signUp.cvHint")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("signUp.firstName")}</Label>
          <Input id="firstName" placeholder="John" required value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("signUp.lastName")}</Label>
          <Input id="lastName" placeholder="Doe" required value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("signUp.email")}</Label>
        <Input id="email" type="email" placeholder="john@example.com" required value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("signUp.password")}</Label>
        <Input id="password" type="password" placeholder="••••••••" required value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("signUp.phone")}</Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disability">{t("signUp.disabilityType")}</Label>
        <Select value={data.disabilityType} onValueChange={(value) => setData({ ...data, disabilityType: value })}>
          <SelectTrigger id="disability">
            <SelectValue placeholder={t("signUp.selectDisability")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">{t("signUp.visual")}</SelectItem>
            <SelectItem value="hearing">{t("signUp.hearing")}</SelectItem>
            <SelectItem value="mobility">{t("signUp.mobility")}</SelectItem>
            <SelectItem value="cognitive">{t("signUp.cognitive")}</SelectItem>
            <SelectItem value="speech">{t("signUp.speech")}</SelectItem>
            <SelectItem value="chronic">{t("signUp.chronic")}</SelectItem>
            <SelectItem value="multiple">{t("signUp.multiple")}</SelectItem>
            <SelectItem value="prefer-not">{t("signUp.preferNot")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("signUp.preferredAccommodations")}</Label>
        <Textarea
          placeholder={t("signUp.accommodationsPlaceholder")}
          className="resize-none" rows={3}
          value={data.preferredAccommodations}
          onChange={(e) => setData({ ...data, preferredAccommodations: e.target.value })}
        />
      </div>
    </>
  );
}

// ─── Corporate Form ───────────────────────────────────────────────────────────

function CorporateForm({
  data, setData,
}: {
  data: {
    companyName: string; contactFirst: string; contactLast: string;
    email: string; password: string; phone: string; industry: string; companySize: string;
  };
  setData: React.Dispatch<React.SetStateAction<{
    companyName: string; contactFirst: string; contactLast: string;
    email: string; password: string; phone: string; industry: string; companySize: string;
  }>>;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">{t("signUp.companyName")}</Label>
        <Input id="companyName" placeholder="Acme Inc." required value={data.companyName}
          onChange={(e) => setData({ ...data, companyName: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactFirst">{t("signUp.contactFirstName")}</Label>
          <Input id="contactFirst" placeholder="Jane" required value={data.contactFirst}
            onChange={(e) => setData({ ...data, contactFirst: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactLast">{t("signUp.contactLastName")}</Label>
          <Input id="contactLast" placeholder="Smith" required value={data.contactLast}
            onChange={(e) => setData({ ...data, contactLast: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="corpEmail">{t("signUp.workEmail")}</Label>
        <Input id="corpEmail" type="email" placeholder="jane@acme.com" required value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="corpPassword">{t("signUp.password")}</Label>
        <Input id="corpPassword" type="password" placeholder="••••••••" required value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">{t("signUp.industry")}</Label>
        <Select value={data.industry} onValueChange={(value) => setData({ ...data, industry: value })}>
          <SelectTrigger id="industry">
            <SelectValue placeholder={t("signUp.selectIndustry")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">{t("signUp.tech")}</SelectItem>
            <SelectItem value="healthcare">{t("signUp.healthcare")}</SelectItem>
            <SelectItem value="finance">{t("signUp.finance")}</SelectItem>
            <SelectItem value="education">{t("signUp.education")}</SelectItem>
            <SelectItem value="retail">{t("signUp.retail")}</SelectItem>
            <SelectItem value="manufacturing">{t("signUp.manufacturing")}</SelectItem>
            <SelectItem value="government">{t("signUp.government")}</SelectItem>
            <SelectItem value="nonprofit">{t("signUp.nonprofit")}</SelectItem>
            <SelectItem value="other">{t("signUp.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySize">{t("signUp.companySize")}</Label>
        <Select value={data.companySize} onValueChange={(value) => setData({ ...data, companySize: value })}>
          <SelectTrigger id="companySize">
            <SelectValue placeholder={t("signUp.selectCompanySize")} />
          </SelectTrigger>
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
        <Label htmlFor="corpPhone">{t("signUp.phone")}</Label>
        <Input id="corpPhone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })} />
      </div>
    </>
  );
}