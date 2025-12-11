"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { QoitNode } from "./qoit-node";
import { IntegrationNode } from "./integration-node";
import { EnergyFlowEdge } from "./energy-flow-edge";
import { INTEGRATIONS } from "./types";
import type { SyncState } from "./types";

const nodeTypes = {
  qoit: QoitNode,
  integration: IntegrationNode,
};

const edgeTypes = {
  energy: EnergyFlowEdge,
};

export function IntegrationsFlow() {
  const [isQoit, setIsQoit] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);
  const [qoitAnimKey, setQoitAnimKey] = useState(0); // Only changes when ENTERING qoit mode
  const [qoitStartTime, setQoitStartTime] = useState(0); // Timestamp when qoit mode started
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const lastToggleRef = useRef<number>(0);
  const isQoitRef = useRef(false); // Track current isQoit state for comparison

  const handleTimeChange = useCallback((backAtTime: Date | null) => {
    const now = Date.now();
    const shouldBeQoit = backAtTime !== null && backAtTime.getTime() > now;
    
    // Only act if state is actually changing
    if (shouldBeQoit === isQoitRef.current) {
      return;
    }
    
    const wasQoit = isQoitRef.current;
    
    // Update ref immediately to prevent double-calls
    isQoitRef.current = shouldBeQoit;
    
    if (shouldBeQoit) {
      // Switching TO qoit mode - record start time for animation window
      setQoitAnimKey((k) => k + 1);
      setQoitStartTime(Date.now());
      setSyncState("syncing");
      setTimeout(() => setSyncState("synced"), 2000);
    } else {
      // Switching back to available - trigger reverse pulse
      if (wasQoit) {
        setTriggerKey((k) => k + 1);
      }
      setSyncState("idle");
    }
    
    setIsQoit(shouldBeQoit);
  }, []);

  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleRef.current < 300) return;
    lastToggleRef.current = now;

    const wasQoit = isQoitRef.current;
    const newValue = !wasQoit;
    isQoitRef.current = newValue;

    // Only increment triggerKey when going BACK to available (for reverse pulse)
    // When going TO qoit, animation starts automatically when paths render
    if (!newValue && wasQoit) {
      setTriggerKey((k) => k + 1);
    }
    
    setIsQoit(newValue);

    // Handle sync states
    if (newValue) {
      setSyncState("syncing");
      setTimeout(() => setSyncState("synced"), 2000);
    } else {
      setSyncState("idle");
    }
  }, []);


  const nodes: Node[] = useMemo(() => {
    const qoitNodeWidth = 420;
    const integrationNodeWidth = 280;
    const gap = 200; // Increased gap between nodes
    const qoitX = 0;
    const integrationX = qoitX + qoitNodeWidth + gap;
    
    // Calculate total height needed for integrations
    const totalIntegrationHeight = INTEGRATIONS.length * 200;
    // Center the qoit node vertically relative to integrations
    const qoitY = (totalIntegrationHeight - 200) / 2;
    
    return [
      {
        id: "qoit",
        type: "qoit",
        position: { x: qoitX, y: qoitY },
        data: { isQoit, onToggle: handleToggle, onTimeChange: handleTimeChange, syncState },
      },
      ...INTEGRATIONS.map((integration, index) => ({
        id: integration.id,
        type: "integration",
        position: { x: integrationX, y: index * 200 },
        data: { ...integration, isQoit, index } as unknown as Record<
          string,
          unknown
        >,
      })),
    ];
  }, [isQoit, handleToggle, handleTimeChange, syncState]);

  const edges: Edge[] = useMemo(() => {
    return INTEGRATIONS.map((integration, index) => ({
      id: `qoit-${integration.id}`,
      source: "qoit",
      target: integration.id,
      type: "energy",
      data: {
        active: integration.available,
        isQoit,
        triggerKey,
        qoitAnimKey,
        qoitStartTime, // When qoit mode started - for animation window
        index,
      },
    }));
  }, [isQoit, triggerKey, qoitAnimKey, qoitStartTime]);

  return (
    <div className="w-full h-[650px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.65, maxZoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
      />
    </div>
  );
}

