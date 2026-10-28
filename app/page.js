'use client';

export const dynamic = 'force-dynamic';
Indent size

Line wrap mode

Editing page.js file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71

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
  ctaText = 'Send Us a Direct Message:',
  reviews = [],
  onLeadCaptured
}) {
  const defaultReviews = [
    { author: "Sarah M.", rating: 5, text: "Outstanding service! Prompt, professional, and very accommodating." },
    { author: "David K.", rating: 5, text: "Fair pricing, reliable communication, and highly recommended!" },
    { author: "Michael R.", rating: 5, text: "Top-tier professionalism. Will definitely be a repeat customer." },
    { author: "Elena T.", rating: 5, text: "Extremely thorough, honest work, and transparent communication." }
  ];

  const positiveReviews = (reviews && reviews.length > 0)
    ? reviews.filter(r => (r.rating || 5) >= 4)
    : defaultReviews;

  const activeReviews = positiveReviews.length > 0 ? positiveReviews : defaultReviews;

  const [expandedReviews, setExpandedReviews] = useState(false);
  const [leadQuestion, setLeadQuestion] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayedReviews = expandedReviews ? activeReviews : activeReviews.slice(0, 2);

  const renderStars = (rating) => {
    const numStars = Math.min(5, Math.max(1, Math.round(rating || 5)));
    return '★'.repeat(numStars) + '☆'.repeat(5 - numStars);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadQuestion || !leadPhone) {
      alert("Please enter both your message/inquiry and phone number!");
      return;
    }
    
    setLoading(true);
    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadText: `Inquiry: ${leadQuestion} | Phone: ${leadPhone}`, 
          businessName 
        })
      });
      setSubmitted(true);
      if (onLeadCaptured) onLeadCaptured();
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', border: '1px solid #e2e8f0', borderRadius: '14px', maxWidth: '420px', margin: '0 auto', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      
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
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>★★★★★ Highly Rated on Google Maps</div>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        
        {!showPhotoAddon && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{businessName || 'Your Business Name'}</h4>
            <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>★ Highly Rated</span>
          </div>
        )}

        {specialOffer && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px dashed #2563eb', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#1e40af', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>
            🎁 <strong>Special Promotion:</strong> {specialOffer}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {displayedReviews.map((r, i) => (
            <div key={i} style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontWeight: '600', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                <span>{r.author}</span>
                <span style={{ color: '#eab308', letterSpacing: '1px' }}>{renderStars(r.rating)}</span>
              </div>
              <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>"{r.text}"</p>
            </div>
          ))}
        </div>

        {activeReviews.length > 2 && (
          <button 
            onClick={() => setExpandedReviews(!expandedReviews)} 
            style={{ width: '100%', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' }}
          >
            {expandedReviews ? 'Show Fewer Reviews ▲' : `See More Reviews (${activeReviews.length}) ▼`}
          </button>
        )}

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{ctaText || 'Send Us a Direct Message:'}</p>
          {submitted ? (
            <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textAlign: 'center' }}>
              ✓ Thank you! We have received your message and will text you shortly at {leadPhone}.
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="How can we help you today?" 
                value={leadQuestion}
                onChange={(e) => setLeadQuestion(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="tel" 
                  placeholder="Cell Phone #" 
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <button type="submit" disabled={loading} style={{ backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  {loading ? '...' : 'Send'}
                </button>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.2' }}>
                By submitting your phone number, you agree to receive SMS alerts. Msg & data rates may apply.
              </span>
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
  const [specialOffer, setSpecialOffer] = useState(() => localStorage.getItem('lp_offer') || 'Special Offer: Contact Us Today!');
  const [ctaText, setCtaText] = useState(() => localStorage.getItem('lp_cta') || 'Send Us a Direct Message:');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showPhotoAddon, setShowPhotoAddon] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('month');
  
  const [vipStatus, setVipStatus] = useState({ isVip: false, expiresAt: null });

  const [views, setViews] = useState(() => Number(localStorage.getItem('lp_views') || 148));
  const [leadsCount, setLeadsCount] = useState(() => Number(localStorage.getItem('lp_leads_count') || 12));

  const [liveReviews, setLiveReviews] = useState(() => {
    const saved = localStorage.getItem('lp_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads] = useState([
    { id: 101, name: "Mark Thompson", phone: "(512) 555-0192", request: "Inquiry regarding schedule and availability", date: "Today at 2:14 PM", status: "New Inquiry" },
    { id: 102, name: "Jessica Alba", phone: "(512) 555-0148", request: "Can I get pricing details for upcoming enrollment?", date: "Yesterday at 4:30 PM", status: "Contacted" }
  ]);

  const activeName = businessName || 'Your Business Name';
  const embedCode = `<iframe src="https://localpulse-ai-sute.vercel.app/?business=${encodeURIComponent(activeName)}&mode=page" width="100%" height="600px" style="border:none; border-radius:14px;"></iframe>`;
  const hostedPageLink = `https://localpulse-ai-sute.vercel.app/?business=${encodeURIComponent(activeName)}&mode=page`;

  useEffect(() => {
    if (email) {
      fetch('/api/check-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then(res => res.json())
        .then(data => setVipStatus(data))
        .catch(err => console.error("VIP Check error:", err));
    }
  }, [email]);

  useEffect(() => {
    localStorage.setItem('lp_color', widgetColor);
    localStorage.setItem('lp_offer', specialOffer);
    localStorage.setItem('lp_cta', ctaText);
    localStorage.setItem('lp_views', views);
    localStorage.setItem('lp_leads_count', leadsCount);
  }, [widgetColor, specialOffer, ctaText, views, leadsCount]);

  const handleResetMetrics = () => {
    if (confirm("Are you sure you want to reset your impression and lead analytics counters to zero?")) {
      setViews(0);
      setLeadsCount(0);
    }
  };

  const handleSync = async () => {
    const searchQuery = googleUrl || activeName;
    if (!searchQuery) {
      alert("Please enter your business name and city or paste your Google Maps link first!");
      return;
    }
    
    setSyncing(true);
    try {
      localStorage.removeItem('lp_reviews');
      setLiveReviews([]);

      const res = await fetch('/api/google-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleUrl: searchQuery, businessName: searchQuery })
      });
      
      const data = await res.json();
      
      if (data.success && data.reviews && data.reviews.length > 0) {
        setLiveReviews(data.reviews);
        localStorage.setItem('lp_reviews', JSON.stringify(data.reviews));
        setSynced(true);
      } else {
        alert(`Sync Notice: ${data.error || 'Could not retrieve reviews. Please check your spelling or Google link.'}`);
      }
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setSyncing(false);
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

  const conversionRate = views > 0 ? ((leadsCount / views) * 100).toFixed(1) : "0.0";

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', color: '#0f172a' }}>{activeName} Portal</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Account Owner: <strong>{email || 'Demo Mode'}</strong> | 
            <span style={{ color: vipStatus.isVip ? '#2563eb' : '#16a34a', fontWeight: 'bold', marginLeft: '6px' }}>
              {vipStatus.isVip ? `⭐ VIP Partner (${vipStatus.tier} - Expires ${vipStatus.expiresAt})` : '14-Day Free Trial Active'}
            </span>
          </p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' }}>Log Out</button>
      </div>

      {/* Performance Analytics Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Performance Analytics Overview</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)} 
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff' }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">Lifetime Total</option>
          </select>
          <button 
            onClick={handleResetMetrics} 
            style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#475569', fontWeight: 'bold' }}
          >
            Reset Stats ↺
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Widget Impressions</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>{views} Views</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Messages Captured</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginTop: '4px' }}>{leadsCount} Leads</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Conversion Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>{conversionRate}%</div>
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
              Type your <strong>Business Name, City, State</strong> (e.g. <em>Tatarus Gymnastics, Knoxville TN</em>) OR paste your direct <strong>Google Maps URL</strong>:
            </p>
            <input 
              type="text" 
              placeholder="e.g. Tatarus Gymnastics, Knoxville TN OR https://maps.google.com/..." 
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            
            <button 
              onClick={handleSync} 
              disabled={syncing}
              style={{ backgroundColor: syncing ? '#64748b' : '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: syncing ? 'not-allowed' : 'pointer', fontSize: '14px' }}
            >
              {syncing ? '⏳ Syncing Google Maps Profile...' : (synced ? `✓ Synced (${liveReviews.length} Verified Reviews)` : 'Sync Live Google Reviews')}
            </button>

            {synced && (
              <div style={{ marginTop: '16px', backgroundColor: '#eff6ff', border: '1px solid #2563eb', padding: '14px', borderRadius: '8px', color: '#1e40af', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>✓ Successfully Synced!</strong> Positive Google reviews locked in. 
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
                <h4 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>Option A: Website Embed iframe Code</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>Paste this iframe snippet into your website (immune to style conflicts):</p>
                
                <textarea 
                  readOnly
                  value={embedCode}
                  onClick={(e) => e.target.select()}
                  style={{ width: '100%', height: '60px', backgroundColor: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #cbd5e1', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }}
                />
                
                <button onClick={() => copyToClipboard(embedCode, 'code')} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%', marginTop: '8px' }}>
                  {copiedCode ? '✓ iframe Code Copied!' : 'Copy iframe Snippet'}
                </button>
              </div>

              <div style={{ border: '2px solid #2563eb', padding: '16px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>No Website Required</div>
                  <h4 style={{ margin: '0 0 6px 0', color: '#1e40af' }}>Option B: Dedicated AI Lead Page</h4>
                  <p style={{ fontSize: '13px', color: '#1e3a8a', margin: '0 0 12px 0' }}>Share this link in SMS, social media, or Google Business Profile:</p>
                  
                  <input 
                    type="text" 
                    read
