'use client'
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";
import { useState, useEffect } from "react";
import PollingModal from "@/app/components/Polling";
import StatGraph from "@/app/components/StatGraph";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isPollingOpen, setIsPollingOpen] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  
  // Simulate API call to check if user has logged today
  useEffect(() => {
    const checkDailyLog = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Placeholder: randomly determine if user has logged
        const hasLogged = Math.random() > 0.5;
        setHasLoggedToday(hasLogged);
      } catch (error) {
        console.error('Error checking daily log:', error);
      }
    };

    checkDailyLog();
  }, []);

  const handleClose = () => {
    setIsPollingOpen(false);
    // After closing the modal, update the logged status
    setHasLoggedToday(true);
  };
  
  return (
    <div className="bg-[#FBAB7E] bg-gradient-to-[62deg] from-[#FBAB7E] to-[#F7CE68] overflow-hidden">
      <Navbar />
      
      {isPollingOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" 
          style={{ opacity: isPollingOpen ? 1 : 0 }}
        />
      )}
      
      <div className={`flex h-[calc(100vh-96px)] ${isPollingOpen ? 'pointer-events-none' : ''} z-30 flex-col items-center justify-center gap-8`}>
        <button 
          className="bg-white/90 px-10 py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-white/95 
          transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl
          text-[#2d2d2d] border border-white/20"
          onClick={() => setIsPollingOpen(true)}
        >
          {hasLoggedToday ? 'Edit Daily Log' : 'Do Your Daily Log'}
        </button>
        <div className="flex items-center gap-8">
          <StatGraph 
            title="Weekly Mood"
            data={[65, 70, 85, 60, 75, 80, 90]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            color="#4ECDC4"
          />
          <Clock goodStart={20} goodPercent={30} />
          <StatGraph 
            title="Time Efficiency"
            data={[80, 65, 75, 85, 70, 60, 85]}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            color="#FF6B6B"
          />
        </div>
        <button 
          className="bg-white/70 px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-white/80 
          transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
          text-[#2d2d2d] border border-white/20"
          onClick={() => {router.push('/analytics')}}
        >
          View Detailed Analytics
        </button>
      </div>
      
      <PollingModal isOpen={isPollingOpen} onClose={handleClose} />
    </div>
  );
}
