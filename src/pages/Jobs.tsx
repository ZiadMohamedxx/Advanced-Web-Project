import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Accessibility,
  Filter,
  Briefcase,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

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

  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  matchReasons?: string[];
  accessibilityReasons?: string[];
};

function getPostedText(
  createdAt: string,
  t: (key: string) => string,
  language: string
) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = now - created;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (language === "ar") {
    if (minutes < 60) {
      const m = minutes || 1;
      return `منذ ${m} ${m === 1 ? "دقيقة" : "دقائق"}`;
    }

    if (hours < 24) {
      return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
    }

    const d = days || 1;
    return `منذ ${d} ${d === 1 ? "يوم" : "أيام"}`;
  }

  if (minutes < 60) {
    return `${minutes || 1} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return `${days || 1} day${days === 1 ? "" : "s"} ago`;
}

function getWorkTypeText(
  workType: "remote" | "onsite" | "hybrid",
  t: (key: string) => string,
  language: string
) {
  if (workType === "remote") return t("jobs.remote");
  if (workType === "onsite") return language === "ar" ? "في المكتب" : "Onsite";
  return language === "ar" ? "هجين" : "Hybrid";
}

function getScoreStyle(score?: number) {
  if (!score) return "border-border bg-muted/30 text-muted-foreground";
  if (score >= 80) return "border-primary/30 bg-primary/10 text-primary";
  if (score >= 50) return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700";
  return "border-muted bg-muted/50 text-muted-foreground";
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hasMatchData, setHasMatchData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError(t("signIn.title"));
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/jobs/matches/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("jobs.error"));
        }

        setJobs(data.jobs || []);
        setHasMatchData(Boolean(data.hasMatchData));
      } catch (err: any) {
        setError(err.message || t("jobs.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [t]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = search.toLowerCase();
      const companyName = job.employer?.companyName || job.employer?.name || "";
      const accommodations = job.disabilityAccommodations || "";
      const matchedSkills = job.matchedSkills || [];
      const missingSkills = job.missingSkills || [];

      return (
        job.title.toLowerCase().includes(keyword) ||
        companyName.toLowerCase().includes(keyword) ||
        job.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(keyword)
        ) ||
        matchedSkills.some((skill) => skill.toLowerCase().includes(keyword)) ||
        missingSkills.some((skill) => skill.toLowerCase().includes(keyword)) ||
        accommodations.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.industry.toLowerCase().includes(keyword)
      );
    });
  }, [jobs, search]);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="jobs-heading"
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />

        <div className="container py-16 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1
              id="jobs-heading"
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            >
              {t("jobs.title").split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient">
                {t("jobs.title").split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-4">
              {t("jobs.description")}
            </p>

            {hasMatchData && (
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 text-primary px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI match percentages are based on your uploaded CV
              </div>
            )}

            <div className="relative max-w-lg mx-auto">
              <Search
                className={`absolute ${
                  language === "ar" ? "right-3" : "left-3"
                } top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
              />

              <Input
                placeholder={t("jobs.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={language === "ar" ? "pr-10 text-right" : "pl-10"}
                aria-label={t("common.search")}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Listings Section ── */}
      <section className="container py-12" aria-label={t("jobs.title")}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {language === "ar"
              ? `${filtered.length} وظيفة موجودة`
              : `${filtered.length} jobs found`}
          </p>

          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Filter className="h-3.5 w-3.5" />
            {t("common.filter")}
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="shadow-card">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>

              <Button onClick={() => navigate("/signin")}>
                {t("signIn.signIn")}
              </Button>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">{t("jobs.noJobs")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((job, index) => {
              const companyName =
                job.employer?.companyName ||
                job.employer?.name ||
                (language === "ar" ? "شركة غير معروفة" : "Unknown Company");

              const hasScore = typeof job.matchScore === "number";
              const score = job.matchScore || 0;
              const matchedSkills = job.matchedSkills || [];

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-card hover:shadow-card-hover transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>

                            <div className="flex-1">
                              {/* Job Title */}
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-semibold text-lg">
                                  {job.title}
                                </h3>

                                {hasScore && (
                                  <div
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getScoreStyle(
                                      score
                                    )}`}
                                  >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {score}% Match
                                  </div>
                                )}
                              </div>

                              {/* Meta row */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {companyName}
                                </span>

                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {job.location || t("jobs.remote")}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {getWorkTypeText(job.workType, t, language)}
                                </span>
                              </div>

                              {/* Description */}
                              {job.description && (
                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                  {job.description}
                                </p>
                              )}

                              {/* Skills */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {job.requiredSkills?.map((skill) => {
                                  const isMatched = matchedSkills
                                    .map((item) => item.toLowerCase())
                                    .includes(skill.toLowerCase());

                                  return (
                                    <Badge
                                      key={skill}
                                      variant={isMatched ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  );
                                })}
                              </div>

                              {/* Matched Skills */}
                              {hasScore && matchedSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Matched:
                                  </span>

                                  {matchedSkills.slice(0, 5).map((skill) => (
                                    <span
                                      key={skill}
                                      className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Accommodations */}
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
                                        <Accessibility className="h-3 w-3" />
                                        {accommodation}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right side: date + score + apply button */}
                        <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                          <p className="text-xs text-muted-foreground">
                            {getPostedText(job.createdAt, t, language)}
                          </p>

                          {hasScore && (
                            <div
                              className={`hidden lg:flex flex-col items-center justify-center rounded-xl border px-4 py-3 min-w-[92px] ${getScoreStyle(
                                score
                              )}`}
                            >
                              <span className="text-2xl font-bold leading-none">
                                {score}%
                              </span>
                              <span className="text-xs mt-1">Match</span>
                            </div>
                          )}

                          <Link to={`/apply/${job._id}`}>
                            <Button size="sm">{t("jobs.apply")}</Button>
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