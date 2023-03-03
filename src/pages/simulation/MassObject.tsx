import { ForwardedRef, forwardRef } from 'react';
import { Texture, Mesh, Vector3 } from 'three'
import { ThreeEvent } from '@react-three/fiber';


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

