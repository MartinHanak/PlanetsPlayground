import { useTranslation } from "react-i18next"
import styles from './Contact.module.scss';

export default function Contact() {

    const { t } = useTranslation('contact')

    return (
        <div className={`desktopTwoThirdsMaxWidth ${styles.contact}`}>
            <div className={styles.intro}>
                <h1>{t('title')}</h1>
                <p>{t('underTitle')}  </p>
            </div>

            <div>
                <div className={styles.rowGrid}>
                    <span>{t('nameTitle')}:</span> <span>Martin Hanák</span>
                </div>
                <div className={styles.rowGrid}>
                    <span>Email:</span> <span>martinhanak97@gmail.com</span>
                </div>
                <div className={styles.rowGrid}>
                    <span>Github:</span> <span><a href="https://github.com/MartinHanak/PlanetsPlayground">/Gravitorium</a></span>
                </div>
            </div>

            <div className={styles.coffee}>
                {t('coffeeIntro')} <a href="https://www.buymeacoffee.com/martinhanak">{t('coffeeLink')}</a>
            </div>
        </div>
    )
}