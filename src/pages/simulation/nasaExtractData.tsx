import MassObjectData from "./computation/MassObjectData";

type massObjectInitialData = {
    name: string,
    position: [number, number, number],
    velocity: [number, number, number]
}

export default async function nasaExtractData(text: string): Promise<massObjectInitialData> {
    // text contains plain text response
    // data have to be extracted using regular expressions
    // patterns = two capital letters or one capital and space = number in exp. form
    // e.g. X = 4.953382706823754E+07 Y = 1.394931209068222E+08 Z = 8.142142795555294E+03
    //      VX=-2.847384182076938E+01 VY= 1.007739354140973E+01 VZ=-1.112126458759910E-03

    const tempObject: { [key: string]: number | string | null } = { name: null, X: null, Y: null, Z: null, VX: null, VY: null, VZ: null }

    const nameRegExp = /(Target body name:)(\s)([\s\w]+)\s\(/;
    const nameMatch = nameRegExp.exec(text);

    if (nameMatch && nameMatch[3] && nameMatch[3] !== '') {
        tempObject['name'] = nameMatch[3];
    }

    // data about the object position and velocity is between the lines
    // denoted by $$SOE and $$EOE (Start/End Of Ephemeris)
    const subtext = text.substring(text.indexOf("$$SOE"), text.indexOf("$$EOE"));

    const vecComponentRegExp = /(\w{1,2})(\s)?(=)(\s)?([+-]?\d+\.\d+E[+-]\d+)/g;
    const vectorComponents = subtext.matchAll(vecComponentRegExp);

    // position and speed in meters (API outputs kilometers)
    for (const vecComponent of vectorComponents) {
        const vecComponentName = vecComponent[1];
        const vecComponentValue = Number(vecComponent[5]) * 1000;

        if (vecComponentName in tempObject) {
            if (!isNaN(vecComponentValue)) {
                tempObject[vecComponentName] = vecComponentValue;
            }
        }
    }

    if (tempObject.name !== null &&
        tempObject.X !== null && tempObject.Y !== null && tempObject.Z !== null &&
        tempObject.VX !== null && tempObject.VY !== null && tempObject.VZ !== null) {

        const result = {
            name: tempObject.name,
            position: [tempObject.X, tempObject.Y, tempObject.Z],
            velocity: [tempObject.VX, tempObject.VY, tempObject.VZ]
        } as MassObjectData
        console.log(result)
        return result

    } else {
        console.log("error")
        throw new Error('One of the mass objects failed during extraction of its initial data.')
    }

}