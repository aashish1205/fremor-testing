import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import BannerOne from '../Components/Banner/BannerOne'
import Booking from '../Components/Booking/Booking'
import CategoryOne from '../Components/Category/CategoryOne'
import DestinationOne from '../Components/Destination/DestinationOne'
import AboutOne from '../Components/About/AboutOne'
import TourOne from '../Components/Tour/TourOne'
import GalleryOne from '../Components/Gallery/GalleryOne'
import CounterOne from '../Components/Counter/CounterOne'
import TourGuide from '../Components/Guide/TourGuide'
import TestimonialOne from '../Components/Testimonials/TestimonialOne'
import BrandOne from '../Components/Brand/BrandOne'
import BlogOne from '../Components/Blog/BlogOne'
import FooterOne from '../Components/Footer/FooterOne'
import ScrollToTop from '../Components/ScrollToTop'
import BookingSection from '../Components/Booking/BookingSection'
import FooterFour from '../Components/Footer/FooterFour'

function HomeOne() {
    return (
        <div>
            <HeaderOne />
            <BannerOne />
            <Booking />
            <BookingSection/>
            <CategoryOne />
            <DestinationOne />
            <AboutOne />
            <TourOne />
            <GalleryOne />
            <CounterOne />
            <TourGuide />
            <TestimonialOne />
            <BrandOne className="space-bottom"/>
            <BlogOne />
            <FooterFour />
            <ScrollToTop />
        </div>
    )
}

export default HomeOne
