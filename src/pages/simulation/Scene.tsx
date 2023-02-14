import { useLoader, useFrame, useThree } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { OrbitControls } from "@react-three/drei"
import { RootState } from "@react-three/fiber"
import { ThreeEvent } from "@react-three/fiber"


import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"
import { useEffect, useRef, Dispatch, SetStateAction, useState } from "react"

import MassObject from "./MassObject"
import Grid from "./Grid"
import { Group, Mesh, Vector3 } from "three"
import { Line } from "three"

import Controls from "./Controls"

import MassObjectData from "./computation/MassObjectData";
import initializeMassObjectArray from "./computation/initializeMassObjectArray"
import MassObjectTrajectory from "./MassObjectTrajectory"


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

    const center = useRef('SSB');
    const setCenter = (value: string) => { center.current = value };

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

    const stopMoving = () => {
        moving.current = false;
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
    initializeMassObjectArray(massObjectArray, initialMassObjectDataArray, textureDictionary);



    // for updating child component without rerendering parent scene
    type childControlsStateSetter = Dispatch<SetStateAction<string[]>> | (() => void);
    type childControlsState = string[];
    type childControlsUpdate = () => void;

    let controlsState: childControlsState = [];
    let setControlsState: childControlsStateSetter = () => { console.log("controls not yet mounted") }
    let forceControlsRender: childControlsUpdate = () => { console.log("controls not yet mounted and cannot be updated") }

    function onControlsMount([controlsSelected, setControlsSelected, updateControls]: [childControlsState, childControlsStateSetter, childControlsUpdate]) {
        controlsState = controlsSelected;
        setControlsState = setControlsSelected;
        forceControlsRender = updateControls;
    }


    function createMassObjectClickHandler(object: MassObjectData) {

        return (event: ThreeEvent<MouseEvent>) => {

            // update object selected property
            object.selected = !object.selected;

            object.trajectoryStateDispatch({ type: "reset" })

            console.log(object.trajLineRef)


            // set child Controls state from here
            setControlsState((previousState: string[]) => {
                if (previousState.includes(object.name)) {
                    return previousState.filter((element: string) => element !== object.name);
                } else {
                    return previousState.concat(object.name);
                }
            })

        }
    }

    useEffect(() => {
        console.log("log from use effects")

        // initial camera setup
        camera.position.set(0, 0, 2 * conversionFactorBetweenCanvasUnitsAndAU.current);
        camera.near = - 10 * conversionFactorBetweenCanvasUnitsAndAU.current;
        camera.far = 10 * conversionFactorBetweenCanvasUnitsAndAU.current;
        camera.zoom = 1;


        console.log(camera);
        console.log(`shorter: ${conversionFactorBetweenCanvasUnitsAndAU.current}`);



    }, [])

    useEffect(() => {
        console.log("scene rerendered")
    })

    useFrame((state: RootState, delta: number) => {

        if (moving.current) {

            forceControlsRender();

            massObjectArray.current.map((massObject: MassObjectData) => {
                massObject.position[0] = massObject.position[0] + 2 * (Math.random() * 0.1 - 0.05)
                massObject.position[1] = massObject.position[1] + 2 * (Math.random() * 0.1 - 0.05)
                massObject.position[2] = massObject.position[2] + 2 * (Math.random() * 0.1 - 0.05)
                if (massObject.meshRef !== null) {
                    massObject.meshRef.position.x = massObject.position[0] * conversionFactorBetweenCanvasUnitsAndAU.current;
                    massObject.meshRef.position.y = massObject.position[1] * conversionFactorBetweenCanvasUnitsAndAU.current;
                    massObject.meshRef.position.z = massObject.position[2] * conversionFactorBetweenCanvasUnitsAndAU.current;

                    massObject.trajectoryStateDispatch({ type: 'add', payload: new Vector3(massObject.meshRef.position.x, massObject.meshRef.position.y, massObject.meshRef.position.z) })
                }


            })
        }

    })


    return (
        <>
            <OrbitControls />

            <ambientLight intensity={0.2} />
            <directionalLight />

            <Grid unitConversionFactor={conversionFactorBetweenCanvasUnitsAndAU.current} />

            {/* spheres */}
            {massObjectArray.current.map((massObject: MassObjectData) => {
                return (
                    <group key={`${massObject.name}_group`}>
                        <MassObject
                            key={massObject.name}
                            ref={(meshRef: Mesh) => massObject.meshRef = meshRef}
                            position={convertVectorUnits(massObject.position)}
                            args={[massObject.radius * conversionFactorBetweenCanvasUnitsAndAU.current, 32, 32]}
                            texture={massObject.texture}
                            onClick={createMassObjectClickHandler(massObject)}
                        />

                        <MassObjectTrajectory
                            key={`${massObject.name}_traj`}
                            trajectory={massObject.trajectory}
                            massObject={massObject.name}
                            massObjectArray={massObjectArray}
                        />
                    </group>
                )
            })}


            <Controls toggleMoving={toggleMoving} stopMoving={stopMoving} setCenter={setCenter} massObjectArray={massObjectArray} onMount={onControlsMount} conversionFactor={conversionFactorBetweenCanvasUnitsAndAU.current} />

        </>
    )

}