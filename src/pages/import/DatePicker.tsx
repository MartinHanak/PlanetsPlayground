import { ChangeEvent, ReactElement, useEffect, useState, useRef, EventHandler, MouseEventHandler, MouseEvent, Dispatch, SetStateAction } from "react";

import styles from './Import.module.scss';

interface datePickerInterface {
    id: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const msPerDay = 24 * 60 * 60 * 1000;

const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

export default function DatePicker({ id, value, setValue, onChange }: datePickerInterface) {

    const [displayCalendar, setDisplayCalendar] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [tableRows, setTableRows] = useState<ReactElement[][]>([])

    const handleTableDataClick: MouseEventHandler<HTMLTableElement> = (event: MouseEvent) => {
        if (event.target instanceof HTMLTableCellElement) {

            const selectedYear = selectedDate.getFullYear()
            const selectedDay = Number(event.target.textContent)

            let selectedMonth = selectedDate.getMonth();

            if (event.target.classList.contains(styles.previousMonth)) {
                selectedMonth -= 1;
            } else if (event.target.classList.contains(styles.nextMonth)) {
                selectedMonth += 1;
            }

            const newSelectedDate = new Date(selectedYear, selectedMonth, selectedDay)

            setSelectedDate(newSelectedDate)
            setValue(`${newSelectedDate.getDate()}/${newSelectedDate.getMonth() + 1}/${newSelectedDate.getFullYear()}`)
        }
    }

    const shiftCurrentlySelectedDate = (e: MouseEvent, timeShiftMs: number) => {
        e.preventDefault();
        const shiftedDate = new Date(selectedDate.getTime() + timeShiftMs);
        setSelectedDate(shiftedDate)
        setValue(`${shiftedDate.getDate()}/${shiftedDate.getMonth() + 1}/${shiftedDate.getFullYear()}`)
    }

    useEffect(() => {
        // trick = using 0th day in the next month
        const numberOfDaysInCurrentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

        const firstDayOfMonthDate = new Date(selectedDate.getTime() - (selectedDate.getDate() - 1) * msPerDay);
        const lastDayOfMonthDate = new Date(selectedDate.getTime() + (numberOfDaysInCurrentMonth - selectedDate.getDate()) * msPerDay);

        const firstRowDayOffset = getDayWeekOrder(firstDayOfMonthDate);
        const lastRowDayOffset = getDayWeekOrder(lastDayOfMonthDate);

        // number of rows
        const numberOfRows = Math.ceil((numberOfDaysInCurrentMonth + firstRowDayOffset + (7 - 1 - lastRowDayOffset)) / 7);

        const newTableRows: ReactElement[][] = [];
        for (let row = 0; row < numberOfRows; row++) {
            newTableRows[row] = [];
        }
        for (let row = 0; row < numberOfRows; row++) {
            for (let col = 0; col < 7; col++) {
                let tableDataDate: Date;
                let tableDataClassName = ''
                // different first and last rows
                // fist row
                if (row === 0) {
                    if (col < firstRowDayOffset) {
                        tableDataDate = new Date(firstDayOfMonthDate.getTime() - (firstRowDayOffset - col) * msPerDay);
                        tableDataClassName = styles.previousMonth;
                    } else {
                        tableDataDate = new Date(firstDayOfMonthDate.getTime() + (col - firstRowDayOffset) * msPerDay);
                        tableDataClassName = styles.currentMonth;
                    }

                    // last row
                } else if (row === (numberOfRows - 1)) {
                    if (col <= lastRowDayOffset) {
                        tableDataDate = new Date(lastDayOfMonthDate.getTime() - (lastRowDayOffset - col) * msPerDay);
                        tableDataClassName = styles.currentMonth;
                    } else {
                        tableDataDate = new Date(lastDayOfMonthDate.getTime() + (col - lastRowDayOffset) * msPerDay);
                        tableDataClassName = styles.nextMonth;
                    }

                    // middle rows
                } else {
                    tableDataClassName = styles.currentMonth;
                    tableDataDate = new Date(firstDayOfMonthDate.getTime() // 1st day of the month
                        + (7 - firstRowDayOffset) * msPerDay  // 1st row offset
                        + (row - 1) * 7 * msPerDay // all rows except the 1st one
                        + col * msPerDay); // offset on the current row
                }


                newTableRows[row].push(
                    <td key={`row${row}_col${col}`} className={tableDataClassName}>
                        {tableDataDate.getDate()}
                    </td>)

            }
        }

        setTableRows(newTableRows)


    }, [displayCalendar, selectedDate])


    return (
        <>
            <input id={id} name={id} type="text" value={value} placeholder="dd/mm/yyyy"
                onChange={onChange}
                onFocus={() => setDisplayCalendar(true)}
            />
            {displayCalendar ?
                <div>
                    <div>
                        <button onClick={(e) => shiftCurrentlySelectedDate(e, -msPerYear)}>yb</button>
                        <button onClick={(e) => shiftCurrentlySelectedDate(e, -msPerMonth)}>mb</button>
                        <span>{monthNames[selectedDate.getMonth()]}</span>
                        <button onClick={(e) => shiftCurrentlySelectedDate(e, +msPerMonth)}>mf</button>
                        <button onClick={(e) => shiftCurrentlySelectedDate(e, +msPerYear)}>yf</button>
                    </div>
                    <table className={styles.datePickerTable} onClick={handleTableDataClick}>
                        <thead>
                            <tr>
                                {dayNames.map((day: string) => <th key={day}>{day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.length > 0 ? tableRows.map((row: ReactElement[], index: number) => {
                                return <tr key={`row${index}`}>{row}</tr>
                            }) : null}
                        </tbody>
                    </table>

                    <button onClick={() => setDisplayCalendar(false)}>Confirm</button>
                    <button onClick={() => setDisplayCalendar(false)}>Cancel</button>
                </div> : null}
        </>
    )
}


function getDayWeekOrder(inputDate: Date) {
    const order = inputDate.getDay() === 0 ? 6 : inputDate.getDay() - 1;
    return order;
}