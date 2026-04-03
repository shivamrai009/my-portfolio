# Shivam Rai Portfolio

A high-impact engineering portfolio built with React, Tailwind CSS, and Framer Motion.

## Highlights

- Flagship project spotlight for NextFlow with live and repository links
- Stack-filtered selected projects section
- Live GitHub repositories and recent activity feed
- Pinned repositories section for priority projects
- Resume download and secure contact form UX

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

3. (Optional) Configure direct form delivery:

```env
VITE_CONTACT_ENDPOINT=https://your-endpoint.example.com/contact
```

If `VITE_CONTACT_ENDPOINT` is not set, the contact form falls back to opening a pre-filled email draft.

4. Run the app:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Contact Endpoint Contract

When configured, the form sends a `POST` request with JSON body:

```json
{
	"name": "string",
	"email": "string",
	"message": "string",
	"source": "portfolio"
}
```

Expected behavior:

- Any 2xx response is treated as success
- Non-2xx responses show an error message in the UI

## Deploying on Vercel

This project is deployment-ready as a static Vite app.

1. Push the repository to GitHub.
2. In Vercel, choose **Add New Project** and import the repo.
3. The root-level [vercel.json](vercel.json) already tells Vercel to build the app inside `my-portfolio/`.
4. If you want to configure it manually, use these settings:

```text
Framework Preset: Other
Root Directory: .
Build Command: cd my-portfolio && npm run build
Output Directory: my-portfolio/dist
Install Command: cd my-portfolio && npm install
```

5. Add environment variables if you want direct contact form delivery:

```env
VITE_CONTACT_ENDPOINT=https://your-endpoint.example.com/contact
```

6. Add your resume PDF at:

```text
public/resume-latest.pdf
```

That file can be replaced any time without code changes because the UI points to a stable filename.

7. Deploy.

## Notes

- GitHub profile and repository data are fetched client-side, so those repos must be public.
- If `VITE_CONTACT_ENDPOINT` is not set, the contact form falls back to a pre-filled email draft.
