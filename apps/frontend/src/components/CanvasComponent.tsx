"use client"

import { initDraw } from "@/draw";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef } from "react";

interface canvasComponentProps {
    roomId: string;
}

export const CanvasComponent: React.FC<canvasComponentProps> = ({ roomId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(roomId);
    const [isLoading, socket] = useSocket(roomId);

    useEffect(() => {
        if (canvasRef.current && socket && socket instanceof WebSocket) {
            (async () => {
                if (!canvasRef.current) return;
                await initDraw(canvasRef.current, roomId?.toString(), socket);
            })();
        }
        else {
            console.log('not ready')
        }
    }, [canvasRef.current, socket, roomId]);

    if (isLoading) {
        return <div>Connecting to the server...</div>
    }

    return (
        <div className="flex overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 mt-4 z-10 bg-[#232329] p-2 rounded-lg flex gap-4">
                <button className="cursor-pointer text-white" aria-label="Circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                <button className="cursor-pointer text-white" aria-label="Rectangle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="5" width="14" height="14" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                <button className="cursor-pointer text-white" aria-label="Line">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="5" y1="19" x2="19" y2="5" stroke="white" strokeWidth="2" />
                    </svg>
                </button>
            </div>
            <canvas ref={canvasRef} className="w-screen h-screen"/>
        </div>
    );
};