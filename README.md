# Eclipse of the Final Realm

Production-ready Next.js 15 framework for an official science-fantasy novel universe website. The app intentionally ships with structure only: no fictional lore, characters, factions, cosmology, or story content is generated.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS dark cosmic UI
- PostgreSQL + Prisma ORM
- NextAuth v5 credentials authentication with role support
- Cloudinary media upload endpoint
- Scalable wiki, encyclopedia, chapter publishing, timeline, media, relationship, and search data model

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and set `DATABASE_URL` in `.env`.

4. Generate the Prisma client and push the schema:

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Optional: seed an initial admin account:

   ```bash
   npm run seed
   ```

   Default credentials are `admin@example.com` / `ChangeMe123!`. Change them immediately.

6. Run the app:

   ```bash
   npm run dev
   ```

## Production notes

- Use managed PostgreSQL with connection pooling.
- Configure `AUTH_SECRET`, `AUTH_URL`, and Cloudinary secrets in your host.
- Run `prisma migrate deploy` in CI/CD for production database changes.
- Place a CDN in front of static assets and Cloudinary transformations.
- Restrict admin registration in production by creating admins through the database or an invite flow.

## Content policy

This repository provides only the framework and empty administrative workflows. All universe content must be authored manually through the admin dashboard.

## Authentication troubleshooting

The login form is implemented with an Auth.js server action instead of posting directly to `/api/auth/signin/credentials`. This is important because Auth.js manages CSRF protection internally for server actions. If you see `MissingCSRF`, make sure you are using the current `src/app/login/page.tsx` implementation and that `AUTH_URL` matches the URL you use in the browser, for example `http://localhost:3000` during local development.

## Admin content studio

The admin dashboard includes a responsive content upload studio for Characters, Articles, Timeline entries, Factions, and Cosmology. These forms collect the required title/name, biography or description text, and image uploads such as landscape banners, character portraits, and faction logos. Images are uploaded through the Cloudinary-backed `/api/upload` route and stored as reusable media assets before being attached to the created record.
