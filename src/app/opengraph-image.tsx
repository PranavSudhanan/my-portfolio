import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(900px circle at 15% 10%, rgba(139,124,255,0.35), transparent 45%), radial-gradient(900px circle at 90% 30%, rgba(52,213,240,0.28), transparent 45%), #06070e",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8b7cff, #34d5f0)",
              color: "#06070e",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            PS
          </div>
          <div style={{ display: "flex", color: "#a2a9bd", fontSize: 28 }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#34d5f0", fontSize: 30, marginBottom: 12 }}>
            {profile.location}
          </div>
          <div
            style={{
              display: "flex",
              color: "#eef0f8",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontSize: 44,
              fontWeight: 700,
              background: "linear-gradient(90deg, #8b7cff, #34d5f0)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.role}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {["Python", "FastAPI", "React", "Next.js", "Azure", "Databricks"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#eef0f8",
                  fontSize: 26,
                }}
              >
                {t}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
