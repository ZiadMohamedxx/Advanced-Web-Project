/**
 * DOM Actions - Advanced
 * Programmatically interact with the page DOM
 */

/**
 * Find and click an element by text content
 */
export function clickElementByText(text: string): boolean {
  try {
    // Normalize search text
    const searchText = text.toLowerCase().trim();

    // Try to find by button text
    const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
    for (const btn of buttons) {
      if (btn.textContent?.toLowerCase().includes(searchText)) {
        (btn as HTMLElement).click();
        return true;
      }
    }

    // Try to find by aria-label
    const elements = Array.from(document.querySelectorAll("[aria-label]"));
    for (const el of elements) {
      const label = el.getAttribute("aria-label")?.toLowerCase();
      if (label?.includes(searchText)) {
        (el as HTMLElement).click();
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Failed to click element:", error);
    return false;
  }
}

/**
 * Click element by selector
 */
export function clickElementBySelector(selector: string): boolean {
  try {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.click();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to click by selector:", error);
    return false;
  }
}

/**
 * Fill an input field by placeholder or name, then optionally submit
 */
export function fillInputField(
  searchTerm: string,
  value: string,
  submitForm: boolean = false
): boolean {
  try {
    // Search by placeholder
    let input = document.querySelector(
      `input[placeholder*="${searchTerm}" i]`
    ) as HTMLInputElement;

    // Search by name
    if (!input) {
      input = document.querySelector(`input[name*="${searchTerm}" i]`) as HTMLInputElement;
    }

    // Search by id
    if (!input) {
      input = document.querySelector(`input#${searchTerm}`) as HTMLInputElement;
    }

    if (!input) {
      return false;
    }

    // Set value and trigger events
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    if (submitForm) {
      // Find parent form
      const form = input.closest("form") as HTMLFormElement;
      if (form) {
        form.submit();
      } else {
        // Try to find submit button
        const submitBtn = document.querySelector("button[type='submit']") as HTMLElement;
        if (submitBtn) {
          submitBtn.click();
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to fill input:", error);
    return false;
  }
}

/**
 * Submit a form
 */
export function submitForm(): boolean {
  try {
    // Find first form
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.submit();
      return true;
    }

    // Try to find submit button
    const submitBtn = document.querySelector(
      "button[type='submit'], [role='button'][aria-label*='submit' i]"
    ) as HTMLElement;
    if (submitBtn) {
      submitBtn.click();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to submit form:", error);
    return false;
  }
}

/**
 * Get all clickable elements with their text labels
 */
export function getClickableElements(): Array<{ text: string; element: HTMLElement }> {
  try {
    const elements: Array<{ text: string; element: HTMLElement }> = [];

    // Buttons
    document.querySelectorAll("button, a, [role='button']").forEach((el) => {
      const text = (el as HTMLElement).textContent?.trim();
      if (text) {
        elements.push({ text, element: el as HTMLElement });
      }
    });

    // Links
    document.querySelectorAll("a[href]").forEach((el) => {
      const text = (el as HTMLElement).textContent?.trim();
      if (text) {
        elements.push({ text, element: el as HTMLElement });
      }
    });

    return elements;
  } catch (error) {
    console.error("Failed to get clickable elements:", error);
    return [];
  }
}

/**
 * Extract page context (what's currently visible/interactive)
 */
export function getPageContext(): {
  title: string;
  buttons: string[];
  links: string[];
  forms: number;
  searchAvailable: boolean;
} {
  try {
    const buttons: string[] = [];
    const links: string[] = [];

    // Get button texts
    document.querySelectorAll("button").forEach((btn) => {
      const text = btn.textContent?.trim();
      if (text && text.length < 50) {
        buttons.push(text);
      }
    });

    // Get link texts
    document.querySelectorAll("a").forEach((link) => {
      const text = link.textContent?.trim();
      if (text && text.length < 50) {
        links.push(text);
      }
    });

    const forms = document.querySelectorAll("form").length;
    const searchAvailable = !!document.querySelector("input[type='search'], input[placeholder*='search' i]");

    return {
      title: document.title,
      buttons,
      links,
      forms,
      searchAvailable,
    };
  } catch (error) {
    console.error("Failed to get page context:", error);
    return {
      title: document.title,
      buttons: [],
      links: [],
      forms: 0,
      searchAvailable: false,
    };
  }
}

/**
 * Find the closest element matching a fuzzy text search
 */
export function findElementByFuzzyText(searchText: string): HTMLElement | null {
  try {
    const normalized = searchText.toLowerCase().trim();
    const allElements = Array.from(document.querySelectorAll("button, a, [role='button'], input, textarea"));

    // Direct match
    for (const el of allElements) {
      if (el.textContent?.toLowerCase().includes(normalized)) {
        return el as HTMLElement;
      }
    }

    // Partial match
    const words = normalized.split(/\s+/);
    for (const el of allElements) {
      const content = el.textContent?.toLowerCase() || "";
      const matches = words.filter(word => content.includes(word)).length;
      if (matches >= Math.min(2, words.length)) {
        return el as HTMLElement;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to find element:", error);
    return null;
  }
}
