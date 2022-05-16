import { useState } from "react";

export default function InstagramFeed({ feed }) {
    const [instagramImages, setInstagramImages] = useState(feed?.data);
    const [nextPageUrl, setNextPageUrl] = useState(feed?.paging?.next);
    const [morePostsAvailable, setMorePostsAvailable] = useState(!!feed?.paging?.next);

    const fetchMorePosts = async () => {
        const data = await fetch(nextPageUrl);
        if (data.status === 200) {
            const newPosts = await data.json();
            console.log("new posts: ", newPosts);
            const newImagesArray = [...instagramImages, ...newPosts?.data];
            console.log("newImagesArray", newImagesArray);
            setInstagramImages(newImagesArray);
            setNextPageUrl(newPosts?.paging?.next);
            setMorePostsAvailable(!!newPosts?.paging?.next);
        } else {
            setMorePostsAvailable(false);
        }
    };

    return (
        <>
            <div className='grid md:grid-cols-4 gap-10 mt-10'>
                {instagramImages &&
                    instagramImages.map((instImg) => (
                        <div key={instImg.id}>
                            <a href={instImg.permalink} target='_blank' rel='noreferrer'>
                                <img
                                    src={instImg.media_type !== "VIDEO" ? instImg.media_url : instImg.thumbnail_url}
                                    alt={instImg.caption}
                                    className='aspect-square object-cover rounded-md shadow-light transition hover:shadow-bluegreenLight hover:scale-105'
                                />
                            </a>
                        </div>
                    ))}
            </div>
            <div className='flex justify-center gap-3 mt-6'>
                <button
                    disabled={!morePostsAvailable}
                    onClick={fetchMorePosts}
                    className='bg-cerise-500 disabled:bg-cerise-200 text-white rounded-md px-4 py-2 transition hover:bg-cerise-600'
                >
                    {morePostsAvailable ? "Load More..." : "All done!"}
                </button>
            </div>
        </>
    );
}
