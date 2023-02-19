import { CameraControls } from "@react-three/drei";
import { Camera, useThree } from "@react-three/fiber";
import { RootState } from "@react-three/fiber";
import { MutableRefObject } from "react";

interface resetCameraInterface {
    conversionFactor: number,
    cameraControlsRef: MutableRefObject<CameraControls | null>,
    camera: Camera
}

export default function resetCamera({ conversionFactor, cameraControlsRef, camera }: resetCameraInterface) {

    const cameraAUDistInCanvasUnits = 4 * 149597870700 * conversionFactor;

    camera.up.set(0, 0, 1);

    camera.near = 0.00001;
    camera.far = cameraAUDistInCanvasUnits * 10;

    camera.zoom = 1;
    camera.updateProjectionMatrix();

    if (cameraControlsRef.current) {
        cameraControlsRef.current.setPosition(-cameraAUDistInCanvasUnits, -cameraAUDistInCanvasUnits, -cameraAUDistInCanvasUnits)

        cameraControlsRef.current.setTarget(0, 0, 0);

        cameraControlsRef.current.enabled = true;

        cameraControlsRef.current.updateCameraUp()

    }


}