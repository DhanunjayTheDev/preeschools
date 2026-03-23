import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* Colorful building blocks */
export function BuildingBlocks({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#5CD6FF", "#FF7A00", "#A78BFA"];
  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={colors[0]} roughness={0.3} />
      </mesh>
      <mesh position={[0.42, 0, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={colors[1]} roughness={0.3} />
      </mesh>
      <mesh position={[0.21, 0.42, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={colors[2]} roughness={0.3} />
      </mesh>
      <mesh position={[-0.42, 0, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={colors[3]} roughness={0.3} />
      </mesh>
      <mesh position={[-0.21, 0.42, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={colors[4]} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <coneGeometry args={[0.3, 0.5, 4]} />
        <meshStandardMaterial color={colors[5]} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* Colorful balloons */
export function Balloon({ position = [0, 0, 0], color = "#FF6B6B", scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.2;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <coneGeometry args={[0.06, 0.1, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.5, 4]} />
        <meshStandardMaterial color="#999" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* Toy rocket */
export function Rocket({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1 + 0.2;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.6, 16, 32]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.15, 0.35, 16]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.3} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.15, 0.14]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#5CD6FF" roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Window ring */}
      <mesh position={[0, 0.15, 0.13]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshStandardMaterial color="#999" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Fins */}
      {[0, 2.09, 4.19].map((rot, i) => (
        <mesh key={i} position={[Math.sin(rot) * 0.15, -0.35, Math.cos(rot) * 0.15]} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.15]} />
          <meshStandardMaterial color="#FF7A00" roughness={0.4} />
        </mesh>
      ))}
      {/* Flame */}
      <mesh position={[0, -0.48, 0]}>
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} emissive="#FF7A00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.2} emissive="#FF6B6B" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/* Spinning top toy */
export function SpinningTop({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 2;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <coneGeometry args={[0.25, 0.3, 32]} />
        <meshStandardMaterial color="#5CD6FF" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.4} />
      </mesh>
      {/* Stripes */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.22, 0.02, 8, 32]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* Toy train */
export function ToyTrain({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Engine body */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#FF6B6B" roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.1, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.28]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.4} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.15, 0.38, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      {/* Wheels */}
      {[[-0.15, -0.02, 0.16], [0.15, -0.02, 0.16], [-0.15, -0.02, -0.16], [0.15, -0.02, -0.16]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#333" roughness={0.5} />
        </mesh>
      ))}
      {/* Cart */}
      <mesh position={[0.55, 0.12, 0]}>
        <boxGeometry args={[0.35, 0.2, 0.28]} />
        <meshStandardMaterial color="#4ECDC4" roughness={0.4} />
      </mesh>
      {[[-0.15 + 0.55, -0.02, 0.16], [0.1 + 0.55, -0.02, 0.16], [-0.15 + 0.55, -0.02, -0.16], [0.1 + 0.55, -0.02, -0.16]].map((pos, i) => (
        <mesh key={`w2-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
          <meshStandardMaterial color="#333" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* Teddy star wand */
export function StarWand({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.3;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0, 0.2, 0.2, 5]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} metalness={0.5} emissive="#FF7A00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
