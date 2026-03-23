import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Rocket, BuildingBlocks, ToyTrain, SpinningTop } from "./Toys";
import { Balloon } from "./Toys";

export default function ProgramsScene() {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Float speed={1.5} floatIntensity={0.5}>
        <Rocket position={[-2, 0.5, 0]} scale={1.2} />
      </Float>
      <Float speed={1.2} floatIntensity={0.3}>
        <BuildingBlocks position={[0, -0.5, 0.5]} scale={0.8} />
      </Float>
      <Float speed={1} floatIntensity={0.4}>
        <ToyTrain position={[2, -1, 0]} scale={1} />
      </Float>
      <SpinningTop position={[-0.5, -1, 1]} scale={0.9} />

      <Balloon position={[1.5, 1.5, -1]} color="#4ECDC4" />
      <Balloon position={[-1, 1.8, -0.5]} color="#FFD93D" />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
