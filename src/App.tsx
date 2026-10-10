import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ToolTracePanel } from './components/ToolTracePanel';
import { SponsorList } from './components/SponsorList';
import { CrossDomainFingerprint } from './components/CrossDomainFingerprint';
import { MediaKitAndPitches } from './components/MediaKitAndPitches';
import type { AuditResponse } from './types';

export const App: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMock, setIsMock] = useState<boolean>(true);
  const [selectedBrandPitch, setSelectedBrandPitch] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Initial load check
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsMock(Boolean(data.isMock));
      })
      .catch((err) => {
        console.warn('Could not reach health check:', err);
      });

    // Auto-run default audit on load for instant interactive demo
    handleRunAudit({
      creatorName: 'The Slow Drift',
      audienceSize: '35,000 monthly listeners',
      seedQueries: ['A24', 'Phoebe Bridgers', 'Severance', 'Tartine Bakery'],
    });
  }, []);

  const handleRunAudit = async (params: { creatorName: string; audienceSize: string; seedQueries: string[] }) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Audit API failed with status ${res.status}`);
      }

      const data: AuditResponse = await res.json();
      setAuditData(data);
      setIsMock(Boolean(data.isMock));
    } catch (err: any) {
      console.error('Audit execution error:', err);
      setErrorMsg(err.message || 'Failed to complete cultural taste audit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isMock={isMock} totalDurationMs={auditData?.totalDurationMs} />

      <main
        style={{
          flex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          padding: '24px 20px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Editorial Subheader */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <h2
            style={{
              fontFamily: 'var(--text-serif)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.3px',
            }}
          >
            Turn Audience Taste into Quantifiable Brand Partnerships
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Powered by <strong>Qloo's Taste Graph</strong> (250M+ cultural entities). Autonomous cross-domain signal resolution, empirical brand affinity ranking, and pitch letters with verified field citations.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              color: '#991B1B',
              fontSize: '13px',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Input Panel */}
        <InputPanel onRunAudit={handleRunAudit} isLoading={isLoading} />

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontFamily: 'var(--text-serif)', fontSize: '18px', fontWeight: 600 }}>
              Traversing Qloo Cultural Graph...
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Resolving entity seeds via /search → Ingesting /v2/insights → Computing affinity percentiles
            </div>
          </div>
        )}

        {/* Execution Results */}
        {!isLoading && auditData && (
          <>
            {/* 1. Live Tool Execution Trace */}
            <ToolTracePanel trace={auditData.toolTrace} />

            {/* 2. Ranked Sponsor Brands */}
            <SponsorList
              sponsors={auditData.rankedSponsors}
              onSelectSponsorForPitch={(brand) => {
                setSelectedBrandPitch(brand);
                const el = document.getElementById('media-kit-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. Cross-Domain Cultural Fingerprint */}
            <CrossDomainFingerprint domains={auditData.crossDomainFingerprint} />

            {/* 4. Cultural Media Kit & Cold Pitches */}
            <MediaKitAndPitches
              mediaKit={auditData.mediaKit}
              pitches={auditData.pitches}
              selectedBrandName={selectedBrandPitch}
            />
          </>
        )}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#FFFFFF',
          padding: '20px 28px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto' }}>
          <div>
            Built for the <strong>Qloo Agentic Hackathon: Agents, but with taste</strong>
          </div>
          <div>
            API: <code>https://hackathon.api.qloo.com</code> • Zero Hallucination Guarantee
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
