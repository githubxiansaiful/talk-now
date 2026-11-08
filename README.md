# TalkNow

> **Create a room. Invite everyone. Talk instantly. No account needed.**

TalkNow is a fast, temporary, link-based group conversation web application. Built for instant discussions with zero signups, zero phone numbers, and zero persistent history.

---

## 🚀 Key Features

- **Zero-Account Group Rooms:** Anyone can create a room, choose a temporary display name, and share an invite link.
- **Ephemeral By Design:** Rooms automatically self-destruct after their configured duration (30m, 1h, 6h, 24h). All messages and temporary sessions are irrevocably purged.
- **Instant Real-Time Chat:** High-speed WebSocket engine powered by Socket.IO for live messaging, online presence, and typing status.
- **Modern Responsive Design:** Crafted with a clean purple visual identity (`#7657E8`), light and dark mode, adaptive drawer on mobile, and spacious multi-panel view on desktop.
- **Creator Room Controls:** End or close conversations on-demand.

---

## 📁 Monorepo Architecture

This project is organized as a **pnpm + Turborepo** monorepo:

```text
talknow/
├── apps/
│   ├── web/                 # Next.js 16 App Router web application & UI
│   └── server/              # Node.js + Express + Socket.IO real-time server
├── packages/
│   ├── shared/              # Shared TypeScript types, Zod schemas, socket events, constants
│   ├── database/            # Prisma schema (PostgreSQL) and database client
│   └── config/              # Shared TypeScript & ESLint configurations
├── docs/                    # Architecture and design guides
├── pnpm-workspace.yaml      # Monorepo workspace configuration
├── turbo.json               # Turbo build orchestration
└── package.json             # Root scripts
```

---

## 🛠️ Quick Start & Development

### 1. Prerequisites
- Node.js >= 20
- pnpm >= 9
- PostgreSQL (Docker or local instance)

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
PORT=4000
WEB_ORIGIN=http://localhost:3000
DATABASE_URL=
SESSION_SECRET=
```

### 4. Database Setup
Generate Prisma client and push schema:
```bash
pnpm db:generate
```

### 5. Run Development Servers
Start both the Next.js web application and the Node.js Socket.IO server in parallel:
```bash
pnpm dev
```
Or run individually:
- Web App: `pnpm dev:web` (http://localhost:3000)
- Socket Server: `pnpm dev:server` (http://localhost:4000)

---

## 🧪 Phase 1 Verification

The Phase 1 release includes:
- [x] Monorepo workspace structure with `@talknow/shared`, `@talknow/database`, `@talknow/server`, `@talknow/web`
- [x] Landing page (`/`) with Hero, Quick Join, Workflow, Feature Matrix, and Footer
- [x] Create Room screen (`/create`) with name generator, duration selector, and capacity options
- [x] Pre-join screen (`/room/[roomCode]`) validating invitation and requesting display name
- [x] Responsive Chat Room (`/room/[roomCode]`) with message list, active member roster, typing indicators, share dialog, and room controls
- [x] Expired room screen (`/expired`)
- [x] Privacy policy (`/privacy`) and Terms of service (`/terms`)
