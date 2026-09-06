import type { IconType } from "react-icons";
import {
  SiPython,
  SiDjango,
  SiFastapi,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGit,
  SiDatabricks,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { FaAws } from "react-icons/fa6";

/** Ordered section anchors driving the full-page engine. */
export const SECTIONS = ["home", "about", "skills", "portfolio", "contact"];
export const N = SECTIONS.length;
export const PORTFOLIO = 3;

/** Shared cubic-bezier easing for entrance/slide motion. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const skills: { name: string; Icon: IconType }[] = [
  { name: "Python", Icon: SiPython },
  { name: "Django", Icon: SiDjango },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "JavaScript", Icon: SiJavascript },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "Redis", Icon: SiRedis },
  { name: "Azure", Icon: VscAzure },
  { name: "AWS", Icon: FaAws },
  { name: "Databricks", Icon: SiDatabricks },
  { name: "Git", Icon: SiGit },
];

/** Which mock preview UI each project renders inside its device frame. */
export type MockKind = "chat" | "dashboard" | "table" | "loyalty" | "travel";
export const projectMock: Record<string, MockKind> = {
  "LIA — Conversational AI Assistant": "chat",
  "AspireBI — Enterprise BI Platform": "dashboard",
  "LeapsurgeBI — Business Analytics": "dashboard",
  "Master Data Management (MDM)": "table",
  "BestBI — Analytics for SMBs": "dashboard",
  "Bansal TMT Points": "loyalty",
  "Flyworld — OTA Website": "travel",
  "Votecast — Voter Management": "dashboard",
};
