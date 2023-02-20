import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './Navbar.module.scss';

export default function Navbar() {

    const { t } = useTranslation('navbar');

    return (
        <nav>
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