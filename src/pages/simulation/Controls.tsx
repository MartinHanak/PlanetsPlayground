import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"
import { useState } from "react";


interface controlsProps {
    toggleMoving: () => boolean,
}

export default function Controls({ toggleMoving }: controlsProps) {

    const state = useThree();

    const selectedMassObjects = useState([]);

    const handleClick = () => {
        const isMovingAfterToggle = toggleMoving();
        console.log(state.camera)
        if (isMovingAfterToggle) {
            state.setFrameloop("always");
        } else {
            state.setFrameloop("demand");
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

            </div>
        </Html>
    )
}