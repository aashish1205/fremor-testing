import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

function TestimonialThree() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <section className="testi-area3 bg-bottom-center overflow-hidden space" id="testi-sec"
            style={{ backgroundImage: "url(/assets/img/bg/map.png)", backgroundRepeat:"no-repeat" }}>
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title">Testimonials</span>
                    <h2 className="sec-title">Our Clients Feedback</h2>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-12">
                        {/* Main Swiper */}
                        <Swiper
                            modules={[Pagination, Thumbs]}
                            slidesPerView={1}
                            loop={true}
                            speed={1800}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}  // Pagination is now explicitly enabled
                            thumbs={{ swiper: thumbsSwiper }} // Link the main Swiper to thumbs swiper
                            className="th-slider testiSlide3 z-index-3"
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={index}>
                                    <div className="testi-grid">
                                        <div className="testi-grid_author">
                                            <img src={testimonial.image} alt="Avatar" />
                                        </div>
                                        <div className="testi-grid_content">
                                            <p className="testi-grid_text">{testimonial.text}</p>
                                            <h6 className="testi-grid_name box-title">{testimonial.name}</h6>
                                            <span className="testi-grid_desig">{testimonial.designation}</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
            {/* Thumbs Swiper */}
            <Swiper
                modules={[Thumbs]}
                slidesPerView={6}
                spaceBetween={7}
                loop={true}
                onSwiper={setThumbsSwiper} // Set thumbsSwiper when this Swiper is initialized
                className="th-slider testi-grid-thumb shape-mockup-wrap"
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="box-img">
                            <img src={testimonial.image} alt="Thumbnail" />
                        </div>
                    </SwiperSlide>

                ))}
                <div className="shape-mockup movingX d-none d-xl-block"
                    style={{
                        top: "0%",
                        left: "5%",
                    }}
                >
                    <img className="gmovingX" src="/assets/img/shape/shape_7.png" alt="shape" />
                </div>
                <div className="shape-mockup spin d-none d-xl-block"
                    style={{
                        bottom: "25%",
                        right: "5%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_5.png" alt="shape" />
                </div>
                <div className="shape-mockup jump d-none d-xl-block"
                    style={{
                        bottom: "30%",
                        left: "5%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
            </Swiper>
        </section>
    );
}

const testimonials = [
    {
        image: "/assets/img/testimonial/testi_3_1.png",
        text: "“A home that perfectly blends sustainability with luxury until discovered Ecoland Residence. The moment I stepped community, I knew it was where I wanted to live.”",
        name: "Andrew Simon",
        designation: "Traveller",
    },
    {
        image: "/assets/img/testimonial/testi_3_2.png",
        text: "“The home boasts sleek, contemporary architecture with clean lines and expansive windows, allowing natural light to flood the interiors It incorporates passive design principles”",
        name: "Maria Doe",
        designation: "Traveller",
    },
    {
        image: "/assets/img/testimonial/testi_3_3.png",
        text: "“Solar panels adorn the roof, harnessing renewable energy to power the home and even feed excess electricity back into the grid. High-performance insulation and triple-glazed”",
        name: "Angelina Rose",
        designation: "Traveller",
    },
    {
        image: "/assets/img/testimonial/testi_3_4.png",
        text: "A sophisticated rainwater harvesting system collects and filters rainwater for irrigation and non-potable uses, reducing reliance on municipal water sources. Greywater systems",
        name: "Michel Carlos",
        designation: "Traveller",
    },
    {
        image: "/assets/img/testimonial/testi_3_5.png",
        text: "Throughout the interior, eco-friendly materials like reclaimed wood, bamboo flooring, and recycled glass countertops create a luxurious yet sustainable ambiance.",
        name: "Michel Smith",
        designation: "Traveller",
    },
    {
        image: "/assets/img/testimonial/testi_3_6.png",
        text: "“A home that perfectly blends sustainability with luxury until discovered Ecoland Residence. The moment I stepped community, I knew it was where I wanted to live.”",
        name: "Jesmen",
        designation: "Traveller",
    },
];

export default TestimonialThree;
