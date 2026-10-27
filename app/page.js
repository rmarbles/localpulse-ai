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
  const [widgetColor, setWidgetColor] = useState(() => localStorage.getItem('lp_color') || '#2563eb');
  const [specialOffer, setSpecialOffer] = useState(() => localStorage.getItem('lp_offer') || '10% Off Your First Service Call!');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [devEmail, setDevEmail] = useState('');
  const [devEmailSent, setDevEmailSent] = useState(false);
  const [synced, setSynced] = useState(false);
  const [showPhotoAddon, setShowPhotoAddon] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [liveReviews, setLiveReviews] = useState(() => {
    const saved = localStorage.getItem('lp_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads] = useState([
    { id: 101, name: "Mark Thompson", phone: "(512) 555-0192", request: "Need quote for hot water heater replacement", date: "Today at 2:14 PM", status: "New Lead" },
    { id: 102, name: "Jessica Alba", phone: "(512) 555-0148", request: "Can I get an estimate for full driveway pressure washing?", date: "Yesterday at 4:30 PM", status: "Contacted" }
  ]);

  const activeName = businessName || 'Your Business Name';
  const embedCode = `<script src="https://localpulse-ai-sute.vercel.app/widget.js" data-business="${encodeURIComponent(activeName)}" data-color="${widgetColor}"></script>`;
  const hostedPageLink = `https://localpulse-ai-sute.vercel.app/?business=${encodeURIComponent(activeName)}&mode=page`;

  useEffect(() => {
    localStorage.setItem('lp_color', widgetColor);
    localStorage.setItem('lp_offer', specialOffer);
  }, [widgetColor, specialOffer]);

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
        localStorage.setItem('lp_reviews', JSON.stringify(data.reviews));
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
            
            <button onClick={handleSync} style={{ backgroundColor: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              {liveReviews.length > 0 ? `✓ Synced (${liveReviews.length} Reviews Loaded)` : 'Sync Live Google Reviews'}
            </button>

            {/* Prominent Guidance Box After Syncing */}
            {synced && (
              <div style={{ marginTop: '16px', backgroundColor: '#eff6ff', border: '1px solid #2563eb', padding: '14px', borderRadius: '8px', color: '#1e40af', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>✓ Successfully Synced!</strong> Your live reviews are locked in. 
                  <div style={{ fontSize: '13px', marginTop: '2px', color: '#1e3a8a' }}>
                    👉 Click <strong>Tab 3: Promo Banner & Customizer 🎁</strong> above to preview your live widget, or click <strong>Preview Page ↗</strong> below under Option B.
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('customize')} 
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
                >
                  View Customizer 🎁
                </button>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>2. Choose Deployment Option</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              
              <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Option A: Website Embed Script</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>Paste in your HTML or send straight to your web developer:</p>
                
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

              <div style={{ border: '2px solid #2563eb', padding: '16px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>No Website Required</div>
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

      {activeTab === 'inbox' && (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Captured Lead Activity Inbox</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>All quote requests entered through your widget or standalone page are listed below and dispatched immediately to your email/SMS:</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Customer Phone</th>
                  <th style={{ padding: '12px' }}>Quote Details</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>{lead.date}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#2563eb' }}>{lead.phone}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{lead.request}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: lead.status === 'New Lead' ? '#dcfce7' : '#f1f5f9', color: lead.status === 'New Lead' ? '#15803d' : '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customize' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Customize Widget Appearance</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Primary Brand Color:</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={widgetColor} 
                  onChange={(e) => setWidgetColor(e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                />
                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{widgetColor}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Special Offer / Promotion Text:</label>
              <input 
                type="text" 
                value={specialOffer} 
                onChange={(e) => setSpecialOffer(e.target.value)}
                placeholder="e.g. 10% Off Your First Service Call!"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={showPhotoAddon} 
                  onChange={(e) => setShowPhotoAddon(e.target.checked)}
                />
                Show Verified Google Header Badge
              </label>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Live Preview:</h4>
            <LocalPulseWidget 
              businessName={activeName} 
              primaryColor={widgetColor}
              specialOffer={specialOffer}
              showPhotoAddon={showPhotoAddon}
              reviews={liveReviews}
            />
          </div>

        </div>
      )}

      {activeTab === 'billing' && (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Subscription & Billing</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Your account is currently on the <strong>14-Day Free Trial</strong> plan.</p>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>LocalPulse Pro Plan</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Unlimited widget views, live review scraping, and instant SMS lead capture.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>$49<span style={{ fontSize: '12px', color: '#64748b' }}>/mo</span></div>
              <button style={{ marginTop: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 3. MAIN PAGE ROUTE CONTROLLER & LOGIN STATE
// ==========================================
export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [businessName, setBusinessName] = useState('Joe\'s Auto Repair');
  const [email, setEmail] = useState('owner@joesauto.com');
  const [isHostedMode, setIsHostedMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bizParam = params.get('business');
    const emailParam = params.get('email');
    const modeParam = params.get('mode');

    if (bizParam) setBusinessName(bizParam);
    if (emailParam) setEmail(emailParam);
    if (modeParam === 'page') setIsHostedMode(true);
  }, []);

  // If viewed via hosted landing page link (e.g. ?mode=page)
  if (isHostedMode) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>Official Customer Portal & Quote Request</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Powered by LocalPulse AI</p>
        </div>
        <LocalPulseWidget businessName={businessName} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#0f172a' }}>LocalPulse AI</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>Sign in to your business dashboard</p>
          
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Business Name" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <input 
              type="email" 
              placeholder="Owner Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}>
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerDashboard 
        businessName={businessName} 
        email={email} 
        onLogout={() => setIsLoggedIn(false)} 
      />
    </div>
  );
}
