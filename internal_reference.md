# Spacemates Architecture Internal Reference

This document serves as the internal architectural reference for all development.

## Core Principles
- **Modular Monolith**: Start with a modular monolith using Next.js/React, Supabase (Postgres, Auth, Storage, Realtime, Edge Functions), and TypeScript. Avoid microservices initially.
- **Source of Truth**: PostgreSQL is the source of truth. Use Row Level Security (RLS) for strong authorization at the database/API boundary.
- **Asynchronous Processing**: Use background jobs/Edge functions for event-driven workflows (e.g., matching, payment events) only where it provides value.
- **Separation of Entities**: Property ≠ Listing, User ≠ Roommate, User ≠ Owner. These are roles/capabilities, not permanent identity states.

## Resolved Design Decisions
1. **Trust & Safety vs Payments**: The platform will act as an escrow, holding funds until successful move-in.
2. **Roommate Group Lifecycle**: If a member drops out or fails to pay, the group's application transitions to `FAILED`.
3. **Cold Start & Market Liquidity**: Stick to strict hard filters initially.
4. **Data Retention & NDPA**: Users will be soft-deleted initially (anonymized), followed by a strict hard deletion enforced after 30 days.
5. **Private Identity Documents Bucket**: Raw identity documents will be retained for a period of 150 days for audit purposes after verification.

## Database Schema Modules
- `auth`: (managed by Supabase)
- `public`: profiles, user_roles, properties, property_units, listings, listing_expenses, property_amenities, preference_questions, user_preferences, matches, roommate_groups, applications, conversations, messages, reviews, reports, payment_intents, payments, payment_events.

## API Rules
- Do not expose all columns through APIs. Use DTOs to separate public from private data (e.g., never expose NIN or full passport details).
- API endpoints must enforce business actions (e.g., `POST /api/listings/:id/publish`), not just CRUD.

## Compliance
Follow NDPA guidelines. Separate identity documents into a highly restricted bucket.

*Reference this file before making major design additions.*
