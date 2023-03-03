import { vectorOrScalar } from "./convertVectorSI"

export default function roundUpDisplayedNumbers(props: vectorOrScalar) {
    if (props.type === 'mass') {
        return props.scalar.toPrecision(1);
    } else {
        return props.vector.map((component: number) => component.toPrecision(3))
    }
}