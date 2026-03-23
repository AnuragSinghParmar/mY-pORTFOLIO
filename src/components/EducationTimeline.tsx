import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Code2, School } from 'lucide-react';

const EDUCATION = [
    {
        id: 1,
        institution: 'Delhi Public School',
        degree: 'Matriculation',
        date: 'Apr 2019 – Mar 2020',
        grade: 'Percentage: 69%',
        location: 'Bhiwani, Haryana',
        progress: 15,
        icon: School
    },
    {
        id: 2,
        institution: 'SkyHawk International School',
        degree: 'Intermediate',
        date: 'Apr 2021 – Mar 2022',
        grade: 'Percentage: 68%',
        location: 'Auchandi, New Delhi',
        progress: 50,
        icon: GraduationCap
    },
    {
        id: 3,
        institution: 'Lovely Professional University',
        degree: 'B.Tech – Computer Science & Engineering',
        date: 'Aug 2023 – Present',
        grade: 'CGPA: 7.51',
        location: 'Punjab, India',
        progress: 85,
        icon: Code2
    },
];

export default function EducationTimeline() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.3 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
    };

    return (
        <section
            ref={sectionRef}
            id="education"
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                width: '100vw',
                minHeight: '100vh',
                background: '#04050D',
                backgroundImage: 'radial-gradient(circle at 50% 100%, #05070D 0%, #02030A 100%)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6rem 2rem',
                zIndex: 1
            }}
        >
            <style>{`
                /* Responsive Timeline Line */
                .cosmos-timeline-line {
                    position: absolute;
                    background: linear-gradient(90deg, transparent, #00E5FF, transparent);
                    box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
                    transition: width 2.5s cubic-bezier(0.25, 0.1, 0.25, 1);
                    top: 50%;
                    left: 10%;
                    height: 2px;
                    border-radius: 2px;
                }

                /* Traveling Energy Particle */
                .cosmos-energy-particle {
                    position: absolute;
                    background: #fff;
                    box-shadow: 0 0 20px 6px #00E5FF, 0 0 40px 10px #7B61FF;
                    border-radius: 50%;
                    width: 6px; 
                    height: 6px;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: travelHorizontal 17s infinite linear;
                    animation-delay: 2.5s;
                    animation-fill-mode: both;
                    z-index: 5;
                }
                
                @keyframes travelHorizontal {
                    0% { left: 10%; opacity: 0; }
                    1% { opacity: 1; }
                    7.05% { left: 22%; }
                    24.70% { left: 22%; }
                    41.17% { left: 50%; }
                    58.82% { left: 50%; }
                    75.29% { left: 78%; }
                    92.94% { left: 78%; }
                    98% { opacity: 1; }
                    100% { left: 90%; opacity: 0; }
                }

                /* Nodes */
                .cosmos-node {
                    position: absolute;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #00E5FF;
                    cursor: pointer;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 1s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
                }
                
                .cosmos-node-visible {
                    opacity: 1;
                }
                
                .cosmos-node:hover {
                    transform: translate(-50%, -50%) scale(1.4);
                    background: #fff;
                    box-shadow: 0 0 25px rgba(0, 229, 255, 0.8), 0 0 45px rgba(123, 97, 255, 0.6);
                }

                /* Synchronized Node Pulse (peaks when energy particle hits it) */
                .cosmos-node-pulse {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: transparent;
                    box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
                    animation: nodePulsePeak 17s infinite linear;
                    animation-fill-mode: both;
                }

                @keyframes nodePulsePeak {
                    0% { box-shadow: 0 0 30px 10px rgba(0, 229, 255, 0.9), 0 0 50px 15px rgba(123, 97, 255, 0.8); background: #fff; transform: scale(1.1); }
                    17.64% { box-shadow: 0 0 30px 10px rgba(0, 229, 255, 0.9), 0 0 50px 15px rgba(123, 97, 255, 0.8); background: #fff; transform: scale(1.1); }
                    20% { box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); background: transparent; transform: scale(1); }
                    100% { box-shadow: 0 0 10px rgba(0, 229, 255, 0.5); background: transparent; transform: scale(1); }
                }

                /* Tooltip Glassmorphism (Always Visible) */
                .cosmos-tooltip {
                    position: absolute;
                    bottom: 300%; 
                    left: 50%; 
                    transform: translateX(-50%);
                    background: rgba(5, 8, 20, 0.6);
                    border: 1px solid rgba(0, 229, 255, 0.2);
                    padding: 18px 24px;
                    border-radius: 12px;
                    backdrop-filter: blur(8px);
                    color: #E0E6FF;
                    width: 280px;
                    opacity: 0.7;
                    pointer-events: auto;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .cosmos-node:hover .cosmos-tooltip {
                    opacity: 1 !important;
                    bottom: 350% !important;
                    background: rgba(5, 8, 20, 0.95) !important;
                    border: 1px solid rgba(0, 229, 255, 0.6) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 30px rgba(0, 229, 255, 0.4) !important;
                    transform: translateX(-50%) scale(1.05) !important;
                    animation: none !important;
                }



                /* Responsive Vertical Switch */
                @media (max-width: 768px) {
                    .cosmos-timeline-line {
                        left: 50%;
                        top: 10%;
                        width: 2px !important;
                        background: linear-gradient(180deg, transparent, #00E5FF, transparent);
                        transition: height 2.5s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }
                    
                    .cosmos-energy-particle {
                        left: 50%;
                        animation: travelVertical 17s infinite linear;
                        animation-delay: 2.5s;
                        animation-fill-mode: both;
                    }
                    
                    @keyframes travelVertical {
                        0% { top: 10%; opacity: 0; }
                        1% { opacity: 1; }
                        7.05% { top: 22%; }
                        24.70% { top: 22%; }
                        41.17% { top: 50%; }
                        58.82% { top: 50%; }
                        75.29% { top: 78%; }
                        92.94% { top: 78%; }
                        98% { opacity: 1; }
                        100% { top: 90%; opacity: 0; }
                    }

                    .cosmos-node {
                        left: 50% !important;
                        top: var(--mobile-top) !important;
                    }

                    .cosmos-tooltip {
                        bottom: auto !important;
                        left: 140%;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                    .cosmos-node:hover .cosmos-tooltip {
                        bottom: auto !important;
                        left: 170% !important;
                        transform: translateY(-50%) scale(1.05) !important;
                    }

                }
            `}</style>

            {/* Faint Stars / Parallax Noise */}
            <div style={{
                position: 'absolute', top: '-5%', left: '-5%', width: '110%', height: '110%',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                transition: 'transform 0.1s linear',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{ textAlign: 'center', marginBottom: 'auto', zIndex: 10 }}>
                <h2 style={{ color: '#fff', fontSize: '2.5rem', margin: 0, letterSpacing: '4px', fontWeight: 300 }}>ACADEMIC JOURNEY</h2>
                <div style={{ height: '1px', width: '80px', background: 'linear-gradient(90deg, transparent, #7B61FF, transparent)', margin: '15px auto 0' }} />
            </div>

            {/* The Timeline Wrapper */}
            <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '400px', zIndex: 10 }}>

                {/* The Main Glowing Beam */}
                <div
                    className="cosmos-timeline-line"
                    style={{
                        width: isVisible ? '80%' : '0%', // Desktop draw
                        height: isVisible ? '80%' : '0%' // Mobile draw (CSS handles override based on media query layout)
                    }}
                />

                {/* Traveling Energy Pulse (only active when visible) */}
                {isVisible && (
                    <div className="cosmos-energy-particle" />
                )}

                {/* The Nodes */}
                {EDUCATION.map((node, i) => {
                    const drawDelay = (node.progress / 100) * 2.5; // Timeline takes 2.5s to draw full. Node fades in exactly when beam hits its position.

                    const spatialOffset = 10 + node.progress * 0.8;

                    // The particle travels 8 spatial units per second. Transit covers progress 0->100 in 8 seconds.
                    // Preceding nodes each hold the particle for 3 seconds.
                    const travelArrival = (node.progress * 0.08) + (i * 3);

                    // Particle animation-delay is 2.5s initially, so we perfectly sync to 2.5 + arrival.
                    const pulseDelay = 2.5 + travelArrival;

                    const activeClass = isVisible ? 'cosmos-node-visible' : '';

                    return (
                        <div
                            key={node.id}
                            className={`cosmos-node ${activeClass}`}
                            style={{
                                // Desktop positioning
                                left: `${spatialOffset}%`,
                                // CSS media query shifts this to top for mobile!
                                '--mobile-top': `${spatialOffset}%`,
                                transitionDelay: `${drawDelay}s` // Fade in sequence
                            } as React.CSSProperties & { '--mobile-top': string }}
                        >
                            {/* Inner synchronized peak pulse */}
                            {isVisible && (
                                <div
                                    className="cosmos-node-pulse"
                                    style={{ animationDelay: `${pulseDelay}s` }}
                                />
                            )}

                            {/* Floating Glass Tooltip */}
                            <div className="cosmos-tooltip">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                                    <div style={{ background: 'rgba(0,229,255,0.1)', padding: '10px', borderRadius: '8px', color: '#00E5FF' }}>
                                        <node.icon size={20} />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#fff' }}>
                                        {node.degree}
                                    </h3>
                                </div>

                                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#6C5CE7', fontWeight: 500 }}>
                                    {node.institution}
                                </p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#8A95A5', fontStyle: 'italic' }}>
                                    {node.location}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.8rem', color: '#8A95A5', fontFamily: 'monospace' }}>
                                    <span>{node.date}</span>
                                    <span style={{ color: '#00E5FF' }}>{node.grade}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', padding: '2rem' }} />
        </section >
    );
}
