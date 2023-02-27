import { CameraControls, Html } from "@react-three/drei"
import { Camera, ThreeEvent, useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"
import { ChangeEvent, MouseEventHandler, MutableRefObject, RefObject, SetStateAction, useEffect } from "react";
import MassObjectData from "./computation/MassObjectData";
import { RootState } from "@react-three/fiber";
import { useState, useRef } from "react";
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
import arrowLeftImage from "../../assets/images/arrow_left.svg";
import { UIEvent } from "react";

type vector = [number, number, number];

interface controlsProps {
    moving: MutableRefObject<boolean>,
    toggleMoving: () => boolean,
    stopMoving: () => void,
    center: MutableRefObject<string>,
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

export default function Controls({ toggleMoving, moving, stopMoving, center, setCenter, setTimestep, massObjectArray, onMount, conversionFactor, addMassObject, deleteMassObject, modifyMassObject, currentDayRef, cameraControlsRef, pointLightRef }: controlsProps) {

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
    const [hidden, setHidden] = useState<boolean>(() => {
        const translateXHidden = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--translateX-controls-hidden'));
        // NaN = calc function from CSS
        if (isNaN(translateXHidden)) {
            return false
        } else {
            return true;
        }
    });

    const arrowImageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        console.log("controls state changed")
        onMount([selectedObjects, setSelectedObjects, forceUpdate])
    }, [onMount, selectedObjects, frameloop])


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


    const toggleControls = () => {

        const translateX = getComputedStyle(document.documentElement).getPropertyValue('--translateX-controls');
        const translateXHidden = getComputedStyle(document.documentElement).getPropertyValue('--translateX-controls-hidden');


        document.documentElement.style.setProperty('--translateX-controls', translateXHidden);
        document.documentElement.style.setProperty('--translateX-controls-hidden', translateX);

        //arrowImageRef.current?.classList.toggle(styles.rotateArrow);
        setHidden((prevHidden: boolean) => {
            if (!prevHidden && cameraControlsRef.current) {
                cameraControlsRef.current.enabled = true;
            }

            return !prevHidden
        })

        console.log("changind css var");
    }

    const handleTimestepChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);

        if (!isNaN(inputValue) && inputValue > 0) {
            setTimestep(inputValue) // in days
        } else {
            setErrorMessage('Timestep has to be a positive number')
        }
    }

    const handleClick = () => {
        const isMovingAfterToggle = toggleMoving();
        if (isMovingAfterToggle) {
            toggleControls();
            setFrameloop("always");
        } else {
            setFrameloop("demand");
        }
    }

    const handleScroll = (event: UIEvent<HTMLDivElement, UIEvent>) => {
        event.stopPropagation()
        console.log(event);
    }

    const disableCameraControls = () => {
        if (cameraControlsRef.current) {
            cameraControlsRef.current.enabled = false;
        }
    }

    const enableCameraControls = () => {
        if (cameraControlsRef.current) {
            cameraControlsRef.current.enabled = true;
        }
    }

    return (
        <>
            <Html as="div" wrapperClass={`${styles.wrapper} canvas-controls`} occlude>
                <div className={styles.toggleControls} onClick={toggleControls}>
                    <div className={styles.arrowContainer}>
                        <img ref={arrowImageRef} src={arrowLeftImage}
                            className={!hidden ? styles.rotateArrow : undefined}
                            alt="Arrow" />
                    </div>
                </div>

                <div className={styles.controls} >
                    <div className={` ${styles.underline}`}>
                        <div className={`${styles.start} ${styles.commonBackground} ${styles.commonSpacing} desktopThirdMaxWidth`}>
                            <div className={`gridRow`}>

                                <span className={styles.inputLabel}>Timestep</span>
                                <div className={`${styles.timestep}`}>
                                    <input name="timestep" id="timestep" type="text" placeholder="1.0" onChange={handleTimestepChange} />
                                    days
                                </div>

                            </div>


                            <div className={`gridRow`}>
                                <span className={styles.inputLabel}>Center</span>
                                <div>
                                    <button onClick={handleSelect}
                                        className={center.current !== 'Earth' ? styles.chosenCenter : styles.inactiveCenter}>
                                        SSB
                                    </button>
                                    <button onClick={handleSelect}
                                        className={center.current === 'Earth' ? styles.chosenCenter : styles.inactiveCenter}>
                                        Earth
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button onClick={handleClick} className={`${styles.startstopButton} ${moving.current ? styles.stopButton : styles.startButton}`}>
                                    {moving.current ? 'Stop' : 'Start'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*disable camera controls to enable scrolling*/}
                    <div className={styles.objectInfo}
                        onPointerDown={disableCameraControls}
                        onTouchStart={disableCameraControls}
                        onScroll={disableCameraControls}
                        onMouseEnter={disableCameraControls}
                        onMouseLeave={enableCameraControls}>

                        <div className={`${styles.commonBackground} desktopMaxWidth flexRow`}>
                            <h4>Mass Object Info</h4>

                            <button onClick={() => setShowNewObject((show: boolean) => !show)}>Add Object</button>
                        </div>

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