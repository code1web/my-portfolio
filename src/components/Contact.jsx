import { useState } from 'react';
import './Contact.css';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = ({ email }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Email error:', error);
      setStatus('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(''), 5000);
    }
  };
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info glass-panel">
            <h3>Let's talk about everything!</h3>
            <p>Feel free to reach out for collaborations or just a friendly hello.</p>

            <div className="info-items">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <h4>Email</h4>
                  <p>{email}</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhoneAlt className="info-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91 8368009114</p>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <h4>Location</h4>
                  <p>South Delhi, Badarpur</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form glass-panel" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            
            {status && (
              <div style={{ color: status.includes('success') ? '#059669' : '#dc2626', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {status}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
