import { NumberKeyframeTrack } from "three"

export type vectorTypes = {
    vector: [number, number, number]
    type: 'velocity' | 'position'
}

export type scalarTypes = {
    scalar: number,
    type: 'mass'
}

export type vectorOrScalar = vectorTypes | scalarTypes;



const EarthMass = 5.9722e24; // in kg
const positionFactor = 149597870700  // 1 AU in meters
const velocityFactor = 1000 // diplay km / s


export function convertSItoDisplayed(props: vectorOrScalar) {
    if (props.type === 'mass') {
        return (props.scalar / EarthMass).toFixed(1)
    } else if (props.type === 'position') {
        return props.vector.map((component: number) => (component / positionFactor).toFixed(3));
    } else if (props.type === 'velocity') {
        return props.vector.map((component: number) => (component / velocityFactor).toFixed(1));
    }

}

interface convertSIComponentToDisplayed {
    type: 'mass' | 'position' | 'velocity',
    component: number
}


export function convertSIComponentToDisplayed({ type, component }: convertSIComponentToDisplayed): string {
    if (type === 'mass') {
        return (component / EarthMass).toFixed(1)
    } else if (type === 'position') {
        return (component / positionFactor).toFixed(3)
    } else if (type === 'velocity') {
        return (component / velocityFactor).toFixed(1)
    } else {
        return component.toFixed(1)
    }
}

type vectorComponentOrScalar = {
    component: number,
    type: 'velocity' | 'position' | 'mass'
}


export function convertDisplayedToSI(props: vectorComponentOrScalar): number {
    if (props.type === 'mass') {
        return (props.component * EarthMass)
    } else if (props.type === 'position') {
        return (props.component * positionFactor)
    } else if (props.type === 'velocity') {
        return (props.component * velocityFactor)
    } else {
        return props.component
    }
}