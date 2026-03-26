import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Accessibility,
  Filter,
  Briefcase,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type Job = {
  _id: string;
  title: string;
  description: string;
  location: string;
  workType: "remote" | "onsite" | "hybrid";
  requiredSkills: string[];
  disabilityAccommodations: string;
  industry: string;
  status: "open" | "closed";
  createdAt: string;
  employer?: {
    name?: string;
    companyName?: string;
    industry?: string;
  };
};

function getPostedText(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = now - created;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes || 1} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return `${days || 1} day${days === 1 ? "" : "s"} ago`;
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in to view available jobs.");
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load jobs");
        }

        setJobs(data.jobs || []);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = search.toLowerCase();

      const companyName = job.employer?.companyName || job.employer?.name || "";
      const accommodations = job.disabilityAccommodations || "";

      return (
        job.title.toLowerCase().includes(keyword) ||
        companyName.toLowerCase().includes(keyword) ||
        job.requiredSkills.some((skill) => skill.toLowerCase().includes(keyword)) ||
        accommodations.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.industry.toLowerCase().includes(keyword)
      );
    });
  }, [jobs, search]);

  return (
    <div>
      <section className="relative overflow-hidden" aria-labelledby="jobs-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 id="jobs-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Find <span className="text-gradient">Inclusive Jobs</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse real job listings posted by employers on the platform.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, skill, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                aria-label="Search jobs"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-12" aria-label="Job listings">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{filtered.length} jobs found</p>
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Filter className="h-3.5 w-3.5" /> Filters
          </Button>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="shadow-card">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate("/signin")}>Sign In</Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">No jobs match your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((job, i) => {
              const companyName = job.employer?.companyName || job.employer?.name || "Unknown Company";

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="shadow-card hover:shadow-card-hover transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>

                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" /> {companyName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" /> {job.location || "Remote"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" /> {job.workType}
                                </span>
                              </div>

                              {job.description && (
                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                  {job.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {job.requiredSkills?.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              {job.disabilityAccommodations && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {job.disabilityAccommodations
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter(Boolean)
                                    .map((accommodation) => (
                                      <span
                                        key={accommodation}
                                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                                      >
                                        <Accessibility className="h-3 w-3" /> {accommodation}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                          <p className="text-xs text-muted-foreground">{getPostedText(job.createdAt)}</p>
                          <Link to={`/apply/${job._id}`}>
                            <Button size="sm">Apply Now</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}