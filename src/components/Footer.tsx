import { useTranslation } from "react-i18next";

interface footerInterface {
    className?: string
}

export default function Footer({ className }: footerInterface) {

    const { t } = useTranslation('footer');


    return (
        <footer className={className}>
            <span>{t('author')}</span>
        </footer>
    )
}