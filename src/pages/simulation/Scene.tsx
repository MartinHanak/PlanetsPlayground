import { useLoader, useFrame, ThreeElements, ThreeEvent } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { OrbitControls } from "@react-three/drei"
import { RootState } from "@react-three/fiber"


import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"
import { useEffect, useRef } from "react"

import MassObject from "./MassObject"
import { Mesh } from "three"

import Controls from "./Controls"

import MassObjectData from "./computation/MassObjectData";
import initializeMassObjectArray from "./computation/initializeMassObjectArray"


export interface initialMassObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}


interface sceneProps {
    initialMassObjectDataArray: initialMassObjectData[]
}

export default function Scene({ initialMassObjectDataArray }: sceneProps) {


    const moving = useRef<boolean>(false);

    const toggleMoving = () => {
        moving.current = !moving.current;
        return moving.current;
    }

    const [SunTexture, MercuryTexture, VenusTexture, EarthTexture, MarsTexture]
        = useLoader(TextureLoader, [SunTextureImage, MercuryTextureImage, VenusTextureImage, EarthTextureImage, MarsTextureImage])

    const textureDictionary = {
        "Sun": SunTexture,
        "Mercury": MercuryTexture,
        "Venus": VenusTexture,
        "Earth": EarthTexture,
        "Mars": MarsTexture,
        "Default": MarsTexture
    }

    const massObjectArray = useRef<MassObjectData[]>([]);
    initializeMassObjectArray(massObjectArray, initialMassObjectDataArray, textureDictionary)


    const handleMassObjectClick = (object: MassObjectData) => {
        console.log(object)
    }

    useEffect(() => {
        console.log("log from use effects")
    }, [])

    useFrame((state: RootState, delta: number) => {

        if (moving.current) {
            massObjectArray.current.map((massObject: MassObjectData) => {
                massObject.position[0] = massObject.position[0] + (Math.random() - 0.5)
                if (massObject.meshRef !== null) {
                    massObject.meshRef.position.x = massObject.position[0];
                }
            })
        }

    })



    return (
        <>
            <OrbitControls />

            <ambientLight intensity={0.2} />
            <directionalLight />


            {massObjectArray.current.map((massObject: MassObjectData) => {
                console.log(massObject);
                return (
                    <MassObject
                        key={massObject.name}
                        ref={(meshRef: Mesh) => massObject.meshRef = meshRef}
                        position={massObject.position}
                        args={[0.5, 32, 32]}
                        texture={massObject.texture}
                        onClick={() => handleMassObjectClick(massObject)}
                    />
                )
            })}

            <Controls toggleMoving={toggleMoving} />
        </>
    )

}