'use client'
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";
import { useState, useEffect } from "react";
import PollingModal from "@/app/components/Polling";

export default function Home() {
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
    <div className="bg-orange-300 overflow-hidden">
      <Navbar />
      
      {isPollingOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" 
          style={{ opacity: isPollingOpen ? 1 : 0 }}
        />
      )}
      
      <div className={`flex h-[calc(100vh-96px)] ${isPollingOpen ? 'pointer-events-none' : ''} z-30 flex-col items-center justify-center gap-8`}>
        <button 
          className="bg-white px-8 py-4 rounded-lg text-2xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsPollingOpen(true)}
        >
          {hasLoggedToday ? 'Edit Daily Log' : 'Do Your Daily Log'}
        </button>
        <Clock goodStart={20} goodPercent={30} />
      </div>
      
      <PollingModal isOpen={isPollingOpen} onClose={handleClose} />
    </div>
  );
}
