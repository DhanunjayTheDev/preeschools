import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Bear, Bunny, Elephant, Giraffe } from "./Animals";

export default function AboutScene() {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 3]} intensity={0.3} color="#5CD6FF" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Giraffe position={[-1.8, -0.8, 0]} scale={0.7} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <Elephant position={[0, -0.5, 0.5]} scale={0.65} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <Bear position={[1.8, -0.5, 0]} scale={0.7} color="#A0522D" />
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="park" />
    </Canvas>
  );
}
