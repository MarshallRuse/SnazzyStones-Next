import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import '@/styles/globals.css';
import { Libre_Baskerville, Mandali } from 'next/font/google';
import localFont from 'next/font/local';

const libreBaskerville = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin'],
});

const mandali = Mandali({
    weight: ['400'],
    subsets: ['latin'],
});

const titlePrimary = localFont({
    src: '../public/fonts/title-primary.ttf',
    variable: '--font-title-primary',
    display: 'block',
});

const titleSecondary = localFont({
    src: '../public/fonts/title-secondary.ttf',
    variable: '--font-title-secondary',
    display: 'block',
});

export const metadata: Metadata = {
    title: 'Snazzy Stones - Specializing in Silver & Gemstone Jewellery',
    description: 'Unique, high-quality sterling silver jewellery handmade from artisans around the globe.',
    icons: {
        icon: '/svg/SnazzyIcon.svg',
    },
};

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang='en'
            className={`${libreBaskerville.className} ${mandali.className} ${titlePrimary.variable} ${titleSecondary.variable}`}
        >
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
