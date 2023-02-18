import { MutableRefObject } from "react"
import MassObjectData from "./MassObjectData"
import { multiplyVectorWithScalar } from "./updatePosition"

interface updateMeshPositionInterface {
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    conversionFactor: number
}


export default function updateMeshPosition({ massObjectsRef, conversionFactor }: updateMeshPositionInterface) {
    for (const massObject of massObjectsRef.current) {
        if (massObject.meshRef !== null) {
            massObject.meshRef.position.set(...multiplyVectorWithScalar(massObject.shiftedPosition, conversionFactor))
        }
    }

}