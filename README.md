# Be10X Content Studio

A single app with two tabs that share one transcript:

- **Session Notes** — turns a session transcript into professional HTML post-read notes (Be10X logo pre-filled).
- **Quiz Generator** — turns the same transcript into a structured JSON quiz (tag name + question count) ready for LMS import.

Paste or upload the transcript once on either tab; it is shared with the other.

Powered by the Google Gemini API.

---

## API key

This app does **not** contain any API key. When you open it, it asks you for your **Gemini API key**, which is used only inside your browser to talk to Google — it is never sent to or stored on any server.

- Get a free key at https://aistudio.google.com/app/apikey
- Tick **"Remember me on this device"** to have the browser save it so you don't re-enter it each time. Leave it unticked to be asked again on every visit.
- Use the **Change key** button (top right) to clear or switch the key at any time.

Because there is no key in the code, the deployed site is safe to share.

---

## Deploy to Vercel (via GitHub)

1. **Put the code on GitHub.**
   - Create a new repository (Private is fine).
   - Use "Add file → Upload files", drag in everything from this project, and commit.

2. **Import into Vercel.**
   - Go to https://vercel.com and sign in with GitHub.
   - Click **Add New… → Project** and **Import** your repository.
   - Vercel auto-detects it as a **Vite** app — no build settings to change.
   - No environment variables are needed.

3. **Click Deploy.**
   - After a minute or two you get a live URL. Open it, enter your Gemini API key, and use both tabs.

To update later: upload changed files to the same GitHub repo and Vercel rebuilds automatically.

---

## Run locally (optional)

Requires Node.js (LTS).

1. `npm install`
2. `npm run dev` and open the printed `http://localhost:3000`
3. Enter your Gemini API key when prompted.
