import React from 'react'
import BannerTwo from '../Components/Banner/BannerTwo'
import HeaderTwo from '../Components/Header/HeaderTwo'
import DestinationTwo from '../Components/Destination/DestinationTwo'
import CategoryTwo from '../Components/Category/CategoryTwo'
import OfferOne from '../Components/Offer/OfferOne'
import PopularDestination from '../Components/Destination/PopularDestination'
import CounterTwo from '../Components/Counter/CounterTwo'
import GalleryTwo from '../Components/Gallery/GalleryTwo'
import TourGuide from '../Components/Guide/TourGuide'
import TestimonialTwo from '../Components/Testimonials/TestimonialTwo'
import BrandOne from '../Components/Brand/BrandOne'
import BlogTwo from '../Components/Blog/BlogTwo'
import FooterTwo from '../Components/Footer/FooterTwo'
import ElementSection from '../Components/Elements/ElementSection'
import ScrollToTop from '../Components/ScrollToTop'

function HomeTwo() {
  return (
    <div>
      <HeaderTwo />
      <BannerTwo />
      <DestinationTwo />
      <CategoryTwo />
      <OfferOne />
      <PopularDestination />
      <CounterTwo />
      <GalleryTwo />
      <TourGuide />
      <TestimonialTwo />
      <BrandOne className="space-bottom"/>
      <BlogTwo />
      <ElementSection className="bg-smoke"/>
      <FooterTwo />
      <ScrollToTop />
    </div>
  )
}

export default HomeTwo
