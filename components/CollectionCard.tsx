import Image from 'next/image';
import Link from 'next/link';
import CTALink from './CTAElements/CTALink';

interface CollectionCardProps {
    cardImageSrc?: string;
    title?: string;
    alt?: string;
}

export default function CollectionCard({ cardImageSrc = '', title = '', alt = '' }: CollectionCardProps) {
    return (
        <div className={`flex relative group ${cardImageSrc ? '' : 'w-full aspect-2/3'} @container`}>
            {cardImageSrc ? (
                <Image
                    src={cardImageSrc}
                    width={1400}
                    height={1960}
                    style={{ objectFit: 'cover' }}
                    className='rounded-2xl'
                    alt={alt}
                />
            ) : (
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-linear-to-br from-bluegreen-500 to-blueyonder-500 rounded-2xl'>
                    <div className='absolute w-full top-1/3 text-3xl text-center'>
                        <span className='snazzy text-white'>Snazzy </span>
                        <span className='stones text-white'>Stones</span>
                    </div>
                </div>
            )}

            <div className='absolute top-0 left-0 w-full h-full opacity-50 rounded-2xl bg-linear-to-b from-transparent to-black transition group-hover:opacity-30' />
            <div className='flex flex-col items-center justify-end gap-4 absolute top-0 left-0 w-full h-full pb-10 px-4'>
                <Link href={`/retail/categories/${title.replace(' ', '_')}`}>
                    <h3 className='text-white font-normal text-3xl text-center text-shadow-cerise'>{title}</h3>
                </Link>
                <Link
                    href={`/retail/categories/${title.replace(' ', '_')}`}
                    passHref
                >
                    <CTALink className='@max-[200px]:py-2 @max-[200px]:px-4 @max-[200px]:text-xs @max-[200px]:min-w-[10rem]'>
                        SEE COLLECTION
                    </CTALink>
                </Link>
            </div>
        </div>
    );
}
