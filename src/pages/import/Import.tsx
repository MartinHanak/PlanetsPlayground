import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";

import styles from './Import.module.scss';


export const inputRegExp = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;


export default function Import() {

    const currentDate = new Date();


    const [errorMessage, setErrorMessage] = useState('');
    const [inputValue, setInputValue] = useState(`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);

    const navigate = useNavigate();

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
            result = "Input field cannot be empty";
            return result;
        } else {
            const trimmedInput = input.trim();

            if (!isCorrectFormat(trimmedInput)) {
                result = "Input is not in the correct format dd/mm/yyyy"
            } else if (!isCorrectRange(trimmedInput)) {
                result = "Input values are outside range for days 1-31 or months 1-12"
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
            <form onSubmit={handleSubmit} className="centerColumn">
                {errorMessage && <p>{errorMessage}</p>}

                <label htmlFor="date">Choose when to start the simulation:</label><br />

                <DatePicker id="date" value={inputValue} setValue={setInputValue}
                    validateInput={validateInput}
                    setErrorMessage={setErrorMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} /> <br />
                {/*
                <input id="date" type="text" value={inputValue} placeholder="dd/mm/yyyy" autoComplete="off"
                    className={styles.dateInput}
                    onChange={(e) => setInputValue(e.target.value)} /><br />
                */}
                <button type="submit">Start Simulation</button>
            </form>

        </div>
    )
}