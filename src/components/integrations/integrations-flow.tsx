"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import {
  ReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { QoitNode } from "./qoit-node";
import { IntegrationNode } from "./integration-node";
import { EnergyFlowEdge } from "./energy-flow-edge";
import { QoitPreviewPanel } from "./qoit-preview-panel";
import { INTEGRATIONS } from "./types";
import type { SyncState } from "./types";

const nodeTypes = {
  qoit: QoitNode,
  integration: IntegrationNode,
};

const edgeTypes = {
  energy: EnergyFlowEdge,
};

interface IntegrationsFlowProps {
  username?: string | null;
  previewOpen?: boolean;
  onPreviewOpenChange?: (isOpen: boolean) => void;
}

export function IntegrationsFlow({ username, previewOpen = false, onPreviewOpenChange }: IntegrationsFlowProps) {
  const [isQoit, setIsQoit] = useState(false);
  const [backAtTime, setBackAtTime] = useState<Date | null>(null);
  const [triggerKey, setTriggerKey] = useState(0);
  const [qoitAnimKey, setQoitAnimKey] = useState(0); // Only changes when ENTERING qoit mode
  const [qoitStartTime, setQoitStartTime] = useState(0); // Timestamp when qoit mode started
  const [syncState, setSyncState] = useState<SyncState>("idle");

  const setShowPreview = useCallback((open: boolean) => {
    onPreviewOpenChange?.(open);
  }, [onPreviewOpenChange]);
  const lastToggleRef = useRef<number>(0);
  const isQoitRef = useRef(false); // Track current isQoit state for comparison

  const handleTimeChange = useCallback((newBackAtTime: Date | null) => {
    const now = Date.now();
    const shouldBeQoit = newBackAtTime !== null && newBackAtTime.getTime() > now;
    
    // Always update backAtTime so mockups stay reactive
    setBackAtTime(newBackAtTime);
    
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
    // Node dimensions (measured from actual components)
    const qoitNodeWidth = 420;
    const qoitNodeHeight = 500; // QoitNode is tall with timer, slider, buttons
    const horizontalGap = 120; // Gap between qoit and integrations
    
    // Integration node heights vary by type
    const integrationHeights: Record<string, number> = {
      slack: 175,
      google_calendar: 195,
      discord: 190,
    };
    const verticalGap = 16; // Tight gap between integration nodes
    
    // Calculate positions for each integration node
    const integrationPositions: { id: string; y: number; height: number }[] = [];
    let currentY = 0;
    
    for (const integration of INTEGRATIONS) {
      const height = integrationHeights[integration.id] || 180;
      integrationPositions.push({ id: integration.id, y: currentY, height });
      currentY += height + verticalGap;
    }
    
    // Total height of integration stack
    const totalIntegrationsHeight = currentY - verticalGap; // Remove last gap
    
    // Center qoit node vertically relative to the integration stack
    const qoitY = (totalIntegrationsHeight - qoitNodeHeight) / 2;
    
    const integrationX = qoitNodeWidth + horizontalGap + 40; // Fixed position for integrations
    const qoitX = -80; // Shift qoit node left independently
    
    return [
      {
        id: "qoit",
        type: "qoit",
        position: { x: qoitX, y: qoitY },
        data: { isQoit, onToggle: handleToggle, onTimeChange: handleTimeChange, syncState, username },
      },
      ...INTEGRATIONS.map((integration, index) => ({
        id: integration.id,
        type: "integration",
        position: { 
          x: integrationX, 
          y: integrationPositions[index].y 
        },
        data: { 
          ...integration, 
          isQoit, 
          backAtTime, 
          index, 
          username,
          onClick: () => setShowPreview(true)
        } as unknown as Record<
          string,
          unknown
        >,
      })),
    ];
  }, [isQoit, backAtTime, handleToggle, handleTimeChange, syncState, username, setShowPreview]);

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

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Stop propagation for all node clicks to prevent closing the preview
    event.stopPropagation();
    
    if (node.type === "integration") {
      const data = node.data as { onClick?: () => void };
      if (data.onClick) {
        data.onClick();
      }
    }
  }, []);

  const [paneElement, setPaneElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the ReactFlow pane element
    const findPane = () => {
      const pane = document.querySelector('.react-flow__pane') as HTMLElement;
      if (pane) {
        setPaneElement(pane);
      }
    };

    // Try immediately
    findPane();

    // Also try after a short delay in case ReactFlow hasn't rendered yet
    const timeout = setTimeout(findPane, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full h-full relative">
      <motion.div
        animate={{
          x: previewOpen ? -240 : 0,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full h-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={() => previewOpen && setShowPreview(false)}
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
          style={{ background: "transparent", width: "100%", height: "100%" }}
        />
      </motion.div>
      
      {/* Chevron button to open preview */}
      {paneElement && createPortal(
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => setShowPreview(true)}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center hover:bg-[#2a2a28] hover:border-[#4a5d4a] transition-colors z-30 shadow-lg"
          style={{ pointerEvents: "all" }}
        >
          <ChevronLeft className="w-5 h-5 text-[#faf9f7]" />
        </motion.button>,
        paneElement
      )}
      
      {paneElement && createPortal(
        <QoitPreviewPanel
          isOpen={previewOpen}
          onClose={() => setShowPreview(false)}
          isQoit={isQoit}
          backAtTime={backAtTime}
        />,
        paneElement
      )}
    </div>
  );
}

