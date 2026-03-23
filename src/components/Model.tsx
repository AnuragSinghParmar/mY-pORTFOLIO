import { useGLTF, Center, Float } from '@react-three/drei'

export default function Model(props: any) {
  const { scene } = useGLTF('/space_boi.glb')
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
      <Center>
        <primitive object={scene} {...props} />
      </Center>
    </Float>
  )
}
useGLTF.preload('/space_boi.glb')
