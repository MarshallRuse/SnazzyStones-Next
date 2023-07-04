import Image from "next/image";
import Link from "next/link";
import Instagram from "@mui/icons-material/Instagram";
import Facebook from "@mui/icons-material/Facebook";

const listStyle = "text-blueyonder-500 text-sm whitespace-nowrap my-4 hover:text-bluegreen-500 transition duration-300";
const iconSpanStyle =
    "flex items-center justify-center bg-blueyonder-500 rounded-full text-white cursor-pointer p-2 transition hover:bg-cerise-500";

export default function Footer() {
    return (
        <footer className='bg-slate-100 '>
            <div className='px-10 py-20 items-baseline grid md:grid-cols-3'>
                <div className='py-10'>
                    <h4 className='text-bluegreen-500 text-xl font-normal'>
                        Follow us all over the web, or get in touch with us!
                    </h4>
                </div>
                <div className='py-10'>
                    <h3 className='text-center text-5xl mb-8'>
                        <span className='snazzy text-blueyonder-500'>Snazzy </span>
                        <span className='stones text-zinc-700'>Stones</span>
                    </h3>
                    <div className='flex justify-center gap-3 w-full'>
                        <a
                            href='https://www.etsy.com/ca/shop/SnazzyStonesJewelry'
                            target='_blank'
                            rel='noreferrer'
                            className={iconSpanStyle}
                        >
                            <Image src='/svg/etsy-icon.svg' width={22.5} height={22.5} alt='Etsy icon' />
                        </a>
                        <a
                            href='https://www.instagram.com/snazzystones'
                            target='_blank'
                            rel='noreferrer'
                            className={iconSpanStyle}
                        >
                            <Instagram />
                        </a>
                        <a
                            href='https://www.facebook.com/snazzystonesjewellery/'
                            target='_blank'
                            rel='noreferrer'
                            className={iconSpanStyle}
                        >
                            <Facebook />
                        </a>
                    </div>
                </div>
                <div className='py-10'>
                    <div className='px-10 items-baseline grid md:grid-cols-2'>
                        <div>
                            <h4 className='text-bluegreen-500 text-xl py-5 md:py-0'>Important Links</h4>
                            <ul className='p-0'>
                                <li className={listStyle}>
                                    <Link href='/index'>
                                        <a>SHIPPING & RETURNS</a>
                                    </Link>
                                </li>
                                <li className={listStyle}>
                                    <Link href='/index'>
                                        <a>PRIVACY POLICY</a>
                                    </Link>
                                </li>
                                <li className={listStyle}>
                                    <Link href='/index'>
                                        <a>TERMS & CONDITIONS</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='text-bluegreen-500 text-xl py-5 md:py-0'>Quick Links</h4>
                            <ul className='p-0'>
                                <li className={listStyle}>
                                    <Link href='/index'>
                                        <a>KNOW MORE ABOUT US</a>
                                    </Link>
                                </li>
                                <li className={listStyle}>
                                    <Link href='/index'>
                                        <a>VISIT SHOP</a>
                                    </Link>
                                </li>
                                <li className={listStyle}>LET&apos;S CONNECT</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='items-baseline border border-t-slate-200 text-blueyonder-500 text-center p-10'>
                Copyright © {new Date().getFullYear()} Snazzy Stones | Designed by{" "}
                <a
                    href='https://marshallruse.com/'
                    target='_blank'
                    rel='noreferrer'
                    className='hover:text-bluegreen-500 transition'
                >
                    Marshall Ruse
                </a>
            </div>
        </footer>
    );
}
