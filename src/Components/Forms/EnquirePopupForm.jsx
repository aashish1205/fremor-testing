import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './EnquirePopupForm.css';

export default function EnquirePopupForm({ isOpen, onClose, destinationTitle }) {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    contactNumber: '',
    cityOfResidence: '',
    
    destination: destinationTitle || '',
    departureCity: '',
    travelStartDate: '',
    travelEndDate: '',
    
    noOfAdults: '1',
    noOfChildren: '0',
    childrenAge: ''
  });

  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // 1. Send data to Supabase (assuming 'enquiries' table is created without strict RLS)
      const { error: dbError } = await supabase
        .from('enquiries')
        .insert([{
          destination_title: formData.destination,
          full_name: formData.fullName,
          email_address: formData.emailAddress,
          contact_number: formData.contactNumber,
          city_of_residence: formData.cityOfResidence,
          departure_city: formData.departureCity,
          travel_start_date: formData.travelStartDate || null,
          travel_end_date: formData.travelEndDate || null,
          no_of_adults: parseInt(formData.noOfAdults) || 1,
          no_of_children: parseInt(formData.noOfChildren) || 0,
          children_age: formData.childrenAge
        }]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
      }

      // 2. Send Email through existing API route mapped in vite.config.js
      let emailMessage = `
Personal Details:
Name: ${formData.fullName}
Email: ${formData.emailAddress}
Contact: ${formData.contactNumber}
City: ${formData.cityOfResidence}

Travel Details:
Destination: ${formData.destination}
Departure: ${formData.departureCity}
Travel Dates: ${formData.travelStartDate} to ${formData.travelEndDate}

Passenger Details:
Adults: ${formData.noOfAdults}, Children: ${formData.noOfChildren} (Ages: ${formData.childrenAge})
      `;

      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'Tour Package',
          name: formData.fullName,
          email: formData.emailAddress,
          phone: formData.contactNumber,
          country: formData.destination,
          travelDate: formData.travelStartDate,
          travellers: formData.noOfAdults,
          message: emailMessage
        })
      });

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose(); // auto close on success
      }, 4000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="enquire-modal-overlay">
      <div className="enquire-modal-content">
        <div className="enquire-modal-header py-3 px-4 bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="m-0 text-white">Enquire Now</h4>
          <button onClick={onClose} className="btn text-white fs-5 p-0" aria-label="Close" style={{ border: 'none', background: 'transparent' }}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="enquire-modal-body p-4">
          {status === 'success' ? (
            <div className="alert alert-success text-center">
              <h5><i className="fa-solid fa-circle-check"></i> Enquiry Submitted!</h5>
              <p className="m-0">Thank you for enquiring about {formData.destination}. Our experts will contact you soon!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {status === 'error' && (
                <div className="alert alert-danger py-2">Something went wrong. Please try again.</div>
              )}

              <h5 className="text-secondary border-bottom pb-2 mb-3">1. Personal Details</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Email Address *</label>
                  <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Contact Number *</label>
                  <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">City of Residence</label>
                  <input type="text" name="cityOfResidence" value={formData.cityOfResidence} onChange={handleChange} className="form-control" />
                </div>
              </div>

              <h5 className="text-secondary border-bottom pb-2 mb-3">2. Travel Details</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small">Destination</label>
                  <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Departure City</label>
                  <input type="text" name="departureCity" value={formData.departureCity} onChange={handleChange} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Travel Start Date *</label>
                  <input type="date" name="travelStartDate" value={formData.travelStartDate} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Travel End Date</label>
                  <input type="date" name="travelEndDate" value={formData.travelEndDate} onChange={handleChange} className="form-control" />
                </div>
              </div>

              <h5 className="text-secondary border-bottom pb-2 mb-3">3. Passenger Details</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label small">No. of Adults *</label>
                  <input type="number" name="noOfAdults" value={formData.noOfAdults} onChange={handleChange} className="form-control" min="1" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">No. of Children</label>
                  <input type="number" name="noOfChildren" value={formData.noOfChildren} onChange={handleChange} className="form-control" min="0" />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Children Age(s)</label>
                  <input type="text" name="childrenAge" value={formData.childrenAge} onChange={handleChange} className="form-control" placeholder="e.g. 5, 8" />
                </div>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="th-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
