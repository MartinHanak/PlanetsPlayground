import { useLoader, useFrame, useThree } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { Html, TrackballControls, OrbitControls, ArcballControls, FlyControls, CameraControls } from "@react-three/drei"
import { RootState } from "@react-three/fiber"
import { ThreeEvent } from "@react-three/fiber"


import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture_unmodified.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"
import DefaultTextureImage from "../../assets/textures/1k_textures/Default_texture.jpg"
import { useEffect, useRef, Dispatch, SetStateAction, useState, useLayoutEffect, MutableRefObject } from "react"

import MassObject from "./MassObject"
import Grid from "./Grid"
import { Group, Mesh, PointLight, Vector3 } from "three"
import { Line } from "three"

import Controls from "./Controls"
import CurrentDay from "./CurrentDay"

import MassObjectData from "./computation/MassObjectData";
import initializeMassObjectArray from "./computation/initializeMassObjectArray"
import MassObjectTrajectory from "./MassObjectTrajectory"
import { Root } from "@react-three/fiber/dist/declarations/src/core/renderer"
import updatePosition, { addVector, multiplyVectorWithScalar } from "./computation/updatePosition"
import displayShiftedPosition from "./computation/displayShiftedPosition"
import updateMeshPosition from "./computation/updateMeshPosition"
import updateTrajectory from "./computation/updateTrajectory"
import updateLight from "./computation/updateLight"
import resetCamera from "./resetCamera"
import { getCOM } from "./computation/displayShiftedPosition"
import saveLocalStorage from "./computation/saveLocalStorage"


export type vector = [number, number, number]

export interface initialMassObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}


interface sceneProps {
    initialMassObjectDataArray: initialMassObjectData[],
    initialDate: number
}

export default function Scene({ initialMassObjectDataArray, initialDate }: sceneProps) {

    const [numberOfObjects, setNumberOfObjects] = useState(0)

    const camera = useThree((state: RootState) => state.camera)
    const canvasSize = useThree((state: RootState) => state.size)
    const rendererDOM = useThree((state: RootState) => state.gl.domElement)
    const frameloop = useThree((state: RootState) => state.frameloop)
    const invalidate = useThree((state: RootState) => state.invalidate)
    const setFrameloop = useThree((state: RootState) => state.setFrameloop)


    const center = useRef('SSB');
    const setCenter = (value: string) => {

        if (center.current !== value) {
            center.current = value
        } else {
            center.current = 'SSB'
        }
        return center.current
    };

    /*
    const [center, setCenter] = useState<string>('SSB')
    */

    const timestep = useRef<number>(1.0);
    const setTimestep = (value: number) => {
        timestep.current = value
        console.log(`new timestep: ${timestep.current}`)
        return timestep.current;
    };

    const currentDayRef = useRef(new Date(initialDate));

    const increaseCurrentDay = () => {
        currentDayRef.current = new Date(currentDayRef.current.getTime() + timestep.current * 86400000) // timestep in days
    }

    // set 4 AU units = minimum out of canvas width and canvas height
    const conversionFactorBetweenCanvasUnitsAndAU = useRef(Math.min(canvasSize.height, canvasSize.width) / (4 * 149597870700));

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

    const loopCounter = useRef<number>(0)
    const increaseLoopCounter = () => {
        loopCounter.current = loopCounter.current + 1
    };

    const [SunTexture, MercuryTexture, VenusTexture, EarthTexture, MarsTexture, DefaultTexture]
        = useLoader(TextureLoader, [SunTextureImage, MercuryTextureImage, VenusTextureImage, EarthTextureImage, MarsTextureImage, DefaultTextureImage])

    const textureDictionary = {
        "Sun": SunTexture,
        "Mercury": MercuryTexture,
        "Venus": VenusTexture,
        "Earth": EarthTexture,
        "Mars": MarsTexture,
        "Default": DefaultTexture
    }

    const cameraControlsRef = useRef<CameraControls>(null);

    const forces = useRef<vector[][]>([]);
    const positionDifferences = useRef<vector[][]>([])
    const distances = useRef<number[][]>([]);

    const resetForces = () => forces.current = [];
    const resetPositionDifferences = () => positionDifferences.current = [];
    const resetDistances = () => distances.current = [];
    const resetAll = () => {
        resetForces();
        resetPositionDifferences();
        resetDistances();
    }

    const massObjectArray = useRef<MassObjectData[]>([]);

    const addMassObject = (name: string, position: vector, velocity: vector, mass: number) => {

        // shift input position by the current center
        const [centerObject] = massObjectArray.current.filter((massObject: MassObjectData) => massObject.name === center.current)

        let shift: vector = [0, 0, 0]

        if (centerObject && centerObject !== null) {
            shift = multiplyVectorWithScalar(centerObject.position, 1);
        } else {
            shift = getCOM({ massObjectsRef: massObjectArray })
        }

        const shiftedPosition = addVector(position, shift)

        const newObject = new MassObjectData(name, shiftedPosition, velocity, mass);
        newObject.shiftedPosition = [...position];
        newObject.texture = textureDictionary['Default'];
        massObjectArray.current.push(newObject);
        resetAll();
        setNumberOfObjects((num: number) => num + 1);
    }

    const deleteMassObject = (name: string) => {
        massObjectArray.current = massObjectArray.current.filter((massObject: MassObjectData) => massObject.name !== name);
        resetAll();
        setNumberOfObjects(massObjectArray.current.length);
    }

    const modifyMassObject = (modifiedObject: MassObjectData, name: string, position: vector, velocity: vector, mass: number) => {
        // shift input position by the current center
        const [centerObject] = massObjectArray.current.filter((massObject: MassObjectData) => massObject.name === center.current)

        let shift: vector = [0, 0, 0]

        if (centerObject && centerObject !== null) {
            shift = multiplyVectorWithScalar(centerObject.position, 1);
        } else {
            shift = getCOM({ massObjectsRef: massObjectArray })
        }

        const shiftedPosition = addVector(position, shift)

        modifiedObject.position = [...shiftedPosition]; // position in SSB coordinates
        modifiedObject.shiftedPosition = [...position];

        modifiedObject.velocity = [...velocity];
        modifiedObject.mass = mass;
        modifiedObject.name = name;

        resetAll();

        displayShiftedPosition({
            massObjectsRef: massObjectArray,
            shiftCOM: true,
            center: center.current
        })

        updateMeshPosition({
            massObjectsRef: massObjectArray,
            conversionFactor: conversionFactorBetweenCanvasUnitsAndAU.current
        })

        updateLight({
            massObjectsRef: massObjectArray,
            pointLightRef: pointLightRef
        })

        setNumberOfObjects(massObjectArray.current.length);
        invalidate();
        forceControlsRender();
    }


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

            console.log(event)

            // update object selected property
            object.selected = !object.selected;

            object.trajectoryStateDispatch({ type: "reset" })


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

    useLayoutEffect(() => {
        console.log("log from use layout effect")


        resetCamera({
            conversionFactor: conversionFactorBetweenCanvasUnitsAndAU.current,
            cameraControlsRef: cameraControlsRef,
            camera: camera
        })


        // initial object values
        initializeMassObjectArray(massObjectArray, initialMassObjectDataArray, textureDictionary);
        setNumberOfObjects(massObjectArray.current.length);
        saveLocalStorage({ date: currentDayRef.current.getTime(), massObjectsRef: massObjectArray })

    }, [])

    const handleCameraControlsChange = () => {
        invalidate()
    }

    const handleCameraControlsChangeStart = () => {
        if (frameloop !== "always") {
            setFrameloop("always")
        }
    }

    const pointLightRef = useRef<PointLight>(null);

    const getSunPosition: (() => [number, number, number]) = () => {
        const sunData = massObjectArray.current.filter((massObject: MassObjectData) => {
            return massObject.name === "Sun"
        })

        if (sunData.length > 0 && sunData[0].meshRef) {
            return sunData[0].meshRef.position.toArray();
        } else {
            return [0, 0, 0]
        }
    }


    useEffect(() => {
        console.log("scene rerendered")
    })


    // main render loop
    useFrame((state: RootState, delta: number) => {

        if (moving.current) {

            increaseLoopCounter();


            updatePosition({
                timestepRef: timestep,
                massObjectsRef: massObjectArray,
                forcesRef: forces,
                positionDifferencesRef: positionDifferences,
                distancesRef: distances
            });

            displayShiftedPosition({
                massObjectsRef: massObjectArray,
                shiftCOM: true,
                center: center.current
            })

            updateMeshPosition({
                massObjectsRef: massObjectArray,
                conversionFactor: conversionFactorBetweenCanvasUnitsAndAU.current
            })

            updateLight({
                massObjectsRef: massObjectArray,
                pointLightRef: pointLightRef
            })

            updateTrajectory({
                massObjectsRef: massObjectArray,
                loopCount: loopCounter.current
            })

            forceControlsRender();

            increaseCurrentDay();

            // save to local storage every x seconds, 1 second = 60 frames (approximately)
            if (loopCounter.current % 600 === 0) {
                saveLocalStorage({ date: currentDayRef.current.getTime(), massObjectsRef: massObjectArray })
            }
        }

    })

    return (
        <>
            {/* <OrbitControls makeDefault ref={orbitControls} enabled={false} /> */}

            <CameraControls ref={cameraControlsRef} enabled={false} onStart={handleCameraControlsChangeStart} />

            <ambientLight intensity={0.1} />

            <pointLight ref={pointLightRef} color="white" intensity={2} />

            <Grid unitConversionFactor={conversionFactorBetweenCanvasUnitsAndAU.current} />

            {/* spheres */}
            {massObjectArray.current.map((massObject: MassObjectData) => {
                return (
                    <group key={`${massObject.name}_group`}>
                        <MassObject
                            key={massObject.name}
                            name={massObject.name}
                            ref={(meshRef: Mesh) => massObject.meshRef = meshRef}
                            position={convertVectorUnits(massObject.shiftedPosition)}
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


            <Controls
                moving={moving}
                toggleMoving={toggleMoving}
                stopMoving={stopMoving}
                center={center}
                setCenter={setCenter}
                setTimestep={setTimestep}
                massObjectArray={massObjectArray}
                onMount={onControlsMount}
                conversionFactor={conversionFactorBetweenCanvasUnitsAndAU.current}
                addMassObject={addMassObject}
                deleteMassObject={deleteMassObject}
                modifyMassObject={modifyMassObject}
                currentDayRef={currentDayRef}
                cameraControlsRef={cameraControlsRef}
                pointLightRef={pointLightRef}
            />



        </>
    )


}