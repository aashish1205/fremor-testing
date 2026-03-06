import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // Import navigation styles
import 'swiper/css/pagination'; // Import pagination styles
import { Link } from 'react-router-dom';

function TourOne() {
  return (
    <section
      className="tour-area position-relative bg-top-center overflow-hidden space bg-no-repeat"
      id="service-sec"
      style={{ backgroundImage: 'url(/assets/img/tour/tourbackground.jpg)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="title-area text-center">
              <span className="sub-title">Best Place For You</span>
              <h2 className="sec-title">Most Popular Tour</h2>
              <p className="sec-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        <div className="slider-area tour-slider">
          <Swiper
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            grabCursor={true}
            className="swiper th-slider has-shadow slider-drag-wrap"
          >
            <SwiperSlide key="tour1">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/greece.jpg" alt="Greece Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Greece Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour2">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/Italy.jpg" alt="Italy Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Italy Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour3">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/dubai.jpg" alt="Dubai Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Dubai Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour4">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/switzerland.jpg" alt="Switzerland Tour" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Switzerland Tour</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour5">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/tour_box_1.jpg" alt="Greece Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Greece Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour6">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/tour_box_2.jpg" alt="Italy Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Italy Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour7">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/tour_box_3.jpg" alt="Dubai Tour Package" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Dubai Tour Package</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide key="tour8">
              <div className="tour-box th-ani gsap-cursor">
                <div className="tour-box_img global-img">
                  <img src="/assets/img/tour/tour_box_4.jpg" alt="Switzerland Tour" />
                </div>
                <div className="tour-content">
                  <h3 className="box-title">
                    <Link to="/tour-details">Switzerland Tour</Link>
                  </h3>
                  <div className="tour-rating">
                    <div className="star-rating" role="img" aria-label="Rated 5.00 out of 5">
                      <span style={{ width: '100%' }}>
                        Rated <strong className="rating">5.00</strong> out of 5 based on{' '}
                        <span className="rating">4.8</span> (4.8 Rating)
                      </span>
                    </div>
                    <Link to="/tour-details" className="woocommerce-review-link">
                      (<span className="count">4.8</span> Rating)
                    </Link>
                  </div>
                  <h4 className="tour-box_price">
                    <span className="currency">$980.00</span>/Person
                  </h4>
                  <div className="tour-action">
                    <span>
                      <i className="fa-light fa-clock" />7 Days
                    </span>
                    <Link to="/contact" className="th-btn style4 th-icon">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TourOne;
