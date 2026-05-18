import React, { useState } from 'react';

const TestimonialTwo = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseOver = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="testimonial-area2 overflow-hidden space" id="testi-sec">
      <div className="container shape-mockup-wrap">
        <div className="title-area text-center">
          <span className="sub-title">Testimonial</span>
          <h2 className="sec-title">What Client Say About us</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="testi-review" style={{ backgroundImage: "url('/assets/img/bg/map.png')" }}>
              {/* Testimonial 1 */}
              <div
                className={`testi-box hover-item ${activeIndex === 0 ? 'item-active' : ''}`}
                onMouseOver={() => handleMouseOver(0)}
              >
                <div className="testi-box_content feature-card-active-wrap">
                  <p className="testi-box_text">
                    “A home that perfectly blends sustainability with luxury until discovered Ecoland Residence. The moment I stepped into the community, I knew it was where I wanted to live.”
                  </p>
                  <div className="testi-box_review">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <div className="testi-box_profile">
                  <div className="testi-box_avater">
                    <span></span>
                    <img src="/assets/img/testimonial/testi_2_1.png" alt="testimonial" />
                  </div>
                  <div className="media-body">
                    <h3 className="box-title">Andrew Simon</h3>
                    <span className="testi-box_desig">Traveller</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div
                className={`testi-box hover-item ${activeIndex === 1 ? 'item-active' : ''}`}
                onMouseOver={() => handleMouseOver(1)}
              >
                <div className="testi-box_content feature-card-active-wrap">
                  <p className="testi-box_text">
                    “The home boasts sleek, contemporary architecture with clean lines and expansive windows, allowing natural light to flood the interiors. It incorporates passive design principles.”
                  </p>
                  <div className="testi-box_review">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <div className="testi-box_profile">
                  <div className="testi-box_avater">
                    <span></span>
                    <img src="/assets/img/testimonial/testi_2_2.png" alt="testimonial" />
                  </div>
                  <div className="media-body">
                    <h3 className="box-title">Maria Doe</h3>
                    <span className="testi-box_desig">Traveller</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div
                className={`testi-box hover-item ${activeIndex === 2 ? 'item-active' : ''}`}
                onMouseOver={() => handleMouseOver(2)}
              >
                <div className="testi-box_content feature-card-active-wrap">
                  <p className="testi-box_text">
                    “Solar panels adorn the roof, harnessing renewable energy to power into the grid. High-performance insulation and triple-glazed windows ensure optimal energy efficiency.”
                  </p>
                  <div className="testi-box_review">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <div className="testi-box_profile">
                  <div className="testi-box_avater">
                    <span></span>
                    <img src="/assets/img/testimonial/testi_2_3.png" alt="testimonial" />
                  </div>
                  <div className="media-body">
                    <h3 className="box-title">Angelina Rose</h3>
                    <span className="testi-box_desig">Traveller</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div
                className={`testi-box hover-item ${activeIndex === 3 ? 'item-active' : ''}`}
                onMouseOver={() => handleMouseOver(3)}
              >
                <div className="testi-box_content feature-card-active-wrap">
                  <p className="testi-box_text">
                    “A sophisticated rainwater harvesting system and non-potable uses, reducing reliance on municipal water sources. Greywater systems also contribute to sustainability.”
                  </p>
                  <div className="testi-box_review">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <div className="testi-box_profile">
                  <div className="testi-box_avater">
                    <span></span>
                    <img src="/assets/img/testimonial/testi_2_4.png" alt="testimonial" />
                  </div>
                  <div className="media-body">
                    <h3 className="box-title">Michel Carlos</h3>
                    <span className="testi-box_desig">Traveller</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div
                className={`testi-box hover-item ${activeIndex === 4 ? 'item-active' : ''}`}
                onMouseOver={() => handleMouseOver(4)}
              >
                <div className="testi-box_content feature-card-active-wrap">
                  <p className="testi-box_text">
                    “Throughout the interior, eco-friendly materials like reclaimed wood, create a luxurious yet sustainable ambiance. It's the perfect combination of style and eco-consciousness.”
                  </p>
                  <div className="testi-box_review">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <div className="testi-box_profile">
                  <div className="testi-box_avater">
                    <span></span>
                    <img src="/assets/img/testimonial/testi_2_5.png" alt="testimonial" />
                  </div>
                  <div className="media-body">
                    <h3 className="box-title">Michel Smith</h3>
                    <span className="testi-box_desig">Traveller</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shapes */}
        <div className="shape-mockup movingX d-none d-xl-block" style={{ top: '30%', left: '-9%' }}>
          <img className="gmovingX" src="/assets/img/shape/shape_7.png" alt="shape" />
        </div>
        <div className="shape-mockup spin d-none d-xl-block" style={{ bottom: '30%', right: '-10%' }}>
          <img src="/assets/img/shape/shape_2_5.png" alt="shape" />
        </div>
        <div className="shape-mockup jump d-none d-xl-block" style={{ bottom: '0%', left: '-5%' }}>
          <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialTwo;
