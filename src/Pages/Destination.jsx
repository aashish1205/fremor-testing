import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb';
import VideoBanner from '../Components/Banner/VideoBanner';
import DestinationInner from '../Components/Destination/DestinationInner';
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Destination({ category: propCategory }) {
    const [searchParams] = useSearchParams();
    const category = propCategory || searchParams.get('category'); // e.g. "Inbound" or "Outbound"

    return (
        <>
            <HeaderOne />
            {category === 'Domestic' ? (
                <VideoBanner 
                    title="Domestic" 
                    category="Domestic" 
                    videoSrc="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/Videos/videoplayback.webm" 
                />
            ) : category === 'Inbound' ? (
                <VideoBanner 
                    title="Inbound (India)" 
                    category="Inbound" 
                    videoSrc="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/destinationvideo/inbound/videoplayback.webm" 
                />
            ) : category === 'Outbound' ? (
                <VideoBanner 
                    title="Global" 
                    category="Outbound" 
                    videoSrc="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/destinationvideo/outbound/videoplayback%20(2).webm" 
                />
            ) : (
                <Breadcrumb title="Destination" />
            )}
            <DestinationInner category={category} />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Destination
