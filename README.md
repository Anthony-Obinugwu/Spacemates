# Spacemates 🚀

A modern housing marketplace, roommate compatibility engine, and trust system built for the Nigerian market (and beyond). Spacemates connects property owners, agents, and individuals looking for roommates or entire properties, powered by a deterministic compatibility matching algorithm.

---

## 🌟 Core Features

- **Compatibility Matching Engine**: A highly performant PostgreSQL RPC that calculates match percentages based on lifestyle preferences and hard dealbreakers (budget, pets, cleanliness).
- **Address Privacy (NDPA Compliant)**: strict separation of public property data and private exact coordinates utilizing PostgreSQL Views.
- **Role-Based Access Control**: Built-in architecture for Property Owners, Managers, and Guests, enforced at the database layer via Row Level Security (RLS).
- **Real-Time Messaging**: Built-in live chat powered by Supabase Realtime (WebSockets).
- **Escrow Application Lifecycle**: State-machine driven application system (PENDING, ACCEPTED, ESCROW_FUNDED, FAILED) with roommate group cascading failure triggers.
- **Trust & Safety / Admin**: Integrated moderation queues and strict 30-day data retention enforcement (via `pg_cron`) for NDPA/GDPR compliance.

---

## 🛠 Tech Stack

- **Frontend Framework**: [Next.js App Router (React 19)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase (PostgreSQL)](https://supabase.com/)
- **Language**: TypeScript

---

## 📁 Architecture

Spacemates follows a **Modular Monolith** architecture with PostgreSQL as the absolute source of truth. 

- **Database Layer (`supabase/migrations`)**: Contains the core logic, including RLS policies, PostgreSQL Views (for privacy), Triggers (for cascading state), and RPC functions (for matching).
- **Next.js Edge Middleware (`src/middleware.ts`)**: Handles strict routing logic to bounce users pending onboarding and guards `/admin` routes.
- **UI Architecture (`src/app`)**: Divided into domain-specific routes (`/search`, `/list`, `/profile`, `/applications`, `/messages`, `/admin`).

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Anthony-Obinugwu/Spacemates.git
cd Spacemates
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Ensure you run all migrations in the `supabase/migrations` folder sequentially against your Supabase project.

### 5. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🛡️ License & Contact
Developed by Anthony Obinugwu.
