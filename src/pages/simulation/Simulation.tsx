import { Suspense, useEffect } from "react"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"

import styles from "./Simulation.module.scss"

import Loading from "../../components/Loading"
import NoData from "./NoData"

import Scene from "./Scene"
import { OrbitControls } from "@react-three/drei"

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

    const [massObjectArray, setMassObjectArray] = useState([]);

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
    } else if (props.actionType === 'load') {
        return <h1>Loading....</h1>
    } else {


        return (
            <div>
                <h1>Simulation</h1>
                <div className={styles.canvasContainer}>
                    <Suspense fallback={<Loading />}>
                        <Canvas orthographic camera={{ left: -4, right: 4, top: 4, bottom: 4, zoom: 10, near: -8, far: 8 }}>
                            < OrbitControls />
                            <Scene />
                        </Canvas>
                    </Suspense>
                </div>
            </div >
        )
    }
}