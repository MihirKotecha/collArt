import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useSocket = (roomId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = Cookies.get("accessToken"); 
        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            setIsLoading(false);
            ws.send(JSON.stringify({
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