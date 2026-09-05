import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(#1b1b20, #0c0c0f)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 180 180">
          <path
            d="M70 45 L37 90 L70 135"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M110 45 L143 90 L110 135"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M110 37 L70 143"
            fill="none"
            stroke="#9b93c9"
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
