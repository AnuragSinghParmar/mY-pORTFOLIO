import { useState } from 'react'
import { Github, Linkedin, Mail, Send } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Message sent! This is a demo - normally this would go to your backend.")
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/AnuragSinghParmar' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/anurag-parmar111/' },
    { name: 'Email', icon: Mail, url: 'mailto:anuragparmar8205@gmail.com' }
  ]

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        background: '#04050D',
        backgroundImage: 'radial-gradient(circle at 50% 10%, #05070D 0%, #02030A 100%)',
        padding: '6rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      <style>{`
        .contact-form {
          width: 100%;
          max-width: 600px;
          background: rgba(10, 15, 30, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 5;
        }

        .input-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .input-label {
          display: block;
          color: #E0E6FF;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          background: rgba(5, 8, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #E0E6FF;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #00E5FF;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
          background: rgba(10, 15, 35, 0.8);
        }

        .form-input::placeholder {
          color: #56617A;
        }

        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00E5FF, #7B61FF);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 229, 255, 0.4);
          filter: brightness(1.1);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .socials-footer {
          margin-top: auto;
          width: 100%;
          max-width: 1200px;
          padding: 4rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          z-index: 5;
        }

        .social-icons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .social-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8A95A5;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }

        .social-btn:hover {
          color: #fff;
          transform: translateY(-5px);
          border-color: #00E5FF;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
          background: rgba(0, 229, 255, 0.05);
        }

        .footer-logo {
          font-weight: 300;
          letter-spacing: 5px;
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .copyright {
          color: #56617A;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        /* Ambient background detail */
        .ambient-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #00E5FF10 0%, transparent 70%);
          bottom: -300px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .contact-form {
            padding: 1.5rem;
          }
          .footer-logo {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Background elements */}
      <div className="ambient-glow" />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}>
        <h2 style={{ color: '#fff', fontSize: '2.5rem', margin: 0, letterSpacing: '4px', fontWeight: 300 }}>GET IN TOUCH</h2>
        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)', margin: '15px auto 0' }} />
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="your.email@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Message</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Your message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          ) : (
            <>
              Send Message <Send size={18} />
            </>
          )}
        </button>
      </form>

      <footer className="socials-footer">

        <div className="social-icons">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title={social.name}
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} — CREATED WITH PRECISION IN THE COSMOS
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
