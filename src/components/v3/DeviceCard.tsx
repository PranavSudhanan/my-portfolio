"use client";

import { FiArrowRight } from "react-icons/fi";
import type { MockKind } from "./constants";
import { Tilt } from "./Tilt";
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
                style={{ background: r[2] === "Review" ? "var(--accent-2)" : "var(--accent)" }}
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

/** A tilting browser/device frame that renders a project's mock UI. When the
 *  project has a live URL the whole frame becomes a link ("Visit" cursor). */
export function DeviceCard({ kind, label, href }: { kind: MockKind; label: string; href?: string }) {
  const card = (
    <Tilt
      className={styles.device}
      max={9}
      scale={1.025}
      cursor={href ? "view" : "tilt"}
      cursorLabel={href ? "Visit" : undefined}
    >
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
    </Tilt>
  );
  if (!href) return card;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.deviceLink}
      aria-label={`Open ${label}`}
      draggable={false}
    >
      {card}
    </a>
  );
}
