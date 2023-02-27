import { useTranslation } from "react-i18next"

export default function About() {

    const { t } = useTranslation('about')

    return (
        <div className="desktopMaxWidth">
            <h1>{t('title')}</h1>
            <p>
                {t('underTitle')}
            </p>
            <p>
                {t('firstParContent')}
            </p>

            <p>
                {t('secondParContent')}
            </p>

            <p>
                {t('thirdParContent')}
            </p>
        </div>
    )
}