import { useTranslation } from "react-i18next"

export default function Contact() {

    const { t } = useTranslation('contact')

    return (
        <div className="desktopMaxWidth">
            <h1>{t('title')}</h1>
            <p>{t('underTitle')}  </p>

            <div>
                <div>
                    <span>{t('nameTitle')}:</span> <span>Martin Hanák</span>
                </div>
                <div>
                    <span>Email:</span> <span>martinhanak97@gmail.com</span>
                </div>
                <div>
                    <span>Github:</span> <span><a href="https://github.com/MartinHanak/PlanetsPlayground">/PlanetsPlayground</a></span>
                </div>
            </div>
        </div>
    )
}