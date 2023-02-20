import { useState } from "react"
import { ChangeEvent } from "react";
import { Dispatch, SetStateAction } from "react";
import MassObjectData from "./computation/MassObjectData";
import { convertSIComponentToDisplayed, convertSItoDisplayed, convertDisplayedToSI } from "../../utils/convertVectorSI";
import { MutableRefObject } from "react";

type vector = [number, number, number];


interface formValues {
    name: string,
    positionX: string,
    positionY: string,
    positionZ: string,
    velocityX: string,
    velocityY: string,
    velocityZ: string,
    mass: string,
}

interface modifyMassObjectInterface {
    massObject: MassObjectData,
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    modifyMassObject: (modifiedObject: MassObjectData, name: string, position: vector, velocity: vector, mass: number) => void,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    onCancel: () => void
}

export default function ModifyMassObject({ massObject, massObjectsRef, modifyMassObject, setErrorMessage, onCancel }: modifyMassObjectInterface) {


    const [formValues, setFormValues] = useState<formValues>({
        name: massObject.name,
        positionX: convertSIComponentToDisplayed({ type: 'position', component: massObject.shiftedPosition[0] }),
        positionY: convertSIComponentToDisplayed({ type: 'position', component: massObject.shiftedPosition[1] }),
        positionZ: convertSIComponentToDisplayed({ type: 'position', component: massObject.shiftedPosition[2] }),
        velocityX: convertSIComponentToDisplayed({ type: 'velocity', component: massObject.velocity[0] }),
        velocityY: convertSIComponentToDisplayed({ type: 'velocity', component: massObject.velocity[1] }),
        velocityZ: convertSIComponentToDisplayed({ type: 'velocity', component: massObject.velocity[2] }),
        mass: convertSIComponentToDisplayed({ type: 'mass', component: massObject.mass })
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
        } else if (!isUniqueName()) {
            setErrorMessage('Name has to be unique');
        } else if (!areInputsValidNumbers()) {
            setErrorMessage('Input position, velocitya and mass have to be valid numbers')
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


            // modify current values on the object

            modifyMassObject(massObject, formValues.name, position, velocity, mass);
            onCancel()
        }
    }

    const isUniqueName = () => {
        const originalName = massObject.name
        const otherObjets = massObjectsRef.current.filter((object: MassObjectData) => object.name !== originalName)

        const objectsWithSameName = otherObjets.filter((object: MassObjectData) => object.name === formValues.name)

        if (objectsWithSameName.length > 0) {
            return false
        } else {
            return true
        }


    }

    const areInputsValidNumbers = () => {
        if (isNaN(Number(formValues.positionX)) ||
            isNaN(Number(formValues.positionY)) ||
            isNaN(Number(formValues.positionZ)) ||
            isNaN(Number(formValues.velocityX)) ||
            isNaN(Number(formValues.velocityY)) ||
            isNaN(Number(formValues.velocityZ)) ||
            isNaN(Number(formValues.mass))) {
            return false
        } else {
            return true
        }
    }


    return (
        <>
            <div>
                <h2>Name</h2>
                <label htmlFor="name">
                    <input type="text" name="name" id="name" onChange={handleChange} value={formValues.name} />
                </label>
            </div>

            <div>
                <h2>Position</h2>
                <label htmlFor="positionX">
                    x: <input type="text" name="positionX" id="positionX" onChange={handleChange} value={formValues.positionX} />
                </label>
                <label htmlFor="positionY">
                    y: <input type="text" name="positionY" id="positionY" onChange={handleChange} value={formValues.positionY} />
                </label>
                <label htmlFor="positionZ">
                    z: <input type="text" name="positionZ" id="positionZ" onChange={handleChange} value={formValues.positionZ} />
                </label>
            </div>

            <div>
                <h2>Velocity</h2>
                <label htmlFor="velocityX">
                    x: <input type="text" name="velocityX" id="velocityX" onChange={handleChange} value={formValues.velocityX} />
                </label>
                <label htmlFor="velocityY">
                    y: <input type="text" name="velocityY" id="velocityY" onChange={handleChange} value={formValues.velocityY} />
                </label>
                <label htmlFor="velocityZ">
                    z: <input type="text" name="velocityZ" id="velocityZ" onChange={handleChange} value={formValues.velocityZ} />
                </label>
            </div>

            <div>
                <h2>Mass</h2>
                <label htmlFor="mass">
                    x: <input type="text" name="mass" id="mass" onChange={handleChange} value={formValues.mass} />
                </label>
            </div>


            <div>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </>
    )
}