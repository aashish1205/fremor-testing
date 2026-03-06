import React from 'react'
import HeaderThree from '../Components/Header/HeaderThree'
import BannerThree from '../Components/Banner/BannerThree'
import DestinationThree from '../Components/Destination/DestinationThree'
import CategoryThree from '../Components/Category/CategoryThree'
import AboutTwo from '../Components/About/AboutTwo'
import TourTwo from '../Components/Tour/TourTwo'
import GalleryThree from '../Components/Gallery/GalleryThree'
import TourGuideTwo from '../Components/Guide/TourGuideTwo'
import ElementSection from '../Components/Elements/ElementSection'
import ContactOne from '../Components/Contact/ContactOne'
import TestimonialThree from '../Components/Testimonials/TestimonialThree'
import BrandOne from '../Components/Brand/BrandOne'
import BlogThree from '../Components/Blog/BlogThree'
import FooterTwo from '../Components/Footer/FooterTwo'
import ScrollToTop from '../Components/ScrollToTop'

function HomeThree() {
    return (
        <div>
            <HeaderThree />
            <BannerThree />
            <DestinationThree />
            <CategoryThree />
            <AboutTwo />
            <TourTwo />
            <GalleryThree />
            <TourGuideTwo />
            <ElementSection className="bg-white"/>
            <ContactOne />
            <TestimonialThree />
            <BrandOne className="space"/>
            <BlogThree />
            <FooterTwo />
            <ScrollToTop />
        </div>
    )
}

export default HomeThree
