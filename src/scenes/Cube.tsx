import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MathUtils } from "three";
import { Edges } from "@react-three/drei";

interface CubeProps {
  side?: number;
  isUnfolded?: boolean;
  selectedFace?: string | null;
  onFaceClick?: (faceId: string) => void;
  autoRotate?: boolean;
}

const faceNames = ["front", "back", "left", "right", "top", "bottom"];

export function Cube({
  side = 2,
  isUnfolded = false,
  selectedFace = null,
  onFaceClick,
  autoRotate = true,
}: CubeProps) {
  const groupRef = useRef<Group>(null);
  const faceGroupRefs = useRef<{ [key: string]: Group }>({});
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const s = side;

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

  // Развёртка - классический крест
  const unfolded: Record<
    string,
    { pos: [number, number, number]; rot: [number, number, number] }
  > = {
    front: { pos: [0, 0, s / 2], rot: [0, 0, 0] },
    back: { pos: [0, -s * 1.5, s / 2], rot: [0, 0, 0] },
    left: { pos: [-s * 1.5, 0, s / 2], rot: [0, 0, 0] },
    right: { pos: [s * 1.5, 0, s / 2], rot: [0, 0, 0] },
    top: { pos: [0, s * 1.5, s / 2], rot: [0, 0, 0] },
    bottom: { pos: [0, -s * 2.5, s / 2], rot: [0, 0, 0] },
  };

  // Собранный куб
  const assembled: Record<
    string,
    { pos: [number, number, number]; rot: [number, number, number] }
  > = {
    front: { pos: [0, 0, s / 2], rot: [0, 0, 0] },
    back: { pos: [0, 0, -s / 2], rot: [0, Math.PI, 0] },
    left: { pos: [-s / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
    right: { pos: [s / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },
    top: { pos: [0, s / 2, 0], rot: [-Math.PI / 2, 0, 0] },
    bottom: { pos: [0, -s / 2, 0], rot: [Math.PI / 2, 0, 0] },
  };

  const getFaceColor = useCallback(
    (faceName: string): string => {
      if (selectedFace === faceName) return "#aa3bff";
      if (hoveredFace === faceName) return "#c084fc";

      const baseColors: Record<string, string> = {
        front: "#8b5cf6",
        back: "#7c3aed",
        left: "#6d28d9",
        right: "#5b21b6",
        top: "#a78bfa",
        bottom: "#9f7aea",
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
            <planeGeometry args={[s, s]} />
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
  }, [s, getFaceColor, handleClick]);

  return <group ref={groupRef}>{faces}</group>;
}
