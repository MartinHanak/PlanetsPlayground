import styles from './LanguageSwitch.module.scss';

interface LanguageSwitchProps {
    toggleLanguage: () => void,
}

export default function LanguageSwitch({ toggleLanguage }: LanguageSwitchProps) {
    return (
        <div className={styles.switch}>
            <button onClick={() => toggleLanguage()}>CZ</button>
            <button onClick={() => toggleLanguage()}>EN</button>

        </div >
    )
}