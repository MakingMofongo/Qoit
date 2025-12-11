"use client";

import { Handle, Position } from "@xyflow/react";
import { SlackMockup } from "./mockups/slack-mockup";
import { CalendarMockup } from "./mockups/calendar-mockup";
import { DiscordMockup } from "./mockups/discord-mockup";

interface IntegrationNodeProps {
  data: {
    id: string;
    isQoit: boolean;
    index: number;
  };
}

export function IntegrationNode({ data }: IntegrationNodeProps) {
  const { id, isQoit, index } = data;

  // Animation delay matches the edge animation reaching this node
  const animationDelay = 0.3 * index + 0.8; // edge delay + duration

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#4a5d4a] !border-0 !left-[-5px]"
      />
      {id === "slack" && (
        <SlackMockup isQoit={isQoit} animationDelay={animationDelay} />
      )}
      {id === "google_calendar" && (
        <CalendarMockup isQoit={isQoit} animationDelay={animationDelay} />
      )}
      {id === "discord" && (
        <DiscordMockup isQoit={isQoit} animationDelay={animationDelay} />
      )}
    </div>
  );
}



