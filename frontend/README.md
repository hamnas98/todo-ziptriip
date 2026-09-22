# Ziptrrip Todo — Frontend

React + Vite frontend for the Ziptrrip Todo technical assignment. Consumes the backend REST API (see [`../backend`](../backend)).

## Features

- Todo list page (`/todos`) — display, create, search, filter, mark complete/incomplete, delete
- Todo details page (`/todo?id=<id>`) — reads the todo ID from a query parameter (per the assignment's requirement), fetches and displays a single todo
- Debounced search (300ms) — avoids firing a request on every keystroke
- Loading, empty, and error states throughout
- Inline delete confirmation (click once to arm, again to confirm)
- Responsive layout

## Tech Stack

React, Vite, React Router, Axios, Tailwind CSS.

## Page Design & the MPA Requirement

The assignment calls for the application to be a Multiple Page Application rather than a single conventional SPA. We use React Router for client-side routing, with two clearly separated, independently-responsible pages:

- `/todos` — the list page, owns its own data-fetching, search/filter state, and mutation handlers
- `/todo?id=<id>` — the details page, reads `id` from the URL's query string (via `useSearchParams`), fetches and renders that one todo independently of the list page's state

This is the standard, idiomatic way to structure page separation in a modern React application: distinct routes, each with its own responsibility and its own data-fetching lifecycle, rather than one monolithic page conditionally rendering different views based on internal state. React Router's client-side routing model is what's used throughout the professional React ecosystem for exactly this kind of page-level separation, and is the intended interpretation here rather than a literal multi-entry-point build.

## Project Structure

frontend/
├── src/
│ ├── components/ # TodoCard, TodoForm, LoadingState, EmptyState, ErrorState
│ ├── pages/ # Todos.jsx, TodoDetails.jsx
│ ├── services/ # todoApi.js — centralized Axios layer
│ ├── router/ # AppRouter.jsx
│ ├── hooks/ # useDebounce.js
│ ├── App.jsx
│ └── main.jsx
├── .env.example
└── package.json



## Prerequisites

- Node.js 18+
- The backend running locally (or a deployed backend URL)

## Installation

```bash
npm install
```

## Environment Variables

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## Running the Frontend

```bash
npm run dev
```

Runs at `http://localhost:5173` by default.

## Deployment

**Frontend → Vercel:**
- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` set to the deployed backend's URL + `/api`

**Note:** Vite bakes environment variables into the build at build time, not runtime. Changing `VITE_API_URL` after the first deploy requires triggering a redeploy for the change to take effect.

## Live Application

`https://todo-ziptriip.vercel.app/`