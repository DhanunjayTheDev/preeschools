import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Bear, Bunny, Elephant, Giraffe, Penguin } from "./Animals";
import { Balloon, BuildingBlocks, Rocket, StarWand } from "./Toys";
import { SuperKid, SuperGirl, ShieldHero } from "./SuperHeroes";

export default function PlaygroundScene() {
  return (
    <Canvas camera={{ position: [0, 1, 6], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#FFD93D" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Bear position={[-2.5, -0.5, 0]} scale={0.9} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <Bunny position={[0, -0.8, 1]} scale={0.8} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <Penguin position={[2.5, -0.5, 0]} scale={0.85} />
      </Float>

      <Balloon position={[-1.5, 1.5, -1]} color="#FF6B6B" scale={0.8} />
      <Balloon position={[0.5, 1.8, -0.5]} color="#FFD93D" scale={0.7} />
      <Balloon position={[1.8, 1.3, -1]} color="#5CD6FF" scale={0.9} />
      <Balloon position={[-0.5, 2, -1.5]} color="#FF7A00" scale={0.6} />

      <BuildingBlocks position={[1, -1.2, 0.5]} scale={0.6} />
      <StarWand position={[-1, 0.5, 0.5]} scale={0.7} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
