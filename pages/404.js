import Link from "next/link";
import CTAButton from "../components/CTAButton";
import KeyboardBackspaceRounded from "@mui/icons-material/KeyboardBackspaceRounded";

export default function Custom404() {
    return (
        <div className='flex flex-col items-center py-10'>
            <h1 className='heroTitle'>
                <span className='snazzy text-blueyonder-500'>Snazzy </span>
                <span className='stones text-zinc-700'>Stones</span>
            </h1>
            <h2 className='text-6xl text-blueyonder-500'>404</h2>
            <p className='text-blueyonder-500 mb-0'>Oh no, it looks like you&apos;re lost!</p>
            <p>
                <Link href='/' passHref>
                    <CTAButton>
                        <KeyboardBackspaceRounded /> Get back to the snazziness!
                    </CTAButton>
                </Link>
            </p>
        </div>
    );
}
