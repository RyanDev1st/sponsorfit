import React, { useState } from 'react';
import type { CulturalMediaKit, PitchLetter } from '../types';

interface MediaKitAndPitchesProps {
  mediaKit: CulturalMediaKit;
  pitches: PitchLetter[];
  selectedBrandName?: string;
}

export const MediaKitAndPitches: React.FC<MediaKitAndPitchesProps> = ({
  mediaKit,
  pitches,
  selectedBrandName,
}) => {
  const [activeTab, setActiveTab] = useState<'mediaKit' | 'pitches'>('mediaKit');
  const [selectedPitchIdx, setSelectedPitchIdx] = useState<number>(0);
  const [copyStatus, setCopyStatus] = useState<string>('');

  // If a brand was selected externally, switch to pitches tab and select that brand
  React.useEffect(() => {
    if (selectedBrandName) {
      const idx = pitches.findIndex((p) => p.brandName.toLowerCase() === selectedBrandName.toLowerCase());
      if (idx !== -1) {
        setSelectedPitchIdx(idx);
        setActiveTab('pitches');
      }
    }
  }, [selectedBrandName, pitches]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const currentPitch = pitches[selectedPitchIdx] || pitches[0];

  return (
    <section
      id="media-kit-section"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2
            style={{
              fontFamily: 'var(--text-serif)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            4. Generated Artifacts: Media Kit & Grounded Cold Pitches
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Every statistic is quantitatively sourced from Qloo taste graph responses with zero hallucinated figures.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: '3px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('mediaKit')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeTab === 'mediaKit' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'mediaKit' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeTab === 'mediaKit' ? 'var(--shadow-subtle)' : 'none',
            }}
          >
            📄 One-Page Cultural Media Kit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pitches')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeTab === 'pitches' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'pitches' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeTab === 'pitches' ? 'var(--shadow-subtle)' : 'none',
            }}
          >
            ✉️ Sponsor Pitch Letters ({pitches.length})
          </button>
        </div>
      </div>

      {/* TAB 1: MEDIA KIT */}
      {activeTab === 'mediaKit' && (
        <div
          style={{
            border: '1px solid var(--border-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            backgroundColor: '#FAF8F5',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--text-main)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--text-mono)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                AUDIENCE TASTE DOSSIER
              </span>
              <h3 style={{ fontFamily: 'var(--text-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 2px' }}>
                {mediaKit.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {mediaKit.subtitle}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Audience Reach</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--text-mono)', color: 'var(--text-main)' }}>
                {mediaKit.audienceReach}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(mediaKit, null, 2), 'Media kit copied to clipboard!')}
                style={{
                  marginTop: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copyStatus === 'Media kit copied to clipboard!' ? '✓ Copied JSON' : '📋 Copy JSON Spec'}
              </button>
            </div>
          </div>

          {/* Seed Cultural Profile */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Audience Cultural Seed Anchors
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {mediaKit.seedSignals.map((s) => (
                <span
                  key={s.qlooId}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  ✦ <strong>{s.name}</strong> <code style={{ fontSize: '10px', color: '#64748B' }}>({s.type.replace('urn:entity:', '')})</code>
                </span>
              ))}
            </div>
          </div>

          {/* Sponsor Affinity Index Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Empirical Sponsor Fit Tiers (Qloo Taste Graph)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-light)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 12px' }}>Rank</th>
                  <th style={{ padding: '8px 12px' }}>Brand</th>
                  <th style={{ padding: '8px 12px' }}>Qloo Affinity</th>
                  <th style={{ padding: '8px 12px' }}>Category Benchmark</th>
                  <th style={{ padding: '8px 12px' }}>Primary Cultural Driver</th>
                  <th style={{ padding: '8px 12px' }}>Field Citation</th>
                </tr>
              </thead>
              <tbody>
                {mediaKit.sponsorTiers.map((tier) => (
                  <tr key={tier.brand} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--accent-terracotta)', fontFamily: 'var(--text-mono)' }}>#{tier.rank}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{tier.brand}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, fontFamily: 'var(--text-mono)', color: 'var(--accent-terracotta)' }}>{tier.affinityFormatted}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{tier.affinityMultiplier}</td>
                    <td style={{ padding: '10px 12px', fontSize: '12px' }}>{tier.primaryCulturalDriver}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--text-mono)', fontSize: '10px', color: '#64748B' }}>
                      <code>{tier.fieldCitation}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Verified via Qloo API Taste Graph (v2/insights)</span>
            <span>Zero Hallucinated Metrics Guarantee</span>
          </div>
        </div>
      )}

      {/* TAB 2: PITCH LETTERS */}
      {activeTab === 'pitches' && (
        <div>
          {/* Brand Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {pitches.map((p, idx) => (
              <button
                key={p.brandName}
                type="button"
                onClick={() => setSelectedPitchIdx(idx)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedPitchIdx === idx ? '1px solid var(--accent-terracotta)' : '1px solid var(--border-light)',
                  backgroundColor: selectedPitchIdx === idx ? 'var(--accent-terracotta-light)' : '#FFFFFF',
                  color: selectedPitchIdx === idx ? 'var(--accent-terracotta)' : 'var(--text-main)',
                  fontWeight: selectedPitchIdx === idx ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Pitch: {p.brandName} ({(p.affinityScore * 100).toFixed(0)}%)
              </button>
            ))}
          </div>

          {/* Active Pitch Card */}
          {currentPitch && (
            <div
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject Line</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{currentPitch.subject}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(currentPitch.body, 'Pitch copied to clipboard!')}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: 'var(--accent-terracotta)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-subtle)',
                  }}
                >
                  {copyStatus === 'Pitch copied to clipboard!' ? '✓ Copied!' : '📋 Copy Pitch Email'}
                </button>
              </div>

              {/* Pitch Body */}
              <pre
                style={{
                  fontFamily: 'var(--text-sans)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#292524',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 18px',
                  marginBottom: '14px',
                }}
              >
                {currentPitch.body}
              </pre>

              {/* Field Provenance Badges */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Audited Qloo Response Field Citations
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentPitch.citations.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--text-mono)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        color: '#0369A1',
                      }}
                    >
                      🔗 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
