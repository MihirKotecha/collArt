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
    const [isLoading,socket] = useSocket(roomId);

    useEffect(() => {
        if (canvasRef.current && socket &&socket instanceof WebSocket) {
            (async () => {
                if(!canvasRef.current) return;
                await initDraw(canvasRef.current, roomId?.toString(), socket);
            })();
        }
        else {
            console.log('not ready')
        }
    }, [canvasRef.current, socket, roomId]);

    if(isLoading){
        return <div>Connecting to the server...</div>
    }
    
    return (
        <div>
            <canvas ref={canvasRef}/>
        </div>
    );
};