import Image from 'next/image';
import TextContainer from '@/components/TextContainer';
import styles from './our-shows.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Shows | SnazzyStones',
    description: 'Find us in person!',
    metadataBase: new URL('https://snazzystones.ca'),
    openGraph: {
        title: 'Our Shows | SnazzyStones',
        description: 'Find us in person!',
        images: [
            {
                url: 'https://res.cloudinary.com/marsh/image/upload/q_auto/v1651757847/snazzystones-website/briMarket_2021-08-01.jpg',
            },
        ],
        siteName: 'SnazzyStones',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Shows | SnazzyStones',
        description: 'Find us in person!',
        images: [
            'https://res.cloudinary.com/marsh/image/upload/q_auto/v1651757847/snazzystones-website/briMarket_2021-08-01.jpg',
        ],
    },
};

export default function OurShows() {
    return (
        <>
            <header
                className={'heroSectionHeader'}
                style={{ backgroundPositionX: '30%' }}
            >
                <div
                    className={`${styles.heroBackground} heroSection`}
                    style={{ backgroundPositionX: '30%' }}
                ></div>
                <div>
                    <h1 className='heroTitle text-white overlayText'>Our Shows</h1>
                </div>
            </header>
            <div className='py-20 px-10 bg-white w-full mb-0'>
                <TextContainer className=' text-blueyonder-500'>
                    <p className='my-0 text-2xl'>
                        We can be found at a number of Bruce Peninsula cottage-season market locations throughout the
                        summer (weather-permitting).
                    </p>
                </TextContainer>
            </div>
            <section className='px-10 md:px-32 py-20 bg-slate-100 text-blueyonder-500 grid items-start md:grid-cols-4 md:grid-rows-2 gap-10'>
                <div className='md:row-span-2 flex rounded-md aspect-square shadow-light'>
                    <Image
                        src='/images/kincardineLogo.jpg'
                        width={1024}
                        height={1024}
                        style={{ objectFit: 'cover' }}
                        className='rounded-md aspect-square'
                        alt='Kincardine town logo'
                    />
                </div>
                <div className='md:col-span-3 md:row-span-2 grid md:grid-cols-3'>
                    <h2 className='mt-0 text-5xl col-span-3'>Kincardine</h2>
                    <div className='col-span-3 md:col-span-2'>
                        <h3>Market in the Park</h3>
                        <p>
                            Every <strong>Monday</strong> from July to Labour Day, find us at Victoria Park for the{' '}
                            <a
                                href='https://www.kincardine.ca/en/visit/market-in-the-park.aspx'
                                target='_blank'
                                rel='noreferrer'
                                className='text-bluegreen-500'
                            >
                                weekly Market in the Park
                            </a>
                        </p>
                    </div>
                    <div className='col-span-3 md:col-span-1 mx-auto'>
                        <iframe
                            width='300'
                            height='300'
                            frameBorder='0'
                            style={{ border: 0 }}
                            className='rounded-md shadow-light'
                            referrerPolicy='no-referrer-when-downgrade'
                            src='https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ-9ec3DFRKIgREY69A9CDwmM&key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs'
                            loading='lazy'
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                {/*
                    <div className='md:col-span-2'>  
                        <h3>The Promenade</h3>
                    <p>
                        Every <strong>Sunday</strong> from July to Labour Day, find us at the{" "}
                        <a
                            href='https://www.kincardine.ca/en/play-and-explore/promenade-on-queen.aspx'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            Kincardine Queent St. Promenade
                        </a>
                        .
                    </p> 
                    </div>
                     <div>
                    <iframe
                        width='300'
                        height='300'
                        frameBorder='0'
                        style={{ border: 0 }}
                        className='rounded-md shadow-light'
                        referrerPolicy='no-referrer-when-downgrade'
                        src='https://www.google.com/maps/embed/v1/place?q=86PW59G7%2BCJ&key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs'
                        loading='lazy'
                        allowFullScreen
                        //Queen%20Street%2C%20Kincardine%2C%20Ontario
                    ></iframe>
                </div> */}
                {/* <div className='md:col-span-2'>
                    <h3>Market in the Park</h3>
                    <p>
                        Every Monday from July to Labour Day, find us at Connaught Park* for the{" "}
                        <a
                            href='https://www.kincardine.ca/en/visit/market-in-the-park.aspx'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            weekly Market in the Park
                        </a>
                    </p>
                    <p className='italic text-xs'>
                        * July 10th and September 4th, we'll be at the Tiverton & District Sports Centre at 20 McClaren
                        Street
                    </p>
                </div> */}
            </section>
            <section className='px-10 md:px-40 py-20 bg-white text-blueyonder-500 grid items-start md:grid-cols-4 gap-10'>
                <div className='flex rounded-md aspect-square col-span-3 md:col-span-1'>
                    <Image
                        src='/images/keadyMarketLogo-noBG.png'
                        width={1024}
                        height={1024}
                        style={{ objectFit: 'cover' }}
                        className='rounded-md aspect-square drop-shadow-light'
                        alt='Keady Market sign'
                    />
                </div>
                <div className='col-span-3 md:col-span-2'>
                    <h2 className='mt-0 text-5xl'>Keady</h2>
                    <h3>Keady Vendor Market</h3>
                    <p>
                        Every <strong>Tuesday</strong> from July to Labour Day, find us at the{' '}
                        <a
                            href='http://keadymarket.com/'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            Keady Vendor Market
                        </a>
                        .
                    </p>
                </div>
                <div className='col-span-3 md:col-span-1 mx-auto'>
                    <iframe
                        width='300'
                        height='300'
                        frameBorder='0'
                        style={{ border: 0 }}
                        className='rounded-md shadow-light'
                        referrerPolicy='no-referrer-when-downgrade'
                        src='https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ69QcbwLvKYgRcXXWuY3w6Wk&key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs'
                        loading='lazy'
                        allowFullScreen
                    ></iframe>
                </div>
            </section>
            {/* <section className='px-10 md:px-40 py-20 bg-slate-100 text-blueyonder-500 grid items-start md:grid-cols-4 gap-10'>
                <div className='flex rounded-md aspect-square  col-span-3 md:col-span-1'>
                    <Image
                        src='/images/owensoundlogo.png'
                        width={318}
                        height={318}
                        style={{ objectFit: 'contain' }}
                        className='rounded-md aspect-square drop-shadow-light'
                        alt='Wiarton, Ontario logo'
                    />
                </div>
                <div className='col-span-3 md:col-span-2'>
                    <h2 className='mt-0 text-5xl'>Owen Sound</h2>
                    <h3>Owen Sound Lakeview Vendor&apos;s Market</h3>
                    <p>
                        Every <strong>Wednesday</strong> from July to Labour Day, find us in Kelso Park at the{" "}
                        <a
                            href='https://www.facebook.com/saublemarket/events'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            Owen Sound Lakeview Vendor&apos;s Market
                        </a>
                        .
                    </p>
                </div>
                <div className='col-span-3 md:col-span-1 mx-auto'>
                    <iframe
                        width='300'
                        height='300'
                        frameBorder='0'
                        style={{ border: 0 }}
                        className='rounded-md shadow-light'
                        referrerPolicy='no-referrer-when-downgrade'
                        src='https://www.google.com/maps/embed/v1/place?q=place_id:ChIJYYrzZYn8KYgRrc9mgLwrSJE&key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs'
                        loading='lazy'
                        allowFullScreen
                    ></iframe>
                </div>
            </section> */}
            {/*<section className='px-10 md:px-40 py-20 bg-slate-100 text-blueyonder-500 grid items-start md:grid-cols-4 gap-10'>
                <div className='flex rounded-md aspect-square  col-span-3 md:col-span-1'>
                    <Image
                        src='/images/wiartonLogo.png'
                        width={318}
                        height={318}
                        style={{ objectFit: 'cover' }}
                        className='rounded-md aspect-square drop-shadow-light'
                        alt='Wiarton, Ontario logo'
                    />
                </div>
                <div className='col-span-3 md:col-span-2'>
                    <h2 className='mt-0 text-5xl'>Wiarton</h2>
                    <h3>Wiarton Lakeview Vendor&apos;s Market</h3>
                    <p>
                        Every <strong>Wednesday</strong> from July to Labour Day, find us in Bluewater Park at the{' '}
                        <a
                            href='https://www.facebook.com/saublemarket/events'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            Wiarton Lakeview Vendor&apos;s Market
                        </a>
                        .
                    </p>
                </div>
                <div className='col-span-3 md:col-span-1 mx-auto'>
                    <iframe
                        width='300'
                        height='300'
                        frameBorder='0'
                        style={{ border: 0 }}
                        className='rounded-md shadow-light'
                        referrerPolicy='no-referrer-when-downgrade'
                        src='https://www.google.com/maps/embed/v1/place?q=place_id:ChIJSVwezh3JLE0RYhpdTAiHSC0&key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs'
                        loading='lazy'
                        allowFullScreen
                    ></iframe>
                </div>
            </section>*/}
            {/*<section className='px-10 md:px-40 py-20 bg-white text-blueyonder-500 grid items-start md:grid-cols-4 gap-10'>
                <div className='flex rounded-md aspect-square  col-span-3 md:col-span-1'>
                    <Image
                        src='/images/SaubleBeachLogo.png'
                        width={318}
                        height={318}
                        style={{ objectFit: 'contain' }}
                        className='rounded-md aspect-square drop-shadow-light'
                        alt='Sauble Beach, Ontario logo'
                    />
                </div>
                <div className='col-span-3 md:col-span-2'>
                    <h2 className='mt-0 text-5xl'>Sauble Beach</h2>
                    <h3>Sauble Beach Lakeview Vendor&apos;s Market</h3>
                    <p>
                        Every <strong>Friday</strong> and <strong>Sunday</strong> from July to Labour Day, find us near
                        the Ascent Aerial Park at the{' '}
                        <a
                            href='https://www.facebook.com/saublemarket/events'
                            target='_blank'
                            rel='noreferrer'
                            className='text-bluegreen-500'
                        >
                            Sauble Beach Lakeview Vendor&apos;s Market
                        </a>
                        .
                    </p>
                </div>
                <div className='col-span-3 md:col-span-1 mx-auto'>
                    <iframe
                        width='300'
                        height='300'
                        frameBorder='0'
                        style={{ border: 0 }}
                        className='rounded-md shadow-light'
                        referrerPolicy='no-referrer-when-downgrade'
                        src='https://www.google.com/maps/embed/v1/view?key=AIzaSyCN5rwciQHCHF4Mi_U0PxRmWPtsofhRaXs&center=44.63019987396363,-81.26980022005358&zoom=16'
                        loading='lazy'
                        allowFullScreen
                    ></iframe>
                </div>
            </section>*/}
        </>
    );
}
