import type { Metadata } from 'next';
import Layout from '../components/Layout';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'Snazzy Stones - Specializing in Silver & Gemstone Jewellery',
    description: 'Unique, high-quality sterling silver jewellery handmade from artisans around the globe.',
};

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <head>
                <link
                    rel='icon'
                    href='/svg/SnazzyIcon.svg'
                />
                <link
                    rel='preconnect'
                    href='https://fonts.googleapis.com'
                />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Mandali&display=swap'
                    rel='stylesheet'
                />
            </head>
            <body>
                <Layout>{children}</Layout>
            </body>
        </html>
    );
}
