import Link from "next/link";
import KeyboardBackspaceRounded from "@mui/icons-material/KeyboardBackspaceRounded";
import CTALink from "../components/CTAElements/CTALink";

export default function Custom500() {
    return (
        <div className='flex flex-col items-center py-10'>
            <h1 className='heroTitle'>
                <span className='snazzy text-blueyonder-500'>Snazzy </span>
                <span className='stones text-zinc-700'>Stones</span>
            </h1>
            <h2 className='text-6xl text-blueyonder-500'>500</h2>
            <p className='text-blueyonder-500 mb-0'>Welp, looks like a server error occurred.</p>
            <p>
                <Link href='/' passHref>
                    <CTALink>
                        <KeyboardBackspaceRounded /> Get back to the snazziness!
                    </CTALink>
                </Link>
            </p>
            <p className='text-bluegreen-500 navItem'>
                <Link href='/index'>
                    <a>or let us know what happened.</a>
                </Link>
            </p>
        </div>
    );
}
