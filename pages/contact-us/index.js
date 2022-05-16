import { EmailRounded } from "@mui/icons-material";
import ContactUsForm from "../../components/ContactUsForm";
import styles from "../../styles/modules/ContactUs.module.scss";

export default function ContactUs() {
    return (
        <>
            <header className={`${styles.heroBackground} heroSection `}>
                <div>
                    <h1 className='heroTitle text-white overlayText'>Contact Us</h1>
                    <h2 className='text-2xl pt-6 text-white overlayText'>I would love to hear from you!</h2>
                </div>
            </header>
            <section className='flex justify-center'>
                <div
                    className='-mt-12 mb-24 flex flex-col items-center gap-10 px-16 py-14 w-screen md:max-w-screen-sm bg-white rounded-sm'
                    style={{ boxShadow: "0px 0px 50px -10px rgba(0,0,0,0.17)" }}
                >
                    <h2>
                        <span className='snazzy text-blueyonder-500'>Snazzy </span>
                        <span className='stones text-zinc-700'>Stones</span>
                    </h2>
                    <div className='text-bluegreen-500 mx-auto'>
                        <a
                            href='mailto:snazzystones@gmail.com?subject=SnazzyStones.ca Inquiry'
                            className='flex flex-col items-center gap-2 navItem group'
                        >
                            <EmailRounded fontSize='large' className='group-hover:scale-125 transition' />
                            snazzystones@gmail.com
                        </a>
                    </div>
                    <h3 className='text-bluegreen-500 pt-6'>Write to Us!</h3>
                    <ContactUsForm />
                </div>
            </section>
        </>
    );
}
