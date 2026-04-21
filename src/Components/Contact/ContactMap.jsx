import React from 'react'

function ContactMap() {
    return (
        <div className="">
            <div className="container-fluid">
                <div className="contact-map style2">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.497982798968!2d72.8262168768172!3d18.99776585442083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cef2d9f22acb%3A0x2c82fb36993053bd!2sUrmi%20Estate!5e0!3m2!1sen!2sin!4v1776748971266!5m2!1sen!2sin"
                        allowFullScreen=""
                        loading="lazy"
                    />
                    <div className="contact-icon">
                        <img src="assets/img/icon/location-dot3.svg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactMap
