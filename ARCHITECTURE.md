# Architecture

This project is a framework-only official universe site for `Eclipse of the Final Realm`. It contains no generated lore, factions, characters, realms, cosmology, cultivation systems, or fictional entries.

## Application layers

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: shared layout, admin, and UI components.
- `src/lib`: database, authentication, Cloudinary, authorization, and utility helpers.
- `prisma/schema.prisma`: canonical PostgreSQL data model.

## Scalability model

- Articles, chapters, characters, factions, media, timeline events, categories, tags, custom fields, and relationships are separate indexed tables.
- `Relationship` stores polymorphic references so new entity classes can be linked without creating a bespoke join table for every pair.
- `CustomFieldDefinition` plus `CustomField` allows admins to extend characters, factions, articles, and timeline events without code changes.
- Published content uses `PublishStatus`, `publishedAt`, and `scheduledFor` to support draft mode and scheduled publishing.
- Public content pages are dynamic server-rendered to avoid build-time database dependency and support continuously updated content.

## Recommended production additions

- Add PostgreSQL full-text indexes or OpenSearch/Meilisearch when content volume reaches tens of thousands of rows.
- Add audit logs and version history for wiki edits.
- Add invite-only admin onboarding and email verification.
- Replace the quick-create admin proof of concept with rich CRUD screens and a TipTap/Lexical editor bound to JSON fields.
- Add object-level permissions if multiple editors manage different content domains.
