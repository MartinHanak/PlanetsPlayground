import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import styles from "./Simulation.module.scss"

import Loading from "../../components/Loading"
import NoData from "./NoData"

import Scene from "./Scene"
import { Canvas } from "@react-three/fiber"

import nasaFetchData from "./nasaFetchData"
import nasaExtractData from "./nasaExtractData"
import { initialMassObjectData } from "./Scene"
import initializeMassObjectArray from "./computation/initializeMassObjectArray"


import defaultInitialData from "../../assets/initialData.json"
import defaultInitialDate from "../../assets/initialDate.json"
import MassObjectData from "./computation/MassObjectData"


interface loadType {
    actionType: "load",
    data: "default" | "storage"
}

interface importType {
    actionType: "import",
    date: number
}

interface nodataType {
    actionType: "noData"
}

type locationStateType = loadType | importType | nodataType;

export default function Simulation() {

    const fetchAlreadySent = useRef(false);
    const [initialPositionsVelocities, setInitialPositionsVelocities] = useState<initialMassObjectData[]>([])
    const [initialDate, setInitialDate] = useState<number>(0)

    const location = useLocation();
    const navigate = useNavigate();

    // load in data
    useEffect(() => {

        if (location.state && location.state !== null && location.state.actionType) {

            if (location.state.actionType === "load") {

                if (location.state.data === "storage") {
                    console.log("load storage data")

                    const initialStorageData = localStorage.getItem("initialMassObjectData")
                    const initialStorageDate = localStorage.getItem("initialDate")

                    if (initialStorageData && initialStorageDate) {
                        const parsedInitialData = JSON.parse(initialStorageData);
                        const parsedInitialDate = Number(initialStorageDate);

                        if (parsedInitialData.length > 1) {
                            setInitialPositionsVelocities(parsedInitialData)
                            setInitialDate(parsedInitialDate)
                        } else {
                            // redirect to noData
                            navigate('/nodata')
                        }
                    } else {
                        // redirect to noData
                        navigate('/nodata')
                    }
                } else if (location.state.data === "default") {
                    // load default
                    console.log("loading default values")

                    const parsedData = defaultInitialData as MassObjectData[];
                    const { date } = defaultInitialDate;

                    setInitialPositionsVelocities(parsedData);
                    setInitialDate(date)

                } else {
                    navigate('/nodata')
                }

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

                            // data returned as a block of text, has to be extracted
                            const extractedData = await Promise.all(jsonData.map((jsonInstance) => {
                                return nasaExtractData(jsonInstance.result)
                            }))

                            setInitialPositionsVelocities(extractedData);
                            setInitialDate(Number(location.state.date))

                        } catch (error) {
                            console.log(error)
                            // redirect to default 
                            console.log("loading default values")
                            const parsedData = defaultInitialData as MassObjectData[];
                            const { date } = defaultInitialDate;
                            setInitialPositionsVelocities(parsedData);
                            setInitialDate(date)
                        }
                    })();

                }

                return () => {
                    console.log("preventing second api call")
                    fetchAlreadySent.current = true;
                }
            } else {
                console.log('NoData')
                navigate('/nodata')
            }

        } else {
            console.log('NoData')
            navigate('/nodata')
        }
    }, []);


    return (
        <div>
            <h1>Simulation</h1>
            <div className={styles.canvasContainer}>
                {initialPositionsVelocities.length === 0 ? <Loading /> :
                    <Suspense fallback={<Loading />}>
                        <Canvas frameloop="demand" orthographic className="canvas-render-screen" onPointerMissed={(e) => { console.log(e) }} >
                            <Scene initialMassObjectDataArray={initialPositionsVelocities} initialDate={initialDate} />
                        </Canvas>
                    </Suspense>
                }
            </div>

        </div >
    )
}