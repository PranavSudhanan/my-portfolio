import { Poppins } from "next/font/google";
import V3 from "@/components/v3/V3";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export default function Home() {
  return (
    <div className={poppins.variable}>
      <V3 />
    </div>
  );
}
