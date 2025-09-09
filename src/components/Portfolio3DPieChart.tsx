import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useState, useRef, useMemo } from 'react';
import { Mesh, Color } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  color: string;
}

interface Portfolio3DPieChartProps {
  data: Asset[];
  className?: string;
}

interface PieSliceProps {
  asset: Asset;
  startAngle: number;
  endAngle: number;
  radius: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const PieSlice = ({ asset, startAngle, endAngle, radius, isHovered, onHover }: PieSliceProps) => {
  const meshRef = useRef<Mesh>(null);
  
  const springs = useSpring({
    positionZ: isHovered ? 0.2 : 0,
    scale: isHovered ? 1.05 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  const geometry = useMemo(() => {
    const segments = 32;
    const angle = endAngle - startAngle;
    const vertices = [];
    const indices = [];
    
    // Center vertex
    vertices.push(0, 0, 0);
    
    // Arc vertices
    for (let i = 0; i <= segments; i++) {
      const currentAngle = startAngle + (angle * i) / segments;
      const x = Math.cos(currentAngle) * radius;
      const y = Math.sin(currentAngle) * radius;
      vertices.push(x, y, 0);
    }
    
    // Create triangles
    for (let i = 0; i < segments; i++) {
      indices.push(0, i + 1, i + 2);
    }
    
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
  }, [startAngle, endAngle, radius]);

  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = radius + 0.5;
  const labelX = Math.cos(midAngle) * labelRadius;
  const labelY = Math.sin(midAngle) * labelRadius;

  return (
    <animated.group 
      position-z={springs.positionZ}
      scale={springs.scale}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        position={[0, 0, 0]}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.vertices.length / 3}
            array={geometry.vertices}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={geometry.indices}
            count={geometry.indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <meshLambertMaterial 
          color={new Color(asset.color)} 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Extrude the slice to give it depth */}
      <mesh position={[0, 0, -0.1]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.vertices.length / 3}
            array={geometry.vertices}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={geometry.indices}
            count={geometry.indices.length}
            itemSize={1}
          />
        </bufferGeometry>
        <meshLambertMaterial 
          color={new Color(asset.color).multiplyScalar(0.7)} 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {isHovered && (
        <Html position={[labelX, labelY, 0.3]} center>
          <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg pointer-events-none">
            <div className="text-sm font-medium text-foreground">{asset.symbol}</div>
            <div className="text-xs text-muted-foreground">{asset.name}</div>
            <div className="text-sm font-semibold text-primary">{asset.allocation.toFixed(1)}%</div>
          </div>
        </Html>
      )}
    </animated.group>
  );
};

export const Portfolio3DPieChart = ({ data, className = "" }: Portfolio3DPieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map((asset, index) => {
      const startAngle = currentAngle;
      const sliceAngle = (asset.allocation / 100) * Math.PI * 2;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;
      
      return {
        asset,
        startAngle,
        endAngle,
        index
      };
    });
  }, [data]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, 5]} intensity={0.4} />
        
        {slices.map((slice, index) => (
          <PieSlice
            key={slice.asset.symbol}
            asset={slice.asset}
            startAngle={slice.startAngle}
            endAngle={slice.endAngle}
            radius={2}
            isHovered={hoveredIndex === index}
            onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
          />
        ))}
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
    </div>
  );
};