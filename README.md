<div align="center">

# 📸 WEB2PNG

**Full-page website screenshots — paste URLs, pick light or dark, done.**

No install. No terminal. Just paste and capture.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#-license)
![100% client-side UI](https://img.shields.io/badge/runs-100%25%20client--side%20UI-brightgreen)
![Powered by ScreenshotOne](https://img.shields.io/badge/powered%20by-ScreenshotOne-2f6bff)

### **[▶ Open WEB2PNG](#)**
<sub>*(replace this with your GitHub Pages URL once it's live — see [Putting it on GitHub Pages](#-putting-it-on-github-pages))*</sub>

</div>

---

## ✨ What it does

Paste in a list of URLs, pick **Light** or **Dark**, and click the shutter. Each one comes back as a numbered frame in a contact sheet:

```
FR. 01   example.com              → full-page screenshot, light mode
FR. 02   anothersite.dev/pricing  → full-page screenshot, dark mode
FR. 03   docs.example.com         → full-page screenshot, light mode
```

Every frame gives you **Open image**, **Copy link**, and **Delete** — no accounts, no dashboard, no saved history.

---

## 🚀 Quick start

| Step | What to do |
|:---:|---|
| **1** | **Pick a mode** — toggle **Light** or **Dark** for how the captured *site* should render |
| **2** | **Paste URLs** — one per line; `https://` is added automatically if you leave it off |
| **3** | **Capture** — click the shutter button |
| **4** | **Save** — click **Open image** on any frame, then *Save image as...* from the new tab |

> **Note:** screenshots render via a shared [ScreenshotOne](https://screenshotone.com) API key baked into `script.js`, capped at 100 images/month across everyone using this deployment. Swap in your own free key if you outgrow it — see [If you outgrow the shared key](#-if-you-outgrow-the-shared-key).

---

## ⚙️ How it works

A GitHub Pages site is just static HTML/CSS/JS with no server behind it, so it can't launch a headless browser the way a local Playwright script could. WEB2PNG works around that by calling the **[ScreenshotOne](https://screenshotone.com)** API and rendering the image it sends back — a full-page capture, 1920px wide, top to bottom, in whichever mode you picked.

| | |
|---|---|
| 🔒 | **Nothing uploaded anywhere you control** — URLs go straight to ScreenshotOne, never through a server of ours |
| 📦 | **No install** — just a URL |
| 🙅 | **No sign-up** — open it and go |
| 🌗 | **Two independent dark modes** — one for the *site UI* (top-right toggle), one for how the *captured page* renders |

---

## 🎛️ Two kinds of "dark mode"

It's easy to mix these up, so to be clear:

| Toggle | Where | What it changes |
|---|---|---|
| ☀️/🌙 button, top-right | Site chrome | Switches **WEB2PNG's own interface** between light and dark — just a preference, saved locally |
| **Light / Dark** segmented control | Inside the form | Tells ScreenshotOne to render the **target page itself** in light or dark mode before capturing it |

You can capture a dark-mode screenshot while browsing WEB2PNG in light mode, or vice versa — they're unrelated.

---

## 📐 Supported input

| Input | Output |
|:---:|:---:|
| Any `http(s)://` URL (scheme optional) | `.png` (full page, 1920px wide) |

Multiple URLs are supported, one per line. Cookie banners are blocked automatically where ScreenshotOne can detect them.

---

## 🌐 Browser compatibility

Any modern browser works — no WebAssembly, no special APIs beyond `fetch` and the Clipboard API:

| Browser | Support |
|---|:---:|
| Chrome / Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Mobile Chrome / Safari | ✅ |

---

## 🛠 Running locally

No build step required — it's plain HTML/CSS/JS:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open **http://localhost:8080**, or just open `index.html` directly in a browser.

---

## 📤 Putting it on GitHub Pages

1. Push these four files (`index.html`, `style.css`, `script.js`, `README.md`) to a new GitHub repository, at the repo root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch` → branch `main` → folder `/ (root)` → **Save**.
4. GitHub gives you a URL like `https://your-username.github.io/your-repo-name/` within a minute or two — that's your live tool.
5. Come back and drop that URL into the **Open WEB2PNG** link at the top of this file.

---

## 📁 Files

```
index.html    structure of the page
style.css     visual design, including light/dark theming
script.js     form handling, screenshot URL building, theme toggle, delete/copy actions
WEB2PNG.py    the original Playwright-based script this web tool is based on
README.md     this file
```

---

## 🐍 The original Python tool

This repo also includes **`WEB2PNG.py`**, the original script this web tool is based on. It uses [Playwright](https://playwright.dev/python/) to drive a real headless browser locally, so it has no rate limit and no dependency on a third-party API — just no web UI.

```bash
pip install playwright
playwright install chromium
```

Then run it:

```bash
python WEB2PNG.py
```

---

## 🔑 If you outgrow the shared key

```js
// script.js
const SCREENSHOTONE_KEY = "8FU0wYUBxcqxXA";
```

- Grab your own free key at [screenshotone.com](https://screenshotone.com) (no card needed) for your own 100-images-a-month quota instead of sharing this one.
- For unlimited, self-hosted full-page capture, run **`WEB2PNG.py`** — see [The original Python tool](#-the-original-python-tool) above.

---

## 📄 License

MIT

---

<div align="center">
<sub>Screenshot rendering by <a href="https://screenshotone.com">ScreenshotOne</a>.</sub>
</div>
