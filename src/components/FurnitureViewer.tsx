import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// A helper to generate a soft shadow texture
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function FurnitureViewer({ modelUrl, targetColorHex, onLoaded }: { modelUrl: string, targetColorHex: string, onLoaded: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to store actionable items for the render loop to pick up without re-running useEffect
  const colorStateRef = useRef({
    lerpProgress: 1.0,
    currentColor: new THREE.Color(targetColorHex),
    targetColor: new THREE.Color(targetColorHex)
  });

  // Whenever props color changes, update the target in ref
  useEffect(() => {
    if (colorStateRef.current.targetColor.getHexString() !== new THREE.Color(targetColorHex).getHexString()) {
      colorStateRef.current.targetColor.set(targetColorHex);
      colorStateRef.current.lerpProgress = 0.0;
    }
  }, [targetColorHex]);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    // Scene background based on request `#F0EBE3`
    scene.background = new THREE.Color('#F0EBE3');

    // Isometric Camera Setup
    const aspect = width / height;
    const frustumSize = 4;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );

    // Isometric angles: rotateX(35.264), rotateY(45) -> simplified by placing camera at equal distances
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    // Left-top 45 degrees
    dirLight.position.set(-5, 10, 5);
    scene.add(dirLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshBasicMaterial({ color: '#F0EBE3' });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5; // Will adjust after model loads
    scene.add(floor);

    // Fake Shadow
    const shadowGeo = new THREE.PlaneGeometry(2, 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const fakeShadow = new THREE.Mesh(shadowGeo, shadowMat);
    fakeShadow.rotation.x = -Math.PI / 2;
    fakeShadow.position.y = -0.49;
    scene.add(fakeShadow);

    // Model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let clock = new THREE.Clock();
    let modelMeshes: THREE.Mesh[] = [];
    
    // Animation state
    let state = {
      isLoaded: false,
      entryTime: 0,
      shadowBaseScale: new THREE.Vector3(1,1,1)
    };

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      
      // Auto-center and fit
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim; // Fit within 2 units
      model.scale.setScalar(scale);

      // Center model
      model.position.sub(center.multiplyScalar(scale));
      // Baseline 0
      model.position.y -= box.min.y * scale;
      
      modelGroup.add(model);

      // Floor level
      const bottomY = 0; 
      floor.position.y = bottomY;
      fakeShadow.position.y = bottomY + 0.01;
      
      // Adjust shadow scale based on model size
      state.shadowBaseScale.set(size.x * scale * 1.5, size.z * scale * 1.5, 1);
      fakeShadow.scale.copy(state.shadowBaseScale);

      // Set initial transparent materials for entry animation
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          modelMeshes.push(mesh);
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => {
                m.transparent = true;
                m.opacity = 0;
              });
            } else {
              mesh.material.transparent = true;
              mesh.material.opacity = 0;
            }
          }
        }
      });

      // Init entry state
      modelGroup.position.y = 5;
      state.isLoaded = true;
      
      if (onLoaded) onLoaded();
    });

    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    // Render loop
    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (state.isLoaded) {
        // Entry animation
        if (state.entryTime < 1.2) {
          state.entryTime += dt;
          const t = Math.min(state.entryTime / 1.2, 1.0);
          const easeT = easeOutCubic(t);
          
          modelGroup.position.y = 5 * (1 - easeT);
          
          modelMeshes.forEach(mesh => {
            const mat = mesh.material as THREE.Material;
            if (mat) {
               if (Array.isArray(mat)) {
                  mat.forEach(m => m.opacity = easeT);
               } else {
                  mat.opacity = easeT;
               }
            }
          });
        } else {
          // Hover floating (sine wave 0 to 0.08)
          // Speed 0.0008 per frame approx matches 0.05 per second -> Math.sin(elapsed * 0.5)
          const floatOffset = (Math.sin(elapsed * 1.5) * 0.5 + 0.5) * 0.08; 
          modelGroup.position.y = floatOffset;
          
          // Shadow scale mapping float 0..0.08 to scale 1.0..0.96
          const shadowMultiplier = 1.0 - (floatOffset / 0.08 * 0.04);
          fakeShadow.scale.set(
              state.shadowBaseScale.x * shadowMultiplier, 
              state.shadowBaseScale.y * shadowMultiplier, 
              1
          );
        }

        // Color lerp
        if (colorStateRef.current.lerpProgress < 1.0) {
          colorStateRef.current.lerpProgress += dt / 0.4; // 400ms duration
          const t = Math.min(colorStateRef.current.lerpProgress, 1.0);
          
          const currentLerpColor = colorStateRef.current.currentColor.clone().lerp(colorStateRef.current.targetColor, t);
          
          modelMeshes.forEach(mesh => {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.color) {
              if (Array.isArray(mat)) {
                mat.forEach((m: any) => { if(m.color) m.color.copy(currentLerpColor); });
              } else {
                mat.color.copy(currentLerpColor);
              }
            }
          });

          if (t === 1.0) {
              colorStateRef.current.currentColor.copy(colorStateRef.current.targetColor);
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    render();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      const aspect = w / h;
      camera.left = -frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]); // Assuming modelUrl stays constant for now. 

  return <div ref={mountRef} className="w-full h-full" />;
}
