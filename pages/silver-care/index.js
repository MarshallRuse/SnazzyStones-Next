import Image from "next/image";
import { NextSeo } from "next-seo";
import FadeInDiv from "../../components/FadeInDiv";
import styles from "../../styles/modules/SilverCare.module.scss";

export default function SilverCare() {
    return (
        <>
            <NextSeo
                title='Caring For Your Silver | SnazzyStones'
                description='Learn some best practices for keeping your silver jewelry immaculate!'
                canonical='https://snazzystones.ca/silver-care'
                openGraph={{
                    url: "https://snazzystones.ca/silver-care",
                    title: "Caring For Your Silver | SnazzyStones",
                    description: "Learn some best practices for keeping your silver jewelry immaculate!",
                    images: [
                        {
                            url: "https://res.cloudinary.com/marsh/image/upload/q_auto/v1651748940/snazzystones-website/silverCare_2020-06-27.jpg",
                            width: 3920,
                            height: 1960,
                            alt: "Silver bracelets artfully placed on a cleaning cloth",
                            type: "image/jpeg",
                        },
                    ],
                    site_name: "SnazzyStones",
                }}
                twitter={{
                    cardType: "summary_large_image",
                }}
            />
            <header className={`heroSection ${styles.heroBackground}`}>
                <div>
                    <h1 className='heroTitle text-white overlayText'>Caring For Your Silver</h1>
                </div>
            </header>
            <section className='px-10 md:px-40 py-20 grid md:grid-cols-2 items-center gap-20'>
                <FadeInDiv from='left' threshold={0.2} className='text-blueyonder-500'>
                    <h2>Background Information on Sterling Silver</h2>
                    <p>
                        Sterling silver is composed of 92.5% pure silver and 7.5% another metal. Hence the
                        &quot;.925&quot; stamp you can find on most sterling silver pieces. This other metal is added to
                        give strength to the alloy, as pure silver is too soft to be fashioned into jewellery. The added
                        metal is typically copper. Copper, like pure silver, has the benefit of being hypoallergenic,
                        making this combination suitable for the majority of people to wear without any allergic
                        concerns. However the trade off is that copper is highly susceptible to tarnishing, which is why
                        sterling silver tends to oxidise over time.
                    </p>
                    <p>
                        Sometimes parts of your sterling silver can be intentionally oxidised by the silversmiths in
                        order to accentuate certain details. This is the darkened area typically seen in grooves on your
                        piece. Cleaning and polishing in these areas will result in removal of this darkened look, so be
                        sure to take care when polishing oxidised pieces to avoid these parts. We recommend using a
                        polishing cloth only, so you can clean the raised, polished areas, while keeping away from the
                        intentionally oxidised areas.
                    </p>
                </FadeInDiv>
                <FadeInDiv from='right'>
                    <figure>
                        <div className='flex rounded-md max-w-max shadow-light'>
                            <Image
                                src='/images/oxidizedSilverExample_2020-06-27.jpg'
                                width={1024}
                                height={1024}
                                objectFit='cover'
                                className='rounded-md shadow-light'
                                alt='An example image showing oxidized silver decoration'
                            />
                        </div>
                        <figcaption className='text-blueyonder-500 text-center mt-4'>
                            Examples of intentionally oxidized jewellery
                        </figcaption>
                    </figure>
                </FadeInDiv>
            </section>
            <section className='px-10 md:px-40 py-20 bg-blueyonder-500 grid md:grid-cols-5 gap-x-20 items-center'>
                <div className='text-white md:col-span-5'>
                    <h2>Preventative Care</h2>
                    <p>
                        The tarnishing process happens naturally when your piece is exposed to the oxygen in the air,
                        however the reaction can be encouraged and sped up by certain chemicals. Some skin creams,
                        chlorine, and even unbalanced pH levels in your skin can accelerate tarnishing. We strongly
                        recommend you remove your silver jewellery before entering a hot tub as they are notorious for
                        turning sterling silver dark with tarnish in no time, and will require a more difficult cleaning
                        to get its shine back.
                    </p>
                    <p>Here are our top tips on keeping your pieces shiny:</p>
                </div>
                <FadeInDiv from='right' threshold={0.3} className='text-white md:col-span-3 md:order-2'>
                    <ul className='snazzyList whiteList text-slate-50'>
                        <li>
                            Our top tip is simple: <strong className='text-white text-lg'>wear your jewellery!</strong>{" "}
                            Sterling silver wants to be shown off. To keep your piece happy and shiny, show it some love
                            and wear it regularly. (The oils in your skin are to thank for this).
                        </li>
                        <li>
                            When you are not wearing your piece,{" "}
                            <strong className='text-white text-lg'>
                                keep it away from open air and direct sunlight.
                            </strong>{" "}
                            Small zip lock plastic bags (like the ones you get with your purchase) work great for this;
                            squeeze the air out, shut it, and tuck it away until next time.
                            <ul className='snazzySubList'>
                                <li>
                                    If you would rather not use plastic bags, keep the little silica gel packs you get
                                    from a new pair of shoes inside your jewellery box to absorb moisture out of the air
                                    and minimize tarnishing. (Be sure to replace them every so often).
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong className='text-white text-lg'>
                                Avoid wearing your silver while doing household chores.
                            </strong>{" "}
                            Contact with household chemicals, perspiration, rubber, products containing sulphur, and
                            chlorinated water will react with your sterling silver and cause tarnishing on your
                            favourite piece.
                        </li>
                        <li>
                            Make jewellery the finishing touch to your ensemble! Perfumes, hair products and lotions can
                            also accelerate tarnishing, so{" "}
                            <strong className='text-white text-lg'>
                                while getting ready we recommend being silver-free.
                            </strong>
                        </li>
                    </ul>
                </FadeInDiv>
                <FadeInDiv from='left' className='md:col-span-2 md:order-1'>
                    <figure>
                        <div className='flex rounded-md max-w-max shadow-light'>
                            <Image
                                src='/images/wearYourJewellery_2020-10-11.jpg'
                                width={3024}
                                height={4032}
                                objectFit='cover'
                                className='rounded-md'
                                alt='A bracelet being worn, with a fat cat in the background'
                            />
                        </div>
                        <figcaption className='text-white text-center mt-4'>
                            Our top tip: wear your jewellery!
                        </figcaption>
                    </figure>
                </FadeInDiv>
            </section>
            <section className='px-10 md:px-40 py-20 bg-white'>
                <div className='text-blueyonder-500'>
                    <h2>Cleaning</h2>
                    <p>
                        Remember, sterling silver tarnishes quicker when in contact with rubber, so avoid wearing rubber
                        gloves while cleaning it!
                    </p>
                    <p>Here are our top tips for when your piece needs a little TLC.</p>
                    <FadeInDiv from='left' threshold={0.1}>
                        <ul className='snazzyList blueList text-blueyonder-400'>
                            <li>
                                For the majority of cleaning (as long as the tarnishing is not too severe),{" "}
                                <strong className='text-blueyonder-500'>a polishing cloth</strong> is just what you need
                                to bring the shine back to your piece! These are generally a microfiber cloth or a
                                lint-free flannel with a cleaning agent on one side (Snazzy Stones offers both these
                                options!). We recommend these types of cloths or another nonabrasive type (avoid items
                                such as paper towels) because sterling silver is so soft, it can easily be scratched
                                from fibers in the material you are using.
                            </li>
                            <li>
                                There are a lot of{" "}
                                <strong className='text-blueyonder-500'>sterling silver dips and polishes</strong> that
                                work well in cleaning your items, which can be found at hardware stores. We recommend
                                using them in a well ventilated area, looking into proper disposal methods, and avoid
                                using them for any product with natural stones in it, especially soft, porous stones
                                like pearls, amber, or turquoise. (We are currently working on finding an effective,
                                green polish option for you that works well and keeps you and our planet safe – stay
                                tuned)!
                            </li>
                            <li>
                                <strong className='text-blueyonder-500'>
                                    Transfer the tarnish from your jewellery to a piece of aluminum foil!
                                </strong>{" "}
                                This option we love especially for chains which can be hard to clean in all those little
                                hard to reach places.
                                <ul className='snazzySubList'>
                                    <li>
                                        Place some aluminum foil on the bottom of a small pot or bowl, shiny side up
                                        with your piece of sterling silver sitting on top.
                                    </li>
                                    <li>Cover the jewellery with boiling hot water.</li>
                                    <li>
                                        Add around 2 tbsp each of salt and baking soda (or washing soda we find works
                                        even better!)
                                    </li>
                                    <li>
                                        Mix to dissolve the solution and leave it for 5-10 minutes to work its magic.
                                    </li>
                                    <li>
                                        For chains we like to scrub with a <em>soft</em> toothbrush while in the mixture
                                        to get into the grooves.
                                    </li>
                                    <li>Rinse and dry your piece with a soft cloth!</li>
                                </ul>
                            </li>
                            <li>
                                You may have heard before that using toothpaste is also an option for cleaning your
                                sterling silver jewellery. While this is true, the toothpaste this is referring to is{" "}
                                <strong className='text-blueyonder-500'>
                                    non-whitening, non-gel, basic (and getting harder to come by) toothpaste.
                                </strong>{" "}
                                An alternative to this is using a clean, soft cloth (remember, silver is easily
                                scratched if the cloth is too abrasive) and applying a{" "}
                                <strong className='text-blueyonder-500'>
                                    small amount of paste made from baking soda and water
                                </strong>{" "}
                                to your piece. If the piece has any indentations, add more water to dilute the paste so
                                it doesn’t stick and dry in the cracks. Rinse and buff with a soft cloth!
                            </li>
                            <li>
                                Our last option is ignoring these four prior tips and bringing your sterling silver in
                                to <strong className='text-blueyonder-500'>get it professionally cleaned</strong> (and
                                promising you will follow the preventative measures next time!). Pop by your local
                                jewelers to get more information.
                            </li>
                        </ul>
                    </FadeInDiv>
                    <p className='text-blueyonder-500 text-lg mt-12 font-bold'>
                        We hope this helps you in keeping your sterling silver clean and shiny! If you have any tips or
                        tricks you swear by, we would love to hear about them.
                    </p>
                    <h3 className='text-blueyonder-500 text-4xl mt-20 text-center'>Shine bright everyone!</h3>
                </div>
            </section>
        </>
    );
}
