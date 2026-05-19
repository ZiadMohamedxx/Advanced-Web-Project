/**
 * Voice Command Actions - Direct Execution
 * All commands execute immediately without event listeners
 * No reliance on external systems or listeners
 */

/**
 * Open accessibility panel by triggering the panel directly
 */
export function openAccessibilityPanel(): boolean {
  try {
    document.body.dispatchEvent(new Event("open-accessibility"));
    return true;
  } catch (error) {
    console.error("Failed to open accessibility panel:", error);
    return false;
  }
}

/**
 * Modify font scale in accessibility settings
 */
export function modifyFontScale(delta: number): boolean {
  try {
    const saved = localStorage.getItem("accessibility-settings");
    if (!saved) return false;

    const settings = JSON.parse(saved);
    const newScale = Math.max(0.9, Math.min(1.4, settings.fontScale + delta));

    if (newScale === settings.fontScale) return true;

    settings.fontScale = newScale;
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    document.documentElement.style.setProperty("--app-font-scale", newScale.toString());
    window.dispatchEvent(new Event("accessibility-settings-changed"));
    return true;
  } catch (error) {
    console.error("Failed to modify font scale:", error);
    return false;
  }
}

/**
 * Toggle high contrast mode
 */
export function toggleHighContrast(): boolean {
  try {
    const saved = localStorage.getItem("accessibility-settings");
    if (!saved) return false;

    const settings = JSON.parse(saved);
    settings.highContrast = !settings.highContrast;
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    document.body.classList.toggle("a11y-high-contrast", settings.highContrast);
    window.dispatchEvent(new Event("accessibility-settings-changed"));
    return true;
  } catch (error) {
    console.error("Failed to toggle high contrast:", error);
    return false;
  }
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode(): boolean {
  try {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "";
    const isDark = currentTheme === "dark" || document.body.classList.contains("dark");

    if (isDark) {
      html.setAttribute("data-theme", "light");
      html.removeAttribute("theme");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      html.setAttribute("data-theme", "dark");
      html.setAttribute("theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }

    localStorage.setItem("theme-preference", isDark ? "light" : "dark");
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: isDark ? "light" : "dark" } }));
    return true;
  } catch (error) {
    console.error("Failed to toggle dark mode:", error);
    return false;
  }
}

/**
 * Read page content using Web Speech API
 */
export function readPageContent(): boolean {
  try {
    if (!("speechSynthesis" in window)) {
      return false;
    }

    const text = getPageText();
    if (!text) return false;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const preferredVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("en")) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synth.speak(utterance);
    return true;
  } catch (error) {
    console.error("Failed to read page:", error);
    return false;
  }
}

/**
 * Read selected text
 */
export function readSelectedText(): boolean {
  try {
    if (!("speechSynthesis" in window)) {
      return false;
    }

    const text = window.getSelection()?.toString().trim();
    if (!text) return false;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const preferredVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("en")) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synth.speak(utterance);
    return true;
  } catch (error) {
    console.error("Failed to read selected text:", error);
    return false;
  }
}

/**
 * Pause/Resume speech synthesis
 */
export function pauseResumeSpeech(): boolean {
  try {
    if (!("speechSynthesis" in window)) {
      return false;
    }

    const synth = window.speechSynthesis;
    if (!synth.speaking) return false;

    if (synth.paused) {
      synth.resume();
    } else {
      synth.pause();
    }
    return true;
  } catch (error) {
    console.error("Failed to pause/resume speech:", error);
    return false;
  }
}

/**
 * Stop speech synthesis
 */
export function stopSpeech(): boolean {
  try {
    if (!("speechSynthesis" in window)) {
      return false;
    }

    window.speechSynthesis.cancel();
    return true;
  } catch (error) {
    console.error("Failed to stop speech:", error);
    return false;
  }
}

/**
 * Get readable page text
 */
function getPageText(): string {
  try {
    const main = document.querySelector("main");
    let element = main || document.body;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("script, style, noscript, button, [aria-hidden='true']").forEach((node) => {
      node.remove();
    });

    return clone.innerText.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Failed to get page text:", error);
    return "";
  }
}

/**
 * Navigate to URL
 */
export function navigateToUrl(url: string): boolean {
  try {
    window.location.href = url;
    return true;
  } catch (error) {
    console.error("Failed to navigate:", error);
    return false;
  }
}

/**
 * Scroll with smooth behavior
 */
export function scroll(direction: "up" | "down" | "top" | "bottom", amount: number = 300): boolean {
  try {
    switch (direction) {
      case "down":
        window.scrollBy({ top: amount, behavior: "smooth" });
        break;
      case "up":
        window.scrollBy({ top: -amount, behavior: "smooth" });
        break;
      case "top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "bottom":
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        break;
    }
    return true;
  } catch (error) {
    console.error("Failed to scroll:", error);
    return false;
  }
}

/**
 * Search for jobs with query and navigate to jobs page
 */
export function searchJobsWithQuery(query: string): boolean {
  try {
    if (!query.trim()) return false;

    // Navigate to jobs page
    window.location.href = `/jobs?search=${encodeURIComponent(query)}`;
    return true;
  } catch (error) {
    console.error("Failed to search jobs:", error);
    return false;
  }
}

/**
 * Search for query
 */
export function searchForQuery(query: string): boolean {
  try {
    if (!query.trim()) return false;

    const searchInput = document.querySelector(
      'input[type="search"], input[placeholder*="search" i], input[name*="search" i]'
    ) as HTMLInputElement;

    if (!searchInput) return false;

    searchInput.value = query;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    searchInput.dispatchEvent(new Event("change", { bubbles: true }));
    searchInput.focus();

    return true;
  } catch (error) {
    console.error("Failed to search:", error);
    return false;
  }
}

/**
 * Go back in browser history
 */
export function goBack(): boolean {
  try {
    window.history.back();
    return true;
  } catch (error) {
    console.error("Failed to go back:", error);
    return false;
  }
}

/**
 * Refresh page
 */
export function refreshPage(): boolean {
  try {
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Failed to refresh:", error);
    return false;
  }
}
