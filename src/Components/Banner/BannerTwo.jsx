import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Core Swiper styles
import { Pagination, A11y, EffectFade, Autoplay, Navigation, Thumbs } from 'swiper/modules'; // Correctly import necessary modules
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Link } from 'react-router-dom';
function BannerTwo() {
  const swiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null); // Reference for the thumbs swiper
  useEffect(() => {
    // Function to add animation classes
    const animationProperties = () => {
      document.querySelectorAll('[data-ani]').forEach((element) => {
        const animationName = element.getAttribute('data-ani');
        element.classList.add(animationName);
      });
      document.querySelectorAll('[data-ani-delay]').forEach((element) => {
        const delayTime = element.getAttribute('data-ani-delay');
        element.style.animationDelay = delayTime;
      });
    };
    animationProperties();
  }, []);
  // Event handler for custom navigation arrows
  const handleSliderNavigation = (direction) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      if (direction === 'prev') {
        swiper.slidePrev();
      } else {
        swiper.slideNext();
      }
    }
  };
  const destinationRef = useRef(null);
  const handleScroll = (e) => {
    e.preventDefault();
    document.getElementById("destination-sec")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="hero-2" id="hero">
      <div className="hero2-overlay" style={{ backgroundImage: 'url(/assets/img/bg/line-pattern.png)'}} />
      {/* Main Swiper */}
      <Swiper
        modules={[Pagination, Navigation, Thumbs, EffectFade, Autoplay]} // Added necessary modules
        className="swiper hero-slider-2"
        id="heroSlide2"
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiperRef.current }} // Using thumbsSwiperRef to link thumbs swiper
        effect="fade"
        pagination={{
          el: '.slider-pagination',
          type: 'progressbar',
          clickable: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        watchSlidesProgress={true}
        ref={swiperRef} // Attach ref to the main swiper
      >
        <SwiperSlide>
          <div className="hero-inner">
            <div className="th-hero-bg" style={{ backgroundImage: 'url(/assets/img/hero/hero_bg_2_1.jpg)', backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
            <div className="container">
              <div className="hero-style2">
                <h1 className="hero-title" data-ani="slideinup" data-ani-delay="0.4s">
                  Discover <span className="hero-text">The beauty of world</span>
                </h1>
                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                  Tourm an international travel management company with 25 years of experience, specializing in business and maritime travel.
                </p>
                <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                  <Link to="/destination" className="th-btn white-btn th-icon">Explore Tours</Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero-inner">
            <video autoPlay loop muted>
              <source src="/assets/img/hero/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="container">
              <div className="hero-style2">
                <h1 className="hero-title" data-ani="slideinup" data-ani-delay="0.4s">
                  Explore <span className="hero-text">beauty of the whole world</span>
                </h1>
                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                  Provide a detailed itinerary of the tour, including the places you'll visit each day, any activities planned approximate times.
                </p>
                <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                  <Link to="/destination" className="th-btn white-btn th-icon">Explore Tours</Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero-inner">
            <div className="th-hero-bg" style={{ backgroundImage: 'url(/assets/img/hero/hero_bg_2_3.jpg)', backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
            <div className="container">
              <div className="hero-style2">
                <h1 className="hero-title" data-ani="slideinup" data-ani-delay="0.4s">
                  Enjoy <span className="hero-text">The Most Enjoyable Journey</span>
                </h1>
                <p className="hero-desc" data-ani="slideinup" data-ani-delay="0.5s">
                  Tourm an international travel management company with 25 years of experience, specializing in business and maritime travel.
                </p>
                <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                  <Link to="/tour" className="th-btn white-btn th-icon">Explore Tours</Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      {/* Custom Navigation */}
      <div className="th-swiper-custom">
        <div className="slider-pagination" />
        <div className="hero-icon">
          <button data-slider-prev="#heroSlide2" className="hero-arrow slider-prev" onClick={() => handleSliderNavigation('prev')}>
            <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
          </button>
          <button data-slider-next="#heroSlide2" className="hero-arrow slider-next" onClick={() => handleSliderNavigation('next')}>
            <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
          </button>
        </div>
      </div>
      {/* Thumbs Swiper */}
      <Swiper
        modules={[Pagination, Navigation, A11y]}
        className="heroThumbs style2"
        id="heroSlide3"
        spaceBetween={10}
        slidesPerView={2}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.slider-next',
          prevEl: '.slider-prev',
        }}
        loop={true}
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        centeredSlidesBounds={true}
        ref={thumbsSwiperRef} // Attach ref to the thumbs swiper
      >
        <SwiperSlide>
          <div className="hero-inner">
            <div className="hero-card">
              <div className="hero-img">
                <img src="/assets/img/hero/hero_bg_2_1.jpg" alt="" />
              </div>
              <div className="hero-card_content">
                <h3 className="box-title">Mountain Tour</h3>
                <h4 className="hero-card_price"><span className="currency">$850.00</span>/Person</h4>
                <span className="d-block"><i className="fa-light fa-clock" />7 Days</span>
                <Link to="/destination/1" className="th-btn style2">Book Now</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero-inner">
            <div className="hero-card">
              <div className="hero-img">
                <img src="/assets/img/hero/hero_bg_2_2.jpg" alt="" />
              </div>
              <div className="hero-card_content">
                <h3 className="box-title">Yachts Tour</h3>
                <h4 className="hero-card_price"><span className="currency">$750.00</span>/Person</h4>
                <span className="d-block"><i className="fa-light fa-clock" />6 Days</span>
                <Link to="/destination/1" className="th-btn style2">Book Now</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="hero-inner">
            <div className="hero-card">
              <div className="hero-img">
                <img src="/assets/img/hero/hero_bg_2_3.jpg" alt="" />
              </div>
              <div className="hero-card_content">
                <h3 className="box-title">Mountain Tour</h3>
                <h4 className="hero-card_price"><span className="currency">$850.00</span>/Person</h4>
                <span className="d-block"><i className="fa-light fa-clock" />7 Days</span>
                <Link to="/destination/1" className="th-btn style2">Book Now</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* Add more SwiperSlides here as needed */}
      </Swiper>
      <div className="scroll-down">
        <Link to="/#destination-sec" onClick={handleScroll} className="scroll-wrap">
          <span>
            <img src="/assets/img/icon/down-arrow.svg" alt="" />
          </span>
          Scroll Down
        </Link>
      </div>
    </div>
  );
}
export default BannerTwo;