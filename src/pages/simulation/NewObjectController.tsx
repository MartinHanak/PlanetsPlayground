import { match } from 'assert'
import { SetStateAction, Dispatch, useState, ChangeEvent } from 'react'
import styles from './MassObjectController.module.scss'

type vector = [number, number, number];


interface newObjectControllerProps {
    hide: () => void,
    addMassObject: (name: string, position: vector, velocity: vector, mass: number) => void,
    setErrorMessage: Dispatch<SetStateAction<string>>
}

interface formValues {
    name: string,
    positionX: number,
    positionY: number,
    positionZ: number,
    velocityX: number,
    velocityY: number,
    velocityZ: number,
    mass: number,
}

export default function NewObjectController({ hide, addMassObject, setErrorMessage }: newObjectControllerProps) {

    const [formValues, setFormValues] = useState<formValues>({
        name: '',
        positionX: 0,
        positionY: 0,
        positionZ: 1,
        velocityX: 0,
        velocityY: -30,
        velocityZ: 0,
        mass: 1
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormValues((previousValues: formValues) => {

            const inputName = event.target.name;

            return {
                ...previousValues,
                [inputName]: event.target.value
            }

        })
    }

    const handleConfirm = () => {

        const position: vector = [Number(formValues.positionX), Number(formValues.positionY), Number(formValues.positionZ)]
        const velocity: vector = [Number(formValues.velocityX), Number(formValues.velocityY), Number(formValues.velocityZ)]
        const mass = Number(formValues.mass)

        addMassObject(formValues.name, position, velocity, mass)
        hide()
        setErrorMessage("hello")
    }

    return (
        <div className={styles.massObjectController}>
            <h1>Input values for the new object:</h1>

            <div>
                <h2>Name</h2>
                <label htmlFor="name">
                    name: <input name="name" id="name" type="text" placeholder="name" value={formValues.name} onChange={handleChange} />
                </label>
            </div>

            <div>
                <h2>Position</h2>
                <label htmlFor="positionX">
                    x: <input name="positionX" id="positionX" type="text" placeholder="x" value={formValues.positionX} onChange={handleChange} /> AU
                </label>
                <label htmlFor="positionY">
                    y: <input name="positionY" id="positionY" type="text" placeholder="y" value={formValues.positionY} onChange={handleChange} /> AU
                </label>
                <label htmlFor="positionZ">
                    z: <input name="positionZ" id="positionZ" type="text" placeholder="z" value={formValues.positionZ} onChange={handleChange} /> AU
                </label>
            </div>

            <div>
                <h2>Velocity</h2>
                <label htmlFor="velocityX">
                    x: <input name="velocityX" id="velocityX" type="text" placeholder="x" value={formValues.velocityX} onChange={handleChange} /> km/s
                </label>
                <label htmlFor="velocityY">
                    y: <input name="velocityY" id="velocityY" type="text" placeholder="y" value={formValues.velocityY} onChange={handleChange} /> km/s
                </label>
                <label htmlFor="velocityZ">
                    z: <input name="velocityZ" id="velocityZ" type="text" placeholder="z" value={formValues.velocityZ} onChange={handleChange} /> km/s
                </label>
            </div>

            <div>
                <h2>Mass</h2>
                <label htmlFor="mass">
                    mass: <input name="mass" id="mass" type="text" placeholder="mass" value={formValues.mass} onChange={handleChange} />
                </label>
            </div>


            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={hide}>Cancel</button>
        </div>
    )
}