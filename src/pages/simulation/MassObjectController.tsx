import MassObjectData from './computation/MassObjectData'
import styles from './MassObjectController.module.scss'
import controlsStyles from './Controls.module.scss';
import { convertSItoDisplayed, convertDisplayedToSI } from '../../utils/convertVectorSI'
import { useState, Dispatch, SetStateAction } from 'react'
import ModifyMassObject from './ModifyMassObject'
import { MutableRefObject } from 'react'
import { useTranslation } from 'react-i18next';

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

    const { t, i18n } = useTranslation('simulation');

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
            <div className={`desktopMaxWidth ${styles.massObjectController}  ${controlsStyles.commonBackground}`}>
                <div className={`${controlsStyles.nameContainer}`}>
                    <h3>{i18n.exists(`simulation:planetNames.${name}`) ? t(`planetNames.${name}`) : name}</h3>
                    <button onClick={() => deleteMassObject(name)} className={controlsStyles.deleteButton}>{t('delete')}</button>
                </div>

                <div className={controlsStyles.dataContainer}>
                    <div>
                        <h4>{t('position')}</h4>
                        <div>x: <span>{displayedPosition[0]}</span> AU</div>
                        <div>y: <span>{displayedPosition[1]}</span> AU</div>
                        <div>z: <span>{displayedPosition[2]}</span> AU</div>
                    </div>

                    <div>
                        <h4>{t('velocity')}</h4>
                        <div>vx: <span>{displayedVelocity[0]}</span> km/s</div>
                        <div>vy: <span>{displayedVelocity[1]}</span> km/s</div>
                        <div>vz: <span>{displayedVelocity[2]}</span> km/s</div>
                    </div>

                    <div>
                        <h4>{t('mass')}</h4>
                        <div>m: <span>{displayedMass}</span> M</div>
                    </div>
                </div>

                <div className={controlsStyles.buttonsContainer}>

                    <button onClick={() => setDisplayModify((previous: boolean) => !previous)}>{t('modify')}</button>

                    <button onClick={() => unselectObject()}>{t('unselect')}</button>
                </div>

                {displayModify ?
                    <ModifyMassObject
                        massObject={massObject}
                        massObjectsRef={massObjectsRef}
                        modifyMassObject={modifyMassObject}
                        setErrorMessage={setErrorMessage}
                        onCancel={() => setDisplayModify(false)}
                    />
                    : null}
            </div >
        )
    } else {
        return null;
    }
}