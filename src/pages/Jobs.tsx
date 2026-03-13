import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Clock, Building2, Accessibility,
  Filter, Briefcase, CheckCircle2
} from "lucide-react";

const jobs = [
  {
    id: 1, title: "Frontend Developer", company: "TechInclusive Co.",
    location: "Remote", type: "Full-time", compatibility: 95,
    accommodations: ["Screen reader compatible", "Flexible hours"],
    skills: ["React", "TypeScript", "ARIA"],
    posted: "2 days ago",
  },
  {
    id: 2, title: "Data Analyst", company: "AccessFirst Inc.",
    location: "New York, NY", type: "Full-time", compatibility: 88,
    accommodations: ["Wheelchair accessible", "Ergonomic workspace"],
    skills: ["Python", "SQL", "Excel"],
    posted: "1 week ago",
  },
  {
    id: 3, title: "Content Writer", company: "Words4All",
    location: "Remote", type: "Part-time", compatibility: 92,
    accommodations: ["Voice-to-text software", "Flexible deadlines"],
    skills: ["Copywriting", "SEO", "Research"],
    posted: "3 days ago",
  },
  {
    id: 4, title: "Customer Support Specialist", company: "HelpDesk Pro",
    location: "Chicago, IL", type: "Full-time", compatibility: 79,
    accommodations: ["Sign language interpreter", "Text-based communication"],
    skills: ["Communication", "CRM", "Problem Solving"],
    posted: "5 days ago",
  },
  {
    id: 5, title: "UX Researcher", company: "DesignForAll Studio",
    location: "Remote", type: "Contract", compatibility: 91,
    accommodations: ["High contrast monitors", "Assistive technology"],
    skills: ["User Testing", "Figma", "Accessibility Audits"],
    posted: "1 day ago",
  },
];

export default function Jobs() {
  const [search, setSearch] = useState("");
  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <section className="relative overflow-hidden" aria-labelledby="jobs-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-20 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
            <h1 id="jobs-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Find <span className="text-gradient">Inclusive Jobs</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Every job listing is verified for accessibility accommodations.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, or skill..."
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
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-3.5 w-3.5" /> Filters
          </Button>
        </div>

        <div className="space-y-4">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
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
                            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.skills.map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.accommodations.map((a) => (
                              <span key={a} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                <Accessibility className="h-3 w-3" /> {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold text-primary">{job.compatibility}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{job.posted}</p>
                      <Link to={`/apply/${job.id}`}><Button size="sm">Apply Now</Button></Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
