import { Html } from "@react-three/drei"
import { MutableRefObject, useState } from "react"

interface currentDayProps {
    day: MutableRefObject<Date>
}

export default function CurrentDay({ day }: currentDayProps) {

    const [currentDay, setCurrentDay] = useState(day.current);

    return (
        <Html wrapperClass="canvas-date">
            <div>{`${day.current.getDate()}/${day.current.getMonth() + 1}/${day.current.getFullYear()}`}</div>
        </Html>
    )
}