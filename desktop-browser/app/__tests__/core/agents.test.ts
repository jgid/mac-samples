import { AGENTS, DEFAULT_AGENT_ID, getAgent } from '../../src/core/agents';
import type { AgentId } from '../../src/types';

describe('agents', () => {
  it('covers all ids exactly once', () => {
    const ids: AgentId[] = ['safari-mac', 'chrome-mac', 'chrome-win', 'edge-win', 'firefox-win'];
    expect(AGENTS.map((a) => a.id).sort()).toEqual([...ids].sort());
  });
  it('has plausible desktop identities', () => {
    for (const a of AGENTS) {
      expect(a.userAgent).toMatch(/^Mozilla\/5\.0 \((Macintosh|Windows NT)/);
      expect(a.userAgent).not.toMatch(/Mobile|iPhone/);
      expect(['MacIntel', 'Win32']).toContain(a.platform);
      expect(a.label).toMatch(/ auf (Mac|Windows)$/);
    }
    expect(getAgent('safari-mac').userAgent).toContain('Version/18');
    expect(getAgent('chrome-win').userAgent).toContain('Chrome/140');
    expect(getAgent('edge-win').userAgent).toContain('Edg/');
    expect(getAgent('firefox-win').userAgent).toContain('Firefox/143');
    expect(getAgent('safari-mac').vendor).toBe('Apple Computer, Inc.');
  });
  it('falls back to the default agent', () => {
    expect(getAgent('nope' as AgentId).id).toBe(DEFAULT_AGENT_ID);
  });
});
