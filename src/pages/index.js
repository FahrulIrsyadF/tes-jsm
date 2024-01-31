import Image from "next/image";
import { Inter } from "next/font/google";
import Vending from "@/component/vending";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="h-screen bg-white">
      <Vending />
    </div>
  );
}
