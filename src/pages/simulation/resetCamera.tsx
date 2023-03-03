import { CameraControls } from "@react-three/drei";
import { Camera } from "@react-three/fiber";
import { MutableRefObject } from "react";

interface resetCameraInterface {
    conversionFactor: number,
    cameraControlsRef: MutableRefObject<CameraControls | null>,
    camera: Camera
}

export default function resetCamera({ conversionFactor, cameraControlsRef, camera }: resetCameraInterface) {

    const cameraAUDistInCanvasUnits = 4 * 149597870700 * conversionFactor;

    camera.up.set(0, 0, 1);
    camera.near = 0.0000001;
    camera.far = cameraAUDistInCanvasUnits * 10;

    if (cameraControlsRef.current) {

        cameraControlsRef.current.setTarget(0, 0, 0);

        cameraControlsRef.current.updateCameraUp();

        cameraControlsRef.current.zoom(1.5);


        cameraControlsRef.current.setPosition(-cameraAUDistInCanvasUnits, -cameraAUDistInCanvasUnits, -cameraAUDistInCanvasUnits)

        cameraControlsRef.current.enabled = true;
    }
}