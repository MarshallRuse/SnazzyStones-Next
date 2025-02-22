import { Skeleton } from "@mui/material";

export default function ProductPageFallbackSkeleton() {
    return (
        <>
            <section className='grid md:grid-cols-2 md:grid-flow-row auto-rows-max gap-10 py-16 md:max-w-(--breakpoint-lg) justify-center mx-auto px-4'>
                <div>
                    <div className='flex flex-col md:flex-row gap-4 max-w-xs sm:max-w-(--breakpoint-lg)'>
                        <div className='order-2 md:order-1 max-w-screen md:w-auto noScrollbar'>
                            <div className='relative flex md:flex-col gap-2 md:min-h-full md:h-0 p-2'>
                                <Skeleton variant='rectangular' width={75} height={75} />
                                <Skeleton variant='rectangular' width={75} height={75} />
                                <Skeleton variant='rectangular' width={75} height={75} />
                                <Skeleton variant='rectangular' width={75} height={75} />
                            </div>
                        </div>
                        <div className='relative order-1 md:order-2 group p-2'>
                            <div
                                key={`gallery-image-skeleton`}
                                className='flex self-start justify-center items-center rounded-xs aspect-square shadow-light'
                            >
                                <Skeleton variant='rectangular' width={350} height={350} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col row-span-2 text-sm text-slate-500 max-w-xs md:max-w-lg pt-2'>
                    <nav className='flex flex-nowrap gap-2'>
                        <Skeleton variant='text' width={36} />
                        /
                        <Skeleton variant='text' width={60} />
                        /
                        <Skeleton variant='text' width={400} />
                    </nav>
                    <div className='flex gap-4 items-center text-blueyonder-500'>
                        <h1 className='text-2xl mt-4 font-semibold grow'>
                            <Skeleton variant='text' height={60} />
                        </h1>
                        <div className='flex rounded-md shadow-light'>
                            <Skeleton variant='rectangular' width={105} height={70} />
                        </div>
                    </div>
                    <p className='text-bluegreen-500 text-2xl font-semibold m-0'>
                        <Skeleton width={85} height={30} />
                    </p>
                    <div className='max-h-56 mt-4 overflow-y-auto subtleScrollbar'>
                        <Skeleton variant='rectangular' height={200} />
                    </div>
                    <p className='text-base'>
                        <Skeleton variant='text' width={150} />
                    </p>
                    <div className='flex flex-col md:flex-row md:flex-nowrap items-center gap-4'>
                        <Skeleton variant='rectangular' width={215} height={50} />
                        <div className='text-bluegreen-500 font-medium grow'>
                            <Skeleton variant='text' />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <h3 className='text-bluegreen-500 mb-4'>
                        <Skeleton />
                    </h3>
                    <div className='flex items-start gap-4'>
                        <Skeleton variant='circular' width={40} height={40} />
                        <Skeleton variant='circular' width={40} height={40} />
                        <Skeleton variant='circular' width={40} height={40} />
                        <Skeleton variant='circular' width={40} height={40} />
                        <Skeleton variant='circular' width={40} height={40} />
                    </div>
                </div>
            </section>
            <section className='px-4 py-16 md:max-w-(--breakpoint-lg) mx-auto  border-t border-slate-100'>
                <h2 className='text-blueyonder-500'>
                    <Skeleton variant='text' width={350} height={50} />
                </h2>
            </section>
        </>
    );
}
