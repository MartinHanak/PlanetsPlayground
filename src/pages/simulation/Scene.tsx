import { useLoader, useFrame, ThreeElements, ThreeEvent, useThree } from "@react-three/fiber"
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
import { Camera, Mesh, Vector3 } from "three"

import Controls from "./Controls"

import MassObjectData from "./computation/MassObjectData";
import initializeMassObjectArray from "./computation/initializeMassObjectArray"
import { Root } from "@react-three/fiber/dist/declarations/src/core/renderer"


export interface initialMassObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}


interface sceneProps {
    initialMassObjectDataArray: initialMassObjectData[]
}

export default function Scene({ initialMassObjectDataArray }: sceneProps) {

    const camera = useThree((state: RootState) => state.camera)
    const canvasSize = useThree((state: RootState) => state.size)

    // set 4 AU units = minimum out of canvas width and canvas height
    const conversionFactorBetweenCanvasUnitsAndAU = useRef(Math.min(canvasSize.height, canvasSize.width) / 4);

    const convertVectorUnits = (vector: [number, number, number]): [number, number, number] => {
        const multiplier = conversionFactorBetweenCanvasUnitsAndAU.current;
        return [vector[0] * multiplier, vector[1] * multiplier, vector[2] * multiplier];
    }

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



    function createMassObjectClickHandler(object: MassObjectData) {
        return (event: ThreeEvent<MouseEvent>) => {
            console.log(object);
        }
    }

    useEffect(() => {
        console.log("log from use effects")

        // initial camera setup
        camera.position.set(0, 0, 2 * conversionFactorBetweenCanvasUnitsAndAU.current);
        camera.near = 0.1;
        camera.far = 1000;
        camera.zoom = 1;


        console.log(camera);
        console.log(`shorter: ${conversionFactorBetweenCanvasUnitsAndAU.current}`);



    }, [])

    useFrame((state: RootState, delta: number) => {

        if (moving.current) {
            massObjectArray.current.map((massObject: MassObjectData) => {
                massObject.position[0] = massObject.position[0] + (Math.random() * 0.1 - 0.05)
                if (massObject.meshRef !== null) {
                    massObject.meshRef.position.x = massObject.position[0] * conversionFactorBetweenCanvasUnitsAndAU.current;
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
                return (
                    <MassObject
                        key={massObject.name}
                        ref={(meshRef: Mesh) => massObject.meshRef = meshRef}
                        position={convertVectorUnits(massObject.position)}
                        args={[massObject.radius * conversionFactorBetweenCanvasUnitsAndAU.current, 32, 32]}
                        texture={massObject.texture}
                        onClick={createMassObjectClickHandler(massObject)}
                    />
                )
            })}

            <Controls toggleMoving={toggleMoving} />
        </>
    )

}