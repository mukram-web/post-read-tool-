# Be10X Content Studio

A single app with two tabs that share one transcript:

- **Session Notes** — turns a session transcript into professional HTML post-read notes (with the Be10X logo pre-filled).
- **Quiz Generator** — turns the same transcript into a structured JSON quiz (tag name + question count) ready for LMS import.

Paste or upload the transcript once on either tab; it is shared with the other.

Powered by the Google Gemini API.

---

## What you need

- A Google **Gemini API key** — get one free at https://aistudio.google.com (click "Get API key").

The API key is the only secret. It is **never committed to GitHub** (the `.env.local` file is ignored). On Vercel you add it as an environment variable instead.

---

## Deploy to Vercel (via GitHub)

1. **Put the code on GitHub.**
   - Create a new repository (Private is fine).
   - Upload all the files and folders from this project (use GitHub's "Add file → Upload files", drag everything in, then "Commit changes").

2. **Import into Vercel.**
   - Go to https://vercel.com and sign in with GitHub.
   - Click **Add New… → Project** and **Import** your repository.
   - Vercel auto-detects it as a **Vite** app — no build settings to change.

3. **Add the API key.**
   - Before deploying, open **Environment Variables** and add:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** your Gemini API key
     - Apply to all environments.

4. **Click Deploy.**
   - After a minute or two you get a live URL. Open it and test both tabs.

To update later: upload changed files to the same GitHub repo (or use "Add file → Upload files" to replace them) and Vercel rebuilds automatically.

---

## Run locally (optional)

Requires Node.js (LTS).

1. `npm install`
2. Create a file named `.env.local` with: `GEMINI_API_KEY=your_key_here`
3. `npm run dev` and open the printed `http://localhost:3000`

---

## Notes

- **Keep the deployed link private for now.** The Gemini key is bundled into the public page, so anyone with the link and browser tools could read it and use your Gemini quota. This is fine for internal use; for a wider/public rollout, the API calls should be moved to a small backend so the key stays hidden.
- Styling uses the Tailwind CDN, which is convenient and works in production. If you later want a smaller, fully optimized build, Tailwind can be installed as a build step.
