import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import DestinationDetailsMain from '../Components/Destination/DestinationDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import { fetchDestinationById, getBannerSrc } from '../services/destinationService'

function DestinationDetails() {
    const { id } = useParams();
    const [destinationPost, setDestinationPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDestination = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDestinationById(id);
                setDestinationPost(data);
            } catch (err) {
                console.error('Error fetching destination:', err);
                setError('Destination details not found!');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadDestination();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error || !destinationPost) {
        return (
            <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h3 className="text-danger">{error || 'Destination not found'}</h3>
            </div>
        );
    }

    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title={destinationPost.title || "Destination Details"}
                bgImage={destinationPost.banner_image ? getBannerSrc(destinationPost.banner_image) : null}
                className="destination-breadcrumb"
            />
            <DestinationDetailsMain initialDestination={destinationPost} />
            <FooterFour />
            <ScrollToTop />
        </>
    );
}

export default DestinationDetails;
