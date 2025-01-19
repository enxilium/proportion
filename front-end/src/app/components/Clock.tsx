'use client'
import React, { useEffect, useRef, useState } from 'react'

interface ClockProps {
    goodStart: number;  // 0-100%
    goodPercent: number;    // 0-100%
}

export const Clock: React.FC<ClockProps> = ({ goodStart, goodPercent }) => {
    const hourHandRef = useRef<HTMLDivElement>(null);
    const minuteHandRef = useRef<HTMLDivElement>(null);
    const badSectorRef = useRef<HTMLDivElement>(null);
    const goodSectorRef = useRef<HTMLDivElement>(null);
    const [currentHourAngle, setCurrentHourAngle] = useState(0);
    const [currentMinuteAngle, setCurrentMinuteAngle] = useState(0);
    const [isGoodHovered, setIsGoodHovered] = useState(false);
    const [isBadHovered, setIsBadHovered] = useState(false);

    const describeArc = (startAngle: number, endAngle: number): string => {
        const radius = 220;
        const center = 250;
        const start = polarToCartesian(radius, startAngle);
        const end = polarToCartesian(radius, endAngle);
        
        const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
        
        return [
            "M", center, center,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
            "L", center, center,
        ].join(" ");
    };

    const polarToCartesian = (radius: number, angleInDegrees: number): { x: number, y: number } => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        const center = 250;
        return {
            x: center + (radius * Math.cos(angleInRadians)),
            y: center + (radius * Math.sin(angleInRadians))
        };
    };

    const describeAntiArc = (startAngle: number, endAngle: number): string => {
        const radius = 220;
        const center = 250;
        const start = polarToCartesian(radius, endAngle);
        const end = polarToCartesian(radius, startAngle);
        
        const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "1" : "0";
        
        return [
            "M", center, center,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
            "L", center, center,
        ].join(" ");
    };

    useEffect(() => {
        const targetHourAngle = goodStart * 3.6;
        const targetMinuteAngle = (goodPercent + goodStart) * 3.6;
        
        const startTime = Date.now();
        const duration = 3500;
        const startHourAngle = currentHourAngle;
        const startMinuteAngle = currentMinuteAngle;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const newHourAngle = startHourAngle + (targetHourAngle - startHourAngle) * easeProgress;
            const newMinuteAngle = startMinuteAngle + (targetMinuteAngle - startMinuteAngle) * easeProgress;
            
            setCurrentHourAngle(newHourAngle);
            setCurrentMinuteAngle(newMinuteAngle);
            
            if (hourHandRef.current) {
                hourHandRef.current.style.transform = `translateX(-50%) rotate(${newHourAngle}deg)`;
            }
            if (minuteHandRef.current) {
                minuteHandRef.current.style.transform = `translateX(-50%) rotate(${newMinuteAngle}deg)`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
        setTimeout(() => {
            if (badSectorRef.current) {
                badSectorRef.current.style.pointerEvents = 'all';
            }
            if (goodSectorRef.current) {
                goodSectorRef.current.style.pointerEvents = 'all';
            }
        }, 4500);
    }, [goodStart, goodPercent]);

    return (
        <div className="pl-2 relative w-[500px] h-[500px] flex justify-center items-center">
            <div className="absolute w-[440px] h-[440px] rounded-full border-[3px] border-black">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-[3px] ${i % 3 === 0 ? 'h-7' : 'h-5'} bg-black`}
                        style={{
                            left: "50%",
                            top: 0,
                            transform: `rotate(${i*30}deg)`,
                            transformOrigin: `center ${220-((i<=7 && i>=3) ? 2 : 0)}px`
                        }}
                    />
                ))}
                <div>
                    <div
                        className="absolute w-[10px] h-[10px] bg-black rounded-full"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                </div>
                
                <div
                    ref={hourHandRef}
                    className="absolute w-[7px] h-[25%] bg-black rounded-md"
                    style={{
                        left: '50%',
                        bottom: '50%',
                        transformOrigin: 'bottom',
                        transform: `translateX(-50%)`
                    }}
                />
                
                <div
                    ref={minuteHandRef}
                    className="absolute w-1 h-[45%] bg-black rounded-md"
                    style={{
                        left: '50%',
                        bottom: '50%',
                        transformOrigin: 'bottom',
                        transform: `translateX(-50%)`
                    }}
                />
            </div>
            <svg className="absolute w-full h-full" viewBox="0 0 500 500">
                <path
                    d={describeArc(currentHourAngle, currentMinuteAngle)}
                    fill="rgba(0, 255, 0, 0.28)"
                    stroke="none"
                    style={{
                        opacity: currentHourAngle === 0 ? 0 : 1,
                        transition: 'opacity 5s, transform 0.3s ease-in-out, fill 0.3s ease-in-out',
                        transform: isGoodHovered ? 'scale(1.07)' : 'scale(1)',
                        transformOrigin: 'center',
                        fill: isGoodHovered ? 'rgba(210, 210, 210, 1)' : 'rgba(255, 255, 255, 0.15)',
                        zIndex: isGoodHovered ? 100 : 0,
                    }}
                />
                <path
                    id="redSectorPath"
                    d={describeAntiArc(currentHourAngle, currentMinuteAngle)}
                    fill="rgba(255, 0, 0, 0.28)"
                    stroke="none"
                    style={{
                        opacity: 0,
                        animation: 'fadeIn 1.5s ease-in forwards',
                        animationDelay: '3s',
                        transform: isBadHovered ? 'scale(1.07)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'opacity 5s, transform 0.3s ease-in-out, fill 0.3s ease-in-out',
                        fill: isBadHovered ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.55)',
                        zIndex: isBadHovered ? 100 : 0,
                    }}
                />
            </svg>

            <div 
                className="absolute w-full h-full z-50"
                ref={badSectorRef}
                style={{
                    clipPath: `path('${describeAntiArc(currentHourAngle, currentMinuteAngle)}')`,
                    opacity: 0,
                    animation: 'fadeIn 2s ease-in forwards',
                    animationDelay: '4s',
                    pointerEvents: 'none',
                    transform: isBadHovered ? 'scale(1.07)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease-in-out'
                }}
                onMouseEnter={() => setIsBadHovered(true)}
                onMouseLeave={() => setIsBadHovered(false)}
            />

            <div 
                className="absolute w-full h-full z-50"
                ref={goodSectorRef}
                style={{
                    clipPath: `path('${describeArc(currentHourAngle, currentMinuteAngle)}')`,
                    opacity: 0,
                    animation: 'fadeIn 2s ease-in forwards',
                    animationDelay: '4s',
                    pointerEvents: 'none',
                    transform: isGoodHovered ? 'scale(1.07)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease-in-out'
                }}
                onMouseEnter={() => setIsGoodHovered(true)}
                onMouseLeave={() => setIsGoodHovered(false)}
            />
            
            {/* Text labels for sectors */}
            <div 
                className="absolute text-center opacity-100 transition-opacity duration-500"
                style={{
                    top: '65%',
                    left: '70%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    animationDelay: '2s',
                    animationFillMode: 'forwards'
                }}
            >
                <p className="font-bold text-lg">Good Time</p>
                {isGoodHovered && (
                    <>
                        
                        <p className="text-sm mt-2 transition-opacity duration-300">
                            Productive and fulfilling hours
                        </p>
                    </>
                )}
            </div>
            
            <div 
                className="absolute text-center transition-opacity duration-500"
                style={{
                    bottom: '60%',
                    left: '35%',
                    transform: 'translate(-50%, 50%)',
                    pointerEvents: 'none',
                    animationDelay: '2s',
                    animationFillMode: 'forwards'
                }}
            >
                <div className="font-bold text-lg text-white transition-opacity">Bad Time</div>
                {isBadHovered && (
                    <>
                        
                        <div className="text-sm mt-2 text-white transition-opacity duration-300">
                            Less productive or wasted time
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Clock;
