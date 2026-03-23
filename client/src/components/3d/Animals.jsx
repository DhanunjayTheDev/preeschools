import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* Cute low-poly bear with round body, ears, and snout */
export function Bear({ position = [0, 0, 0], scale = 1, color = "#8B4513" }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.3, 1.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.3, 1.2, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.3, 1.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 1.2, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#D2691E" roughness={0.8} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.7, 0.35]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#DEB887" roughness={0.7} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.73, 0.5]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>
      {/* Left eye */}
      <mesh position={[-0.15, 0.88, 0.35]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.15, 0.88, 0.35]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#DEB887" roughness={0.7} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.55, 0.1, 0]} rotation={[0, 0, 0.5]}>
        <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.55, 0.1, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.2, -0.6, 0.1]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.2, -0.6, 0.1]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* Cute bunny with big floppy ears */
export function Bunny({ position = [0, 0, 0], scale = 1, color = "#F5F5F5" }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6 + 1) * 0.15;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + 1) * 0.12;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.12, 1.35, 0]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 1.35, 0.01]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.05, 0.45, 8, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.5} />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.12, 1.35, 0]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 1.35, 0.01]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.05, 0.45, 8, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.5} />
      </mesh>
      {/* Cheeks */}
      <mesh position={[-0.25, 0.6, 0.25]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.5} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.25, 0.6, 0.25]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.5} transparent opacity={0.6} />
      </mesh>
      {/* Left eye */}
      <mesh position={[-0.12, 0.78, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.12, 0.78, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.68, 0.35]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.4} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, -0.1, -0.45]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.18, -0.5, 0.15]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.15, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, -0.5, 0.15]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.15, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* Baby elephant with big ears and trunk */
export function Elephant({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 2) * 0.2;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + 2) * 0.1;
  });

  const gray = "#9E9E9E";
  const darkGray = "#757575";

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0.2]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      {/* Left ear */}
      <mesh position={[-0.55, 0.7, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      <mesh position={[-0.55, 0.7, 0.05]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.6} />
      </mesh>
      {/* Right ear */}
      <mesh position={[0.55, 0.7, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 0.7, 0.05]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.6} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 0.45, 0.65]} rotation={[0.6, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0.9]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
        <meshStandardMaterial color={gray} roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.2, 0.85, 0.45]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.85, 0.45]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.18, 0.87, 0.47]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      <mesh position={[0.22, 0.87, 0.47]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      {/* Legs */}
      {[[-0.25, -0.65, 0.2], [0.25, -0.65, 0.2], [-0.25, -0.65, -0.2], [0.25, -0.65, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <capsuleGeometry args={[0.12, 0.2, 8, 16]} />
          <meshStandardMaterial color={darkGray} roughness={0.8} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[0, 0.1, -0.6]} rotation={[-0.5, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.3, 4, 8]} />
        <meshStandardMaterial color={darkGray} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* Giraffe with long neck and spots */
export function Giraffe({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + 3) * 0.15;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + 3) * 0.1;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.5, 16, 32]} />
        <meshStandardMaterial color="#F4A460" roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.8, 0.1]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#F4A460" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0.15]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#F4A460" roughness={0.7} />
      </mesh>
      {/* Ossicones (horns) */}
      <mesh position={[-0.08, 1.6, 0.15]}>
        <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 1.6, 0.15]}>
        <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.6} />
      </mesh>
      {/* Horn tips */}
      <mesh position={[-0.08, 1.68, 0.15]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 1.68, 0.15]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 1.43, 0.32]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 1.43, 0.32]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Spots */}
      {[[0.15, 0.2, 0.3], [-0.2, -0.1, 0.28], [0.1, -0.2, 0.3], [-0.1, 0.5, 0.1], [0.05, 0.9, 0.15]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
      ))}
      {/* Legs */}
      {[[-0.15, -0.6, 0.15], [0.15, -0.6, 0.15], [-0.15, -0.6, -0.15], [0.15, -0.6, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <capsuleGeometry args={[0.06, 0.35, 8, 16]} />
          <meshStandardMaterial color="#F4A460" roughness={0.7} />
        </mesh>
      ))}
      {/* Hooves */}
      {[[-0.15, -0.9, 0.15], [0.15, -0.9, 0.15], [-0.15, -0.9, -0.15], [0.15, -0.9, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.06, 0.07, 0.06, 8]} />
          <meshStandardMaterial color="#4A3728" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* Cute penguin */
export function Penguin({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + 4) * 0.08;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.4, 16, 32]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.05, 0.2]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="white" roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0.5, 0.2]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="white" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.6, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 0.6, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.48, 0.32]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#FF8C00" roughness={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.38, 0.05, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
      </mesh>
      <mesh position={[0.38, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.12, -0.48, 0.15]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.15]} />
        <meshStandardMaterial color="#FF8C00" roughness={0.5} />
      </mesh>
      <mesh position={[0.12, -0.48, 0.15]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.15]} />
        <meshStandardMaterial color="#FF8C00" roughness={0.5} />
      </mesh>
    </group>
  );
}
