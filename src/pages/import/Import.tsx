import { FormEvent, useState } from "react";

export default function Import() {

    const [errorMessage, setErrorMessage] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const potentialError = validateInput(inputValue);
        if (potentialError !== '') {
            setErrorMessage(potentialError)
        } else {
            console.log("submit")
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
        const inputRegExp = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;

        result = inputRegExp.test(input);

        return result
    }

    const isCorrectRange = (input: string): boolean => {
        let result = false;
        const inputRegExp = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/;

        const [inputMatch, dayMatch, monthMatch, yearMatch] = input.match(inputRegExp) as RegExpMatchArray;
        if (Number(dayMatch) > 0 && Number(dayMatch) < 32 && Number(monthMatch) > 0 && Number(monthMatch) < 13) {
            result = true;
        }

        return result;
    }

    return (
        <>
            <h1>Import</h1>
            {errorMessage && <p>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>

                <label htmlFor="date">Choose when to start the simulation:</label><br />
                <input id="date" type="text" value={inputValue} placeholder="dd/mm/yyyy" onChange={(e) => setInputValue(e.target.value)} /><br />

                <button type="submit">Start Simulation</button>
            </form>

        </>
    )
}