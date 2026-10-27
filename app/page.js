'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';

// ==========================================
// 1. EMBEDDABLE WIDGET & HOSTED LANDING PAGE
// ==========================================
export function LocalPulseWidget({ 
  businessName, 
  primaryColor = '#2563eb', 
  showPhotoAddon = true,
  specialOffer = '',
  customLogo = '',
  reviews = []
}) {
  const defaultReviews = [
    { author: "Sarah M.", rating: 5, text: "Outstanding service! Arrived promptly and fixed our issue cleanly." },
    { author: "David K.", rating: 5, text: "Fair pricing, reliable communication, and highly recommended!" },
    { author: "Michael R.", rating: 5, text: "Top-tier professionalism. Will definitely be a repeat customer." },
    { author: "Elena T.", rating: 5, text: "Extremely thorough, honest work, and transparent quotes." }
  ];

  // Filter incoming reviews to ONLY keep 4 or 5-star reviews (safety check against bad/negative scrapes)
  const rawActiveReviews = (reviews && reviews.length > 0) ? reviews : defaultReviews;
  const activeReviews = rawActiveReviews.filter(r => Number(r.rating) >= 4);

  const [expandedReviews, setExpandedReviews] = useState(false);
  const [leadQuestion, setLeadQuestion] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayedReviews = expandedReviews ? activeReviews : activeReviews.slice(0, 2);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadQuestion || !leadPhone) {
      alert("Please enter what you need help with and your phone number!");
      return;
    }
    
    setLoading(true);
    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadText: `Request: ${leadQuestion} | Phone: ${leadPhone}`, 
          businessName 
        })
      });
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '14px', maxWidth: '420px', margin: '0 auto', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      
      {/* Verified Google Header & Cover Photo Addon */}
      {showPhotoAddon && (
        <div style={{ backgroundColor: '#0f172a', padding: '16px', color: '#fff', textAlign: 'center', borderBottom: '3px solid #22c55e' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            {customLogo ? (
              <img src={customLogo} alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            ) : (
              <span style={{ backgroundColor: '#22c55e', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
            )}
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#86efac' }}>Verified Google Profile</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>{businessName || 'Your Business Name'}</h3>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>★★★★★ Verified Customer Feedback</div>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        
        {!showPhotoAddon && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{businessName || 'Your Business Name'}</h4>
            <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>★ Top Rated</span>
          </div>
        )}

        {/* Custom Writable Promo Block */}
        {specialOffer && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px dashed #2563eb', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#1e40af', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>
            🎁 <strong>Special Offer:</strong> {specialOffer}
          </div>
        )}

        {/* Dynamic Reviews Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {displayedReviews.length > 0 ? (
            displayedReviews.map((r, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: '600', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{r.author}</span>
                  <span style={{ color: '#eab308' }}>{'★'.repeat(Number(r.rating) || 5)}</span>
                </div>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>"{r.text}"</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '10px' }}>
              Loading verified reviews...
            </div>
          )}
        </div>

        {/* See More Reviews Button */}
        {activeReviews.length > 2 && (
          <button 
            onClick={() => setExpandedReviews(!expandedReviews)} 
            style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' }}
          >
            {expandedReviews ? 'Show Fewer Reviews ▲' : `See More Reviews (${activeReviews.length}) ▼`}
          </button>
        )}

        {/* Lead Capture Block with Generic Copy */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Get in Touch / Request Info:</p>
          {submitted ? (
            <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textAlign: 'center' }}>
              ✓ Request sent! We will text you shortly at {leadPhone}.
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="What service do you need done?" 
                value={leadQuestion}
                onChange={(e) => setLeadQuestion(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="tel" 
                  placeholder="Cell # for Fast Response" 
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <button type="submit" disabled={loading} style={{ backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 2. PRIVATE CLIENT DASHBOARD CONTROL PANEL
// ==========================================
function CustomerDashboard({ businessName, email, onLogout }) {
  const [googleUrl, setGoogleUrl] = useState('');
  const [widgetColor, setWidgetColor] = useState('#2563eb');
  const [specialOffer, setSpecialOffer] = useState('10% Off Your First Service Call!');
  const [liveReviews, setLiveReviews] = useState([]);
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [devEmail, setDevEmail] = useState('');
  const [devEmailSent, setDevEmailSent] = useState(false);
  const [synced, setSynced] = useState(false);
  const [showPhotoAddon, setShowPhotoAddon] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [leads] = useState([
    { id: 101, name: "Mark Thompson", phone: "(512) 555-0192", request: "Need quote for hot water heater replacement", date: "Today at 2:14 PM", status: "New Lead" },
    { id: 102, name: "Jessica Alba", phone: "(512) 555-0148", request: "Can I get an estimate for full driveway pressure washing?", date: "Yesterday at 4:30 PM", status: "Contacted" }
  ]);

  // Safely load from localStorage on client-side mount (avoids SSR window/localStorage errors)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedColor = localStorage.getItem('lp_color');
      const savedOffer = localStorage.getItem('lp_offer');
      const savedReviews = localStorage.getItem('lp_reviews');

      if (savedColor) setWidgetColor(savedColor);
      if (savedOffer) setSpecialOffer(savedOffer);
      if (savedReviews) {
        try {
          setLiveReviews(JSON.parse(savedReviews));
        } catch (e) {
          console.error('Error parsing stored reviews:', e);
        }
      }
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lp_color', widgetColor);
      localStorage.setItem('lp_offer', specialOffer);
    }
  }, [widgetColor, specialOffer]);

  const activeName = businessName || 'Your Business Name';
  const embedCode = `<script src="https://localpulse-ai-sute.vercel.app/widget.js" data-business="${encodeURIComponent(activeName)}" data-color="${widgetColor}"></script>`;
  const hostedPageLink = `https://localpulse-ai-sute.vercel.app/?business=${encodeURIComponent(activeName)}&mode=page`;

  const handleSync = async () => {
    if (!googleUrl) {
      alert("Please paste your Google Maps link or business name (e.g., 'Joe's Auto, Austin TX') first!");
      return;
    }
    
    try {
      const res = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleUrl, businessName: activeName })
      });
      
      const data = await res.json();
      
      if (data.success && data.reviews && data.reviews.length > 0) {
        setLiveReviews(data.reviews);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lp_reviews', JSON.stringify(data.reviews));
        }
        setSynced(true);
      } else {
        alert(`Sync Error: ${data.error || 'Could not retrieve reviews. Please check your query.'}`);
      }
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    }
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
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#0f172a' }}>{activeName} Portal</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Account Owner: <strong>{email || 'Demo Mode'}</strong> | <span style={{ color: '#16a34a', fontWeight: 'bold' }}>14-Day Free Trial Active</span></p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' }}>Log Out</button>
      </div>

      {/* Metrics Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Widget Impressions</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>148 Views</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Quote Requests Captured</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>12 Leads</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Conversion Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>8.1%</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('overview')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'overview' ? '#2563eb' : '#f1f5f9', color: activeTab === 'overview' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          1. Setup & Deployment
        </button>
        <button onClick={() => setActiveTab('inbox')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'inbox' ? '#2563eb' : '#f1f5f9', color: activeTab === 'inbox' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          2. Lead Activity Inbox 📩
        </button>
        <button onClick={() => setActiveTab('customize')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'customize' ? '#2563eb' : '#f1f5f9', color: activeTab === 'customize' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          3. Promo Banner & Customizer 🎁
        </button>
        <button onClick={() => setActiveTab('billing')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'billing' ? '#2563eb' : '#f1f5f9', color: activeTab === 'billing' ? '#fff' : '#475569', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          4. Plans & Billing 💳
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>1. Connect Google Business Profile</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
              Type your <strong>Business Name, City, State</strong> (e.g. <em>Joe's Auto Repair, Austin TX</em>) or paste your Google Maps link:
            </p>
            <input 
              type="text" 
              placeholder="e.g. Joe's Auto Repair, Austin TX" 
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            
            <button onClick={handleSync} style={{ backgroundColor: '#0f
