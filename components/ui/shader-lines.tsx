"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    THREE: any;
  }
}

/**
 * ShaderAnimation: A premium, generative 'Distilled Lines' background.
 * Adapted from 'Shader Lines' to use Distill's Wellness Palette.
 * Represents the digital frequency of focus and mindfulness.
 */
export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    camera: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    scene: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    renderer: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    uniforms: any;
    animationId: number | null;
  }>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    // Load Three.js dynamically to keep initial bundle light
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js";
    script.integrity =
      "sha512-9nYs8QvHOk+iXmZ/TT+PIfk/gFij+OkLqPF48RnRCW2mASmpIj95zM+WbsUKOD46Fr6ay2gMHf/I1MI09p5wdA==";
    script.crossOrigin = "anonymous";
    script.id = "three-js-script";

    const onLoad = () => {
      if (containerRef.current && window.THREE) {
        initThreeJS();
      }
    };

    if (window.THREE) {
      onLoad();
    } else {
      script.onload = onLoad;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }
      const existingScript = document.getElementById("three-js-script");
      if (existingScript && !window.location.pathname.includes("/sign-")) {
        // Only remove if we're not likely to need it immediately again
        // Actually, let's just keep it for performance across auth pages
      }
    };
  }, []);

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const container = containerRef.current;

    // Clear any existing content
    container.innerHTML = "";

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
        
      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Mosaic scaling for more 'tactile' digital feel
        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256.0, 256.0);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);       
          
        float t = time * 0.04 + random(uv.x) * 0.4;
        float lineWidth = 0.0006;

        vec3 colorAccumulator = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            colorAccumulator[j] += lineWidth * float(i*i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 1.0 - length(uv));        
          }
        }

        // --- DISTILL WELLNESS PALETTE MAPPING ---
        // Mapping RGB channels to our Sage, Peach, and Lavender tokens
        vec3 colorSage = vec3(0.91, 0.94, 0.91);     // #E8EFE8
        vec3 colorPeach = vec3(1.0, 0.72, 0.70);    // #FFB7B2
        vec3 colorLavender = vec3(0.94, 0.93, 0.96); // #EFEDF4
        
        vec3 distilledColor = colorAccumulator.r * colorSage + 
                             colorAccumulator.g * colorPeach + 
                             colorAccumulator.b * colorLavender;

        gl_FragColor = vec4(distilledColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
    };

    const onWindowResize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    animate();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0 -z-10 opacity-60"
    />
  );
}
