import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import hamburger from "../assets/images/hamburgerMenu.svg"

import styles from './Navbar.module.scss';

export default function Navbar() {

    const { t } = useTranslation('navbar');

    return (
        <nav>
            <div className={styles.hamburgerDiv}>
                <img src={hamburger} alt="hamburger-menu" />
            </div>
            <ul>
                <li><Link className={styles.link} to="/">{t('home')}</Link></li>
                <li><Link to="/import">{t('import')}</Link></li>
                <li><Link to="/simulation" state={{ actionType: 'load', data: "storage" }}>{t('simulation')}</Link></li>
                <li><Link to="/contact">{t('contact')}</Link></li>
                <li><Link to="/about">{t('about')}</Link></li>
            </ul>
        </nav>
    )
}