import { ForwardedRef } from 'react';
import { BackSide, DoubleSide, FrontSide, Mesh, Vector3 } from 'three'
import { Texture } from 'three'

import { forwardRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { Html, meshBounds } from '@react-three/drei';


interface massObjectProps {
    name: string,
    position: [number, number, number],
    args: [number, number, number],
    texture: Texture | null,
    onClick: (event: ThreeEvent<MouseEvent>) => void
}



export default forwardRef(function MassObject({ name, position, args, texture, onClick }: massObjectProps, ref: ForwardedRef<Mesh>) {
    const positionVector = new Vector3(...position)

    return (
        <mesh position={positionVector} ref={ref} onClick={onClick} rotation={[Math.PI / 2, 0, 0]} >
            < sphereGeometry args={args} />

            {(name === "Sun") ?
                < meshStandardMaterial map={texture} emissive={"white"} emissiveMap={texture} />
                : < meshStandardMaterial map={texture} />
            }

        </mesh>

    );

})

