import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TextContainer from "../../components/TextContainer";
import styles from "../../styles/modules/OurStory.module.scss";

const variants = {
    in: {
        x: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    outRight: {
        x: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
    outLeft: {
        x: -50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

const MotionDiv = ({ children, fromDirection, className }) => {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0.5,
        triggerOnce: true,
    });
    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial={fromDirection === "left" ? "outLeft" : "outRight"}
            animate={inView ? "in" : fromDirection === "left" ? "outLeft" : "outRight"}
            transition={{ duration: 300 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function OurShows() {
    return (
        <>
            <header className={`heroSection ${styles.heroBackground}`}>
                <div>
                    <h1 className='heroTitle text-white overlayText'>Our Story</h1>
                </div>
            </header>
            <TextContainer className='py-20'>
                <p className='text-blueyonder-500'>
                    Snazzy Stones is a small home based business that specialises in high quality, handcrafted jewellery
                    made with sterling silver and natural gemstones.
                </p>
            </TextContainer>
            <div className='px-10 md:px-40 py-20 bg-blueyonder-500 grid md:grid-cols-2 items-center gap-20'>
                <MotionDiv fromDirection='left' className='text-white'>
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
                </MotionDiv>
                <MotionDiv fromDirection='right' className='flex rounded-md shadow-light'>
                    <Image
                        src='/images/briPresentingBooth_2019-07-25.jpg'
                        width={768}
                        height={768}
                        objectFit='cover'
                        className='rounded-md'
                        alt='Snazzy Stones owner Brianna presenting her market booth'
                    />
                </MotionDiv>
            </div>
            <div className='px-10 md:px-40 py-20 grid md:grid-cols-2 items-center gap-20'>
                <MotionDiv fromDirection='left' className='flex rounded-md shadow-light'>
                    <Image
                        src='/images/beadsDisplay.jpg'
                        width={768}
                        height={768}
                        objectFit='cover'
                        className='rounded-md'
                        alt='A display of beaded bracelets and other jewelry'
                    />
                </MotionDiv>
                <MotionDiv fromDirection='right' className='text-blueyonder-500'>
                    <p className='leading-loose'>
                        The main venues you can find us at are festivals, markets, home parties and fundraising events.
                        We are also beginning the exciting additions of our online and wholesale operations now. If you
                        have any questions or comments we would be happy to hear from you.
                    </p>
                </MotionDiv>
            </div>
        </>
    );
}
