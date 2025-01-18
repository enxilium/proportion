'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface StatGraphProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
}

const StatGraph: React.FC<StatGraphProps> = ({ title, data, labels, color }) => {
  const maxValue = Math.max(...data);
  const maxHeight = 320; // Doubled from 160 to 320

  return (
    <div className="w-[512px] h-[512px] bg-white/20 backdrop-blur-sm rounded-3xl p-8 flex flex-col">
      <h3 className="text-white text-3xl font-semibold mb-4">{title}</h3>
      <div className="flex-1 flex items-end justify-between mb-16">
        {data.map((value, index) => (
          <div key={index} className="w-12 flex flex-col items-center gap-2">
            <motion.div 
              className="w-full rounded-t-lg"
              style={{ 
                backgroundColor: color,
                height: Math.max((value / maxValue) * maxHeight, 8),
                opacity: 0.8
              }}
              initial={{ height: 0 }}
              animate={{ height: Math.max((value / maxValue) * maxHeight, 8) }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
            <span className="text-white/70 text-lg rotate-45 origin-left translate-y-6 whitespace-nowrap">
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatGraph; 