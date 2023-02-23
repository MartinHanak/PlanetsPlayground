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
                        <h1>Explore planets dynamics</h1>
                        <p>Embark on a journey to explore motion of orbital bodies under unusual circumstances.</p>
                        <Link to="/import" className={styles.introLinkButton}>Start exploring</Link>
                    </div>
                </div>
            </div>

            <div className="desktopMaxWidth">
                <div className={styles.info}>
                    <Picture desktopSource={sun} mobileSource={sunSmall} alt="Smiling Sun" />
                    <div>
                        <h2>Ever wondered what would happen...</h2>
                        <p>If the Sun disappeared? What if there were two Suns instead? What if the Earth suddenly stopped orbiting around the Sun? All of these questions and more can be answered by playing around with this simulation that accurately describes the orbital mechanics.</p>
                    </div>
                </div>

                <div className={styles.info}>
                    <div>
                        <h2>NASA data</h2>
                        <p> We cannot start the simulation if we do not know where the planets are, how far they are from each other and how fast they move. To get all of this simulation we can make use of NASA data provided by the Jet Propulsion Laboratory Horizons API. Once we have the initial coordinates and velocities, we can finally start the simulation. </p>
                    </div>
                    <Picture desktopSource={nasa} mobileSource={nasaSmall} alt="NASA logo" />
                </div>

                <div className={styles.info}>

                    <Picture desktopSource={verlet} mobileSource={verletSmall} alt="Velocity Verlet equations" />
                    <div>
                        <h2>Guaranteed precision</h2>
                        <p> Newton‘s equations of motion are solved by employing the Velocity Verlet integrator.
                            Complicated differential equations describing the N-body problem are thus approximated
                            using a finite timestep. Every timestep involves calculating forces between all of the N bodies
                            in the simulation and updating their position and velocity. </p>
                    </div>
                </div>
            </div>


            <Footer className={styles.footer} />
        </div>
    )
}