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
  /** Target element ref to converge animation toward */
  targetRef?: React.RefObject<HTMLElement | null>
}

export function ShaderAnimation({ 
  className = "w-full h-screen", 
  style,
  duration = 3000,
  onComplete,
  targetRef
}: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: { 
      time: { type: string; value: number }
      resolution: { type: string; value: THREE.Vector2 }
      targetOffset: { type: string; value: THREE.Vector2 }
    }
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
      uniform vec2 targetOffset;

      void main(void) {
        // Calculate UV with target offset applied
        // targetOffset is in normalized coords (-1 to 1) where 0,0 is center
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        uv -= targetOffset;
        
        // Total animation: ~5 seconds = 15.0 time units at 0.05 per frame
        float totalT = clamp(time / 15.0, 0.0, 1.0);
        
        // === LAYER 1: RING CONVERGENCE ===
        // Ease-out cubic for smooth deceleration - rings converge fully to center
        float ringT = 1.0 - pow(1.0 - totalT, 3.0);
        
        float lineWidth = 0.002;
        vec3 ringColor = vec3(0.0);
        
        // Soft muted tones - subtle warmth to match light cream background
        vec3 baseColor = vec3(0.6, 0.58, 0.55);
        vec3 accentColor = vec3(0.7, 0.68, 0.65);
        
        // Ring distance - starts at 1.5, converges fully to 0 (center/nothing)
        float ringDist = (1.0 - ringT) * 1.5;
        
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float offset = 0.01*float(j) + float(i)*0.015;
            float val = lineWidth * float(i*i) / abs(ringDist + offset - length(uv) + mod(uv.x+uv.y, 0.2));
            ringColor += mix(baseColor, accentColor, float(j) * 0.3) * val;
          }
        }
        
        // === LAYER 2: BACKGROUND FADE ===
        // Background fades out over same duration, ending when rings end
        // Starts fading at 60%, completes at 100% - synchronized with ring completion
        float fadeT = clamp((totalT - 0.6) / 0.4, 0.0, 1.0);
        float bgOpacity = 1.0 - fadeT;
        
        // Output: rings render at full intensity, background alpha fades
        // Rings naturally disappear as they converge (ringDist -> 0)
        // Background independently fades via alpha channel
        gl_FragColor = vec4(ringColor, bgOpacity);
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
      targetOffset: { type: "v2", value: new THREE.Vector2(0, 0) },
    }

    // Calculate target offset from targetRef element position
    const updateTargetOffset = () => {
      if (!targetRef?.current || !containerRef.current) return
      
      const targetRect = targetRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      
      // Get the center of the target element
      const targetCenterX = targetRect.left + targetRect.width / 2
      const targetCenterY = targetRect.top + targetRect.height / 2
      
      // Get the center of the container
      const containerCenterX = containerRect.left + containerRect.width / 2
      const containerCenterY = containerRect.top + containerRect.height / 2
      
      // Calculate offset from container center to target center
      // Normalize to the shader's coordinate space
      const minDim = Math.min(containerRect.width, containerRect.height)
      
      // Convert pixel offset to normalized shader coordinates
      // Multiply by 2 because shader UV ranges from -1 to 1
      const offsetX = ((targetCenterX - containerCenterX) / minDim) * 2
      // Y is inverted in WebGL (positive Y is up, but in DOM positive Y is down)
      const offsetY = -((targetCenterY - containerCenterY) / minDim) * 2
      
      uniforms.targetOffset.value.set(offsetX, offsetY)
    }

    // Initial target offset calculation
    updateTargetOffset()

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
      // Recalculate target offset on resize
      updateTargetOffset()
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
  }, [duration, onComplete, targetRef])

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

