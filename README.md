# Blog API - Frontend Clients

A collection of frontend clients (Author and Reader) that consume the Blog REST API, demonstrating API integration, token-based authentication, and handling of HTTP requests with headers.

## Purpose

These clients demonstrate how to interact with a REST API from the frontend, including:

- Making authenticated requests with JWT tokens
- Setting and using Authorization headers
- Handling API responses (success and error)
- CRUD operations via API calls

## Live Demo

[Author Client](https://leandroesposito.github.io/top-blog-api-clients/author/) | [Reader Client](https://leandroesposito.github.io/top-blog-api-clients/reader/)

## API repository

[Github](https://github.com/leandroesposito/top-blog-api)

## API Integration Overview

### Base API URL

```
https://top-blog-api-xqzb.onrender.com
```

### API Service Class

The `ApiService` class handles all HTTP requests to the backend:

```javascript
class ApiService {
  static async makeRequest(
    endpoint,
    method,
    data = null,
    includeToken = false,
  ) {
    const options = {
      mode: "cors",
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Add Authorization header if required
    if (includeToken) {
      options.headers.Authorization = localStorage.getItem("token") || null;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetch(endpoint, options).then((response) => response.json());
  }
}
```

## Authentication

### Token Storage

Tokens are stored in `localStorage` after successful login:

```javascript
// After login response
localStorage.setItem("username", result.username);
localStorage.setItem("userId", result.userId);
localStorage.setItem("token", result.token); // Format: "bearer eyJhbGc..."
```

### Authorization Header

The token is automatically added to authenticated requests:

```javascript
// Request headers when includeToken = true
{
  "Content-Type": "application/json",
  "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login Flow

```javascript
// POST /log-in
const result = await fetch("https://top-blog-api-xqzb.onrender.com/log-in", {
  method: "POST",
  body: JSON.stringify({ username, password }),
  headers: { "Content-Type": "application/json" },
});

// Store token on success
if (result.username && result.token) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("username", result.username);
  localStorage.setItem("userId", result.userId);
}
```

### Logout

```javascript
function handleLogOut() {
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.reload();
}
```

## API Endpoints Used

### Public Endpoints (No Token Required)

| Method | Endpoint                  | Purpose                  | Client           |
| ------ | ------------------------- | ------------------------ | ---------------- |
| `GET`  | `/posts`                  | List all published posts | Reader           |
| `GET`  | `/posts/:postId`          | Get single post          | Reader           |
| `POST` | `/posts/:postId/comments` | Add comment to post      | Reader           |
| `POST` | `/log-in`                 | Authenticate user        | Author           |
| `POST` | `/sign-up`                | Create account           | (Not in clients) |

### Protected Endpoints (Token Required)

| Method   | Endpoint                | Purpose                       | Client |
| -------- | ----------------------- | ----------------------------- | ------ |
| `GET`    | `/posts/author/:userId` | Get user's posts (all status) | Author |
| `POST`   | `/posts`                | Create new post               | Author |
| `PUT`    | `/posts/:postId`        | Update post                   | Author |
| `DELETE` | `/posts/:postId`        | Delete post                   | Author |
| `DELETE` | `/comments/:commentId`  | Delete comment                | Author |

## Client Structure

```
frontend/
├── api-service.js      # Shared API request service
├── render-service.js   # Shared DOM rendering utilities
├── style.css           # Shared styles
├── index.html          # Client selection page
├── author/             # Author client (authenticated)
│   ├── index.html      # Author dashboard
│   ├── log-in.html     # Login page
│   ├── scripts.js      # Author functionality
│   └── auth-service.js # Authentication helper
└── reader/             # Reader client (public)
    ├── index.html      # Blog reader view
    └── scripts.js      # Reader functionality
```

## Author Client

The Author client provides full CRUD capabilities for blog posts.

### Features

- **Login** - Authenticate to receive JWT token
- **View my posts** - See all posts (including unpublished drafts)
- **Create post** - POST `/posts` with title, content, publish status
- **Edit post** - PUT `/posts/:id` to update
- **Delete post** - DELETE `/posts/:id`
- **Delete comments** - DELETE `/comments/:id` (on own posts)

### API Calls (Author)

```javascript
// Get user's posts (includes unpublished)
ApiService.getUserPosts(userId, true); // includeToken = true

// Create post
ApiService.createPost({ title, content, "is-published": true });

// Edit post
ApiService.editPost({ id, title, content, "is-published": false });

// Delete post
ApiService.deletePost(postId);

// Delete comment
ApiService.deleteComment(commentId);
```

### Authentication Check

```javascript
// Redirect to login if not authenticated
if (!authService.isLogedIn()) {
  window.location.href = "./log-in.html";
}

// authService methods
authService.isLogedIn(); // Checks localStorage for token
authService.username; // Gets stored username
authService.userId; // Gets stored user ID
authService.token; // Gets stored token
```

## Reader Client

The Reader client provides public access to published blog content.

### Features

- **View all published posts** - GET `/posts`
- **View single post** - GET `/posts/:id`
- **Add comments** - POST `/posts/:id/comments` (no token required)

### API Calls (Reader)

```javascript
// Get all published posts (no token needed)
ApiService.getAllPosts();

// Get single post
ApiService.getPostById(postId);

// Add comment (no token needed)
ApiService.createComment(postId, {
  "author-name": "John",
  content: "Great post!",
});
```

## Request Examples

### Login Request

```javascript
// Request
POST /log-in
Content-Type: application/json

{
  "username": "author123",
  "password": "myPassword"
}

// Response (success)
{
  "username": "author123",
  "userId": "abc123",
  "token": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response (error)
{
  "errors": ["Invalid username or password!"]
}
```

### Create Post Request (Authenticated)

```javascript
// Request
POST /posts
Authorization: bearer eyJhbGc...
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the post content...",
  "is-published": true
}

// Response (success)
{
  "success": "Post created succesfully!",
  "post": { "id": "123", "title": "My First Post", ... }
}

// Response (error)
{
  "errors": ["Post title can't be empty!"]
}
```

### Add Comment Request (Public)

```javascript
// Request
POST /posts/123/comments
Content-Type: application/json

{
  "author-name": "Reader Name",
  "content": "This is my comment"
}

// Response (success)
{
  "success": "Comment created succesfully!",
  "comment": { "id": "456", "authorName": "Reader Name", ... }
}
```

## Shared Services

### ApiService Methods

| Method                        | Endpoint                    | Auth Required |
| ----------------------------- | --------------------------- | ------------- |
| `getAllPosts()`               | `GET /posts`                | ❌ No         |
| `getPostById(id)`             | `GET /posts/:id`            | ❌ No         |
| `getUserPosts(userId, token)` | `GET /posts/author/:userId` | ✅ Yes        |
| `createPost(post)`            | `POST /posts`               | ✅ Yes        |
| `editPost(post)`              | `PUT /posts/:id`            | ✅ Yes        |
| `deletePost(id)`              | `DELETE /posts/:id`         | ✅ Yes        |
| `createComment(postId, data)` | `POST /posts/:id/comments`  | ❌ No         |
| `deleteComment(id)`           | `DELETE /comments/:id`      | ✅ Yes        |

### RenderService Methods

| Method                            | Purpose                          |
| --------------------------------- | -------------------------------- |
| `createPostElem(post)`            | Generate post HTML from API data |
| `createCommentElem(comment)`      | Generate comment HTML            |
| `createCommentForm()`             | Generate comment form HTML       |
| `displayErrors(errors)`           | Show error messages              |
| `displaySuccess(message)`         | Show success messages            |
| `showLoading()` / `hideLoading()` | Toggle loading spinner           |

## Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         READER FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Page Load → GET /posts → Display posts                         │
│                    ↓                                            │
│  User clicks "Leave a comment" → Show comment form              │
│                    ↓                                            │
│  Submit comment → POST /posts/:id/comments → Add comment to DOM │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         AUTHOR FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Login → POST /log-in → Store token in localStorage             │
│                    ↓                                            │
│  Dashboard → GET /posts/author/:userId (with token header)      │
│                    ↓                                            │
│  Create Post → POST /posts (with token) → Add post to DOM       │
│                    ↓                                            │
│  Edit Post → GET /posts/:id → PUT /posts/:id (with token)       │
│                    ↓                                            │
│  Delete Post → DELETE /posts/:id (with token) → Remove from DOM │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## CORS Configuration

The frontend uses `mode: "cors"` in fetch requests:

```javascript
const options = {
  mode: "cors", // Required for cross-origin requests
  method,
  headers: { "Content-Type": "application/json" },
};
```

The backend is configured to accept requests from this frontend origin.

## Final Notes

### API Integration

- **Fetch API** - `fetch()` with options for method, headers, body
- **CORS** - `mode: "cors"` enables cross-origin requests
- **JSON** - Request and response bodies are JSON formatted

### Token Authentication

- **Storage** - JWT tokens stored in `localStorage`
- **Header** - `Authorization: bearer <token>` for authenticated requests
- **Conditional** - `includeToken` flag determines if header is added

### Request Patterns

- **GET** - Retrieve data (posts, comments)
- **POST** - Create resources (posts, comments, login)
- **PUT** - Update existing resources (edit posts)
- **DELETE** - Remove resources (posts, comments)

### Response Handling

- **Success** - Check for `success` or `post`/`comment` properties
- **Errors** - Check for `errors` array and display to user
- **Loading States** - Show/hide spinners during async operations
