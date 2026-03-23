import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { SuperKid, SuperGirl, ShieldHero } from "./SuperHeroes";
import { Balloon, StarWand } from "./Toys";

export default function ActivitiesScene() {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#C084FC" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <SuperKid position={[-2, 0, 0]} scale={1} color="#FF6B6B" />
      </Float>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.7}>
        <SuperGirl position={[0, 0.5, 0.5]} scale={1} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.5}>
        <ShieldHero position={[2, 0, 0]} scale={0.95} />
      </Float>

      <StarWand position={[-0.5, 1.5, 1]} scale={0.8} />
      <Balloon position={[1, 2, -1]} color="#FFD93D" scale={0.7} />
      <Balloon position={[-1.5, 1.8, -1]} color="#FF7A00" scale={0.6} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="city" />
    </Canvas>
  );
}
