import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import Picture from "../../components/Picture";
import Footer from "../../components/Footer";

import astronaut from '../../assets/astronaut_transparent.webp';
import astronautCropped from '../../assets/images/astronaut_transparent_cropped_3.png';

import sun from '../../assets/images/sun_large.png'
import sunSmall from '../../assets/images/sun_small_3.png'

import verlet from '../../assets/images/verlet_large.png'
import verletSmall from '../../assets/images/verlet_small.png'

import nasa from '../../assets/images/nasa_large_cropped.png'
import nasaSmall from '../../assets/images/nasa_small_2.png'


import styles from './Home.module.scss'

export default function Home() {

    const { t } = useTranslation('home');

    return (
        <div className={styles.home}>
            <div className={styles.intro}>
                <div className={`${styles.introContainer} desktopMaxWidth`}>
                    <Picture className={styles.introPicture} desktopSource={astronaut} mobileSource={astronautCropped} alt="Astronaut picture" />
                    <div className={`${styles.introText} horizontalCenter`}>
                        <h1>{t('title')}</h1>
                        <p>{t('underTitle')}</p>
                        <Link to="/import" className={styles.introLinkButton}>{t('startButton')}</Link>
                    </div>
                </div>
            </div>

            <div className="desktopMaxWidth">
                <div className={styles.info}>
                    <Picture desktopSource={sunSmall} mobileSource={sunSmall} alt="Smiling Sun" />
                    <div>
                        <h2>{t('firstParTitle')}</h2>
                        <p>{t('firstParContent')}</p>
                    </div>
                </div>

                <div className={`${styles.info} ${styles.infoLeft} `}>
                    <Picture desktopSource={nasa} mobileSource={nasaSmall} alt="NASA logo" />
                    <div>
                        <h2>{t('secondParTitle')}</h2>
                        <p>{t('secondParContent')}</p>
                    </div>
                </div>

                <div className={styles.info}>

                    <Picture desktopSource={verlet} mobileSource={verlet} alt="Velocity Verlet equations" />
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