import type { FloorPlan } from "./types";
import { DEFAULTS } from "./types";

function wall(x1: number, y1: number, x2: number, y2: number) {
  return {
    id: `${x1},${y1}-${x2},${y2}`,
    x1,
    y1,
    x2,
    y2,
    height: DEFAULTS.wallHeight,
    thickness: DEFAULTS.wallThickness,
  };
}

// A small two-room demo footprint (~8m x 6m) used on the landing page.
export const SAMPLE_PLAN: FloorPlan = {
  rooms: [
    {
      id: "living",
      name: "Living",
      points: [
        { x: 0, y: 0 },
        { x: 500, y: 0 },
        { x: 500, y: 600 },
        { x: 0, y: 600 },
      ],
      color: "#2a2f45",
    },
    {
      id: "bedroom",
      name: "Bedroom",
      points: [
        { x: 500, y: 0 },
        { x: 800, y: 0 },
        { x: 800, y: 600 },
        { x: 500, y: 600 },
      ],
      color: "#23283c",
    },
  ],
  walls: [
    wall(0, 0, 800, 0),
    wall(800, 0, 800, 600),
    wall(800, 600, 0, 600),
    wall(0, 600, 0, 0),
    wall(500, 0, 500, 250), // partition with a doorway gap
    wall(500, 400, 500, 600),
  ],
};
