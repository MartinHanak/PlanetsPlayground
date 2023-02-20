import { CameraControls, Html } from "@react-three/drei"
import { Camera, useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"
import { ChangeEvent, MouseEventHandler, MutableRefObject, RefObject, SetStateAction, useEffect } from "react";
import MassObjectData from "./computation/MassObjectData";
import { RootState } from "@react-three/fiber";
import { useState } from "react";
import { Dispatch } from "react";
import { Object3D, Vector3 } from "three";
import MassObjectController from "./MassObjectController";
import NewObjectController from "./NewObjectController";
import ErrorNotification from "./ErrorNotification";
import CurrentDay from "./CurrentDay";
import { Root } from "@react-three/fiber/dist/declarations/src/core/renderer";
import { updateCamera } from "@react-three/fiber/dist/declarations/src/core/utils";
import resetCamera from "./resetCamera";
import displayShiftedPosition from "./computation/displayShiftedPosition";
import updateMeshPosition from "./computation/updateMeshPosition";
import updateLight from "./computation/updateLight";
import { PointLight } from "three";

type vector = [number, number, number];

interface controlsProps {
    toggleMoving: () => boolean,
    stopMoving: () => void,
    setCenter: (center: string) => string,// Dispatch<SetStateAction<string>>,  (center: string) => void,
    setTimestep: (timestep: number) => number,
    massObjectArray: MutableRefObject<MassObjectData[]>,
    onMount: ([controlsState, setControlsState, updateControls]: [string[], Dispatch<SetStateAction<string[]>>, () => void]) => void,
    conversionFactor: number,
    addMassObject: (name: string, position: vector, velocity: vector, mass: number) => void,
    deleteMassObject: (name: string) => void,
    modifyMassObject: (modifiedObject: MassObjectData, name: string, position: vector, velocity: vector, mass: number) => void,
    currentDayRef: MutableRefObject<Date>,
    cameraControlsRef: RefObject<CameraControls>,
    pointLightRef: RefObject<PointLight>
}

export default function Controls({ toggleMoving, stopMoving, setCenter, setTimestep, massObjectArray, onMount, conversionFactor, addMassObject, deleteMassObject, modifyMassObject, currentDayRef, cameraControlsRef, pointLightRef }: controlsProps) {

    const setFrameloop = useThree((state: RootState) => state.setFrameloop);
    const frameloop = useThree((state: RootState) => state.frameloop);
    const invalidate = useThree((state: RootState) => state.invalidate)
    const camera = useThree((state: RootState) => state.camera);
    const cameraPositionX = useThree((state: RootState) => state.camera.position.x) // state change for label position update

    const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

    const [showNewObject, setShowNewObject] = useState<boolean>(false);

    // for forcing render
    const [forcedCounter, setForcedCounter] = useState<number>(0);
    const forceUpdate = () => setForcedCounter((previous: number) => previous + 1);

    const [errorMessage, setErrorMessage] = useState<string>('');


    useEffect(() => {
        console.log("controls state changed")
        onMount([selectedObjects, setSelectedObjects, forceUpdate])
    }, [onMount, selectedObjects, frameloop])

    const handleClick = () => {
        const isMovingAfterToggle = toggleMoving();
        if (isMovingAfterToggle) {
            setFrameloop("always");
        } else {
            setFrameloop("demand");
        }
    }

    const handleSelect: MouseEventHandler<HTMLButtonElement> = (event) => {
        massObjectArray.current.forEach((object: MassObjectData) => {
            object.trajectoryStateDispatch({ type: 'reset' })
        })

        const newCenter = setCenter('Earth');

        displayShiftedPosition({
            massObjectsRef: massObjectArray,
            shiftCOM: true,
            center: newCenter
        })

        updateMeshPosition({
            massObjectsRef: massObjectArray,
            conversionFactor: conversionFactor
        })

        updateLight({ massObjectsRef: massObjectArray, pointLightRef: pointLightRef })

        forceUpdate()

        if (frameloop !== "always") {

            setFrameloop("always")
        }
        /*
                resetCamera({
                    conversionFactor: conversionFactor,
                    cameraControlsRef: cameraControlsRef,
                    camera: camera
                })
                */
    }

    const handleTimestepChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);

        if (!isNaN(inputValue) && inputValue > 0) {
            setTimestep(inputValue) // in days
        } else {
            setErrorMessage('Timestep has to be a positive number')
        }
    }


    return (
        <>
            <Html as="div" wrapperClass={`${styles.wrapper} canvas-controls`} occlude >
                <div className={styles.start}>


                    <h1>Timestep</h1>
                    <label htmlFor="timestep">
                        <input name="timestep" id="timestep" type="text" placeholder="1.0" onChange={handleTimestepChange} />
                    </label>



                    <h1>Center</h1>
                    <button onClick={handleSelect}>
                        SSB / Earth
                    </button>
                    {/*

                    <select name="center" id="center" onChange={handleSelect}>
                        <option value="SSB">SSB</option>
                        <option value="Sun">Sun</option>
                        <option value="Earth">Earth</option>
                    </select>
                    */}

                    <h1>Start / stop</h1>
                    <button onClick={handleClick}> Start/Stop </button>
                </div>

                <div className={styles.objectInfo}>
                    <h1>Mass Object Info</h1>

                    <button onClick={() => setShowNewObject((show: boolean) => !show)}>Add Object</button>

                    {showNewObject ? <NewObjectController
                        hide={() => setShowNewObject(false)}
                        addMassObject={addMassObject}
                        setErrorMessage={setErrorMessage}
                    /> : null}

                    {massObjectArray.current.map((object: MassObjectData) => {
                        if (selectedObjects.includes(object.name)) {
                            return (
                                <MassObjectController
                                    key={`${object.name}_controls`}
                                    name={object.name}
                                    massObject={object}
                                    massObjectsRef={massObjectArray}
                                    deleteMassObject={deleteMassObject}
                                    modifyMassObject={modifyMassObject}
                                    setSelectedObjects={setSelectedObjects}
                                    setErrorMessage={setErrorMessage}
                                />
                            )
                        } else {
                            return null;
                        }
                    })}
                </div>

            </Html>

            {/* annotations for selected planets */}
            {
                massObjectArray.current.map((massObject: MassObjectData) => {
                    if (selectedObjects.includes(massObject.name)) {

                        const convertedPosition = new Vector3(
                            massObject.shiftedPosition[0] * conversionFactor,
                            massObject.shiftedPosition[1] * conversionFactor,
                            massObject.shiftedPosition[2] * conversionFactor
                        )


                        const cameraUpVector = new Vector3(0, 1, 0);

                        const transformedCameraUpVector = cameraUpVector
                            .applyMatrix4(camera.matrixWorld)

                        const finalUpVector = transformedCameraUpVector.sub(camera.position).normalize().multiplyScalar(massObject.radius * conversionFactor);

                        convertedPosition.add(finalUpVector);


                        return (
                            <Html
                                key={`${massObject.name}_annotation`}
                                center
                                position={convertedPosition}
                            >
                                <div className={styles.label}>{massObject.name}</div>
                            </Html>
                        )
                    }
                })
            }


            {/* error notification */}

            {errorMessage !== '' ? <ErrorNotification message={errorMessage} setErrorMessage={setErrorMessage} /> : null}


            {/* current day */}
            <CurrentDay day={currentDayRef} />
        </>
    )
}