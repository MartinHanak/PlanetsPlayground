interface LanguageSwitchProps {
    onClick(newLanguage: string): void
}

export default function LanguageSwitch({ onClick }: LanguageSwitchProps) {
    return (
        <div>
            <button onClick={() => onClick('cs')}>CZ</button>
            <button onClick={() => onClick('en')}>EN</button>

        </div>
    )
}