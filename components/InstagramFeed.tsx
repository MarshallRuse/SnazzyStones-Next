import { useState } from "react";
import Image from "next/image";

export default function InstagramFeed({ feed }) {
    const [instagramImages, setInstagramImages] = useState(feed?.data);
    const [nextPageUrl, setNextPageUrl] = useState(feed?.paging?.next);
    const [morePostsAvailable, setMorePostsAvailable] = useState(!!feed?.paging?.next);

    const fetchMorePosts = async () => {
        const data = await fetch(nextPageUrl);
        if (data.status === 200) {
            const newPosts = await data.json();
            const newImagesArray = [...instagramImages, ...newPosts?.data];
            setInstagramImages(newImagesArray);
            setNextPageUrl(newPosts?.paging?.next);
            setMorePostsAvailable(!!newPosts?.paging?.next);
        } else {
            setMorePostsAvailable(false);
        }
    };

    return (
        <>
            <div className='grid md:grid-cols-4 gap-10 mt-10 max-w-screen-2xl mx-auto'>
                {instagramImages &&
                    instagramImages.map((instImg) => (
                        <a
                            key={instImg.id}
                            href={instImg.permalink}
                            target='_blank'
                            rel='noreferrer'
                            className='flex rounded-md w-max shadow-light mx-auto transition hover:shadow-bluegreenLight hover:scale-105'
                        >
                            <Image
                                src={
                                    instImg.media_type !== "VIDEO"
                                        ? instImg.media_url.replace(/^[^.]*/, "https://scontent") // replace dynamic CDN subdomains with the one in next.config
                                        : instImg.thumbnail_url.replace(/^[^.]*/, "https://scontent")
                                }
                                width={270}
                                height={270}
                                objectFit='cover'
                                alt={instImg.caption}
                                className='aspect-square rounded-md'
                            />
                        </a>
                    ))}
            </div>
            <div className='flex justify-center gap-3 mt-6'>
                {morePostsAvailable && (
                    <button
                        onClick={fetchMorePosts}
                        className='bg-cerise-500 disabled:bg-cerise-200 text-white rounded-md px-4 py-2 transition hover:bg-cerise-600'
                    >
                        Load More...
                    </button>
                )}
            </div>
        </>
    );
}
