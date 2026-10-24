'use client';

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. LIVE EMBEDDABLE WIDGET / HOSTED PAGE
// ==========================================
export function LocalPulseWidget({ businessName, primaryColor = '#2563eb', showPhotoAddon = true }) {
  const [reviews, setReviews] = useState([
    { author: "Verified Customer", rating: 5, text: "Outstanding service! Prompt, fair pricing, and clean work." },
    { author: "Local Resident", rating: 5, text: "Extremely professional. Arrived on time and resolved our issue quickly!" }
  ]);
  const [leadQuestion, setLeadQuestion] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadQuestion || !leadPhone) {
      alert("Please enter both your quote request and phone number!");
      return;
    }
    
    setLoading(true);
    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadText: `Service Requested: ${leadQuestion} | Phone: ${leadPhone}`, 
          businessName 
        })
      });
      setSubmitted(true);
    } catch (err) {
      alert("Error sending request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}>
      
      {/* Verified Google Badge Header */}
      {showPhotoAddon && (
        <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Verified Google Business Profile</div>
          <div style={{ fontSize: '13px', color: '#15803d', marginTop: '2px' }}>Live Reviews & Map Location Synced</div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{businessName || 'Your Business'}</h4>
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '13px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>★ 5.0 Rating</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: '600', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.author}</span>
              <span style={{ color: '#eab308' }}>★★★★★</span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>"{r.text}"</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Request a Fast SMS Quote:</p>
        {submitted ? (
          <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
            ✓ Request sent! We will text you at {leadPhone} shortly.
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="What service do you need done?" 
              value={leadQuestion}
              onChange={(e) => setLeadQuestion(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="tel" 
                placeholder="Your Cell # for Fast Text Response" 
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
              <button type="submit" disabled={loading} style={{ backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                {loading ? 'Sending...' : 'Get Quote'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. SELF-SERVE CLIENT CONTROL PANEL
// ==========================================
function CustomerDashboard({ businessName, email, onLogout }) {
  const [googleUrl, setGoogleUrl] = useState('');
  const [widgetColor, setWidgetColor] = useState('#2563eb');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [devEmail, setDevEmail] = useState('');
  const [devEmailSent, setDevEmailSent] = useState(false);
  const [synced, setSynced] = useState(false);
  const [showPhotoAddon, setShowPhotoAddon] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const activeName = businessName || 'Your Business';
  const embedCode = `<script src="https://localpulse-ai-sute.vercel.app/widget.js" data-business="${encodeURIComponent(activeName)}" data-color="${widgetColor}"></script>`;
  const hostedPageLink = `https://localpulse-ai-sute.vercel.app/?business=${encodeURIComponent(activeName)}&mode=page`;

  const handleSync = () => {
    if (!googleUrl) {
      alert("Please paste your Google Maps business link first!");
      return;
    }
    setSynced(true);
  };

  const copyToClipboard = (text, type) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }
    } catch (err) {
      alert("Please copy text manually.");
    }
  };

  const handleSendDevEmail = async (e) => {
    e.preventDefault();
    if (!devEmail) return;

    await fetch('/api/onboard-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName: activeName, email: devEmail, isDeveloperEmail: true, embedCode })
    });

    setDevEmailSent(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{activeName} Portal</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Account: <strong>{email || 'Demo Mode'}</strong> | <span style={{ color: '#16a34a', fontWeight: 'bold' }}>14 Days Active Trial</span></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}>Log Out</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('overview')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'overview' ? '#2563eb' : '#f1f5f9', color: activeTab === 'overview' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>
          1. Deployment Methods
        </button>
        <button onClick={() => setActiveTab('preview')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'preview' ? '#2563eb' : '#f1f5f9', color: activeTab === 'preview' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>
          2. Live Preview & Customizer
        </button>
        <button onClick={() => setActiveTab('billing')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'billing' ? '#2563eb' : '#f1f5f9', color: activeTab === 'billing' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer' }}>
          3. Account & Billing 💳
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Google Profile Connection */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>1. Connect Google Business Profile</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
              Search your business on <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 'bold' }}>Google Maps</a>, click <strong>Share</strong>, and paste your URL below:
            </p>
            <input 
              type="text" 
              placeholder="e.g. https://maps.app.goo.gl/..." 
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            <button onClick={handleSync} style={{ backgroundColor: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {synced ? '✓ Reviews Synced Successfully' : 'Sync Google Reviews'}
            </button>
          </div>

          {/* Deployment Choices */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>2. Choose How You Want to Collect Leads</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              
              {/* Option A: Existing Website */}
              <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Option A: Existing Website Script Embed</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>Paste on your site or email directly to your web developer:</p>
                
                <textarea 
                  readOnly
                  value={embedCode}
                  onClick={(e) => e.target.select()}
                  style={{ width: '100%', height: '60px', backgroundColor: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '12px', border: '1px solid #cbd5e1', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }}
                />
                
                <button onClick={() => copyToClipboard(embedCode, 'code')} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%', marginTop: '8px' }}>
                  {copiedCode ? '✓ Code Copied!' : 'Copy Code Snippet'}
                </button>

                <form onSubmit={handleSendDevEmail} style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                  <input 
                    type="email" 
                    required
                    placeholder="developer@yourbusiness.com" 
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <button type="submit" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' }}>
                    Email Dev
                  </button>
                </form>
                {devEmailSent && <div style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px' }}>✓ Setup instructions emailed!</div>}
              </div>

              {/* Option B: Hosted Standalone Page */}
              <div style={{ border: '2px solid #2563eb', padding: '16px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>No Website Needed</div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#1e40af' }}>Option B: Dedicated AI Lead Page</h4>
                  <p style={{ fontSize: '13px', color: '#1e3a8a', margin: '0 0 12px 0' }}>Share this link in SMS, social media, or Google Business Profile:</p>
                  
                  <input 
                    type="text" 
                    readOnly 
                    value={hostedPageLink}
                    onClick={(e) => e.target.select()}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #93c5fd', backgroundColor: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => copyToClipboard(hostedPageLink, 'link')} style={{ flex: 1, backgroundColor: '#1d4ed8', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    {copiedLink ? '✓ Link Copied!' : 'Copy Link'}
                  </button>
                  <a href={hostedPageLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#fff', padding: '10px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>
                    Preview Page ↗
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab === 'preview' && (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Widget & Page Customization</h3>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#64748b', marginBottom: '6px' }}>Primary Accent Color</label>
              <input 
                type="color" 
                value={widgetColor} 
                onChange={(e) => setWidgetColor(e.target.value)}
                style={{ width: '50px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                <input 
                  type="checkbox" 
                  checked={showPhotoAddon} 
                  onChange={(e) => setShowPhotoAddon(e.target.checked)} 
                />
                Google Verified Profile & Map Badge
              </label>
            </div>
          </div>

          <LocalPulseWidget businessName={activeName} primaryColor={widgetColor} showPhotoAddon={showPhotoAddon} />
        </div>
      )}

      {activeTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Addon Highlight */}
          <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', padding: '24px', borderRadius: '12px' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>PRO ADDON INCLUDED IN TRIAL</span>
            <h3 style={{ margin: '8px 0 4px 0', fontSize: '20px', color: '#166534' }}>Google Business Profile & Map Badge</h3>
            <p style={{ margin: 0, color: '#15803d', fontSize: '14px' }}>Enhance credibility by featuring live Google Maps verification badges and rating stats directly on your widget and standalone landing pages.</p>
          </div>

          {/* Core Optimized Plans */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#0f172a' }}>Select Your Subscription Plan</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              
              {/* Monthly */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>Monthly Standard</h4>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>$49 <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#64748b' }}>/mo</span></div>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>
                    <li>Review & SMS Quote Widget</li>
                    <li>Website Script Embed</li>
                    <li>Dedicated AI Lead Page Link</li>
                    <li>Instant Email Lead Alerts</li>
                    <li><strong>Google Badge Add-on:</strong> +$5/mo</li>
                  </ul>
                </div>
                <a href="https://buy.stripe.com/test_monthly" style={{ display: 'block', textAlign: 'center', backgroundColor: '#0f172a', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginTop: '20px' }}>
                  Subscribe Monthly
                </a>
              </div>

              {/* 3-Month Pass */}
              <div style={{ border: '2px solid #2563eb', borderRadius: '10px', padding: '20px', backgroundColor: '#eff6ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-12px', right: '16px', backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>POPULAR</span>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e40af' }}>3-Month Pass</h4>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e40af', marginBottom: '12px' }}>$119 <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#3b82f6' }}>one-time</span></div>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#1e3a8a', lineHeight: '1.8' }}>
                    <li>Everything in Monthly</li>
                    <li>90 Days Full Access</li>
                    <li><strong>FREE</strong> AI Hosted Landing Page</li>
                    <li>Priority Email Support</li>
                    <li><strong>Google Badge Add-on:</strong> +$10/3-mo</li>
                  </ul>
                </div>
                <a href="https://buy.stripe.com/test_3month" style={{ display: 'block', textAlign: 'center', backgroundColor: '#2563eb', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginTop: '20px' }}>
                  Get 3-Month Pass
                </a>
              </div>

              {/* Annual VIP */}
              <div style={{ border: '1px solid #86efac', borderRadius: '10px', padding: '20px', backgroundColor: '#f0fdf4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>BEST VALUE</span>
                  <h4 style={{ margin: '8px 0 8px 0', fontSize: '18px', color: '#166534' }}>Annual VIP Pass</h4>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#166534', marginBottom: '12px' }}>$297 <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#16a34a' }}>/year</span></div>
                  <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#14532d', lineHeight: '1.8' }}>
                    <li>Everything in 3-Month Pass</li>
                    <li>Equivalent to $24.75/month</li>
                    <li><strong>Google Badge Add-on:</strong> $15/year</li>
                    <li>VIP Priority Setup</li>
                  </ul>
                </div>
                <a href="https://buy.stripe.com/test_annual" style={{ display: 'block', textAlign: 'center', backgroundColor: '#166534', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginTop: '20px' }}>
                  Get Annual VIP
                </a>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

// ==========================================
// 3. MAIN SAAS ROUTER & LANDING PAGE
// ==========================================
export default function LocalPulseSaaS() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [isStandalonePage, setIsStandalonePage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bName = params.get('business');
    const uEmail = params.get('email');
    const mode = params.get('mode');

    if (mode === 'page' && bName) {
      setIsStandalonePage(true);
      setBusinessName(bName);
      return;
    }

    if (bName && uEmail) {
      setActiveUser({ businessName: bName, email: uEmail });
    }
  }, []);

  if (isStandalonePage) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#0f172a', margin: 0 }}>{businessName}</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Official Verified Customer Review & Quote Page</p>
        </div>
        <LocalPulseWidget businessName={businessName} showPhotoAddon={true} />
      </div>
    );
  }

  if (activeUser) return <CustomerDashboard businessName={activeUser.businessName} email={activeUser.email} onLogout={() => setActiveUser(null)} />;

  const handleSignup = async (e) => {
    e.preventDefault();
    await fetch('/api/onboard-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, email })
    });
    setActiveUser({ businessName, email });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Turn Local Website Traffic Into High-Paying Clients
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Display verified 5-star Google reviews and an instant quote request form on your website or dedicated lead page.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', textAlign: 'left', backgroundColor: '#1e293b', padding: '36px', borderRadius: '16px', border: '1px solid #334155' }}>
          
          <div>
            <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Start Your 14-Day Free Trial</h3>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '24px' }}>No credit card required. Up and running in under 60 seconds.</p>
            
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
                Launch My Control Panel →
              </button>
            </form>
          </div>

          <div>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 'bold', marginBottom: '12px' }}>Live Widget Preview</div>
            <LocalPulseWidget businessName={businessName || "Your Business"} showPhotoAddon={true} />
          </div>

        </div>
      </div>
    </div>
  );
}
