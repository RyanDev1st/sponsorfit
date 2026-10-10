import React, { useState } from 'react';
import type { ToolTraceStep } from '../types';

interface ToolTracePanelProps {
  trace: ToolTraceStep[];
}

export const ToolTracePanel: React.FC<ToolTracePanelProps> = ({ trace }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  if (!trace || trace.length === 0) return null;

  return (
    <section
      id="tool-trace-panel"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3
          style={{
            fontFamily: 'var(--text-serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🤖</span> Autonomous Agent Tool Execution Trace
        </h3>
        <span style={{ fontSize: '12px', fontFamily: 'var(--text-mono)', color: 'var(--text-muted)' }}>
          4 verified tool steps
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {trace.map((t) => {
          const isExpanded = expandedStep === t.step;
          return (
            <div
              key={t.step}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-primary)',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setExpandedStep(isExpanded ? null : t.step)}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-terracotta)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {t.step}
                  </span>
                  <code style={{ fontFamily: 'var(--text-mono)', fontWeight: 600, color: '#0369A1' }}>
                    {t.tool}()
                  </code>
                  <span style={{ color: 'var(--text-muted)' }}>— {t.summary}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--text-mono)', color: 'var(--text-muted)' }}>
                    ⏱ {t.latencyMs}ms
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderTop: '1px solid var(--border-light)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: 'var(--text-mono)',
                    color: '#334155',
                  }}
                >
                  <div style={{ marginBottom: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                    Tool Arguments:
                  </div>
                  <pre
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      overflowX: 'auto',
                      marginBottom: '8px',
                      fontSize: '11px',
                    }}
                  >
                    {JSON.stringify(t.args, null, 2)}
                  </pre>

                  {t.output && (
                    <>
                      <div style={{ marginBottom: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                        Tool Output:
                      </div>
                      <pre
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          overflowX: 'auto',
                          fontSize: '11px',
                        }}
                      >
                        {JSON.stringify(t.output, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
