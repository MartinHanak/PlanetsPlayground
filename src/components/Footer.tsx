import { useTranslation } from "react-i18next";
import styles from './Footer.module.scss'

interface footerInterface {
    className?: string
}

export default function Footer({ className }: footerInterface) {

    const { t } = useTranslation('footer');


    return (
        <footer className={className}>
            <span className={styles.white}>{t('creatorIntro')}&nbsp;</span>
            <span className={styles.whiteBold}>{t('authorName')}</span>
        </footer>
    )
}