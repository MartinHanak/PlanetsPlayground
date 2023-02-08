import { Args } from '@react-three/drei'
import React, { ForwardedRef } from 'react';
import { Mesh, Vector3 } from 'three'
import { Texture } from 'three'

import { forwardRef } from 'react';


interface massObjectProps {
    position: [number, number, number],
    args: [number, number, number],
    texture: Texture
}



export default forwardRef(function MassObject({ position, args, texture }: massObjectProps, ref: ForwardedRef<Mesh>) {
    const positionVector = new Vector3(...position)

    return (
        <mesh position={positionVector} ref={ref} >
            < sphereGeometry args={args} />
            < meshStandardMaterial map={texture} />
        </mesh>
    );

})

