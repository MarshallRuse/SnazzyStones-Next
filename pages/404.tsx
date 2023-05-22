import Link from "next/link";
import KeyboardBackspaceRounded from "@mui/icons-material/KeyboardBackspaceRounded";
import CTALink from "../components/CTAElements/CTALink";

export default function Custom404() {
    return (
        <div className='flex flex-col items-center py-10'>
            <h1 className='heroTitle text-center'>
                <span className='snazzy text-blueyonder-500'>Snazzy </span>
                <span className='stones text-zinc-700'>Stones</span>
            </h1>
            <h2 className='text-6xl text-blueyonder-500'>404</h2>
            <p className='text-blueyonder-500 mb-0'>Oh no, it looks like you&apos;re lost!</p>
            <p>
                <Link href='/' passHref>
                    <CTALink>
                        <KeyboardBackspaceRounded /> Get back to the snazziness!
                    </CTALink>
                </Link>
            </p>
        </div>
    );
}
