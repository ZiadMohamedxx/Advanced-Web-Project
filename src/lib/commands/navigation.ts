/**
 * Navigation Command Handlers
 * Commands for navigating to different pages in the application
 */

export type CommandConfig = {
  aliases: string[];
  handler: () => void;
  description: string;
};

export const navigationCommands: Record<string, CommandConfig> = {
  home: {
    aliases: ["go home", "open home"],
    handler: () => {
      window.location.href = "/";
    },
    description: "Navigate to home page",
  },

  jobs: {
    aliases: ["open jobs", "view jobs", "show jobs"],
    handler: () => {
      window.location.href = "/jobs";
    },
    description: "Navigate to jobs page",
  },

  about: {
    aliases: ["open about", "view about"],
    handler: () => {
      window.location.href = "/about";
    },
    description: "Navigate to about page",
  },

  profile: {
    aliases: ["open profile", "view profile", "my profile"],
    handler: () => {
      window.location.href = "/profile";
    },
    description: "Navigate to profile page",
  },

  candidate_portal: {
    aliases: ["open candidate portal", "candidate dashboard"],
    handler: () => {
      window.location.href = "/candidate-portal";
    },
    description: "Navigate to candidate portal",
  },

  employer_portal: {
    aliases: ["open employer portal", "employer dashboard"],
    handler: () => {
      window.location.href = "/employer-portal";
    },
    description: "Navigate to employer portal",
  },

  employer_dashboard: {
    aliases: ["open employer dashboard", "open dashboard"],
    handler: () => {
      window.location.href = "/employer-dashboard";
    },
    description: "Navigate to employer dashboard",
  },

  post_job: {
    aliases: ["post job", "post a job", "create job"],
    handler: () => {
      window.location.href = "/post-job";
    },
    description: "Navigate to post job page",
  },

  accessibility: {
    aliases: ["open accessibility", "open accessibility page"],
    handler: () => {
      window.location.href = "/accessibility";
    },
    description: "Navigate to accessibility page",
  },

  signin: {
    aliases: ["sign in", "login", "log in"],
    handler: () => {
      window.location.href = "/signin";
    },
    description: "Navigate to sign in page",
  },

  signup: {
    aliases: ["sign up", "register", "create account"],
    handler: () => {
      window.location.href = "/signup";
    },
    description: "Navigate to sign up page",
  },

  apply_job: {
    aliases: ["apply for job", "apply job"],
    handler: () => {
      // Try to find and click the first apply button
      const applyButton = document.querySelector(
        '[data-testid="apply-button"], button:has-text("Apply"), a[href*="/apply"]'
      ) as HTMLElement;

      if (applyButton) {
        if (applyButton.tagName === "A") {
          window.location.href = applyButton.getAttribute("href") || "/jobs";
        } else {
          applyButton.click();
        }
      } else {
        // Fallback to jobs page if no apply button found
        window.location.href = "/jobs";
      }
    },
    description: "Apply for the current job",
  },

  signout: {
    aliases: ["sign out", "logout", "log out"],
    handler: () => {
      // Clear user session
      localStorage.removeItem("user");
      localStorage.removeItem("accessibility-settings");
      // Redirect to home
      window.location.href = "/";
    },
    description: "Sign out and return to home",
  },
};