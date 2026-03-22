/**
 * React Hooks for AI Service
 * Provides easy-to-use hooks for AI operations
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { AIJobType, ClaudeMessage } from '@/lib/ai/claude';

// Hook return type
interface UseAIResult {
  result: string | null;
  loading: boolean;
  error: string | null;
  execute: (jobType: AIJobType, input: string | Record<string, any>) => Promise<void>;
  reset: () => void;
}

// Streaming hook return type
interface UseAIStreamResult {
  result: string;
  loading: boolean;
  error: string | null;
  stream: (jobType: AIJobType, input: string | Record<string, any>) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for non-streaming AI requests
 */
export function useAI(): UseAIResult {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    jobType: AIJobType,
    input: string | Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType, input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI request failed');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setLoading(false);
    setError(null);
  }, []);

  return { result, loading, error, execute, reset };
}

/**
 * Hook for streaming AI requests
 */
export function useAIStream(): UseAIStreamResult {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (
    jobType: AIJobType,
    input: string | Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    setResult('');

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType, input }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                setResult(prev => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setResult('');
    setLoading(false);
    setError(null);
  }, []);

  return { result, loading, error, stream, reset };
}

/**
 * Hook for intake conversation
 */
interface UseIntakeResult {
  response: string | null;
  loading: boolean;
  error: string | null;
  sendMessage: (message: string, history?: ClaudeMessage[]) => Promise<void>;
  reset: () => void;
}

export function useIntake(): UseIntakeResult {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    history: ClaudeMessage[] = []
  ) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory: history }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Intake request failed');
      }

      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setLoading(false);
    setError(null);
  }, []);

  return { response, loading, error, sendMessage, reset };
}

/**
 * Hook for business plan generation
 */
interface UseBusinessPlanResult {
  plan: string | null;
  loading: boolean;
  error: string | null;
  generate: (businessInfo: Record<string, any>) => Promise<void>;
  stream: (businessInfo: Record<string, any>) => Promise<void>;
  streamedContent: string;
  reset: () => void;
}

export function useBusinessPlan(): UseBusinessPlanResult {
  const [plan, setPlan] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (businessInfo: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Plan generation failed');
      }

      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const stream = useCallback(async (businessInfo: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setStreamedContent('');

    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo, stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                setStreamedContent(prev => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlan(null);
    setStreamedContent('');
    setLoading(false);
    setError(null);
  }, []);

  return { plan, loading, error, generate, stream, streamedContent, reset };
}

/**
 * Hook for roadmap generation
 */
interface UseRoadmapResult {
  roadmap: string | null;
  loading: boolean;
  error: string | null;
  generate: (businessInfo: Record<string, any>) => Promise<void>;
  stream: (businessInfo: Record<string, any>) => Promise<void>;
  streamedContent: string;
  reset: () => void;
}

export function useRoadmap(): UseRoadmapResult {
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (businessInfo: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Roadmap generation failed');
      }

      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const stream = useCallback(async (businessInfo: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setRoadmap(null);
    setStreamedContent('');

    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo, stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                setStreamedContent(prev => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRoadmap(null);
    setStreamedContent('');
    setLoading(false);
    setError(null);
  }, []);

  return { roadmap, loading, error, generate, stream, streamedContent, reset };
}

/**
 * Hook for AI Startup Engine
 */
interface UseStartupEngineResult {
  blueprint: {
    business_identity: {
      business_name: string;
      alternative_names: string[];
      tagline: string;
      elevator_pitch: string;
      mission_statement: string;
      vision_statement: string;
    } | null;
    market_intelligence: {
      industry: string;
      sub_industry?: string;
      value_proposition: string;
      problem_statement: string;
      solution_description: string;
      target_customers: string;
      target_customer_description: string;
      market_size_estimate: string;
      competitive_advantage: string;
      key_challenges: string[];
    } | null;
    business_model: {
      primary_revenue_model: string;
      primary_model_description: string;
      secondary_revenue_models: { model: string; description: string }[];
    } | null;
    compliance_requirements: {
      country: string;
      registrations: {
        name: string;
        authority: string;
        timeline_days: number;
        cost_estimate: number;
        priority: number;
        documents_required: string[];
        condition?: string;
      }[];
      total_estimated_timeline: number;
      total_estimated_cost: number;
    } | null;
    ai_confidence: {
      overall_score: number;
      industry_classification: number;
      revenue_model: number;
      business_name: number;
    } | null;
    suggested_next_steps: string[];
  } | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  generationId: string | null;
  processStartup: (data: {
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
  }) => Promise<void>;
  checkStatus: (generationId: string) => Promise<void>;
  regenerateField: (field: string, startupId: string, context?: string) => Promise<any>;
  reset: () => void;
}

export function useStartupEngine(): UseStartupEngineResult {
  const [blueprint, setBlueprint] = useState<UseStartupEngineResult['blueprint']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [generationId, setGenerationId] = useState<string | null>(null);

  const processStartup = useCallback(async (data: {
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
  }) => {
    setLoading(true);
    setError(null);
    setStatus('processing');

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

      setGenerationId(result.data.generation_id);
      
      // Start polling for status
      pollStatus(result.data.generation_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('failed');
      setLoading(false);
    }
  }, []);

  const pollStatus = useCallback(async (genId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/v1/ai/status/${genId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || 'Status check failed');
        }

        if (result.data.status === 'completed') {
          setBlueprint(result.data.blueprint);
          setStatus('completed');
          setLoading(false);
        } else if (result.data.status === 'failed') {
          setError('Processing failed');
          setStatus('failed');
          setLoading(false);
        } else {
          // Still processing, poll again in 2 seconds
          setTimeout(() => checkStatus(), 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('failed');
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  const checkStatus = useCallback(async (genId: string) => {
    try {
      const response = await fetch(`/api/v1/ai/status/${genId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Status check failed');
      }

      if (result.data.status === 'completed') {
        setBlueprint(result.data.blueprint);
        setStatus('completed');
      } else {
        setStatus(result.data.status as any);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('failed');
    }
  }, []);

  const regenerateField = useCallback(async (field: string, startupId: string, context?: string) => {
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

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setBlueprint(null);
    setLoading(false);
    setError(null);
    setStatus('idle');
    setGenerationId(null);
  }, []);

  return {
    blueprint,
    loading,
    error,
    status,
    generationId,
    processStartup,
    checkStatus,
    regenerateField,
    reset,
  };
}

export default useAI;
