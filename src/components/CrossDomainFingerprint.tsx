import React from 'react';

interface DomainItem {
  name: string;
  affinity: number;
  tags?: string[];
}

interface CrossDomainProps {
  domains: {
    music?: DomainItem[];
    cinema?: DomainItem[];
    dining_places?: DomainItem[];
    literature?: DomainItem[];
  };
}

export const CrossDomainFingerprint: React.FC<CrossDomainProps> = ({ domains }) => {
  if (!domains || Object.keys(domains).length === 0) return null;

  const categories = [
    { title: 'Music & Sound', icon: '🎧', items: domains.music || [] },
    { title: 'Cinema & Screen', icon: '🎬', items: domains.cinema || [] },
    { title: 'Dining & Specialty Cafes', icon: '☕', items: domains.dining_places || [] },
    { title: 'Literature & Essays', icon: '📖', items: domains.literature || [] },
  ];

  return (
    <section
      id="cross-domain-section"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontFamily: 'var(--text-serif)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-main)',
          }}
        >
          3. Audience Cross-Domain Cultural Fingerprint
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Qloo taste graph signals connecting audience affinities across literature, cinema, music, and physical places.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {categories.map((cat) => (
          <div
            key={cat.title}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span>{cat.icon}</span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{cat.title}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.name}
                    </div>
                    {item.tags && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.tags.slice(0, 2).join(' • ')}
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--text-mono)',
                      fontWeight: 600,
                      color: 'var(--accent-terracotta)',
                    }}
                  >
                    {(item.affinity * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
