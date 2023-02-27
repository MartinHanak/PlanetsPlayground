import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import Picture from "../../components/Picture";
import Footer from "../../components/Footer";

import astronaut from '../../assets/astronaut_transparent.webp';
import astronautSmall from '../../assets/astronaut-small.webp';

import sun from '../../assets/images/sun_large.png'
import sunSmall from '../../assets/images/sun_small.png'

import verlet from '../../assets/images/verlet_large.png'
import verletSmall from '../../assets/images/verlet_small.png'

import nasa from '../../assets/images/nasa_large.png'
import nasaSmall from '../../assets/images/nasa_small.png'


import styles from './Home.module.scss'

export default function Home() {

    const { t } = useTranslation('home');

    return (
        <div>
            <div className={styles.intro}>
                <div className={`${styles.infoRight} desktopMaxWidth`}>
                    <Picture className={styles.introPicture} desktopSource={astronaut} mobileSource={astronautSmall} alt="Astronaut picture" />
                    <div className="horizontalCenter">
                        <h1>{t('title')}</h1>
                        <p>{t('underTitle')}</p>
                        <Link to="/import" className={styles.introLinkButton}>{t('startButton')}</Link>
                    </div>
                </div>
            </div>

            <div className="desktopMaxWidth">
                <div className={styles.info}>
                    <Picture desktopSource={sun} mobileSource={sunSmall} alt="Smiling Sun" />
                    <div>
                        <h2>{t('firstParTitle')}</h2>
                        <p>{t('firstParContent')}</p>
                    </div>
                </div>

                <div className={styles.info}>
                    <div>
                        <h2>{t('secondParTitle')}</h2>
                        <p>{t('secondParContent')}</p>
                    </div>
                    <Picture desktopSource={nasa} mobileSource={nasaSmall} alt="NASA logo" />
                </div>

                <div className={styles.info}>

                    <Picture desktopSource={verlet} mobileSource={verletSmall} alt="Velocity Verlet equations" />
                    <div>
                        <h2>{t('thirdParTitle')}</h2>
                        <p>{t('thirdParContent')}</p>
                    </div>
                </div>
            </div>


            <Footer className={styles.footer} />
        </div>
    )
}