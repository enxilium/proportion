'use client'
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";
import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Journal from "@/app/components/Journal";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: number;
  efficiency?: number;
}
import { Chat } from "../components/Chat";

export default function Home() {
  const router = useRouter();
  const [isPollingOpen, setIsPollingOpen] = useState(false);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  // Placeholder milestones data - will come from API later
  const [milestones, setMilestones] = useState([
    { id: '1', title: 'Learn React' },
    { id: '2', title: 'Complete Project' },
    { id: '3', title: 'Exercise Daily' },
  ]);
  
  const [moodData, setMoodData] = useState<number[]>([65, 59, 80, 81, 56, 20, 80]);
  const [efficiencyData, setEfficiencyData] = useState<number[]>([65, 59, 80, 81, 40, 40, 40]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'First Entry',
      content: 'This is my first journal entry...',
      date: '2024-03-20'
    }
  ]);
  const [showJournals, setShowJournals] = useState(false);

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

  // Add this effect to fetch milestones when component mounts
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/milestones');
        // const data = await response.json();
        // setMilestones(data);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    fetchMilestones();
  }, []);

  const handleClose = () => {
    setIsPollingOpen(false);
    // After closing the modal, update the logged status
    setHasLoggedToday(true);
  };
  
  const handleCreateJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const handlePollSubmit = (pollData: any) => {
    // Update mood data
    setMoodData(prev => [...prev.slice(1), pollData.mood]);
    
    // Update efficiency data
    setEfficiencyData(prev => [...prev.slice(1), pollData.efficiency]);
    
    // Add poll data as journal entry
    const newJournalEntry: JournalEntry = {
      id: Date.now().toString(),
      title: pollData.title,
      content: pollData.journal,
      date: new Date(pollData.timestamp).toISOString().split('T')[0],
      mood: pollData.mood,
      efficiency: pollData.efficiency
    };
    
    setJournalEntries(prev => [newJournalEntry, ...prev]);
  };

  // Update the data object to use state variables
  const data = {
    labels: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return (date.getMonth() + 1).toString() + '/' + date.getDate().toString();
    }),
    datasets: [{
      label: '',
      data: moodData,
      fill: false,
      borderColor: '#EF7C24',
      backgroundColor: '#EC6D10',
    }]
  };

  const data2 = {
    labels: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return (date.getMonth() + 1).toString() + '/' + date.getDate().toString();
    }),
    datasets: [{
      label: '',
      data: efficiencyData,
      fill: false,
      borderColor: '#EF7C24',
      backgroundColor: '#EC6D10',
    }]
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if both fields are filled
    if (!milestoneTitle || !milestoneDate) {
      return; // Don't proceed if fields are empty
    }
    
    // TODO: Handle milestone submission
    console.log({ milestoneTitle, milestoneDate });
    // Reset form
    setMilestoneTitle("");
    setMilestoneDate("");
    // Close the dialog
    setDialogOpen(false);
  };

  const handleRemoveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    // TODO: Handle milestone removal via API
    console.log('Removing milestone:', selectedMilestone);
    
    // Update local state (remove from list)
    setMilestones(milestones.filter(m => m.id !== selectedMilestone));
    
    // Reset and close dialog
    setSelectedMilestone("");
    setRemoveDialogOpen(false);
  };

  return (
    <div className="relative bg-black overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[url('/assets/images/background.png')] bg-cover bg-center opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-white/10 text-[50vw] font-sans select-none flex items-center justify-center pr-32">
          {currentTime}
        </div>
      </div>
      <div className="relative z-10">
        <Navbar />
        {isPollingOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" 
            style={{ opacity: isPollingOpen ? 1 : 0 }}
          />
        )}
        
        <div className={`flex h-[calc(100vh-96px)] ${isPollingOpen ? 'pointer-events-none' : ''} z-30 items-center justify-center`}>
          <div className="flex justify-between w-full p-8">
            <div className="flex-1 flex flex-col items-start">
              <div className="bg-[#3a3a3a]/90 rounded-xl border-white/20 hover:border-white/50 border-2 p-4 pl-0">
                <StatGraph data={data} title="Mood Tracker" />
                <StatGraph data={data2} title="Time Efficiency" />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-4">
              <Clock goodStart={20} goodPercent={30} />
              <button className="bg-white/90 px-10 py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-[#dddddd] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl text-[#2d2d2d] border border-white/20" onClick={() => setIsPollingOpen(true)}>
                {hasLoggedToday ? 'Do Your Daily Log' : 'Do Your Daily Log'}
              </button>
              <button 
                className="bg-white/90 px-10 py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-[#dddddd] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl text-[#2d2d2d] border border-white/20"
                onClick={() => setIsJournalOpen(true)}
              >
                Journal
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-4 items-end">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-[#dddddd]
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
                    text-[#2d2d2d] border border-white/20">
                    Add Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/25 text-white font-secondary">
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
                          Goal
                        </Label>
                        <Input
                          id="title"
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          className="col-span-3"
                          placeholder="Enter milestone title"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Deadline
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={milestoneDate}
                          onChange={(e) => setMilestoneDate(e.target.value)}
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Milestone</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-[#dddddd] 
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
                    text-[#2d2d2d] border border-white/20">
                    Remove Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/25 text-white font-secondary">
                  <DialogHeader>
                    <DialogTitle>Remove Milestone</DialogTitle>
                    <DialogDescription>
                      Select a milestone to remove from your tracking list.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRemoveMilestone}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="milestone" className="text-right">
                          Milestone
                        </Label>
                        <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a milestone" />
                          </SelectTrigger>
                          <SelectContent>
                            {milestones.map((milestone) => (
                              <SelectItem key={milestone.id} value={milestone.id} className="font-secondary text-black bg-white hover:bg-[#dddddd]">
                                {milestone.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="destructive" className="bg-[#e11d48] hover:bg-[#be123c]">Remove Milestone</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        <PollingModal 
          isOpen={isPollingOpen} 
          onClose={() => setIsPollingOpen(false)}
          onSubmit={handlePollSubmit}
        />
        <Journal 
          isOpen={isJournalOpen} 
          onClose={() => setIsJournalOpen(false)}
          entries={journalEntries}
          onCreateEntry={handleCreateJournalEntry}
        />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Chat />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Chat />
      </div>
    </div>
  );
}
