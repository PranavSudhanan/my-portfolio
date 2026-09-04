"use client";

import type { IconType } from "react-icons";
import {
  SiPython,
  SiDjango,
  SiFastapi,
  SiFlask,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiCss,
  SiBootstrap,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiCelery,
  SiDatabricks,
  SiGit,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { FaAws } from "react-icons/fa6";
import { VscAzure, VscAzureDevops } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Stagger, staggerItem } from "./Reveal";
import { skillGroups } from "@/lib/data";

const iconMap: Record<string, IconType> = {
  python: SiPython,
  django: SiDjango,
  fastapi: SiFastapi,
  flask: SiFlask,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  html5: SiHtml5,
  css3: SiCss,
  bootstrap: SiBootstrap,
  api: TbApi,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mssql: DiMsqlServer,
  mongodb: SiMongodb,
  redis: SiRedis,
  aws: FaAws,
  azure: VscAzure,
  azuredevops: VscAzureDevops,
  databricks: SiDatabricks,
  celery: SiCelery,
  git: SiGit,
};

const marquee = [
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
  VscAzure,
  FaAws,
  SiDatabricks,
  SiCelery,
  SiGit,
  SiFlask,
  DiMsqlServer,
  SiBootstrap,
];

export function Skills() {
  return (
    <section id="skills" className="section-pad">
      <div className="shell">
        <SectionHeading
          index="03"
          subtitle="What I work with"
          title="Skills & tools"
        />

        {/* logo marquee */}
        <div className="marquee-mask relative mb-12 overflow-hidden py-2">
          <div className="flex w-max animate-marquee gap-10">
            {[...marquee, ...marquee].map((Icon, i) => (
              <Icon
                key={i}
                className="h-8 w-8 shrink-0 text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              />
            ))}
          </div>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={staggerItem}
              className="glow-border card-hover glass rounded-2xl p-6"
            >
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" />
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((s) => {
                  const Icon = iconMap[s.icon];
                  return (
                    <span
                      key={s.name}
                      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[var(--color-fg)]/90 transition-all hover:-translate-y-0.5 hover:border-[var(--color-cyan)]/40 hover:bg-white/[0.06]"
                    >
                      {Icon && (
                        <Icon className="text-base text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-cyan)]" />
                      )}
                      {s.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
