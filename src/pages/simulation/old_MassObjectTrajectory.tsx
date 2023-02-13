import { useEffect, useRef } from "react";


import { BufferAttribute, BufferGeometry } from "three";
import { ForwardedRef, forwardRef } from "react"
import { Vector3 } from "three";
import { Line } from "three";



const MAX_POINTS = 100;



export default forwardRef(function MassObjectTrajectory(props: any, ref: ForwardedRef<Line>) {

    const trajGeometry = useRef<BufferGeometry>(null)

    useEffect(() => {
        if (trajGeometry.current !== null) {
            console.log("creating buffer geometry")
            // const positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            // trajGeometry.current.setAttribute('positions', new BufferAttribute(positions, 3))
            // trajGeometry.current.setDrawRange(0, 100)

            trajGeometry.current.setFromPoints([new Vector3(0, 0, 0), new Vector3(100, 200, 300)])
            console.log(trajGeometry.current);

        }
    }, [trajGeometry.current])


    return (
        <primitive object={Line} ref={ref}>
            <bufferGeometry ref={trajGeometry} />
            <lineBasicMaterial color={"red"} />
        </primitive>
    )
})