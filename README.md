# Blog API

REST API for a blog: user accounts, posts (drafts and published), comments, and ownership-based access control. Built with Node.js, Express, Prisma and PostgreSQL.

**Live demo:** https://clever-moonbeam-39a68f.netlify.app
**API health check:** https://blog-api-backend-wz4t.onrender.com/api/health
**Frontend repository:** https://github.com/Cheremsha44/blog-frontend

> The API runs on a free Render instance, so the first request after a period of inactivity can take up to ~50 seconds while the server wakes up.

<!-- Add a screenshot or GIF of the app here, e.g. ![Blog](docs/screenshot.png) -->

## Features

- Registration and login with hashed passwords (bcrypt) and JWT authentication
- `GET /api/auth/me` to restore a session from a token
- Posts with draft / published states and paginated public feed
- Comments on published posts
- Ownership checks: only the author can edit or delete their posts and comments
- Input validation, normalized emails, consistent JSON error responses
- CORS allowlist, request logging (morgan)
- Health check endpoints for the server and the database

## Tech stack

| Area      | Tools                                                 |
| --------- | ----------------------------------------------------- |
| Runtime   | Node.js (ES modules)                                  |
| Framework | Express                                               |
| Database  | PostgreSQL (Neon)                                     |
| ORM       | Prisma 7 with the `@prisma/adapter-pg` driver adapter |
| Auth      | jsonwebtoken, bcryptjs                                |
| Hosting   | Render (API), Neon (database)                         |

## API overview

All routes are prefixed with `/api`.

| Method | Path                    | Auth         | Description                                  |
| ------ | ----------------------- | ------------ | -------------------------------------------- |
| POST   | `/auth/registration`    | no           | Create an account, returns `{ user, token }` |
| POST   | `/auth/login`           | no           | Log in, returns `{ user, token }`            |
| GET    | `/auth/me`              | yes          | Current user                                 |
| GET    | `/posts?page=&limit=`   | no           | Published posts, paginated                   |
| GET    | `/posts/mine`           | yes          | Current user's posts, including drafts       |
| GET    | `/posts/:id`            | no           | Single post with author                      |
| POST   | `/posts`                | yes          | Create a post                                |
| PATCH  | `/posts/:id`            | yes (author) | Update a post                                |
| DELETE | `/posts/:id`            | yes (author) | Delete a post                                |
| GET    | `/posts/:id/comments`   | no           | Comments of a published post                 |
| POST   | `/posts/:id/comments`   | yes          | Add a comment                                |
| PATCH  | `/comments/:id`         | yes (author) | Edit a comment                               |
| DELETE | `/comments/:id`         | yes (author) | Delete a comment                             |
| GET    | `/health`, `/health/db` | no           | Server and database status                   |

Authenticated requests send the token as `Authorization: Bearer <token>`.

## Data model

`User` has many `Post` and `Comment`; `Post` has many `Comment`. Posts have a `published` flag (draft by default). Deleting a user or a post cascades to their comments. See [`prisma/schema.prisma`](prisma/schema.prisma).

## Project structure

```
prisma/              schema and migrations
src/
  controllers/       request handlers
  middleware/        auth, ownership and availability checks
  routes/            route definitions
  lib/prisma.js      Prisma client with the pg adapter
  index.js           app entry point
```

## Getting started

Requirements: Node.js 20+ and a PostgreSQL database (local or hosted).

```bash
git clone https://github.com/Cheremsha44/blog-api-backend
cd blog-api-backend
npm install
cp .env.example .env      # then fill in the values
npx prisma migrate dev
npx prisma generate
npm run dev
```

The server starts on `http://localhost:3000`. Check `http://localhost:3000/api/health`.

### Environment variables

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                        |
| `JWT_SECRET`   | Long random string used to sign tokens              |
| `CLIENT_URL`   | Frontend origin allowed by CORS (no trailing slash) |
| `PORT`         | Server port (default `3000`)                        |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Deployment

- **Database:** Neon (PostgreSQL)
- **API:** Render web service
  - Build command: `npm install --production=false && npx prisma generate && npx prisma migrate deploy`
  - Start command: `npm start`
  - Environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`

## Security notes

- Passwords are stored only as bcrypt hashes and are never returned by the API.
- Tokens are signed with a server-side secret and expire after 7 days.
- Ownership is verified on the server for every write operation; the frontend only hides buttons for convenience.
- Login returns the same error for an unknown email and a wrong password.
- Secrets live in environment variables and are not committed.

## Roadmap

- Admin role so only the site owner can publish posts
- Rate limiting on auth routes and security headers (helmet)
- Automated tests for access-control scenarios (supertest)
- Refresh tokens or httpOnly cookies instead of long-lived access tokens

## Author

Built by [Cheremsha44](https://github.com/Cheremsha44).
