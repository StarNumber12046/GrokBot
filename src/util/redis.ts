import process from 'node:process';
import { Redis } from '@upstash/redis';
import type { ProviderId } from './providers.js';

export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_URL!,
	token: process.env.UPSTASH_REDIS_TOKEN!,
});

function userKeyKey(userId: string): string {
	return `keys:${userId}`;
}

function userModelKey(userId: string): string {
	return `models:${userId}`;
}

function userProviderKey(userId: string): string {
	return `provider:${userId}`;
}

function userEndpointKey(userId: string): string {
	return `endpoint:${userId}`;
}

export async function getUserApiKey(userId: string): Promise<string | null> {
	return redis.get<string>(userKeyKey(userId));
}

export async function setUserApiKey(userId: string, key: string): Promise<void> {
	await redis.set(userKeyKey(userId), key);
}

export async function getUserModel(userId: string): Promise<string | null> {
	return redis.get<string>(userModelKey(userId));
}

export async function setUserModel(userId: string, model: string): Promise<void> {
	await redis.set(userModelKey(userId), model);
}

export async function getUserProvider(userId: string): Promise<ProviderId | null> {
	return redis.get<ProviderId>(userProviderKey(userId));
}

export async function setUserProvider(userId: string, provider: ProviderId): Promise<void> {
	await redis.set(userProviderKey(userId), provider);
}

export async function getUserEndpoint(userId: string): Promise<string | null> {
	return redis.get<string>(userEndpointKey(userId));
}

export async function setUserEndpoint(userId: string, endpoint: string): Promise<void> {
	await redis.set(userEndpointKey(userId), endpoint);
}
