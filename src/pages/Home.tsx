import { useTranslation } from "react-i18next"

export default function Home() {

    const { t } = useTranslation('test');

    return (
        <div>
            <h1>{t('test')}</h1>
        </div>
    )
}