"use client";

import { Draw } from "@/draw/Draw";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";

interface canvasComponentProps {
    roomId: string;
}

export type Tool = "rect" | "circle" | "line";

export const CanvasComponent: React.FC<canvasComponentProps> = ({ roomId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, socket] = useSocket(roomId);
    const [currTool, setCurrTool] = useState<Tool>("rect");
    const [drawings, setDrawings] = useState<Draw>();

    const updateShapte = (shape: Tool) => {
        setCurrTool(shape);
    }

    useEffect(() => {
        drawings?.updateTool(currTool);
    }, [drawings, currTool]);

    useEffect(() => {
        if (canvasRef.current && socket && socket instanceof WebSocket) {
            if (!canvasRef.current) return;
            const d = new Draw(canvasRef.current, roomId, socket);
            setDrawings(d);
        } else {
            console.log("not ready");
        }
    }, [socket]);

    if (isLoading) {
        return <div>Connecting to the server...</div>;
    }

    return (
        <div className="flex overflow-hidden">
            <div className="absolute h-10 left-1/2 top-0 -translate-x-1/2 mt-4 z-10 bg-[#232329] p-1 rounded-lg flex gap-4">
                <button
                    className={`h-full flex justify-center items-center aspect-square cursor-pointer text-white ${currTool === "circle" ? "bg-[#403e6a]" : "none"} rounded-lg`}
                    aria-label="Circle"
                    onClick={() => updateShapte('circle')}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="8"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </button>
                <button
                    className={`h-full flex justify-center items-center aspect-square cursor-pointer text-white ${currTool === "rect" ? "bg-[#403e6a]" : "none"} rounded-lg`}
                    aria-label="Rectangle"
                    onClick={() => updateShapte('rect')}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="5"
                            y="5"
                            width="14"
                            height="14"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </button>
                <button
                    className={`h-full flex justify-center items-center aspect-square cursor-pointer text-white ${currTool === "line" ? "bg-[#403e6a]" : "none"} rounded-lg`}
                    aria-label="Line"
                    onClick={() => updateShapte('line')}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            x1="5"
                            y1="19"
                            x2="19"
                            y2="5"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
            <canvas ref={canvasRef} className="w-screen h-screen" />
        </div>
    );
};
