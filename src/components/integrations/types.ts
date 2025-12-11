export type SyncState = "idle" | "syncing" | "synced";

export interface Integration {
  id: string;
  available: boolean;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    available: true,
  },
  {
    id: "google_calendar",
    available: true,
  },
  {
    id: "discord",
    available: true,
  },
  {
    id: "freelance_bio",
    available: true,
  },
  {
    id: "qoit_page",
    available: true,
  },
];


