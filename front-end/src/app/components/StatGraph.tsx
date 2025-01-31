"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';

interface StatGraphProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  title: string;
}

export default React.memo(function StatGraph({ data, title }: StatGraphProps) {

  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false, 
  });

  const labels = data.labels;
  const datasets = data.datasets;
  const options = {
    plugins: {
      legend: {
        display: false, // Completely turn off the legend
      },
      tooltip: {
        enabled: true, // Disable tooltips (if they show dataset info)
      },
    },

    scales: {
      x: {
        ticks: {
          color: 'white', // X-axis tick labels color
          font: {
            family: 'Caveat',
          },
        },
        title: {
          display: true,
          color: 'white', // X-axis title color
        },
      },
      y: {
        ticks: {
          color: 'white', // Y-axis tick labels color
          font: {
            family: 'Caveat',
          },
        },
        title: {
          display: true,
          color: 'white', // Y-axis title color
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-xl">{title}</h1>
      <Line data={{ labels, datasets }} options={options}/>
    </div>
  )
})