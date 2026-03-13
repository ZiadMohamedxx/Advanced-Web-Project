import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User, Mail, Phone, FileText, CheckCircle2, Briefcase,
  Building2, MapPin, ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const jobs = [
  { id: 1, title: "Frontend Developer", company: "TechInclusive Co.", location: "Remote", type: "Full-time" },
  { id: 2, title: "Data Analyst", company: "AccessFirst Inc.", location: "New York, NY", type: "Full-time" },
  { id: 3, title: "Content Writer", company: "Words4All", location: "Remote", type: "Part-time" },
  { id: 4, title: "Customer Support Specialist", company: "HelpDesk Pro", location: "Chicago, IL", type: "Full-time" },
  { id: 5, title: "UX Researcher", company: "DesignForAll Studio", location: "Remote", type: "Contract" },
];

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const job = jobs.find((j) => j.id === Number(jobId));

  // Simulated candidate data (would come from auth/profile in real app)
  const [candidateInfo] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000",
    cvName: "John_Doe_CV.pdf",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Application submitted!",
      description: `You've applied for ${job?.title} at ${job?.company}.`,
    });
  };

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">Job not found.</p>
            <Link to="/jobs"><Button variant="outline">Back to Jobs</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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

                  {/* Job info */}
                  <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-secondary/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{job.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">{job.type}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" defaultValue={candidateInfo.name} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applyEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="applyEmail" type="email" defaultValue={candidateInfo.email} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applyPhone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="applyPhone" type="tel" defaultValue={candidateInfo.phone} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Your CV</Label>
                      <div className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{cvFile ? cvFile.name : candidateInfo.cvName}</p>
                          <p className="text-xs text-muted-foreground">Uploaded during registration</p>
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-xs text-primary hover:underline">Change</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                          />
                        </label>
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
                    Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been submitted successfully. We'll notify you once the employer reviews your profile.
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
