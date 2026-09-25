import type { Metadata } from "next";
import { ResumeView } from "@/components/resume/resume-view";
import { VIEW_MODES, type ViewMode } from "@/data/resume";

export const metadata: Metadata = {
  title: "简历",
  description: "刘全生 / Jensen Liu 的简历：同一份经历，三种读法。",
};

function parseView(raw: string | string[] | undefined): ViewMode {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return VIEW_MODES.some((m) => m.id === v) ? (v as ViewMode) : "engineer";
}

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const view = parseView((await searchParams).view);
  return <ResumeView initialView={view} />;
}
