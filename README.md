# DevPulse Backend

A production-ready Issue Tracking & Management REST API - built with Node.js, Express, TypeScript, and PostgreSQL. It handles everything from secure JWT auth and role-based permissions to smart filtering, real-time search, and dashboard analytics. All in one clean, well-structured codebase.

**Live API:** [https://devpulse-backend-zeta.vercel.app](https://devpulse-backend-zeta.vercel.app)

---

## Why I Built This

Most issue trackers are either too bloated or too bare-bones. I wanted something in the middle - lean enough to understand quickly, but solid enough to actually use in production. DevPulse is that thing.

---

## What's Inside

### Authentication

Users register and log in with bcrypt-hashed passwords. A JWT token comes back on successful login - that token is what gates everything else.

### Role-Based Access Control (RBAC)

Two roles. Two different levels of power:

- **Contributor** - can create and view issues
- **Maintainer** - can do all of that, plus update and delete

The permission checks live in a centralized middleware, so there's no scattered role logic cluttering the route handlers.

### Issues CRUD

Full lifecycle management for issues. Create them, read them, update them, delete them. Each operation is protected based on who's asking.

### Advanced Filtering & Search

The `GET /api/issues` endpoint isn't just a dumb list fetch. You can filter by status, filter by type, and do partial text search (case-insensitive, powered by PostgreSQL's `ILIKE`). All server-side, all efficient.

### Dashboard Stats

One endpoint, one optimized SQL query, full picture. `GET /api/issues/stats/summary` gives you aggregated counts across the whole database without hammering it with multiple round trips.

### Error Handling

A global error handler catches what needs catching. A 404 middleware handles everything else. No unhandled rejections, no cryptic error dumps.

---

## Tech Stack

| Layer          | Tool                                              |
| -------------- | ------------------------------------------------- |
| Runtime        | Node.js                                           |
| Framework      | Express.js + TypeScript                           |
| Database       | PostgreSQL (Neon Cloud, via `pg` connection pool) |
| Auth           | bcrypt + JWT                                      |
| HTTP Utilities | http-status-codes                                 |

---

## API Reference

### Authentication

| Method | Endpoint           | Who Can Use It | What It Does               |
| ------ | ------------------ | -------------- | -------------------------- |
| `POST` | `/api/auth/signup` | Public         | Register a new user        |
| `POST` | `/api/auth/login`  | Public         | Log in and get a JWT token |

### Issues

| Method   | Endpoint                    | Who Can Use It           | What It Does                                   |
| -------- | --------------------------- | ------------------------ | ---------------------------------------------- |
| `POST`   | `/api/issues`               | Contributor / Maintainer | Create a new issue                             |
| `GET`    | `/api/issues`               | Contributor / Maintainer | List all issues (with search & filter support) |
| `GET`    | `/api/issues/stats/summary` | Contributor / Maintainer | Get dashboard counts and stats                 |
| `GET`    | `/api/issues/:id`           | Contributor / Maintainer | Fetch a single issue by ID                     |
| `PATCH`  | `/api/issues/:id`           | Maintainer only          | Update an existing issue                       |
| `DELETE` | `/api/issues/:id`           | Maintainer only          | Delete an issue                                |

---

## Getting Started Locally

### 1. Clone the repo

```bash
git clone https://github.com/aamamunszone/devpulse-backend.git
cd devpulse-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_matrix_key

# PostgreSQL connection string (Neon Cloud or local)
DATABASE_URL=postgresql://user:password@host/database_name?sslmode=require
```

### 4. Run database migrations

Run the migration scripts against your PostgreSQL instance to set up the `users` and `issues` tables.

### 5. Start the dev server

```bash
npm run dev
```

That's it. Hit `http://localhost:5000` and you're live.

---

## Deployment

The API is deployed on Vercel and connected to a Neon Cloud PostgreSQL instance. The serverless setup keeps things lightweight - no server to babysit, no idle costs.

---

## Project Structure

```
devpulse-backend/
├── src/
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth guard, RBAC, error handler
│   ├── routes/           # Endpoint definitions
│   ├── db/               # PostgreSQL pool and query helpers
│   └── index.ts          # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Contributing

Found a bug? Have an idea? Open an issue or send a PR. I keep the review cycle short.

---

## License

MIT - use it, fork it, build on it.
