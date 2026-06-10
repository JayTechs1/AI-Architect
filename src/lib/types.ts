// The floor-plan document model. This is the single source of truth that the
// 2D editor writes and the 3D renderer reads. Coordinates are in centimetres
// on a top-down plane (x = east, y = south). The 3D scene maps y -> z.

export type Point = { x: number; y: number };

export type Wall = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  height: number; // cm
  thickness: number; // cm
};

export type Room = {
  id: string;
  name: string;
  points: Point[]; // polygon, clockwise
  color: string; // hex, used as floor colour
};

export type FloorPlan = {
  walls: Wall[];
  rooms: Room[];
};

export const EMPTY_PLAN: FloorPlan = { walls: [], rooms: [] };

export const DEFAULTS = {
  wallHeight: 270, // cm — standard ceiling height
  wallThickness: 12, // cm
} as const;

export function parsePlan(raw: string | null | undefined): FloorPlan {
  if (!raw) return { ...EMPTY_PLAN };
  try {
    const parsed = JSON.parse(raw);
    return {
      walls: Array.isArray(parsed.walls) ? parsed.walls : [],
      rooms: Array.isArray(parsed.rooms) ? parsed.rooms : [],
    };
  } catch {
    return { ...EMPTY_PLAN };
  }
}

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
