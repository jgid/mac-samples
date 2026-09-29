// STUB – implemented by work package A.
import type { AgentId, AgentProfile } from '../types';

export const AGENTS: AgentProfile[] = [];
export const DEFAULT_AGENT_ID: AgentId = 'safari-mac';

export function getAgent(id: AgentId): AgentProfile {
  throw new Error('not implemented');
}
