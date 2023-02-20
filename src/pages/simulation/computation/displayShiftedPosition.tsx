import { MutableRefObject } from "react"
import MassObjectData from "./MassObjectData"
import { multiplyVectorWithScalar, addVector, vector, subtractVector } from "./updatePosition"

const allowedCenters = ['Sun', 'Earth']

interface displayShiftedPositionInterface {
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    shiftCOM: boolean,
    center: string
}

export default function displayShiftedPosition({ massObjectsRef, shiftCOM, center }: displayShiftedPositionInterface) {
    let shiftVector: vector = [0, 0, 0];
    let totalMass = 0

    if (shiftCOM) {
        for (const massObject of massObjectsRef.current) {
            shiftVector = addVector(shiftVector, multiplyVectorWithScalar(massObject.position, massObject.mass))
            totalMass = totalMass + massObject.mass;
        }

        if (totalMass > 0) {
            shiftVector = multiplyVectorWithScalar(shiftVector, -1 / totalMass);
        }
    }

    if (allowedCenters.includes(center)) {
        const [centerMassObject] = massObjectsRef.current.filter((massObject: MassObjectData) => massObject.name === center)

        if (centerMassObject) {
            // shiftVector =  (- COM) initially
            const centerFromCOM = addVector(centerMassObject.position, shiftVector)

            shiftVector = addVector(shiftVector, multiplyVectorWithScalar(centerFromCOM, -1))
        }
    } else {
        // default case = no center shift = COM = SSB in center
    }


    // update positions

    for (const massObject of massObjectsRef.current) {
        massObject.shiftedPosition = addVector(massObject.position, shiftVector)
    }

}

interface getCOMInterface {
    massObjectsRef: MutableRefObject<MassObjectData[]>,
}

export function getCOM({ massObjectsRef }: getCOMInterface): vector {
    let shiftVector: vector = [0, 0, 0]
    let totalMass = 0;

    for (const massObject of massObjectsRef.current) {
        shiftVector = addVector(shiftVector, multiplyVectorWithScalar(massObject.position, massObject.mass))
        totalMass = totalMass + massObject.mass;
    }

    if (totalMass > 0) {
        shiftVector = multiplyVectorWithScalar(shiftVector, -1 / totalMass);
    }

    return shiftVector
}