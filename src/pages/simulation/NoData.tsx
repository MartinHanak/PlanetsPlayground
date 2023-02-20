import { useNavigate } from "react-router-dom"



export default function NoData() {

    const navigate = useNavigate()


    return (
        <div>
            <h1>No data found</h1>
            <p>Do you wish to import new data or load default values?</p>

            <button onClick={() => { navigate('/import') }}>Import New</button>
            <button onClick={() => { navigate('/simulation', { state: { actionType: "load", data: "default" } }) }}>Load Default</button>
        </div>
    )
}