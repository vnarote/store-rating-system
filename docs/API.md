# API reference

Base URL: `http://localhost:5000/api` · Auth: `Authorization: Bearer <token>`

Success: `{ "success": true, "message": "...", "data": {} }`
Error: `{ "success": false, "message": "...", "errors": [{ "field": "...", "message": "..." }] }`

Status codes: 200, 201, 400 bad request (bad pagination/sort/filter), 401 missing/invalid/expired token or bad credentials,
403 wrong role or not your resource, 404, 409 duplicate, 422 validation, 429 too many auth attempts, 500.

**Lists** accept `page`, `limit` (max 100), `sortBy`, `sortOrder` (`asc|desc`) and return
`{ items: [], pagination: { page, limit, total, totalPages } }`.

**Validation:** name 20–60 chars · address ≤ 400 · password 8–16 chars with an uppercase letter and a special character ·
standard email · rating integer 1–5 · UUID params.

## Auth
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /auth/register | public | always `NORMAL_USER` |
| POST | /auth/login | public | |
| GET | /auth/me | any role | |
| PATCH | /auth/change-password | any role | `{ currentPassword, newPassword }` |

```http
POST /api/auth/login
{ "email": "user1@storerating.com", "password": "User@1234" }

200 { "success": true, "message": "Login successful",
      "data": { "token": "<jwt>", "user": { "id": "…", "name": "Normal User Account Number One",
      "email": "user1@storerating.com", "address": "…", "role": "NORMAL_USER" } } }

401 { "success": false, "message": "Invalid email or password", "errors": [] }
```

## Admin (SYSTEM_ADMIN)
| Method | Path | Notes |
|---|---|---|
| GET | /admin/dashboard | `{ totalUsers, totalStores, totalRatings }` |
| POST | /admin/users | `{ name, email, password, address?, role }` role = any of the three |
| GET | /admin/users | filters `name,email,address,role`; sort `name,email,address,role,createdAt` |
| GET | /admin/users/:id | store owners also include `stores`, `rating`, `totalRatings` |
| POST | /admin/stores | `{ name, email, address, ownerId }` owner must be a STORE_OWNER |
| GET | /admin/stores | filters `name,email,address`; sort `name,email,address,averageRating,createdAt` |
| GET | /admin/stores/:id | includes owner, `averageRating`, `ratingCount` |

```http
GET /api/admin/stores?name=green&sortBy=averageRating&sortOrder=desc
200 { "data": { "items": [ { "id": "…", "name": "Green Valley Supermarket Plaza", "email": "contact@greenvalley.com",
      "address": "…", "averageRating": 4, "ratingCount": 2 } ],
      "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 } } }
```

## Stores (NORMAL_USER)
| Method | Path | Notes |
|---|---|---|
| GET | /stores | search `name`, `address`; sort `name,address,averageRating,createdAt`; includes `myRating`, `myRatingId` |
| GET | /stores/:id | store details with `averageRating`, `ratingCount`, `myRating`, `myRatingId` |

## Ratings (NORMAL_USER)
| Method | Path | Notes |
|---|---|---|
| POST | /ratings | `{ storeId, rating }`; 409 if already rated |
| PATCH | /ratings/:id | `{ rating }`; 403 if the rating belongs to someone else |
| GET | /ratings/my-ratings | sort `updatedAt,createdAt,rating,storeName` |

```http
POST /api/ratings   { "storeId": "<uuid>", "rating": 4 }
201 { "message": "Rating submitted successfully",
      "data": { "rating": { "id": "…", "rating": 4 }, "store": { "averageRating": 4, "ratingCount": 1, "myRating": 4 } } }

POST /api/ratings   { "storeId": "<uuid>", "rating": 9 }
422 { "success": false, "message": "Validation failed", "errors": [{ "field": "rating", "message": "Rating must be an integer between 1 and 5" }] }
```

## Store owner (STORE_OWNER)
| Method | Path | Notes |
|---|---|---|
| GET | /owner/dashboard | `{ stores, averageRating, totalRatings }` |
| GET | /owner/store | `{ stores: [...] }` the owner's stores with average ratings |
| GET | /owner/ratings | users who rated the owner's stores; optional `storeId` (403 if not owned); sort `createdAt,rating,userName,storeName` |
