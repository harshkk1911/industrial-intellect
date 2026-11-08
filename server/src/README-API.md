# API notes

All admin endpoints require `Authorization: Bearer <JWT>`.

## Role policy starter

The current middleware protects the admin API behind authentication. The content CRUD routes are open to all three authenticated roles as a minimal starter. Before production, tighten permissions by content type:

- `super_admin`: all content types and admin account management.
- `content_admin`: video, course and category types.
- `editor`: article and resource types.

Implement that fine-grained type policy before inviting other admins. The role names and model are in place, but a full admin user-management UI and audit trail are not yet included.
