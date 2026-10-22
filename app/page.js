'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. EMBEDDABLE WIDGET COMPONENT
// ==========================================
export function LocalPulseWidget({ businessName, primaryColor = '#2563eb' }) {
  const [reviews] = useState([
    { author: "Sarah M.", rating: 5, text: "Incredible service! Fast, professional, and reliable." },
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
  const [synced, setSynced] = useState(false);
  
  // Set to true to simulate last 7 days of trial
  const [daysRemaining] = useState(14); 

  const embedCode = `<script src="https://localpulse-ai.vercel.app/widget.js" data-business="${encodeURIComponent(businessName)}" data-color="${widgetColor}"></script>`;

  const handleSync = () => {
    if (!googleUrl) {
      alert("Please paste your Google Maps link first!\n\nHow to find it:\n1. Click the Google Maps link above\n2. Search for your business\n3. Click 'Share' and copy the link.");
      return;
    }
    setSynced(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Safely formatted mailto string for native email clients
  const emailSubject = encodeURIComponent(`LocalPulse Widget Setup for ${businessName}`);
  const emailBody = encodeURIComponent(`Hi,\n\nPlease add our review widget snippet to our website HTML before the closing </body> tag:\n\n${embedCode}\n\nThanks!`);
  const mailtoUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{businessName} Dashboard</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Account: <strong>{email}</strong> | <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{daysRemaining} Days Remaining in Free Trial</span></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}>Log Out</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left Column: Settings & Installation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Step 1: Connect Google Profile */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>1. Connect Google Business Profile</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
              Search your business on <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline' }}>Google Maps</a>, click <strong>Share</strong>, and paste your link below:
            </p>
            <input 
              type="text" 
              placeholder="e.g. https://maps.app.goo.gl/..." 
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            <button onClick={handleSync} style={{ backgroundColor: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {synced ? '✓ Google Reviews Connected' : 'Sync Reviews Now'}
            </button>
          </div>

          {/* Step 2: Widget Embed Code */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>2. Installation Code</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Copy this script tag onto your website (Wix, Squarespace, WordPress, Webflow):</p>
            
            <pre style={{ backgroundColor: '#f1f5f9', padding: '14px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', border: '1px solid #e2e8f0' }}>{embedCode}</pre>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={copyToClipboard} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                {copied ? '✓ Code Copied!' : 'Copy Code'}
              </button>
              <a href={mailtoUrl} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }}>
                Email to My Web Developer
              </a>
            </div>
          </div>

          {/* Step 3: Conditional Offers (Shown in last 7 days of trial) */}
          {daysRemaining <= 7 ? (
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>Select Your Growth Plan</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Lock in your savings before your free trial expires:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="https://buy.stripe.com/test_monthly" style={{ display: 'block', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '8px', textDecoration: 'none', color: '#0f172a' }}>
                  <strong>Monthly Standard:</strong> $49/month
                </a>
                <a href="https://buy.stripe.com/test_3month" style={{ display: 'block', backgroundColor: '#eff6ff', border: '2px solid #2563eb', padding: '14px', borderRadius: '8px', textDecoration: 'none', color: '#1e40af' }}>
                  <strong>3-Month Pass:</strong> $99 one-time <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SAVE $48</span>
                </a>
                <a href="https://buy.stripe.com/test_annual" style={{ display: 'block', backgroundColor: '#f0fdf4', border: '1px solid #86efac', padding: '14px', borderRadius: '8px', textDecoration: 'none', color: '#166534' }}>
                  <strong>6-Month VIP Pass:</strong> $245 one-time <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Pay 5 Months, Get 6th Month FREE</span>
                </a>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#166534' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>🎉 Free Trial Active</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#15803d' }}>Enjoy full access to your review widget. Payment options will unlock during your final trial week!</p>
            </div>
          )}

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
// 3. MAIN SAAS LANDING PAGE
// ==========================================
export default function LocalPulseSaaS() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bName = params.get('business');
    const uEmail = params.get('email');
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

  if (activeUser) return <CustomerDashboard businessName={activeUser.businessName} email={activeUser.email} onLogout={() => setActiveUser(null)} />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Turn Website Visitors Into Instant Local Clients
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Display verified 5-star Google reviews and an instant quote box directly on your website to increase leads on autopilot.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', textAlign: 'left', backgroundColor: '#1e293b', padding: '36px', borderRadius: '16px', border: '1px solid #334155' }}>
          
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

          <div>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 'bold', marginBottom: '12px' }}>Live Widget Preview</div>
            <LocalPulseWidget businessName={businessName || "Your Business"} />
          </div>

        </div>
      </div>
    </div>
  );
}
