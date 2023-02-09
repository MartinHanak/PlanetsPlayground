import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { prepare } from "@react-three/fiber/dist/declarations/src/core/renderer";
import styles from "./Controls.module.scss"


interface controlsProps {
    toggleMoving: () => boolean,
}

export default function Controls({ toggleMoving }: controlsProps) {

    const state = useThree();

    const handleClick = () => {
        const isMovingAfterToggle = toggleMoving();
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
        </Html>
    )
}