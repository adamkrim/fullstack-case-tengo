export type Pagination = {
  skip: number;
  take: number;
};

export type DataPointSource = {
  pageNumber: number | null;
  docFilePath: string;
  originalChunkExtract: string;
};

export type EnrichedField<T> = {
  scrapedValue: T | null;
  dataPointSources: DataPointSource[];
  retreivedWithLLMValue: T;
};

export type BuyerLocation = {
  city: string;
  postalCode: string;
};

export type ExecutionLocation = {
  postalCode: string | null;
};

export type Buyer = {
  id: number;
  originalName: string;
  normalizedName: string;
  normalizedAliases: string[];
  postalCode: string;
  domainURL: string;
  logoURL: string | null;
  sources: unknown[];
  createdAt: string;
  updatedAt: string;
};

export type Interaction = {
  tenderId: number;
  decisionStatus: "TO_ANALYZE" | "REJECTED";
};

export type Tender = {
  id: number;
  title: string;
  cpvAsString: string[];
  cpvs: unknown[];
  category: "SERVICES" | "WORKS" | "SUPPLIES";
  status: "OPEN" | "CLOSED";
  publicationDate: string;
  responseDeadline: string;
  executionLocation: ExecutionLocation | null;
  buyerContact:
    | { location: BuyerLocation; contact?: never }
    | { contact: string; location?: never };
  estimatedValueInEur: number | null;
  estimatedValueInEurMeta: EnrichedField<number>;
  durationInMonth: number | null;
  durationInMonthMeta: EnrichedField<number>;
  buyer: Buyer;
  buyerName: string;
  dceRequestStatus: "WAITING" | "RECEIVED" | "REFUSED";
  isRenewal: boolean;
  markedAsRenewalAt: string | null;
  lots: unknown[];
  interaction: Interaction | null;
  isDurationInMonthLLMEnriched: boolean;
  isEstimatedValueInEurLLMEnriched: boolean;
  ragGenerability: {
    isGeneratable: boolean;
  };
  affectedStreamIds: number[];
};
