# cv-for-kreatif

Creative CV site with a public page and a password-free admin dashboard.
Content is stored in a plain JSON file inside the Git repository
(`data/cv.json`), edited through the dashboard, and published by pushing
a commit to the production branch — which then triggers a new Vercel
deployment.

- **Public page** (`/`) renders the content that is baked into the
  deployed commit. No login required.
- **Dashboard** (`/dashboard`) is open only to one GitHub account (the
  configured administrator). Edits are never stored in the browser; they
  are staged in memory and published to GitHub via
  **“Simpan & Publikasikan”**.

## How publishing works

1. Administrator signs in with GitHub (Auth.js / NextAuth, JWT session —
   no database).
2. The dashboard fetches the latest `data/cv.json` **directly from
   GitHub** through the server (`GET /api/cv`).
3. The administrator edits the content (stays in memory, marked as
   unsaved; you are warned before leaving with unsaved changes).
4. The administrator clicks **Simpan & Publikasikan** → `PUT /api/cv`.
5. The server validates the session, administrator permissions, payload
   structure/lengths, and the loaded file version (SHA).
6. If another device changed the file since it was loaded, the server
   responds with a version conflict and the dashboard asks you to load
   the latest version — it never overwrites newer changes.
7. Otherwise the server pushes an update to `data/cv.json` on the
   configured production branch.
8. Vercel’s Git integration builds a new deployment from that commit;
   once it finishes, the public page serves the new content.
9. If deployment verification is configured (`VERCEL_API_TOKEN` +
   `VERCEL_PROJECT_ID`), the dashboard reports the real Vercel build
   state. Without it, the dashboard clearly says the content was saved to
   GitHub but publication has not been verified.

Nothing is stored in `localStorage`, `sessionStorage`, IndexedDB,
cookies (other than the HttpOnly auth session cookie) or the Vercel
filesystem. The Vercel filesystem and `/tmp` are never used for
persistence.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Visit http://localhost:3000 (public CV) and
http://localhost:3000/dashboard (sign in with GitHub).

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs the JWT session cookie. Generate with `npx auth secret` or `openssl rand -base64 32`. |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID. |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret. |
| `AUTH_URL` | Your app base URL (local: `http://localhost:3000`). |
| `AUTH_TRUST_HOST` | `true` so the host header / Vercel URL can be trusted in production. |
| `CV_ADMIN_ID` | Numeric GitHub **account id** (not the username) allowed to edit. |
| `GH_PAT` | Fine-grained personal access token with **Contents: Read and write** on this repository only. |
| `GH_REPO_OWNER` | Repository owner (e.g. `AfifAmirudin`). |
| `GH_REPO_NAME` | Repository name (e.g. `cv-for-creative`). |
| `GH_BRANCH` | Production branch (e.g. `main`). |
| `GH_CONTENT_PATH` | Content file path (e.g. `data/cv.json`). |

All of these are read server-side only — never use `NEXT_PUBLIC_`
prefixes, and never commit real values (`.env*` is git-ignored).

## GitHub OAuth App setup

1. Go to https://github.com/settings/developers and create a **New OAuth
   App**.
2. Set the authorization callback URL to your NextAuth endpoint:
   - Local: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://cv-for-creative.vercel.app/api/auth/callback/github`
3. Copy the **Client ID** and **Client secret** into `AUTH_GITHUB_ID` /
   `AUTH_GITHUB_SECRET` (for production, set them in Vercel).

## Finding your administrator GitHub account id

The dashboard restricts editing to a single GitHub **account id**
(`CV_ADMIN_ID`). To find yours:

1. Open `https://api.github.com/user` while logged in on GitHub, and read
   the top-level numeric `id` field.
   (If you don’t want to use the API, the id also appears in the HTML of
   your GitHub profile page inside `"user": {"id": <number>, ...}`.)
2. Put that number in `CV_ADMIN_ID`. Everyone else who signs in will see
   the “Akses Ditolak” screen.

## GitHub token setup

1. Open https://github.com/settings/tokens?type=beta and create a
   **fine-grained** personal access token.
2. Select **Only select repositories** → your CV repository.
3. Under **Repository permissions** → **Contents**, choose **Read and
   write**.
4. Generate the token and store it as `GH_PAT`. Do **not** select extra
   permissions or other repositories.

## Setting environment variables in Vercel

1. In the Vercel project (Settings → Environment Variables) add all of
   the variables above.
2. For every environment (Production / Preview) set `AUTH_TRUST_HOST` to
   `true` and `AUTH_URL` to:
   - Production: `https://cv-for-creative.vercel.app`
   - Preview: your preview domain
3. **Preview deployments** do not need publishing access. To avoid
   accidental publishes from previews, keep `GH_PAT`/`CV_ADMIN_ID` set
   only in **Production** (and local), or give the Preview branch a
   separate `GH_BRANCH` value. The publish workflow is designed so that
   only the production branch receives writes; Vercel only triggers a
   production deployment from the production branch.

## Production branch & automatic deployment

1. Make sure the production branch (default `main`) is connected to the
   Vercel project (Project → Settings → Git) and that **Automatic
   Deployments** are enabled for it.
2. Every “Simpan & Publikasikan” action commits `data/cv.json` to that
   branch, which makes Vercel queue a build automatically.

## Optional: Vercel deployment verification

To see real deployment progress in the dashboard:

1. Create a Vercel API token (https://vercel.com/account/tokens) with
   read access and store it as `VERCEL_API_TOKEN`.
2. Copy the Project ID (Project → Settings → General) into
   `VERCEL_PROJECT_ID`.

Without these, the dashboard will report “Tersimpan ke GitHub ✓ —
publikasi belum diverifikasi”.

---

### Checks

- `npm run lint`
- `npm run build`

(Individual lint/type/build results are reported at the end of the
implementation session.)