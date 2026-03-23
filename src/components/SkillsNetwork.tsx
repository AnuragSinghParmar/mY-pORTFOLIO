import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { Html } from '@react-three/drei'

// Skill Graph Data
const SKILL_NODES = [
    { id: 'react', title: 'React', group: 1, pos: [-3, 1.5, 0], icon: 'https://cdn.simpleicons.org/react/white' },
    { id: 'node', title: 'Node.js', group: 1, pos: [-1, 2.5, -1], icon: 'https://cdn.simpleicons.org/nodedotjs/white' },
    { id: 'mongo', title: 'MongoDB', group: 1, pos: [1, 2.8, -2], icon: 'https://cdn.simpleicons.org/mongodb/white' },
    { id: 'tailwind', title: 'Tailwind CSS', group: 1, pos: [-4.5, 0, 1], icon: 'https://cdn.simpleicons.org/tailwindcss/white' },
    { id: 'next', title: 'Next.js', group: 1, pos: [-3.5, 3, -1], icon: 'https://cdn.simpleicons.org/nextdotjs/white' },

    { id: 'cpp', title: 'C++', group: 2, pos: [2, -1, 1], icon: 'https://cdn.simpleicons.org/cplusplus/white' },
    { id: 'java', title: 'Java', group: 2, pos: [4, -0.5, 0], icon: 'https://cdn.simpleicons.org/java/white' },
    { id: 'dsa', title: 'DSA', group: 2, pos: [2.5, -2.5, 0.5], icon: 'https://cdn.simpleicons.org/leetcode/white' },
    { id: 'python', title: 'Python', group: 2, pos: [5, -2, -1], icon: 'https://cdn.simpleicons.org/python/white' },

    { id: 'webgl', title: 'WebGL / Three.js', group: 3, pos: [-1, -2, 2], icon: 'https://cdn.simpleicons.org/threedotjs/white' },

    { id: 'docker', title: 'Docker', group: 4, pos: [0, -3.5, 0], icon: 'https://cdn.simpleicons.org/docker/white' },
    { id: 'aws', title: 'AWS', group: 4, pos: [1.5, -4, -1], icon: 'https://cdn.simpleicons.org/amazonaws/white' },
    { id: 'php', title: 'PHP', group: 2, pos: [3, 4, -1], icon: 'https://cdn.simpleicons.org/php/white' },
    { id: 'mysql', title: 'MySQL', group: 1, pos: [4.5, 2.5, -2], icon: 'https://cdn.simpleicons.org/mysql/white' },
    { id: 'figma', title: 'Figma', group: 3, pos: [-5, -2, 0.5], icon: 'https://cdn.simpleicons.org/figma/white' },
    { id: 'vscode', title: 'VS Code', group: 4, pos: [-3.5, -4, 0], icon: 'https://cdn.simpleicons.org/visualstudiocode/white' },
];

const CONNECTIONS = [
    ['react', 'node'], ['react', 'tailwind'], ['react', 'next'],
    ['node', 'mongo'], ['next', 'node'],
    ['cpp', 'java'], ['cpp', 'dsa'], ['java', 'dsa'], ['python', 'dsa'],
    ['webgl', 'react'],
    ['docker', 'aws'], ['docker', 'node'],
    ['node', 'java'],
    ['php', 'mysql'], ['php', 'node'], ['mysql', 'mongo'],
    ['figma', 'tailwind'], ['figma', 'react'],
    ['vscode', 'docker'], ['vscode', 'react']
];

// Color Palette
const COLOR_CYAN = new THREE.Color('#00E5FF')
const COLOR_PURPLE = new THREE.Color('#7B61FF')

function NetworkGraph() {
    const linesRef = useRef<THREE.LineSegments>(null)
    const pulsesRef = useRef<THREE.InstancedMesh>(null)

    const [hoveredNode, setHoveredNode] = useState<string | null>(null)

    // Setup base positions with random floating factors
    const nodesRef = useRef(SKILL_NODES.map(n => ({
        ...n,
        currentPos: new THREE.Vector3(...n.pos),
        basePos: new THREE.Vector3(...n.pos),
        timeOffset: Math.random() * 100,
        floatSpeed: 0.2 + Math.random() * 0.3
    })))

    // Map connection relations
    const connectionsIndices = useMemo(() => {
        return CONNECTIONS.map(([srcId, dstId]) => {
            const srcIdx = SKILL_NODES.findIndex(n => n.id === srcId)
            const dstIdx = SKILL_NODES.findIndex(n => n.id === dstId)
            return [srcIdx, dstIdx]
        }).filter(conn => conn[0] !== -1 && conn[1] !== -1)
    }, [])

    // Data flow pulses
    const NUM_PULSES = 15;
    const pulses = useRef(Array.from({ length: NUM_PULSES }).map(() => {
        const connIdx = Math.floor(Math.random() * connectionsIndices.length);
        return {
            connIdx,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.003
        }
    }))

    const lineGeometry = useMemo(() => new THREE.BufferGeometry(), [])
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame(({ clock }) => {
        const t = clock.elapsedTime

        // Update Nodes Floating
        nodesRef.current.forEach((node) => {
            node.currentPos.x = node.basePos.x + Math.sin(t * node.floatSpeed + node.timeOffset) * 0.2
            node.currentPos.y = node.basePos.y + Math.cos(t * node.floatSpeed * 1.2 + node.timeOffset) * 0.2
            node.currentPos.z = node.basePos.z + Math.sin(t * node.floatSpeed * 0.8 + node.timeOffset) * 0.1
        })

        // Update Lines Geometry
        const positions = new Float32Array(connectionsIndices.length * 6)
        const colors = new Float32Array(connectionsIndices.length * 6)

        connectionsIndices.forEach((conn, i) => {
            const src = nodesRef.current[conn[0]]
            const dst = nodesRef.current[conn[1]]

            positions[i * 6] = src.currentPos.x; positions[i * 6 + 1] = src.currentPos.y; positions[i * 6 + 2] = src.currentPos.z;
            positions[i * 6 + 3] = dst.currentPos.x; positions[i * 6 + 4] = dst.currentPos.y; positions[i * 6 + 5] = dst.currentPos.z;

            // Highlight logic
            let lineAlpha = 0.1 // Base thin logic using color lowering
            let color = COLOR_PURPLE

            if (hoveredNode) {
                if (src.id === hoveredNode || dst.id === hoveredNode) {
                    lineAlpha = 0.8
                    color = COLOR_CYAN
                } else {
                    lineAlpha = 0.05
                }
            }

            colors[i * 6] = color.r * lineAlpha; colors[i * 6 + 1] = color.g * lineAlpha; colors[i * 6 + 2] = color.b * lineAlpha;
            colors[i * 6 + 3] = color.r * lineAlpha; colors[i * 6 + 4] = color.g * lineAlpha; colors[i * 6 + 5] = color.b * lineAlpha;
        })

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        lineGeometry.attributes.position.needsUpdate = true
        lineGeometry.attributes.color.needsUpdate = true

        // Update Pulses
        if (pulsesRef.current) {
            pulses.current.forEach((pulse, i) => {
                pulse.progress += pulse.speed
                if (pulse.progress >= 1) {
                    pulse.progress = 0
                    pulse.connIdx = Math.floor(Math.random() * connectionsIndices.length)
                }

                const conn = connectionsIndices[pulse.connIdx]
                const src = nodesRef.current[conn[0]].currentPos
                const dst = nodesRef.current[conn[1]].currentPos

                dummy.position.lerpVectors(src, dst, pulse.progress)
                // fade pulse out near edges
                const scale = Math.sin(pulse.progress * Math.PI) * 0.15
                dummy.scale.setScalar(scale)
                dummy.updateMatrix()
                pulsesRef.current!.setMatrixAt(i, dummy.matrix)
            })
            pulsesRef.current.instanceMatrix.needsUpdate = true
        }
    })

    return (
        <group>
            {/* Connection Lines */}
            <lineSegments ref={linesRef} geometry={lineGeometry}>
                <lineBasicMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </lineSegments>

            {/* Traveling Data Pulses */}
            <instancedMesh ref={pulsesRef} args={[undefined, undefined, NUM_PULSES]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color={COLOR_CYAN} toneMapped={false} />
            </instancedMesh>

            {/* Glowing Nodes */}
            {nodesRef.current.map((node) => {
                const isHovered = hoveredNode === node.id
                const isNearby = hoveredNode && connectionsIndices.some(c =>
                    (nodesRef.current[c[0]].id === hoveredNode && nodesRef.current[c[1]].id === node.id) ||
                    (nodesRef.current[c[1]].id === hoveredNode && nodesRef.current[c[0]].id === node.id)
                )

                // Visual scaling based on interaction
                const scale = isHovered ? 1.4 : isNearby ? 1.1 : 1.0

                return (
                    <group key={node.id} position={node.currentPos} scale={scale}>
                        {/* HTML Label Node */}
                        <Html center zIndexRange={[100, 0]}>
                            <div
                                onPointerOver={() => setHoveredNode(node.id)}
                                onPointerOut={() => setHoveredNode(null)}
                                style={{
                                    transition: 'all 0.3s',
                                    background: isHovered ? 'rgba(5, 7, 13, 0.95)' : 'rgba(10, 12, 20, 0.6)',
                                    border: `1px solid ${isHovered ? '#00E5FF' : 'rgba(255,255,255,0.15)'}`,
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    backdropFilter: 'blur(8px)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: isHovered ? '0 0 20px rgba(0, 229, 255, 0.5)' : (isNearby ? '0 0 10px rgba(123, 97, 255, 0.3)' : '0 4px 6px rgba(0,0,0,0.5)'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                }}>
                                <img src={node.icon} alt={node.title} style={{ width: '18px', height: '18px', opacity: isHovered ? 1 : 0.8 }} />
                                <span style={{ fontSize: isHovered ? '0.9rem' : '0.8rem', letterSpacing: '1px', fontWeight: isHovered ? 600 : 400 }}>{node.title}</span>
                            </div>
                        </Html>
                    </group>
                )
            })}
        </group>
    )
}

export default function SkillsSection() {
    return (
        <section id="skills" className="skills-section relative" style={{ position: 'relative', width: '100vw', height: '100vh', background: '#05070D', overflow: 'hidden' }}>

            {/* UI Overlays outside canvas for title */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, pointerEvents: 'none', textAlign: 'right' }}>
                <h2 style={{ color: '#fff', fontSize: '2rem', margin: 0, letterSpacing: '2px', fontWeight: 300 }}>SKILLS</h2>
                <div style={{ height: '2px', width: '50px', background: '#00E5FF', marginTop: '10px', boxShadow: '0 0 10px #00E5FF', display: 'inline-block' }} />
                <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '10px', maxWidth: '250px' }}>
                    Tools and technologies I work with on a daily basis.
                </p>
            </div>

            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <color attach="background" args={['#05070D']} />

                <fog attach="fog" args={['#05070D', 10, 20]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />

                {/* Ambient floating dust/stars */}
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array(900).map(() => (Math.random() - 0.5) * 30), 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial size={0.05} color="#445588" transparent opacity={0.6} sizeAttenuation />
                </points>

                <NetworkGraph />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <Noise opacity={0.03} />
                </EffectComposer>
            </Canvas>
        </section>
    )
}
