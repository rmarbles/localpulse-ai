'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. EMBEDDABLE WIDGET COMPONENT
// ==========================================
export function LocalPulseWidget({ businessName, primaryColor = '#2563eb' }) {
  const [reviews] = useState([
    { author: "Sarah M.", rating: 5, text: "Absolutely incredible service! Fast, professional, and reliable." },
    { author: "David K.", rating: 5, text: "Highly recommend! Arrived on time and went above and beyond." }
  ]);
  const [leadText, setLeadText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadText) return;
    
    await fetch('/api/lead-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadText, businessName })
    });
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', maxWidth: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{businessName || 'Your Business'}</h4>
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '13px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>★ 5.0 Rated</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <div style={{ fontWeight: '600', color: '#334155' }}>{r.author}</div>
            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Need a Fast Quote?</p>
        {submitted ? (
          <div style={{ color: '#16a34a', fontSize: '14px', fontWeight: '500' }}>✓ Request sent! We will text you shortly.</div>
        ) : (
          <form onSubmit={handleLeadSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Your Phone or Question..." 
              value={leadText}
              onChange={(e) => setLeadText(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
            />
            <button type="submit" style={{ backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 16px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' }}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. CLIENT DASHBOARD COMPONENT
// ==========================================
function CustomerDashboard({ businessName, email, onLogout }) {
  const [googleUrl, setGoogleUrl] = useState('');
  const [widgetColor, setWidgetColor] = useState('#2563eb');
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://localpulse-ai.vercel.app/widget.js" data-business="${encodeURIComponent(businessName)}" data-color="${widgetColor}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{businessName} Dashboard</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Account Email: <strong>{email}</strong> | <span style={{ color: '#16a34a', fontWeight: 'bold' }}>14-Day Free Trial Active</span></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}>Log Out</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left Column: Settings & Installation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Step 1: Connect Google Profile */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>1. Connect Google Business Profile</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Paste your Google Maps link to sync live reviews.</p>
            <input 
              type="text" 
              placeholder="https://maps.google.com/..." 
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            <button style={{ backgroundColor: '#0f172a', color: '#fff', padding: '10px 16px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Sync Reviews Now</button>
          </div>

          {/* Step 2: Widget Embed Code */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>2. Installation Code</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Copy and paste this script tag into your website HTML (Wix, Squarespace, WordPress, Webflow).</p>
            
            <pre style={{ backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', border: '1px solid #e2e8f0' }}>{embedCode}</pre>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={copyToClipboard} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                {copied ? '✓ Code Copied!' : 'Copy Code'}
              </button>
              <a href={`mailto:developer@yourwebsite.com?subject=LocalPulse Widget Setup&body=Please paste this snippet onto our site: ${encodeURIComponent(embedCode)}`} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                Email to My Web Developer
              </a>
            </div>
          </div>

          {/* Step 3: Upgrade to Paid Plan */}
          <div style={{ backgroundColor: '#eff6ff', padding: '24px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e40af' }}>Subscription Status</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#1e3a8a' }}>Your 14-day trial ends soon. Lock in your $49/month rate to keep receiving website leads uninterrupted.</p>
            <a href="https://buy.stripe.com/test_placeholder" style={{ display: 'inline-block', backgroundColor: '#16a34a', color: '#fff', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
              Activate Paid Plan ($49/mo) →
            </a>
          </div>

        </div>

        {/* Right Column: Live Customize Preview */}
        <div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Live Widget Preview</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Accent Button Color</label>
              <input 
                type="color" 
                value={widgetColor} 
                onChange={(e) => setWidgetColor(e.target.value)}
                style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              />
            </div>

            <LocalPulseWidget businessName={businessName} primaryColor={widgetColor} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. ADMIN FOUNDER PORTAL (FOR YOU)
// ==========================================
function AdminPortal() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#0f172a' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Founder Executive Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Real-time business performance & active client metrics.</p>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Total Signups</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#2563eb', marginTop: '8px' }}>12</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Active Paid Clients</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#16a34a', marginTop: '8px' }}>3</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Monthly Run Rate (MRR)</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginTop: '8px' }}>$147/mo</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Recent Client Activity</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Business Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Austin Mobile Detail</td>
              <td style={{ padding: '12px' }}>owner@austindetail.com</td>
              <td style={{ padding: '12px', color: '#16a34a' }}>Active</td>
              <td style={{ padding: '12px' }}>$49/mo</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>Precision Roofing</td>
              <td style={{ padding: '12px' }}>info@precisionroof.com</td>
              <td style={{ padding: '12px', color: '#d97706' }}>Trial (Day 4)</td>
              <td style={{ padding: '12px' }}>Free Trial</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN SAAS LANDING PAGE
// ==========================================
export default function LocalPulseSaaS() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(false);

  useEffect(() => {
    // URL Parameter detection for magic login links from email
    const params = new URLSearchParams(window.location.search);
    const bName = params.get('business');
    const uEmail = params.get('email');
    const isAdmin = params.get('admin');

    if (isAdmin === 'true') setViewAdmin(true);
    if (bName && uEmail) setActiveUser({ businessName: bName, email: uEmail });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    await fetch('/api/onboard-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, email })
    });
    setActiveUser({ businessName, email });
  };

  if (viewAdmin) return <AdminPortal />;
  if (activeUser) return <CustomerDashboard businessName={activeUser.businessName} email={activeUser.email} onLogout={() => setActiveUser(null)} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Turn Website Visitors Into Instant Local Clients
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Display verified 5-star Google reviews and an instant quote box directly on your website to increase leads by up to 30%.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', textAlign: 'left', backgroundColor: '#1e293b', padding: '36px', borderRadius: '16px', border: '1px solid #334155' }}>
          
          {/* Sign Up Column */}
          <div>
            <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Activate Your Free Trial</h3>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '24px' }}>No credit card required. Setup takes under 60 seconds.</p>
            
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Business Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Austin Mobile Auto Detail" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Work Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="owner@yourbusiness.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                Launch My Dashboard →
              </button>
            </form>
          </div>

          {/* Live Preview Column */}
          <div>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 'bold', marginBottom: '12px' }}>Live Widget Preview</div>
            <LocalPulseWidget businessName={businessName || "Your Business"} />
          </div>

        </div>
      </div>
    </div>
  );
}
