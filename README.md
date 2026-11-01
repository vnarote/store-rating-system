# Store Rating Management System

Full-stack app where users rate stores from 1 to 5. Three roles share one login:
**SYSTEM_ADMIN**, **NORMAL_USER** and **STORE_OWNER**.

**Stack:** Node.js, Express, PostgreSQL, Sequelize (migrations + seeders), JWT, bcryptjs, express-validator · React (Vite), React Router, Axios, Tailwind CSS, Context API.

## Prerequisites
Node.js 18+, PostgreSQL 13+ running locally.

## Backend setup
```bash
cd server
cp .env.example .env          # set DB_PASSWORD and a long random JWT_SECRET
npm install
npm run db:setup              # creates the database, runs migrations, seeds demo data
npm run dev                   # http://localhost:5000/api/health
```
If the database already exists or your user cannot create databases, create it manually and run
`npm run db:migrate && npm run db:seed`.

Other scripts: `npm run db:migrate:undo`, `npm run db:seed:undo`, `npm run lint`, `npm run format`.

## Frontend setup
```bash
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173
```

## Seeded login credentials
| Role | Email | Password |
|---|---|---|
| System admin | admin@storerating.com | Admin@1234 |
| Normal user | user1@storerating.com | User@1234 |
| Normal user | user2@storerating.com | User@1234 |
| Store owner (2 stores) | owner1@storerating.com | Owner@1234 |
| Store owner (1 store) | owner2@storerating.com | Owner@1234 |

## Testing with Postman
Import `postman/StoreRating.postman_collection.json`, then run the whole collection with the
Collection Runner (in order, on a freshly seeded database). It saves tokens and ids automatically and
asserts status codes for: registration/login, invalid credentials, invalid/missing JWT, role access (403),
duplicate rating (409), rating modification, invalid rating values, owner access to another owner's store,
admin creating users/stores, and search/filter/sort/pagination. The auth rate limiter allows 20 login/register
calls per 15 minutes per IP (`AUTH_RATE_LIMIT_MAX`); raise it if you re-run the collection repeatedly.

API reference with examples: [`docs/API.md`](docs/API.md).

## Project layout
```
server/src
  config/ models/ migrations/ seeders/ constants/ utils/ middlewares/ routes/
  modules/{auth,users,stores,ratings,admin,owner}   # routes → controller → service
client/src
  api/ components/{common,auth,stores}/ context/ hooks/ layouts/ pages/{auth,admin,user,owner,common}/ utils/
```

## Design decisions and assumptions
- **Layering:** routes declare endpoints and middleware, controllers handle HTTP, services hold business logic.
  The `users` module only contains shared rules and services (no public routes), because user management goes through
  `/auth` and `/admin`.
- **Average rating** is computed on every read with a SQL aggregate, so it can never go stale.
- **One rating per user per store:** checked in the service (409 with a clear message), backed by a unique index
  `(userId, storeId)` and a `CHECK (rating BETWEEN 1 AND 5)` constraint. Changing a rating uses `PATCH /api/ratings/:id`.
- **Foreign keys:** deleting a user or store cascades to their ratings; a user who owns stores cannot be deleted (`RESTRICT`).
- **Search:** `GET /api/stores/search` from the brief would duplicate `GET /api/stores`, so name/address search is done with
  `?name=` and `?address=` on the list endpoint.
- **Store owners** may own several stores (as in the data model). Owner endpoints return every store they own and only
  ever query by the authenticated owner's id.
- **Name rule (20–60 chars)** is applied to users and stores. Address is optional for users and required for stores.
- **Roles:** the DB is the source of truth. The JWT carries `userId` and `role` but the role is re-read from the database on
  every request. Public registration always creates `NORMAL_USER`; extra fields such as `role` are ignored.
- **Transactions:** every write here is a single statement, protected by DB constraints, so no multi-step transaction is needed.
- **Sorting** only accepts allow-listed fields; `%` and `_` in search text are escaped.

## JWT storage trade-offs
The API reads `Authorization: Bearer <token>`, so the token must be available to JavaScript. This project keeps it in
`localStorage` with a 1-day expiry, automatic logout on any 401, Helmet headers, and React's default output escaping.
- `localStorage`: simple, works across tabs, no CSRF risk; but any XSS can read the token.
- httpOnly cookie: JavaScript cannot read it, which limits XSS damage; but it needs CSRF protection (SameSite + token),
  and a different middleware.
For production with stricter requirements, move to httpOnly, Secure, SameSite cookies plus short-lived access tokens with refresh.
Frontend route guards are only UX; every endpoint is protected by backend authentication and role checks.

## Updating dependencies
`bcryptjs` is used instead of native `bcrypt` so the server runs on any Node version (including Node 24) with no compiling.
To move every package to its newest release:
```bash
npx npm-check-updates -u && npm install     # run in both server/ and client/
```
