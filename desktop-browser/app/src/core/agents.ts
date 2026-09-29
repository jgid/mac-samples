// Desktop browser identities ("Als … ausgeben") (work package A).
import type { AgentId, AgentProfile } from '../types';

const MAC = 'Macintosh; Intel Mac OS X 10_15_7';
const WIN = 'Windows NT 10.0; Win64; x64';

export const AGENTS: AgentProfile[] = [
  {
    id: 'safari-mac',
    label: 'Safari auf Mac',
    userAgent: `Mozilla/5.0 (${MAC}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15`,
    platform: 'MacIntel',
    vendor: 'Apple Computer, Inc.',
  },
  {
    id: 'chrome-mac',
    label: 'Chrome auf Mac',
    userAgent: `Mozilla/5.0 (${MAC}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36`,
    platform: 'MacIntel',
    vendor: 'Google Inc.',
  },
  {
    id: 'chrome-win',
    label: 'Chrome auf Windows',
    userAgent: `Mozilla/5.0 (${WIN}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36`,
    platform: 'Win32',
    vendor: 'Google Inc.',
  },
  {
    id: 'edge-win',
    label: 'Edge auf Windows',
    userAgent: `Mozilla/5.0 (${WIN}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0`,
    platform: 'Win32',
    vendor: 'Google Inc.',
  },
  {
    id: 'firefox-win',
    label: 'Firefox auf Windows',
    userAgent: `Mozilla/5.0 (${WIN}; rv:143.0) Gecko/20100101 Firefox/143.0`,
    platform: 'Win32',
    vendor: '',
  },
];

export const DEFAULT_AGENT_ID: AgentId = 'safari-mac';

/** Returns the profile for id; falls back to the default agent for unknown ids. */
export function getAgent(id: AgentId): AgentProfile {
  return AGENTS.find((a) => a.id === id) ?? AGENTS.find((a) => a.id === DEFAULT_AGENT_ID)!;
}
