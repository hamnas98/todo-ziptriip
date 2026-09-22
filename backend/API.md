# API Documentation — Ziptrrip Todo

Base URL (local): `http://localhost:5000/api`
Base URL (production): `https://todo-ziptriip-api.onrender.com/api`

All responses follow one of two shapes:

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Human-readable error message" }
```

---

## Health Check

### `GET /health`

Confirms the API is running.

**Success Response — 200**
```json
{ "success": true, "message": "API is healthy" }
```

---

## Create Todo

### `POST /todos`

**Request Body**
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Cannot be empty or whitespace-only |
| `description` | string | No | Defaults to `""` |

**Example Request**
```json
{
  "title": "Learn Node.js",
  "description": "Study backend concepts"
}
```

**Success Response — 201**
```json
{
  "success": true,
  "data": {
    "_id": "68abc123...",
    "title": "Learn Node.js",
    "description": "Study backend concepts",
    "completed": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**
| Status | Cause | Message |
|---|---|---|
| 400 | `title` missing | `Title is required` |
| 400 | `title` empty/whitespace-only | `Title cannot be empty` |

---

## Get All Todos

### `GET /todos`

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive substring match on `title` |
| `completed` | `"true"` \| `"false"` | Filters by completion status |

Both are optional and can be combined (AND logic). Omitting a param means "don't filter on that field."

**Examples**

GET /api/todos
GET /api/todos?search=node
GET /api/todos?completed=true
GET /api/todos?search=node&completed=false


`GET /api/todos?search=node&completed=false` — returns todos whose title contains "node" (case-insensitive) **and** are not yet completed.

**Success Response — 200**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "title": "Learn Node.js", "description": "...", "completed": false, "createdAt": "...", "updatedAt": "..." }
  ]
}
```
Results are sorted newest-first (`createdAt` descending).

---

## Get Single Todo

### `GET /todos/:id`

**Path Parameter**
| Param | Type | Notes |
|---|---|---|
| `id` | string | Must be a valid MongoDB ObjectId |

**Example**

GET /api/todos/68abc123f1a2b3c4d5e6f7a8


**Success Response — 200**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "...", "description": "...", "completed": false, "createdAt": "...", "updatedAt": "..." }
}
```

**Error Responses**
| Status | Cause | Message |
|---|---|---|
| 400 | `id` is not a valid ObjectId format | `Invalid todo ID` |
| 404 | `id` is valid format but no matching document | `Todo not found` |

---

## Update Todo

### `PUT /todos/:id`

**Request Body** (all fields optional — only include what you want to change)
| Field | Type | Notes |
|---|---|---|
| `title` | string | If provided, cannot be empty/whitespace-only |
| `description` | string | |
| `completed` | boolean | Must be a real boolean, not a string |

**Example Request**
```json
{
  "title": "Learn Node.js deeply",
  "description": "Study advanced Node.js concepts",
  "completed": true
}
```

**Success Response — 200**
```json
{
  "success": true,
  "data": { "_id": "...", "title": "Learn Node.js deeply", "description": "...", "completed": true, "createdAt": "...", "updatedAt": "..." }
}
```

**Error Responses**
| Status | Cause | Message |
|---|---|---|
| 400 | `id` invalid format | `Invalid todo ID` |
| 400 | `title` provided but empty | `Title cannot be empty` |
| 400 | `completed` provided but not a boolean | `Completed must be a boolean` |
| 404 | `id` valid but no matching document | `Todo not found` |

---

## Delete Todo

### `DELETE /todos/:id`

**Path Parameter**
| Param | Type | Notes |
|---|---|---|
| `id` | string | Must be a valid MongoDB ObjectId |

**Success Response — 200**
```json
{ "success": true, "data": {} }
```

**Error Responses**
| Status | Cause | Message |
|---|---|---|
| 400 | `id` invalid format | `Invalid todo ID` |
| 404 | `id` valid but no matching document | `Todo not found` |

---

## HTTP Status Code Summary

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation failure or malformed ID |
| 404 | Not Found | Unmatched route, or valid ID with no matching document |
| 500 | Internal Server Error | Unexpected/unhandled error — message is generic, real error is logged server-side only |