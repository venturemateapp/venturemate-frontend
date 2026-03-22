/**
 * AI Service Layer for VentureMate
 * Provides high-level AI operations with error handling, caching, and usage tracking
 */

import aiJobs, { AIJobType, ClaudeMessage } from './claude';

// AI Service response interface
export interface AIServiceResponse<T = string> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    jobType: AIJobType;
    processingTime: number;
    tokensUsed?: number;
  };
}

// Business information interface
export interface BusinessInfo {
  name?: string;
  description?: string;
  industry?: string;
  targetMarket?: string;
  revenueModel?: string;
  location?: string;
  team?: string[];
  fundingNeeded?: number;
  timeline?: string;
  [key: string]: any;
}

// Main AI Service class
export class AIService {
  
  /**
   * Execute an AI job with error handling and metadata
   */
  static async execute<T = string>(
    jobType: AIJobType,
    input: string | Record<string, any>
  ): Promise<AIServiceResponse<T>> {
    const startTime = Date.now();
    
    try {
      const result = await aiJobs.executeJob(jobType, input);
      
      return {
        success: true,
        data: result as T,
        metadata: {
          jobType,
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error(`AI Service Error (${jobType}):`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI processing failed',
        metadata: {
          jobType,
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Stream an AI job
   */
  static async *stream(
    jobType: AIJobType,
    input: string | Record<string, any>
  ): AsyncGenerator<string, void, unknown> {
    try {
      yield* aiJobs.streamJob(jobType, input);
    } catch (error) {
      console.error(`AI Stream Error (${jobType}):`, error);
      throw error;
    }
  }

  // ============ INTAKE ============
  
  /**
   * Process intake conversation
   */
  static async processIntake(
    message: string,
    conversationHistory: ClaudeMessage[] = []
  ): Promise<AIServiceResponse<string>> {
    const startTime = Date.now();
    
    try {
      const result = await aiJobs.intake(message, conversationHistory);
      
      return {
        success: true,
        data: result,
        metadata: {
          jobType: 'intake',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Intake processing failed',
        metadata: {
          jobType: 'intake',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  // ============ BUSINESS PLAN ============
  
  /**
   * Generate comprehensive business plan
   */
  static async generateBusinessPlan(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('business_plan', businessInfo);
  }

  /**
   * Stream business plan generation
   */
  static async *streamBusinessPlan(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('business_plan', businessInfo);
  }

  // ============ ROADMAP ============
  
  /**
   * Generate startup roadmap
   */
  static async generateRoadmap(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('roadmap', businessInfo);
  }

  /**
   * Stream roadmap generation
   */
  static async *streamRoadmap(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('roadmap', businessInfo);
  }

  // ============ BRANDING ============
  
  /**
   * Generate brand identity
   */
  static async generateBranding(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('branding', businessInfo);
  }

  /**
   * Stream branding generation
   */
  static async *streamBranding(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('branding', businessInfo);
  }

  // ============ WEBSITE CONTENT ============
  
  /**
   * Generate website content
   */
  static async generateWebsiteContent(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('website_content', businessInfo);
  }

  /**
   * Stream website content generation
   */
  static async *streamWebsiteContent(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('website_content', businessInfo);
  }

  // ============ DOCUMENTS ============
  
  /**
   * Generate document content
   */
  static async generateDocument(
    type: string,
    context: Record<string, any>
  ): Promise<AIServiceResponse<string>> {
    const startTime = Date.now();
    
    try {
      const result = await aiJobs.generateDocument(type, context);
      
      return {
        success: true,
        data: result,
        metadata: {
          jobType: 'document_generation',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Document generation failed',
        metadata: {
          jobType: 'document_generation',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  // ============ COMPLIANCE ============
  
  /**
   * Generate compliance checklist
   */
  static async generateComplianceChecklist(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('compliance', businessInfo);
  }

  // ============ FINANCIAL ============
  
  /**
   * Generate financial projections
   */
  static async generateFinancialProjections(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('financial_projection', businessInfo);
  }

  /**
   * Stream financial projections
   */
  static async *streamFinancialProjections(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('financial_projection', businessInfo);
  }

  // ============ PITCH DECK ============
  
  /**
   * Generate pitch deck content
   */
  static async generatePitchDeck(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('pitch_deck', businessInfo);
  }

  /**
   * Stream pitch deck generation
   */
  static async *streamPitchDeck(
    businessInfo: BusinessInfo
  ): AsyncGenerator<string, void, unknown> {
    yield* this.stream('pitch_deck', businessInfo);
  }

  // ============ MARKET RESEARCH ============
  
  /**
   * Generate market research
   */
  static async generateMarketResearch(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('market_research', businessInfo);
  }

  // ============ COMPETITOR ANALYSIS ============
  
  /**
   * Generate competitor analysis
   */
  static async generateCompetitorAnalysis(
    businessInfo: BusinessInfo
  ): Promise<AIServiceResponse<string>> {
    return this.execute('competitor_analysis', businessInfo);
  }

  // ============ UTILITY ============
  
  /**
   * Check if AI service is available
   */
  static isAvailable(): boolean {
    return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
  }

  /**
   * Get available job types
   */
  static getAvailableJobs(): AIJobType[] {
    return [
      'intake',
      'business_plan',
      'roadmap',
      'branding',
      'website_content',
      'document_generation',
      'compliance',
      'financial_projection',
      'pitch_deck',
      'market_research',
      'competitor_analysis',
    ];
  }

  // ============ AI STARTUP ENGINE ============

  /**
   * Process startup through AI engine
   */
  static async processStartup(data: {
    business_id?: string;
    onboarding_data: {
      business_idea: string;
      country: string;
      founder_type: string;
      optional_context?: {
        target_customers?: string;
        industry?: string;
        revenue_model?: string;
      };
    };
  }): Promise<AIServiceResponse<{
    generation_id: string;
    status: string;
    estimated_time: number;
    message: string;
  }>> {
    const startTime = Date.now();

    try {
      const response = await fetch('/api/v1/ai/process-startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Processing failed');
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          jobType: 'startup_engine',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Startup processing failed',
        metadata: {
          jobType: 'startup_engine',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Check generation status
   */
  static async checkGenerationStatus(generationId: string): Promise<AIServiceResponse<{
    generation_id: string;
    status: string;
    blueprint?: any;
    created_at: string;
    completed_at?: string;
  }>> {
    const startTime = Date.now();

    try {
      const response = await fetch(`/api/v1/ai/status/${generationId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Status check failed');
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          jobType: 'startup_engine_status',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed',
        metadata: {
          jobType: 'startup_engine_status',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Regenerate a specific field
   */
  static async regenerateField(
    field: string,
    startupId: string,
    context?: string
  ): Promise<AIServiceResponse<any>> {
    const startTime = Date.now();

    try {
      const response = await fetch(`/api/v1/ai/regenerate/${field}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup_id: startupId, context }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Regeneration failed');
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          jobType: 'startup_engine_regenerate',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Regeneration failed',
        metadata: {
          jobType: 'startup_engine_regenerate',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Get regulatory requirements
   */
  static async getRegulatoryRequirements(
    countryCode: string,
    industry?: string
  ): Promise<AIServiceResponse<{
    country: string;
    industry?: string;
    requirements: any[];
  }>> {
    const startTime = Date.now();

    try {
      const query = industry ? `?industry=${encodeURIComponent(industry)}` : '';
      const response = await fetch(`/api/v1/ai/regulatory/${countryCode}${query}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to fetch requirements');
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          jobType: 'regulatory_requirements',
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch requirements',
        metadata: {
          jobType: 'regulatory_requirements',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }
}

export default AIService;
