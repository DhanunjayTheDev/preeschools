import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Elephant, Penguin } from "./Animals";
import { Balloon, ToyTrain } from "./Toys";

export default function ContactScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Float speed={1.5} floatIntensity={0.5}>
        <Elephant position={[-1.5, -0.3, 0]} scale={0.6} />
      </Float>
      <Float speed={1.2} floatIntensity={0.4}>
        <Penguin position={[1.5, -0.3, 0]} scale={0.8} />
      </Float>
      <ToyTrain position={[0, -1, 0.5]} scale={0.8} />

      <Balloon position={[0, 1.5, -1]} color="#4ECDC4" scale={0.8} />
      <Balloon position={[-1.5, 1.2, -1]} color="#FF7A00" scale={0.6} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="park" />
    </Canvas>
  );
}
