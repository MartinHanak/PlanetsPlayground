
interface gridProps {
    unitConversionFactor: number;
}


export default function Grid({ unitConversionFactor }: gridProps) {

    return <gridHelper args={[4 * 149597870700 * unitConversionFactor, 10, 'rgb(228, 228, 228)', 'rgb(228, 228, 228)']} rotation={[Math.PI / 2, 0, 0]} />

}