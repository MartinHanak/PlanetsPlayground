import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import styles from './Loading.module.scss'

export default function Loading() {

    const { t } = useTranslation('loading');

    const [displayDefault, setDisplayDefault] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setDisplayDefault(true);
        }, 5000);


        return () => clearTimeout(timeoutID);
    }, [])

    return (
        <div className={styles.loadingContainer}>
            <div className={styles.svgContainer}>
                {/*<?xml version="1.0" encoding="iso-8859-1"?>*/}
                {/*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/}
                <svg className={styles.svgImage} fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="-50 -50 612 612" xmlSpace="preserve">
                    <g>
                        <g>
                            {/*<!-- Sun --> */}
                            <path className={styles.Sun} d="M310.468,247.831h-3.375c-1.304-8.182-4.535-15.725-9.208-22.16l2.406-2.406c3.191-3.192,3.191-8.364,0-11.555
			c-3.191-3.19-8.364-3.19-11.554,0l-2.407,2.407c-6.435-4.673-13.979-7.904-22.16-9.208v-3.377c0-4.513-3.658-8.17-8.17-8.17
			c-4.512,0-8.17,3.657-8.17,8.17v3.375c-8.182,1.304-15.725,4.536-22.16,9.208l-2.407-2.408c-3.191-3.19-8.364-3.19-11.554,0
			c-3.191,3.192-3.191,8.364,0,11.555l2.406,2.406c-4.673,6.435-7.904,13.979-9.208,22.16h-3.375c-4.512,0-8.17,3.657-8.17,8.17
			c0,4.513,3.658,8.17,8.17,8.17h3.375c1.304,8.182,4.535,15.725,9.208,22.16l-2.406,2.406c-3.191,3.192-3.191,8.364,0,11.555
			c1.595,1.595,3.686,2.392,5.777,2.392c2.09,0,4.182-0.797,5.777-2.392l2.407-2.408c6.435,4.673,13.979,7.904,22.16,9.208v3.377
			c0,4.513,3.658,8.17,8.17,8.17c4.512,0,8.17-3.657,8.17-8.17v-3.375c8.182-1.304,15.725-4.536,22.16-9.208l2.407,2.407
			c1.595,1.595,3.686,2.392,5.777,2.392s4.182-0.797,5.777-2.392c3.191-3.192,3.191-8.364,0-11.555l-2.406-2.406
			c4.673-6.435,7.904-13.979,9.208-22.16h3.375c4.512,0,8.17-3.657,8.17-8.17C318.638,251.488,314.98,247.831,310.468,247.831z
			 M256,291.404c-19.521,0-35.404-15.882-35.404-35.404s15.883-35.404,35.404-35.404s35.404,15.882,35.404,35.404
			S275.521,291.404,256,291.404z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="471.149" cy="256" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="61.505" cy="450.495" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="450.495" cy="61.505" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="408.129" cy="408.129" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="103.871" cy="408.129" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <circle cx="394.382" cy="198.678" r="8.17" />
                        </g>
                    </g>
                    <g>
                        <g>
                            {/*<!-- 3rd planet -->*/}
                            <path className={`${styles.thirdPlanet} ${styles.allPlanets}`} d="M437.019,74.981C388.667,26.628,324.38,0,256,0c-54.499,0-106.231,16.793-150.075,48.615
			c-6.943-5.448-15.678-8.708-25.166-8.708c-22.526,0-40.851,18.325-40.851,40.851c0,22.526,18.325,40.851,40.851,40.851
			s40.851-18.325,40.851-40.851c0-7.123-1.837-13.824-5.056-19.662C157.37,31.796,205.411,16.34,256,16.34
			c132.149,0,239.66,107.51,239.66,239.66S388.149,495.66,256,495.66S16.34,388.149,16.34,256c0-41.906,10.992-83.16,31.789-119.304
			c2.25-3.911,0.904-8.906-3.008-11.156c-3.911-2.25-8.906-0.905-11.156,3.008C11.744,167.167,0,211.239,0,256
			c0,68.38,26.628,132.667,74.981,181.019C123.333,485.372,187.62,512,256,512s132.667-26.628,181.019-74.981
			C485.372,388.667,512,324.38,512,256S485.372,123.333,437.019,74.981z M80.758,105.268c-13.516,0-24.511-10.996-24.511-24.511
			c0-13.515,10.995-24.511,24.511-24.511c13.516,0,24.511,10.996,24.511,24.511C105.268,94.272,94.273,105.268,80.758,105.268z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            {/*<!-- 2nd planet -->*/}
                            <path className={`${styles.secondPlanet} ${styles.allPlanets}`} d="M256,65.362c-45.96,0-90.353,16.586-125,46.701c-32.58,28.319-54.561,66.776-62.402,108.884
			c-17.193,2.41-30.471,17.205-30.471,35.053c0,19.522,15.883,35.404,35.404,35.404s35.404-15.882,35.404-35.404
			c0-15.534-10.06-28.754-24.004-33.51C100.71,141.706,172.922,81.702,256,81.702c96.108,0,174.298,78.189,174.298,174.298
			S352.108,430.298,256,430.298c-74.542,0-140.828-47.357-164.947-117.841c-1.461-4.271-6.106-6.55-10.375-5.085
			c-4.269,1.461-6.546,6.105-5.085,10.374C101.972,394.84,174.472,446.638,256,446.638c105.118,0,190.638-85.52,190.638-190.638
			S361.118,65.362,256,65.362z M92.596,256c0,10.511-8.553,19.064-19.064,19.064S54.468,266.511,54.468,256
			c0-10.511,8.553-19.064,19.064-19.064S92.596,245.489,92.596,256z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            {/*<!-- 1st planet --> */}
                            <path className={`${styles.firstPlanet} ${styles.allPlanets}`} d="M285.597,134.256c-2.235-14.324-14.655-25.32-29.597-25.32c-16.519,0-29.957,13.439-29.957,29.957
			s13.438,29.957,29.957,29.957c12.361,0,22.996-7.526,27.567-18.237c47.571,12.372,81.369,55.527,81.369,105.386
			c0,60.068-48.869,108.936-108.936,108.936c-60.067,0-108.936-48.868-108.936-108.936c0-41.223,22.866-78.448,59.673-97.15
			c4.023-2.044,5.627-6.962,3.583-10.985c-2.044-4.022-6.961-5.625-10.985-3.583c-42.321,21.504-68.611,64.312-68.611,111.718
			c0,69.078,56.199,125.277,125.277,125.277S381.277,325.078,381.277,256C381.277,197.933,341.417,147.749,285.597,134.256z
			 M256,152.511c-7.509,0-13.617-6.108-13.617-13.617s6.108-13.617,13.617-13.617c7.509,0,13.617,6.108,13.617,13.617
			S263.509,152.511,256,152.511z"/>
                        </g>
                    </g>
                </svg>
            </div>
            <h1 className={styles.loading}>{t('loading')}...</h1>
            {displayDefault ?
                <div>
                    <p className={styles.waiting}>{t('waiting')}</p>
                    <button onClick={
                        () => { navigate('/nodata') }}>
                        {t('default')}
                    </button>
                </div> : null}
        </div>
    )
}