import React, { useState } from 'react';

export default function CallbackCard() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    agreed: false
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
        alert("Please accept the privacy policy.");
        return;
    }
    setStatus('sending');

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: 'Callback Request',
          phone: '+91' + formData.phone,
          email: formData.email,
          message: 'User requested a callback.'
        })
      });

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ phone: '', email: '', agreed: false });
      }, 4000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="widget" style={{ padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 5px 20px rgba(0,0,0,0.02)', backgroundColor: '#fff', marginBottom: '30px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .callback-input::placeholder {
            color: #0c486e !important;
            opacity: 0.7;
            font-weight: 500;
        }
        .callback-input {
            color: #0c486e !important;
            font-weight: 600 !important;
        }
        .callback-icon {
            color: #0c486e !important;
        }
      `}} />
      <h3 style={{ color: '#0c486e', fontSize: '20px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px' }}>
        Want us to call you?
      </h3>

      {status === 'success' ? (
        <div className="alert alert-success text-center py-3" style={{ fontSize: '14px', borderRadius: '8px' }}>
           Thank you! We'll call you back soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status === 'error' && (
            <div className="alert alert-danger py-2" style={{ fontSize: '14px' }}>Something went wrong.</div>
          )}
          
          <div className="mb-3 position-relative">
            <div className="input-group" style={{ border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
              <span className="input-group-text border-0 callback-icon" style={{ paddingRight: 0, fontWeight: '600', backgroundColor: 'transparent' }}>
                +91 <i className="fa-solid fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
              </span>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="form-control border-0 callback-input" 
                placeholder="Enter Mobile Number" 
                required 
                style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          <div className="mb-4 position-relative">
            <div className="input-group" style={{ border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
              <span className="input-group-text border-0 callback-icon" style={{ backgroundColor: 'transparent' }}>
                <i className="fa-regular fa-envelope"></i>
              </span>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="form-control border-0 callback-input" 
                placeholder="Enter Email Address" 
                required 
                style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          <div className="form-check mb-4 d-flex align-items-start gap-2">
            <input 
              className="form-check-input mt-1" 
              type="checkbox" 
              name="agreed"
              id="callbackPolicyCheck"
              checked={formData.agreed}
              onChange={handleChange}
              required
              style={{ cursor: 'pointer', flexShrink: 0 }}
            />
            <label className="form-check-label text-muted" htmlFor="callbackPolicyCheck" style={{ fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
              I accept the <a href="/terms" style={{ color: '#0c486e', fontWeight: '600' }}>Privacy Policy</a> and authorize Fremor Global to contact me with details.
            </label>
          </div>

          <button 
            type="submit" 
            className="th-btn w-100 d-flex justify-content-center align-items-center gap-2" 
            disabled={status === 'sending'}
            style={{ 
              borderRadius: '30px', 
              padding: '15px', 
              fontWeight: '600',
              border: 'none',
              transition: 'all 0.3s'
            }}
          >
            {status === 'sending' ? 'Submitting...' : (
              <>
                Get a Callback <i className="fa-solid fa-arrow-right" style={{ transform: 'rotate(-45deg)', fontSize: '15px' }}></i>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
