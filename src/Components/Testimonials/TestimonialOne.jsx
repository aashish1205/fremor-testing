import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchTestimonials, getTestimonialImageSrc } from "../../services/testimonialService";

function TestimonialOne() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Error loading testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="testi-area overflow-hidden space shape-mockup-wrap" id="testi-sec">
        <div className="container-fluid p-0 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  // If no testimonials are available from the backend, we can optionally hide the section or show a fallback
  if (testimonials.length === 0) {
    return null; // Or render a placeholder if needed
  }

  return (
    <section className="testi-area overflow-hidden space shape-mockup-wrap" id="testi-sec">
      <div className="container-fluid p-0">
        <div className="title-area mb-20 text-center">
          <span className="sub-title">Testimonial</span>
          <h2 className="sec-title">What Clients Say About Us</h2>
        </div>
        <div className="slider-area">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            spaceBetween={30}
            centeredSlides={true}
            loop={testimonials.length > 2} // Only loop if we have enough slides
            slidesPerGroup={1}
            speed={1200}
            breakpoints={{
              0: { slidesPerView: 1 },
              767: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 2 },
              1400: { slidesPerView: 3 },
            }}
            className="testiSlider1 has-shadow"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div className="testi-card">
                  <div className="testi-card_wrapper">
                    <div className="testi-card_profile">
                      <div className="testi-card_avater">
                        <img 
                            src={getTestimonialImageSrc(item.image_url)} 
                            alt={item.name} 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </div>
                      <div className="media-body">
                        <h3 className="box-title">{item.name}</h3>
                        <span className="testi-card_desig">{item.designation}</span>
                      </div>
                    </div>
                    <div className="testi-card_review">
                      {[...Array(5)].map((_, i) => (
                        <i 
                            key={i} 
                            className="fa-solid fa-star" 
                            style={{ color: i < (item.rating || 5) ? '#FFB114' : '#e2e8f0' }} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="testi-card_text">{item.text}</p>
                  <div className="testi-card-quote">
                    <img src="/assets/img/icon/testi-quote.svg" alt="img" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="slider-pagination" />
        </div>
      </div>
      <div className="shape-mockup d-none d-xl-block" style={{ bottom: "-2%", right: "0%" }}>
        <img src="/assets/img/shape/line2.png" alt="shape" />
      </div>
      <div className="shape-mockup movingX d-none d-xl-block" style={{ top: "30%", left: "5%" }}>
        <img src="/assets/img/shape/shape_7.png" alt="shape" />
      </div>
    </section>
  );
}

export default TestimonialOne;
