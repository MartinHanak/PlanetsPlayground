import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"
import { ChangeEvent, MutableRefObject, SetStateAction, useEffect } from "react";
import MassObjectData from "./computation/MassObjectData";
import { RootState } from "@react-three/fiber";
import { useState } from "react";
import { Dispatch } from "react";
import { StaticReadUsage } from "three";
import { Vector3 } from "three";
import MassObjectController from "./MassObjectController";


interface controlsProps {
    toggleMoving: () => boolean,
    stopMoving: () => void,
    setCenter: (center: string) => void,
    massObjectArray: MutableRefObject<MassObjectData[]>,
    onMount: ([controlsState, setControlsState, updateControls]: [string[], Dispatch<SetStateAction<string[]>>, () => void]) => void,
    conversionFactor: number
}

export default function Controls({ toggleMoving, stopMoving, setCenter, massObjectArray, onMount, conversionFactor }: controlsProps) {

    const setFrameloop = useThree((state: RootState) => state.setFrameloop);
    const frameloop = useThree((state: RootState) => state.frameloop);

    const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

    // for forcing render
    const [forcedCounter, setForcedCounter] = useState<number>(0);
    const forceUpdate = () => setForcedCounter((previous: number) => previous + 1);


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

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        massObjectArray.current.forEach((object: MassObjectData) => {
            object.trajectoryStateDispatch({ type: 'reset' })
        })
        setCenter(event.target.value)
    }

    return (
        <>
            <Html as="div" wrapperClass={`${styles.wrapper} canvas-controls`} occlude >
                <div className={styles.start}>
                    <h1>Start / stop</h1>
                    <button onClick={handleClick}> Start/Stop </button>


                    <h1>Center</h1>
                    <select name="center" id="center" onChange={handleSelect}>
                        <option value="SSB">SSB</option>
                        <option value="Sun">Sun</option>
                        <option value="Earth">Earth</option>
                    </select>
                </div>

                <div className={styles.objectInfo}>
                    <h1>Mass Object Info</h1>
                    {massObjectArray.current.map((object: MassObjectData) => {
                        if (selectedObjects.includes(object.name)) {
                            return (
                                <MassObjectController
                                    key={`${object.name}_controls`}
                                    name={object.name}
                                    massObject={object}
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
                massObjectArray.current.map((object: MassObjectData) => {
                    if (selectedObjects.includes(object.name)) {

                        const convertedPosition = new Vector3(
                            object.position[0] * conversionFactor,
                            object.position[1] * conversionFactor,
                            object.position[2] * conversionFactor
                        )

                        return (
                            <Html key={`${object.name}_annotation`} position={convertedPosition}>
                                <div>{object.name}</div>
                            </Html>
                        )
                    }
                })
            }
        </>
    )
}