# VentureMate Technical Specification
## Complete Platform Architecture & Implementation Guide

**Version:** 1.0  
**Date:** March 2026  
**Stack:** Next.js 16+, PostgreSQL (Supabase), OpenAI, TypeScript

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Database Schema](#database-schema)
4. [Natural Language Intake System](#natural-language-intake-system)
5. [Draft Management & Auto-Save](#draft-management--auto-save)
6. [AI Processing Pipeline](#ai-processing-pipeline)
7. [Feature Modules](#feature-modules)
8. [API Architecture](#api-architecture)
9. [Frontend Architecture](#frontend-architecture)
10. [Development Phases](#development-phases)

---

## System Overview

### Core Concept
VentureMate transforms natural language business ideas into structured, actionable startup plans through AI processing, then provides tools to execute every step (branding, legal, web presence, funding).

### User Journey Flow
```
Landing Page → Auth → Natural Language Intake → AI Analysis →
Structured Plan Generation → Dashboard → Tool Execution → Launch
```

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  Next.js 16 (App Router) + TypeScript + Tailwind + Framer   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/WSS
┌──────────────────────▼──────────────────────────────────────┐
│                     API GATEWAY                             │
│  Next.js API Routes + tRPC + Rate Limiting + Auth Middleware │
└──────┬───────────────┬───────────────┬──────────────────────┘
       │               │               │
┌──────▼────┐   ┌──────▼─────┐   ┌─────▼──────┐
│   CORE    │   │    AI      │   │  EXTERNAL  │
│ SERVICES  │   │  SERVICES  │   │INTEGRATIONS│
│           │   │            │   │            │
│ • User    │   │ • OpenAI   │   │ • Paystack │
│ • Project │   │ • Claude   │   │ • RGD      │
│ • Draft   │   │ • Vector   │   │ • GRA      │
│ • Assets  │   │   DB       │   │ • Twilio   │
└─────┬─────┘   └──────┬─────┘   └─────┬──────┘
       │                │               │
       └────────────────┼───────────────┘
                        │
         ┌──────────────▼──────────────┐
         │         DATA LAYER          │
         │   PostgreSQL (Supabase)     │
         │   Redis / Upstash           │
         │   S3/Cloudflare R2          │
         └─────────────────────────────┘
```

---

## Authentication & Authorization

### Authentication Flow

#### 1. Registration Options
```typescript
// Supported auth methods
interface AuthConfig {
  methods: {
    emailPassword: boolean;      // Primary
    googleOAuth: boolean;        // Social
    phoneOTP: boolean;           // Mobile-first markets
    magicLink: boolean;          // Passwordless option
  };
  security: {
    mfa: boolean;                // Optional 2FA for sensitive actions
    sessionTimeout: number;      // 24 hours
    maxAttempts: number;         // 5 login attempts
  };
}
```

#### 2. JWT Implementation (Supabase Auth)
```typescript
// Supabase Auth handles JWT automatically
// Custom claims added via database triggers
interface VentureMateJWT {
  sub: string;           // userId (UUID v4)
  email: string;
  tier: 'free' | 'starter' | 'growth';
  projects: string[];    // Active project IDs
  iat: number;
  exp: number;           // 24h
}

// Session managed via Supabase Auth
interface SessionConfig {
  accessTokenExpiry: '1h';
  refreshTokenRotation: true;
  persistSession: true;
}
```

### Authorization Model (RBAC)
```typescript
// Role definitions
enum UserRole {
  FOUNDER = 'founder',           // Default
  ADMIN = 'admin',               // Internal
  SUPPORT = 'support',           // Customer service
  PARTNER = 'partner'            // Legal/accounting partners
}

// Permission matrix
const Permissions = {
  project: {
    create: ['founder', 'admin'],
    read: ['founder', 'admin', 'support'],
    update: ['founder'],
    delete: ['founder', 'admin'],
    share: ['founder', 'growth'],  // Growth tier only
  },
  documents: {
    generate: ['founder', 'starter', 'growth'],
    download: ['starter', 'growth'],
    customize: ['growth'],
  },
  compliance: {
    view: ['founder', 'starter', 'growth'],
    submit: ['starter', 'growth'],
    track: ['starter', 'growth'],
  }
} as const;
```

---

## Database Schema

### Core Entity Relationship Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CORE TABLES                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐          │
│  │    users     │◄────►│   profiles   │◄────►│  projects    │          │
│  │  (supabase)  │      │  (public)    │      │  (public)    │          │
│  └──────────────┘      └──────────────┘      └──────┬───────┘          │
│                                                     │                   │
│                           ┌─────────────────────────┼──────────┐       │
│                           │                         │          │       │
│                           ▼                         ▼          ▼       │
│                    ┌─────────────┐          ┌──────────┐  ┌─────────┐ │
│                    │   drafts    │          │roadmaps  │  │business │ │
│                    │  (public)   │          │(public)  │  │ plans   │ │
│                    └─────────────┘          └──────────┘  └─────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          FEATURE TABLES                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   tasks     │  │brand_assets │  │  websites   │  │  documents  │   │
│  │  (public)   │  │  (public)   │  │  (public)   │  │  (public)   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │compliance_  │  │conversations│  │   ai_usage  │  │subscriptions│   │
│  │  records    │  │  (public)   │  │  (public)   │  │  (public)   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Natural Language Intake System

### Core Philosophy
Transform unstructured founder ideas into structured business data through conversational AI, not forms.

### Intake Architecture

#### 1. Conversation Engine
```typescript
// Main intake session
interface IntakeSession {
  id: string;
  userId: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  startedAt: Date;
  lastInteractionAt: Date;
  currentStep: IntakeStep;
  collectedData: Partial<BusinessIdea>;
  conversationHistory: Message[];
  aiContext: AIContext;
}

// Conversation message
interface Message {
  id: string;
  role: 'system' | 'ai' | 'user' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    entities?: ExtractedEntity[];
    confidence?: number;
  };
}

// Steps in intake flow
enum IntakeStep {
  WELCOME = 'welcome',           // Greeting, explain process
  IDEA_CAPTURE = 'idea_capture', // Free-form description
  CLARIFICATION = 'clarification', // AI asks follow-ups
  BUSINESS_MODEL = 'business_model', // Revenue, customers
  MARKET = 'market',             // Industry, competition
  TEAM = 'team',                 // Solo or team, skills
  GOALS = 'goals',               // Timeline, funding needs
  REVIEW = 'review',             // Confirm understanding
  GENERATION = 'generation',     // Create plan (async)
}
```

#### 2. Natural Language Processing Pipeline
```typescript
interface NLPPipeline {
  stage1_preprocessing: {
    textCleaning: string;
    languageDetection: 'en' | 'tw' | 'ga' | 'other';
    translation?: string;
  };
  
  stage2_entityExtraction: {
    businessType: 'tech' | 'service' | 'retail' | 'food' | 'other';
    industry: string;
    targetMarket: string;
    valueProposition: string;
    geography: string;
    revenueModel: string;
  };
  
  stage3_intentClassification: {
    primaryIntent: 'start_business' | 'expand_business' | 'validate_idea';
    urgency: 'immediate' | '3months' | '6months' | 'exploring';
    complexity: 'simple' | 'moderate' | 'complex';
  };
  
  stage4_gapAnalysis: {
    missingInfo: string[];
    confidenceScore: number;
    suggestedQuestions: string[];
  };
}
```

#### 3. AI Prompt Engineering
```typescript
// System prompt for intake AI
const INTAKE_SYSTEM_PROMPT = `
You are VentureMate, an expert business analyst and startup advisor for African entrepreneurs.
Your job is to help founders articulate their business ideas through natural conversation.

RULES:
1. Ask ONE question at a time. Never bombard with multiple questions.
2. Use plain language. Avoid jargon unless the founder uses it first.
3. If the idea is vague, help clarify with examples, not criticism.
4. Acknowledge emotions - starting a business is exciting but scary.
5. When you have enough information (80% confidence), transition to generation.
6. Never make up information. If unsure, ask.
7. Keep responses under 3 sentences unless explaining complex concepts.

CONTEXT ABOUT THE USER:
- Location: Ghana (default), but ask if unclear
- Language: English, but support Twi phrases if used
- Experience level: Unknown, assume first-time founder
- Available tools: Business registration, branding, website, compliance
`;
```

---

## Draft Management & Auto-Save

### Auto-Save Architecture
```typescript
interface AutoSaveConfig {
  enabled: true;
  strategies: {
    timeBased: {
      interval: 30000;        // Save every 30 seconds
      maxRetries: 3;
    };
    eventBased: {
      triggers: ['blur', 'step_change', 'file_upload', 'ai_response'];
    };
    debounce: {
      inputDelay: 1000;       // 1 second after typing stops
    };
  };
  storage: {
    primary: 'server';        // PostgreSQL
    backup: 'localStorage';   // Offline support
    conflictResolution: 'server_wins';
  };
}

// Draft document structure
interface DraftDocument {
  id: string;
  userId: string;
  projectId?: string;
  type: 'intake' | 'business_plan' | 'pitch_deck' | 'website_content';
  
  content: {
    currentStep: string;
    formData: Record<string, any>;
    aiResponses: AIResponse[];
    userInputs: UserInput[];
    attachments: Attachment[];
    metadata: DraftMetadata;
  };
  
  version: number;
  status: 'auto_saved' | 'manual_saved' | 'submitted' | 'discarded';
  isComplete: boolean;
  completionPercentage: number;
  
  expiresAt: Date;            // Auto-delete after 30 days if abandoned
  createdAt: Date;
  updatedAt: Date;
}
```

### Conflict Resolution Strategy
```typescript
interface ConflictResolver {
  detectConflict: (local: Draft, server: Draft) => boolean;
  
  resolve: (local: Draft, server: Draft) => Draft {
    // Three-way merge strategy
    const base = findCommonAncestor(local, server);
    const localDiff = diff(base, local);
    const serverDiff = diff(base, server);
    
    // Apply non-conflicting changes
    const merged = applyChanges(base, localDiff, serverDiff);
    
    // Flag conflicts for user resolution
    if (hasConflicts(localDiff, serverDiff)) {
      return {
        ...merged,
        conflicts: generateConflictReport(localDiff, serverDiff)
      };
    }
    
    return merged;
  };
}
```

---

## AI Processing Pipeline

### Pipeline Architecture
```typescript
interface AIPipeline {
  // Input
  rawInput: BusinessIdea;
  
  // Stage 1: Analysis
  analyzer: {
    service: 'openai' | 'claude';
    model: 'gpt-4' | 'claude-3-opus';
    output: BusinessAnalysis;
    confidence: number;
  };
  
  // Stage 2: Research (optional)
  researcher: {
    webSearch: boolean;
    marketData: boolean;
    competitorAnalysis: boolean;
    output: MarketResearch;
  };
  
  // Stage 3: Generation
  generators: {
    businessPlan: BusinessPlanGenerator;
    roadmap: RoadmapGenerator;
    compliance: ComplianceGenerator;
    branding: BrandingGenerator;
    website: WebsiteGenerator;
    pitchDeck: PitchDeckGenerator;
  };
  
  // Stage 4: Review
  reviewer: {
    consistencyCheck: boolean;
    factChecker: boolean;
    qualityScore: number;
  };
}
```

### Business Plan Generation
```typescript
interface BusinessPlan {
  executiveSummary: {
    missionStatement: string;
    visionStatement: string;
    elevatorPitch: string;
    keyHighlights: string[];
  };
  
  companyDescription: {
    businessConcept: string;
    industryAnalysis: string;
    targetMarket: MarketSegment;
    competitiveAdvantage: string;
  };
  
  marketAnalysis: {
    tam: number;              // Total Addressable Market
    sam: number;              // Serviceable Addressable Market
    som: number;              // Serviceable Obtainable Market
    marketTrends: string[];
    competitorAnalysis: Competitor[];
  };
  
  organization: {
    legalStructure: 'sole_proprietorship' | 'partnership' | 'llc' | 'corporation';
    teamStructure: Role[];
    advisors: string[];
  };
  
  marketingSales: {
    customerAcquisition: Strategy[];
    salesChannels: string[];
    marketingBudget: Budget;
  };
  
  financialProjections: {
    startupCosts: CostBreakdown;
    revenueModel: RevenueStream[];
    projections: {
      year1: FinancialYear;
      year2: FinancialYear;
      year3: FinancialYear;
    };
    fundingRequirements: FundingNeed;
  };
  
  milestones: Milestone[];
  risks: Risk[];
}
```

### Roadmap Generation
```typescript
interface StartupRoadmap {
  projectId: string;
  generatedAt: Date;
  aiConfidence: number;
  
  phases: RoadmapPhase[];
  
  timeline: {
    estimatedLaunch: Date;
    totalDuration: string;
    criticalPath: string[];
  };
}

interface RoadmapPhase {
  id: string;
  name: string;
  order: number;
  status: 'locked' | 'active' | 'completed';
  
  tasks: RoadmapTask[];
  
  metrics: {
    estimatedDuration: string;
    completionPercentage: number;
    costEstimate: Money;
  };
}

interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'branding' | 'tech' | 'finance' | 'marketing' | 'operations';
  
  prerequisites: string[];
  unlocks: string[];
  
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo?: string;
  
  autoCompletable: boolean;
  autoCompleteAction?: AutoAction;
  
  tools: Tool[];
  templates: Template[];
  
  estimatedHours: number;
  dueDate?: Date;
}
```

---

## Feature Modules

### 1. Logo & Branding Generator
```typescript
interface BrandingEngine {
  input: {
    businessName: string;
    industry: string;
    description: string;
    targetAudience: string;
    personality: string[];
    colorPreferences?: string[];
  };
  
  colorGenerator: {
    primary: string;
    secondary: string;
    accent: string;
    neutrals: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  
  fontGenerator: {
    headingFont: GoogleFont;
    bodyFont: GoogleFont;
  };
  
  logoGenerator: {
    variations: number;
    formats: ['png', 'svg', 'pdf'];
  };
  
  deliverables: {
    logoPackage: LogoPackage;
    styleGuide: StyleGuide;
    socialMediaKits: SocialAssets;
  };
}
```

### 2. Website Builder
```typescript
interface WebsiteBuilder {
  businessProfile: BusinessProfile;
  branding: BrandAssets;
  content: GeneratedContent;
  
  templates: {
    id: string;
    category: 'service' | 'product' | 'portfolio' | 'saas';
    industry: string[];
    complexity: 'simple' | 'medium' | 'advanced';
  }[];
  
  deployment: {
    subdomain: string;
    customDomain?: string;
    ssl: true;
  };
}
```

### 3. Document Generation System
```typescript
interface DocumentEngine {
  formats: {
    pdf: PDFGenerator;
    docx: WordGenerator;
    pptx: PowerPointGenerator;
    xlsx: ExcelGenerator;
  };
  
  templates: {
    businessPlan: DocumentTemplate;
    pitchDeck: PresentationTemplate;
    financialModel: SpreadsheetTemplate;
    complianceChecklist: DocumentTemplate;
  };
  
  generators: {
    pitchDeck: PitchDeckGenerator;
    businessPlan: BusinessPlanGenerator;
    financialModel: FinancialModelGenerator;
  };
}
```

### 4. Compliance & Registration Module
```typescript
interface ComplianceEngine {
  jurisdiction: 'ghana' | 'nigeria' | 'kenya' | 'south_africa';
  
  structureAdvisor: {
    recommendation: BusinessStructure;
    rationale: string;
    alternatives: BusinessStructure[];
  };
  
  registration: {
    ghana: {
      rgd: RGDRegistration;
      gra: TaxRegistration;
      ssnit: PensionRegistration;
      localPermit: LocalGovernmentPermit;
    };
  };
  
  tracker: ComplianceDashboard;
}
```

### 5. Financial Tools
```typescript
interface FinancialEngine {
  calculator: {
    startupCosts: CostCategory[];
    revenueProjections: ProjectionScenarios;
    breakEvenAnalysis: BreakEven;
    cashFlow: CashFlowProjection;
    unitEconomics: UnitEconomics;
  };
  
  funding: {
    readinessScore: number;
    investorMaterials: InvestorMaterials;
    investorMatching: InvestorMatch[];
  };
}
```

---

## API Architecture

### API Structure
```
/api
├── /auth
│   ├── /register           POST
│   ├── /login              POST
│   ├── /logout             POST
│   ├── /magic-link         POST
│   └── /me                 GET
│
├── /projects
│   ├── /                   GET, POST
│   ├── /:id                GET, PATCH, DELETE
│   ├── /:id/duplicate      POST
│   └── /:id/share          POST
│
├── /intake
│   ├── /start              POST
│   ├── /:sessionId/message POST
│   ├── /:sessionId/stream  GET
│   └── /:sessionId/complete POST
│
├── /drafts
│   ├── /                   GET, POST
│   ├── /:id                GET, PATCH
│   └── /auto-save          POST
│
├── /ai
│   ├── /generate-plan      POST
│   ├── /generate-roadmap   POST
│   ├── /generate-logo      POST
│   └── /stream             GET
│
├── /branding
│   ├── /generate           POST
│   └── /assets             GET
│
├── /websites
│   ├── /                   POST
│   ├── /:id                GET, PATCH
│   ├── /:id/deploy         POST
│   └── /:id/preview        GET
│
├── /documents
│   ├── /generate           POST
│   ├── /:id                GET
│   └── /:id/download       GET
│
├── /compliance
│   ├── /checklist          GET
│   ├── /submit             POST
│   └── /status             GET
│
└── /payments
    ├── /initialize         POST
    ├── /verify             GET
    └── /webhook            POST
```

---

## Frontend Architecture

### App Router Structure
```
app/
├── (marketing)/
│   ├── page.tsx              # Landing page
│   ├── pricing/
│   ├── about/
│   └── layout.tsx
│
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx              # Projects list
│   ├── /projects/
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   ├── /plan/
│   │   │   ├── /roadmap/
│   │   │   ├── /branding/
│   │   │   ├── /website/
│   │   │   ├── /documents/
│   │   │   └── /compliance/
│   │   └── new/
│   │
│   ├── /intake/
│   │   └── page.tsx
│   │
│   ├── /settings/
│   └── /billing/
│
├── components/
│   ├── ui/                   # shadcn/ui
│   ├── chat/                 # Intake chat
│   ├── dashboard/
│   ├── branding/
│   └── website-builder/
│
├── hooks/
│   ├── useAutoSave.ts
│   ├── useIntake.ts
│   └── useAIStream.ts
│
└── lib/
    ├── db/                   # Supabase client
    ├── ai/                   # OpenAI client
    └── storage/
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-4)
- [x] Auth system (email + Google)
- [ ] Basic project creation
- [ ] Natural language intake (MVP)
- [ ] Simple business plan generation
- [ ] Dashboard shell
- [ ] Draft auto-save

### Phase 2: Core Tools (Weeks 5-8)
- [ ] AI roadmap generation
- [ ] Task management system
- [ ] Basic logo generator
- [ ] Document generation (PDF)
- [ ] Paystack integration
- [ ] Subscription tiers

### Phase 3: Execution (Weeks 9-12)
- [ ] Website builder (3 templates)
- [ ] Advanced branding kit
- [ ] Compliance checklist (Ghana)
- [ ] Pitch deck generator
- [ ] Financial model generator
- [ ] Team collaboration

### Phase 4: Scale (Weeks 13-16)
- [ ] Multi-country support
- [ ] Advanced AI features
- [ ] Marketplace integrations
- [ ] Mobile app
- [ ] API for partners
- [ ] White-label option

---

## Security Considerations

```typescript
interface SecurityConfig {
  authentication: {
    bcryptRounds: 12;
    jwtExpiry: '24h';
    refreshTokenRotation: true;
  };
  
  authorization: {
    rbac: true;
    auditLogging: true;
  };
  
  dataProtection: {
    encryptionAtRest: 'AES-256';
    encryptionInTransit: 'TLS 1.3';
    piiMasking: true;
  };
  
  apiSecurity: {
    rateLimiting: {
      window: '15m';
      maxRequests: 100;
    };
    inputValidation: 'zod';
  };
}
```

---

## Integration Ecosystem

### Payment: Paystack
```typescript
interface PaystackIntegration {
  initialize: (params: PaymentParams) => Promise<Transaction>;
  webhooks: {
    'charge.success': handlePaymentSuccess;
    'subscription.create': handleSubscriptionCreated;
  };
}
```

### AI: OpenAI + Claude
```typescript
interface AISuite {
  openai: OpenAIClient;
  anthropic: AnthropicClient;
  route: (task: AITask) => AIProvider;
  executeWithFallback: (prompt: string) => Promise<string>;
}
```

### Storage: Supabase Storage / R2
```typescript
interface StorageService {
  upload: (file: File, path: string) => Promise<string>;
  getSignedUrl: (key: string, expiry: number) => Promise<string>;
}
```

---

## Document Information

**Version:** 1.0  
**Last Updated:** March 2026  
**Author:** VentureMate Technical Team  
**Next Review:** April 2026

---

*This document covers the complete technical scope of VentureMate from authentication through natural language processing, draft management, AI generation, and all core business tools.*
