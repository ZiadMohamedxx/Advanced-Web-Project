import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Home,
  Loader2,
  MapPin,
  Sparkles,
  XCircle,
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Candidate = {
  id: string;
  name?: string;
  email?: string;
  disabilityType?: string;
};

type MatchingJob = {
  jobId: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  matchScore: number;
  matchReasons: string[];
  accessibilityReasons: string[];
  matchedSkills: string[];
  missingSkills: string[];
  canApplyNow: boolean;
};

export default function MatchingJobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const state = location.state as {
    matchingJobs?: MatchingJob[];
    candidate?: Candidate;
  } | null;

  const matchingJobs = useMemo<MatchingJob[]>(() => {
    if (state?.matchingJobs) return state.matchingJobs;

    try {
      return JSON.parse(localStorage.getItem("matchingJobs") || "[]");
    } catch {
      return [];
    }
  }, [state]);

  const candidate = useMemo<Candidate | null>(() => {
    if (state?.candidate) return state.candidate;

    try {
      return JSON.parse(localStorage.getItem("matchingCandidate") || "null");
    } catch {
      return null;
    }
  }, [state]);

  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleApply = async (job: MatchingJob) => {
    if (!candidate?.id) {
      toast({
        title: "Unable to apply",
        description: "Candidate data was not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingJobId(job.jobId);

      const response = await fetch(`${API_BASE_URL}/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId: candidate.id,
          jobId: job.jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Application failed",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAppliedJobs((prev) => [...prev, job.jobId]);

      toast({
        title: "Application submitted",
        description: `You applied for ${job.title}. Real match score: ${
          data.matchScore ?? job.matchScore
        }%.`,
      });
    } catch {
      toast({
        title: "Server error",
        description: "Could not submit your application right now.",
        variant: "destructive",
      });
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="shadow-card border-primary/10 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>

              <CardTitle className="text-3xl font-bold">
                Recommended Jobs For You
              </CardTitle>

              <CardDescription className="text-base max-w-2xl mx-auto">
                These jobs are recommended based on your CV, extracted skills,
                experience, education, and accessibility preferences.
              </CardDescription>

              <div className="flex justify-center pt-2">
                <Button variant="outline" className="gap-2" onClick={handleSkip}>
                  <Home className="h-4 w-4" />
                  Skip
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {matchingJobs.length === 0 ? (
          <Card className="mt-8 shadow-card">
            <CardContent className="py-12 text-center space-y-5">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  No matching jobs found right now.
                </h2>
                <p className="text-muted-foreground mt-2">
                  You can continue to the home page and browse all jobs manually.
                </p>
              </div>

              <Button onClick={handleSkip} className="gap-2">
                Continue to Home
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 mt-8">
            {matchingJobs.map((job, index) => {
              const isApplied = appliedJobs.includes(job.jobId);
              const isLoading = loadingJobId === job.jobId;

              return (
                <motion.div
                  key={job.jobId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <Card className="shadow-card hover:shadow-card-hover transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div>
                              <h2 className="text-2xl font-bold text-foreground">
                                {job.title}
                              </h2>

                              <p className="text-muted-foreground font-medium">
                                {job.companyName}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="secondary" className="gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </Badge>

                                <Badge variant="outline">{job.jobType}</Badge>
                              </div>
                            </div>

                            <div className="rounded-2xl border bg-primary/5 px-5 py-3 text-center min-w-[120px]">
                              <p className="text-3xl font-bold text-primary">
                                {job.matchScore}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Match
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-card p-4">
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Matched Skills
                              </h3>

                              {job.matchedSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {job.matchedSkills.map((skill) => (
                                    <Badge key={skill}>{skill}</Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No direct skill match found.
                                </p>
                              )}
                            </div>

                            <div className="rounded-lg border bg-card p-4">
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                Missing Skills
                              </h3>

                              {job.missingSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {job.missingSkills.map((skill) => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No missing skills detected.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-muted/30 p-4">
                              <h3 className="font-semibold mb-2">
                                Match Reasons
                              </h3>

                              {job.matchReasons.length > 0 ? (
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                  {job.matchReasons.map((reason) => (
                                    <li key={reason}>• {reason}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  This role has general compatibility with your
                                  profile.
                                </p>
                              )}
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                              <h3 className="font-semibold mb-2">
                                Accessibility Reasons
                              </h3>

                              {job.accessibilityReasons.length > 0 ? (
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                  {job.accessibilityReasons.map((reason) => (
                                    <li key={reason}>• {reason}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No specific accessibility notes were found.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-44 flex lg:flex-col gap-3">
                          <Button
                            className="w-full gap-2"
                            disabled={isApplied || isLoading}
                            onClick={() => handleApply(job)}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Applying
                              </>
                            ) : isApplied ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Applied
                              </>
                            ) : (
                              <>
                                Apply Now
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate(`/apply/${job.jobId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}