"use client";

import { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import type { MockKind } from "./constants";
import styles from "./v3.module.css";

function DashboardMock({ label }: { label: string }) {
  const bars = [42, 66, 50, 80, 92, 68, 86];
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>{label}</span>
        <span className={styles.mockPill}>Live</span>
      </div>
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <b>₹4.2M</b>
          <em>↗ 12%</em>
          <span>Revenue</span>
        </div>
        <div className={styles.kpi}>
          <b>18.4k</b>
          <em>↗ 8%</em>
          <span>Orders</span>
        </div>
        <div className={styles.kpi}>
          <b>92%</b>
          <em>↗ 3%</em>
          <span>Fulfilled</span>
        </div>
      </div>
      <div className={styles.chart}>
        {bars.map((h, i) => (
          <span
            key={i}
            className={styles.barCol}
            style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>LIA Assistant</span>
        <span className={styles.mockPill}>AI</span>
      </div>
      <div className={styles.chat}>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>Q3 sales for the South region?</div>
        <div className={`${styles.bubble} ${styles.bubbleBot}`}>
          South Q3 was ₹1.8M — up 14% vs Q2. Top SKU: Aspirin-500.
        </div>
        <div className={styles.typing}>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className={styles.chatInput}>
        Ask about sales, stock…
        <span className={styles.chatSend}>
          <FiArrowRight size={11} />
        </span>
      </div>
    </div>
  );
}

function TableMock() {
  const rows: [string, string, string][] = [
    ["ITM-1042", "Aspirin-500", "Active"],
    ["ITM-1043", "Paracetol", "Active"],
    ["ITM-1044", "Ibuprofen", "Review"],
    ["ITM-1045", "Amox-250", "Active"],
  ];
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>Master Data</span>
        <span className={styles.mockPill}>4,812 rows</span>
      </div>
      <div className={styles.table}>
        <div className={`${styles.trow} ${styles.thead}`}>
          <span>Item code</span>
          <span>Name</span>
          <span>Status</span>
        </div>
        {rows.map((r) => (
          <div key={r[0]} className={styles.trow}>
            <span>{r[0]}</span>
            <span>{r[1]}</span>
            <span className={styles.tStatus}>
              <i
                className={styles.tDot}
                style={{ background: r[2] === "Review" ? "var(--amber)" : "#3ddc97" }}
              />
              {r[2]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppCardMock({ variant }: { variant: "loyalty" | "travel" }) {
  if (variant === "loyalty") {
    return (
      <div className={styles.mock}>
        <div className={styles.mockHead}>
          <span className={styles.mockTitle}>Bansal TMT Rewards</span>
          <span className={styles.mockPill}>Gold</span>
        </div>
        <div className={styles.appCard}>
          <div className={styles.appHero}>
            <b>12,480</b>
            <span>Reward points</span>
            <div className={styles.progress}>
              <i style={{ width: "72%" }} />
            </div>
          </div>
          <div className={styles.appRow}>
            Order #TMT-8841 <span>+320 pts</span>
          </div>
          <div className={styles.appRow}>
            Redeemed voucher <span>−500 pts</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.mock}>
      <div className={styles.mockHead}>
        <span className={styles.mockTitle}>Flyworld</span>
        <span className={styles.mockPill}>Flights</span>
      </div>
      <div className={styles.appCard}>
        <div className={styles.appHero}>
          <b>COK → DXB</b>
          <span>Non-stop · 4h 15m · ₹18,900</span>
        </div>
        <div className={styles.appRow}>
          Marina Bay Hotel <span>★ 4.6</span>
        </div>
        <div className={styles.appRow}>
          2 guests · 3 nights <span>₹22,400</span>
        </div>
      </div>
    </div>
  );
}

/** A mouse-tilting browser/device frame that renders a project's mock UI. */
export function DeviceCard({ kind, label }: { kind: MockKind; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div className={styles.deviceScene} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className={styles.device}>
        <div className={styles.deviceBar}>
          <span className={styles.deviceDot} />
          <span className={styles.deviceDot} />
          <span className={styles.deviceDot} />
        </div>
        <div className={styles.deviceScreen}>
          {kind === "chat" ? (
            <ChatMock />
          ) : kind === "table" ? (
            <TableMock />
          ) : kind === "loyalty" ? (
            <AppCardMock variant="loyalty" />
          ) : kind === "travel" ? (
            <AppCardMock variant="travel" />
          ) : (
            <DashboardMock label={label} />
          )}
        </div>
      </div>
    </div>
  );
}
