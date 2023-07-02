import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";

import styles from './Import.module.scss';
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../utils/config";


export const inputRegExp = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;


export default function Import() {

    const { t } = useTranslation('import')

    const currentDate = new Date();

    const [errorMessage, setErrorMessage] = useState('');
    const [inputValue, setInputValue] = useState(`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);

    const navigate = useNavigate();

    // used for CSS animation for errors in and out
    const errorPlaceholderRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (errorMessage !== '') {
            errorPlaceholderRef.current?.classList.add('error');
        } else {
            errorPlaceholderRef.current?.classList.remove('error');
        }
    }, [errorMessage])

    // first request
    useEffect(() => {
        const nasaAPIUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api?COMMAND=%2710%27&OBJ_DATA=%27YES%27&MAKE_EPHEM=%27YES%27&EPHEM_TYPE=%27VECTORS%27&EMAIL_ADDR=%27none%27&CENTER=%27%400%27&REF_PLANE=%27ECLIPTIC%27&COORD_TYPE=%27GEODETIC%27&START_TIME=%272023-3-16%27&STOP_TIME=%272023-3-17%27&STEP_SIZE=%272%20d%27&REF_SYSTEM=%27ICRF%27&OUT_UNITS=%27KM-S%27&VEC_TABLE=%273%27&VEC_CORR=%27NONE%27&TIME_DIGITS=%27MINUTES%27&CSV_FORMAT=%27NO%27&VEC_LABELS=%27YES';

        const gravitoriumBackendURL = BACKEND_URL + '?url=' + encodeURIComponent(nasaAPIUrl);

        fetch(gravitoriumBackendURL)
            .then((res: Response) => {
                if (res.ok) {
                    console.log("Backend connection is ok.")
                } else {
                    throw new Error('Backend connection failed at import.')
                }
            })
            .catch((error: unknown) => console.log(error));
    }, [])


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const potentialError = validateInput(inputValue);
        if (potentialError !== '') {
            setErrorMessage(potentialError)
        } else {
            console.log("submit")
            navigate('/simulation', {
                state: {
                    actionType: 'import',
                    date: getMillisecondsDateFromInputValue(inputValue)
                }
            })
        }
    }


    const validateInput = (input: string | null): string => {

        let result = '';

        if (!input) {
            result = t('errors.empty');
            return result;
        } else {
            const trimmedInput = input.trim();

            if (!isCorrectFormat(trimmedInput)) {
                result = t('errors.format')
            } else if (!isCorrectRange(trimmedInput)) {
                result = t('errors.range')
            }
        }


        return result;
    }

    const isCorrectFormat = (input: string): boolean => {
        let result = false;

        result = inputRegExp.test(input);

        return result
    }

    const isCorrectRange = (input: string): boolean => {
        let result = false;

        const [inputMatch, dayMatch, monthMatch, yearMatch] = input.match(inputRegExp) as RegExpMatchArray;
        if (Number(dayMatch) > 0 && Number(dayMatch) < 32 && Number(monthMatch) > 0 && Number(monthMatch) < 13) {
            result = true;
        }

        return result;
    }

    const getMillisecondsDateFromInputValue = (inputValue: string): number => {
        const [inputMatch, dayMatch, monthMatch, yearMatch] = inputValue.match(inputRegExp) as RegExpMatchArray;

        const dateObject = new Date(Number(yearMatch), Number(monthMatch) - 1, Number(dayMatch))

        return dateObject.getTime()
    }


    return (
        <div className="desktopMaxWidth centerColumn">
            <form onSubmit={handleSubmit} className={`${styles.form} centerColumn`}>

                <label htmlFor="date"><h3>{t('legend')}</h3></label><br />
                <p ref={errorPlaceholderRef} className={`errorPlaceholder`} >
                    {errorMessage !== '' ? errorMessage : null}
                </p>

                <DatePicker id="date" value={inputValue} setValue={setInputValue}
                    validateInput={validateInput}
                    setErrorMessage={setErrorMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} /> <br />

                <button type="submit" className={styles.submitButton}>{t('startButton')}</button>
            </form>

        </div>
    )
}