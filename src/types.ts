export interface SeedEntity {
  id: string;
  name: string;
  type: string;
  tags?: string[];
}

export interface SponsorBrand {
  id: string;
  name: string;
  affinity: number;
  affinityPercent: number;
  multiplierVsBaseline: number;
  category: string;
  tags: string[];
  topDriver?: {
    entity_id: string;
    entity_name?: string;
    influence: number;
  } | null;
  trace: {
    affinityField: string;
    affinityValue: number;
    categoryField: string;
    categoryValue: string;
    tagsField: string;
    tagsValue: string[];
    topSignalEntityId: string | null;
    topSignalInfluence: number | null;
    topSignalField: string | null;
  };
}

export interface ToolTraceStep {
  step: number;
  tool: string;
  args: Record<string, any>;
  argsSummary?: string;
  rowsReturned?: number;
  summary: string;
  latencyMs: number;
  isMock?: boolean;
  output?: any;
}

export interface PitchLetter {
  brandName: string;
  affinityScore: number;
  subject: string;
  body: string;
  citations: string[];
}

export interface CulturalMediaKit {
  title: string;
  subtitle: string;
  audienceReach: string;
  isMock: boolean;
  seedSignals: Array<{ name: string; type: string; qlooId: string }>;
  sponsorTiers: Array<{
    rank: number;
    brand: string;
    affinityScore: number;
    affinityFormatted: string;
    affinityMultiplier: string;
    category: string;
    sharedTags: string[];
    primaryCulturalDriver: string;
    fieldCitation: string;
  }>;
  crossDomainAffinities: {
    music?: Array<{ name: string; affinity: number; tags: string[] }>;
    cinema?: Array<{ name: string; affinity: number; tags: string[] }>;
    dining?: Array<{ name: string; affinity: number; tags: string[] }>;
    literature?: Array<{ name: string; affinity: number; tags: string[] }>;
  };
}

export interface AuditResponse {
  success: boolean;
  creatorName: string;
  audienceSize: string;
  isMock: boolean;
  totalDurationMs: number;
  toolTrace: ToolTraceStep[];
  resolvedEntities: SeedEntity[];
  rankedSponsors: SponsorBrand[];
  crossDomainFingerprint: Record<string, any>;
  mediaKit: CulturalMediaKit;
  pitches: PitchLetter[];
}
