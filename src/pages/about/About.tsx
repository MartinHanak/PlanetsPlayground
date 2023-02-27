import { useTranslation } from "react-i18next"

import styles from "./About.module.scss"

export default function About() {

    const { t } = useTranslation('about')

    return (
        <div className={`${styles.about} desktopMaxWidth`}>
            <h1>{t('title')}</h1>
            <p>
                {t('underTitle')}
            </p>

            <h2>{t('firstParTitle')}</h2>
            <p>
                {t('firstParContent')}
            </p>

            <h2>{t('secondParTitle')}</h2>
            <p>
                {t('secondParContent')}
            </p>

            <h2>{t('thirdParTitle')}</h2>
            <p>
                {t('thirdParContent')}
            </p>
        </div>
    )
}