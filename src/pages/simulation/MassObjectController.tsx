import MassObjectData from './computation/MassObjectData'
import styles from './MassObjectController.module.scss'
import { convertSItoDisplayed, convertDisplayedToSI } from '../../utils/convertVectorSI'
import { useState, Dispatch, SetStateAction } from 'react'
import ModifyMassObject from './ModifyMassObject'
import { MutableRefObject } from 'react'

type vector = [number, number, number]

interface MassObjectControllerProps {
    name: string,
    massObject: MassObjectData,
    massObjectsRef: MutableRefObject<MassObjectData[]>,
    deleteMassObject: (name: string) => void,
    modifyMassObject: (modifiedObject: MassObjectData, name: string, position: vector, velocity: vector, mass: number) => void,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    setSelectedObjects: Dispatch<SetStateAction<string[]>>
}


export default function MassObjectController({ name, massObject, massObjectsRef, deleteMassObject, modifyMassObject, setErrorMessage, setSelectedObjects }: MassObjectControllerProps) {

    const unselectObject = () => {
        massObject.selected = false;
        massObject.trajectoryStateDispatch({ type: 'reset' })
        setSelectedObjects((selectedNames: string[]) => selectedNames.filter((name: string) => name !== massObject.name))
    }

    const [displayModify, setDisplayModify] = useState<boolean>(false);

    const displayedPosition = convertSItoDisplayed({ vector: massObject.shiftedPosition, type: 'position' })
    const displayedVelocity = convertSItoDisplayed({ vector: massObject.velocity, type: 'velocity' });
    const displayedMass = convertSItoDisplayed({ scalar: massObject.mass, type: 'mass' });

    if (displayedPosition && displayedVelocity && displayedMass) {
        return (
            <div className={styles.massObjectController}>
                <h1>{name}</h1>
                <div>
                    <h2>Position</h2>
                    <div>x: <span>{displayedPosition[0]}</span> AU</div>
                    <div>y: <span>{displayedPosition[1]}</span> AU</div>
                    <div>z: <span>{displayedPosition[2]}</span> AU</div>
                </div>

                <div>
                    <h2>Velocity</h2>
                    <div>vx: <span>{displayedVelocity[0]}</span> km/s</div>
                    <div>vy: <span>{displayedVelocity[1]}</span> km/s</div>
                    <div>vz: <span>{displayedVelocity[2]}</span> km/s</div>
                </div>

                <div>
                    <h2>Mass</h2>
                    <div>m: <span>{displayedMass}</span> M</div>
                </div>

                <div>
                    <button onClick={() => deleteMassObject(name)}>Delete</button>

                    <button onClick={() => setDisplayModify((previous: boolean) => !previous)}>Modify</button>

                    <button onClick={() => unselectObject()}>Unselect</button>

                    {displayModify ?
                        <ModifyMassObject
                            massObject={massObject}
                            massObjectsRef={massObjectsRef}
                            modifyMassObject={modifyMassObject}
                            setErrorMessage={setErrorMessage}
                            onCancel={() => setDisplayModify(false)}
                        />
                        : null}
                </div>
            </div >
        )
    } else {
        return null;
    }
}