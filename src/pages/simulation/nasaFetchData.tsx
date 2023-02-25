import { json } from "stream/consumers";

// time in format getTime(): returns the number of milliseconds since January 1, 1970 00:00:00.
export default async function nasaFetchData(time: number) {

    const massObjectNames = ["Sun", "Mercury", "Venus", "Earth", "Mars"];

    const responseArray = [];

    for (const name of massObjectNames) {
        const responsePromise = createFetchPromise(name, time);

        // add delay between fetch requests
        // API returns 503 if too many requests at once
        const ms = 200;
        await (new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, ms)))

        responseArray.push(responsePromise);
    }

    return Promise.all(responseArray);

}

function createFetchPromise(name: string, time: number) {
    console.log(generateApiUrl(name, time))
    return fetch('http://206.189.55.241:5000/nasaAPI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: generateApiUrl(name, time) })
    });
}


function generateApiUrl(name: string, time: number) {
    const baseUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?`;

    // JS months start at 0, to 11
    const startTime = new Date(time);
    const finalTime = new Date(startTime.getTime() + 86400000); // day later

    // getMonth() return 0 to 11
    const startTimeString = `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`;
    const finalTimeString = `${finalTime.getFullYear()}-${finalTime.getMonth() + 1}-${finalTime.getDate()}`;

    const parametersObject = {
        //api_key: apiKey,
        // Parameters info: https://ssd-api.jpl.nasa.gov/doc/horizons.html#ephem_type
        // Common Parameters
        //format: 'text', default = json
        COMMAND: assignIdFromName(name),
        OBJ_DATA: 'YES',
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'VECTORS',
        EMAIL_ADDR: 'none',
        // Ephemeris-Specific Parameters
        CENTER: '@0',
        REF_PLANE: 'ECLIPTIC',
        COORD_TYPE: 'GEODETIC',
        START_TIME: startTimeString,
        STOP_TIME: finalTimeString,
        STEP_SIZE: '2 d',
        REF_SYSTEM: 'ICRF',
        OUT_UNITS: 'KM-S',
        VEC_TABLE: '3',
        VEC_CORR: 'NONE',
        TIME_DIGITS: 'MINUTES',
        CSV_FORMAT: 'NO',
        VEC_LABELS: 'YES',
    }

    const finalUrl =
        baseUrl
            .concat(...Object.entries(parametersObject)
                .map(([key, value]) => `${key}='${encodeURIComponent(value)}'&`))
            .slice(0, -1);

    return finalUrl;

}

type nameDictionary = { [name: string]: number }



// convert names to API planet IDs 
function assignIdFromName(name: string) {
    let id = -1;

    const nameObject: nameDictionary = {
        // planets and the Sun
        Sun: 10,
        Mercury: 199,
        Venus: 299,
        Earth: 399,
        Mars: 499,
        Jupiter: 599,
        Saturn: 699,
        Uranus: 799,
        Neptune: 899,
        Pluto: 999,
    }

    if (name in nameObject) {
        id = nameObject[name];
    }


    return id.toString();
}