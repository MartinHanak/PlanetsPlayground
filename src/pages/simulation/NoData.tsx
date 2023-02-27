import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"



export default function NoData() {

    const navigate = useNavigate();

    const { t } = useTranslation('nodata');


    return (
        <div className="desktopMaxWidth">
            <h1>{t('title')}</h1>
            <p>{t('underTitle')}</p>

            <button onClick={() => { navigate('/import') }}>{t('newButton')}</button>
            <button onClick={() => { navigate('/simulation', { state: { actionType: "load", data: "default" } }) }}>{t('defaultButton')}</button>
        </div>
    )
}