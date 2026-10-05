"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

function EquipmentModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const fittedScene = useMemo(() => {
    const model = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 3.4 / Math.max(size.x, size.y, size.z, 0.001);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -bounds.min.y * scale - 0.68, -center.z * scale);
    return model;
  }, [scene]);
  return <primitive object={fittedScene} />;
}

function Placeholder() {
  return (
    <group position={[0, -0.45, 0]}>
      <mesh castShadow position={[0, 0.25, 0]}><boxGeometry args={[1.6, 0.65, 0.9]} /><meshStandardMaterial color="#d6a21d" metalness={0.35} roughness={0.45} /></mesh>
      <mesh castShadow position={[0, -0.2, 0]}><boxGeometry args={[1.9, 0.2, 1.05]} /><meshStandardMaterial color="#27272a" metalness={0.2} roughness={0.8} wireframe /></mesh>
      <mesh castShadow position={[-0.45, 0.72, 0]}><boxGeometry args={[0.65, 0.38, 0.68]} /><meshStandardMaterial color="#facc15" metalness={0.3} roughness={0.4} /></mesh>
      <mesh castShadow position={[0.78, 0.2, 0]} rotation={[0, 0, -0.45]}><boxGeometry args={[1.1, 0.12, 0.15]} /><meshStandardMaterial color="#eab308" metalness={0.35} roughness={0.4} /></mesh>
    </group>
  );
}

function ModelLoading() {
  const { progress } = useProgress();
  return <Html center><div className="flex items-center gap-3 whitespace-nowrap rounded-lg border border-neutral-700 bg-neutral-900/95 px-4 py-3 text-xs text-slate-200 shadow-xl"><span className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />Memuat model 3D {Math.round(progress)}%</div></Html>;
}

export default function Equipment3DStage({ itemName }: { itemName: string }) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    let active = true;
    const filename = /bulldozer/i.test(itemName) ? "bulldozer.glb" : /loader/i.test(itemName) ? "wheel-loader.glb" : "excavator_cat.glb";
    fetch(`/models/heavy-equipment/${filename}`, { method: "HEAD" })
      .then((response) => { if (active && response.ok) setModelUrl(`/models/heavy-equipment/${filename}`); })
      .catch(() => undefined)
      .finally(() => { if (active) setChecked(true); });
    return () => { active = false; };
  }, [itemName]);

  return (
    <Canvas shadows camera={{ position: [4, 2.7, 5], fov: 42 }} dpr={[1, 1.7]}>
      <color attach="background" args={["#09090b"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Suspense fallback={<ModelLoading />}>
        {modelUrl && checked ? <EquipmentModel src={modelUrl} /> : <Placeholder />}
      </Suspense>
      <ContactShadows position={[0, -0.68, 0]} opacity={0.5} scale={8} blur={2.5} far={3} />
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.35} minPolarAngle={0.45} maxPolarAngle={Math.PI / 2.05} minDistance={3} maxDistance={10} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#18181b" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    </Canvas>
  );
}
