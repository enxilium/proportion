import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { Chat } from "../components/Chat";

export default function Home() {
  return (
    <div className="bg-orange-100">
      <Chat/>
    </div>
  );
}
