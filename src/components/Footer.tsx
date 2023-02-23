interface footerInterface {
    className?: string
}

export default function Footer({ className }: footerInterface) {
    return (
        <footer className={className}>
            <span>Made by Martin Hanák</span>
        </footer>
    )
}