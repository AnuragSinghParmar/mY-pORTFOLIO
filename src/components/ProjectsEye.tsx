import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { Html } from '@react-three/drei'
import { BlendFunction } from 'postprocessing'
import { Github } from 'lucide-react'

// Import project images
import eduPortalImg from '../assets/New folder/Edu Portal.png'
import roomjiImg from '../assets/New folder/roomji.png'
import marketMindsImg from '../assets/New folder/Marketminds.png'
import secureFileImg from '../assets/New folder/secure file manager.png'
import touristGuideImg from '../assets/New folder/Tourist Guide Platform.png'

// Generate random projects


const PROJECT_DATA = [
    {
        id: 1,
        title: 'Edu Portal',
        link: 'https://github.com/AnuragSinghParmar/Learning-Management-System---MERN',
        desc: 'A MERN-based learning management system for schools and colleges. Streamlines workflows like attendance, announcements, and instant test report generation.',
        image: eduPortalImg
    },
    {
        id: 2,
        title: 'RoomJI',
        link: 'https://github.com/AnuragSinghParmar/RoomJi',
        desc: 'A student-friendly platform connecting pupils with affordable hostel accommodations. Streamlines booking for both owners and students with a clean MERN architecture.',
        image: roomjiImg
    },
    {
        id: 3,
        title: 'Market Minds',
        link: 'https://github.com/AnuragSinghParmar/MarketMinds-Online-Marketplace',
        desc: 'A sophisticated full-stack marketplace featuring a robust multi-role architecture and secure authentication for seamless buyer and seller transactions.',
        image: marketMindsImg
    },
    {
        id: 4,
        title: 'Secure File Manager',
        link: 'https://github.com/AnuragSinghParmar/Secure-File-Management-System',
        desc: 'A PHP application for private data sharing using end-to-end encryption and two-factor authentication to ensure maximum user data protection.',
        image: secureFileImg
    },
    {
        id: 5,
        title: 'Tourist Guide',
        link: 'https://github.com/AnuragSinghParmar/Tourist-Guide-Platform',
        desc: 'A travel planning platform powered by PHP and Tailwind CSS. Simplifies tour bookings and destination exploration with a highly responsive digital interface.',
        image: touristGuideImg
    },
];

const eyeVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLocalNormal;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vLocalNormal = normal;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const eyeFragmentShader = `
uniform float uTime;
uniform float uPupilDilation;
uniform vec3 uLightPos;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLocalNormal;
varying vec3 vPosition;

// Simple 2D noise
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vUv;
  vec3 n = normalize(vNormal); // For lighting
  vec3 ln = normalize(vLocalNormal); // For localized pupil
  
  float distFace = length(ln.xy); // distance from center of the pupil in local space
  
  // Base colors
  vec3 scleraColor = vec3(0.8, 0.8, 0.85); // desaturated
  vec3 irisColor1 = vec3(0.1, 0.4, 0.8); // Cyan-blue
  vec3 irisColor2 = vec3(0.02, 0.1, 0.3); // Deep blue
  vec3 pupilColor = vec3(0.0, 0.0, 0.0);
  
  vec3 finalColor = scleraColor;
  
  // Sclera noise (veins)
  float veinNoise = noise(vUv * 20.0 + uTime * 0.1);
  finalColor -= vec3(0.1, 0.02, 0.02) * smoothstep(0.6, 0.9, veinNoise) * (1.0 - smoothstep(0.0, 0.6, n.z));
  
  // Eye regions based on ln.z
  float irisRadius = 0.45;
  float pupilRadius = 0.15 + uPupilDilation * 0.05; // dilates
  
  if (ln.z > 0.0) {
    if (distFace < irisRadius) {
      // Iris procedural texture
      float angle = atan(ln.y, ln.x);
      float r = distFace / irisRadius;
      
      float irisPattern = noise(vec2(angle * 10.0, r * 20.0 + uTime * 0.2)) * 0.5 + 0.5;
      float radialLines = sin(angle * 50.0 + r * 10.0) * 0.5 + 0.5;
      
      vec3 irisCol = mix(irisColor2, irisColor1, r + irisPattern * 0.5);
      irisCol += vec3(0.2, 0.5, 0.9) * radialLines * 0.2; // highlights
      
      // Pupil blending
      if (distFace < pupilRadius) {
        float edge = smoothstep(pupilRadius - 0.02, pupilRadius + 0.02, distFace);
        finalColor = mix(pupilColor, irisCol, edge);
      } else {
        float edge = smoothstep(irisRadius - 0.05, irisRadius, distFace);
        finalColor = mix(irisCol, scleraColor, edge);
      }
    }
  }
  
  // Lighting (low key, soft reflections)
  vec3 lightDir = normalize(uLightPos - vPosition);
  float diff = max(dot(n, lightDir), 0.0);
  
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 reflectDir = reflect(-lightDir, n);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
  
  vec3 ambient = vec3(0.05, 0.05, 0.08); // dark environment
  
  vec3 result = ambient + finalColor * diff * 0.8 + vec3(1.0) * spec * 0.3;
  // Rim light around view edges
  float rim = 1.0 - max(dot(viewDir, n), 0.0);
  rim = smoothstep(0.6, 1.0, rim);
  result += vec3(0.1, 0.3, 0.5) * rim * 0.5; // faint cyan rim
  
  gl_FragColor = vec4(result, 1.0);
}
`

function HyperEye({ isHoveringTarget, isBlinking }: { isHoveringTarget: boolean, isBlinking: boolean }) {
    const eyeRef = useRef<THREE.Mesh>(null)
    const topLidRef = useRef<THREE.Mesh>(null)
    const bottomLidRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    const { mouse } = useThree()

    const targetRotation = useRef(new THREE.Vector2())
    const currentRotation = useRef(new THREE.Vector2())
    const pupilDilation = useRef(0)
    const blinkAmount = useRef(0)

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uPupilDilation: { value: 0 },
        uLightPos: { value: new THREE.Vector3(5, 5, 5) }
    }), [])

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime
        uniforms.uTime.value = t

        // Smooth Cursor Tracking (awareness)
        targetRotation.current.x = (mouse.y * Math.PI) / 8
        targetRotation.current.y = (mouse.x * Math.PI) / 8

        currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, delta * 3)
        currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, delta * 3)

        if (eyeRef.current) {
            // Add slight organic breathing to rotation
            eyeRef.current.rotation.x = currentRotation.current.x - Math.sin(t * 0.5) * 0.05
            eyeRef.current.rotation.y = -currentRotation.current.y + Math.cos(t * 0.4) * 0.05
        }

        // Pupil Dilation
        const targetDilation = isHoveringTarget ? 1.0 : 0.0
        pupilDilation.current = THREE.MathUtils.lerp(pupilDilation.current, targetDilation, delta * 5)
        uniforms.uPupilDilation.value = pupilDilation.current

        // Blink Animation
        const targetBlink = isBlinking ? 1.0 : 0.0
        blinkAmount.current = THREE.MathUtils.lerp(blinkAmount.current, targetBlink, delta * 15) // fast close/open

        if (topLidRef.current && bottomLidRef.current) {
            // Rotation ranges from completely open in the back to closed in the front
            topLidRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI * 0.6, 0, blinkAmount.current)
            bottomLidRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI * 1.6, Math.PI, blinkAmount.current)
        }
    })

    return (
        <group position={[0, 0, -2]}>
            <mesh ref={eyeRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={eyeVertexShader}
                    fragmentShader={eyeFragmentShader}
                    uniforms={uniforms}
                />
            </mesh>

            {/* Eyelids */}
            <mesh ref={topLidRef} rotation={[-Math.PI * 0.6, 0, 0]}>
                <sphereGeometry args={[2.05, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#050508" roughness={0.8} />
            </mesh>
            <mesh ref={bottomLidRef} rotation={[Math.PI * 1.6, 0, 0]}>
                {/* the bottom eyelid is just an inverted top eyelid */}
                <sphereGeometry args={[2.05, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#050508" roughness={0.8} />
            </mesh>
        </group>
    )
}

function HeroCard({ particle, onClick, activeProject }: { particle: any, onClick: () => void, activeProject: any }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(particle.position)
        }
    })

    const isSelected = activeProject && activeProject.id === particle.projectData.id
    const isHidden = activeProject && !isSelected

    return (
        <group ref={groupRef}>
            <Html transform distanceFactor={5} zIndexRange={[50, 0]} pointerEvents="auto">
                <div
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    style={{
                        width: '200px',
                        background: isSelected ? 'rgba(25, 25, 25, 0.95)' : 'rgba(15, 15, 15, 0.7)',
                        border: isSelected ? '1px solid #777' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                        boxShadow: isSelected ? '0 0 30px rgba(255, 255, 255, 0.15)' : '0 4px 15px rgba(0,0,0,0.8)',
                        opacity: isHidden ? 0 : 1,
                        pointerEvents: isHidden ? 'none' : 'auto',
                        transform: isSelected ? 'scale(0.9)' : 'scale(0.75)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onPointerOver={(e) => {
                        if (!isSelected) {
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)'
                            e.currentTarget.style.background = 'rgba(30, 30, 30, 0.85)'
                            e.currentTarget.style.transform = 'scale(1.05)'
                        }
                    }}
                    onPointerOut={(e) => {
                        if (!isSelected) {
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.background = 'rgba(15, 15, 15, 0.7)'
                            e.currentTarget.style.transform = 'scale(1)'
                        }
                    }}
                >
                    {isSelected && (
                        <div style={{ width: '100%', height: '90px', background: '#222', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden' }}>
                            <img src={particle.projectData.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: isSelected ? '#fff' : '#ccc', textShadow: isSelected ? '0 0 10px #777' : 'none' }}>
                        {particle.projectData.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: isSelected ? 4 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {particle.projectData.desc}
                    </p>
                </div>
            </Html>
        </group>
    )
}

function ParticleSwarm({ activeProject, onClickProject }: {
    activeProject: any,
    onClickProject: (proj: any) => void
}) {
    // Particle State (Calculate initial orbital states)
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < PROJECT_DATA.length; i++) {
            const angle = (i / PROJECT_DATA.length) * Math.PI * 2
            const radius = 5.5 // Orbit Distance
            const heightOffset = (Math.random() - 0.5) * 3 // Vertical scatter

            const pos = new THREE.Vector3(
                Math.cos(angle) * radius,
                heightOffset,
                Math.sin(angle) * radius - 2 // Offset Z to orbit around eye at Z=-2 actually eye is at 0,0,-2
            )
            temp.push({
                position: pos,
                velocity: new THREE.Vector3(),
                angle: angle,
                radius: radius,
                heightOffset: heightOffset,
                projectData: PROJECT_DATA[i],
            })
        }
        return temp
    }, [])

    const { mouse, camera } = useThree()

    useFrame((_state, delta) => {
        // Convert mouse to 3D world space loosely
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = -camera.position.z / dir.z
        const cursorPos = camera.position.clone().add(dir.multiplyScalar(distance))

        particles.forEach((p, i) => {
            // Continuously advance the orbital angle
            p.angle += delta * 0.15

            if (activeProject) {
                if (p.projectData && p.projectData.id === activeProject.id) {
                    // Selected Card: Bring to front and apply subtle organic float
                    const t = _state.clock.elapsedTime
                    const target = new THREE.Vector3(
                        0,
                        Math.sin(t * 1.5 + i) * 0.1,
                        2
                    )
                    p.velocity.add(target.sub(p.position).multiplyScalar(0.06))
                } else {
                    // Unselected Cards: Continue orbiting but push them back deeper and wider
                    const target = new THREE.Vector3(
                        Math.cos(p.angle) * (p.radius + 1.0),
                        p.heightOffset,
                        Math.sin(p.angle) * (p.radius + 1.0) - 5
                    )
                    p.velocity.add(target.sub(p.position).multiplyScalar(0.03))
                }
            } else {
                // Normal Orbit
                const target = new THREE.Vector3(
                    Math.cos(p.angle) * p.radius,
                    p.heightOffset + Math.sin(_state.clock.elapsedTime + i) * 0.5, // bob up and down
                    Math.sin(p.angle) * p.radius - 2
                )

                // Subtly repel from cursor on hover to give interactive feel
                const distToCursor = p.position.distanceTo(cursorPos)
                if (distToCursor < 3.0) {
                    const repel = p.position.clone().sub(cursorPos).normalize().multiplyScalar(0.5)
                    target.add(repel)
                }

                p.velocity.add(target.sub(p.position).multiplyScalar(0.03))
            }

            // Dampen and apply velocity
            p.velocity.multiplyScalar(0.85)
            p.position.add(p.velocity)
        })
    })

    return (
        <group>
            {particles.map(p => (
                <HeroCard
                    key={p.projectData.id}
                    particle={p}
                    activeProject={activeProject}
                    onClick={() => onClickProject(p.projectData)}
                />
            ))}
        </group>
    )
}


export default function ProjectsSection() {
    const [activeProject, setActiveProject] = useState<any>(null)
    const [isBlinking, setIsBlinking] = useState(false)

    const handleProjectClick = (proj: any) => {
        if (activeProject && activeProject.id === proj.id) {
            handleCloseProject();
            return;
        }
        // 1. Close the eye completely
        setIsBlinking(true)

        // 2. Open the eye
        setTimeout(() => {
            setIsBlinking(false)

            // 3. Wait for it to finish opening, then popup modal (cards & vortex)
            setTimeout(() => {
                setActiveProject(proj)
            }, 400) // time it takes to open
        }, 400) // time to keep eye closed
    }

    const handleCloseProject = () => {
        setIsBlinking(true)
        setTimeout(() => {
            setActiveProject(null)
            setIsBlinking(false)
        }, 400)
    }

    return (
        <section id="projects" className="projects-section relative" style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>

            {/* UI Overlays outside canvas for title */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10, pointerEvents: 'none' }}>
                <h2 style={{ color: '#fff', fontSize: '2rem', margin: 0, letterSpacing: '2px', fontWeight: 300 }}>PROJECTS</h2>
                <div style={{ height: '2px', width: '50px', background: '#666', marginTop: '10px', boxShadow: '0 0 10px #444' }} />
            </div>

            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={['#050505']} />

                {/* Lights */}
                <ambientLight intensity={0.2} />
                <spotLight position={[5, 5, 5]} intensity={1.5} color="#aaaaaa" penumbra={1} />

                {/* Core Elements */}
                <HyperEye isHoveringTarget={false} isBlinking={isBlinking} />
                <ParticleSwarm
                    activeProject={activeProject}
                    onClickProject={handleProjectClick}
                />


                {/* Cinematic Post-Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
                    {isBlinking ? <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.02, 0.02)} /> : <></>}
                    {activeProject ? <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={5} /> : <></>}
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <Noise opacity={0.04} />
                </EffectComposer>
            </Canvas>

            {/* GitHub Button - Rendered OUTSIDE Canvas as regular DOM for reliable click handling */}
            {activeProject && (
                <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #00E5FF, #7B61FF)',
                        color: '#000',
                        textDecoration: 'none',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 229, 255, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 229, 255, 0.4)';
                    }}
                >
                    <Github size={18} /> View GitHub Repo
                </a>
            )}
        </section>
    )
}
