# ContentProof

Verify digital files before you trust them. Register files, prove their integrity, detect any modification — in seconds.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4** + shadcn/ui (manual install)
- **Neon** (PostgreSQL)
- **Clerk** (Auth — Magic Link / Email)
- **SHA-256** in the browser via Web Crypto API

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Neon database

1. Go to [neon.tech](https://neon.tech) and create a project
2. Open the **SQL editor** and run the contents of `db/schema.sql`
3. Copy your connection string

### 3. Set up Clerk

1. Go to [clerk.com](https://clerk.com) and create an application
2. Enable **Email** sign-in (Magic Link or Password)
3. Copy your **Publishable key** and **Secret key**

### 4. Configure environment variables

Edit `.env.local` and fill in your values:

```env
DATABASE_URL=postgresql://...your-neon-connection-string...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push the repo to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://contentproof.vercel.app`)
5. Deploy

---

## Project structure

```
app/
  page.tsx              # Landing page
  dashboard/page.tsx    # User dashboard (auth-protected)
  verify/page.tsx       # Public verify tool
  proof/[id]/page.tsx   # Public proof certificate page
  auth/page.tsx         # Sign-in page
  api/
    proofs/route.ts     # GET user proofs / POST register proof
    verify/route.ts     # POST verify a hash
    proof/[id]/route.ts # GET single proof by short_id
components/
  nav.tsx               # Navigation
  file-hasher.tsx       # Drag-and-drop file to SHA-256
  proof-card.tsx        # Proof list item
  trust-badge.tsx       # Green/red verified badge
  copy-button.tsx       # Click-to-copy
  ui/                   # Primitive UI components
lib/
  neon.ts               # Neon SQL client
  hash.ts               # SHA-256 hashing utilities
  types.ts              # TypeScript interfaces
  utils.ts              # cn() helper
db/
  schema.sql            # PostgreSQL schema for Neon
middleware.ts           # Clerk auth protection
```

---

## How it works

1. **Register** — Drop a file. Your browser computes SHA-256 locally. We store the hash and metadata in Neon.
2. **Verify** — Drop any file. We compute its hash and look it up. Match = untampered.
3. **Share** — Every proof gets a short URL (`/proof/a3f9b2c1`) that works as a public certificate.
