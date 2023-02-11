interface MassObjectControllerProps {
    name: string
}

export default function MassObjectController({ name }: MassObjectControllerProps) {
    return (
        <div>
            <h1>{name}</h1>
        </div>
    )
}