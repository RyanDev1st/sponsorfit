import React from 'react';

interface HeaderProps {
  isMock: boolean;
  totalDurationMs?: number;
}

export const Header: React.FC<HeaderProps> = ({ isMock, totalDurationMs }) => {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: '#FFFFFF',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h1
            style={{
              fontFamily: 'var(--text-serif)',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.5px',
              color: 'var(--text-main)',
            }}
          >
            SponsorFit <span style={{ color: 'var(--accent-terracotta)', fontStyle: 'italic', fontWeight: 400 }}>AI</span>
          </h1>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--text-serif)',
              fontStyle: 'italic',
            }}
          >
            — Cultural Intelligence for Creator Sponsorships
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isMock && totalDurationMs !== undefined && totalDurationMs > 0 && (
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--text-mono)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            ⚡ {totalDurationMs}ms
          </span>
        )}

        {/* MOCK DATA / LIVE BADGE */}
        <div
          id="mode-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            backgroundColor: isMock ? '#FEF3C7' : '#DCFCE7',
            color: isMock ? '#92400E' : '#15803D',
            border: `1px solid ${isMock ? '#FDE68A' : '#BBF7D0'}`,
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isMock ? '#D97706' : '#16A34A',
            }}
          />
          {isMock ? 'MOCK DATA (PROVISIONING API KEY)' : 'QLOO LIVE CONNECTED'}
        </div>

        <a
          href="https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            border: '1px solid var(--border-light)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-primary)',
            transition: 'all 0.15s ease',
          }}
        >
          API Docs ↗
        </a>
      </div>
    </header>
  );
};
