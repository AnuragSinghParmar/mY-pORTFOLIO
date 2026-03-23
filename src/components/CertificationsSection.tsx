import { useRef, useState } from 'react';
import { Shield, Code, Database, BookOpen, Cpu, Brain, ExternalLink } from 'lucide-react';

// Import certificate images
import privacyImg from '../assets/certificates/privacy and security.png'
import genAiImg from '../assets/certificates/gen ai.png'
import mongoImg from '../assets/certificates/MongoDB.png'
import nodeImg from '../assets/certificates/nodejs.png'
import dsaImg from '../assets/certificates/dsa.png'
import ibmImg from '../assets/certificates/ibm os and hardware.png'

const CERTS = [
    {
        id: 1,
        title: 'Privacy & Security in Online Social Media',
        issuer: 'NPTEL',
        date: 'Jul–Oct 2025',
        icon: Shield,
        color: '#00E5FF',
        image: privacyImg,
        link: 'https://nptel.ac.in/noc/E_Certificate/NPTEL25CS117S135870187310375445',
        desc: 'Completed a 12-week NPTEL course on privacy, security, and risk management in social media platforms with a score of 75%.'
    },
    {
        id: 2,
        title: 'Master Generative AI & Tools',
        issuer: 'Infosys Springboard',
        date: 'Aug 2025',
        icon: Brain,
        color: '#7B61FF',
        image: genAiImg,
        link: 'https://verify.onwingspan.com',
        desc: 'Completed training on Generative AI concepts and tools including ChatGPT and modern AI workflows for prompt-based problem solving.'
    },
    {
        id: 3,
        title: 'Building GenAI Apps with MongoDB',
        issuer: 'MongoDB',
        date: 'Jun 2025',
        icon: Database,
        color: '#47A248',
        image: mongoImg,
        link: 'https://drive.google.com/file/d/1lXmaklMrMpDsrTWuAIX7mAhB8JC04fO6/view?usp=sharing',
        desc: 'Completed MongoDB learning path focused on building Generative AI-powered applications with scalable database integration.'
    },
    {
        id: 4,
        title: 'Node.js',
        issuer: 'Coursera (NIIT)',
        date: 'Sep 2025',
        icon: Code,
        color: '#68A063',
        image: nodeImg,
        link: 'https://coursera.org/verify/F192QS8EDY82',
        desc: 'Completed course on server-side JavaScript using Node.js covering backend fundamentals, scalable APIs, and async operations.'
    },
    {
        id: 5,
        title: 'Summer Training – Logic & Programming',
        issuer: 'LPU (CPE)',
        date: 'Jun–Jul 2025',
        icon: Cpu,
        color: '#FF6B6B',
        image: ibmImg,
        link: 'https://drive.google.com/file/d/1GppuCDKXB08YrRqCBCejzdAgtXKqQ0st/view?usp=sharing',
        desc: 'Completed intensive training in Logic Building, Programming, and Data Structures for real-world applications.'
    },
    {
        id: 6,
        title: 'Data Structures & Algorithms',
        issuer: 'LPU (iamneo)',
        date: 'Aug–Dec 2024',
        icon: BookOpen,
        color: '#FFD93D',
        image: dsaImg,
        link: 'https://lpucolab438.examly.io/certificate/U2FsdGVkX181huuWYLahy1XYhxfMnnm4qGkf2%2BnC1s0%3D',
        desc: 'Completed 72-hour course on Data Structures and Algorithms, building a strong foundation for coding interviews.'
    },
];

export default function CertificationsSection() {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredIdx(index);

        const rects = cardRefs.current.map(el => el?.getBoundingClientRect());
        const origin = rects[index];
        if (!origin) return;

        const originX = origin.left + origin.width / 2;
        const originY = origin.top + origin.height / 2;

        cardRefs.current.forEach((el, j) => {
            if (j === index || !el) return;
            const target = rects[j];
            if (!target) return;

            const targetX = target.left + target.width / 2;
            const targetY = target.top + target.height / 2;

            const distance = Math.hypot(originX - targetX, originY - targetY);
            const delay = distance * 1.5;

            el.animate([
                { transform: 'scale(1)', backgroundColor: 'rgba(5, 8, 20, 0.65)', borderColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 0 rgba(0,0,0,0)', filter: 'brightness(1) blur(2px)' },
                { transform: 'scale(1.025)', backgroundColor: 'rgba(20, 30, 50, 0.85)', borderColor: 'rgba(108, 92, 231, 0.6)', boxShadow: '0 0 25px rgba(0, 229, 255, 0.1)', filter: 'brightness(1.1) blur(0px)', offset: 0.3 },
                { transform: 'scale(1)', backgroundColor: 'rgba(5, 8, 20, 0.65)', borderColor: 'rgba(255, 255, 255, 0.05)', boxShadow: '0 0 0 rgba(0,0,0,0)', filter: 'brightness(1) blur(2px)' }
            ], {
                duration: 900,
                delay: delay,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'none'
            });
        });
    }

    return (
        <section id="certifications" style={{
            position: 'relative',
            width: '100vw',
            minHeight: '100vh',
            background: '#02030A',
            backgroundImage: 'radial-gradient(circle at 50% 10%, #05070D 0%, #02030A 100%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '6rem 2rem',
            zIndex: 1
        }}>
            {/* Noise Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
                zIndex: -1
            }} />

            <div style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
                <h2 style={{ color: '#fff', fontSize: '2.5rem', margin: 0, letterSpacing: '3px', fontWeight: 300 }}>CERTIFICATIONS</h2>
                <div style={{ height: '1px', width: '80px', background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)', margin: '15px auto 0' }} />
                <p style={{ color: '#778', fontSize: '0.95rem', marginTop: '15px', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
                    Courses and certifications I've earned along the way.
                </p>
            </div>

            <div className="cert-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2.5rem',
                width: '100%',
                maxWidth: '1200px',
                zIndex: 10
            }}>
                {CERTS.map((cert, i) => {
                    const Icon = cert.icon;
                    const isHovered = hoveredIdx === i;
                    const isOtherHovered = hoveredIdx !== null && hoveredIdx !== i;

                    return (
                        <div
                            key={cert.id}
                            ref={(el) => { cardRefs.current[i] = el; }}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            style={{
                                background: 'rgba(5, 8, 20, 0.65)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                padding: '0',
                                color: '#E0E6FF',
                                backdropFilter: 'blur(10px)',
                                position: 'relative',
                                cursor: 'default',
                                overflow: 'hidden',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                                opacity: isOtherHovered ? 0.4 : 1,
                                filter: isOtherHovered ? 'blur(2px) grayscale(50%)' : 'blur(0px) grayscale(0%)',
                                zIndex: isHovered ? 10 : 1,
                                boxShadow: isHovered ? '0 10px 40px rgba(0, 229, 255, 0.2)' : '0 4px 15px rgba(0,0,0,0.5)',
                            }}
                        >
                            {/* Inner active ambient glow */}
                            <div style={{
                                position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                                background: `radial-gradient(circle at center, ${isHovered ? '#00E5FF' : cert.color}15 0%, transparent 60%)`,
                                opacity: isHovered ? 1 : 0,
                                transition: 'opacity 0.6s ease',
                                pointerEvents: 'none',
                                zIndex: 0
                            }} />

                            {/* Certificate Thumbnail Preview */}
                            <div style={{
                                width: '100%',
                                height: '160px',
                                overflow: 'hidden',
                                borderBottom: `1px solid ${isHovered ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                                transition: 'border-color 0.4s ease',
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: isHovered ? 1 : 0.7,
                                        transition: 'opacity 0.4s ease, transform 0.6s ease',
                                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                />
                                {/* Dark gradient overlay at bottom of image */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                                    background: 'linear-gradient(transparent, rgba(5, 8, 20, 0.9))',
                                    pointerEvents: 'none'
                                }} />
                            </div>

                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 2rem 2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        color: isHovered ? '#00E5FF' : '#A0AABF',
                                        transition: 'all 0.4s ease',
                                        boxShadow: isHovered ? '0 0 15px rgba(0,229,255,0.2)' : 'none',
                                    }}>
                                        <Icon size={22} strokeWidth={1.5} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#56617A', letterSpacing: '1px', fontFamily: 'monospace' }}>
                                        {cert.date}
                                    </span>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 4px 0', lineHeight: '1.4', color: isHovered ? '#ffffff' : '#E0E6FF', transition: 'color 0.4s ease' }}>
                                        {cert.title}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: '#6C5CE7', margin: '0 0 8px 0', fontWeight: 500, letterSpacing: '0.5px' }}>
                                        {cert.issuer}
                                    </p>
                                    <p style={{ fontSize: '0.78rem', color: '#778899', margin: 0, lineHeight: '1.5' }}>
                                        {cert.desc}
                                    </p>
                                </div>

                                {/* Verify Link */}
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.8rem',
                                        color: isHovered ? '#00E5FF' : '#56617A',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s ease',
                                        marginTop: '4px',
                                        fontWeight: 500,
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    <ExternalLink size={14} /> Verify Certificate
                                </a>
                            </div>

                            {/* Liquid neon bottom-edge tracking */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%',
                                background: `linear-gradient(90deg, transparent, ${isHovered ? '#00E5FF' : '#444'}, transparent)`,
                                opacity: isHovered ? 1 : 0.2,
                                transition: 'all 0.4s ease',
                            }} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
