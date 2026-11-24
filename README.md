# JEE Planner + JEE Dock (iPhone app)

| File | What it is |
|---|---|
| `index.html` | Full drag-and-drop planner (use on PC) |
| `dock.html` | Dock Mode – countdown, today's chapters, Pomodoro (for iPhone) |
| `shared.js` | Syllabus, storage, PC ↔ iPhone sync codes |
| `ios/` | Native iOS wrapper (Swift + WKWebView), keeps screen awake |
| `.github/workflows/build-ipa.yml` | Builds `JEEDock.ipa` on GitHub's free Mac servers |

## 1. Build the IPA (no Mac needed)

1. Make a free account at github.com → **New repository** → name it `jee-dock` → **Public** (free Mac build minutes) → Create.
2. Click **uploading an existing file** and drag in everything from this folder **except** `.github`
   (`index.html`, `dock.html`, `shared.js`, `icon.png`, `README.md`, and the `ios` folder) → **Commit**.
3. **Add file → Create new file**, type the name `.github/workflows/build-ipa.yml`,
   paste the contents of that file from this folder → **Commit**.
4. Open the **Actions** tab → wait ~3–5 min for the green ✓ → click the run →
   download **JEEDock-ipa** (a zip) → unzip it to get `JEEDock.ipa`.

## 2. Sideload onto the iPhone 7 (Windows)

1. Install **iTunes** and **iCloud** from apple.com (the website versions, *not* Microsoft Store).
2. Install **Sideloadly** (sideloadly.io).
3. Plug in the iPhone, tap **Trust** on the phone.
4. Drag `JEEDock.ipa` into Sideloadly, enter an Apple ID (a spare one is fine) → **Start**.
5. On the iPhone: **Settings → General → VPN & Device Management** → tap your Apple ID → **Trust**.

> With a free Apple ID the app stops opening after **7 days**. Just re-run Sideloadly with the same IPA
> (your data stays). Sideloadly's auto-refresh option can do this when the PC and phone share Wi-Fi.

## 3. Use it as a dock

- Stand the phone sideways and keep it plugged in. The app keeps the screen on by itself.
- **Triple-click Home → Guided Access → Start** to lock the phone into JEE Dock
  (turn it on first in Settings → Accessibility → Guided Access).
- Turn the ring/silent switch to **ring** so you hear the timer beep.
- Tap a chapter when you've **finished** it. Use ☾ to dim the screen at night.

## Sync PC ↔ iPhone

The PC and the phone each keep their own copy of the plan.
**⇄ Sync** on PC → **Copy code** → send it to yourself (WhatsApp/Telegram/email) →
on the iPhone **⇄ Sync** → paste → **Import**. You can sync the other way the same way.

## No-sideload alternative

Host this folder for free (drag it onto app.netlify.com/drop), open `…/dock.html` in Safari on the iPhone,
then **Share → Add to Home Screen**. You get the same dock with no 7-day expiry, but you'll need to set Auto-Lock to Never yourself.
