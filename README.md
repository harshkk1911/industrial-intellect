# Industrial Intellect

**Learn. Explore. Innovate.**

MERN learning platform with a public content library and a private admin panel.

## Current structure

- Fixed categories: **Market Intelligence**, **Industrial Skills**, **Soft Skills**, **Others**.
- Home page shows all published videos and resources, with category browsing.
- Category pages show videos and view-only resources for that category.
- No Courses or Blog pages/navigation.
- Video details are loaded from MongoDB by slug, with MongoDB `_id` fallback for older/missing slugs.
- Admin can add/edit/publish/unpublish/delete YouTube videos and must choose one of the four categories.
- Admin can upload PDF, XLS, XLSX and DOCX resources, assign a category, and publish/draft them.
- Resource binaries are stored in MongoDB GridFS, not on Render's temporary local disk.
- Published resources are served through an inline preview endpoint. Excel and Word files are converted to HTML for viewing; PDFs are displayed inline.
- Watch Later, Favourites and completion tracking remain browser-local.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB local or MongoDB Atlas

## Local setup

Terminal 1 — backend:

```powershell
cd server
Copy-Item .env.example .env
npm install
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/industrial_intellect
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

For Atlas, use your Atlas connection string. Keep `.env` private and never commit it.

Terminal 2 — frontend:

```powershell
cd client
Copy-Item .env.example .env
npm install
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start backend (`server` folder):

```powershell
npm run dev
```

Start frontend (`client` folder):

```powershell
npm run dev
```

Open `http://localhost:5173`.

## Admin setup

From `server`:

```powershell
npm run seed:admin -- --email you@example.com --password "Use-A-Strong-Password"
```

Then sign in at `http://localhost:5173/admin/login`.

## Existing content category migration

Older records may have category names such as `Learning Skills`, `Python`, etc. The one-time migration assigns unsupported/legacy category names to **Others**. Run this only after backing up the database:

```powershell
cd server
npm run migrate:categories
```

After migration, edit individual records in Admin to assign the correct category.

## Resource formats and view-only behaviour

Supported uploads: PDF, XLS, XLSX and DOCX; maximum 20 MB per file. The admin uploads files through the authenticated API. GridFS stores the bytes in the connected MongoDB database. The public API only returns published resources.

The viewer does not expose a normal download link and serves files inline. Browser-based viewing cannot provide absolute copy protection: a visitor may still use screenshots, browser tools, or other capture methods. PDF browser viewers may expose their own controls depending on the browser. Do not upload confidential or sensitive documents expecting DRM-level protection.

Other file types should be converted to PDF before upload unless a dedicated safe previewer is added.

## Render deployment

The existing Render **Static Site** deploys only the React frontend. The Express API must also be deployed as a separate Render **Web Service** connected to this same GitHub repository.

### Backend Web Service

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=<MongoDB Atlas connection string>`
  - `JWT_SECRET=<new long random secret>`
  - `JWT_EXPIRES_IN=1d`
  - `CLIENT_ORIGIN=https://<your-render-static-site-domain>`

### Frontend Static Site

- Root Directory: project root (or use the corresponding client directory configuration)
- Build Command: `cd client && npm install && npm run build`
- Publish Directory: `client/dist`
- Environment variable:
  - `VITE_API_URL=https://<your-render-backend-service>.onrender.com/api`

After changing `VITE_API_URL`, trigger a new frontend deployment because Vite embeds it at build time. Deploy the backend before the frontend.

## API overview

- `GET /api/health`
- `GET /api/content?type=video|resource&category=...`
- `GET /api/content/:slug` (also accepts a MongoDB ObjectId)
- `GET /api/content/resources/:id/view` (published resource preview)
- `POST /api/auth/login`
- `GET /api/admin/content?type=video|resource` (JWT required)
- `POST /api/admin/content` (JWT required)
- `PATCH /api/admin/content/:id` (JWT required)
- `DELETE /api/admin/content/:id` (JWT required)
- `POST /api/admin/resources` (JWT required; multipart field name `file`)

## Important

- Never commit `.env` files or expose MongoDB credentials/JWT secrets in frontend variables.
- If credentials were previously shared, rotate them.
- Use HTTPS in production and back up MongoDB Atlas regularly.
- YouTube embedding remains subject to YouTube's own restrictions.
