'use client'
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";
import { useState, useEffect } from "react";
import PollingModal from "@/app/components/Polling";
import StatGraph from "@/app/components/StatGraph";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router = useRouter();
  const [isPollingOpen, setIsPollingOpen] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  
  // Add time update effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle milestone submission
    console.log({ milestoneTitle, milestoneDate });
    // Reset form
    setMilestoneTitle("");
    setMilestoneDate("");
  };
  
  return (
    <div className="overflow-hidden bg-gradient-to-r from-[#ff4e50] to-[#f9d423] relative">
      {/* Add background time display */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-white/10 text-[45vw] font-bold select-none">
          {currentTime}
        </div>
      </div>

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
            color="#75085a"
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white/70 px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-white/80 
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
              text-[#2d2d2d] border border-white/20">
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogDescription>
                Set a new milestone to track your progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMilestoneSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter milestone title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={milestoneDate}
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Milestone</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <PollingModal isOpen={isPollingOpen} onClose={handleClose} />
    </div>
  );
}
