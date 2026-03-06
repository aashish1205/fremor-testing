import React from "react";

const Cta = () => {
  return (
    <section
      className="cta-area"
      data-overlay="title"
      data-opacity={8}
      style={{ backgroundImage: "url(assets/img/bg/cta_bg_1.png)" }}
    >
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-5 px-xl-4 text-center">
            <div className="title-area mb-30 mt-n3">
              <h2 className="sec-title text-white text-capitalize">
                Get Updated with the Latest News
              </h2>
            </div>
            <form className="newsletter-form style3">
              <input
                className="form-control"
                type="email"
                placeholder="Enter Email"
                required
              />
              <button type="submit" className="th-btn style1 btn-fw">
                Subscribe Now
                <img src="assets/img/icon/plane2.svg" alt="Subscribe" className="ms-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
