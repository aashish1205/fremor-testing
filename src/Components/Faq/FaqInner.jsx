import React, { useState, useRef, useEffect } from "react";

function FaqInner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]); // Store refs for each accordion item

    const faqs = [
        {
            question: "How do I book a trip with you?",
            answer:
                "You can book directly through our website, connect with our travel experts, or submit an inquiry form. Our team will guide you through every step.",
        },
        {
            question: "Can I customize my travel itinerary?",
            answer:
                "Yes, absolutely. We specialize in personalized travel experiences. You can modify hotels, activities, destinations, and travel dates as per your preference",
        },
        {
            question: "How far in advance should I book my trip?",
            answer:
                "We recommend booking at least 30–45 days in advance for international trips and 15–20 days for domestic travel to get the best rates and availability.",
        },
        {
            question: "Do you assist with visa processing?",
            answer:
                "Yes, we provide complete visa assistance including documentation, application guidance, and appointment booking.",
        },
        {
            question: "What if my visa gets rejected?",
            answer:
                "In case of visa rejection, service charges and visa fees are non-refundable. However, we assist you in reapplying if required.",
        },
        {
            question: "Is travel insurance included?",
            answer:
                "Travel insurance can be included on request or else and is highly recommended for international trips.",
        },
         {
            question: "What kind of accommodations do you provide?",
            answer:
                "We partner with carefully selected 3★, 4★, and 5★ hotels, resorts, and boutique stays to ensure comfort and quality.",
        },
         {
            question: "What payment methods do you accept?",
            answer:
                "We accept bank transfers, credit/debit cards, UPI, and other secure payment options for your convenience.",
        },
         {
            question: "Is a deposit required to confirm my booking?",
            answer:
                "Yes, a partial deposit is required to secure your booking, with the remaining balance payable before departure.",
        },
        {
            question: "Can I make changes after booking?",
            answer:
                "Yes, modifications are possible depending on availability and supplier policies. Additional charges may apply.",
        },
        {
            question: "Will I get support during my trip?",
            answer:
                "Yes, our team provides 24/7 on-trip assistance to ensure a seamless and worry-free experience",
        },
        {
            question: "What is your cancellation policy?",
            answer:
                "Cancellation policies vary depending on the destination and service providers. Detailed terms will be shared at the time of booking.",
        },
        {
            question: "How long do refunds take?",
            answer:
                "Refund timelines depend on airlines, hotels, and vendors, but we ensure timely processing and updates.",
        },
        {
            question: "Why should I choose your travel company?",
            answer:
                "We focus on curated experiences, personalized service, competitive pricing, and seamless execution—so you can travel with complete peace of mind.",
        },
        {
            question: "Do you offer group discounts or special deals?",
            answer:
                "Yes, we provide exclusive offers for group bookings, early-bird deals, and seasonal promotions.",
        },    
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        // Dynamically set max-height for smooth transition
        contentRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.style.maxHeight = activeIndex === index ? `${ref.scrollHeight}px` : "0px";
            }
        });
    }, [activeIndex]);

    return (
        <div className="space-top space-extra-bottom">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title">FAQ</span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p>Have questions you want answers to?</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="accordion-area mb-30">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`accordion-card style2 ${activeIndex === index ? "active" : ""}`}
                                >
                                    <div className="accordion-header">
                                        <button
                                            className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            Q{index + 1}. {faq.question}
                                        </button>
                                    </div>
                                    <div
                                        ref={(el) => (contentRefs.current[index] = el)}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body">
                                            <p className="faq-text">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FaqInner;
