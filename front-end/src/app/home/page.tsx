import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";

export default function Home() {
  return (
    <div className="bg-orange-300 overflow-hidden">
      <Navbar />
      <div className={`flex h-[calc(100vh-64px)] z-50 flex-row items-center justify-center`}>
        <Clock goodStart={20} goodPercent={30} />
      </div>
    </div>
  );
}
