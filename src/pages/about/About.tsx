export default function About() {
    return (
        <div>
            <h1>About</h1>
            <p>
                Planets Playground is an online simulation of our solar system dynamics.
            </p>
            <p>
                It solves equations of motion for all the planets in real time inside your browser. In order to achieve this, a finite time step is chosen. Time is thus divided into discrete steps and the motion is approximated for each one of them.
            </p>

            <p>
                Timestep should always be chosen by the fastest motion in your system. If you set too big of a timestep, the approximation for the motion will be worse and you will get wrong results. If you observe fast-moving objects in your simulation, consider decreasing the timestep value.
            </p>

            <p>
                This simulation was built using React for the core website and React Three Fiber for the 3D implementation. The main calculation is done inside Fiber&apos;s useFrame hook that executes its code approximately 60 times per second. The algorithm for solving the equations of motion was chosen to be the Verlet&apos;s Velocity algorithm. It provides a good compromise between speed and accuracy.
            </p>
        </div>
    )
}