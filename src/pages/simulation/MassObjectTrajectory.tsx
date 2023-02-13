import { useEffect, useMemo, useReducer } from "react"
import { Vector3 } from "three"
import MassObjectData from "./computation/MassObjectData"
import { Html } from "@react-three/drei"
import { MutableRefObject } from "react"
import { useThree } from "@react-three/fiber"
import { RootState } from "@react-three/fiber"
import { Line } from "@react-three/drei"

interface MassObjectTrajectoryProps {
    trajectory: Array<[number, number, number] | Vector3>,
    massObject: string,
    massObjectArray: MutableRefObject<MassObjectData[]>
}

interface addType {
    type: 'add',
    payload: Vector3
}

interface resetType {
    type: 'reset'
}



export type actionTypes = addType | resetType;


function reducer(state: Array<Vector3>, action: actionTypes) {
    switch (action.type) {
        case 'add':
            console.log("adding point")
            return [...state, action.payload]
        default:
            return state
    }
}


export default function MassObjectTrajectory({ trajectory, massObject, massObjectArray }: MassObjectTrajectoryProps) {

    const frameloop = useThree((state: RootState) => state.frameloop)

    const [trajectoryState, dispatch] = useReducer(reducer, []);


    useEffect(() => {
        // bind trajectory updater to the massObject on first render
        massObjectArray.current.forEach((object: MassObjectData) => {
            console.log(object)
            if (object.name === massObject) {
                object.trajectoryStateDispatch = dispatch;
            }
        })
    }, [frameloop])

    return (
        trajectoryState.length > 2 ? < Line points={trajectoryState} /> : null

    )
}