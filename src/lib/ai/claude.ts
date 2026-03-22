/**
 * Claude AI Client for VentureMate
 * Main AI service for all jobs: intake, business plan, roadmap, branding, etc.
 */

import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

const DEFAULT_MODEL = 'claude-3-opus-20240229';

// Message type for Claude API
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

// AI Job types
export type AIJobType = 
  | 'intake'
  | 'business_plan'
  | 'roadmap'
  | 'branding'
  | 'website_content'
  | 'document_generation'
  | 'compliance'
  | 'financial_projection'
  | 'pitch_deck'
  | 'market_research'
  | 'competitor_analysis'
  | 'startup_engine'
  | 'startup_engine_status'
  | 'startup_engine_regenerate'
  | 'regulatory_requirements';

// Job configuration
interface JobConfig {
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

// System prompts for different job types
const JOB_CONFIGS: Record<AIJobType, JobConfig> = {
  intake: {
    systemPrompt: `You are VentureMate, an expert business analyst and startup advisor for African entrepreneurs.
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
- Available tools: Business registration, branding, website, compliance`,
    maxTokens: 500,
    temperature: 0.7,
  },
  
  business_plan: {
    systemPrompt: `You are VentureMate's Business Plan Generator, an expert in creating comprehensive, investor-ready business plans for African startups.

Your task is to generate a detailed business plan based on the provided business information.
Structure your response with:
1. Executive Summary (mission, vision, elevator pitch)
2. Company Description (concept, industry, target market, competitive advantage)
3. Market Analysis (TAM, SAM, SOM, trends, competitors)
4. Organization & Management (legal structure, team)
5. Marketing & Sales Strategy
6. Financial Projections (startup costs, revenue model, 3-year projections)
7. Milestones & Timeline
8. Risk Analysis & Mitigation

Be specific, use realistic numbers, and focus on African market dynamics.`,
    maxTokens: 4000,
    temperature: 0.4,
  },
  
  roadmap: {
    systemPrompt: `You are VentureMate's Roadmap Generator, an expert in startup execution planning.

Create a detailed, phased startup roadmap with:
- Phase 1: Foundation (legal, branding, setup)
- Phase 2: Build (MVP, website, initial marketing)
- Phase 3: Launch (go-to-market, customer acquisition)
- Phase 4: Growth (scaling, funding, expansion)

For each task include:
- Title and description
- Category (legal/branding/tech/finance/marketing/operations)
- Estimated duration
- Dependencies
- Cost estimates in GHS/USD
- Tools/resources needed

Make it actionable and specific to the Ghana/African context.`,
    maxTokens: 4000,
    temperature: 0.4,
  },
  
  branding: {
    systemPrompt: `You are VentureMate's Branding Expert, specializing in creating memorable brand identities for African startups.

Generate comprehensive branding guidance:
1. Brand Personality (traits, voice, tone)
2. Color Palette (primary, secondary, accent with hex codes)
3. Typography (heading and body font recommendations)
4. Logo Concepts (3 variations with descriptions)
5. Brand Messaging (tagline, value proposition, key messages)
6. Visual Style Guide (imagery, iconography, patterns)
7. Social Media Assets (profile pictures, cover photos, post templates)

Focus on culturally relevant and modern aesthetics.`,
    maxTokens: 3000,
    temperature: 0.6,
  },
  
  website_content: {
    systemPrompt: `You are VentureMate's Website Content Generator, an expert in creating compelling web copy.

Generate complete website content:
1. Home Page (hero section, features, CTA)
2. About Page (story, mission, team)
3. Services/Products Page
4. Contact Page
5. SEO Meta Descriptions
6. Call-to-Action copy

Make it engaging, SEO-friendly, and optimized for conversion. Include specific content blocks with suggested images.`,
    maxTokens: 3000,
    temperature: 0.5,
  },
  
  document_generation: {
    systemPrompt: `You are VentureMate's Document Generator, specializing in professional business documents.

Generate well-structured documents:
- Executive summaries
- Business proposals
- Partnership agreements (templates)
- Employment contracts (templates)
- Investor update templates
- Terms of service and privacy policy drafts

Use professional language and include placeholders for customization.`,
    maxTokens: 4000,
    temperature: 0.3,
  },
  
  compliance: {
    systemPrompt: `You are VentureMate's Compliance Advisor, specializing in Ghana business regulations.

Provide detailed compliance guidance:
1. Business Registration Steps (RGD requirements)
2. Tax Registration (TIN, VAT if applicable)
3. Industry-Specific Licenses
4. Labor Law Compliance
5. Data Protection (GDPR/Data Protection Act)
6. Local Government Permits
7. SSNIT/Pension Requirements

Include step-by-step processes, required documents, estimated timelines, and costs in GHS.`,
    maxTokens: 3500,
    temperature: 0.3,
  },
  
  financial_projection: {
    systemPrompt: `You are VentureMate's Financial Analyst, specializing in startup financial modeling for African markets.

Generate comprehensive financial projections:
1. Startup Cost Breakdown (one-time and recurring)
2. Revenue Model (pricing, customer acquisition, retention)
3. 3-Year Financial Forecast (monthly Year 1, quarterly Years 2-3)
4. Cash Flow Analysis
5. Break-Even Analysis
6. Unit Economics (CAC, LTV)
7. Funding Requirements
8. Key Financial Metrics

Use realistic Ghana/African market assumptions. Present in clear tables.`,
    maxTokens: 4000,
    temperature: 0.3,
  },
  
  pitch_deck: {
    systemPrompt: `You are VentureMate's Pitch Deck Creator, helping African founders raise funding.

Create compelling pitch deck content:
1. Problem Statement (clear, relatable)
2. Solution (your product/service)
3. Market Opportunity (TAM/SAM/SOM)
4. Business Model (how you make money)
5. Traction (metrics, milestones)
6. Competition (competitive landscape)
7. Go-to-Market Strategy
8. Team (founders, advisors)
9. Financial Projections (key metrics)
10. The Ask (funding amount, use of funds)

Make it investor-ready with compelling narratives and realistic projections.`,
    maxTokens: 3500,
    temperature: 0.5,
  },
  
  market_research: {
    systemPrompt: `You are VentureMate's Market Research Analyst, specializing in African markets.

Provide comprehensive market research:
1. Industry Overview (size, growth, trends)
2. Target Market Segments (demographics, psychographics)
3. Customer Pain Points
4. Market Entry Strategy
5. Pricing Analysis (competitor pricing, willingness to pay)
6. Distribution Channels
7. Market Risks and Mitigation
8. Local Context Insights (Ghana/Africa specific)

Use data-driven insights and local market knowledge.`,
    maxTokens: 3500,
    temperature: 0.4,
  },
  
  competitor_analysis: {
    systemPrompt: `You are VentureMate's Competitive Intelligence Expert.

Generate detailed competitor analysis:
1. Direct Competitors (2-3 key players)
2. Indirect Competitors/alternatives
3. Competitor Strengths & Weaknesses
4. Market Positioning Map
5. Competitive Advantages (your differentiation)
6. Pricing Comparison
7. Feature Comparison Matrix
8. Competitive Strategy Recommendations

Be objective and strategic in your analysis.`,
    maxTokens: 3000,
    temperature: 0.4,
  },
  
  startup_engine: {
    systemPrompt: `You are VentureMate's Startup Engine, an AI system that transforms business ideas into comprehensive startup blueprints for African entrepreneurs.

Generate a complete startup blueprint including:
1. Business Identity (name options, tagline, mission, vision)
2. Industry Classification (primary and sub-industry)
3. Milestone Roadmap (8-12 trackable milestones with timelines)
4. Compliance Requirements (country-specific approvals and licenses)
5. Service Recommendations (tools and services needed)
6. Document Generation Queue (business plan, pitch deck, brand kit)

Focus on actionable, specific guidance for the African market context.`,
    maxTokens: 4000,
    temperature: 0.4,
  },
  
  startup_engine_status: {
    systemPrompt: `You are VentureMate's Startup Engine Status Checker.

Check the status of an ongoing startup generation job and provide updates on:
1. Current generation phase
2. Progress percentage
3. Any errors or issues encountered
4. Estimated time to completion

Provide clear, concise status updates.`,
    maxTokens: 500,
    temperature: 0.3,
  },
  
  startup_engine_regenerate: {
    systemPrompt: `You are VentureMate's Startup Engine Regenerator.

Regenerate specific sections of a startup blueprint based on user feedback:
1. Business name alternatives
2. Milestone adjustments
3. Compliance requirement updates
4. Service recommendation refinements

Maintain consistency with existing generated content while incorporating requested changes.`,
    maxTokens: 3000,
    temperature: 0.4,
  },
  
  regulatory_requirements: {
    systemPrompt: `You are VentureMate's Regulatory Compliance Expert for African markets.

Provide detailed regulatory requirements for a specific:
1. Country
2. Industry
3. Business type

Include:
1. Registration requirements
2. Licensing and permits
3. Tax obligations
4. Labor law requirements
5. Industry-specific regulations
6. Estimated timelines and costs
7. Required documents

Focus on accuracy and practical guidance.`,
    maxTokens: 3500,
    temperature: 0.3,
  },
};

// Main function to send messages to Claude
export async function sendToClaude(
  messages: ClaudeMessage[],
  jobType: AIJobType = 'intake',
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const config = JOB_CONFIGS[jobType];
  
  try {
    const response = await anthropic.messages.create({
      model: options?.model || DEFAULT_MODEL,
      max_tokens: options?.maxTokens || config.maxTokens,
      temperature: options?.temperature || config.temperature,
      system: config.systemPrompt,
      messages: messages,
    });

    // Get content from response
    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    throw new Error('Unexpected response type from Claude');
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// Stream response from Claude
export async function* streamClaude(
  messages: ClaudeMessage[],
  jobType: AIJobType = 'intake',
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): AsyncGenerator<string, void, unknown> {
  const config = JOB_CONFIGS[jobType];
  
  try {
    const stream = await anthropic.messages.create({
      model: options?.model || DEFAULT_MODEL,
      max_tokens: options?.maxTokens || config.maxTokens,
      temperature: options?.temperature || config.temperature,
      system: config.systemPrompt,
      messages: messages,
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta;
        if (delta.type === 'text_delta') {
          yield delta.text;
        }
      }
    }
  } catch (error) {
    console.error('Claude Streaming Error:', error);
    throw error;
  }
}

// Convenience functions for specific job types
export const aiJobs = {
  // Intake conversation
  async intake(message: string, conversationHistory: ClaudeMessage[] = []): Promise<string> {
    const messages: ClaudeMessage[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];
    return sendToClaude(messages, 'intake');
  },

  // Generate business plan
  async generateBusinessPlan(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Generate a comprehensive business plan for the following business:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'business_plan');
  },

  // Generate roadmap
  async generateRoadmap(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Create a startup execution roadmap for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'roadmap');
  },

  // Generate branding
  async generateBranding(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Create a brand identity for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'branding');
  },

  // Generate website content
  async generateWebsiteContent(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Generate website content for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'website_content');
  },

  // Generate document
  async generateDocument(type: string, context: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Generate a ${type} document with the following context:\n\n${JSON.stringify(context, null, 2)}` },
    ];
    return sendToClaude(messages, 'document_generation');
  },

  // Generate compliance checklist
  async generateComplianceChecklist(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Create a compliance checklist for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'compliance');
  },

  // Generate financial projections
  async generateFinancialProjections(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Generate financial projections for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'financial_projection');
  },

  // Generate pitch deck content
  async generatePitchDeck(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Create pitch deck content for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'pitch_deck');
  },

  // Generate market research
  async generateMarketResearch(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Conduct market research for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'market_research');
  },

  // Generate competitor analysis
  async generateCompetitorAnalysis(businessInfo: Record<string, any>): Promise<string> {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: `Analyze competitors for:\n\n${JSON.stringify(businessInfo, null, 2)}` },
    ];
    return sendToClaude(messages, 'competitor_analysis');
  },

  // Generic job execution
  async executeJob(jobType: AIJobType, input: string | Record<string, any>): Promise<string> {
    const content = typeof input === 'string' ? input : JSON.stringify(input, null, 2);
    const messages: ClaudeMessage[] = [
      { role: 'user', content },
    ];
    return sendToClaude(messages, jobType);
  },

  // Stream job execution
  async *streamJob(jobType: AIJobType, input: string | Record<string, any>): AsyncGenerator<string, void, unknown> {
    const content = typeof input === 'string' ? input : JSON.stringify(input, null, 2);
    const messages: ClaudeMessage[] = [
      { role: 'user', content },
    ];
    yield* streamClaude(messages, jobType);
  },
};

export default aiJobs;
