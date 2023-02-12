
interface gridProps {
    unitConversionFactor: number;
}


export default function Grid({ unitConversionFactor }: gridProps) {

    return <gridHelper args={[10 * unitConversionFactor, 10, 'rgba(228, 228, 228, 0.97)', 'rgba(228, 228, 228, 0.97)']} />

}