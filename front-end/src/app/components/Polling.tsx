'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    question: "How do you feel today?",
    type: "slider"
  },
  {
    id: 2,
    question: "How well was your time spent today?",
    type: "slider"
  },
  {
    id: 3,
    question: "Daily Journal Entry",
    type: "journal"
  }
];

const emojis = ['😢', '😕', '😐', '🙂', '😊'];

const StyledSlider = styled(Slider)({
  width: '90%',
  height: 12,
  '& .MuiSlider-rail': {
    background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    border: 'none',
    background: 'linear-gradient(270deg, transparent 0%, #E0E0E0 0%)',
    opacity: 1,
  },
  '& .MuiSlider-thumb': {
    height: 32,
    width: 32,
    backgroundColor: '#fff',
    border: '3px solid #4ECDC4',
    boxShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 15px rgba(78, 205, 196, 0.5)',
    },
  },
});

const PollingModal = ({ isOpen, onClose, onSubmit, userID }: { 
  isOpen: boolean; 
  onClose: () => void;
  userID: string;
  onSubmit: (data: { 
    poll: {
      date: string;
      questions: {
        question: string;
        response: number;
      }[];
    };
    journal: string;
  }) => void;
}) => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(2);
  const [journalEntry, setJournalEntry] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [responses, setResponses] = useState<Record<number, number | string>>({});

  const handleClose = () => {
    setCurrentQuestion(0);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmitJournal = async () => {
    try {
      const today = new Date();
      // Format date as YYYY-MM-DD
      const formattedDate = today.toISOString().split('T')[0];

      const pollData = {
        poll: {
          date: formattedDate,
          questions: questions.map(q => ({
            question: q.question,
            response: Number(responses[q.id])
          }))
        },
        journal: journalEntry,
      };

      // Call the onSubmit prop with the new data
      onSubmit(pollData);

      // Reset states
      setCurrentQuestion(0);
      setIsClosing(true);
      setJournalEntry('');
      setResponses({});
      
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);

    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  const getEmojiForValue = (value: number) => {
    if (value <= 20) return 0;
    if (value <= 40) return 1;
    if (value <= 60) return 2;
    if (value <= 80) return 3;
    return 4;
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setSliderValue(value);
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
    requestAnimationFrame(() => {
      const newEmojiIndex = getEmojiForValue(value);
      if (newEmojiIndex !== currentEmojiIndex) {
        setCurrentEmojiIndex(newEmojiIndex);
      }
    });
  };

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJournalEntry(newValue);
    setResponses(prev => ({
      ...prev,
      [questions[currentQuestion].id]: newValue
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSliderValue(50);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (currentQuestion < questions.length - 1) {
        if (event.key === 'Enter' && !event.shiftKey) {
          handleNext();
        }
      } else if (event.key === 'Enter' && event.shiftKey) {
        onClose();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentQuestion, onClose]);

  useEffect(() => {
    if (questions[currentQuestion].type === 'slider') {
      setResponses(prev => ({
        ...prev,
        [questions[currentQuestion].id]: sliderValue
      }));
    } else if (questions[currentQuestion].type === 'journal') {
      setResponses(prev => ({
        ...prev,
        [questions[currentQuestion].id]: ''
      }));
    }
  }, [currentQuestion]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl mx-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] p-8 rounded-3xl shadow-2xl"
              >
                <h1 className="text-5xl md:text-7xl font-bold text-center text-white mb-12 tracking-tight">
                  {questions[currentQuestion].question}
                </h1>

                {questions[currentQuestion].type === 'slider' && (
                  <div className="w-full flex flex-col items-center gap-8">
                    <motion.div
                      key={currentEmojiIndex}
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1.2, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-8xl md:text-9xl mb-8"
                    >
                      {emojis[currentEmojiIndex]}
                    </motion.div>
                    
                    <StyledSlider
                      value={sliderValue}
                      onChange={handleSliderChange}
                      aria-label="Response"
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 0, label: '😢' },
                        { value: 20, label: '😕' },
                        { value: 40, label: '😐' },
                        { value: 60, label: '🙂' },
                        { value: 80, label: '😊' },
                        { value: 100, label: '🎉'}
                      ]}
                    />
                  </div>
                )}

                {questions[currentQuestion].type === 'journal' && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <textarea
                      value={journalEntry}
                      onChange={handleJournalChange}
                      className="w-full h-64 p-6 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-lg 
                      focus:border-white/50 focus:ring-2 focus:ring-white/20 resize-none text-white text-xl
                      placeholder:text-white/50"
                      placeholder="Write your thoughts here..."
                    />
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#4ECDC4' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full 
                        font-semibold text-xl shadow-lg hover:bg-white/30 transition-all duration-300"
                        onClick={handleSubmitJournal}
                      >
                        Submit Journal
                      </motion.button>
                      <span className="text-white/70 text-sm mt-2">
                        Press Shift + Enter ⇧↵ to submit
                      </span>
                    </div>
                  </div>
                )}

                {currentQuestion < questions.length - 1 && (
                  <div className="flex flex-col items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#4ECDC4' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-12 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full 
                      font-semibold text-xl shadow-lg hover:bg-white/30 transition-all duration-300"
                      onClick={handleNext}
                    >
                      Next Question
                    </motion.button>
                    <span className="text-white/70 text-sm mt-2">
                      Press Enter ↵ to continue
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PollingModal;
