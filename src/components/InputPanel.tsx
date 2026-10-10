import React, { useState } from 'react';

interface InputPanelProps {
  onRunAudit: (params: { creatorName: string; audienceSize: string; seedQueries: string[] }) => void;
  isLoading: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const PRESETS = [
  {
    label: 'The Slow Drift (Culture & Essay)',
    name: 'The Slow Drift',
    reach: '35,000 monthly listeners',
    seeds: ['A24', 'Phoebe Bridgers', 'Severance', 'Tartine Bakery'],
  },
  {
    label: 'The Dystopia Wire (Sci-Fi & Cinema)',
    name: 'The Dystopia Wire',
    reach: '50,000 subscribers',
    seeds: ['Severance', 'A24', 'Ex Machina', 'Radiohead'],
  },
  {
    label: 'Morning Sourdough (Specialty Food)',
    name: 'Morning Sourdough',
    reach: '22,000 newsletter readers',
    seeds: ['Tartine Bakery', 'Fellow Products', 'Alice Waters', 'Four Barrel Coffee'],
  },
];

export const InputPanel: React.FC<InputPanelProps> = ({
  onRunAudit,
  isLoading,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [creatorName, setCreatorName] = useState('The Slow Drift');
  const [audienceSize, setAudienceSize] = useState('35,000 monthly listeners');
  const [seeds, setSeeds] = useState<string[]>(['A24', 'Phoebe Bridgers', 'Severance', 'Tartine Bakery']);
  const [newSeedInput, setNewSeedInput] = useState('');

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setCreatorName(preset.name);
    setAudienceSize(preset.reach);
    setSeeds([...preset.seeds]);
  };

  const handleAddSeed = () => {
    const val = newSeedInput.trim();
    if (val && !seeds.includes(val)) {
      setSeeds([...seeds, val]);
      setNewSeedInput('');
    }
  };

  const handleRemoveSeed = (seedToRemove: string) => {
    setSeeds(seeds.filter((s) => s !== seedToRemove));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onRunAudit({ creatorName, audienceSize, seedQueries: seeds });
  };

  if (isCollapsed) {
    return (
      <section
        id="input-summary-bar"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-subtle)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: '6px' }}>
              Audience:
            </span>
            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{creatorName}</strong>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>({audienceSize})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Seeds:
            </span>
            {seeds.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                }}
              >
                ✦ {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            id="edit-profile-button"
            onClick={onToggleCollapse}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            ✏️ Edit Profile & Seeds
          </button>
          <button
            type="button"
            id="re-run-audit-button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: 'var(--accent-terracotta)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Running...' : '↻ Re-run Audit'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
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
            1. Define Audience Cultural Fingerprint
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Enter cultural anchors your audience loves (artists, directors, films, cafes, brands). Qloo's taste graph cross-references entities across cultural domains to uncover non-obvious sponsor matches.
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleApplyPreset(p)}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                backgroundColor: creatorName === p.name ? 'var(--accent-terracotta-light)' : 'var(--bg-primary)',
                color: creatorName === p.name ? 'var(--accent-terracotta)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: creatorName === p.name ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', marginBottom: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Publication or Creator Title
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                fontSize: '14px',
                backgroundColor: 'var(--bg-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Monthly Reach / Circulation
            </label>
            <input
              type="text"
              value={audienceSize}
              onChange={(e) => setAudienceSize(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                fontSize: '14px',
                backgroundColor: 'var(--bg-primary)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
            Audience Cultural Affinity Seeds (Input Entities)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            {seeds.map((seed) => (
              <span
                key={seed}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                }}
              >
                ✦ {seed}
                <button
                  type="button"
                  onClick={() => handleRemoveSeed(seed)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                    padding: 0,
                  }}
                  title="Remove seed"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add another cultural entity (e.g. Wes Anderson, Aesop, Bon Iver)..."
              value={newSeedInput}
              onChange={(e) => setNewSeedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSeed();
                }
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                fontSize: '13px',
                backgroundColor: 'var(--bg-primary)',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleAddSeed}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add Seed
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || seeds.length === 0}
          id="run-audit-button"
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: isLoading ? '#A8A29E' : 'var(--accent-terracotta)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.3px',
            cursor: isLoading ? 'default' : 'pointer',
            boxShadow: '0 2px 6px rgba(200, 90, 50, 0.3)',
            transition: 'background-color 0.15s ease',
          }}
        >
          {isLoading ? 'Running Taste Audit...' : 'Run Cultural Sponsorship Audit →'}
        </button>
      </form>
    </section>
  );
};
