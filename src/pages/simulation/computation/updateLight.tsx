import { MutableRefObject, RefObject } from "react"
import { PointLight } from "three"
import MassObjectData from "./MassObjectData"


interface updateLightInterface {
    massObjectsRef: MutableRefObject<MassObjectData[]>
    pointLightRef: RefObject<PointLight>
}

export default function updateLight({ massObjectsRef, pointLightRef }: updateLightInterface) {

    if (pointLightRef.current !== null) {
        const [sunData] = massObjectsRef.current.filter((object: MassObjectData) => { return object.name === "Sun" })
        if (sunData && sunData.meshRef) {
            pointLightRef.current.position.set(...sunData.meshRef.position.toArray())
            //console.log(pointLightRef.current.position)
        } else {
            pointLightRef.current.position.set(0, 0, 0)
        }
    }
}