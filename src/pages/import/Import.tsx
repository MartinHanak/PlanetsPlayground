import { ChangeEvent, FormEvent, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
import { AnimationEvent } from "react";

import styles from './Import.module.scss';
import { useTranslation } from "react-i18next";


export const inputRegExp = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;


export default function Import() {

    const { t, i18n } = useTranslation('import')

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
                {/*
                <input id="date" type="text" value={inputValue} placeholder="dd/mm/yyyy" autoComplete="off"
                    className={styles.dateInput}
                    onChange={(e) => setInputValue(e.target.value)} /><br />
                */}
                <button type="submit" className={styles.submitButton}>{t('startButton')}</button>
            </form>

        </div>
    )
}