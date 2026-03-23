import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* Kid superhero with cape */
export function SuperKid({ position = [0, 0, 0], scale = 1, color = "#FF6B6B" }) {
  const group = useRef();
  const capeRef = useRef();

  useFrame((state) => {
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.2;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.35, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.21, 0.03, 8, 32]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Belt buckle */}
      <mesh position={[0, -0.05, 0.21]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      {/* Mask */}
      <mesh position={[0, 0.53, 0.12]}>
        <boxGeometry args={[0.35, 0.1, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Eyes (through mask) */}
      <mesh position={[-0.08, 0.53, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} emissive="white" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.08, 0.53, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} emissive="white" emissiveIntensity={0.3} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.65, -0.05]}>
        <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4A3728" roughness={0.8} />
      </mesh>
      {/* Cape */}
      <group ref={capeRef} position={[0, 0.15, -0.2]}>
        <mesh position={[0, -0.3, -0.05]}>
          <boxGeometry args={[0.45, 0.7, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.5} side={2} />
        </mesh>
      </group>
      {/* Arms */}
      <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.06, 0.25, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.06, 0.25, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Fists */}
      <mesh position={[-0.42, 0.28, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      <mesh position={[0.38, 0.3, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.5} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Chest emblem */}
      <mesh position={[0, 0.12, 0.2]}>
        <cylinderGeometry args={[0, 0.08, 0.08, 5]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} metalness={0.5} emissive="#FFD93D" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* Flying superhero girl */
export function SuperGirl({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  const capeRef = useRef();

  useFrame((state) => {
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + 1) * 0.25;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.15;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2.5) * 0.2 + 0.3;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.18, 0.3, 16, 32]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      {/* Skirt */}
      <mesh position={[0, -0.18, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.25, 0.2, 16]} />
        <meshStandardMaterial color="#C084FC" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      {/* Mask */}
      <mesh position={[0, 0.48, 0.1]}>
        <boxGeometry args={[0.32, 0.08, 0.12]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.07, 0.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} emissive="#C084FC" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.07, 0.48, 0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} emissive="#C084FC" emissiveIntensity={0.5} />
      </mesh>
      {/* Hair pigtails */}
      <mesh position={[-0.2, 0.5, -0.05]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 0.5, -0.05]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, -0.1]}>
        <sphereGeometry args={[0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.7} />
      </mesh>
      {/* Cape */}
      <group ref={capeRef} position={[0, 0.1, -0.18]}>
        <mesh position={[0, -0.25, -0.05]}>
          <boxGeometry args={[0.4, 0.6, 0.03]} />
          <meshStandardMaterial color="#C084FC" roughness={0.5} side={2} />
        </mesh>
      </group>
      {/* Arms */}
      <mesh position={[-0.28, 0.05, 0.1]} rotation={[0.3, 0, 0.6]}>
        <capsuleGeometry args={[0.05, 0.22, 8, 16]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      <mesh position={[0.28, 0.05, 0.1]} rotation={[0.3, 0, -0.6]}>
        <capsuleGeometry args={[0.05, 0.22, 8, 16]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.08, -0.4, 0]}>
        <capsuleGeometry args={[0.06, 0.18, 8, 16]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, -0.4, 0]}>
        <capsuleGeometry args={[0.06, 0.18, 8, 16]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.08, -0.55, 0.02]}>
        <boxGeometry args={[0.09, 0.07, 0.13]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      <mesh position={[0.08, -0.55, 0.02]}>
        <boxGeometry args={[0.09, 0.07, 0.13]} />
        <meshStandardMaterial color="#9333EA" roughness={0.4} />
      </mesh>
      {/* Star emblem */}
      <mesh position={[0, 0.1, 0.18]} rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0, 0.07, 0.07, 5]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} metalness={0.5} emissive="#FFD93D" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* Shield hero */
export function ShieldHero({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  const shieldRef = useRef();

  useFrame((state) => {
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + 2) * 0.15;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35 + 2) * 0.2;
    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.22, 0.35, 16, 32]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.58, -0.02]}>
        <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Helmet wing left */}
      <mesh position={[-0.24, 0.6, 0]} rotation={[0, 0.5, 0.3]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
      {/* Helmet wing right */}
      <mesh position={[0.24, 0.6, 0]} rotation={[0, -0.5, -0.3]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.5, 0.18]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.5, 0.18]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} />
      </mesh>
      {/* Smile */}
      <mesh position={[0, 0.43, 0.2]}>
        <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
      </mesh>
      {/* Chest star */}
      <mesh position={[0, 0.1, 0.22]} rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0, 0.1, 0.1, 5]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      {/* Shield */}
      <group ref={shieldRef} position={[-0.38, 0, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 32]} />
          <meshStandardMaterial color="#FF6B6B" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 32]} />
          <meshStandardMaterial color="white" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, Math.PI / 10]}>
          <cylinderGeometry args={[0, 0.05, 0.05, 5]} />
          <meshStandardMaterial color="white" roughness={0.2} />
        </mesh>
      </group>
      {/* Arms */}
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -0.5]}>
        <capsuleGeometry args={[0.06, 0.25, 8, 16]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.4} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
        <meshStandardMaterial color="#1E40AF" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
        <meshStandardMaterial color="#1E40AF" roughness={0.5} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.08, 0.15]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>
    </group>
  );
}
