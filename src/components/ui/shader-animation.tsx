"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ShaderAnimationProps {
  className?: string
  style?: React.CSSProperties
  /** Duration in ms before animation stops (plays once) */
  duration?: number
  /** Callback when animation completes */
  onComplete?: () => void
}

export function ShaderAnimation({ 
  className = "w-full h-screen", 
  style,
  duration = 3000,
  onComplete
}: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: { time: { type: string; value: number }; resolution: { type: string; value: THREE.Vector2 } }
    animationId: number
    startTime: number
    stopped: boolean
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - converging rings effect (starts from outside)
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float rawT = time * 0.15;
        // Ease-out: fast at first, slows as it approaches center, never quite reaches it
        float t = 1.0 - exp(-rawT * 1.8);
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        
        // Dark charcoal tones for contrast
        vec3 baseColor = vec3(0.1, 0.1, 0.09);
        vec3 accentColor = vec3(0.2, 0.2, 0.18);
        
        // Ring distance based on eased time - starts from outside, converges toward center
        float ringDist = (1.0 - t) * 1.8;
        
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float offset = 0.01*float(j) + float(i)*0.015;
            float val = lineWidth * float(i*i) / abs(ringDist + offset - length(uv) + mod(uv.x+uv.y, 0.2));
            color += mix(baseColor, accentColor, float(j) * 0.3) * val;
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const startTime = Date.now()

    // Animation loop - plays once then stops
    const animate = () => {
      if (sceneRef.current?.stopped) return
      
      const elapsed = Date.now() - startTime
      
      if (elapsed < duration) {
        const animationId = requestAnimationFrame(animate)
        uniforms.time.value += 0.05
        renderer.render(scene, camera)

        if (sceneRef.current) {
          sceneRef.current.animationId = animationId
        }
      } else {
        // Animation complete - render one final frame then stop
        renderer.render(scene, camera)
        if (sceneRef.current) {
          sceneRef.current.stopped = true
        }
        onComplete?.()
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
      startTime,
      stopped: false,
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        sceneRef.current.stopped = true
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [duration, onComplete])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: "hidden",
        ...style,
      }}
    />
  )
}

