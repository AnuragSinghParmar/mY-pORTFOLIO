import { Children, cloneElement, useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";

export function Terminal({ children }: { children: ReactNode }) {
    const childrenArray = Children.toArray(children);
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="terminal-window">
            <div className="terminal-header">
                <span className="terminal-btn close" />
                <span className="terminal-btn minimize" />
                <span className="terminal-btn maximize" />
            </div>
            <div className="terminal-content">
                {childrenArray.map((child, index) => {
                    if (index <= currentIndex) {
                        return cloneElement(child as ReactElement<any>, {
                            key: index,
                            onComplete: () => {
                                if (index === currentIndex) {
                                    setCurrentIndex(index + 1);
                                }
                            }
                        });
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export function TypingAnimation({
    children,
    onComplete,
    className = "",
    infinite = false
}: {
    children: string,
    onComplete?: () => void,
    className?: string,
    infinite?: boolean
}) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let i = 0;
        let isDeleting = false;

        const type = () => {
            if (!isDeleting) {
                if (i < children.length) {
                    setDisplayedText(children.substring(0, i + 1));
                    i++;
                    timeout = setTimeout(type, 60);
                } else {
                    if (infinite) {
                        isDeleting = true;
                        timeout = setTimeout(type, 2000); // Wait 2s before deleting
                    } else {
                        if (onComplete) onComplete();
                    }
                }
            } else {
                if (i > 0) {
                    setDisplayedText(children.substring(0, i - 1));
                    i--;
                    timeout = setTimeout(type, 30);
                } else {
                    isDeleting = false;
                    timeout = setTimeout(type, 500); // Wait 0.5s before re-typing
                }
            }
        };

        timeout = setTimeout(type, 60);
        return () => clearTimeout(timeout);
    }, [children, onComplete, infinite]);

    return (
        <div className={`terminal-line ${className}`}>
            <span className="terminal-prompt">{">"}</span>
            {displayedText}
            <span className="cursor-blink">_</span>
        </div>
    );
}

export function AnimatedSpan({
    children,
    onComplete,
    className = ""
}: {
    children: ReactNode,
    onComplete?: () => void,
    className?: string
}) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (onComplete) onComplete();
        }, 500); // delay moving to the next item
        return () => clearTimeout(timeout);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`terminal-line ${className}`}
        >
            {children}
        </motion.div>
    );
}
