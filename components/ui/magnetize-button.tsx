"use client" 

import * as React from "react"

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface MagnetizeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
    asChild?: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

function MagnetizeButton({
    className,
    particleCount = 12,
    asChild = false,
    ...props
}: MagnetizeButtonProps) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i].x,
            y: particles[i].y,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        }));
    }, [particlesControl, particles]);

    return (
        <Button
            asChild={asChild}
            className={cn(
                "min-w-40 relative touch-none overflow-hidden",
                "bg-peach brutal-border brutal-shadow shadow-none",
                "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#292524]",
                "text-soft-black font-grotesk font-bold lowercase",
                "transition-all duration-300",
                className
            )}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            {...props}
        >
            <span className="relative flex items-center justify-center w-full h-full">
                {particles.map((_, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        initial={{ x: particles[index]?.x ?? 0, y: particles[index]?.y ?? 0 }}
                        animate={particlesControl}
                        className={cn(
                            "absolute w-2 h-2 rounded-full pointer-events-none z-0",
                            "bg-soft-black/20",
                            "transition-opacity duration-300",
                            isAttracting ? "opacity-100" : "opacity-0"
                        )}
                    />
                ))}
                <span className="relative w-full flex items-center justify-center gap-2 z-10 transition-transform duration-300">
                    {props.children}
                    {!props.children && (
                        <>
                            <Magnet
                                className={cn(
                                    isAttracting && "scale-110"
                                )}
                            />
                            {isAttracting ? "attracting..." : "hover me"}
                        </>
                    )}
                </span>
            </span>
        </Button>
    );
}

export { MagnetizeButton }
