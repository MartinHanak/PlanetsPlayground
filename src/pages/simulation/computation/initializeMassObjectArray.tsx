import React from "react";
import { Texture } from "three";

import { initialMassObjectData } from "../Scene";
import MassObjectData from "./MassObjectData";

interface textureDictionary {
    [key: string]: Texture,
    "Default": Texture
}


export default function initializeMassObjectArray(arrayRef: React.MutableRefObject<MassObjectData[]>, initialData: initialMassObjectData[], textureDictionary: textureDictionary) {
    arrayRef.current = [];

    // initialize objects
    initialData.map((initialMassObjectData: initialMassObjectData) => {
        arrayRef.current.push(new MassObjectData(
            initialMassObjectData.name,
            initialMassObjectData.position,
            initialMassObjectData.velocity
        ))
    })

    // assign textures
    arrayRef.current.map((massObjectData: MassObjectData) => {
        if (massObjectData.name in textureDictionary) {
            massObjectData.texture = textureDictionary[massObjectData.name];
        } else {
            massObjectData.texture = textureDictionary["Default"];
        }
    })
}