import { Line } from "@react-three/drei"
import { BufferGeometry, Vector3 } from "three"
import { useEffect } from "react"

interface trajectoryProps {
    points: Array<Vector3 | [number, number, number]>
}

export default function MassObjectTrajectory({ points }: trajectoryProps) {

    useEffect(() => {
        console.log("points changed")
    }, [points.length])

    if (points.length > 0) {
        return (
            <Line points={points} >
                <bufferGeometry
                    onUpdate={(geom: BufferGeometry) => {
                        geom.setFromPoints(points.map((p: Vector3 | [number, number, number]) =>
                            p instanceof Vector3 ? p : new Vector3(p[0], p[1], p[2])
                        ))
                    }}
                />
            </Line>
        )
    } else {
        return null
    }
}