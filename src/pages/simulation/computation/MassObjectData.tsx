import { Mesh } from "three";
import { Texture } from "three";

type vector = [number, number, number];

export default class MassObjectData {
    name: string;
    position: vector;
    velocity: vector;
    acceleration: vector;
    meshRef: Mesh | null;
    texture: Texture | null;
    mass: number;
    trajectory: vector[];


    constructor(name: string, position: vector, velocity: vector, mass?: number | undefined) {
        this.name = name;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = [0, 0, 0];

        if (mass === undefined) {
            this.mass = assignMass(name);
        } else {
            this.mass = mass;
        }

        this.meshRef = null;
        this.texture = null;

        this.trajectory = [];
    }
}



function assignMass(name: string) {

    const nameMassDictionary: { [key: string]: number } = {
        "Sun": 1.0,
        "Mercury": 1.0,
        "Venus": 1.0,
        "Earth": 1.0,
        "Mars": 1.0,
        "Default": 1.0
    }

    if (name in nameMassDictionary) {
        return nameMassDictionary[name]
    } else {
        return nameMassDictionary["Default"];
    }


}