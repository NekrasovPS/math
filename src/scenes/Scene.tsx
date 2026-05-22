import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { memo, useState, useEffect } from "react";
import { Cube } from "./Cube";
import { Pyramid } from "./Pyramid";
import { Cylinder } from "./Cylinder";
import { cn } from "../utils/cn";

interface SceneProps {
  side?: number;
  radius?: number;
  height?: number;
  figureType?: "cube" | "pyramid" | "cylinder" | "cone" | "sphere";
  isUnfolded?: boolean;
  selectedFace?: string | null;
  onFaceClick?: (faceId: string) => void;
  autoRotate?: boolean;
  className?: string;
}

function SceneContent({
  side = 2,
  radius = 1.5,
  height = 3,
  figureType = "cube",
  isUnfolded = false,
  selectedFace = null,
  onFaceClick,
  autoRotate = true,
  onLoad,
}: SceneProps & { onLoad: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    onLoad();
  }, [gl, onLoad]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={autoRotate && !isUnfolded}
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      <Environment preset="studio" />

      {figureType === "cube" && (
        <Cube
          side={side}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
        />
      )}

      {figureType === "pyramid" && (
        <Pyramid
          baseSide={side}
          height={height}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
        />
      )}

      {figureType === "cylinder" && (
        <Cylinder
          radius={radius}
          height={height}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
        />
      )}

      {figureType === "cone" && (
        <Pyramid
          baseSide={side}
          height={height}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
        />
      )}

      {figureType === "sphere" && (
        <Cube
          side={side}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
        />
      )}

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4.5}
      />
    </>
  );
}

const MemoizedSceneContent = memo(SceneContent);

export function Scene({
  side = 2,
  radius = 1.5,
  height = 3,
  figureType = "cube",
  isUnfolded = false,
  selectedFace = null,
  onFaceClick,
  autoRotate = true,
  className,
}: SceneProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative w-full h-full min-h-[400px]", className)}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Загрузка 3D сцены...
            </p>
          </div>
        </div>
      )}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5, 5, 5], fov: 50 }}
        onCreated={() => setLoaded(true)}
      >
        <MemoizedSceneContent
          side={side}
          radius={radius}
          height={height}
          figureType={figureType}
          isUnfolded={isUnfolded}
          selectedFace={selectedFace}
          onFaceClick={onFaceClick}
          autoRotate={autoRotate}
          onLoad={() => {}}
        />
      </Canvas>
    </div>
  );
}
