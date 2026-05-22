import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  Group,
  MathUtils,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { Edges } from "@react-three/drei";

interface PyramidProps {
  baseSide?: number;
  height?: number;
  isUnfolded?: boolean;
  selectedFace?: string | null;
  onFaceClick?: (faceId: string) => void;
  autoRotate?: boolean;
}

const faceNames = ["base", "front", "back", "left", "right"];

// Создаём треугольную геометрию для грани пирамиды
function createTriangleGeometry(base: number, height: number): BufferGeometry {
  const geometry = new BufferGeometry();
  const vertices = new Float32Array([
    // Треугольник с основанием base и высотой height
    // Вершина вверху по Y, основание внизу
    0,
    height / 2,
    0, // вершина
    -base / 2,
    -height / 2,
    0, // левый нижний угол
    base / 2,
    -height / 2,
    0, // правый нижний угол
  ]);
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function Pyramid({
  baseSide = 2,
  height = 3,
  isUnfolded = false,
  selectedFace = null,
  onFaceClick,
  autoRotate = true,
}: PyramidProps) {
  const groupRef = useRef<Group>(null);
  const faceGroupRefs = useRef<{ [key: string]: Group }>({});
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const halfBase = baseSide / 2;
  const slantHeight = Math.sqrt(height * height + halfBase * halfBase);
  const faceAngle = Math.atan(height / halfBase);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !isUnfolded) {
      groupRef.current.rotation.y += delta * 0.2;
    }

    // Анимация развёртки
    faceNames.forEach((faceName) => {
      const faceGroup = faceGroupRefs.current[faceName];
      if (faceGroup) {
        const target = isUnfolded ? unfolded[faceName] : assembled[faceName];

        faceGroup.position.x = MathUtils.lerp(
          faceGroup.position.x,
          target.pos[0],
          delta * 5,
        );
        faceGroup.position.y = MathUtils.lerp(
          faceGroup.position.y,
          target.pos[1],
          delta * 5,
        );
        faceGroup.position.z = MathUtils.lerp(
          faceGroup.position.z,
          target.pos[2],
          delta * 5,
        );

        faceGroup.rotation.x = MathUtils.lerp(
          faceGroup.rotation.x,
          target.rot[0],
          delta * 5,
        );
        faceGroup.rotation.y = MathUtils.lerp(
          faceGroup.rotation.y,
          target.rot[1],
          delta * 5,
        );
        faceGroup.rotation.z = MathUtils.lerp(
          faceGroup.rotation.z,
          target.rot[2],
          delta * 5,
        );
      }
    });
  });

  // Развёртка - крест вокруг основания
  const unfolded: Record<
    string,
    { pos: [number, number, number]; rot: [number, number, number] }
  > = {
    base: { pos: [0, 0, 0], rot: [0, 0, 0] },
    front: { pos: [0, -halfBase - slantHeight / 2, 0], rot: [0, 0, 0] },
    back: { pos: [0, halfBase + slantHeight / 2, 0], rot: [0, 0, Math.PI] },
    left: {
      pos: [-halfBase - slantHeight / 2, 0, 0],
      rot: [0, 0, Math.PI / 2],
    },
    right: {
      pos: [halfBase + slantHeight / 2, 0, 0],
      rot: [0, 0, -Math.PI / 2],
    },
  };

  // Сбранная пирамида
  const assembled: Record<
    string,
    { pos: [number, number, number]; rot: [number, number, number] }
  > = {
    base: { pos: [0, -height / 2, 0], rot: [0, 0, 0] },
    front: { pos: [0, 0, halfBase], rot: [-faceAngle, 0, 0] },
    back: { pos: [0, 0, -halfBase], rot: [faceAngle, 0, Math.PI] },
    left: { pos: [-halfBase, 0, 0], rot: [0, 0, faceAngle] },
    right: { pos: [halfBase, 0, 0], rot: [0, 0, -faceAngle] },
  };

  const getFaceColor = useCallback(
    (faceName: string): string => {
      if (selectedFace === faceName) return "#aa3bff";
      if (hoveredFace === faceName) return "#c084fc";

      const baseColors: Record<string, string> = {
        base: "#4c1d95",
        front: "#8b5cf6",
        back: "#7c3aed",
        left: "#6d28d9",
        right: "#5b21b6",
      };

      return baseColors[faceName] || "#8b5cf6";
    },
    [selectedFace, hoveredFace],
  );

  const handleClick = useCallback(
    (faceName: string) => {
      if (onFaceClick) {
        onFaceClick(faceName);
      }
    },
    [onFaceClick],
  );

  const faces = useMemo(() => {
    return faceNames.map((faceName) => {
      const pos = assembled[faceName].pos;
      const rot = assembled[faceName].rot;

      return (
        <group
          key={faceName}
          ref={(el) => {
            if (el) faceGroupRefs.current[faceName] = el;
          }}
          position={pos}
          rotation={rot}
        >
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleClick(faceName);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredFace(faceName);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHoveredFace(null);
              document.body.style.cursor = "auto";
            }}
          >
            {faceName === "base" ? (
              // Квадратное основание
              <planeGeometry args={[baseSide, baseSide]} />
            ) : (
              // Треугольная грань
              <primitive
                object={createTriangleGeometry(baseSide, slantHeight)}
              />
            )}
            <meshStandardMaterial
              color={new Color(getFaceColor(faceName))}
              transparent
              opacity={0.92}
              side={2}
            />
            <Edges
              scale={1.01}
              lineWidth={2}
              color="#ffffff"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      );
    });
  }, [baseSide, slantHeight, getFaceColor, handleClick]);

  return <group ref={groupRef}>{faces}</group>;
}
