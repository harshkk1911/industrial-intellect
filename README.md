# Industrial Intellect

**Learn. Explore. Innovate.**

Initial MERN starter project for a public learning platform with a private, role-based admin area.

## Included in this starter

- React + Vite frontend with responsive layout and dark/light theme toggle.
- Public pages: Home, Categories, Courses/Playlists, Video details, Watch Later, Favourites, About, Contact and Blog.
- YouTube video cards with thumbnail generation, embedded playback and an "Open on YouTube" link.
- Browser-local Watch Later, Favourites and course progress (no public user accounts).
- Express + MongoDB API foundation.
- Admin email/password login using bcrypt password hashing and JWT.
- Admin roles: `super_admin`, `content_admin`, `editor`.
- Content model and protected CRUD endpoints for videos, courses, categories and articles.
- Basic health endpoint and environment templates.

## Important scope notes

This is a **starter foundation**, not a production-complete platform. Cloud media storage, production-grade analytics, file upload workflows, email/newsletter, quizzes, PWA and AI features are intentionally left for later phases. The current video catalogue is seeded with sample records in the frontend; admin CRUD is backed by MongoDB.

The admin login is not publicly self-registering. Create the first Super Admin using the seed script.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB local instance or MongoDB Atlas connection string

## 1. Install dependencies

From the project root:

```bash
cd server
cp .env.example .env
npm install

cd ../client
npm install
```

On Windows PowerShell, copy environment files with:

```powershell
Copy-Item .env.example .env
```

## 2. Configure the backend

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://industrial_admin:harshkk1911@rajeshcluster.rjvzduj.mongodb.net/industrial_intellect?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

Use a unique, random JWT secret. Never commit `.env`.

## 3. Create the first Super Admin

From the `server` directory:

```bash
npm run seed:admin -- --email you@example.com --password "Use-A-Strong-Password"
```

The script creates a Super Admin only if that email does not already exist.

## 4. Run the application

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Open http://localhost:5173

Admin login: http://localhost:5173/admin/login

## API overview

- `GET /api/health`
- `GET /api/content` — public published content, supports `type`, `category`, `course`, `search`, `sort`, `page`, `limit`
- `GET /api/content/:slug` — public published content detail
- `POST /api/auth/login` — admin login
- `GET /api/auth/me` — current admin profile (JWT required)
- `POST /api/admin/content` — create content (role protected)
- `PATCH /api/admin/content/:id` — update content
- `DELETE /api/admin/content/:id` — delete content
- `GET /api/admin/dashboard` — basic database counts

Roles:
- `super_admin`: all admin operations and user management foundation
- `content_admin`: video/course/category content management
- `editor`: articles and resource content management

The starter intentionally does not expose public admin signup. Add a carefully controlled Super Admin user-management workflow before inviting additional admins.

## YouTube links

The frontend derives a thumbnail from supported YouTube URLs. YouTube embedding can be disabled by the video owner or restricted by YouTube; the site therefore also provides an external YouTube link.

Only embed videos you are authorized to use. Keep the original creator attribution and do not download/rehost other creators' videos without permission.

## Production checklist before launch

- Use HTTPS and a production-grade `JWT_SECRET`.
- Restrict CORS to the real domain.
- Add request logging, monitoring and backups.
- Add server-side validation and rate limits appropriate to deployment.
- Add a secure admin user-management flow and audit log.
- Add cloud object storage / video streaming provider integration.
- Add file type, size and malware checks before enabling uploads.
- Add privacy notice and consent-aware analytics.
- Review accessibility, SEO metadata, sitemap and structured data.
- Configure MongoDB Atlas network access and database backups.
