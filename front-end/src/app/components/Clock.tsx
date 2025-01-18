'use client'
import React from 'react'

interface ClockProps {
    minuteAngle: number;  // 0-360 degrees
    hourAngle: number;    // 0-360 degrees
}

export const Clock: React.FC<ClockProps> = ({ minuteAngle, hourAngle }) => {
    return (
        <div className="relative w-32 h-32">
            {/* Clock face */}
            <div className="absolute w-full h-full rounded-full border-4 border-gray-800 bg-white">
                {/* Hour markers */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-4 bg-gray-800"
                        style={{
                            left: '50%',
                            transformOrigin: '50% 100%',
                            transform: `translateX(-50%) rotate(${i * 30}deg)`,
                            top: '5%'
                        }}
                    />
                ))}
                
                {/* Hour hand */}
                <div
                    className="absolute w-1.5 h-16 bg-gray-800 rounded-full"
                    style={{
                        left: '50%',
                        bottom: '50%',
                        transformOrigin: 'bottom',
                        transform: `translateX(-50%) rotate(${hourAngle}deg)`
                    }}
                />
                
                {/* Minute hand */}
                <div
                    className="absolute w-1 h-20 bg-gray-800 rounded-full"
                    style={{
                        left: '50%',
                        bottom: '50%',
                        transformOrigin: 'bottom',
                        transform: `translateX(-50%) rotate(${minuteAngle}deg)`
                    }}
                />
                
                {/* Center dot */}
                <div className="absolute w-3 h-3 bg-gray-800 rounded-full"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>
        </div>
    )
}

export default Clock;
