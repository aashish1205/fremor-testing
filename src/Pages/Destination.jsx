import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb';
import VideoBanner from '../Components/Banner/VideoBanner';
import DestinationInner from '../Components/Destination/DestinationInner';
import ContinentTabs from '../Components/Destination/ContinentTabs';
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Destination({ category: propCategory }) {
    const { continent: pathContinent } = useParams();
    const [searchParams] = useSearchParams();
    const category = propCategory || searchParams.get('category'); // e.g. "Inbound" or "Outbound"
    
    // Normalise the continent name (e.g. "north-america" -> "North America")
    const formatContinentName = (str) => {
        if (!str) return null;
        return decodeURIComponent(str)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const continent = formatContinentName(pathContinent) || searchParams.get('continent');

    console.log("Destination Render - Category:", category, "Continent:", continent);

    const isDomestic = category?.toLowerCase() === 'domestic';
    const isInbound = category?.toLowerCase() === 'inbound';
    const isOutbound = category?.toLowerCase() === 'outbound';

    // CONTINENT VIDEOS MAPPING: Update these URLs to play different videos for each continent page!
    const continentVideos = {
        'all': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/destinationvideo/outbound/videoplayback%20(2).webm",
        'europe': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/continent2/europe.webm", // REPLACE WITH EUROPE VIDEO URL
        'africa': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/continent2/Africa.webm", // REPLACE WITH AFRICA VIDEO URL
        'north america': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/continent1/Northamerica1.mp4", // REPLACE WITH NORTH AMERICA VIDEO URL
        'south america': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/continent1/Southamerica.mp4", // REPLACE WITH SOUTH AMERICA VIDEO URL
        'australia': "https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/continent2/australia.webm" // REPLACE WITH AUSTRALIA VIDEO URL
    };

    const videoKey = continent ? continent.toLowerCase() : 'all';
    const videoSrc = continentVideos[videoKey] || continentVideos['all'];

    return (
        <>
            <HeaderOne />
            {isDomestic ? (
                <VideoBanner 
                    title="Domestic" 
                    category="Domestic" 
                    videoSrc="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/Videos/videoplayback.webm" 
                />
            ) : isInbound ? (
                <VideoBanner 
                    title="Inbound (India)" 
                    category="Inbound" 
                    videoSrc="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/destinationvideo/inbound/videoplayback.webm" 
                />
            ) : isOutbound ? (
                <>
                    <VideoBanner 
                        title={continent ? `Global - ${continent}` : "Global"} 
                        category="Outbound" 
                        videoSrc={videoSrc} 
                    />
                    <ContinentTabs />
                </>
            ) : (
                <Breadcrumb title="Destination" />
            )}
            <DestinationInner category={category} continent={continent} />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Destination
