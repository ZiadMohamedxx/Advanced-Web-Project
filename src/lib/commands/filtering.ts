/**
 * Job Filtering Command Handlers
 * Commands for filtering jobs by work type, location, etc.
 * Supports URL params: /jobs?workType=remote
 */

import { CommandConfig } from "./navigation";

const navigateToJobsWithFilter = (workType: string) => {
  window.location.href = `/jobs?workType=${workType}`;
};

export const filteringCommands: Record<string, CommandConfig> = {
  filter_remote: {
    aliases: ["show remote jobs", "remote jobs", "work remote"],
    handler: () => {
      navigateToJobsWithFilter("remote");
    },
    description: "Filter to show remote jobs",
  },

  filter_onsite: {
    aliases: ["show onsite jobs", "onsite jobs", "office jobs"],
    handler: () => {
      navigateToJobsWithFilter("onsite");
    },
    description: "Filter to show onsite jobs",
  },

  filter_hybrid: {
    aliases: ["show hybrid jobs", "hybrid jobs", "mixed work"],
    handler: () => {
      navigateToJobsWithFilter("hybrid");
    },
    description: "Filter to show hybrid jobs",
  },

  clear_filters: {
    aliases: ["clear filters", "show all jobs", "reset filters"],
    handler: () => {
      window.location.href = "/jobs";
    },
    description: "Clear all job filters",
  },

  filter_jobs: {
    aliases: ["filter jobs", "open filters"],
    handler: () => {
      // Navigate to jobs page if not already there
      if (!window.location.pathname.includes("/jobs")) {
        window.location.href = "/jobs";
      }
      // Emit event for filter panel to open
      document.body.dispatchEvent(new Event("open-job-filters"));
    },
    description: "Open job filters panel",
  },
};