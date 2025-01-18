'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  type: 'number';
  min?: number;
  max?: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'What is your age?',
    type: 'number',
    min: 1,
    max: 120,
  },
  {
    id: 2,
    text: 'On average, how many hours do you spend on social media a day?',
    type: 'number',
    min: 0,
    max: 24,
  },
  {
    id: 3,
    text: 'How many hours do you spend watching TV/streaming per day?',
    type: 'number',
    min: 0,
    max: 24,
  },
];

const LIFE_EXPECTANCY = 80;
const MONTHS_IN_YEAR = 12;
const HOURS_IN_DAY = 24;
const DAYS_IN_MONTH = 30.44; // Average days in a month

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start at -1 for name input
  const [answers, setAnswers] = useState<number[]>([]);
  const [showCandles, setShowCandles] = useState(false);
  const [blownCandles, setBlownCandles] = useState<boolean[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [darknessLevel, setDarknessLevel] = useState(0);
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Calculate background color based on darkness level (0 to 1)
  const backgroundColor = `rgb(${Math.round(245 - darknessLevel * 245)}, ${Math.round(
    222 - darknessLevel * 222
  )}, ${Math.round(179 - darknessLevel * 179)})`;

  useEffect(() => {
    // Show "First, tell us your name" after 2 seconds
    const timer = setTimeout(() => {
      setShowNameInput(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentQuestion === -1) {
        if (inputValue.trim()) {
          setName(inputValue.trim());
          setInputValue('');
          setCurrentQuestion(0);
        }
        return;
      }

      const num = Number(inputValue);
      const currentQ = questions[currentQuestion];
      const minValue = currentQ.min ?? -Infinity;
      const maxValue = currentQ.max ?? Infinity;
      
      if (num >= minValue && num <= maxValue) {
        setAnswers([...answers, num]);
        setInputValue('');
        setError('');
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowCandles(true);
          startCandleAnimation();
        }
      } else {
        setError(`Please enter a number between ${minValue} and ${maxValue}`);
      }
    }
  };

  const calculateRemainingMonths = (age: number) => {
    const months = Math.floor((LIFE_EXPECTANCY - age) * MONTHS_IN_YEAR);
    return Math.max(0, Math.min(months, 960)); // Limit to reasonable number to prevent array errors
  };

  const startCandleAnimation = async () => {
    if (!answers[0]) return;
    
    const age = answers[0];
    const socialHours = answers[1] || 0;
    const streamingHours = answers[2] || 0;
    const totalMonths = calculateRemainingMonths(age);
    
    // Initialize all candles as lit (false means not blown out)
    const candleStates = Array(totalMonths).fill(false);
    setBlownCandles(candleStates);
    setDarknessLevel(0);
    
    // Show explanation
    setCurrentAnimation('Each candle below represents one month of your remaining life, assuming an average lifespan.');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentAnimation('');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Helper function to animate a batch of candles
    const animateBatch = async (start: number, count: number, message: string, darkness: number) => {
      // Fade in text
      setCurrentAnimation('');
      await new Promise(resolve => setTimeout(resolve, 400)); // Wait for exit animation
      setCurrentAnimation(message);
      await new Promise(resolve => setTimeout(resolve, 1300)); // Wait for entrance + display
      
      // Update all states in a single batch
      const updates = () => {
        // Update candles
        for (let i = start; i < start + count; i++) {
          candleStates[i] = true;
        }
        setBlownCandles([...candleStates]);
        setDarknessLevel(darkness);
      };
      
      updates();
      await new Promise(resolve => setTimeout(resolve, 1300)); // Wait for transitions
      
      // Fade out text
      setCurrentAnimation('');
      await new Promise(resolve => setTimeout(resolve, 400)); // Wait for exit animation
    };

    // Sleep calculation
    const sleepMonths = Math.min(Math.floor(totalMonths / 3), 320);
    await animateBatch(0, sleepMonths, 
      'You will spend about ' + sleepMonths + ' months sleeping...', 0.3);
    
    // Work calculation
    const workYearsLeft = Math.max(0, Math.min(65 - age, LIFE_EXPECTANCY - age));
    const workMonths = Math.min(
      Math.floor((workYearsLeft * MONTHS_IN_YEAR * 40) / (HOURS_IN_DAY * 7) * 2),
      totalMonths - sleepMonths
    );
    await animateBatch(sleepMonths, workMonths,
      `You'll spend about ${workMonths} months working a typical job...`, 0.6);
    
    // Eating calculation
    const eatingMonths = Math.min(40, totalMonths - sleepMonths - workMonths);
    await animateBatch(sleepMonths + workMonths, eatingMonths,
      'About ' + eatingMonths + ' months will be spent eating...', 0.8);
    
    // Social media calculation
    const dailyWastedHours = Math.min(24, socialHours + streamingHours);
    const monthsWasted = Math.min(
      Math.floor(
        (dailyWastedHours * DAYS_IN_MONTH * (LIFE_EXPECTANCY - age)) / (HOURS_IN_DAY * DAYS_IN_MONTH)
      ),
      totalMonths - sleepMonths - workMonths - eatingMonths
    );
    const socialStart = sleepMonths + workMonths + eatingMonths;
    await animateBatch(socialStart, monthsWasted,
      `Based on your current habits, you'll spend ${monthsWasted} months on social media and streaming...`, 1);
    
    // Final message
    const remainingMonths = totalMonths - (sleepMonths + workMonths + eatingMonths + monthsWasted);
    setCurrentAnimation('');
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentAnimation(`That leaves you with ${remainingMonths} months to truly live your life...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Blow out all remaining candles
    const finalUpdates = () => {
      candleStates.fill(true);
      setBlownCandles([...candleStates]);
      setDarknessLevel(1);
    };
    finalUpdates();
    
    // Wait for candles to fade
    await new Promise(resolve => setTimeout(resolve, 1300));
    
    // Show final message
    setCurrentAnimation('');
    await new Promise(resolve => setTimeout(resolve, 400));
    setShowFinalMessage(true);
    
    // Show button after a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowButton(true);
  };

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-center font-caveat ${
      darknessLevel > 0.6 ? 'text-white' : 'text-black'
    }`}>
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ backgroundColor: "#f5e6c3" }}
        animate={{ backgroundColor }}
        transition={{ duration: 1 }}
      />
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {currentQuestion === -1 ? (
            <motion.div
              key="welcome"
              className="space-y-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h1 
                className="text-6xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Welcome.
              </motion.h1>
              {showNameInput && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-4xl">First, tell us your name.</h2>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b-2 border-current text-3xl text-center focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </motion.div>
              )}
            </motion.div>
          ) : !showCandles ? (
            <motion.section
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} 
              className="space-y-8 text-center"
            >
              <h2 className="text-4xl">{questions[currentQuestion].text}</h2>
              <input
                type="number"
                className="w-full bg-transparent border-b-2 border-current text-3xl text-center focus:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${questions[currentQuestion].min}-${questions[currentQuestion].max}`}
                min={questions[currentQuestion].min}
                max={questions[currentQuestion].max}
              />
              {error && (
                <p className="text-2xl" style={{ color: darknessLevel > 0.6 ? '#ff9999' : '#cc0000' }}>{error}</p>
              )}
            </motion.section>
          ) : (
            <motion.section
              key="candles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-full text-center"
            >
              <AnimatePresence mode="wait">
                <div className="relative w-full max-w-full text-center">
                  <div className="h-32 relative">
                    <AnimatePresence mode="wait">
                      {showFinalMessage ? (
                        <motion.div 
                          className="flex flex-col items-center justify-center space-y-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div 
                            className="text-4xl text-white"
                          >
                            Don't waste it all.
                          </motion.div>
                          {showButton && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="mt-8 px-6 py-3 bg-white text-black rounded-full text-xl hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                // Handle button click
                              }}
                            >
                              get started
                            </motion.button>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key={currentAnimation}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center text-4xl px-4"
                          style={{ color: darknessLevel > 0.6 ? '#fff' : '#000' }}
                        >
                          {currentAnimation}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="w-full max-w-full overflow-hidden px-2">
                    <div className="candles-grid">
                      {Array(calculateRemainingMonths(answers[0])).fill(null).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: blownCandles[index] ? 0.6 : 1 }}
                          transition={{ duration: 1 }}
                          className="candle-container"
                        >
                          <div
                            className={`candle ${
                              blownCandles[index] 
                                ? 'candle-off' 
                                : 'candle-lit'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
