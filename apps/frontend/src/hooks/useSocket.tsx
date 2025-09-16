import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjFjYjcxMC04ZDgyLTQ0ZDItOTExYi05OGMxMzgwZTIxNGYiLCJpYXQiOjE3NTcyMzM4ODl9.DAgNaGwZHlgrAbELDOnhuu0NTQcSY2vNEu7m9bAKd5Y");
        ws.onopen = () => {
            setSocket(ws);
            setIsLoading(false);
            socket?.send(JSON.stringify({
                type: 'joinRoom',
                roomId : roomId
            }));
        };


        ws.onerror = () => {
            setIsLoading(false);
        };

        // Cleanup on unmount
        return () => {
            ws.close();
        };
    }, []);

    return [isLoading, socket];
}