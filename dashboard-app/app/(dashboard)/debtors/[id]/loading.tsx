"use client";

export default function DebtorProfileLoading() {
  return (
    <>
      <div className="dp skeleton-container">
        {/* Top */}
        <div className="dp-top">
          <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '6px' }}></div>
          <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '4px' }}></div>
        </div>

        {/* Hero Grid */}
        <div className="dp-hero-grid">
          {/* Person Card Skeleton */}
          <div className="dp-person-card">
            <div className="dp-person-top">
              <div className="dp-avatar skeleton" style={{ border: 'none' }}></div>
              <div className="dp-person-info">
                <div className="skeleton" style={{ width: '200px', height: '28px', marginBottom: '12px', borderRadius: '6px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div className="dp-details-grid">
              <div className="dp-detail">
                <div className="skeleton" style={{ width: '60px', height: '12px', marginBottom: '8px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '100px', height: '16px', borderRadius: '4px' }}></div>
              </div>
              <div className="dp-detail">
                <div className="skeleton" style={{ width: '60px', height: '12px', marginBottom: '8px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }}></div>
              </div>
              <div className="dp-detail">
                <div className="skeleton" style={{ width: '60px', height: '12px', marginBottom: '8px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '110px', height: '16px', borderRadius: '4px' }}></div>
              </div>
              <div className="dp-detail dp-detail-full">
                <div className="skeleton" style={{ width: '60px', height: '12px', marginBottom: '8px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '100%', height: '16px', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          {/* Finance Card Skeleton */}
          <div className="dp-finance-card">
            <div className="dp-fin-row">
              <div className="dp-fin-item">
                <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '12px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '140px', height: '24px', borderRadius: '6px' }}></div>
              </div>
              <div className="dp-fin-item">
                <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '12px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '140px', height: '24px', borderRadius: '6px' }}></div>
              </div>
            </div>
            <div className="dp-fin-row">
              <div className="dp-fin-item">
                <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '12px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '140px', height: '24px', borderRadius: '6px' }}></div>
              </div>
              <div className="dp-fin-item">
                <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '12px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '140px', height: '24px', borderRadius: '6px' }}></div>
              </div>
            </div>
            <div className="dp-fin-risk-section">
              <div className="skeleton" style={{ width: '100px', height: '12px', marginBottom: '12px', borderRadius: '4px' }}></div>
              <div className="dp-fin-risk">
                <div className="skeleton" style={{ flex: 1, height: '10px', borderRadius: '5px' }}></div>
                <div className="skeleton" style={{ width: '30px', height: '16px', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="dp-grid">
          <div className="dp-main">
            {/* Tabs */}
            <div className="dp-tabs" style={{ display: 'flex', gap: '8px' }}>
               <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '10px' }}></div>
               <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '10px' }}></div>
               <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '10px' }}></div>
            </div>

            {/* Loan Card Skeleton */}
            <div className="dp-loan-card">
              <div className="dp-loan-head">
                 <div className="skeleton" style={{ width: '200px', height: '20px', borderRadius: '6px' }}></div>
                 <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '8px' }}></div>
              </div>
              <div className="dp-loan-body">
                <div className="dp-loan-stats">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="dp-ls">
                      <div className="skeleton" style={{ width: '100px', height: '12px', marginBottom: '8px', borderRadius: '4px' }}></div>
                      <div className="skeleton" style={{ width: '120px', height: '20px', borderRadius: '6px' }}></div>
                    </div>
                  ))}
                </div>
                <div className="dp-loan-info-table">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="dp-info-row" style={{ marginTop: '14px' }}>
                      <div className="skeleton" style={{ width: '120px', height: '14px', borderRadius: '4px' }}></div>
                      <div className="skeleton" style={{ width: '180px', height: '14px', borderRadius: '4px' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dp-side">
            <div className="dp-side-card">
              <div className="skeleton" style={{ width: '120px', height: '18px', marginBottom: '20px', borderRadius: '6px' }}></div>
              <div className="dp-actions">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ width: '100%', height: '46px', borderRadius: '12px' }}></div>
                ))}
              </div>
            </div>
            <div className="dp-side-card">
              <div className="skeleton" style={{ width: '120px', height: '18px', marginBottom: '20px', borderRadius: '6px' }}></div>
              <div className="dp-info-rows">
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '80px', height: '14px', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dp { max-width: 1200px; margin: 0 auto; padding-bottom: 80px; }
        .dp-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .dp-hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-bottom: 32px; }
        .dp-person-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 36px; }
        .dp-person-top { display: flex; align-items: center; gap: 28px; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .dp-avatar { width: 120px; height: 120px; border-radius: 30px; flex-shrink: 0; }
        .dp-person-info { flex: 1; }
        .dp-details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        .dp-detail-full { grid-column: 1 / -1; }
        
        .dp-finance-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 36px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
        .dp-fin-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px; }
        .dp-fin-risk-section { padding-top: 16px; border-top: 1px solid var(--border); }
        .dp-fin-risk { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
        
        .dp-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; }
        .dp-tabs { display: flex; gap: 6px; margin-bottom: 28px; background: var(--bg-card); padding: 6px; border-radius: 14px; border: 1px solid var(--border); width: fit-content; }
        
        .dp-loan-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; margin-bottom: 24px; overflow: hidden; }
        .dp-loan-head { padding: 18px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .dp-loan-body { padding: 28px; }
        .dp-loan-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px; }
        .dp-loan-info-table { border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 14px; }
        
        .dp-side-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 20px; }
        .dp-actions { display: flex; flex-direction: column; gap: 10px; }
        
        @media (max-width: 900px) {
          .dp-hero-grid { grid-template-columns: 1fr; }
          .dp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
