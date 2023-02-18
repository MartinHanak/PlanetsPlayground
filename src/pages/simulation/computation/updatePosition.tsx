import { MutableRefObject } from "react"
import MassObjectData from "./MassObjectData"

const gravitationConstant = 6.6743e-11;

export type vector = [number, number, number];

interface updatePositionInterface {
    timestepRef: MutableRefObject<number>,
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    forcesRef: MutableRefObject<vector[][]>,
    positionDifferencesRef: MutableRefObject<vector[][]>,
    distancesRef: MutableRefObject<number[][]>
}

export default function updatePosition({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef }: updatePositionInterface): void {

    const N = massObjectsRef.current.length;
    const timeStepSeconds = timestepRef.current * 24 * 60 * 60;

    if (forcesRef.current.length === 0 ||
        distancesRef.current.length === 0 ||
        positionDifferencesRef.current.length === 0 ||
        forcesRef.current.length !== N ||
        positionDifferencesRef.current.length !== N ||
        distancesRef.current.length !== N) {
        // initialize distances and forces

        positionDifferencesRef.current = []
        distancesRef.current = []
        forcesRef.current = []

        for (let i = 0; i < N; i++) {
            positionDifferencesRef.current[i] = []
            distancesRef.current[i] = []
            forcesRef.current[i] = []
        }

        updateForces({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef })

    }

    // position update
    // using velocity-verlet algorithm

    // 1. mid-step velocity v(t + dt/2)
    for (let i = 0; i < N; i++) {
        massObjectsRef.current[i].velocity = addVector(massObjectsRef.current[i].velocity,
            multiplyVectorWithScalar(massObjectsRef.current[i].force,
                timeStepSeconds / (2 * massObjectsRef.current[i].mass)))
    }

    // 2. new position x(t + dt)
    for (let i = 0; i < N; i++) {
        massObjectsRef.current[i].position = addVector(massObjectsRef.current[i].position,
            multiplyVectorWithScalar(massObjectsRef.current[i].velocity, timeStepSeconds))
    }

    // 3. update forces = only once per timestep (if initialized before)
    updateForces({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef })

    // 4.  update velocity to v(t + dt) from v(t + dt/2)
    for (let i = 0; i < N; i++) {
        massObjectsRef.current[i].velocity = addVector(massObjectsRef.current[i].velocity,
            multiplyVectorWithScalar(massObjectsRef.current[i].force,
                timeStepSeconds / (2 * massObjectsRef.current[i].mass)))
    }

}


function updateForces({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef }: updatePositionInterface) {
    // order does matter here, do not change
    calculatePositionDifferences({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef })
    calculateDistances({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef })
    calculateForces({ timestepRef, massObjectsRef, forcesRef, positionDifferencesRef, distancesRef })

}


function calculatePositionDifferences({ massObjectsRef, positionDifferencesRef }: updatePositionInterface) {
    const N = massObjectsRef.current.length;

    // only half of the symmetrical matrix have to be computed
    for (let i = 0; i < N; i++) {
        for (let j = (i + 1); j < N; j++) {
            positionDifferencesRef.current[i][j] = subtractVector(massObjectsRef.current[i].position, massObjectsRef.current[j].position)
        }
    }
}


// values =  distances squared
function calculateDistances({ massObjectsRef, positionDifferencesRef, distancesRef }: updatePositionInterface) {
    const N = massObjectsRef.current.length;

    // only half of the symmetrical matrix have to be computed
    for (let i = 0; i < N; i++) {
        for (let j = (i + 1); j < N; j++) {
            distancesRef.current[i][j] = scalarProduct(positionDifferencesRef.current[i][j], positionDifferencesRef.current[i][j])
        }
    }
}

function calculateForces({ massObjectsRef, forcesRef, positionDifferencesRef, distancesRef }: updatePositionInterface) {
    const N = massObjectsRef.current.length;

    // only half of the symmetrical matrix have to be computed
    for (let i = 0; i < N; i++) {
        for (let j = (i + 1); j < N; j++) {

            const prefactor = gravitationConstant * massObjectsRef.current[i].mass * massObjectsRef.current[j].mass * Math.pow(distancesRef.current[i][j], -1.5)


            forcesRef.current[i][j] = multiplyVectorWithScalar(positionDifferencesRef.current[i][j], prefactor);
        }
    }

    // fill in the rest of the forces
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < (i + 1); j++) {
            if (i === j) {
                forcesRef.current[i][j] = [0, 0, 0]
            } else {
                forcesRef.current[i][j] = multiplyVectorWithScalar(forcesRef.current[j][i], -1)
            }
        }
    }

    // update total force acting on the object
    for (let i = 0; i < N; i++) {
        massObjectsRef.current[i].force = [0, 0, 0];
    }
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            massObjectsRef.current[i].force = addVector(massObjectsRef.current[i].force, forcesRef.current[j][i])
        }
    }

}

function getDistance(vector1: vector, vector2: vector): number {
    return Math.sqrt(scalarProduct(vector1, vector2))
}

export function scalarProduct(vector1: vector, vector2: vector): number {

    let result = 0;

    vector1.forEach((component: number, index: number) => {
        result = result + vector1[index] * vector2[index]
    })

    return result
}

export function subtractVector(vector1: vector, vector2: vector): vector {
    const result: vector = [0, 0, 0];

    for (let index = 0; index < 3; index++) {
        result[index] = vector1[index] - vector2[index];
    }

    return result
}

export function addVector(vector1: vector, vector2: vector): vector {
    const result: vector = [0, 0, 0];

    for (let index = 0; index < 3; index++) {
        result[index] = vector1[index] + vector2[index];
    }

    return result
}

export function multiplyVectorWithScalar(vector: vector, scalar: number): vector {
    const result: vector = [scalar, scalar, scalar];

    for (let index = 0; index < 3; index++) {
        result[index] = result[index] * vector[index];
    }

    return result
}