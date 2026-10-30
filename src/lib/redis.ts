import { Redis } from "@upstash/redis";

// Link metadata can be generated locally without access to production Redis.
export const kv =
	(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
	(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
		? Redis.fromEnv()
		: undefined;
