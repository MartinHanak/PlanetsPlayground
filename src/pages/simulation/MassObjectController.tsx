import MassObjectData from './computation/MassObjectData'
import styles from './MassObjectController.module.scss'
import { convertSItoDisplayed, convertDisplayedToSI } from '../../utils/convertVectorSI'
import { ChangeEvent } from 'react'

interface MassObjectControllerProps {
    name: string,
    massObject: MassObjectData
}


export default function MassObjectController({ name, massObject }: MassObjectControllerProps) {

    const displayedPosition = convertSItoDisplayed({ vector: massObject.position, type: 'position' })
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
            </div >
        )
    } else {
        return null;
    }
}