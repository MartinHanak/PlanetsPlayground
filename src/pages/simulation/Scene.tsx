import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"

import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"


export default function Scene() {
    const [SunTexture, MercuryTexture, VenusTexture, EarthTexture, MarsTexture]
        = useLoader(TextureLoader, [SunTextureImage, MercuryTextureImage, VenusTextureImage, EarthTextureImage, MarsTextureImage])

    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight />
            <mesh position={[10, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={SunTexture} />
            </mesh>
            <mesh position={[-10, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={MercuryTexture} />
            </mesh>
            <mesh position={[10, 10, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={VenusTexture} />
            </mesh>
            <mesh position={[10, 0, 10]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={EarthTexture} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[10, 32, 32]} />
                <meshStandardMaterial map={EarthTexture} />
            </mesh>
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial map={MarsTexture} />
            </mesh>
        </>
    )

}