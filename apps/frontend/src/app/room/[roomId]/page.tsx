"use client"

import { CanvasComponent } from "@/components/CanvasComponent";
import { useParams } from "next/navigation";

export default function  drawingPage () {
    const params = useParams();

    const roomId = params.roomId;

    if(!roomId) return;


    return (
        <div>
            <CanvasComponent roomId={roomId.toString()} />
        </div>
    );
}