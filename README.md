# DevPulse Backend - Issue Tracking & Management System API

DevPulse Backend is a robust, enterprise-grade RESTful API built with Node.js, Express, TypeScript, and PostgreSQL. It features secure JWT authentication, role-based access control (RBAC), advanced database filtering, real-time search capabilities, and a comprehensive dashboard statistics engine.

## 🚀 Features

- **Robust Authentication**: Secure User Registration and Login using `bcrypt` password hashing and `jsonwebtoken` (JWT).
- **Role-Based Access Control (RBAC)**: Distinct access tiers for `contributor` and `maintainer` roles via a centralized middleware guard.
- **Comprehensive Issues CRUD**: Full tracking system allowing users to create, read, update, and delete issue nodes securely.
- **Advanced Query Engine**: Dynamic server-side filtering by `status`, `type`, and case-insensitive partial text `search` (using PostgreSQL `ILIKE`).
- **Dashboard Summary Aggregations**: Optimized single-trip SQL raw analytical query compiling entire database metrics.
- **Enterprise Error Infrastructure**: Centralized global error handling mechanism paired with generic 404 handler matrix.

## 🛠️ Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js with TypeScript
- **Database Matrix**: PostgreSQL (Using native `pg` connection pool)
- **Security & Tokens**: Bcrypt, JWT (JSON Web Tokens)
- **HTTP Architecture**: Http-Status-Codes

## 📋 API Endpoints Matrix

### Authentication Module

| Method | Endpoint           | Access | Description                              |
| :----- | :----------------- | :----- | :--------------------------------------- |
| `POST` | `/api/auth/signup` | Public | Registers a new user node                |
| `POST` | `/api/auth/login`  | Public | Validates credentials & yields JWT token |

### Issues Module

| Method   | Endpoint                    | Access                   | Description                                   |
| :------- | :-------------------------- | :----------------------- | :-------------------------------------------- |
| `POST`   | `/api/issues`               | Contributor / Maintainer | Commits a new issue record                    |
| `GET`    | `/api/issues`               | Contributor / Maintainer | Fetches all issues (Supports Search & Filter) |
| `GET`    | `/api/issues/stats/summary` | Contributor / Maintainer | Compiles dashboard count statistics           |
| `GET`    | `/api/issues/:id`           | Contributor / Maintainer | Resolves a singular issue profile by ID       |
| `PATCH`  | `/api/issues/:id`           | Maintainer Only          | Updates existing issue dynamic vectors        |
| `DELETE` | `/api/issues/:id`           | Maintainer Only          | Purges an issue record from database          |

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and append the following configuration:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_matrix_key
# Connection string for your PostgreSQL instance (e.g., Neon or Local)
DATABASE_URL=postgresql://user:password@host:port/database_name
```

## 🏃‍♂️ Local Installation & Setup

**1. Clone the repository:**

```bash
git clone [https://github.com/aamamunszone/devpulse-backend.git](https://github.com/aamamunszone/devpulse-backend.git)
cd devpulse-backend
```

**2. Install all required dependencies:**

```bash
npm install
```

**3. Run database migrations/scripts** in your PostgreSQL instance to set up `users` and `issues` tables.

**4. Boot the development environment server:**

```bash
npm run dev
```
