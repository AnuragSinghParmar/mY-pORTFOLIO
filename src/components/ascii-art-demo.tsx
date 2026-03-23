"use client";
import { AsciiArt } from "./ui/ascii-art";
import myImage from "../assets/WhatsApp Image 2026-03-17 at 02.58.59gg.jpeg";

export default function AsciiArtDemo() {
    return (
        <AsciiArt
            src={myImage}
            resolution={100}
            color="#888888"
            animationStyle="fade"
            animationDuration={1.5}
            animateOnView={false}
            className="ascii-demo"
        />
    );
}
