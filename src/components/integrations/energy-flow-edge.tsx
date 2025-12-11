import { memo } from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";

export const EnergyFlowEdge = memo(function EnergyFlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.35,
  });

  const edgeData = data as {
    active?: boolean;
    isQoit?: boolean;
    triggerKey?: number;
    qoitAnimKey?: number;
    qoitStartTime?: number;
    index?: number;
  } | undefined;

  const isActive = edgeData?.active ?? false;
  const isQoit = edgeData?.isQoit ?? false;
  const triggerKey = edgeData?.triggerKey ?? 0;
  const qoitAnimKey = edgeData?.qoitAnimKey ?? 0;
  const qoitStartTime = edgeData?.qoitStartTime ?? 0;
  const index = edgeData?.index ?? 0;

  const delay = index * 0.3;
  const duration = 0.8;
  
  // Animation window: only animate if within 1.5 seconds of qoit start
  const animationWindow = 1500; // ms
  const timeSinceStart = qoitStartTime > 0 ? Date.now() - qoitStartTime : 0;
  const shouldAnimate = timeSinceStart < animationWindow;

  return (
    <g>
      {/* Base path - subtle */}
      <path
        d={edgePath}
        fill="none"
        stroke={isActive ? "#252525" : "#1a1a1a"}
        strokeWidth={1.5}
        strokeDasharray="4 6"
        opacity={0.5}
      />

      {/* Energy flow - animated version (only within animation window) */}
      {isActive && isQoit && shouldAnimate && (
        <>
          {/* Wide glow */}
          <path
            key={`glow-wide-${qoitAnimKey}`}
            d={edgePath}
            fill="none"
            stroke="#4a5d4a"
            strokeWidth={20}
            strokeLinecap="round"
            strokeDasharray="60 2000"
            strokeDashoffset="60"
            opacity={0.08}
            style={{ filter: "blur(10px)" }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="60"
              to="-2000"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>

          {/* Medium glow */}
          <path
            key={`glow-med-${qoitAnimKey}`}
            d={edgePath}
            fill="none"
            stroke="#5a7a5a"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="50 2000"
            strokeDashoffset="50"
            opacity={0.15}
            style={{ filter: "blur(5px)" }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="50"
              to="-2000"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>

          {/* Core */}
          <path
            key={`core-${qoitAnimKey}`}
            d={edgePath}
            fill="none"
            stroke="#6a9a6a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="40 2000"
            strokeDashoffset="40"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="40"
              to="-2000"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>

          {/* Bright center */}
          <path
            key={`bright-${qoitAnimKey}`}
            d={edgePath}
            fill="none"
            stroke="#9fcf9f"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="30 2000"
            strokeDashoffset="30"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="30"
              to="-2000"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>
        </>
      )}

      {/* Reverse flow - available mode */}
      {isActive && !isQoit && triggerKey > 0 && (
        <>
          <path
            key={`reverse-glow-${triggerKey}`}
            d={edgePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray="50 2000"
            strokeDashoffset="-2000"
            opacity={0.1}
            style={{ filter: "blur(6px)" }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="-2000"
              to="50"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>
          <path
            key={`reverse-core-${triggerKey}`}
            d={edgePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="40 2000"
            strokeDashoffset="-2000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="-2000"
              to="40"
              dur={`${duration}s`}
              begin={`${delay}s`}
              fill="freeze"
            />
          </path>
        </>
      )}
    </g>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if animation-critical props change
  const prevData = prevProps.data as { isQoit?: boolean; triggerKey?: number; qoitAnimKey?: number } | undefined;
  const nextData = nextProps.data as { isQoit?: boolean; triggerKey?: number; qoitAnimKey?: number } | undefined;
  
  return (
    prevData?.isQoit === nextData?.isQoit &&
    prevData?.triggerKey === nextData?.triggerKey &&
    prevData?.qoitAnimKey === nextData?.qoitAnimKey &&
    prevProps.sourceX === nextProps.sourceX &&
    prevProps.sourceY === nextProps.sourceY &&
    prevProps.targetX === nextProps.targetX &&
    prevProps.targetY === nextProps.targetY
  );
});

