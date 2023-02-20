import { MutableRefObject } from "react"
import MassObjectData from "./MassObjectData"

import { initialMassObjectData } from "../Scene"

interface saveLocalStorageInterface {
    date: number,
    massObjectsRef: MutableRefObject<MassObjectData[]>,
}

export default function saveLocalStorage({ date, massObjectsRef }: saveLocalStorageInterface) {
    const savedData: initialMassObjectData[] = [];

    for (const massObject of massObjectsRef.current) {
        savedData.push({
            name: massObject.name,
            position: massObject.position,
            velocity: massObject.velocity
        })
    }


    localStorage.setItem("initialMassObjectData", JSON.stringify(savedData));
    localStorage.setItem("initialDate", date.toString());
}