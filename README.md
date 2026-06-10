# ◢ AI Architect

A web studio for **architects and builders** to draft floor plans in 2D and
explore them as **live 3D models** in the same window — with accounts so every
project is saved.

This is the first foundation build. It's intentionally self-contained (no
external services or API keys) so it runs anywhere with a single `npm install`.

## Features

- **Landing page** with a live, interactive 3D building preview.
- **Email/password accounts** — sign up, sign in, sign out. Sessions are signed
  JWTs stored in an httpOnly cookie.
- **Project dashboard** — create, open and delete projects.
- **2D floor-plan editor** — draw walls on a snapping grid with live
  dimensions, pan, zoom, erase and undo.
- **3D renderer** — your plan extrudes into a shaded, walk-around model in real
  time (lighting, shadows, orbit controls) via Three.js / React Three Fiber.
- **Autosave** — edits persist to the database automatically.

## Tech stack

| Layer       | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19 + TypeScript   |
| Styling     | Tailwind CSS v4                                   |
| 3D          | Three.js, @react-three/fiber, @react-three/drei   |
| Auth        | jose (JWT) + bcryptjs, httpOnly cookie session    |
| Database    | Prisma 6 + SQLite (swap to Postgres later)        |

## Getting started

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # then set a real AUTH_SECRET (openssl rand -base64 32)
npm run db:push        # create the SQLite database
npm run dev            # http://localhost:3000
```

## How the editor works

The single source of truth is a **floor-plan document** (`src/lib/types.ts`):

```ts
type FloorPlan = {
  walls: { x1; y1; x2; y2; height; thickness }[]; // centimetres
  rooms: { name; points; color }[];
};
```

The 2D editor writes this document; the 3D scene reads it and extrudes each
wall into a box and each room into a floor. Adding doors, windows, multiple
floors, or measurements later just means extending this document and the two
renderers that consume it.

## Project structure

```
src/
  app/
    page.tsx                 # landing page
    (auth)/login, signup     # auth pages
    dashboard/               # project list
    projects/[id]/           # the editor (2D + 3D)
    api/                     # auth + projects REST endpoints
  components/
    editor/
      FloorPlanEditor.tsx    # 2D canvas editor
      Scene3D.tsx            # React Three Fiber scene
      ProjectEditor.tsx      # editor shell + autosave
    AuthForm.tsx, DashboardClient.tsx, HeroDemo.tsx
  lib/
    auth.ts, prisma.ts, types.ts, samplePlan.ts
  middleware.ts              # route protection
prisma/schema.prisma         # User + Project models
```

## Roadmap ideas

- Doors & windows, multi-storey buildings, roofs
- Drag-to-edit existing walls, room auto-detection from enclosed walls
- Materials / textures and export (glTF, image render, PDF plan)
- Team workspaces and sharing
- AI-assisted layout generation from a brief
