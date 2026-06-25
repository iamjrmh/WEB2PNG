#!/usr/bin/env python3
"""
Full-height website screenshot tool.
Captures full-page screenshots in light or dark mode using Playwright.

Requirements:
    pip install playwright
    playwright install chromium
"""

from playwright.sync_api import sync_playwright


def get_mode_choice() -> bool:
    """Ask the user for light or dark mode. Returns True for dark mode."""
    print("\n🖼️  Website Screenshot Tool")
    print("─" * 30)
    while True:
        choice = input("Mode? [L]ight / [D]ark (default: Light): ").strip().lower()
        if choice in ("", "l", "light"):
            return False
        elif choice in ("d", "dark"):
            return True
        else:
            print("  Please enter L for light or D for dark.")


def sanitize_filename(url: str) -> str:
    """Turn a URL into a safe filename."""
    name = url.replace("https://", "").replace("http://", "")
    for ch in r'\/:*?"<>|':
        name = name.replace(ch, "_")
    return name.strip("_")[:80]


def take_screenshot(url: str, dark_mode: bool, playwright) -> str:
    """Launch Chromium and capture a full-page screenshot."""
    browser = playwright.chromium.launch()

    color_scheme = "dark" if dark_mode else "light"

    context = browser.new_context(
        color_scheme=color_scheme,
        viewport={"width": 1440, "height": 900},
    )

    page = context.new_page()

    print(f"  ↳ Loading {url} …")
    page.goto(url, wait_until="networkidle", timeout=30_000)

    # Let any lazy-loaded content settle
    page.wait_for_timeout(1500)

    mode_label = "dark" if dark_mode else "light"
    filename = f"{sanitize_filename(url)}_{mode_label}.png"

    page.screenshot(path=filename, full_page=True)
    browser.close()
    return filename


def main():
    dark_mode = get_mode_choice()
    mode_label = "dark 🌙" if dark_mode else "light ☀️"
    print(f"\nUsing {mode_label} mode.")
    print("Paste URLs one per line. Press Enter on a blank line when done.\n")

    urls = []
    while True:
        raw = input("URL: ").strip()
        if not raw:
            break
        # Auto-add scheme if missing
        if not raw.startswith(("http://", "https://")):
            raw = "https://" + raw
        urls.append(raw)

    if not urls:
        print("No URLs entered. Exiting.")
        return

    print(f"\nCapturing {len(urls)} screenshot(s)…\n")

    with sync_playwright() as pw:
        for url in urls:
            try:
                filename = take_screenshot(url, dark_mode, pw)
                print(f"  ✅  Saved → {filename}")
            except Exception as exc:
                print(f"  ❌  Failed ({url}): {exc}")

    print("\nDone!")


if __name__ == "__main__":
    main()
