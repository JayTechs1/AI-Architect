"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Grid,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import type { FloorPlan, Wall, Room } from "@/lib/types";

// Plan units are centimetres; the 3D scene works in metres.
const CM = 0.01;

function WallMesh({ wall }: { wall: Wall }) {
  const { position, rotation, length } = useMemo(() => {
    const x1 = wall.x1 * CM;
    const z1 = wall.y1 * CM;
    const x2 = wall.x2 * CM;
    const z2 = wall.y2 * CM;
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);
    return {
      length: len,
      position: [(x1 + x2) / 2, (wall.height * CM) / 2, (z1 + z2) / 2] as const,
      rotation: [0, -angle, 0] as const,
    };
  }, [wall]);

  if (length <= 0) return null;

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[length, wall.height * CM, wall.thickness * CM]} />
      <meshStandardMaterial color="#d8d4cb" roughness={0.85} metalness={0.02} />
    </mesh>
  );
}

function RoomFloor({ room }: { room: Room }) {
  const geometry = useMemo(() => {
    if (room.points.length < 3) return null;
    const shape = new THREE.Shape();
    room.points.forEach((p, i) => {
      const x = p.x * CM;
      const y = p.y * CM;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    geo.rotateX(Math.PI / 2); // lay flat on the ground plane
    return geo;
  }, [room.points]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} position={[0, 0.005, 0]} receiveShadow>
      <meshStandardMaterial
        color={room.color}
        roughness={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Building({ plan }: { plan: FloorPlan }) {
  // Center the whole model so it sits over the origin regardless of where it
  // was drawn on the 2D canvas.
  return (
    <Center disableY>
      <group>
        {plan.rooms.map((room) => (
          <RoomFloor key={room.id} room={room} />
        ))}
        {plan.walls.map((wall) => (
          <WallMesh key={wall.id} wall={wall} />
        ))}
      </group>
    </Center>
  );
}

export default function Scene3D({
  plan,
  light = false,
}: {
  plan: FloorPlan;
  light?: boolean;
}) {
  const isEmpty = plan.walls.length === 0 && plan.rooms.length === 0;
  const bg = light ? "#eef0f3" : "#0a0b0f";

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [8, 7, 10], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 30, 75]} />

        <ambientLight intensity={light ? 0.8 : 0.5} />
        <directionalLight
          position={[10, 18, 8]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={60}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        <Building plan={plan} />

        <Grid
          args={[60, 60]}
          cellSize={1}
          cellThickness={0.5}
          cellColor={light ? "#d3d6dd" : "#1f2335"}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={light ? "#b9bdc8" : "#2c3150"}
          fadeDistance={45}
          fadeStrength={1}
          infiniteGrid
          position={[0, 0, 0]}
        />
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          scale={40}
          blur={2}
          far={20}
        />
        <Environment preset="city" />

        <OrbitControls
          makeDefault
          enableDamping
          minDistance={3}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 1, 0]}
        />
      </Canvas>

      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg border border-border bg-surface/80 px-5 py-3 text-sm text-muted backdrop-blur">
            Draw walls on the plan to see your building rise in 3D
          </div>
        </div>
      )}
    </div>
  );
}
