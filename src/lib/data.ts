// ─────────────────────────────────────────────────────────────
// Central content for the portfolio. Edit here to update the site.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Pranav S L",
  firstName: "Pranav",
  role: "Full Stack Software Developer",
  roles: [
    "Full Stack Developer",
    "Python & FastAPI Engineer",
    "React / Next.js Developer",
    "BI & Data Platform Builder",
  ],
  location: "Bangalore, Karnataka, India",
  email: "pranavsudhanan98@gmail.com",
  phone: "+91 97444 33671",
  linkedin: "https://www.linkedin.com/in/pranav-s-l-26782b255",
  github: "https://github.com/", // ← add your GitHub username
  resume: "/Pranav_S_L_Resume.pdf",
  summary:
    "Full Stack Software Developer with 4+ years of experience designing, building, and delivering scalable web applications and enterprise BI platforms with Python, Django, FastAPI, React and Next.js. I own features end-to-end — backend, frontend and cloud — and turn complex business data into dashboards, automated reports and conversational tools people actually use.",
  tagline:
    "I build scalable web apps, enterprise BI platforms and AI assistants — end to end.",
};

export const stats = [
  { value: "4+", label: "Years of experience" },
  { value: "10+", label: "Projects delivered" },
  { value: "3", label: "Companies" },
  { value: "5+", label: "Enterprise BI modules" },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  points: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "Software Developer",
    company: "Leapsurge Business Innovations",
    period: "May 2024 — Present",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    points: [
      "Design and maintain scalable web applications with Python, Django, FastAPI, React, Next.js and REST APIs for enterprise clients.",
      "Built Aspire BI end-to-end — the complete React frontend and complete FastAPI backend — turning complex enterprise data into interactive dashboards.",
      "Engineered the MILE module to programmatically fetch Power BI dashboards page-by-page and auto-generate PPT/PDF reports.",
      "Automated report scheduling, email delivery and Azure Blob Storage integration, eliminating manual report distribution.",
      "Hosted multi-tenant applications on Azure, separating Azure DevOps (CI/CD) and App Service hosting across distinct tenants.",
      "Built a Master Data Management platform supporting Excel/CSV ingestion and direct database inspection.",
    ],
    stack: ["Python", "FastAPI", "React", "Next.js", "Databricks", "Azure"],
  },
  {
    role: "Python Developer",
    company: "Jic IT Solutions Pvt Ltd",
    period: "Feb 2023 — May 2024",
    location: "Kochi, Kerala",
    type: "Full-time",
    points: [
      "Built and maintained web applications using Python, Django, Celery, REST APIs and JavaScript.",
      "Implemented backend services, authentication systems and database management layers.",
      "Optimized code performance and contributed to peer code reviews to raise overall code quality.",
    ],
    stack: ["Python", "Django", "Celery", "REST APIs", "JavaScript"],
  },
  {
    role: "Python Full Stack Developer — Intern",
    company: "Luminar Technolab Pvt Ltd",
    period: "Jul 2022 — Jan 2023",
    location: "Kochi, Kerala",
    type: "Internship",
    points: [
      "Developed responsive user interfaces using HTML5, CSS and JavaScript.",
      "Built REST APIs and integrated frontend components with Django backend services.",
      "Gained hands-on experience with Git / GitHub version control workflows.",
    ],
    stack: ["Django", "HTML5", "CSS", "JavaScript", "Git"],
  },
];

export type Project = {
  title: string;
  tag: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: string;
  featured?: boolean;
  accent: "violet" | "cyan" | "emerald" | "amber";
};

export const projects: Project[] = [
  {
    title: "LIA — Conversational AI Assistant",
    tag: "AI · Data",
    description:
      "A conversational AI assistant that answers natural-language business questions over live enterprise data.",
    highlights: [
      "Integrated Claude and GPT-5 for natural-language business queries",
      "Connected to Azure Databricks for real-time sales, stock & operational data",
    ],
    stack: ["Python", "FastAPI", "Claude", "GPT-5", "Databricks"],
    featured: true,
    accent: "violet",
  },
  {
    title: "AspireBI — Enterprise BI Platform",
    tag: "Full Stack · BI",
    description:
      "An enterprise business-intelligence platform built end-to-end — from React dashboards to automated report delivery.",
    highlights: [
      "Complete React frontend and complete FastAPI backend",
      "MILE module fetches & combines multi-page Power BI dashboards into unified reports",
      "Automated PPT/PDF export, email delivery, Azure Blob Storage & SharePoint",
      "Multi-tenant Azure deployment with Azure DevOps CI/CD",
    ],
    stack: ["React", "FastAPI", "MSSQL", "Databricks", "Azure"],
    featured: true,
    accent: "cyan",
  },
  {
    title: "LeapsurgeBI — Business Analytics",
    tag: "Backend · Analytics",
    description:
      "A data-driven analytics platform delivering reporting and insights to business users.",
    highlights: [
      "Built backend features with Python, Django and REST APIs",
      "Live at leapsurgebi.com",
    ],
    stack: ["Python", "Django", "REST APIs"],
    link: "https://leapsurgebi.com",
    featured: true,
    accent: "emerald",
  },
  {
    title: "Master Data Management (MDM)",
    tag: "Data Platform",
    description:
      "A platform for preparing, ingesting and inspecting enterprise datasets.",
    highlights: [
      "Excel/CSV ingestion and export for dataset preparation",
      "Interfaces for viewing database tables and inspecting records",
    ],
    stack: ["Python", "FastAPI", "SQL"],
    accent: "amber",
  },
  {
    title: "BestBI — Analytics for SMBs",
    tag: "BI · Cloud",
    description:
      "A business-intelligence solution for small and medium businesses with cloud storage and mobile access.",
    highlights: [
      "Integrated cloud storage and mobile access",
      "Live at bestbi.com",
    ],
    stack: ["Python", "REST APIs", "Cloud"],
    link: "https://bestbi.com",
    accent: "cyan",
  },
  {
    title: "Bansal TMT Points",
    tag: "Loyalty App",
    description:
      "A loyalty management application for TMT steel orders and points tracking.",
    highlights: [
      "Order and points tracking for TMT steel",
      "Django, DRF and Simple JWT authentication",
    ],
    stack: ["Django", "DRF", "JWT"],
    accent: "amber",
  },
  {
    title: "Flyworld — OTA Website",
    tag: "Travel",
    description:
      "An online travel platform enabling hotel and flight bookings.",
    highlights: [
      "Hotel and flight booking flows",
      "Django, REST APIs, HTML5, CSS & JavaScript",
    ],
    stack: ["Django", "REST APIs", "JavaScript"],
    accent: "emerald",
  },
  {
    title: "Votecast — Voter Management",
    tag: "Political Tech",
    description:
      "A tool that lets political parties filter voters and estimate election probabilities.",
    highlights: [
      "Voter filtering and segmentation",
      "Election probability calculation",
    ],
    stack: ["Python", "Django", "Analytics"],
    accent: "violet",
  },
];

export type SkillGroup = {
  title: string;
  skills: { name: string; icon: string }[];
};

// icon keys map to react-icons in Skills.tsx
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    skills: [
      { name: "Python", icon: "python" },
      { name: "Django", icon: "django" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Flask", icon: "flask" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    title: "Web & Styling",
    skills: [
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "REST APIs", icon: "api" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MSSQL", icon: "mssql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    title: "Cloud, Tools & Platforms",
    skills: [
      { name: "AWS", icon: "aws" },
      { name: "Azure", icon: "azure" },
      { name: "Azure DevOps", icon: "azuredevops" },
      { name: "Databricks", icon: "databricks" },
      { name: "Celery", icon: "celery" },
      { name: "Git", icon: "git" },
    ],
  },
];

export const education = [
  {
    degree: "Bachelor of Computer Applications",
    school: "Jain University",
    period: "2026 — Present",
    location: "Karnataka",
  },
  {
    degree: "Diploma in Computer Engineering",
    school: "MGM Polytechnic College",
    period: "2018 — 2021",
    location: "Trivandrum, Kerala",
  },
];

export const certifications = [
  "Python Web Development Expert — NACTET",
  "Certificate of Internship on Android",
  "PowerBI Workshop Certificate",
];

export const spokenLanguages = ["English", "Hindi", "Malayalam", "Tamil"];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
