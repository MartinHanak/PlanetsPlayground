import { ForwardedRef } from 'react';
import { Mesh, Vector3 } from 'three'
import { Texture } from 'three'

import { forwardRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html, meshBounds } from '@react-three/drei';


interface massObjectProps {
    position: [number, number, number],
    args: [number, number, number],
    texture: Texture | null,
    onClick: (event: ThreeEvent<MouseEvent>) => void
}



export default forwardRef(function MassObject({ position, args, texture, onClick }: massObjectProps, ref: ForwardedRef<Mesh>) {
    const positionVector = new Vector3(...position)

    return (
        <mesh position={positionVector} ref={ref} onClick={onClick} rotation={[Math.PI / 2, 0, 0]}  >
            < sphereGeometry args={args} />
            < meshStandardMaterial map={texture} />
        </mesh>

    );

})

