# Ziptrrip Todo — Backend

A REST API for a Todo application, built as a technical assignment for Ziptrrip. Provides full CRUD, search, filtering, validation, and centralized error handling for a Todo resource, backed by MongoDB Atlas.

## Project Overview

This backend is an API-only Express server — no server-side rendering, no templating engine. It exposes a RESTful `/api/todos` resource consumed by a separate React frontend.

## Features

- Full CRUD on todos (create, list, get by ID, update, delete)
- Case-insensitive search on todo title via `?search=`
- Filter by completion status via `?completed=true|false`
- Search and filter combine (AND logic) when both are provided
- Backend request validation (missing/empty title, invalid boolean on update)
- Centralized error handling with consistent `{ success, message }` / `{ success, data }` response envelope
- Distinct HTTP status codes: `400` (validation/invalid ID), `404` (not found), `500` (unexpected server error)
- Health check endpoint (`GET /api/health`)
- 15 automated unit/integration tests (Jest + Supertest + mongodb-memory-server)
- Postman collection covering every endpoint, including error scenarios

## Tech Stack

- **Runtime:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose (ODM)
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Middleware:** dotenv, cors, helmet, morgan
- **Deployment:** Render

## Architecture

React (client)
↓ Axios
Express Router → Controller → Service → Mongoose Model → MongoDB Atlas


- **Routes** map HTTP verb + path to a controller, and attach validation middleware where relevant.
- **Controllers** only handle `req`/`res` — extract input, call the service, shape the HTTP response.
- **Services** hold all business logic and are the only layer that talks to Mongoose. They throw errors (with a `.statusCode`) rather than responding directly, which keeps them unit-testable in isolation and framework-agnostic.
- **Centralized error middleware** catches everything thrown anywhere in the request lifecycle and formats it consistently.

This separation is what let us write Supertest tests directly against the Express `app` (no real server/port needed) and get full coverage of both success and error paths without duplicating response-shaping logic per-route.

## Project Structure

backend/
├── src/
│ ├── config/database.js # MongoDB connection logic
│ ├── controllers/todo.controller.js
│ ├── models/todo.model.js # Mongoose schema
│ ├── routes/todo.routes.js
│ ├── services/todo.service.js # Business logic, query building
│ ├── middlewares/
│ │ ├── error.middleware.js # Centralized error handler
│ │ └── notFound.middleware.js # 404 for unmatched routes
│ ├── validations/todo.validation.js
│ ├── app.js # Express app config (no .listen())
│ └── server.js # Entry point — connects DB, starts server
├── tests/
│ ├── setup.js # In-memory MongoDB test helpers
│ └── todo.test.js # Full test suite
├── postman/
│ └── Ziptrrip-Todo.postman_collection.json
├── .env.example
└── package.json


## Prerequisites

- Node.js 18+
- A MongoDB Atlas account (free tier is sufficient) with a cluster and database user created

## Installation

```bash
git clone https://github.com/hamnas98/todo-ziptriip
cd ziptrrip-todo/backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `5000`) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `CLIENT_URL` | The frontend's origin, for CORS (e.g. `http://localhost:5173` locally) |
| `NODE_ENV` | `development` or `production` |

## Running the Backend

```bash
npm run dev     # development, with auto-restart via nodemon
npm start       # production
```

Server starts on `http://localhost:5000` (or your configured `PORT`).

## Running Tests

```bash
npm test
```

Runs the full Jest suite (15 tests) against an isolated in-memory MongoDB instance (via `mongodb-memory-server`) — no connection to your real Atlas cluster is made during testing, and no test data ever touches your dev/production database.

**Note:** the first run downloads a MongoDB binary for the in-memory server (a few hundred MB) and may take a couple of minutes; subsequent runs use the cached binary and complete in a few seconds.

## Postman Collection

Located at `postman/Ziptrrip-Todo.postman_collection.json`.

**To use it:**
1. Open Postman → **File → Import** → select the file.
2. The collection includes a `baseUrl` variable (defaults to `http://localhost:5000/api`) — update it if testing against the deployed Render URL.
3. Folders: **Health Check**, **Todos - CRUD**, **Search & Filter**, **Error Cases**.
4. Run "Create Todo" first — it auto-captures the created todo's ID into a `todoId` collection variable, which the other CRUD requests reuse automatically.

See [`API.md`](./API.md) for full endpoint documentation.

## Deployment

**Backend → Render:**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `CLIENT_URL` (set to the deployed frontend's URL), `NODE_ENV=production`

MongoDB Atlas Network Access must allow connections from Render (simplest: allow `0.0.0.0/0` — see Known Limitations).

## Live Application

- **Frontend:** `https://todo-ziptriip.vercel.app/todos`
- **Backend API:** `https://todo-ziptriip-api.onrender.com/api

## Known Limitations

- MongoDB Atlas Network Access is set to allow all IPs (`0.0.0.0/0`) rather than a restricted IP allowlist, since Render's free tier doesn't provide static outbound IPs. A production system would use Atlas's static-IP add-on or VPC peering instead.
- Search uses a MongoDB regex match on `title`; special regex characters in a search term are not escaped, so characters like `.` or `*` are interpreted as regex syntax rather than literal characters. Acceptable for this assignment's scope; a production system would escape user input before building the regex.
- Render's free tier spins down after inactivity — the first request after a period of idleness can take 30–60 seconds to respond while the instance wakes up.
- No authentication/authorization layer — intentionally out of scope per the assignment brief.

## Future Improvements

- Pagination on `GET /api/todos` for large datasets
- Rate limiting on write endpoints
- Escaping/sanitizing the search regex input
- Soft-delete instead of hard delete, with an "undo" window in the UI