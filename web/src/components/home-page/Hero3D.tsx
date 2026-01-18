"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef} scale={2}>
                <icosahedronGeometry args={[1, 0]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={1}
                    anisotropy={2}
                    distortion={2}
                    distortionScale={0.5}
                    temporalDistortion={0.5}
                    color="#3B82F6"
                    background={new THREE.Color("#0A0F1F")}
                />
            </mesh>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.6 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#8B5CF6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06B6D4" />
                <FloatingShape />
            </Canvas>
        </div>
    );
}
