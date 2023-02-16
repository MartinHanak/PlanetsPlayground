import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"

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
    date: string
}

interface nodataType {
    actionType: "nodata"
}

type simulationProps = loadType | importType | nodataType;

export default function Simulation(props: simulationProps) {

    const fetchAlreadySent = useRef(false);
    const [initialPositionsVelocities, setInitialPositionsVelocities] = useState<initialMassObjectData[]>([])

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

            if (!fetchAlreadySent.current) {

                (async () => {
                    try {
                        const fetchResponses = await nasaFetchData(Date.now());

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
        }
    }, [])


    if (props.actionType === 'nodata') {
        return (<NoData />)
    } else {


        return (
            <div>
                <h1>Simulation</h1>
                <div className={styles.canvasContainer}>
                    {initialPositionsVelocities.length === 0 ? <Loading /> :
                        <Suspense fallback={<Loading />}>
                            <Canvas frameloop="demand" orthographic className="canvas-render-screen" >
                                <Scene initialMassObjectDataArray={initialPositionsVelocities} />
                            </Canvas>
                        </Suspense>
                    }
                </div>

            </div >
        )
    }
}