import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MathUtils } from "three";
import { Edges } from "@react-three/drei";

interface CylinderProps {
  radius?: number;
  height?: number;
  isUnfolded?: boolean;
  selectedFace?: string | null;
  onFaceClick?: (faceId: string) => void;
  autoRotate?: boolean;
}

const faceNames = ["top", "bottom", "side"];

export function Cylinder({
  radius = 1.5,
  height = 3,
  isUnfolded = false,
  selectedFace = null,
  onFaceClick,
  autoRotate = true,
}: CylinderProps) {
  const groupRef = useRef<Group>(null);
  const faceGroupRefs = useRef<{ [key: string]: Group }>({});
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  const circumference = 2 * Math.PI * radius;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !isUnfolded) {
      groupRef.current.rotation.y += delta * 0.2;
    }

    // Целевые состояния для развёртки
    const targetStates: Record<
      string,
      { pos: [number, number, number]; rot: [number, number, number] }
    > = {
      // Верхнее основание - уходит вверх
      top: { pos: [0, height / 2 + radius + 1, 0], rot: [-Math.PI / 2, 0, 0] },
      // Нижнее основание - уходит вниз
      bottom: {
        pos: [0, -height / 2 - radius - 1, 0],
        rot: [Math.PI / 2, 0, 0],
      },
      // Боковая поверхность - разворачивается в прямоугольник справа
      side: { pos: [radius + circumference / 2 + 0.5, 0, 0], rot: [0, 0, 0] },
    };

    // Начальные состояния (сборный цилиндр)
    const assembledStates: Record<
      string,
      { pos: [number, number, number]; rot: [number, number, number] }
    > = {
      top: { pos: [0, height / 2, 0], rot: [-Math.PI / 2, 0, 0] },
      bottom: { pos: [0, -height / 2, 0], rot: [Math.PI / 2, 0, 0] },
      side: { pos: [0, 0, 0], rot: [0, 0, 0] },
    };

    faceNames.forEach((faceName) => {
      const faceGroup = faceGroupRefs.current[faceName];
      if (faceGroup) {
        const target = isUnfolded
          ? targetStates[faceName]
          : assembledStates[faceName];

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

  const getFaceColor = useCallback(
    (faceName: string): string => {
      if (selectedFace === faceName) return "#aa3bff";
      if (hoveredFace === faceName) return "#c084fc";

      const baseColors: Record<string, string> = {
        top: "#8b5cf6",
        bottom: "#6d28d9",
        side: "#7c3aed",
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
      let position: [number, number, number] = [0, 0, 0];
      let rotation: [number, number, number] = [0, 0, 0];

      if (faceName === "top") {
        position = [0, height / 2, 0];
        rotation = [-Math.PI / 2, 0, 0];
      } else if (faceName === "bottom") {
        position = [0, -height / 2, 0];
        rotation = [Math.PI / 2, 0, 0];
      } else if (faceName === "side") {
        position = [0, 0, 0];
      }

      return (
        <group
          key={faceName}
          ref={(el) => {
            if (el) faceGroupRefs.current[faceName] = el;
          }}
          position={position}
          rotation={rotation}
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
            {faceName === "side" ? (
              // Боковая поверхность
              isUnfolded ? (
                <planeGeometry args={[circumference, height]} />
              ) : (
                <cylinderGeometry
                  args={[radius, radius, height, 32, 1, true, -Math.PI / 2]}
                />
              )
            ) : (
              // Основания
              <circleGeometry args={[radius, 32]} />
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
  }, [radius, height, circumference, isUnfolded, getFaceColor, handleClick]);

  return <group ref={groupRef}>{faces}</group>;
}
