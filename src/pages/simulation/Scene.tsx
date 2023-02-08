import { useLoader, useFrame, ThreeElements } from "@react-three/fiber"
import { TextureLoader } from "three/src/loaders/TextureLoader"

import SunTextureImage from "../../assets/textures/1k_textures/Sun_texture.jpg"
import MercuryTextureImage from "../../assets/textures/1k_textures/Mercury_texture.jpg"
import VenusTextureImage from "../../assets/textures/1k_textures/Venus_texture.jpg"
import EarthTextureImage from "../../assets/textures/1k_textures/Earth_texture.jpg"
import MarsTextureImage from "../../assets/textures/1k_textures/Mars_texture.jpg"
import React, { useEffect, useRef, useState } from "react"

import MassObject from "./MassObject"
import { Mesh } from "three"


interface massObjectData {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}


interface sceneProps {
    massObjectDataArray: massObjectData[]
}

export default function Scene({ massObjectDataArray }: sceneProps) {

    const massObjectsRef = useRef<Mesh[]>([]);

    const [SunTexture, MercuryTexture, VenusTexture, EarthTexture, MarsTexture]
        = useLoader(TextureLoader, [SunTextureImage, MercuryTextureImage, VenusTextureImage, EarthTextureImage, MarsTextureImage])

    useEffect(() => {
        console.log("log inside suspense")

    }, [])

    useFrame(() => {
        console.log("updating frame")
        if (massObjectsRef.current !== null) {
            massObjectsRef.current.map((mesh: Mesh) => {
                mesh.position.x = mesh.position.x + 1;
            })
        }
    })

    return (
        <>
            {massObjectDataArray.map(({ name, position, velocity }: massObjectData, index: number) => {
                return (
                    <MassObject key={name} ref={(meshRef: Mesh) => massObjectsRef.current.push(meshRef)} position={position} args={[10, 32, 32]} texture={EarthTexture} />
                )
            })}


        </>
    )

}