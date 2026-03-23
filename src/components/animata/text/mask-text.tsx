import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { useMousePosition } from "../../../hooks/use-mouse-position";

interface MaskTextProps extends React.HTMLAttributes<HTMLDivElement> {
    revealText: React.ReactNode | string;
    originalText: React.ReactNode | string;
}

export default function MaskText({
    revealText = "Hello World!",
    originalText = "Bye World!",
    className = "",
}: MaskTextProps) {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [{ x, y }, setMousePosition] = useState({ x: 0, y: 0 });
    useMousePosition(containerRef as React.RefObject<HTMLElement>, setMousePosition);
    const size = isHovered ? 500 : 50;

    return (
        <div className={`mask-text-container ${className}`} ref={containerRef}>
            <motion.div
                className="mask-text-reveal"
                style={{
                    maskImage: "url(/circle.svg)",
                    maskRepeat: "no-repeat",
                    maskSize: "50px",
                }}
                animate={{
                    WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
                    WebkitMaskSize: `${size}px`,
                } as any}
                transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
            >
                <div
                    className="mask-text-inner"
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                >
                    {revealText}
                </div>
            </motion.div>

            <div className="mask-text-inner">{originalText}</div>
        </div>
    );
}
