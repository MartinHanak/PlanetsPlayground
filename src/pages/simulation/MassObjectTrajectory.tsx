import { useEffect, useReducer, useState, MutableRefObject } from "react"
import { Vector3 } from "three"
import { useThree, RootState } from "@react-three/fiber"
import { Line } from "@react-three/drei"

import MassObjectData from "./computation/MassObjectData"

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

const removeFirstElement = ([x, ...rest]: Array<Vector3>) => [...rest]


function reducer(state: Array<Vector3>, action: actionTypes) {
    switch (action.type) {
        case 'add':
            if (state.length > 200) {
                return [...removeFirstElement(state), action.payload]
            } else {
                return [...state, action.payload]
            }
        case 'reset':
            return []
        default:
            return state
    }
}


export default function MassObjectTrajectory({ trajectory, massObject, massObjectArray }: MassObjectTrajectoryProps) {

    const frameloop = useThree((state: RootState) => state.frameloop)

    const [trajectoryState, dispatch] = useReducer(reducer, []);
    const [color, setColor] = useState("black")


    useEffect(() => {
        // bind trajectory updater to the massObject on first render
        massObjectArray.current.forEach((object: MassObjectData) => {
            if (object.name === massObject) {
                object.trajectoryStateDispatch = dispatch;
                setColor(object.color)
            }
        })
    }, [frameloop])

    return (
        trajectoryState.length > 2 ? < Line points={trajectoryState} lineWidth={4} color={color} /> : null

    )
}