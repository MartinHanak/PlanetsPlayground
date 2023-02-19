import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import styles from "./Simulation.module.scss"

import Loading from "../../components/Loading"
import NoData from "./NoData"

import Scene from "./Scene"
import { Canvas } from "@react-three/fiber"

import nasaFetchData from "./nasaFetchData"
import nasaExtractData from "./nasaExtractData"
import { initialMassObjectData } from "./Scene"


const modelData = [{
    name: "Earth",
    position: [1, 0, 0],
    velocity: [1, 1, 1]
}, {
    name: "Sun",
    position: [0, 0, 0],
    velocity: [0, 0, 0]
}
] as initialMassObjectData[]

interface loadType {
    actionType: "load",
    data: "default" | "storage"
}

interface importType {
    actionType: "import",
    date: number
}

interface nodataType {
    actionType: "nodata"
}

type locationStateType = loadType | importType | nodataType;

export default function Simulation() {

    const fetchAlreadySent = useRef(false);
    const [initialPositionsVelocities, setInitialPositionsVelocities] = useState<initialMassObjectData[]>([])

    const location = useLocation();

    // load in data
    useEffect(() => {

        if (location.state !== null && location.state.actionType) {

            if (location.state.actionType === "load") {
                console.log("load default or storage data")
            } else if (location.state.actionType === "import" && !isNaN(Number(location.state.date))) {
                console.log("import data")

                if (!fetchAlreadySent.current) {

                    (async () => {
                        try {
                            const fetchResponses = await nasaFetchData(Number(location.state.date));

                            fetchResponses.forEach((response: Response) => {
                                if (!response.ok) {
                                    throw new Error('One of the fetch api calls failed.')
                                }
                            })

                            const jsonData = await Promise.all(fetchResponses.map(
                                (response: Response) => response.json()
                            ))
                            console.log(jsonData)

                            // data returned as a block of text, has to be extracted
                            const extractedData = await Promise.all(jsonData.map((jsonInstance) => {
                                return nasaExtractData(jsonInstance.result)
                            }))

                            setInitialPositionsVelocities(extractedData);

                        } catch (error) {
                            console.log(error)
                        }
                    })();

                }

                return () => {
                    console.log("preventing second api call")
                    fetchAlreadySent.current = true;
                }
            } else {
                console.log('NoData')
            }

        } else {
            console.log('NoData')
        }
    }, []);


    return (
        <div>
            <h1>Simulation</h1>
            <div className={styles.canvasContainer}>
                {initialPositionsVelocities.length === 0 ? <Loading /> :
                    <Suspense fallback={<Loading />}>
                        <Canvas frameloop="demand" orthographic className="canvas-render-screen" onPointerMissed={(e) => { console.log(e) }} >
                            <Scene initialMassObjectDataArray={initialPositionsVelocities} />
                        </Canvas>
                    </Suspense>
                }
            </div>

        </div >
    )
}