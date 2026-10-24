'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

/* ─── Model Registry ──────────────────────────────────────────── */
interface MascotModel {
  path: string;
  name: string;
  botName: string;
  botColor: string;
  description: string;
  scale: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  classType: string;
  modelCode: string;
}

const MASCOT_MODELS: MascotModel[] = [
  {
    path: '/models3d/battlebot_standing.glb',
    name: 'BATTLEBOT // STANDBY',
    botName: 'RAZE',
    botColor: '#F8D826',
    description: 'BattleBot in idle configuration. Subsystems powered down, awaiting arena deployment.',
    scale: 1.8,
    position: [0, -0.2, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.0, 4.8],
    cameraTarget: [0, 0.2, 0],
    classType: 'HEAVY COMBAT CLASS',
    modelCode: 'CHASSIS // 03-STANDBY',
  },
  {
    path: '/models3d/battlebot_attack.glb',
    name: 'BATTLEBOT // ATTACK MODE',
    botName: 'RAZE',
    botColor: '#F8D826',
    description: 'Combat-ready BattleBot in attack stance. Reinforced polycarbonate shell with pneumatic weapons armed.',
    scale: 1.85,
    position: [0, 0.05, 0],
    rotation: [-0.22, -0.38, 0],
    cameraPosition: [0, 0.65, 4.3],
    cameraTarget: [0, 0.25, 0],
    classType: 'HEAVY COMBAT CLASS',
    modelCode: 'CHASSIS // 03-ATTACK',
  },
  {
    path: '/models3d/Hoverbot_flying.glb',
    name: 'HOVERBOT // FLIGHT MODE',
    botName: 'PICO',
    botColor: '#25D366',
    description: 'Aerial reconnaissance unit with quad-rotor lift. Active hover stabilization engaged.',
    scale: 1.8,
    position: [0, 0.2, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.0, 4.8],
    cameraTarget: [0, 0.2, 0],
    classType: 'AERIAL RECON CLASS',
    modelCode: 'SYSTEM // QR-FLIGHT',
  },
  {
    path: '/models3d/hoverbot_wheels.glb',
    name: 'HOVERBOT // GROUND MODE',
    botName: 'PICO',
    botColor: '#25D366',
    description: 'Wheeled configuration for ground traversal. Autonomous pathfinding sensors deployed.',
    scale: 1.8,
    position: [0, -0.2, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 0.9, 4.8],
    cameraTarget: [0, 0.1, 0],
    classType: 'AERIAL RECON CLASS',
    modelCode: 'SYSTEM // QR-GROUND',
  },
];

/* ─── Rotating Model Component ──────────────────────────────── */
function RotatingModel({ model, isHovering }: { model: MascotModel; isHovering: boolean }) {
  const { scene } = useGLTF(model.path);
  const groupRef = useRef<THREE.Group>(null);
  
  // Clone the scene so each model instance is independent
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Reset rotation to face front whenever the model changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = 0;
    }
  }, [model.path]);
  
  useFrame((_, delta) => {
    if (groupRef.current && !isHovering) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const [rx, ry, rz] = model.rotation || [0, 0, 0];

  return (
    <group ref={groupRef} position={model.position} scale={model.scale}>
      <primitive object={clonedScene} rotation={[rx, ry, rz]} />
    </group>
  );
}

/* ─── Loading Spinner ──────────────────────────────────────── */
function ModelLoader() {
  return (
    <Html center>
      <div className="model-loader">
        <div className="model-loader-spinner" />
        <span>Loading model...</span>
      </div>
    </Html>
  );
}

/* ─── Camera Reset Helper ──────────────────────────────────── */
function CameraController({ 
  resetTrigger, 
  model, 
  controlsRef 
}: { 
  resetTrigger: number; 
  model: MascotModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  
  const updateCamera = React.useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    // On narrow portrait screens, back up camera by 1.35x to comfortably frame the robot
    const distanceMult = isMobile ? 1.35 : 1.0;
    
    const camPos = model.cameraPosition || [0, 1.0, 4.8];
    const target = model.cameraTarget || [0, 0.2, 0];

    camera.position.set(
      camPos[0],
      camPos[1] * (isMobile ? 1.05 : 1.0),
      camPos[2] * distanceMult
    );
    camera.lookAt(target[0], target[1], target[2]);

    if (controlsRef.current) {
      controlsRef.current.target.set(target[0], target[1], target[2]);
      controlsRef.current.update();
    }
  }, [camera, model, controlsRef]);

  useEffect(() => {
    updateCamera();
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, [resetTrigger, updateCamera]);
  
  return null;
}

/* ─── Main Page Component ──────────────────────────────────── */
export default function MascotPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Bot intro animation state (only shown first time viewing each bot)
  const [viewedBots, setViewedBots] = useState<string[]>([]);
  const [splashBot, setSplashBot] = useState<{
    name: string;
    color: string;
    classType: string;
    modelCode: string;
  } | null>(null);

  // Touch gesture tracking for mobile swipe navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const model = MASCOT_MODELS[currentIndex];

  // Preload all models
  useEffect(() => {
    MASCOT_MODELS.forEach(m => {
      useGLTF.preload(m.path);
    });
  }, []);

  // Trigger intro splash card first time each bot is viewed
  useEffect(() => {
    const currentBot = MASCOT_MODELS[currentIndex].botName;
    setViewedBots(prev => {
      if (prev.includes(currentBot)) return prev;

      setSplashBot({
        name: currentBot,
        color: MASCOT_MODELS[currentIndex].botColor,
        classType: MASCOT_MODELS[currentIndex].classType,
        modelCode: MASCOT_MODELS[currentIndex].modelCode,
      });

      return [...prev, currentBot];
    });
  }, [currentIndex]);

  // Handle 3-second splash timer
  useEffect(() => {
    if (!splashBot) return;
    const timer = setTimeout(() => {
      setSplashBot(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [splashBot]);

  const navigate = (direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % MASCOT_MODELS.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + MASCOT_MODELS.length) % MASCOT_MODELS.length);
      }
      setCameraReset(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe if deltaX > 55px and motion is predominantly horizontal
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'Escape') router.push('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning]);

  return (
    <div className="mascot-viewer-page">
      {/* Ambient background layers */}
      <div className="mascot-viewer-bg" />
      <div className="scanline-layer" />

      {/* First-time Bot Intro Splash overlay (3-second presentation) */}
      {splashBot && (
        <div 
          className="bot-intro-overlay"
          key={splashBot.name}
          style={{ '--intro-color': splashBot.color } as React.CSSProperties}
        >
          <div className="bot-intro-card">
            <div className="bot-intro-reticle top-left" />
            <div className="bot-intro-reticle top-right" />
            <div className="bot-intro-reticle bottom-left" />
            <div className="bot-intro-reticle bottom-right" />
            
            <div className="bot-intro-kicker">
              <span className="kicker-dot" />
              <span>UNIT DETECTED</span>
              <span className="kicker-sep">•</span>
              <span>{splashBot.modelCode}</span>
            </div>
            
            <h1 className="bot-intro-name">{splashBot.name}</h1>
            <div className="bot-intro-class">{splashBot.classType}</div>
          </div>
        </div>
      )}
      
      {/* Top bar */}
      <header className="mascot-viewer-header">
        <button 
          className="mascot-back-btn"
          onClick={() => router.push('/')}
          title="Back to terminal (Esc)"
          aria-label="Back to terminal"
        >
          <ArrowLeft size={16} />
          <span>BACK TO TERMINAL</span>
        </button>

        <div className="mascot-viewer-title-bar">
          <span className="mascot-viewer-badge">3D VIEWER</span>
          <span 
            className="mascot-bot-name"
            style={{ 
              color: model.botColor,
              textShadow: `0 0 12px ${model.botColor}40, 0 0 24px ${model.botColor}20`,
            }}
          >
            {model.botName}
          </span>
          <span className="mascot-viewer-model-counter">
            {String(currentIndex + 1).padStart(2, '0')} / {String(MASCOT_MODELS.length).padStart(2, '0')}
          </span>
        </div>

        <button
          className="mascot-reset-btn"
          onClick={() => setCameraReset(prev => prev + 1)}
          title="Reset camera view"
          aria-label="Reset camera view"
        >
          <RotateCcw size={14} />
          <span>RESET VIEW</span>
        </button>
      </header>

      {/* Main 3D canvas area */}
      <div 
        className={`mascot-canvas-container ${isTransitioning ? 'transitioning' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow */}
        <button 
          className="mascot-nav-arrow mascot-nav-arrow-left"
          onClick={() => navigate('prev')}
          title="Previous model (←)"
          aria-label="Previous model"
        >
          <ChevronLeft size={28} />
        </button>

        {/* 3D Canvas */}
        <div 
          className="mascot-canvas-wrapper"
          onPointerEnter={() => setIsHovering(true)}
          onPointerLeave={() => setIsHovering(false)}
        >
          <Canvas
            camera={{ position: [0, 1.0, 4.8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <CameraController 
              resetTrigger={cameraReset} 
              model={model} 
              controlsRef={controlsRef} 
            />
            
            {/* Lighting setup */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />
            <directionalLight position={[-3, 4, -5]} intensity={0.4} color={model.botColor} />
            <pointLight position={[0, 3, 0]} intensity={0.6} color={model.botColor} distance={8} />
            <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#ffffff" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Model */}
            <Suspense fallback={<ModelLoader />}>
              <RotatingModel model={model} isHovering={isHovering} />
            </Suspense>

            {/* Ground shadow */}
            <ContactShadows 
              position={[0, -1.3, 0]} 
              opacity={0.5} 
              scale={10} 
              blur={2.5} 
              far={4} 
              color={model.botColor}
            />

            {/* Grid floor */}
            <gridHelper args={[20, 40, '#1a1a2e', '#0f0f1a']} position={[0, -1.3, 0]} />

            {/* Orbit controls */}
            <OrbitControls 
              ref={controlsRef}
              target={model.cameraTarget || [0, 0.2, 0]}
              enableZoom={true}
              enablePan={false}
              minDistance={2.0}
              maxDistance={12}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 1.75}
              autoRotate={false}
              dampingFactor={0.05}
              enableDamping
            />
          </Canvas>
        </div>

        {/* Right arrow */}
        <button 
          className="mascot-nav-arrow mascot-nav-arrow-right"
          onClick={() => navigate('next')}
          title="Next model (→)"
          aria-label="Next model"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Bottom info panel */}
      <footer className="mascot-viewer-footer">
        {/* Dot indicators */}
        <div className="mascot-dot-indicators">
          {MASCOT_MODELS.map((m, i) => (
            <button 
              key={i}
              className={`mascot-dot ${i === currentIndex ? 'active' : ''}`}
              style={i === currentIndex ? { background: m.botColor, boxShadow: `0 0 10px ${m.botColor}90` } : undefined}
              onClick={() => {
                if (i !== currentIndex) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setCameraReset(prev => prev + 1);
                    setTimeout(() => setIsTransitioning(false), 100);
                  }, 300);
                }
              }}
              title={MASCOT_MODELS[i].name}
              aria-label={`View ${MASCOT_MODELS[i].name}`}
            />
          ))}
        </div>

        {/* Model info */}
        <div className={`mascot-info-panel ${isTransitioning ? 'transitioning' : ''}`}>
          <h2 
            className="mascot-model-name"
            style={{ color: model.botColor }}
          >
            {model.name}
          </h2>
          <p className="mascot-model-desc">{model.description}</p>
        </div>

        {/* Interaction hint with desktop and mobile responsive variations */}
        <div className="mascot-interaction-hint">
          <span className="hint-desktop">DRAG to rotate</span>
          <span className="hint-mobile">TOUCH to rotate</span>
          <span className="hint-sep">•</span>
          <span className="hint-desktop">SCROLL to zoom</span>
          <span className="hint-mobile">PINCH to zoom</span>
          <span className="hint-sep">•</span>
          <span className="hint-desktop">← → to switch</span>
          <span className="hint-mobile">SWIPE to switch</span>
          <span className="hint-sep hint-desktop">•</span>
          <span className="hint-desktop">ESC to exit</span>
        </div>
      </footer>
    </div>
  );
}
