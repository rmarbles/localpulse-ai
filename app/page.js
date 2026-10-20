'use client';

import React, { useState } from 'react';

// ==========================================
// 1. EMBEDDABLE WIDGET ENGINE (Client Component)
// ==========================================
export function LocalPulseWidget({ businessName, placeId }) {
  const [reviews] = useState([
    { author: "Sarah M.", rating: 5, text: "Absolutely incredible service! Fast, professional, and completely transformed our experience." },
    { author: "David K.", rating: 5, text: "Highly recommend! They arrived right on time and went above and beyond." }
  ]);
  const [leadText, setLeadText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadText) return;
    
    await fetch('/api/lead-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, leadText, businessName })
    });
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', maxWidth: '360px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{businessName} Reviews</h4>
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>★ 5.0 Rated</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
            <div style={{ fontWeight: '600', color: '#334155' }}>{r.author}</div>
            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Need a Fast Quote?</p>
        {submitted ? (
          <div style={{ color: '#16a34a', fontSize: '13px', fontWeight: '500' }}>✓ Request sent! We will text you shortly.</div>
        ) : (
          <form onSubmit={handleLeadSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="Your Phone or Question..." 
              value={leadText}
              onChange={(e) => setLeadText(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. SAAS LANDING PAGE & ONBOARDING
// ==========================================
export default function LocalPulseSaaS() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    await fetch('/api/onboard-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, email })
    });
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Turn Website Visitors Into Instant Local Clients
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '650px', margin: '0 auto 40px auto' }}>
          Embed your top 5-star Google reviews and an AI-powered lead capture box on your website in under 60 seconds.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', textAlign: 'left', backgroundColor: '#1e293b', padding: '32px', borderRadius: '16px', border: '1px solid #334155' }}>
          
          {/* Sign Up Column */}
          <div>
            <h3 style={{ fontSize: '24px', margin: '0 0 12px 0' }}>Activate Your Widget</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Start your 14-day trial. $49/mo after, cancel anytime.</p>
            
            {submitted ? (
              <div style={{ padding: '16px', backgroundColor: '#166534', borderRadius: '8px', color: '#f0fdf4' }}>
                🎉 <strong>Account Created!</strong> Check your email ({email}) for your instant embed script code.
              </div>
            ) : (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Business Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Austin Mobile Auto Detail" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Work Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="owner@yourbusiness.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                  Get Embed Code Now →
                </button>
              </form>
            )}
          </div>

          {/* Live Preview Column */}
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 'bold', marginBottom: '12px' }}>Live Widget Preview</div>
            <LocalPulseWidget businessName={businessName || "Your Business"} placeId="demo" />
          </div>

        </div>
      </div>
    </div>
  );
}
