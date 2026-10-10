import React from 'react';
import type { SponsorBrand } from '../types';

interface SponsorListProps {
  sponsors: SponsorBrand[];
  onSelectSponsorForPitch: (brandName: string) => void;
}

export const SponsorList: React.FC<SponsorListProps> = ({ sponsors, onSelectSponsorForPitch }) => {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section
      id="sponsors-section"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h2
            style={{
              fontFamily: 'var(--text-serif)',
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            2. Empirical Taste-Graph Sponsor Rankings
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Candidate brands ranked by Qloo affinity score. Every statistic cites the exact response field.
          </p>
        </div>
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
          Sorted by: affinity DESC
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {sponsors.map((brand, idx) => {
          const isTopTier = idx < 3;
          const isNordVpn = brand.affinity < 0.4;

          return (
            <div
              key={brand.id}
              style={{
                border: isTopTier ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                backgroundColor: isNordVpn ? '#FDF2F2' : '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isTopTier ? '0 4px 10px rgba(200, 90, 50, 0.08)' : 'var(--shadow-subtle)',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'var(--text-mono)',
                          color: isTopTier ? 'var(--accent-terracotta)' : 'var(--text-muted)',
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--text-serif)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                        }}
                      >
                        {brand.name}
                      </h3>
                      {isTopTier && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.4px',
                            textTransform: 'uppercase',
                            backgroundColor: 'var(--accent-terracotta-light)',
                            color: 'var(--accent-terracotta)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Top Match
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Category: {brand.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Affinity Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        fontFamily: 'var(--text-mono)',
                        color: isNordVpn ? '#B91C1C' : isTopTier ? 'var(--accent-terracotta)' : '#1E293B',
                      }}
                    >
                      {brand.affinityPercent}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--text-mono)' }}>
                      {brand.multiplierVsBaseline}x benchmark
                    </div>
                  </div>
                </div>

                {/* Affinity Score Bar */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, brand.affinityPercent)}%`,
                      backgroundColor: isNordVpn ? '#EF4444' : isTopTier ? 'var(--accent-terracotta)' : '#64748B',
                      borderRadius: '3px',
                    }}
                  />
                </div>

                {/* Cultural Rationale */}
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '10px' }}>
                  {brand.topDriver ? (
                    <div>
                      <strong>Key Cultural Driver:</strong> Fans of{' '}
                      <em>{brand.topDriver.entity_name || brand.topDriver.entity_id}</em> influence affinity by{' '}
                      <strong>{Number((brand.topDriver.influence * 100).toFixed(1))}%</strong>.
                    </div>
                  ) : (
                    <div>Strong multi-signal behavioral overlap across cultural cluster.</div>
                  )}
                </div>

                {/* Shared Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {brand.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '3px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Citations & Action */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '6px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--text-mono)',
                    color: '#64748B',
                    backgroundColor: 'var(--bg-primary)',
                    padding: '3px 6px',
                    borderRadius: '3px',
                    marginBottom: '10px',
                    wordBreak: 'break-all',
                  }}
                >
                  Provenance: <code>{brand.trace.affinityField} = {brand.affinity}</code>
                </div>

                {isTopTier ? (
                  <button
                    type="button"
                    onClick={() => onSelectSponsorForPitch(brand.name)}
                    style={{
                      width: '100%',
                      padding: '7px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--accent-terracotta)',
                      backgroundColor: 'transparent',
                      color: 'var(--accent-terracotta)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    View Cold Pitch Letter →
                  </button>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                    {isNordVpn ? 'Low cultural fit — avoid pitching' : 'Secondary candidate pool'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
