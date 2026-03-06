import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import BannerFour from '../Components/Banner/BannerFour'
import AboutThree from '../Components/About/AboutThree'
import SaleOne from '../Components/Sale/SaleOne'
import GalleryFour from '../Components/Gallery/GalleryFour'
import BrandOne from '../Components/Brand/BrandOne'
import TourGuideThree from '../Components/Guide/TourGuideThree'
import CounterThree from '../Components/Counter/CounterThree'
import TestimonialFour from '../Components/Testimonials/TestimonialFour'
import BlogFour from '../Components/Blog/BlogFour'
import FooterThree from '../Components/Footer/FooterThree'
import ScrollToTop from '../Components/ScrollToTop'
import CruiseSearch from '../Components/Cruise/CruiseSearch'

function Cruise() {
    return (
        <div>
            <HeaderOne />
            <BannerFour />
            <CruiseSearch />
            <AboutThree />
            <SaleOne />
            <GalleryFour />
            <BrandOne className="space-bottom"/>
            <TourGuideThree />
            <CounterThree />
            <TestimonialFour />
            <BlogFour />
            <FooterThree />
            <ScrollToTop />
        </div>
    )
}

export default Cruise
