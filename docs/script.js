/* ============================================================
   WEB2PNG
   Builds full-page screenshot URLs via the ScreenshotOne API
   (since a static page can't run a headless browser itself)
   and drops them into the contact-sheet grid below the form.
   ============================================================ */

(() => {
  // Shared access key, baked in so the tool works with zero setup.
  // Swap this for your own free key from screenshotone.com if you
  // want your own quota instead of sharing this one.
  const SCREENSHOTONE_KEY = "8FU0wYUBxcqxXA";

  const form = document.getElementById("capture-form");
  const modeDark = document.getElementById("mode-dark");
  const urlsField = document.getElementById("urls");
  const resultsEl = document.getElementById("results");
  const resultsEmpty = document.getElementById("results-empty");
  const errorEl = document.getElementById("form-error");
  const frameTemplate = document.getElementById("frame-template");

  let frameCount = 0;

  // Mirrors sanitize_filename() from the original Python tool.
  function sanitizeFilename(url) {
    let name = url.replace(/^https?:\/\//i, "");
    name = name.replace(/[\\/:*?"<>|]/g, "_");
    name = name.replace(/^_+|_+$/g, "");
    return name.slice(0, 80) || "screenshot";
  }

  // Mirrors the auto-add-scheme behaviour from the original tool.
  function normalizeUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (!/^https?:\/\//i.test(trimmed)) return "https://" + trimmed;
    return trimmed;
  }

  function buildImageUrl(url, darkMode) {
    const params = new URLSearchParams({
      url,
      access_key: SCREENSHOTONE_KEY,
      format: "png",
      full_page: "true",
      viewport_width: "1920",
      viewport_height: "1080",
      dark_mode: darkMode ? "true" : "false",
      block_cookie_banners: "true",
    });
    return `https://api.screenshotone.com/take?${params.toString()}`;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function maybeShowEmptyState() {
    const hasFrames = resultsEl.querySelector(".frame") !== null;
    resultsEmpty.hidden = hasFrames;
  }

  function addFrame(url, darkMode, index) {
    resultsEmpty.hidden = true;

    const node = frameTemplate.content.firstElementChild.cloneNode(true);
    const numberEl = node.querySelector(".frame-number");
    const img = node.querySelector("img");
    const statusEl = node.querySelector(".frame-status");
    const urlEl = node.querySelector(".frame-url");
    const openLink = node.querySelector(".frame-open");
    const copyBtn = node.querySelector(".frame-copy");
    const deleteBtn = node.querySelector(".frame-delete");

    numberEl.textContent = `FR. ${String(index).padStart(2, "0")}`;
    urlEl.textContent = url;
    urlEl.title = url;

    const imageUrl = buildImageUrl(url, darkMode);
    const modeSuffix = darkMode ? "dark" : "light";

    statusEl.hidden = false;
    statusEl.textContent = "Developing...";

    img.alt = `Screenshot of ${url}`;
    img.addEventListener("load", () => {
      statusEl.hidden = true;
    });
    img.addEventListener("error", () => {
      statusEl.hidden = false;
      statusEl.textContent = "Could not load this one. Check the URL and try again.";
      node.classList.add("frame-failed");
    });
    img.src = imageUrl;

    openLink.href = imageUrl;
    openLink.download = `${sanitizeFilename(url)}_${modeSuffix}.png`;

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(imageUrl);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = original;
        }, 1500);
      } catch {
        copyBtn.textContent = "Copy failed";
      }
    });

    deleteBtn.addEventListener("click", () => {
      node.remove();
      maybeShowEmptyState();
    });

    resultsEl.prepend(node);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showError("");

    const darkMode = modeDark.checked;

    const urls = urlsField.value
      .split("\n")
      .map(normalizeUrl)
      .filter(Boolean);

    if (!urls.length) {
      showError("Add at least one URL.");
      urlsField.focus();
      return;
    }

    urls.forEach((url) => {
      frameCount += 1;
      addFrame(url, darkMode, frameCount);
    });
  });
})();
