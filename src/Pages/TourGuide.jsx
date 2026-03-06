import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TourGuideInner from '../Components/Guide/TourGuideInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function TourGuide() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb
        title="Tour Guide"
      />
      <TourGuideInner />
      <FooterFour />
      <ScrollToTop />
    </>
  )
}

export default TourGuide
