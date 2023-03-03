import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import hamburger from "../assets/images/hamburgerMenu.svg"
import styles from './Navbar.module.scss';

export default function Navbar() {

    const [showMobileLinks, setShowMobileLinks] = useState<boolean>(false);

    const { t } = useTranslation('navbar');

    const hide = () => {
        setShowMobileLinks(false);
    }

    return (
        <nav>
            <div className={styles.hamburgerDiv} onClick={() => setShowMobileLinks(show => !show)}>
                <img src={hamburger} alt="hamburger-menu" />
            </div>

            <ul className={styles.linkList}>
                <li><Link onClick={hide} className={`${styles.link} ${showMobileLinks ? styles.display : null}`}
                    to="/">{t('home')}</Link></li>
                <li><Link onClick={hide} className={`${styles.link} ${showMobileLinks ? styles.display : null}`}
                    to="/import">{t('import')}</Link></li>
                <li><Link onClick={hide} className={`${styles.link} ${showMobileLinks ? styles.display : null}`}
                    to="/simulation" state={{ actionType: 'load', data: "storage" }}>{t('simulation')}</Link></li>
                <li><Link onClick={hide} className={`${styles.link} ${showMobileLinks ? styles.display : null}`}
                    to="/contact">{t('contact')}</Link></li>
                <li><Link onClick={hide} className={`${styles.link} ${showMobileLinks ? styles.display : null}`}
                    to="/about">{t('about')}</Link></li>
            </ul>


        </nav>
    )
} 