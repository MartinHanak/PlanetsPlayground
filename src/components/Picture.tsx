interface pictureProps {
    mobileSource: string,
    desktopSource: string,
    alt: string
}

export default function Picture({ mobileSource, desktopSource, alt }: pictureProps) {

    return (
        <picture>
            <source media="(max-width: 800px)" srcSet={mobileSource} />
            <source media="(min-width: 800px)" srcSet={desktopSource} />
            <img src={desktopSource} alt={alt} />
        </picture>
    )
}