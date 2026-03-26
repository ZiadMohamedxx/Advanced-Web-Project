import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Briefcase,
  Building2,
  MapPin,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

type Job = {
  _id: string;
  title: string;
  location: string;
  workType: string;
  employer?: {
    name?: string;
    companyName?: string;
  };
};

type CandidateInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cvPath?: string;
};

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/signin");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    const fetchData = async () => {
      try {
        const [jobResponse, profileResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/auth/profile/${parsedUser.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const jobData = await jobResponse.json();
        const profileData = await profileResponse.json();

        if (!jobResponse.ok) {
          throw new Error(jobData.message || "Failed to load job");
        }

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Failed to load profile");
        }

        setJob(jobData.job);
        setCandidateInfo({
          id: profileData._id || profileData.id,
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          cvPath: profileData.cvPath || "",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Could not load application data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to apply");
      }

      setSubmitted(true);

      toast({
        title: "Application submitted!",
        description: data.message,
      });
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">Job not found.</p>
            <Link to="/jobs">
              <Button variant="outline">Back to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!candidateInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">Candidate profile not found.</p>
            <Link to="/profile">
              <Button variant="outline">Go to Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const companyName = job.employer?.companyName || job.employer?.name || "Company";
  const cvFileName =
    cvFile?.name ||
    (candidateInfo.cvPath ? candidateInfo.cvPath.split("/").pop()?.split("\\").pop() : "") ||
    "No CV uploaded";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container max-w-lg">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <Link
                    to="/jobs"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Jobs
                  </Link>
                  <CardTitle className="text-2xl font-bold">Apply for Position</CardTitle>
                  <CardDescription>Confirm your details to submit your application</CardDescription>

                  <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-secondary/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{job.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {job.workType}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={candidateInfo.name}
                          className="pl-10"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applyEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="applyEmail"
                          type="email"
                          value={candidateInfo.email}
                          className="pl-10"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applyPhone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="applyPhone"
                          type="tel"
                          value={candidateInfo.phone}
                          className="pl-10"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
  <Label>Your CV</Label>

  <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center gap-3">
    <FileText className="h-5 w-5 text-primary shrink-0" />

    <div className="flex-1">
      <p className="text-sm font-medium">{cvFileName}</p>
      <p className="text-xs text-muted-foreground">
        {candidateInfo.cvPath
          ? "This CV will be used for this application"
          : "No CV uploaded in profile"}
      </p>
    </div>

    {candidateInfo.cvPath && (
     <a
  href={`${API_BASE_URL}/${candidateInfo.cvPath.replace(/\\/g, "/")}`}
  target="_blank"
  rel="noreferrer"
>
  <Button type="button" variant="outline" size="sm">
    View
  </Button>
</a>
    )}
  </div>
</div>

                    <Button type="submit" size="lg" className="w-full gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Confirm & Apply
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-10 text-center space-y-5">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Application Submitted!</h2>
                  <p className="text-muted-foreground">
                    Your application for <strong>{job.title}</strong> at <strong>{companyName}</strong> has been submitted successfully.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Link to="/jobs">
                      <Button variant="outline">Browse More Jobs</Button>
                    </Link>
                    <Link to="/candidate-portal">
                      <Button>My Portal</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}