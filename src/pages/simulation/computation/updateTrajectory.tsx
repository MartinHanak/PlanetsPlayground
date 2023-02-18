import { MutableRefObject } from "react"
import MassObjectData from "./MassObjectData"
import { Vector3 } from "three"

interface updateTrajectoryInterface {
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    loopCount: number
}

export default function updateTrajectory({ massObjectsRef, loopCount }: updateTrajectoryInterface) {
    for (const massObject of massObjectsRef.current) {
        if (massObject.meshRef !== null && massObject.selected && loopCount % 10 === 0) {

            massObject.trajectoryStateDispatch(
                {
                    type: 'add',
                    payload: new Vector3(massObject.meshRef.position.x,
                        massObject.meshRef.position.y,
                        massObject.meshRef.position.z)
                })
        }
    }
}