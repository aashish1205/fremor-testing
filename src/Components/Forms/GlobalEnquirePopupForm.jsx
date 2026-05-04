import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './EnquirePopupForm.css';

export default function GlobalEnquirePopupForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    destination: '',
    fullName: '',
    contactNumber: '',
    emailAddress: '',
    agreedToTerms: false
  });

  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert("Please agree to the User Agreement & Privacy Policy");
      return;
    }
    
    setStatus('sending');

    try {
      const { error: dbError } = await supabase
        .from('enquiries')
        .insert([{
          destination_title: formData.destination,
          full_name: formData.fullName,
          email_address: formData.emailAddress,
          contact_number: formData.contactNumber,
        }]);

      if (dbError) console.error("Supabase Error:", dbError);

      let emailMessage = `
Quick Destination Callback Request:
Name: ${formData.fullName}
Email: ${formData.emailAddress}
Contact: ${formData.contactNumber}
Destination: ${formData.destination}
      `;

      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'Destination Quick Callback',
          name: formData.fullName,
          email: formData.emailAddress,
          phone: formData.contactNumber,
          country: formData.destination,
          message: emailMessage
        })
      });

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
        setFormData({ destination: '', fullName: '', contactNumber: '', emailAddress: '', agreedToTerms: false });
      }, 4000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="enquire-modal-overlay" style={{ zIndex: 9999 }}>
      <div className="enquire-modal-content" style={{ maxWidth: '600px', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="enquire-modal-header py-3 px-4 bg-white border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
             <div style={{
                width: '45px', height: '45px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', flexShrink: 0
             }}>
                <i className="fa-solid fa-map-location-dot"></i>
             </div>
             <div>
               <h4 className="m-0 text-white" style={{ fontSize: '1.25rem', fontWeight: '700' }}>Planning your destination?</h4>
               <p className="m-0 text-white" style={{ fontSize: '0.85rem' }}>Let our destination experts guide you through the top routes and book the one that suits you best. Please confirm your details.</p>
             </div>
          </div>
          <button onClick={onClose} className="btn text-white fs-5 p-0 ms-2" aria-label="Close" style={{ border: 'none', background: 'transparent' }}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="enquire-modal-body p-4 bg-white">
          {status === 'success' ? (
            <div className="alert alert-success text-center">
              <h5><i className="fa-solid fa-circle-check"></i> Request Submitted!</h5>
              <p className="m-0">Thank you! Our destination experts will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="alert alert-danger py-2">Something went wrong. Please try again.</div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Destination*</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="form-control py-2" placeholder="Destination" required />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Full Name*</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control py-2" placeholder="Full Name" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Mobile No.*</label>
                  <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-control py-2" placeholder="Mobile Number" required />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>Email*</label>
                <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="form-control py-2" placeholder="Email id" required />
              </div>

              <div className="form-check mb-4 d-flex align-items-center gap-2">
                <input className="form-check-input mt-0" type="checkbox" name="agreedToTerms" id="termsCheck" checked={formData.agreedToTerms} onChange={handleChange} required style={{ cursor: 'pointer' }} />
                <label className="form-check-label text-muted small" htmlFor="termsCheck" style={{ cursor: 'pointer' }}>
                  I have read and agree to the <a href="/terms" target="_blank" className="text-primary text-decoration-none">User Agreement</a> & <a href="/terms" target="_blank" className="text-primary text-decoration-none">Privacy Policy</a>.
                </label>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary py-2 fw-bold text-white" style={{ borderRadius: '8px', background: '#0d6efd', border: 'none' }} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
