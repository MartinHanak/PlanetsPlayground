import { Html } from "@react-three/drei"
import { SetStateAction, Dispatch, useEffect } from "react"
import styles from './ErrorNotification.module.scss'

interface ErrorNotificationProps {
    message: string,
    setErrorMessage: Dispatch<SetStateAction<string>>
}

export default function ErrorNotification({ message, setErrorMessage }: ErrorNotificationProps) {

    useEffect(() => {
        setTimeout(() => setErrorMessage(''), 5000)
    }, [])

    return (
        <Html occlude wrapperClass={`${styles.errorWrapper} canvas-error-message`}>
            <div className={styles.error}>
                <h1>Error</h1>
                <p>{message}</p>

                <button onClick={() => setErrorMessage('')}>Hide</button>
            </div>
        </Html>)
}