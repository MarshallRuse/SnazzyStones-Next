'use client';

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from 'react-share';
import WiggleWrapper from '@/components/WiggleWrapper';

const shareButtonStyle = 'rounded-full focus:outline-hidden focus:ring-3 focus:ring-bluegreen-500 focus:ring-offset-2';
const shareButtonIconSize = 40;

export default function ShareButtons({
    productURL,
    facebookAppId,
}: {
    productURL: string;
    facebookAppId: string | undefined;
}) {
    return (
        <div className='flex flex-col'>
            <h3 className='text-bluegreen-500 mb-4'>Share the Snazziness!</h3>
            <div className='flex items-start gap-4'>
                <WiggleWrapper>
                    <FacebookShareButton
                        url={productURL}
                        className={shareButtonStyle}
                    >
                        <FacebookIcon
                            size={shareButtonIconSize}
                            round
                        />
                    </FacebookShareButton>
                </WiggleWrapper>
                <WiggleWrapper>
                    <FacebookMessengerShareButton
                        url={productURL}
                        className={shareButtonStyle}
                        appId={facebookAppId ?? ''}
                    >
                        <FacebookMessengerIcon
                            size={shareButtonIconSize}
                            round
                        />
                    </FacebookMessengerShareButton>
                </WiggleWrapper>
                <WiggleWrapper>
                    <TwitterShareButton
                        url={productURL}
                        className={shareButtonStyle}
                    >
                        <TwitterIcon
                            size={shareButtonIconSize}
                            round
                        />
                    </TwitterShareButton>
                </WiggleWrapper>
                <WiggleWrapper>
                    <WhatsappShareButton
                        url={productURL}
                        className={shareButtonStyle}
                    >
                        <WhatsappIcon
                            size={shareButtonIconSize}
                            round
                        />
                    </WhatsappShareButton>
                </WiggleWrapper>
                <WiggleWrapper>
                    <EmailShareButton
                        url={productURL}
                        className={shareButtonStyle}
                    >
                        <EmailIcon
                            size={shareButtonIconSize}
                            round
                        />
                    </EmailShareButton>
                </WiggleWrapper>
            </div>
        </div>
    );
}
