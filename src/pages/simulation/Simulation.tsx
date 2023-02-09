import { Suspense, useEffect } from "react"

import styles from "./Simulation.module.scss"

import Loading from "../../components/Loading"
import NoData from "./NoData"

import Scene from "./Scene"
import { Canvas } from "@react-three/fiber"

interface massObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}

const modelData = [{
    name: "Earth",
    position: [0, 0, 0],
    velocity: [1, 1, 1]
}, {
    name: "Sun",
    position: [10, 0, 0],
    velocity: [0, 0, 0]
}
] as massObjectData[]

interface loadType {
    actionType: "load",
    data: "default" | "storage"
}

interface importType {
    actionType: "import",
    date: string
}

interface nodataType {
    actionType: "nodata"
}

type simulationProps = loadType | importType | nodataType;


export default function Simulation(props: simulationProps) {

    // load in data
    useEffect(() => {
        if (props.actionType === 'nodata') {
            console.log("no data to fetch or load");

        } else if (props.actionType === 'load') {
            if (props.data === 'default') {
                console.log("loading default data");
            } else if (props.data === 'storage') {
                console.log("loading data from the local storage");
            }
        } else {
            //import
            console.log("importing data from NASA API");
        }
    }, [])


    if (props.actionType === 'nodata') {
        return (<NoData />)
    } else {


        return (
            <div>
                <h1>Simulation</h1>
                <div className={styles.canvasContainer}>
                    <Suspense fallback={<Loading />}>
                        <Canvas frameloop="demand" orthographic camera={{ left: -4, right: 4, top: 4, bottom: 4, zoom: 10, near: -8, far: 8 }} className="canvas-render-screen">
                            <Scene initialMassObjectDataArray={modelData} />
                        </Canvas>
                    </Suspense>
                </div>

            </div >
        )
    }
}