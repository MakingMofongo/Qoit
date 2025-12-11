"use client";

import { Handle, Position } from "@xyflow/react";
import { SlackMockup } from "./mockups/slack-mockup";
import { CalendarMockup } from "./mockups/calendar-mockup";
import { DiscordMockup } from "./mockups/discord-mockup";
import { FreelanceBioMockup } from "./mockups/freelance-bio-mockup";
import { QoitPageMockup } from "./mockups/qoit-page-mockup";

interface IntegrationNodeProps {
  data: {
    id: string;
    isQoit: boolean;
    backAtTime: Date | null;
    index: number;
    username?: string | null;
    onClick?: () => void;
  };
}

export function IntegrationNode({ data }: IntegrationNodeProps) {
  const { id, isQoit, backAtTime, index, username, onClick } = data;

  // Animation delay matches the edge animation reaching this node
  const animationDelay = 0.3 * index + 0.8; // edge delay + duration

  return (
    <div 
      className="relative nodrag nopan select-none"
      style={{ pointerEvents: "all" }}
      onClick={onClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#4a5d4a] !border-0 !left-[-5px]"
      />
      <div 
        className="cursor-pointer hover:opacity-90 transition-opacity"
      >
        {id === "slack" && (
          <SlackMockup isQoit={isQoit} backAtTime={backAtTime} animationDelay={animationDelay} username={username} />
        )}
        {id === "google_calendar" && (
          <CalendarMockup isQoit={isQoit} backAtTime={backAtTime} animationDelay={animationDelay} username={username} />
        )}
        {id === "discord" && (
          <DiscordMockup isQoit={isQoit} backAtTime={backAtTime} animationDelay={animationDelay} username={username} />
        )}
        {id === "freelance_bio" && (
          <FreelanceBioMockup isQoit={isQoit} backAtTime={backAtTime} animationDelay={animationDelay} username={username} />
        )}
        {id === "qoit_page" && (
          <QoitPageMockup isQoit={isQoit} backAtTime={backAtTime} animationDelay={animationDelay} username={username} />
        )}
      </div>
    </div>
  );
}



