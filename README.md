# Symfony Blog Frontend (React + Vite + TypeScript)

<b>Currently in development.</b>

A demo frontend for a Symfony-based blog API. This project is intended for a GitHub portfolio and showcases modern React patterns, routing, forms, rich text editing, and a Material UI-based design system.
## Backend API

This frontend requires the Symfony blog API to be running. You can find the backend project here:
- Symfony Blog Backend Repository: https://github.com/ashilkov/symfony-blog

After starting the backend, configure this app to point to it via the VITE_API_BASE_URL environment variable (see “Configure API Base URL” below). Ensure CORS is configured on the backend to allow requests from the frontend’s origin.

## Tech Stack

- React 19 + React DOM
- TypeScript
- Vite
- React Router
- Material UI (MUI)
- React Hook Form + Yup
- TipTap (rich text editor) + DOMPurify
- ESLint (TypeScript + React Hooks rules)

## Features

- Public blog pages (list, details)
- Client-side routing
- Post creation/editing with a rich text editor
- Form validation (Yup) and controlled forms (React Hook Form)
- Basic HTML sanitization for user-generated content (DOMPurify)
- Responsive UI using MUI

## Getting Started

### Prerequisites

- Node.js LTS (v20+) and npm
- A running Symfony blog API (provide its base URL as an environment variable)

### Installation

```shell script
# Install dependencies
npm install
```


### Configure API Base URL

Set your API base URL for local development. With Vite, environment variables must be prefixed with VITE_.

Create a file named .env (or .env.local) in the project root:

```shell script
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```


Notes:
- Adjust the URL to match your Symfony backend.
- For production builds, set the same variable in your deployment environment.

### Available Scripts

```shell script
# Start dev server (http://localhost:5173 by default)
npm run dev

# Type-check and build for production (output in dist/)
npm run build

# Preview the production build locally
npm run preview

# Lint the project
npm run lint
```


## Project Structure

- src/ — Application source (components, pages, routes, hooks, services)
- public/ — Static assets
- index.html — Vite HTML entry
- vite.config.ts — Vite configuration
- tsconfig*.json — TypeScript configurations
- eslint.config.js — ESLint configuration

Tip: If you add new environment variables, ensure they start with VITE_ so the client can read them.

## Development Notes

- Routing: Implemented with react-router. Prefer loader/actions and data APIs where appropriate.
- Forms: Use react-hook-form with @hookform/resolvers and Yup schemas for validation.
- Editor: TipTap provides rich text; sanitize rendered HTML with DOMPurify.
- UI: MUI components styled with @emotion. Keep theme overrides centralized.
- Types: Keep shared types in a dedicated folder (e.g., src/types).
- Data fetching: Centralize API calls (e.g., src/services/api.ts) and use the configured base URL.
- Accessibility: Prefer semantic elements, label all inputs, and validate color contrast.

## Building and Deploying

1) Build the app:

```shell script
npm run build
```


2) Deploy the dist/ folder to any static host (e.g., Netlify, Vercel, GitHub Pages, Nginx).

For single-page apps with client-side routing, configure your host to serve index.html for unknown routes:
- Netlify: Add a _redirects file with `/* /index.html 200`
- Vercel: Use rewrites in vercel.json
- Nginx: Use `try_files $uri /index.html;`

Set VITE_API_BASE_URL in your host’s environment settings for the backend URL.

## Troubleshooting

- 404s on refresh or deep links: Ensure SPA rewrites are configured (see above).
- CORS errors: Allow the frontend origin in your Symfony API CORS settings.
- Env vars not applied: Confirm variable name starts with VITE_ and rebuild the app.
- Editor HTML not rendering as expected: Ensure sanitized rendering via DOMPurify is used wherever user content displays.

## Contributing

- Create a feature branch
- Keep commits small and purposeful
- Run npm run lint before pushing
- Add/refine types and tests if you introduce new logic

## Roadmap Ideas

- Authentication (JWT) and protected routes
- Pagination and search
- Draft autosave
- Media uploads with progress
- Dark mode via MUI theme toggle

## License

MIT
