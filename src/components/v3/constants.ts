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

/** Duration of a full-page section slide (the input lock matches it). */
export const SLIDE_MS = 800;

/** Shared cubic-bezier easing for entrance/slide motion. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SkillGroup = "Backend" | "Frontend" | "Database" | "Cloud" | "Data" | "Tools";
export const skills: { name: string; Icon: IconType; group: SkillGroup }[] = [
  { name: "Python", Icon: SiPython, group: "Backend" },
  { name: "Django", Icon: SiDjango, group: "Backend" },
  { name: "FastAPI", Icon: SiFastapi, group: "Backend" },
  { name: "React", Icon: SiReact, group: "Frontend" },
  { name: "Next.js", Icon: SiNextdotjs, group: "Frontend" },
  { name: "TypeScript", Icon: SiTypescript, group: "Frontend" },
  { name: "JavaScript", Icon: SiJavascript, group: "Frontend" },
  { name: "PostgreSQL", Icon: SiPostgresql, group: "Database" },
  { name: "MongoDB", Icon: SiMongodb, group: "Database" },
  { name: "Redis", Icon: SiRedis, group: "Database" },
  { name: "Azure", Icon: VscAzure, group: "Cloud" },
  { name: "AWS", Icon: FaAws, group: "Cloud" },
  { name: "Databricks", Icon: SiDatabricks, group: "Data" },
  { name: "Git", Icon: SiGit, group: "Tools" },
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
