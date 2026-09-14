"use client";

import { ContactShadows, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Quaternion, Vector2, Vector3, type Group, type Mesh } from "three";
import { playClick, playTick } from "@/lib/fidget-audio";
import type { CubeFace } from "@/lib/resume";

const SIZE = 2.4;
const HALF = SIZE / 2 + 0.02;

const FACE_DEFS: {
  id: CubeFace;
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  shade: string;
  materialIndex: number;
}[] = [
  { id: "skills", text: "SKILLS", position: [HALF, 0, 0], rotation: [0, Math.PI / 2, 0], shade: "#2c2c2c", materialIndex: 0 },
  { id: "experience", text: "XP", position: [-HALF, 0, 0], rotation: [0, -Math.PI / 2, 0], shade: "#262626", materialIndex: 1 },
  { id: "fidget", text: "CLICK", position: [0, HALF, 0], rotation: [-Math.PI / 2, 0, 0], shade: "#444444", materialIndex: 2 },
  { id: "contact", text: "PING", position: [0, -HALF, 0], rotation: [Math.PI / 2, 0, 0], shade: "#1f1f1f", materialIndex: 3 },
  { id: "about", text: "ABOUT", position: [0, 0, HALF], rotation: [0, 0, 0], shade: "#3a3a3a", materialIndex: 4 },
  { id: "projects", text: "SYSTEMS", position: [0, 0, -HALF], rotation: [0, Math.PI, 0], shade: "#343434", materialIndex: 5 },
];

function faceFromNormal(n: Vector3): CubeFace {
  const ax = Math.abs(n.x);
  const ay = Math.abs(n.y);
  const az = Math.abs(n.z);
  if (ax >= ay && ax >= az) return n.x >= 0 ? "skills" : "experience";
  if (ay >= ax && ay >= az) return n.y >= 0 ? "fidget" : "contact";
  return n.z >= 0 ? "about" : "projects";
}

type CubeProps = {
  damping: number;
  reducedMotion: boolean;
  muted: boolean;
  onSelectFace: (face: CubeFace) => void;
};

function FidgetCube({ damping, reducedMotion, muted, onSelectFace }: CubeProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const hovered = useRef(false);
  const dragging = useRef(false);
  const snapping = useRef(false);
  const last = useRef(new Vector2());
  const travel = useRef(0);
  const pendingFace = useRef<CubeFace | null>(null);
  const angVel = useRef(new Vector3(0, reducedMotion ? 0 : 0.55, 0));
  const targetQuat = useRef(new Quaternion());
  const scale = useRef(1);
  const axisX = useMemo(() => new Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new Vector3(0, 1, 0), []);
  const axisZ = useMemo(() => new Vector3(0, 0, 1), []);
  const { gl, size } = useThree();

  const decay = 0.92 + (1 - damping) * 0.078;

  const materials = useMemo(() => {
    const list = Array.from({ length: 6 }, () => ({
      color: new Color("#2a2a2a"),
      emissive: new Color("#111111"),
    }));
    for (const face of FACE_DEFS) {
      list[face.materialIndex].color = new Color(face.shade);
    }
    return list;
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    if (snapping.current) {
      g.quaternion.slerp(targetQuat.current, Math.min(1, dt * 10));
      if (g.quaternion.angleTo(targetQuat.current) < 0.012) {
        g.quaternion.copy(targetQuat.current);
        snapping.current = false;
      }
    } else if (!dragging.current && !reducedMotion) {
      g.rotateOnWorldAxis(axisX, angVel.current.x * dt);
      g.rotateOnWorldAxis(axisY, angVel.current.y * dt);
      g.rotateOnWorldAxis(axisZ, angVel.current.z * dt);
      angVel.current.multiplyScalar(decay);
    } else if (reducedMotion && !dragging.current) {
      angVel.current.set(0, 0, 0);
    }

    const targetScale = hovered.current ? 1.06 : 1;
    scale.current += (targetScale - scale.current) * 0.18;
    g.scale.setScalar(scale.current);
  });

  return (
    <group ref={group}>
      <mesh
        ref={mesh}
        castShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
          snapping.current = false;
          travel.current = 0;
          last.current.set(e.clientX, e.clientY);
          pendingFace.current = e.face ? faceFromNormal(e.face.normal) : null;
          playTick(muted);
          (e.target as HTMLElement | undefined)?.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current || !group.current) return;
          const dx = e.clientX - last.current.x;
          const dy = e.clientY - last.current.y;
          travel.current += Math.hypot(dx, dy);
          last.current.set(e.clientX, e.clientY);
          const nx = dx / Math.max(1, size.width);
          const ny = dy / Math.max(1, size.height);
          const rx = ny * 6.2;
          const ry = nx * 6.2;
          group.current.rotateOnWorldAxis(axisX, rx);
          group.current.rotateOnWorldAxis(axisY, ry);
          angVel.current.set(rx * 22, ry * 22, (nx - ny) * 5);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          gl.domElement.style.cursor = hovered.current ? "grab" : "auto";
          if (travel.current < 9 && pendingFace.current && group.current) {
            const face = pendingFace.current;
            const local = FACE_DEFS.find((f) => f.id === face)!;
            const normal = new Vector3(...local.position).normalize();
            targetQuat.current.setFromUnitVectors(normal, new Vector3(0, 0, 1));
            snapping.current = true;
            angVel.current.set(0, 0, 0);
            onSelectFace(face);
            playClick(muted);
          }
          pendingFace.current = null;
          try {
            (e.target as HTMLElement | undefined)?.releasePointerCapture?.(e.pointerId);
          } catch {
            /* already released */
          }
        }}
        onPointerOver={() => {
          hovered.current = true;
          gl.domElement.style.cursor = "grab";
        }}
        onPointerOut={() => {
          hovered.current = false;
          if (!dragging.current) gl.domElement.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[SIZE, SIZE, SIZE]} />
        {materials.map((m, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={m.color}
            emissive={m.emissive}
            roughness={0.42}
            metalness={0.28}
          />
        ))}
      </mesh>
      {FACE_DEFS.map((face) => (
        <Text
          key={face.id}
          position={face.position}
          rotation={face.rotation}
          fontSize={0.28}
          color="#e5e5e5"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {face.text}
        </Text>
      ))}
      <mesh>
        <boxGeometry args={[SIZE + 0.02, SIZE + 0.02, SIZE + 0.02]} />
        <meshBasicMaterial color="#e5e5e5" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export type FidgetCubeSceneProps = CubeProps;

export default function FidgetCubeScene(props: FidgetCubeSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={["#121212"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.15}
        color="#f0f0f0"
        castShadow
      />
      <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#888888" />
      <FidgetCube {...props} />
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.45}
        scale={8}
        blur={2.2}
        far={4}
        color="#000000"
      />
    </Canvas>
  );
}
