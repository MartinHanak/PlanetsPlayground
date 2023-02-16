import { useLoader, useFrame, useThree } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { Html, TrackballControls, OrbitControls, ArcballControls, FlyControls, CameraControls } from "@react-three/drei"
import { RootState } from "@react-three/fiber"
import { ThreeEvent } from "@react-three/fiber"


import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"
import { useEffect, useRef, Dispatch, SetStateAction, useState, useLayoutEffect, MutableRefObject } from "react"

import MassObject from "./MassObject"
import Grid from "./Grid"
import { Group, Mesh, Vector3 } from "three"
import { Line } from "three"

import Controls from "./Controls"

import MassObjectData from "./computation/MassObjectData";
import initializeMassObjectArray from "./computation/initializeMassObjectArray"
import MassObjectTrajectory from "./MassObjectTrajectory"
import { Root } from "@react-three/fiber/dist/declarations/src/core/renderer"


type vector = [number, number, number]

export interface initialMassObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}


interface sceneProps {
    initialMassObjectDataArray: initialMassObjectData[]
}

export default function Scene({ initialMassObjectDataArray }: sceneProps) {

    const [numberOfObjects, setNumberOfObjects] = useState(0)

    const camera = useThree((state: RootState) => state.camera)
    const canvasSize = useThree((state: RootState) => state.size)
    const rendererDOM = useThree((state: RootState) => state.gl.domElement)
    const frameloop = useThree((state: RootState) => state.frameloop)
    const invalidate = useThree((state: RootState) => state.invalidate)
    const setFrameloop = useThree((state: RootState) => state.setFrameloop)

    const center = useRef('SSB');
    const setCenter = (value: string) => { center.current = value };

    const timestep = useRef(1.0);
    const setTimestep = (value: number) => {
        timestep.current = value
        console.log(`new timestep: ${timestep.current}`)
        return timestep.current;
    };

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

    const cameraControlsRef = useRef<CameraControls | null>(null);

    const massObjectArray = useRef<MassObjectData[]>([]);

    const addMassObject = (name: string, position: vector, velocity: vector, mass: number) => {
        const newObject = new MassObjectData(name, position, velocity, mass);
        newObject.texture = textureDictionary['Default'];
        massObjectArray.current.push(newObject);
        setNumberOfObjects((num: number) => num + 1);
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
        console.log("log from use effects")
        console.log(camera)
        // initial camera setup
        const cameraAUDistInCanvasUnits = 4 * 149597870700 * conversionFactorBetweenCanvasUnitsAndAU.current; // 4 AU in meters converted to canvas units
        //camera.position.set(cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits);
        //orbitControls.current.target.set(cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits);
        //orbitControls.current.target.set(0, 0, 0)
        //camera.position.set(0, 0, -300);
        camera.up.set(0, 0, 1);
        //camera.lookAt(new Vector3(0, 0, 0))
        camera.near = 0; //0.1 * 149597870700 * conversionFactorBetweenCanvasUnitsAndAU.current;
        camera.far = cameraAUDistInCanvasUnits * 10;
        camera.zoom = 1;
        camera.updateProjectionMatrix();

        console.log(camera);
        console.log(`shorter: ${conversionFactorBetweenCanvasUnitsAndAU.current}`);

        //update controls
        if (cameraControlsRef.current) {
            console.log("orbit controls")

            cameraControlsRef.current.setPosition(cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits, cameraAUDistInCanvasUnits)

            cameraControlsRef.current.setTarget(0, 0, 0);



            //orbitControls.current.updateCameraUp()
            cameraControlsRef.current.enabled = true;
            cameraControlsRef.current.updateCameraUp()
            console.log(cameraControlsRef)

        }

        // initial object values
        initializeMassObjectArray(massObjectArray, initialMassObjectDataArray, textureDictionary);
        setNumberOfObjects(massObjectArray.current.length);


    }, [])

    const handleCameraControlsChange = () => {
        invalidate()
    }

    const handleCameraControlsChangeStart = () => {
        if (frameloop !== "always") {
            setFrameloop("always")
        }
    }


    useEffect(() => {
        console.log("scene rerendered")
    })


    useFrame((state: RootState, delta: number) => {

        if (moving.current) {

            forceControlsRender();

            massObjectArray.current.map((massObject: MassObjectData) => {
                massObject.position[0] = massObject.position[0] + timestep.current * (Math.random() * 0.1 - 0.05)
                massObject.position[1] = massObject.position[1] + timestep.current * (Math.random() * 0.1 - 0.05)
                massObject.position[2] = massObject.position[2] + timestep.current * (Math.random() * 0.1 - 0.05)
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
            {/* <OrbitControls makeDefault ref={orbitControls} enabled={false} /> */}

            <CameraControls ref={cameraControlsRef} enabled={false} onStart={handleCameraControlsChangeStart} />

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


            <Controls
                toggleMoving={toggleMoving}
                stopMoving={stopMoving}
                setCenter={setCenter}
                setTimestep={setTimestep}
                massObjectArray={massObjectArray}
                onMount={onControlsMount}
                conversionFactor={conversionFactorBetweenCanvasUnitsAndAU.current}
                addMassObject={addMassObject}
            />

        </>
    )


}