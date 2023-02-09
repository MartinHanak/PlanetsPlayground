import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import styles from "./Controls.module.scss"

export default function Controls() {

    const state = useThree();
    console.log(state)

    const handleClick = () => {
        const currentFrameLoop = state.frameloop;
        if (currentFrameLoop === "always") {
            state.setFrameloop("never")
        } else {
            state.setFrameloop("always")
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