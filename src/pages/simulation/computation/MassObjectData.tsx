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


    constructor(name: string, position: vector, velocity: vector) {
        this.name = name;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = [0, 0, 0];
        this.meshRef = null;
        this.texture = null;
    }
}