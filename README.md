# Industrial Intellect

**Learn. Explore. Innovate.**

MERN learning platform with a public content library and a private admin panel. Public videos, categories, playlists and articles are loaded from MongoDB through the Express API; the frontend no longer imports hardcoded sample content.

## Current functionality

- React + Vite frontend with responsive layout and dark/light theme toggle.
- Public Home, Categories, Courses/Playlists, Video details, Watch Later, Favourites, About, Contact and Blog pages.
- Public video catalogue and video detail pages loaded from MongoDB.
- Categories and playlist names derived from published MongoDB videos; published course/article records are also fetched from the API.
- YouTube thumbnails, embedded playback and an external YouTube link.
- Browser-local Watch Later, Favourites and completion tracking (not synced across devices).
- Express + MongoDB API; admin login with bcrypt password hashing and JWT.
- Admin can add, edit, publish/unpublish and delete YouTube videos, including category, course title, tags and featured status.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Local MongoDB or MongoDB Atlas

## 1. Install dependencies

From the project root, use two terminals or run these commands sequentially:

```powershell
cd server
Copy-Item .env.example .env
npm install

cd ..\client
Copy-Item .env.example .env
npm install
```

If `.env` already exists, do not overwrite it; edit it instead.

## 2. Configure the backend

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/industrial_intellect
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your own Atlas connection string. Do not commit or share `.env` files.

## 3. Configure the frontend

For local development, `client/.env` should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

When deploying, set `VITE_API_URL` in your frontend hosting environment to the deployed backend API base URL, for example `https://your-api.example.com/api`. Rebuild/redeploy the frontend after changing this variable. Also set backend `CLIENT_ORIGIN` to the exact deployed frontend origin (no path).

## 4. Create the first Super Admin

From the `server` directory:

```powershell
npm run seed:admin -- --email you@example.com --password "Use-A-Strong-Password"
```

Use a password of at least 12 characters. The script creates the Super Admin only if that email does not already exist.

## 5. Run locally

Terminal 1 — backend:

```powershell
cd server
npm run dev
```

Terminal 2 — frontend:

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`. Admin login: `http://localhost:5173/admin/login`.

## 6. Add your first video

1. Sign in at `/admin/login` with the Super Admin credentials created above.
2. Open the Admin workspace and choose **Add video**.
3. Enter a title, YouTube URL, description, category and optional course/playlist title and tags.
4. Choose **Published** to make it visible publicly, or **Draft** to keep it private.
5. Save. The video is stored in MongoDB and appears on the public site after refresh.

The public video detail route uses the MongoDB document's `slug`, not the old frontend sample array. A video in Draft or Archived status is intentionally not visible publicly.

## API overview

- `GET /api/health`
- `GET /api/content` — public published content; supports `type`, `category`, `course`, `search`, `sort`, `page`, `limit`
- `GET /api/content/:slug` — public published content detail
- `POST /api/auth/login` — admin login
- `GET /api/auth/me` — current admin profile (JWT required)
- `POST /api/admin/content` — create content (JWT required)
- `PATCH /api/admin/content/:id` — update content (JWT required)
- `DELETE /api/admin/content/:id` — delete content (JWT required)
- `GET /api/admin/dashboard` — database counts (JWT required)

## Important limitations / next phase

- Admin UI currently manages YouTube videos; course/article authoring screens and admin-user management are not implemented yet.
- Categories and playlist groups are currently derived from video `category` and `courseTitle` fields.
- Cloud uploads, production analytics, quizzes, newsletter, PWA and AI assistant are later phases.
- Watch Later, Favourites and completion progress are browser-local.
- Configure production HTTPS, CORS, backups, monitoring, rate limits, SEO metadata, sitemap and security review before public launch.

## YouTube usage

Only embed videos you are authorized to use. YouTube may still restrict embedding for some videos or playback contexts even when the creator has enabled embedding. The site also provides an external YouTube link. Do not download/rehost other creators' videos without permission.
