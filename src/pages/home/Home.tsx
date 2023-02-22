import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import Picture from "../../components/Picture";

import astronaut from '../../assets/astronaut_transparent.webp';
import astronautSmall from '../../assets/astronaut-small.webp';

import styles from './Home.module.scss'

export default function Home() {

    const { t } = useTranslation('home');

    return (
        <div>
            <div className={styles.intro}>
                <Picture desktopSource={astronaut} mobileSource={astronautSmall} alt="Astronaut picture" />
                <h1>Explore planets dynamics</h1>
                <p>Embark on a journey to explore motion of orbital bodies under unusual circumstances.</p>
                <Link to="/import">Start exploring</Link>
            </div>

            <div className="info-left">
                <h2>Ever wondered what would happen...</h2>
                <p>If the Sun disappeared? What if there were two Suns instead? What if the Earth suddenly stopped orbiting around the Sun? All of these questions and more can be answered by playing around with this simulation that accurately describes the orbital mechanics.</p>
            </div>

            <div className="info-right">
                <h2>NASA data</h2>
                <p> We cannot start the simulation if we do not know where the planets are, how far they are from each other and how fast they move. To get all of this simulation we can make use of NASA data provided by the Jet Propulsion Laboratory Horizons API. Once we have the initial coordinates and velocities, we can finally start the simulation. </p>
            </div>

            <div className="info-left">
                <h2>Guaranteed precision</h2>
                <p> Newton‘s equations of motion are solved by employing the Velocity Verlet integrator.
                    Complicated differential equations describing the N-body problem are thus approximated
                    using a finite timestep. Every timestep involves calculating forces between all of the N bodies
                    in the simulation and updating their position and velocity. </p>
            </div>
        </div>
    )
}