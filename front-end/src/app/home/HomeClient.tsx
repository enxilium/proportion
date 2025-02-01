'use client'

import Navbar from "@/app/components/Navbar";
import Clock from "@/app/components/Clock";
import { useState, useEffect, useMemo, useCallback } from "react";
import PollingModal from "@/app/components/Polling";
import StatGraph from "@/app/components/StatGraph";
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
import { Chat } from "../components/Chat";
import { getGeminiResponse } from "@/lib/gemini";
import { getName, getPolls, checkLatestPoll, addPoll, addMilestone, deleteMilestone, addJournal, getMilestones, getJournals, addUser } from '@/app/components/apiCaller';
import { memo } from 'react';



interface JournalEntry {
    id: string;
    date: string;
    content: string;
  }

// Memoize the StatGraph component
const MemoizedStatGraph = memo(StatGraph);

const HomeClient: React.FC<{ userID: string }> = ({ userID }) => {
  const [isPollingOpen, setIsPollingOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [notTriedMilestones, setNotTriedMilestones] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [notTriedJournals, setNotTriedJournals] = useState(true);
  const [userName, setUserName] = useState("");
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  
  const getUserName = useCallback(async () => {
    // Check localStorage first
    const storedName = localStorage.getItem('onboardingName');
    if (storedName) {
      // If we have a name in localStorage, add it to the database
      try {
        await addUser({
          id: userID,
          requestType: 'add_user',
          name: storedName,
          baseUrl: window.location.origin
        });
        setUserName(storedName);
        localStorage.removeItem('onboardingName');
        return;
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }

    // If no name in localStorage, get it from the database
    try {
      const response = await getName({
        id: userID,
        requestType: 'get_name',
        baseUrl: window.location.origin
      });
      const data = await response.json();
      if (data?.name) {
        setUserName(data.name);
      }
    } catch (error) {
      console.error('Error getting user name:', error);
    }
  }, [userID]);

  useEffect(() => {
    getUserName();
  }, [getUserName]);


  const checkTodaysPoll = useCallback(async () => {
    const response = await checkLatestPoll({
      id: userID, 
      requestType: 'check_latest_poll', 
      date: new Date().toISOString().split('T')[0]
    });
    const data = await response.json();
    if (data != null) {
      setHasLoggedToday(true);
    }
  }, [userID]);

  useEffect(() => {
    checkTodaysPoll();
  }, [userID, checkTodaysPoll]);

  const [milestones, setMilestones] = useState<{id: string, title: string}[]>([]);

  
  const [moodData, setMoodData] = useState<number[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<number[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

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

  /*
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
  */
  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const polls = await getPolls({ id: userID, requestType: 'get_polls', timeFrame: 'last_week' });
        const pollData = await polls.json();
        if (pollData != null) {
          const last7Polls = pollData.polls.slice(-7);
          const moodData: number[] = last7Polls.map((poll: {date: string, questions: {question: string, response: number}[]}) => poll.questions[0].response);
          const efficiencyData: number[] = last7Polls.map((poll: {date: string, questions: {question: string, response: number}[]}) => poll.questions[1].response);
          
          setMoodData(moodData);
          setEfficiencyData(efficiencyData);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };

    fetchPollData();
  }, [userID]);

  // Add this effect to fetch milestones when component mounts
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await getMilestones({id: userID, requestType: 'get_milestones'});
        const data = await response.json();
        if (data != null) setMilestones(data.milestones || []);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }
    };

    if (notTriedMilestones) {
        fetchMilestones();
        setNotTriedMilestones(false);
    }
  }, [userID, notTriedMilestones]);

  // Fetch journals when component mounts
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await getJournals({id: userID, requestType: 'get_journals'});
        const data = await response.json();
        if (data != null) setJournalEntries(data.journals || []);
      } catch (error) {
        console.error('Error fetching journals:', error);
        setJournalEntries([]);
      }
    };

    if (notTriedJournals) {
        fetchJournals();
        setNotTriedJournals(false);
    }
  }, [userID, notTriedJournals]);

  const handleClose = () => {
    setIsPollingOpen(false);
    // After closing the modal, update the logged status
    setHasLoggedToday(true);
  };
  
  const handleCreateJournalEntry = async (entry: { content: string }) => {
    const newEntry: JournalEntry = {
      id: userID,
      date: new Date().toISOString().split('T')[0],
      content: entry.content
    };
    if (newEntry.content) {
      await addJournal({
        id: userID as string, 
        requestType: 'add_journal', 
        journal: {
          content: entry.content,
          date: newEntry.date
        }
      });
      setJournalEntries(prev => [newEntry, ...prev]);
    }
  };


  const handlePollSubmit = async (pollData: {poll: {date: string, questions: {question: string, response: number}[]}, journal: string}) => {
    try {
      // Add poll
      await addPoll({
        id: userID as string, 
        requestType: 'add_poll', 
        poll: pollData.poll
      });

      // Add journal if there's content
      if (pollData.journal) {
        await addJournal({
          id: userID as string, 
          requestType: 'add_journal', 
          journal: {
            content: pollData.journal,
            date: pollData.poll.date
          }
        });
        setJournalEntries(prev => [{
          id: userID,
          content: pollData.journal,
          date: new Date().toISOString().split('T')[0]
        }, ...prev])
      }
      


      // Update local state
      setHasLoggedToday(true);
      handleClose();
    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  // Memoize the data objects
  const data = useMemo(() => ({
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
  }), [moodData]);

  const data2 = useMemo(() => ({
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
  }), [efficiencyData]);

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if both fields are filled
    if (!milestoneTitle || !milestoneDate) {
      return; // Don't proceed if fields are empty
    }
    
    // TODO: Handle milestone submission
    // Reset form
    setMilestoneTitle("");
    setMilestoneDate("");
    // Close the dialog
    setDialogOpen(false);
    await addMilestone({
      id: userID, 
      requestType: 'add_milestone', 
      milestone: {
        title: milestoneTitle,
        date: milestoneDate
      }
    });

    setMilestones(prev => [...prev, {id: userID, title: milestoneTitle}]);
  };

  const handleRemoveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;
    
    // Reset and close dialog
    deleteMilestone({
      id: userID, 
      requestType: 'delete_milestone', 
      title: selectedMilestone
    });

    try {
        const response = await getMilestones({id: userID, requestType: 'get_milestones'});
        const data = await response.json();
        setMilestones(data.milestones || []);
    } catch (error) {
        console.error('Error fetching milestones:', error);
    }

    setRemoveDialogOpen(false);
  };

  const [quote, setQuote] = useState('');
  useEffect(() => {
    const fetchQuote = async () => {
      const response = await getGeminiResponse("Generate me a short motivational quote, no more than 12 words, that enhances productivity. Return ONLY the quote and nothing else.");
      setQuote(response);
    };

    fetchQuote();
  }, []);

  // Add useEffect for delayed show
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-[url('/assets/images/background.png')] bg-cover bg-center opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-white/10 text-[50vw] font-sans select-none flex items-center justify-center pr-32">
          {currentTime}
        </div>
      </div>
      <div className="flex flex-col z-30">
        <Navbar />
        <div className={`flex ${isPollingOpen ? 'pointer-events-none' : ''} z-30 items-center justify-center`}>
          <div className="flex justify-between w-full p-8">
            <div className="flex-1 flex flex-col items-start">
              <div className="bg-[#3a3a3a]/90 rounded-xl border-white/20 hover:border-white/50 border-2 p-4 pl-0">
                <MemoizedStatGraph data={data} title="Mood Tracker" />
                <MemoizedStatGraph data={data2} title="Time Efficiency" />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-4">
              <p className="text-2xl font-bold text-white animate-fade duration-300 font-['Caveat'] text-center">
                Hello{userName === null ? "" : " " + userName}! {quote}
              </p>
              <Clock goodStart={20} goodPercent={30} />
              <div className={`flex flex-col gap-6 transition-opacity duration-1000 ${showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button 
                  className="bg-white/90 px-8 py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-[#dddddd] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl text-[#2d2d2d] border border-white/20"
                  onClick={() => setIsJournalOpen(true)}
                >
                  Journal
                </button>
                <button 
                  className={`bg-white/90 px-10 ${hasLoggedToday ? "opacity-0 pointer-events-none" : ""} py-5 rounded-2xl text-2xl font-bold shadow-xl hover:bg-[#dddddd] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl text-[#2d2d2d] border border-white/20`} 
                  onClick={() => setIsPollingOpen(true)}
                >
                  Do Your Daily Log
                </button>
              </div>
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
                            {milestones.map((milestone, index) => (
                              <SelectItem key={index} value={milestone.title} className="font-secondary text-black bg-white hover:bg-[#dddddd]">
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
    </div>
  );
}


export default HomeClient;