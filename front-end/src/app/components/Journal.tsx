'use client'
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JournalEntry {
  id: string;
  content: string;
  date: string;
}

interface JournalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onCreateEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
}

export default function Journal({ isOpen, onClose, entries, onCreateEntry }: JournalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: ''
  });

  const handleCreateEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    onCreateEntry({
      content: newEntry.content
    });

    setNewEntry({ title: '', content: '' });
    setIsCreating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/25 text-white font-secondary">
        <DialogHeader>
          <DialogTitle>Journal Entries</DialogTitle>
        </DialogHeader>

        {!isCreating && !selectedEntry && (
          <div className="space-y-4">
            <Button 
              onClick={() => setIsCreating(true)}
              className="w-full bg-[#EF7C24] hover:bg-[#EC6D10]"
            >
              Create New Entry
            </Button>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {entries.map((entry, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedEntry(entry)}
                  className="p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20"
                >
                  <p className="text-sm text-white/70">{entry.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCreating && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="mt-1 h-40 w-full rounded-md bg-white/10 p-2 text-white"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCreating(false)} variant="outline">Cancel</Button>
              <Button onClick={handleCreateEntry}>Save Entry</Button>
            </DialogFooter>
          </div>
        )}

        {selectedEntry && (
          <div className="space-y-4">
            <p className="text-sm text-white/70">{selectedEntry.date}</p>
            <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
            <DialogFooter>
              <Button onClick={() => setSelectedEntry(null)}>Back to List</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
