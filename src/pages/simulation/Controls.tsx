import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"
import { MutableRefObject, SetStateAction, useEffect } from "react";
import MassObjectData from "./computation/MassObjectData";
import { RootState } from "@react-three/fiber";
import { useState } from "react";
import { Dispatch } from "react";
import { StaticReadUsage } from "three";


interface controlsProps {
    toggleMoving: () => boolean,
    massObjectArray: MutableRefObject<MassObjectData[]>,
    onMount: ([controlsState, setControlsState, updateControls]: [string[], Dispatch<SetStateAction<string[]>>, () => void]) => void
}

export default function Controls({ toggleMoving, massObjectArray, onMount }: controlsProps) {

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

    return (
        <Html as="div" wrapperClass={`${styles.wrapper} canvas-controls`} occlude >
            <div className={styles.start}>
                <h1>Start simulation fjaf anejfn jejfwan j</h1>
                <button onClick={handleClick} >Start/Stop</button>
            </div>

            <div className={styles.objectInfo}>
                <h1>Mass Object Info</h1>
                {massObjectArray.current.map((object: MassObjectData) => {
                    if (selectedObjects.includes(object.name)) {
                        return (
                            <div key={object.name}>
                                <h1>{object.name}</h1>
                                <p>x coor: {object.position[0]} </p>
                            </div>
                        )
                    } else {
                        return null;
                    }
                })}
            </div>
        </Html>
    )
}