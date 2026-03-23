import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Bunny, Penguin } from "./Animals";
import { Balloon } from "./Toys";

export default function GalleryScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Float speed={1.5} floatIntensity={0.5}>
        <Bunny position={[-1.5, -0.5, 0]} scale={0.9} />
      </Float>
      <Float speed={1.2} floatIntensity={0.4}>
        <Penguin position={[1.5, -0.5, 0]} scale={0.85} />
      </Float>

      <Balloon position={[0, 1, -1]} color="#FF7A00" scale={0.8} />
      <Balloon position={[-1, 1.5, -1.5]} color="#5CD6FF" scale={0.6} />
      <Balloon position={[1, 1.3, -1.2]} color="#FFD93D" scale={0.7} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="dawn" />
    </Canvas>
  );
}
