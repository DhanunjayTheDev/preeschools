import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Bear, Giraffe } from "./Animals";
import { Rocket, StarWand, Balloon } from "./Toys";

export default function AdmissionsScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.5], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 3, 3]} intensity={0.3} color="#FFD93D" />

      <Float speed={1.5} floatIntensity={0.5}>
        <Bear position={[-1.8, -0.5, 0]} scale={0.75} />
      </Float>
      <Float speed={1.3} floatIntensity={0.6}>
        <Rocket position={[0, 0.3, 0]} scale={1} />
      </Float>
      <Float speed={1.1} floatIntensity={0.4}>
        <Giraffe position={[1.8, -0.6, 0]} scale={0.6} />
      </Float>

      <StarWand position={[-0.5, 1.2, 0.5]} scale={0.6} />
      <Balloon position={[1, 1.5, -1]} color="#FF6B6B" scale={0.7} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
