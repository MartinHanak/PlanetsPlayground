import { Dispatch } from "react";
import { Mesh } from "three";
import { Texture, Line, Vector3 } from "three";
import { actionTypes } from "../MassObjectTrajectory";



type vector = [number, number, number];

export default class MassObjectData {
    name: string;
    position: vector;
    shiftedPosition: vector;
    velocity: vector;
    force: vector;
    meshRef: Mesh | null;
    texture: Texture | null;
    radius: number;
    mass: number;
    trajLineRef: Line | null;
    trajectory: Vector3[];
    trajectoryStateDispatch: Dispatch<actionTypes> | (() => void);
    selected: boolean;
    color: string;


    constructor(name: string, position: vector, velocity: vector, mass?: number | undefined) {
        this.name = name;
        this.position = position;
        this.shiftedPosition = position;
        this.velocity = velocity;
        this.force = [0, 0, 0];

        if (mass === undefined) {
            this.mass = assignMass(name);
        } else {
            this.mass = mass;
        }

        this.meshRef = null;
        this.texture = null;
        this.radius = 7479893535; // in meters
        this.selected = false;

        this.trajLineRef = null;
        this.trajectory = [];
        this.trajectoryStateDispatch = () => console.log("trajectory not yet initialized");

        this.color = assignColor(name)
    }
}



function assignMass(name: string) {

    const nameMassDictionary: { [key: string]: number } = {
        "Sun": 1.98847e30,
        "Mercury": 3.285e23,
        "Venus": 4.867e24,
        "Earth": 5.9722e24,
        "Mars": 6.39e23,
        "Default": 5.9722e24
    }

    if (name in nameMassDictionary) {
        return nameMassDictionary[name]
    } else {
        return nameMassDictionary["Default"];
    }


}


function assignColor(name: string) {

    const nameColorDictionary: { [key: string]: string } = {
        "Sun": "rgb(255, 255, 0)",
        "Mercury": "rgb(255, 191, 0)",
        "Venus": "rgb(255, 191, 0)",
        "Earth": "rgb(0, 191, 255)",
        "Mars": "rgb(255, 191, 0)",
        "Default": "rgb(0, 0, 0)"
    }


    if (name in nameColorDictionary) {
        return nameColorDictionary[name]
    } else {
        return nameColorDictionary["Default"];
    }
}