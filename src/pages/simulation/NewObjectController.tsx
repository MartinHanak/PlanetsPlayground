import { match } from 'assert'
import { SetStateAction, Dispatch, useState, ChangeEvent } from 'react'
import styles from './MassObjectController.module.scss'
import controlsStyles from './Controls.module.scss';

import { convertDisplayedToSI } from '../../utils/convertVectorSI';

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
        mass: 1.0
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

        if (formValues.name === '') {
            setErrorMessage('Name of the object cannot be empty');
        } else if (formValues.name === 'Sun' || formValues.name === 'Mercury' || formValues.name === 'Venus' ||
            formValues.name === 'Earth' || formValues.name === 'Mars') {
            setErrorMessage('Name of the object has to be unique');
        } else if (
            isNaN(Number(formValues.positionX)) ||
            isNaN(Number(formValues.positionY)) ||
            isNaN(Number(formValues.positionZ)) ||
            isNaN(Number(formValues.velocityX)) ||
            isNaN(Number(formValues.velocityY)) ||
            isNaN(Number(formValues.velocityZ)) ||
            isNaN(Number(formValues.mass))
        ) {
            setErrorMessage("Position, velocity and mass has to be valid numbers.")
        } else {

            const position: vector = [
                convertDisplayedToSI({ type: 'position', component: Number(formValues.positionX) }),
                convertDisplayedToSI({ type: 'position', component: Number(formValues.positionY) }),
                convertDisplayedToSI({ type: 'position', component: Number(formValues.positionZ) })
            ]
            const velocity: vector = [
                convertDisplayedToSI({ type: 'velocity', component: Number(formValues.velocityX) }),
                convertDisplayedToSI({ type: 'velocity', component: Number(formValues.velocityY) }),
                convertDisplayedToSI({ type: 'velocity', component: Number(formValues.velocityZ) }),
            ]
            const mass = convertDisplayedToSI({ type: "mass", component: Number(formValues.mass) })

            addMassObject(formValues.name, position, velocity, mass)
            hide()
        }
    }

    return (
        <div className={`${styles.massObjectController} desktopMaxWidth ${controlsStyles.commonBackground}`}>

            <h3 className={controlsStyles.newObjectLegend}>Input values for the new object:</h3>
            <div className={controlsStyles.nameContainer}>
                <label htmlFor="name">
                    <input name="name" id="name" type="text" placeholder="name" value={formValues.name} onChange={handleChange} />
                </label>
            </div>

            <div className={controlsStyles.dataContainer}>
                <div>
                    <h4>Position</h4>
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
                    <h4>Velocity</h4>
                    <label htmlFor="velocityX">
                        vx: <input name="velocityX" id="velocityX" type="text" placeholder="x" value={formValues.velocityX} onChange={handleChange} /> km/s
                    </label>
                    <label htmlFor="velocityY">
                        vy: <input name="velocityY" id="velocityY" type="text" placeholder="y" value={formValues.velocityY} onChange={handleChange} /> km/s
                    </label>
                    <label htmlFor="velocityZ">
                        vz: <input name="velocityZ" id="velocityZ" type="text" placeholder="z" value={formValues.velocityZ} onChange={handleChange} /> km/s
                    </label>
                </div>

                <div>
                    <h4>Mass</h4>
                    <label htmlFor="mass">
                        m: <input name="mass" id="mass" type="text" placeholder="mass" value={formValues.mass} onChange={handleChange} /> M
                    </label>
                </div>
            </div>

            <div className={controlsStyles.buttonsContainer}>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={hide}>Cancel</button>
            </div>
        </div>
    )
}