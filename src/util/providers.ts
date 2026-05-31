import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export type ProviderId = 'openai' | 'anthropic' | 'groq' | 'cerebras' | 'xai' | 'openrouter';

export type ProviderInfo = {
	id: ProviderId;
	label: string;
	defaultModel: string;
};

export const PROVIDERS: ProviderInfo[] = [
	{ id: 'openai', label: 'OpenAI', defaultModel: 'gpt-4o-mini' },
	{ id: 'anthropic', label: 'Anthropic', defaultModel: 'claude-sonnet-4-20250514' },
	{ id: 'groq', label: 'Groq', defaultModel: 'llama-3.3-70b-versatile' },
	{ id: 'cerebras', label: 'Cerebras', defaultModel: 'llama-3.3-70b' },
	{ id: 'xai', label: 'xAI', defaultModel: 'grok-2-1212' },
	{ id: 'openrouter', label: 'OpenRouter', defaultModel: 'openai/gpt-4o-mini' },
];

export function getDefaultModel(provider: ProviderId): string {
	const info = PROVIDERS.find((p) => p.id === provider);
	return info?.defaultModel ?? 'openai/gpt-4o-mini';
}

export function createProvider(provider: ProviderId, apiKey: string) {
	switch (provider) {
		case 'openai':
			return createOpenAI({ apiKey });
		case 'anthropic':
			return createAnthropic({ apiKey });
		case 'groq':
			return createOpenAICompatible({ name: 'groq', baseURL: 'https://api.groq.com/openai/v1', apiKey });
		case 'cerebras':
			return createOpenAICompatible({ name: 'cerebras', baseURL: 'https://api.cerebras.ai/v1', apiKey });
		case 'xai':
			return createOpenAICompatible({ name: 'xai', baseURL: 'https://api.x.ai/v1', apiKey });
		case 'openrouter':
			return createOpenAICompatible({ name: 'openrouter', baseURL: 'https://openrouter.ai/api/v1', apiKey });
	}
}

export function createModel(provider: ProviderId, apiKey: string, modelName?: string): LanguageModel {
	const prov = createProvider(provider, apiKey);
	const model = modelName ?? getDefaultModel(provider);
	return prov(model);
}
