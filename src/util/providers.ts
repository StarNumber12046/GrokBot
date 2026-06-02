import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { createXai } from '@ai-sdk/xai';
import { createCerebras } from '@ai-sdk/cerebras';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModel } from 'ai';
import type { JSONObject } from '@ai-sdk/provider';

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
			return createGroq({ apiKey });
		case 'cerebras':
			return createCerebras({ apiKey });
		case 'xai':
			return createXai({ apiKey });
		case 'openrouter':
			return createOpenRouter({ apiKey });
	}
}

export function createModel(provider: ProviderId, apiKey: string, modelName?: string): LanguageModel {
	const prov = createProvider(provider, apiKey);
	const model = modelName ?? getDefaultModel(provider);
	return prov(model);
}

export function getWebSearchOptions(provider: ProviderId): Record<string, JSONObject> | undefined {
	if (provider !== 'openrouter') {
		return undefined;
	}
	return {
		openrouter: {
			plugins: [{ id: 'web', max_results: 5 }],
		},
	};
}
