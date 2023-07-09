import Image from "next/image";
import { NextSeo } from "next-seo";
import TextContainer from "../../components/TextContainer";
import FadeInDiv from "../../components/FadeInDiv";
import styles from "../../styles/modules/OurStory.module.scss";

export default function OurShows() {
    return (
        <>
            <NextSeo
                title='Our Story | SnazzyStones'
                description="Learn a bit more about us and what we're doing"
                canonical='https://snazzystones.ca/our-story'
                openGraph={{
                    url: "https://snazzystones.ca/our-story",
                    title: "Our Story | SnazzyStones",
                    description: "Learn a bit more about us and what we're doing",
                    images: [
                        {
                            url: "/images/briPresentingBooth_2019-07-25.jpg",
                            width: 768,
                            height: 768,
                            alt: "Brianna presenting some trays of jewellery",
                            type: "image/jpeg",
                        },
                    ],
                    site_name: "SnazzyStones",
                }}
                twitter={{
                    cardType: "summary",
                }}
            />
            <header className={`heroSectionHeader`}>
                <div className={`heroSection ${styles.heroBackground}`}></div>
                <div>
                    <h1 className='heroTitle text-white overlayText'>Our Story</h1>
                </div>
            </header>
            <div className='bg-white py-20 px-10 w-full'>
                <TextContainer>
                    <p className='text-blueyonder-500'>
                        Snazzy Stones is a small home based business that specialises in high quality, handcrafted
                        jewellery made with sterling silver and natural gemstones.
                    </p>
                </TextContainer>
            </div>

            <div className='px-10 md:px-40 py-20 bg-blueyonder-500 grid md:grid-cols-2 items-center gap-20'>
                <FadeInDiv from='left' className='text-white'>
                    <p className='leading-loose'>
                        A passion for rocks and minerals led me to study geology at Queen’s University, and later
                        gemmology at the Gemmological Association of Great Britain (Gem-A) . That, combined with a love
                        of travel brought me to Snazzy Stones.
                    </p>
                    <p className='leading-loose'>
                        I travel to Mexico, Bali, and Poland where I get to personally meet local artisans and handpick
                        the jewellery that makes up Snazzy Stones. That way I can assure that all my items are of high
                        quality with beautiful stones.
                    </p>
                </FadeInDiv>
                <FadeInDiv from='right' className='flex rounded-md max-w-max shadow-light'>
                    <Image
                        src='/images/briPresentingBooth_2019-07-25.jpg'
                        width={768}
                        height={768}
                        objectFit='cover'
                        className='rounded-md'
                        alt='Snazzy Stones owner Brianna presenting her market booth'
                    />
                </FadeInDiv>
            </div>
            <div className='px-10 md:px-40 py-20 bg-white grid md:grid-cols-2 items-center gap-20'>
                <FadeInDiv from='left' className='flex rounded-md max-w-max shadow-light'>
                    <Image
                        src='/images/beadsDisplay.jpg'
                        width={768}
                        height={768}
                        objectFit='cover'
                        className='rounded-md'
                        alt='A display of beaded bracelets and other jewelry'
                    />
                </FadeInDiv>
                <FadeInDiv from='right' className='text-blueyonder-500'>
                    <p className='leading-loose'>
                        The main venues you can find us at are festivals, markets, home parties and fundraising events.
                        We are also beginning the exciting additions of our online and wholesale operations now. If you
                        have any questions or comments we would be happy to hear from you.
                    </p>
                </FadeInDiv>
            </div>
        </>
    );
}
